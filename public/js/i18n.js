// i18n (Internationalization) Handler
(function() {
  'use strict';

  const i18n = {
    currentLang: 'en',
    defaultLang: 'en',
    supportedLangs: ['en', 'vi'],

    // Initialize i18n system
    init: function() {
      // Get saved language or detect from browser
      const savedLang = localStorage.getItem('preferredLang');
      const browserLang = navigator.language.split('-')[0];
      
      // Determine which language to use
      let lang = this.defaultLang;
      if (savedLang && this.supportedLangs.includes(savedLang)) {
        lang = savedLang;
      } else if (this.supportedLangs.includes(browserLang)) {
        lang = browserLang;
      }
      
      this.currentLang = lang;
      this.setLanguage(lang, false);
      this.updateLanguageSwitcher();
    },

    // Set language and update all content
    setLanguage: function(lang, saveToStorage = true) {
      if (!this.supportedLangs.includes(lang)) {
        console.warn('Unsupported language:', lang);
        return;
      }

      this.currentLang = lang;

      // Save to localStorage
      if (saveToStorage) {
        localStorage.setItem('preferredLang', lang);
      }

      // Update HTML lang attribute
      document.documentElement.setAttribute('lang', lang);

      // Update meta tags
      this.updateMetaTags(lang);

      // Update all translatable elements
      this.translatePage();

      // Dispatch event for other scripts
      document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    },

    // Update meta tags for SEO
    updateMetaTags: function(lang) {
      const t = translations[lang];
      
      // Update title
      document.title = t.siteTitle;
      
      // Update meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', t.siteDescription);
      }
      
      // Update Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', t.siteTitle);
      
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', t.siteDescription);
      
      const ogLocale = document.querySelector('meta[property="og:locale"]');
      if (ogLocale) {
        const localeMap = {
          'en': 'en_US',
          'vi': 'vi_VN'
        };
        ogLocale.setAttribute('content', localeMap[lang] || 'en_US');
      }

      // Update content-language meta
      const contentLang = document.querySelector('meta[http-equiv="content-language"]');
      if (contentLang) {
        contentLang.setAttribute('content', lang);
      }
    },

    // Translate all elements with data-i18n attribute
    translatePage: function() {
      const t = translations[this.currentLang];
      
      // Translate elements with data-i18n attribute
      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (t[key]) {
          element.textContent = t[key];
        }
      });

      // Translate placeholders
      document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (t[key]) {
          element.setAttribute('placeholder', t[key]);
        }
      });

      // Translate titles/tooltips
      document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        if (t[key]) {
          element.setAttribute('title', t[key]);
        }
      });
    },

    // Update language switcher UI
    updateLanguageSwitcher: function() {
      const langSelect = document.getElementById('lang-select');
      if (langSelect) {
        langSelect.value = this.currentLang;
      }
    },

    // Get translation by key
    t: function(key) {
      return translations[this.currentLang][key] || translations[this.defaultLang][key] || key;
    },

    // Switch language (called from UI)
    switchLanguage: function(lang) {
      this.setLanguage(lang);
    }
  };

  // Make i18n available globally
  window.i18n = i18n;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
  } else {
    i18n.init();
  }
})();
