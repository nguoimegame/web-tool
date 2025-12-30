/* eslint-disable no-console */
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import {
  cancelGarbageCollection,
  cleanupOrphanedAttachments,
  clearImageCaches,
  deleteNote,
  deleteNoteWithDescendants,
  findOrphanedAttachments,
  generateId,
  getAllNotes,
  getAttachmentBlob,
  getAttachmentsForNote,
  getNote,
  hasChildren,
  initDatabase,
  initOPFS,
  restoreImageUrls,
  saveAttachment,
  saveNote,
  scheduleGarbageCollection,
  searchNotes,
  setAttachmentUpdater,
  buildNotesTree,
} from './s-notes/storage.js';
import { escapeHtml, formatDate } from './s-notes/utils.js';

// S-Notes - Advanced Note Taking App with Toast UI Editor
// Storage: IndexedDB for metadata + OPFS for attachments
(function () {
  'use strict';

  // UI & EDITOR
  // ============================================

  let notes = [];
  let activeNoteId = null;
  let editor = null;
  let saveTimeout = null;

  // DOM Elements
  const notesList = document.getElementById('notes-list');
  const newNoteBtn = document.getElementById('new-note-btn');
  const searchInput = document.getElementById('search-notes');
  const noteEditor = document.getElementById('note-editor');
  const emptyState = document.getElementById('empty-state');
  const editorContainer = document.getElementById('editor-container');
  const storageStatus = document.getElementById('storage-status');

  // Translations
  const t = window.notesTranslations || {
    untitled: 'Untitled Note',
    category: 'Notes',
    confirmDelete: 'Are you sure you want to delete this note?',
    confirmDeleteWithChildren: 'This note has child notes. Delete this note and all its children?',
    noNotes: 'No notes yet. Click "New Note" to create one.',
    noFavorites: 'No favorite notes yet',
    loading: 'Loading...',
    ready: 'Ready',
    syncing: 'Syncing...',
    error: 'Error',
    attachments: 'Attachments',
    deleteAttachment: 'Delete attachment?',
    createChild: 'Create Note Item',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
  };

  function getTitleFromContent(content) {
    if (!content) {
      return t.untitled;
    }
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed) {
        return trimmed.replace(/^#+\s*/, '').substring(0, 50) || t.untitled;
      }
    }
    return t.untitled;
  }

  // Track expanded state for nested notes
  const expandedNotes = new Set();

  // Current active tab: 'all' or 'favorites'
  let activeTab = 'all';

  function updateStatus(status, text) {
    if (storageStatus) {
      storageStatus.className = 'storage-status ' + status;
      const statusText = storageStatus.querySelector('.status-text');
      if (statusText) {
        statusText.textContent = text || t[status] || status;
      }
    }
  }

  async function runManualGarbageCollection() {
    updateStatus('syncing', t.syncing || 'Cleaning up...');

    try {
      const result = await cleanupOrphanedAttachments();

      if (result.deleted > 0) {
        await renderNotesList(searchInput?.value || '');
      }

      updateStatus('ready', t.ready);
      console.log(`Cleanup completed: ${result.deleted} files deleted`);

      return result;
    } catch (e) {
      console.error('Manual garbage collection failed:', e);
      updateStatus('error', t.error);
      throw e;
    }
  }

  // ============================================
  // EDITOR & UI HELPERS
  // ============================================

  // Create custom delete button for Toast UI Editor
  function createDeleteButton() {
    const button = document.createElement('button');
    button.className = 'toastui-editor-toolbar-icons delete-note-btn';
    button.type = 'button';
    button.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square-x-icon lucide-message-square-x"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/><path d="m14.5 8.5-5 5"/><path d="m9.5 8.5 5 5"/></svg>';
    button.title = 'Delete current note (Ctrl+Shift+D)';
    button.style.cssText = `
      font-size: 16px;
      border: none;
      background: none;
      cursor: pointer;
      padding: 4px 4px;
      border-radius: 4px;
      margin: 0;
    `;

    // Hover effects
    button.addEventListener('mouseenter', () => {
      button.style.background = 'rgba(220, 53, 69, 0.1)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.background = 'none';
    });

    button.addEventListener('click', async (e) => {
      e.preventDefault();
      await handleDeleteCurrentNote();
    });

    return button;
  }

  // Create open in new window button
  function createOpenWindowButton() {
    const button = document.createElement('button');
    button.className = 'toastui-editor-toolbar-icons open-window-btn';
    button.type = 'button';
    button.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link-icon lucide-external-link"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>';
    button.title = t.openInNewWindow || 'Open in new window';
    button.style.cssText = `
      font-size: 16px;
      border: none;
      background: none;
      cursor: pointer;
      padding: 4px 4px;
      border-radius: 4px;
      margin: 0;
    `;

    // Hover effects
    button.addEventListener('mouseenter', () => {
      button.style.background = 'rgba(59, 130, 246, 0.1)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.background = 'none';
    });

    button.addEventListener('click', async (e) => {
      e.preventDefault();
      await handleOpenInNewWindow();
    });

    return button;
  }

  // Create favorite star button
  let favoriteButton = null;
  function createFavoriteButton() {
    const button = document.createElement('button');
    button.className = 'toastui-editor-toolbar-icons favorite-note-btn';
    button.type = 'button';
    button.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    button.title = t.addToFavorites || 'Add to Favorites';
    button.style.cssText = `
      font-size: 16px;
      border: none;
      background: none;
      cursor: pointer;
      padding: 4px 4px;
      border-radius: 4px;
      margin: 0;
    `;

    // Hover effects
    button.addEventListener('mouseenter', () => {
      button.style.background = 'rgba(245, 158, 11, 0.1)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.background = 'none';
    });

    button.addEventListener('click', async (e) => {
      e.preventDefault();
      await toggleFavorite();
    });

    favoriteButton = button;
    return button;
  }

  // Toggle favorite status for current note
  async function toggleFavorite(noteId = null) {
    const targetId = noteId || activeNoteId;
    if (!targetId) {
      return;
    }

    const note = await getNote(targetId);
    if (!note) {
      return;
    }

    note.isFavorite = !note.isFavorite;
    await saveNote(note);

    // Update local notes array
    const noteIndex = notes.findIndex((n) => n.id === targetId);
    if (noteIndex !== -1) {
      notes[noteIndex] = note;
    }

    updateFavoriteButton(note.isFavorite);
    renderNotesList(searchInput?.value || '');
  }

  // Update favorite button appearance
  function updateFavoriteButton(isFavorite) {
    if (!favoriteButton) {
      return;
    }

    if (isFavorite) {
      favoriteButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
      favoriteButton.title = t.removeFromFavorites || 'Remove from Favorites';
    } else {
      favoriteButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
      favoriteButton.title = t.addToFavorites || 'Add to Favorites';
    }
  }

  // Handle delete current note
  async function handleDeleteCurrentNote() {
    if (!activeNoteId) {
      alert(t.noNotes || 'No note selected');
      return;
    }

    const note = await getNote(activeNoteId);
    if (!note) {
      return;
    }

    const hasChildNotes = hasChildren(activeNoteId, notes);
    const confirmMsg = hasChildNotes
      ? `${t.confirmDeleteWithChildren || 'This note has child notes. Delete this note and all its children?'}\n\n"${note.title}"`
      : `${t.confirmDelete || 'Are you sure you want to delete this note?'}\n\n"${note.title}"`;

    if (confirm(confirmMsg)) {
      const deletedId = activeNoteId;

      // Find next note to select (prefer sibling, not child)
      let nextNote = null;
      const rootNotes = notes.filter((n) => !n.parentId || n.parentId === note.parentId);
      const currentIndex = rootNotes.findIndex((n) => n.id === deletedId);

      if (rootNotes.length > 1) {
        nextNote = rootNotes[currentIndex + 1] || rootNotes[currentIndex - 1];
      } else if (note.parentId) {
        // Select parent if no siblings
        nextNote = notes.find((n) => n.id === note.parentId);
      }

      try {
        updateStatus('syncing', t.syncing || 'Deleting...');

        // Delete the note and its descendants
        const deletedIds = await deleteNoteWithDescendants(deletedId);

        // Remove deleted notes from notes array
        notes = notes.filter((n) => !deletedIds.includes(n.id));

        // Clear active note
        activeNoteId = null;
        localStorage.removeItem('snotes-active');

        // Select next note or show empty state
        if (nextNote) {
          await selectNote(nextNote.id);
        } else {
          // No notes left
          editor.setMarkdown('');
          showEmptyState();
          renderNotesList();
        }

        updateStatus('ready', t.ready);

        console.log(`Deleted note: ${note.title}`);
      } catch (e) {
        console.error('Failed to delete note:', e);
        updateStatus('error', t.error);
        alert('Failed to delete note. Please try again.');
      }
    }
  }

  // Handle open in new window
  async function handleOpenInNewWindow() {
    if (!activeNoteId) {
      alert(t.noNotes || 'No note selected');
      return;
    }

    const note = await getNote(activeNoteId);
    if (!note) {
      return;
    }

    try {
      // Create a new window with the note content
      const newWindow = window.open(
        '',
        '_blank',
        'width=1000,height=700,scrollbars=yes,resizable=yes'
      );

      if (!newWindow) {
        alert('Pop-up blocked. Please allow pop-ups for this site.');
        return;
      }

      // Get the current note content from editor
      const currentContent = editor ? editor.getMarkdown() : note.content;

      // Create the HTML content for the new window
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${note.title || t.untitled}</title>
          <link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/toastui-editor.min.css">
          <link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/theme/toastui-editor-dark.min.css">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0;
              padding: 20px;
              background: #fff;
            }
            .note-header {
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 1px solid #eee;
            }
            .note-title {
              font-size: 24px;
              font-weight: bold;
              margin: 0 0 10px 0;
              color: #333;
            }
            .note-meta {
              font-size: 14px;
              color: #666;
            }
            #viewer {
              min-height: 400px;
            }
            @media (prefers-color-scheme: dark) {
              body {
                background: #1a1a1a;
                color: #e0e0e0;
              }
              .note-title {
                color: #fff;
              }
              .note-meta {
                color: #aaa;
              }
              .note-header {
                border-bottom-color: #333;
              }
            }
          </style>
        </head>
        <body>
          <div class="note-header">
            <h1 class="note-title">${note.title || t.untitled}</h1>
            <div class="note-meta">
              Created: ${new Date(note.createdAt).toLocaleDateString()} | 
              Modified: ${new Date(note.updatedAt).toLocaleDateString()}
            </div>
          </div>
          <div id="viewer"></div>
          
          <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>
          <script>
            const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const viewer = new Editor.factory({
              el: document.getElementById('viewer'),
              viewer: true,
              initialValue: \`${currentContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
              theme: isDark ? 'dark' : 'light'
            });
            
            // Auto-adjust theme
            if (window.matchMedia) {
              window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
                // Toast UI doesn't support dynamic theme switching, so we reload
                location.reload();
              });
            }
          </script>
        </body>
        </html>
      `;

      // Write content to new window
      newWindow.document.write(htmlContent);
      newWindow.document.close();
      newWindow.focus();
    } catch (e) {
      console.error('Failed to open in new window:', e);
      alert('Failed to open note in new window');
    }
  }

  // Initialize Toast UI Editor
  function initEditor() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    editor = new Editor({
      el: editorContainer,
      height: '450px',
      initialEditType: 'wysiwyg',
      previewStyle: 'vertical',
      theme: isDark ? 'dark' : 'light',
      placeholder: 'Start writing your note...',
      usageStatistics: false,
      toolbarItems: [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['table', 'image', 'link'],
        ['code', 'codeblock'],
        ['scrollSync'],
        [
          {
            el: createOpenWindowButton(),
            name: 'openWindow',
            tooltip: 'Open in new window',
          },
        ],
        [
          {
            el: createFavoriteButton(),
            name: 'favoriteNote',
            tooltip: 'Toggle favorite',
          },
        ],
        [
          {
            el: createDeleteButton(),
            name: 'deleteNote',
            tooltip: 'Delete current note',
          },
        ],
      ],
      hooks: {
        addImageBlobHook: async (blob, callback) => {
          if (!activeNoteId) {
            alert('Please create or select a note first');
            return;
          }

          updateStatus('syncing', t.syncing);

          try {
            const attachment = await saveAttachment(activeNoteId, blob);
            const attachmentBlob = await getAttachmentBlob(attachment);
            const url = URL.createObjectURL(attachmentBlob);

            // Add attachment ID as comment in the URL for easier restoration
            callback(url, attachment.fileName);

            // Update note's attachment list
            await updateNoteAttachments();
            updateStatus('ready', t.ready);
          } catch (e) {
            console.error('Failed to save attachment:', e);
            updateStatus('error', t.error);
          }
        },
      },
      events: {
        change: () => {
          if (activeNoteId) {
            debouncedSave();
          }
        },
      },
    });

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          // Toast UI doesn't have dynamic theme switch, so we need to handle via CSS
          // Theme changes are applied via CSS selectors in the stylesheet
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
  }

  // Debounced save
  function debouncedSave() {
    clearTimeout(saveTimeout);
    updateStatus('syncing', t.syncing);

    saveTimeout = setTimeout(async () => {
      await saveCurrentNote();
      updateStatus('ready', t.ready);
    }, 500);
  }

  // Save current note
  async function saveCurrentNote() {
    if (!activeNoteId || !editor) {
      return;
    }

    const note = await getNote(activeNoteId);
    if (!note) {
      return;
    }

    const content = editor.getMarkdown();

    // Only update if content actually changed
    if (note.content === content) {
      return;
    }

    note.content = content;
    note.title = getTitleFromContent(content);
    note.updatedAt = Date.now();

    await saveNote(note);

    // Update local notes array to reflect changes in UI immediately
    const noteIndex = notes.findIndex((n) => n.id === activeNoteId);
    if (noteIndex !== -1) {
      notes[noteIndex] = note;
    }

    await updateNoteAttachments();

    // Update list without losing scroll position
    renderNotesList(searchInput.value);

    // Auto cleanup after content changes (with delay to avoid frequent runs)
    scheduleGarbageCollection(60000); // 1 minute delay
  }

  async function updateNoteAttachments(noteId = null) {
    const targetNoteId = noteId || activeNoteId;
    if (!targetNoteId) {
      return;
    }

    const note = await getNote(targetNoteId);
    if (!note) {
      return;
    }

    const attachments = await getAttachmentsForNote(targetNoteId);
    note.attachmentCount = attachments.length;
    await saveNote(note);

    // Update local notes array
    const noteIndex = notes.findIndex((n) => n.id === targetNoteId);
    if (noteIndex !== -1) {
      notes[noteIndex] = note;
    }
  }

  setAttachmentUpdater(updateNoteAttachments);

  // Context Menu
  let contextMenu = null;
  let contextMenuNoteId = null;

  function createContextMenu() {
    if (contextMenu) {
      return contextMenu;
    }

    contextMenu = document.createElement('div');
    contextMenu.className = 'note-context-menu';
    contextMenu.innerHTML = `
      <div class="note-context-menu-item create-child" data-action="create-child">
        <span>➕</span>
        <span>${t.createChild || 'Create Note Item'}</span>
      </div>
      <div class="note-context-menu-item favorite" data-action="toggle-favorite">
        <span>⭐</span>
        <span class="favorite-text">${t.addToFavorites || 'Add to Favorites'}</span>
      </div>
      <div class="note-context-menu-item delete" data-action="delete">
        <span>🗑️</span>
        <span>${t.delete || 'Delete'}</span>
      </div>
    `;

    document.body.appendChild(contextMenu);

    // Handle menu item clicks
    contextMenu.addEventListener('click', async (e) => {
      const item = e.target.closest('.note-context-menu-item');
      if (!item) {
        return;
      }

      const action = item.dataset.action;
      const targetNoteId = contextMenuNoteId;
      hideContextMenu();

      if (action === 'create-child' && targetNoteId) {
        await createChildNote(targetNoteId);
        return;
      }

      if (action === 'toggle-favorite' && targetNoteId) {
        await toggleFavorite(targetNoteId);
        return;
      }

      if (action === 'delete' && targetNoteId) {
        const noteIdToDelete = targetNoteId;
        console.log('Context menu delete clicked for note:', noteIdToDelete);
        try {
          // Select the note first if it's not already active
          if (noteIdToDelete !== activeNoteId) {
            console.log('Selecting note before delete:', noteIdToDelete);
            await selectNote(noteIdToDelete);
          }

          // Now delete the active note
          if (!activeNoteId) {
            console.error('No active note after selection');
            return;
          }

          const note = await getNote(activeNoteId);
          if (!note) {
            console.error('Note not found:', activeNoteId);
            return;
          }

          console.log('About to show confirm dialog for note:', note.title);
          const hasChildNotes = hasChildren(activeNoteId, notes);
          const confirmMsg = hasChildNotes
            ? `${t.confirmDeleteWithChildren || 'This note has child notes. Delete this note and all its children?'}\n\n"${note.title}"`
            : `${t.confirmDelete || 'Are you sure you want to delete this note?'}\n\n"${note.title}"`;

          if (confirm(confirmMsg)) {
            console.log('User confirmed deletion');
            const deletedId = activeNoteId;

            // Find next note to select
            let nextNote = null;
            const currentIndex = notes.findIndex((n) => n.id === deletedId);

            if (notes.length > 1) {
              // Try next note, if not available then previous
              nextNote = notes[currentIndex + 1] || notes[currentIndex - 1];
            }

            updateStatus('syncing', t.syncing || 'Deleting...');

            console.log('Calling deleteNote for:', deletedId);
            // Delete the note and its descendants
            const deletedIds = await deleteNoteWithDescendants(deletedId);
            console.log('deleteNoteWithDescendants completed, deleted IDs:', deletedIds);

            // Remove deleted notes from notes array
            notes = notes.filter((n) => !deletedIds.includes(n.id));
            console.log('Removed from notes array, remaining notes:', notes.length);

            // Clear active note
            activeNoteId = null;
            localStorage.removeItem('snotes-active');

            // Select next note or show empty state
            if (nextNote) {
              await selectNote(nextNote.id);
            } else {
              // No notes left
              if (editor) {
                editor.setMarkdown('');
              }
              showEmptyState();
            }

            // Always refresh the notes list
            renderNotesList();

            updateStatus('ready', t.ready);

            console.log(`Deleted note: ${note.title}`);
          } else {
            console.log('User cancelled deletion');
          }
        } catch (e) {
          console.error('Failed to delete note:', e);
          updateStatus('error', t.error);
          alert('Failed to delete note. Please try again.');
        }
      }
    });

    // Hide menu on click outside
    document.addEventListener('click', (e) => {
      if (contextMenu && !contextMenu.contains(e.target)) {
        hideContextMenu();
      }
    });

    // Hide menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hideContextMenu();
      }
    });

    // Hide menu on scroll
    notesList.addEventListener('scroll', () => {
      hideContextMenu();
    });

    return contextMenu;
  }

  function showContextMenu(event, noteId) {
    const menu = createContextMenu();
    contextMenuNoteId = noteId;

    // Update favorite menu item text based on note's current state
    const note = notes.find((n) => n.id === noteId);
    const favoriteItem = menu.querySelector('[data-action="toggle-favorite"] .favorite-text');
    if (favoriteItem && note) {
      favoriteItem.textContent = note.isFavorite
        ? t.removeFromFavorites || 'Remove from Favorites'
        : t.addToFavorites || 'Add to Favorites';
    }

    // Position menu at mouse cursor
    const x = event.clientX;
    const y = event.clientY;

    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.classList.add('show');

    // Adjust position if menu goes off screen
    requestAnimationFrame(() => {
      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (rect.right > viewportWidth) {
        menu.style.left = x - rect.width + 'px';
      }

      if (rect.bottom > viewportHeight) {
        menu.style.top = y - rect.height + 'px';
      }
    });
  }

  function hideContextMenu() {
    if (contextMenu) {
      contextMenu.classList.remove('show');
      contextMenuNoteId = null;
    }
  }

  // Render notes list
  async function renderNotesList(filter = '') {
    let displayNotes = filter ? await searchNotes(filter) : notes;

    // Filter by active tab
    if (activeTab === 'favorites') {
      displayNotes = displayNotes.filter((n) => n.isFavorite);
    }

    notesList.innerHTML = '';

    // Show empty state message for favorites tab
    if (displayNotes.length === 0 && activeTab === 'favorites') {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'notes-list-empty';
      emptyMsg.textContent = t.noFavorites || 'No favorite notes yet';
      notesList.appendChild(emptyMsg);
      return;
    }

    // If filtering, show flat list
    if (filter) {
      displayNotes.forEach((note) => {
        const noteItem = createNoteItemElement(note, 0);
        notesList.appendChild(noteItem);
      });
      return;
    }

    // Build tree structure for nested display
    const tree = buildNotesTree(displayNotes);

    // Render tree recursively
    function renderNoteNode(node, level) {
      const noteItem = createNoteItemElement(node, level);
      notesList.appendChild(noteItem);

      // Render children if expanded
      if (node.children && node.children.length > 0 && expandedNotes.has(node.id)) {
        node.children.forEach((child) => renderNoteNode(child, level + 1));
      }
    }

    tree.forEach((node) => renderNoteNode(node, 0));
  }

  // Create a note item DOM element
  function createNoteItemElement(note, level) {
    const noteItem = document.createElement('div');
    noteItem.className = 'note-item';
    noteItem.dataset.noteId = note.id;
    noteItem.dataset.level = level;

    if (note.id === activeNoteId) {
      noteItem.classList.add('active');
    }

    const attachmentBadge = note.attachmentCount
      ? `<span class="note-item-attachments">${note.attachmentCount}</span>`
      : '';

    const favoriteStar = note.isFavorite ? `<span class="note-item-favorite">⭐</span>` : '';

    const hasChildNotes = note.children && note.children.length > 0;
    const isExpanded = expandedNotes.has(note.id);

    const toggleIcon = hasChildNotes
      ? `<span class="note-toggle ${isExpanded ? 'expanded' : ''}" data-note-id="${note.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </span>`
      : `<span class="note-toggle-placeholder"></span>`;

    const indentStyle = level > 0 ? `padding-left: ${level * 1.25 + 1}rem;` : '';

    noteItem.innerHTML = `
      <div class="note-item-content" style="${indentStyle}">
        ${toggleIcon}
        <div class="note-item-text">
          <div class="note-item-title">${favoriteStar}${escapeHtml(note.title)}</div>
          <div class="note-item-meta">
            <span class="note-item-date">${formatDate(note.updatedAt)}</span>
            ${attachmentBadge}
            ${hasChildNotes ? `<span class="note-item-children">${note.children.length}</span>` : ''}
          </div>
        </div>
      </div>
    `;

    // Handle toggle click
    const toggle = noteItem.querySelector('.note-toggle');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleNoteExpand(note.id);
      });
    }

    noteItem.addEventListener('click', (e) => {
      // Don't select if clicking on toggle
      if (!e.target.closest('.note-toggle')) {
        selectNote(note.id);
      }
    });

    // Right click to show context menu
    noteItem.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showContextMenu(e, note.id);
    });

    return noteItem;
  }

  // Toggle expand/collapse for a note
  function toggleNoteExpand(noteId) {
    if (expandedNotes.has(noteId)) {
      expandedNotes.delete(noteId);
    } else {
      expandedNotes.add(noteId);
    }
    renderNotesList(searchInput?.value || '');
  }

  // Create a child note under a parent
  async function createChildNote(parentId) {
    // Ensure parent is expanded
    expandedNotes.add(parentId);

    const newNote = {
      id: generateId(),
      title: t.untitled,
      content: '',
      parentId: parentId,
      tags: [],
      attachmentCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await saveNote(newNote);
    notes.unshift(newNote);
    renderNotesList(searchInput?.value || '');
    await selectNote(newNote.id);

    if (editor) {
      editor.focus();
    }
  }

  // Select note
  async function selectNote(id) {
    // Save current note before switching
    if (activeNoteId && editor) {
      await saveCurrentNote();
    }

    const note = await getNote(id);
    if (!note) {
      return;
    }

    activeNoteId = id;
    localStorage.setItem('snotes-active', id);

    if (editor) {
      // Restore image URLs before setting content
      const contentWithRestoredImages = await restoreImageUrls(id, note.content || '');
      editor.setMarkdown(contentWithRestoredImages);
    }

    // Update favorite button state
    updateFavoriteButton(note.isFavorite);

    hideEmptyState();
    renderNotesList(searchInput.value);
  }

  // Clean up when switching notes or deleting
  // Create new note
  async function createNewNote() {
    const newNote = {
      id: generateId(),
      title: t.untitled,
      content: '',
      tags: [],
      attachmentCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await saveNote(newNote);
    notes.unshift(newNote);
    renderNotesList(searchInput.value);
    selectNote(newNote.id);

    if (editor) {
      editor.focus();
    }
  }

  // Delete note (kept for potential future use)
  // eslint-disable-next-line no-unused-vars
  async function deleteNoteById(id) {
    updateStatus('syncing', t.syncing);

    await deleteNote(id);
    notes = notes.filter((n) => n.id !== id);

    if (id === activeNoteId) {
      if (notes.length > 0) {
        selectNote(notes[0].id);
      } else {
        activeNoteId = null;
        localStorage.removeItem('snotes-active');
        showEmptyState();
      }
    }

    renderNotesList(searchInput.value);
    updateStatus('ready', t.ready);
  }

  // Show/hide empty state
  function showEmptyState() {
    noteEditor.classList.add('hidden');
    emptyState.classList.remove('hidden');
  }

  function hideEmptyState() {
    noteEditor.classList.remove('hidden');
    emptyState.classList.add('hidden');
  }

  // Attach event listeners
  function attachEventListeners() {
    newNoteBtn.addEventListener('click', createNewNote);

    searchInput.addEventListener('input', (e) => {
      renderNotesList(e.target.value);
    });

    // Tab switching
    const tabAll = document.getElementById('tab-all');
    const tabFavorites = document.getElementById('tab-favorites');

    if (tabAll) {
      tabAll.addEventListener('click', () => {
        activeTab = 'all';
        tabAll.classList.add('active');
        tabFavorites?.classList.remove('active');
        renderNotesList(searchInput?.value || '');
      });
    }

    if (tabFavorites) {
      tabFavorites.addEventListener('click', () => {
        activeTab = 'favorites';
        tabFavorites.classList.add('active');
        tabAll?.classList.remove('active');
        renderNotesList(searchInput?.value || '');
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + N: New note
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        createNewNote();
      }

      // Ctrl/Cmd + F: Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f' && !e.shiftKey) {
        // Only if not inside editor
        if (!editorContainer.contains(document.activeElement)) {
          e.preventDefault();
          searchInput.focus();
        }
      }

      // Ctrl/Cmd + S: Force save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveCurrentNote();
      }

      // Ctrl/Cmd + Shift + D: Delete current note
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        handleDeleteCurrentNote();
      }

      // Ctrl/Cmd + Shift + Delete: Manual garbage collection
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Delete') {
        e.preventDefault();
        console.log('Manual garbage collection triggered by user');
        runManualGarbageCollection();
      }
    });
  }

  // Migrate from localStorage (old format) to IndexedDB
  async function migrateFromLocalStorage() {
    const oldData = localStorage.getItem('simple-notes-data');
    if (!oldData) {
      return;
    }

    try {
      const oldNotes = JSON.parse(oldData);
      if (Array.isArray(oldNotes) && oldNotes.length > 0) {
        for (const oldNote of oldNotes) {
          const newNote = {
            id: oldNote.id || generateId(),
            title: getTitleFromContent(oldNote.content),
            content: oldNote.content || '',
            tags: [],
            attachmentCount: 0,
            createdAt: oldNote.timestamp || Date.now(),
            updatedAt: oldNote.timestamp || Date.now(),
          };
          await saveNote(newNote);
        }

        // Remove old data after successful migration
        localStorage.removeItem('simple-notes-data');
        localStorage.removeItem('simple-notes-active');
        console.log('Migration from localStorage completed');
      }
    } catch (e) {
      console.error('Migration failed:', e);
    }
  }

  // Initialize
  async function init() {
    updateStatus('loading', t.loading);

    try {
      // Initialize storage
      await initDatabase();
      await initOPFS();

      // Migrate old data
      await migrateFromLocalStorage();

      // Load notes
      notes = await getAllNotes();

      // Create welcome note if empty
      if (notes.length === 0) {
        const welcomeNote = {
          id: generateId(),
          title: 'Welcome to S-Notes!',
          content: `# Welcome to S-Notes! 🎉

This is a **powerful note-taking app** with full Markdown support.

## Features
- ✅ Rich text editing with Markdown
- ✅ Image attachments stored locally
- ✅ Fast search across all notes
- ✅ All data stays private in your browser
- ✅ Auto-save as you type

## Markdown Examples

### Text Formatting
- **Bold text**
- *Italic text*
- ~~Strikethrough~~
- \`Inline code\`

### Code Block
\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

### Task List
- [x] Create a note
- [ ] Add an image
- [ ] Share with friends

### Table
| Feature | Status |
|---------|--------|
| Markdown | ✅ |
| Images | ✅ |
| Search | ✅ |

---
*Right-click on a note to delete it*`,
          tags: ['welcome'],
          attachmentCount: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        await saveNote(welcomeNote);
        notes = [welcomeNote];
      }

      // Initialize editor
      initEditor();

      // Render UI
      renderNotesList();
      attachEventListeners();

      // Load active note or first note
      const savedActiveId = localStorage.getItem('snotes-active');
      if (savedActiveId && notes.find((n) => n.id === savedActiveId)) {
        selectNote(savedActiveId);
      } else if (notes.length > 0) {
        selectNote(notes[0].id);
      } else {
        showEmptyState();
      }

      updateStatus('ready', t.ready);

      // Start garbage collection schedule after successful initialization
      console.log('Starting garbage collection scheduler...');
      scheduleGarbageCollection(30000); // Initial run after 30 seconds
    } catch (e) {
      console.error('Initialization failed:', e);
      updateStatus('error', t.error);
    }
  }

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Cleanup blob URLs when page unloads
  window.addEventListener('beforeunload', () => {
    cancelGarbageCollection();
    clearImageCaches();
    if (window.snotesImageUrls) {
      window.snotesImageUrls.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          /* ignore revoke errors */
        }
      });
    }
  });

  // Expose garbage collection functions for debugging
  window.snotesGC = {
    findOrphaned: findOrphanedAttachments,
    cleanup: cleanupOrphanedAttachments,
    runManual: runManualGarbageCollection,
    schedule: scheduleGarbageCollection,
  };
  if (typeof window !== 'undefined' && typeof window.methodLoad === 'function') {
    window.methodLoad();
  }
})();
