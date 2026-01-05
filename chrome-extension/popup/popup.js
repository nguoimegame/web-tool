// Popup script for Web Tools Chrome Extension

const APP_LANG = 'en';

// Get the extension URL for the app
function getAppUrl(path = '') {
  let fullPath;
  if (!path) {
    // Home page - /app/en.html
    fullPath = `app/${APP_LANG}.html`;
  } else {
    // Tool page - /app/en/path.html
    fullPath = `app/${APP_LANG}/${path}`;
    if (!path.endsWith('.html') && !path.endsWith('/')) {
      fullPath += '.html';
    }
  }
  return chrome.runtime.getURL(fullPath);
}

// Open the full app in a new tab
function openApp(path = '') {
  chrome.tabs.create({ url: getAppUrl(path) });
  window.close();
}

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  // Open full app button
  document.getElementById('open-app').addEventListener('click', () => {
    openApp();
  });

  // Open in new tab button
  document.getElementById('open-tab').addEventListener('click', () => {
    openApp();
  });

  // Quick tool buttons
  document.querySelectorAll('.tool-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tool = item.dataset.tool;
      if (tool) {
        openApp(tool);
      }
    });
  });

  // Load user's preferred language from storage
  chrome.storage.local.get(['preferredLanguage'], (result) => {
    if (result.preferredLanguage) {
      // Update APP_BASE with preferred language
      // For now, we default to English
    }
  });
});

// Listen for keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Enter to open app
  if (e.key === 'Enter') {
    openApp();
  }
  // Escape to close popup
  if (e.key === 'Escape') {
    window.close();
  }
});
