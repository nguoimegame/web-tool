# Astro Web Tools

This is a migration of the Web Tools project to Astro framework.

## 🚀 Project Structure

```
/
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   └── pages/
│       └── index.astro
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 🧞 Commands

All commands are run from the root of the project (Astro folder):

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |

## 📦 Installation

1. Navigate to the Astro folder:
   ```bash
   cd Astro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy assets from the parent directory:
   ```bash
   # Copy CSS files
   xcopy /E /I ..\css public\css
   
   # Copy JS files
   xcopy /E /I ..\js public\js
   
   # Copy images
   xcopy /E /I ..\images public\images
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Features

- Static site generation with Astro
- All original features preserved
- Improved performance with Astro's optimizations
- Easy to extend with components

## 📝 Notes

This project has been converted from plain HTML to Astro framework. The main index page is now located at `src/pages/index.astro` and uses a base layout at `src/layouts/BaseLayout.astro`.
