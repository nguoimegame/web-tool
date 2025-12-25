/**
 * JWT Encoder/Decoder Cross-Page Data Synchronization
 * Synchronizes JWT data between encoder and decoder pages using localStorage
 */

(function () {
  'use strict';

  // Shared localStorage keys for JWT data
  const JWT_SYNC_KEYS = {
    TOKEN: 'JWT_SYNC_TOKEN',
    HEADER: 'JWT_SYNC_HEADER',
    PAYLOAD: 'JWT_SYNC_PAYLOAD',
    SECRET: 'JWT_SYNC_SECRET',
    ENCODING: 'JWT_SYNC_ENCODING',
  };

  /**
   * Save JWT data to shared storage
   */
  window.saveJwtToSharedStorage = function (data) {
    try {
      if (data.token) {
        localStorage.setItem(JWT_SYNC_KEYS.TOKEN, data.token);
      }
      if (data.header) {
        localStorage.setItem(JWT_SYNC_KEYS.HEADER, JSON.stringify(data.header));
      }
      if (data.payload) {
        localStorage.setItem(JWT_SYNC_KEYS.PAYLOAD, JSON.stringify(data.payload));
      }
      if (data.secret !== undefined) {
        localStorage.setItem(JWT_SYNC_KEYS.SECRET, data.secret);
      }
      if (data.encoding) {
        localStorage.setItem(JWT_SYNC_KEYS.ENCODING, data.encoding);
      }
    } catch (e) {
      console.error('Failed to save JWT data to shared storage:', e);
    }
  };

  /**
   * Load JWT data from shared storage
   */
  window.loadJwtFromSharedStorage = function () {
    try {
      const data = {
        token: localStorage.getItem(JWT_SYNC_KEYS.TOKEN),
        secret: localStorage.getItem(JWT_SYNC_KEYS.SECRET) || '',
        encoding: localStorage.getItem(JWT_SYNC_KEYS.ENCODING) || 'utf-8',
      };

      const headerStr = localStorage.getItem(JWT_SYNC_KEYS.HEADER);
      const payloadStr = localStorage.getItem(JWT_SYNC_KEYS.PAYLOAD);

      if (headerStr) {
        try {
          data.header = JSON.parse(headerStr);
        } catch (e) {
          console.error('Failed to parse header from shared storage:', e);
        }
      }

      if (payloadStr) {
        try {
          data.payload = JSON.parse(payloadStr);
        } catch (e) {
          console.error('Failed to parse payload from shared storage:', e);
        }
      }

      return data;
    } catch (e) {
      console.error('Failed to load JWT data from shared storage:', e);
      return {};
    }
  };

  /**
   * Listen for localStorage changes from other tabs/windows
   */
  window.addEventListener('storage', function (e) {
    // Only react to JWT sync keys
    if (!Object.values(JWT_SYNC_KEYS).includes(e.key)) {
      return;
    }

    // Trigger a custom event that pages can listen to
    const event = new CustomEvent('jwtSyncUpdate', {
      detail: {
        key: e.key,
        oldValue: e.oldValue,
        newValue: e.newValue,
      },
    });
    window.dispatchEvent(event);
  });
})();
