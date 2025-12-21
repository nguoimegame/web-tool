import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://quangit.github.io',
  output: 'static',
  build: {
    format: 'file'
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "vi", "zh", "hi", "es", "fr", "pt", "ja"],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
