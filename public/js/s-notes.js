/**
 * S Notes - Smart Notes v2
 * Hybrid storage: SQLite WASM (content + FTS), IndexedDB (metadata/settings), OPFS (attachments).
 * Block-based editor (Editor.js), Markdown preview (markdown-it + highlight.js), combined folder+tag filters.
 */

(function() {
  'use strict';

  // IndexedDB stores (metadata + SQLite persistence)
  var IDB_NAME = 's-notes-db';
  var IDB_VERSION = 2;
  var STORE_SQLITE = 'sqlite';
  var STORE_META = 'meta';
  var STORE_SETTINGS = 'settings';
  var STORE_FOLDERS_META = 'folders_meta';
  var STORE_TAGS_META = 'tags_meta';

  // App state
  var SQL = null;
  var sqliteDb = null;
  var editor = null;
  var md = null;
  var opfsRoot = null;
  var attachmentUrlCache = {};
  var saveTimeout = null;
  var persistTimeout = null;

  var state = {
    notes: [],
    folders: [],
    tags: [],
    currentNoteId: null,
    currentFolderId: null,
    currentTagId: null,
    search: ''
  };

  // DOM cache
  var elements = {};

  function SNotesApp() {
    init().catch(function(err) {
      console.error('Failed to boot S Notes', err);
    });
  }

  async function init() {
    cacheElements();
    bindStaticEvents();

    if (window.markdownit) {
      md = window.markdownit({ html: true, linkify: true, typographer: true, breaks: true });
    }

    await initIdb();
    await initSqlite();
    ensureSchema();
    await hydrateFromDb();
    await initEditor();
    refreshLists();

    if (state.notes.length) {
      selectNote(state.notes[0].id);
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /**
   * Cache DOM elements
   */
  function cacheElements() {
    elements = {
      searchInput: document.getElementById('s-notes-search'),
      newNoteBtn: document.getElementById('new-note-btn'),
      newFolderBtn: document.getElementById('new-folder-btn'),
      folderTree: document.getElementById('folder-tree'),
      tagList: document.getElementById('tag-list'),
      noteList: document.getElementById('note-list'),
      listTitle: document.getElementById('list-title'),
      editor: document.getElementById('editor'),
      noteTitle: document.getElementById('note-title'),
      noteTags: document.getElementById('note-tags'),
      noteFolder: document.getElementById('note-folder'),
      addTagBtn: document.getElementById('add-tag-btn'),
      deleteNoteBtn: document.getElementById('delete-note-btn'),
      detachBtn: document.getElementById('detach-btn'),
      importBtn: document.getElementById('import-btn'),
      exportBtn: document.getElementById('export-btn'),
      importFile: document.getElementById('import-file'),
      preview: document.getElementById('preview'),
      tagDialog: document.getElementById('tag-dialog'),
      tagInput: document.getElementById('tag-input'),
      tagCancel: document.getElementById('tag-cancel'),
      tagSubmit: document.getElementById('tag-submit'),
      folderDialog: document.getElementById('folder-dialog'),
      folderInput: document.getElementById('folder-input'),
      parentFolderSelect: document.getElementById('parent-folder-select'),
      folderCancel: document.getElementById('folder-cancel'),
      folderSubmit: document.getElementById('folder-submit'),
      navItems: document.querySelectorAll('.s-notes-nav-item')
    };
  }

  /**
   * IDB helpers
   */
  function initIdb() {
    return new Promise(function(resolve, reject) {
      var request = indexedDB.open(IDB_NAME, IDB_VERSION);

      request.onerror = function(event) {
        reject(event.target.error);
      };

      request.onsuccess = function(event) {
        resolve(event.target.result);
      };

      request.onupgradeneeded = function(event) {
        var db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_SQLITE)) db.createObjectStore(STORE_SQLITE);
        if (!db.objectStoreNames.contains(STORE_META)) db.createObjectStore(STORE_META, { keyPath: 'id' });
        if (!db.objectStoreNames.contains(STORE_SETTINGS)) db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
        if (!db.objectStoreNames.contains(STORE_FOLDERS_META)) db.createObjectStore(STORE_FOLDERS_META, { keyPath: 'id' });
        if (!db.objectStoreNames.contains(STORE_TAGS_META)) db.createObjectStore(STORE_TAGS_META, { keyPath: 'id' });
      };
    }).then(function(db) {
      window.sNotesIdb = db;
    });
  }

  function idbGet(store, key) {
    return new Promise(function(resolve, reject) {
      var tx = window.sNotesIdb.transaction([store], 'readonly');
      var req = tx.objectStore(store).get(key);
      req.onsuccess = function() { resolve(req.result); };
      req.onerror = function() { reject(req.error); };
    });
  }

  function idbPut(store, value, key) {
    return new Promise(function(resolve, reject) {
      var tx = window.sNotesIdb.transaction([store], 'readwrite');
      var req = typeof key === 'undefined' ? tx.objectStore(store).put(value) : tx.objectStore(store).put(value, key);
      req.onsuccess = function() { resolve(req.result); };
      req.onerror = function() { reject(req.error); };
    });
  }

  function idbGetAll(store) {
    return new Promise(function(resolve, reject) {
      var tx = window.sNotesIdb.transaction([store], 'readonly');
      var req = tx.objectStore(store).getAll();
      req.onsuccess = function() { resolve(req.result || []); };
      req.onerror = function() { reject(req.error); };
    });
  }

  /**
   * SQLite setup (sql.js)
   */
  async function initSqlite() {
    if (!window.initSqlJs) {
      throw new Error('sql.js is not loaded');
    }

    SQL = await window.initSqlJs({ locateFile: function(file) {
      return 'https://cdn.jsdelivr.net/npm/sql.js@1.10.2/dist/' + file;
    } });

    var persisted = await idbGet(STORE_SQLITE, 'db');
    if (persisted && persisted instanceof ArrayBuffer) {
      sqliteDb = new SQL.Database(new Uint8Array(persisted));
    } else {
      sqliteDb = new SQL.Database();
    }
  }

  function ensureSchema() {
    var ddl = [
      'CREATE TABLE IF NOT EXISTS folders (id TEXT PRIMARY KEY, name TEXT NOT NULL, parent_id TEXT, created_at TEXT)',
      'CREATE TABLE IF NOT EXISTS tags (id TEXT PRIMARY KEY, name TEXT NOT NULL, color TEXT NOT NULL)',
      'CREATE TABLE IF NOT EXISTS notes (id TEXT PRIMARY KEY, title TEXT, content_json TEXT NOT NULL, content_text TEXT NOT NULL, folder_id TEXT, created_at TEXT, updated_at TEXT)',
      'CREATE TABLE IF NOT EXISTS note_tags (note_id TEXT, tag_id TEXT, PRIMARY KEY(note_id, tag_id))',
      'CREATE TABLE IF NOT EXISTS attachments (id TEXT PRIMARY KEY, note_id TEXT, file_name TEXT, mime_type TEXT, opfs_path TEXT, created_at TEXT)',
      'CREATE VIRTUAL TABLE IF NOT EXISTS notes_fts USING fts5(title, content_text, content_json, content=\'notes\', content_rowid=\'rowid\')',
      'CREATE TRIGGER IF NOT EXISTS notes_ai AFTER INSERT ON notes BEGIN INSERT INTO notes_fts(rowid, title, content_text, content_json) VALUES (new.rowid, new.title, new.content_text, new.content_json); END;',
      'CREATE TRIGGER IF NOT EXISTS notes_au AFTER UPDATE ON notes BEGIN UPDATE notes_fts SET title=new.title, content_text=new.content_text, content_json=new.content_json WHERE rowid=old.rowid; END;',
      'CREATE TRIGGER IF NOT EXISTS notes_ad AFTER DELETE ON notes BEGIN DELETE FROM notes_fts WHERE rowid=old.rowid; END;'
    ];

    ddl.forEach(function(sql) {
      sqliteDb.run(sql);
    });
    persistDbSoon();
  }

  async function hydrateFromDb() {
    state.folders = queryAll('SELECT id, name, parent_id AS parentId, created_at AS createdAt FROM folders');
    state.tags = queryAll('SELECT id, name, color FROM tags');
    state.notes = loadNotesFromSql();
  }

  function queryAll(sql, params) {
    var stmt = sqliteDb.prepare(sql, params || []);
    var rows = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();
    return rows;
  }

  function loadNotesFromSql() {
    var stmt = sqliteDb.prepare('SELECT n.id, n.title, n.folder_id AS folderId, n.created_at AS createdAt, n.updated_at AS updatedAt, n.content_json AS contentJson, n.content_text AS contentText, GROUP_CONCAT(nt.tag_id) AS tags FROM notes n LEFT JOIN note_tags nt ON nt.note_id = n.id GROUP BY n.id ORDER BY n.updated_at DESC');
    var rows = [];
    while (stmt.step()) {
      var row = stmt.getAsObject();
      row.tags = row.tags ? row.tags.split(',') : [];
      rows.push(row);
    }
    stmt.free();
    return rows;
  }

  function persistDbSoon() {
    // Slight debounce to batch writes
    clearTimeout(persistTimeout);
    persistTimeout = setTimeout(persistDb, 200);
  }

  function persistDb() {
    if (!sqliteDb) return;
    var data = sqliteDb.export();
    return idbPut(STORE_SQLITE, data.buffer || data, 'db').catch(function(err) {
      console.error('Persist DB failed', err);
    });
  }

  /**
   * Editor setup
   */
  async function initEditor() {
    if (!window.EditorJS) {
      throw new Error('Editor.js not loaded');
    }

    editor = new window.EditorJS({
      holder: elements.editor,
      autofocus: true,
      placeholder: elements.editor.dataset ? elements.editor.dataset.placeholder || '' : '',
      onChange: function() {
        scheduleSave();
      },
      tools: {
        header: window.Header,
        list: { class: window.List, inlineToolbar: true },
        checklist: { class: window.Checklist, inlineToolbar: true },
        code: window.CodeTool,
        image: {
          class: window.ImageTool,
          config: {
            uploader: {
              uploadByFile: uploadAttachment
            }
          }
        }
      }
    });
  }

  /**
   * Static event bindings (UI level)
   */
  function bindStaticEvents() {
    // Search with debounce and SQLite FTS
    var debounceTimer = null;
    elements.searchInput.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function() {
        state.search = elements.searchInput.value.trim();
        renderNoteList();
      }, 120);
    });

    elements.newNoteBtn.addEventListener('click', function() {
      createNote();
    });

    elements.newFolderBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      showFolderDialog();
    });

    elements.noteTitle.addEventListener('input', function() {
      if (!state.currentNoteId) return;
      scheduleSave();
    });

    elements.noteFolder.addEventListener('change', function() {
      if (!state.currentNoteId) return;
      scheduleSave();
    });

    elements.deleteNoteBtn.addEventListener('click', function() {
      if (state.currentNoteId) deleteNote(state.currentNoteId);
    });

    elements.detachBtn.addEventListener('click', function() {
      detachNote();
    });

    elements.importBtn.addEventListener('click', function() {
      elements.importFile.click();
    });

    elements.importFile.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        importNotes(this.files[0]);
        this.value = '';
      }
    });

    elements.exportBtn.addEventListener('click', function() {
      exportNotes();
    });

    elements.tagCancel.addEventListener('click', function() {
      elements.tagDialog.close();
    });

    elements.tagDialog.querySelector('form').addEventListener('submit', function(e) {
      e.preventDefault();
      var tagName = elements.tagInput.value.trim();
      if (tagName) {
        createTag(tagName).then(function(tag) {
          addTagToCurrent(tag.id);
          elements.tagDialog.close();
        });
      }
    });

    elements.folderCancel.addEventListener('click', function() {
      elements.folderDialog.close();
    });

    elements.folderDialog.querySelector('form').addEventListener('submit', function(e) {
      e.preventDefault();
      var name = elements.folderInput.value.trim();
      var parent = elements.parentFolderSelect.value || null;
      if (name) {
        createFolder(name, parent).then(function() {
          elements.folderDialog.close();
        });
      }
    });

    elements.addTagBtn.addEventListener('click', function() {
      showTagDialog();
    });
  }

  /**
   * Note CRUD
   */
  async function createNote() {
    var id = generateId();
    var now = new Date().toISOString();
    var emptyDoc = { time: Date.now(), blocks: [], version: '2.30.7' };

    sqliteDb.run('INSERT INTO notes (id, title, content_json, content_text, folder_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      id,
      '',
      JSON.stringify(emptyDoc),
      '',
      state.currentFolderId,
      now,
      now
    ]);

    state.notes = loadNotesFromSql();
    persistDbSoon();
    await idbPut(STORE_META, { id: id, title: '', content_text: '', folder_id: state.currentFolderId, updated_at: now });
    await selectNote(id);
    renderNoteList();
    if (elements.noteTitle) elements.noteTitle.focus();
  }

  async function deleteNote(noteId) {
    var i18n = window.sNotesI18n || {};
    if (!confirm(i18n.delete_confirm || 'Delete this note?')) return;

    sqliteDb.run('DELETE FROM note_tags WHERE note_id = ?', [noteId]);
    sqliteDb.run('DELETE FROM attachments WHERE note_id = ?', [noteId]);
    sqliteDb.run('DELETE FROM notes WHERE id = ?', [noteId]);
    persistDbSoon();
    state.notes = state.notes.filter(function(n) { return n.id !== noteId; });
    if (state.currentNoteId === noteId) {
      state.currentNoteId = null;
      elements.noteTitle.value = '';
      elements.preview.innerHTML = '';
      if (editor) {
        editor.isReady.then(function(){ editor.blocks.clear(); });
      }
    }
    renderNoteList();
  }

  async function selectNote(noteId) {
    var note = state.notes.find(function(n) { return n.id === noteId; });
    if (!note) return;
    state.currentNoteId = noteId;
    elements.noteTitle.value = note.title || '';
    elements.noteFolder.value = note.folderId || '';
    renderNoteTags(note.tags);
    highlightActiveNote(noteId);

    var parsed = safeParse(note.contentJson) || { blocks: [] };
    if (parsed.blocks) {
      await hydrateBlocksAssets(parsed.blocks);
    }

    if (editor) {
      await editor.isReady;
      await editor.render(parsed);
      updatePreview();
    }
  }

  async function hydrateBlocksAssets(blocks) {
    var tasks = (blocks || []).map(async function(block) {
      if (block.type === 'image') {
        var path = (block.data && block.data.file && block.data.file.path) || (block.data && block.data.path);
        if (path) {
          var url = await attachmentUrlFromPath(path);
          block.data.file = { url: url, path: path };
        }
      }
    });
    await Promise.all(tasks);
  }

  function renderNoteTags(tagIds) {
    var html = (tagIds || []).map(function(tagId) {
      var tag = state.tags.find(function(t) { return t.id === tagId; });
      if (!tag) return '';
      return '<span class="s-notes-note-tag">' + escapeHtml(tag.name) + '<button data-tag-id="' + tag.id + '"><i data-lucide="x"></i></button></span>';
    }).join('');
    html += '<button id="add-tag-btn" class="s-notes-add-tag"><i data-lucide="plus"></i><span>Add tag</span></button>';
    elements.noteTags.innerHTML = html;

    elements.noteTags.querySelectorAll('[data-tag-id]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        removeTagFromCurrent(btn.dataset.tagId);
      });
    });

    var addBtn = elements.noteTags.querySelector('#add-tag-btn');
    if (addBtn) addBtn.addEventListener('click', showTagDialog);
    if (window.lucide) window.lucide.createIcons();
  }

  function highlightActiveNote(noteId) {
    elements.noteList.querySelectorAll('.s-notes-item').forEach(function(item) {
      item.classList.toggle('active', item.dataset.id === noteId);
    });
  }

  function showTagDialog() {
    elements.tagInput.value = '';
    elements.tagDialog.showModal();
    elements.tagInput.focus();
  }

  function showFolderDialog() {
    elements.folderInput.value = '';
    updateFolderSelect();
    elements.folderDialog.showModal();
    elements.folderInput.focus();
  }

  /**
   * Folder CRUD
   */
  async function createFolder(name, parentId) {
    var now = new Date().toISOString();
    var id = generateId();
    sqliteDb.run('INSERT INTO folders (id, name, parent_id, created_at) VALUES (?, ?, ?, ?)', [id, name, parentId || null, now]);
    state.folders = queryAll('SELECT id, name, parent_id AS parentId, created_at AS createdAt FROM folders');
    persistDbSoon();
    await idbPut(STORE_FOLDERS_META, { id: id, name: name, parentId: parentId || null, createdAt: now });
    renderFolderTree();
    updateFolderSelect();
  }

  /**
   * Tag CRUD
   */
  async function createTag(name) {
    var existing = state.tags.find(function(t) { return t.name.toLowerCase() === name.toLowerCase(); });
    if (existing) return existing;
    var id = generateId();
    var color = getRandomColor();
    sqliteDb.run('INSERT INTO tags (id, name, color) VALUES (?, ?, ?)', [id, name, color]);
    state.tags.push({ id: id, name: name, color: color });
    persistDbSoon();
    await idbPut(STORE_TAGS_META, { id: id, name: name, color: color });
    renderTagList();
    return { id: id, name: name, color: color };
  }

  function addTagToCurrent(tagId) {
    if (!state.currentNoteId) return;
    sqliteDb.run('INSERT OR IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?)', [state.currentNoteId, tagId]);
    state.notes = loadNotesFromSql();
    renderNoteTags(getNoteTags(state.currentNoteId));
    renderNoteList();
    persistDbSoon();
  }

  function removeTagFromCurrent(tagId) {
    if (!state.currentNoteId) return;
    sqliteDb.run('DELETE FROM note_tags WHERE note_id = ? AND tag_id = ?', [state.currentNoteId, tagId]);
    state.notes = loadNotesFromSql();
    renderNoteTags(getNoteTags(state.currentNoteId));
    renderNoteList();
    persistDbSoon();
  }

  function getNoteTags(noteId) {
    var note = state.notes.find(function(n) { return n.id === noteId; });
    return note ? note.tags : [];
  }

  /**
   * Rendering helpers
   */
  function renderFolderTree() {
    var html = buildFolderTree(null);
    elements.folderTree.innerHTML = html || '<div class="s-notes-folder-empty">No folders</div>';
    elements.folderTree.querySelectorAll('.s-notes-folder-item').forEach(function(item) {
      item.addEventListener('click', function(e) {
        e.stopPropagation();
        state.currentFolderId = this.dataset.id;
        renderListTitle();
        renderNoteList();
        renderFolderTree();
      });
    });
    if (window.lucide) window.lucide.createIcons();
  }

  function buildFolderTree(parentId) {
    var children = state.folders.filter(function(f) { return (f.parentId || null) === (parentId || null); });
    if (!children.length) return '';
    return children.map(function(folder) {
      var active = state.currentFolderId === folder.id ? ' active' : '';
      var childHtml = buildFolderTree(folder.id);
      return '<div class="s-notes-folder-item' + active + '" data-id="' + folder.id + '"><i data-lucide="folder"></i><span>' + escapeHtml(folder.name) + '</span></div>' + (childHtml ? '<div class="s-notes-folder-children">' + childHtml + '</div>' : '');
    }).join('');
  }

  function renderTagList() {
    if (!state.tags.length) {
      elements.tagList.innerHTML = '<div class="s-notes-tag-empty">No tags</div>';
      return;
    }
    elements.tagList.innerHTML = state.tags.map(function(tag) {
      var active = state.currentTagId === tag.id ? ' active' : '';
      return '<span class="s-notes-tag' + active + '" data-id="' + tag.id + '"><span class="s-notes-tag-dot" style="background:' + tag.color + '"></span>' + escapeHtml(tag.name) + '</span>';
    }).join('');

    elements.tagList.querySelectorAll('.s-notes-tag').forEach(function(item) {
      item.addEventListener('click', function() {
        state.currentTagId = this.dataset.id;
        renderListTitle();
        renderNoteList();
        renderTagList();
      });
    });
  }

  function renderListTitle() {
    var i18n = window.sNotesI18n || {};
    var folder = state.folders.find(function(f) { return f.id === state.currentFolderId; });
    var tag = state.tags.find(function(t) { return t.id === state.currentTagId; });
    var label = i18n.all_notes || 'All Notes';
    if (folder && tag) label = folder.name + ' + #' + tag.name;
    else if (folder) label = folder.name;
    else if (tag) label = '#' + tag.name;
    elements.listTitle.textContent = label;
  }

  function refreshLists() {
    renderFolderTree();
    renderTagList();
    renderListTitle();
    renderNoteList();
    updateFolderSelect();
  }

  function setView(view) {
    if (view === 'all') {
      state.currentFolderId = null;
      state.currentTagId = null;
    }
    renderListTitle();
    renderFolderTree();
    renderTagList();
    renderNoteList();
  }

  function renderNoteList() {
    var i18n = window.sNotesI18n || {};
    var filtered = getFilteredNotes();
    if (!filtered.length) {
      var message = state.search ? (i18n.no_results || 'No matching notes') : (i18n.no_notes || 'No notes yet. Create your first note!');
      elements.noteList.innerHTML = '<div class="s-notes-empty"><i data-lucide="notebook-pen"></i><p>' + message + '</p></div>';
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    elements.noteList.innerHTML = filtered.map(function(note) {
      var active = state.currentNoteId === note.id ? ' active' : '';
      var preview = (note.contentText || '').slice(0, 120);
      var tagBadges = (note.tags || []).map(function(tagId) {
        var tag = state.tags.find(function(t) { return t.id === tagId; });
        return tag ? '<span class="s-notes-item-tag">' + escapeHtml(tag.name) + '</span>' : '';
      }).join('');
      return '<div class="s-notes-item' + active + '" data-id="' + note.id + '">' +
        '<div class="s-notes-item-title">' + escapeHtml(note.title || (i18n.untitled || 'Untitled')) + '</div>' +
        '<div class="s-notes-item-preview">' + escapeHtml(preview) + '</div>' +
        '<div class="s-notes-item-meta"><span>' + formatDate(note.updatedAt) + '</span>' + (tagBadges ? '<div class="s-notes-item-tags">' + tagBadges + '</div>' : '') + '</div>' +
      '</div>';
    }).join('');

    elements.noteList.querySelectorAll('.s-notes-item').forEach(function(item) {
      item.addEventListener('click', function() {
        selectNote(this.dataset.id);
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  function updateFolderSelect() {
    var html = '<option value="">No folder</option>';
    function walk(parentId, prefix) {
      state.folders.filter(function(f) { return (f.parentId || null) === (parentId || null); }).forEach(function(folder) {
        html += '<option value="' + folder.id + '">' + prefix + escapeHtml(folder.name) + '</option>';
        walk(folder.id, prefix + '— ');
      });
    }
    walk(null, '');
    elements.noteFolder.innerHTML = html;
    elements.parentFolderSelect.innerHTML = html;
    if (state.currentNoteId) {
      var note = state.notes.find(function(n) { return n.id === state.currentNoteId; });
      if (note) elements.noteFolder.value = note.folderId || '';
    }
  }

  /**
   * Filtering and search (SQLite FTS)
   */
  function getFilteredNotes() {
    var notes = state.notes;

    if (state.search) {
      try {
        var stmt = sqliteDb.prepare('SELECT n.id FROM notes_fts f JOIN notes n ON n.rowid = f.rowid WHERE notes_fts MATCH ? ORDER BY rank', [state.search + '*']);
        var ids = [];
        while (stmt.step()) ids.push(stmt.getAsObject().id);
        stmt.free();
        notes = state.notes.filter(function(n) { return ids.indexOf(n.id) !== -1; });
      } catch (err) {
        console.warn('FTS search failed, fallback to in-memory', err);
        var q = state.search.toLowerCase();
        notes = notes.filter(function(n) {
          return (n.title || '').toLowerCase().indexOf(q) > -1 || (n.contentText || '').toLowerCase().indexOf(q) > -1;
        });
      }
    }

    if (state.currentFolderId) {
      notes = notes.filter(function(n) { return (n.folderId || null) === state.currentFolderId; });
    }

    if (state.currentTagId) {
      notes = notes.filter(function(n) { return (n.tags || []).indexOf(state.currentTagId) !== -1; });
    }

    return notes;
  }

  /**
   * Saving
   */
  function scheduleSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveCurrentNote, 300);
  }

  async function saveCurrentNote() {
    if (!state.currentNoteId || !editor) return;

    var data = await editor.save();
    var contentText = blocksToPlainText(data.blocks);
    var now = new Date().toISOString();
    var folderId = elements.noteFolder.value || null;
    var title = elements.noteTitle.value || '';

    sqliteDb.run('INSERT INTO notes (id, title, content_json, content_text, folder_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, COALESCE((SELECT created_at FROM notes WHERE id = ?), ?), ?) ON CONFLICT(id) DO UPDATE SET title=excluded.title, content_json=excluded.content_json, content_text=excluded.content_text, folder_id=excluded.folder_id, updated_at=excluded.updated_at', [
      state.currentNoteId,
      title,
      JSON.stringify(data),
      contentText,
      folderId,
      state.currentNoteId,
      now,
      now
    ]);

    // Sync tags already handled via add/remove
    state.notes = loadNotesFromSql();
    persistDbSoon();
    await idbPut(STORE_META, { id: state.currentNoteId, title: title, content_text: contentText, folder_id: folderId, updated_at: now });
    renderNoteList();
    updatePreviewFromBlocks(data.blocks);
  }

  /**
   * Attachments via OPFS
   */
  async function uploadAttachment(file) {
    if (!state.currentNoteId) {
      await createNote();
    }
    var path = await saveFileToOpfs(file, state.currentNoteId);
    var url = await attachmentUrlFromPath(path);
    var id = generateId();
    sqliteDb.run('INSERT INTO attachments (id, note_id, file_name, mime_type, opfs_path, created_at) VALUES (?, ?, ?, ?, ?, ?)', [id, state.currentNoteId, file.name, file.type, path, new Date().toISOString()]);
    persistDbSoon();
    return { success: 1, file: { url: url, path: path }, meta: { path: path, name: file.name, mime: file.type } };
  }

  async function saveFileToOpfs(file, noteId) {
    if (!navigator.storage || !navigator.storage.getDirectory) {
      // Fallback to data URL when OPFS is unavailable
      return await fileToDataUrl(file);
    }
    if (!opfsRoot) {
      opfsRoot = await navigator.storage.getDirectory();
    }
    var appDir = await opfsRoot.getDirectoryHandle('s-notes', { create: true });
    var noteDir = await appDir.getDirectoryHandle(noteId, { create: true });
    var sanitized = sanitizeFileName(file.name);
    var handle = await noteDir.getFileHandle(Date.now() + '-' + sanitized, { create: true });
    var writable = await handle.createWritable();
    await writable.write(file);
    await writable.close();
    return ['s-notes', noteId, handle.name].join('/');
  }

  async function attachmentUrlFromPath(path) {
    if (attachmentUrlCache[path]) return attachmentUrlCache[path];
    var url = await readOpfsFile(path);
    attachmentUrlCache[path] = url;
    return url;
  }

  async function readOpfsFile(path) {
    if (!path) return '';
    if (path.startsWith('data:')) return path;
    if (!navigator.storage || !navigator.storage.getDirectory) return '';

    var parts = path.split('/');
    var dir = await navigator.storage.getDirectory();
    var handle = dir;
    for (var i = 0; i < parts.length; i++) {
      if (i === parts.length - 1) {
        var fileHandle = await handle.getFileHandle(parts[i]);
        var file = await fileHandle.getFile();
        return URL.createObjectURL(file);
      }
      handle = await handle.getDirectoryHandle(parts[i]);
    }
    return '';
  }

  /**
   * Preview rendering
   */
  async function updatePreview() {
    if (!editor) return;
    var data = await editor.save();
    updatePreviewFromBlocks(data.blocks);
  }

  async function updatePreviewFromBlocks(blocks) {
    if (!md) return;
    var markdown = await blocksToMarkdown(blocks);
    var html = md.render(markdown);
    if (window.hljs) {
      html = html.replace(/<pre><code class="language-([^"]*)">([\s\S]*?)<\/code><\/pre>/g, function(_, lang, code) {
        var decoded = decodeHtml(code);
        var highlighted = window.hljs.highlight(decoded, { language: lang || 'plaintext', ignoreIllegals: true }).value;
        return '<pre><code class="language-' + lang + '">' + highlighted + '</code></pre>';
      });
    }
    elements.preview.innerHTML = html;
  }

  function blocksToPlainText(blocks) {
    return (blocks || []).map(function(block) {
      if (block.type === 'header') return block.data.text;
      if (block.type === 'list') return (block.data.items || []).join('\n');
      if (block.type === 'checklist') return (block.data.items || []).map(function(i){ return (i.checked ? '[x] ' : '[ ] ') + i.text; }).join('\n');
      if (block.type === 'code') return block.data.code || '';
      if (block.type === 'image') return block.data.caption || block.data.file && block.data.file.url || '';
      return block.data && block.data.text ? block.data.text : '';
    }).join('\n');
  }

  async function blocksToMarkdown(blocks) {
    var lines = [];
    for (var i = 0; i < (blocks || []).length; i++) {
      var block = blocks[i];
      if (block.type === 'header') {
        var level = Math.min(block.data.level || 1, 6);
        lines.push(Array(level + 1).join('#') + ' ' + block.data.text);
      } else if (block.type === 'list') {
        var style = block.data.style === 'ordered';
        (block.data.items || []).forEach(function(item, idx) {
          lines.push((style ? (idx + 1) + '. ' : '- ') + item);
        });
      } else if (block.type === 'checklist') {
        (block.data.items || []).forEach(function(item) {
          lines.push('- [' + (item.checked ? 'x' : ' ') + '] ' + item.text);
        });
      } else if (block.type === 'code') {
        lines.push('```' + (block.data.language || '')); lines.push(block.data.code || ''); lines.push('```');
      } else if (block.type === 'image') {
        var url = block.data.file && block.data.file.url;
        var path = (block.data.file && block.data.file.path) || block.data.path;
        if (!url && path) {
          url = await attachmentUrlFromPath(path);
        }
        lines.push('![' + (block.data.caption || 'image') + '](' + (url || '') + ')');
      } else {
        lines.push(block.data && block.data.text ? block.data.text : '');
      }
    }
    return lines.join('\n\n');
  }

  /**
   * Import / Export
   */
  function exportNotes() {
    var data = {
      version: 2,
      exportedAt: new Date().toISOString(),
      notes: queryAll('SELECT * FROM notes'),
      folders: state.folders,
      tags: state.tags,
      noteTags: queryAll('SELECT * FROM note_tags'),
      attachments: queryAll('SELECT * FROM attachments')
    };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 's-notes-export-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importNotes(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        var data = JSON.parse(e.target.result);
        if (!data.notes || !Array.isArray(data.notes)) throw new Error('Invalid export');
        sqliteDb.run('DELETE FROM note_tags');
        sqliteDb.run('DELETE FROM notes');
        sqliteDb.run('DELETE FROM folders');
        sqliteDb.run('DELETE FROM tags');
        sqliteDb.run('DELETE FROM attachments');

        data.folders && data.folders.forEach(function(f) {
          sqliteDb.run('INSERT INTO folders (id, name, parent_id, created_at) VALUES (?, ?, ?, ?)', [f.id || generateId(), f.name, f.parent_id || f.parentId || null, f.created_at || f.createdAt || new Date().toISOString()]);
        });
        data.tags && data.tags.forEach(function(t) {
          sqliteDb.run('INSERT INTO tags (id, name, color) VALUES (?, ?, ?)', [t.id || generateId(), t.name, t.color || '#3b82f6']);
        });
        data.notes.forEach(function(n) {
          sqliteDb.run('INSERT INTO notes (id, title, content_json, content_text, folder_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [n.id || generateId(), n.title || '', n.content_json || n.contentJson || '{}', n.content_text || n.contentText || '', n.folder_id || n.folderId || null, n.created_at || n.createdAt || new Date().toISOString(), n.updated_at || n.updatedAt || new Date().toISOString()]);
        });
        data.noteTags && data.noteTags.forEach(function(nt) {
          sqliteDb.run('INSERT INTO note_tags (note_id, tag_id) VALUES (?, ?)', [nt.note_id || nt.noteId, nt.tag_id || nt.tagId]);
        });
        data.attachments && data.attachments.forEach(function(a) {
          sqliteDb.run('INSERT INTO attachments (id, note_id, file_name, mime_type, opfs_path, created_at) VALUES (?, ?, ?, ?, ?, ?)', [a.id || generateId(), a.note_id || a.noteId, a.file_name || a.fileName, a.mime_type || a.mimeType, a.opfs_path || a.opfsPath, a.created_at || a.createdAt || new Date().toISOString()]);
        });

        persistDbSoon();
        hydrateFromDb().then(function() {
          refreshLists();
        });
        if (window.showMessage) window.showMessage('Import successful');
      } catch (err) {
        console.error('Import failed', err);
        if (window.showMessage) window.showMessage('Import failed: ' + err.message, true);
      }
    };
    reader.readAsText(file);
  }

  /**
   * Detach / PiP
   */
  async function detachNote() {
    if (!state.currentNoteId) return;
    var data = await editor.save();
    var html = md ? md.render(await blocksToMarkdown(data.blocks)) : '<pre>' + escapeHtml(blocksToPlainText(data.blocks)) + '</pre>';
    var title = elements.noteTitle.value || 'S Notes';

    if (document.pictureInPictureEnabled && window.documentPictureInPicture) {
      try {
        var pipWindow = await window.documentPictureInPicture.requestWindow({ width: 600, height: 800 });
        pipWindow.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + escapeHtml(title) + '</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:24px;line-height:1.6;} pre{background:#0f172a;color:#e2e8f0;padding:12px;border-radius:8px;overflow:auto;}</style></head><body><h1>' + escapeHtml(title) + '</h1>' + html + '</body></html>');
        pipWindow.document.close();
        return;
      } catch (err) {
        console.warn('PiP failed, fallback to new window', err);
      }
    }

    var doc = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + escapeHtml(title) + '</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:32px;max-width:900px;margin:0 auto;line-height:1.7;} pre{background:#0f172a;color:#e2e8f0;padding:12px;border-radius:8px;overflow:auto;}</style></head><body><h1>' + escapeHtml(title) + '</h1>' + html + '</body></html>';
    var blob = new Blob([doc], { type: 'text/html' });
    var url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'width=900,height=900');
  }

  /**
   * Utilities
   */
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function sanitizeFileName(name) {
    return name.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  function getRandomColor() {
    var colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function decodeHtml(html) {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  function formatDate(dateStr) {
    var date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return '';
    var now = new Date();
    var diff = now - date;
    var day = 86400000;
    if (diff < day) return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    if (diff < 7 * day) return date.toLocaleDateString(undefined, { weekday: 'short' });
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  function safeParse(str) {
    try { return JSON.parse(str || '{}'); } catch (e) { return null; }
  }

  async function fileToDataUrl(file) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function() { resolve(reader.result); };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Export
  window.SNotesApp = SNotesApp;

})();
