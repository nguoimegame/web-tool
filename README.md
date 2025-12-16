# Astro Web Tools

A comprehensive, privacy-focused web toolkit built with Astro framework. This project provides a collection of cryptographic, encoding, and data transformation tools that run entirely in your browser - no data is sent to any server.

🌐 **Official Website**: [https://webtool.center/](https://webtool.center/)

## 📖 Overview

**Astro Web Tools** is a free, open-source collection of web-based utilities designed for developers, security professionals, and anyone who needs quick access to cryptographic and encoding tools. Built with the Astro framework for optimal performance and SEO, this project offers:

- **🔒 100% Client-Side Processing**: All operations happen in your browser. Your data never leaves your device, ensuring complete privacy and security.
- **⚡ Lightning Fast**: Built with Astro's static site generation for instant page loads and optimal performance.
- **🎯 No Installation Required**: Access all tools instantly through your web browser without any setup or installation.
- **📱 Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices.
- **🆓 Completely Free**: No registration, no subscriptions, no hidden costs. All tools are available for free.
- **🌐 Works Offline**: Once loaded, most tools can work without an internet connection.
- **🔧 Developer Friendly**: Clean interface with support for both text input and file processing.

Whether you need to hash a file, encrypt sensitive data, encode text, or generate a QR code, Astro Web Tools provides a fast, secure, and privacy-respecting solution.

![Web Tools Banner](public/images/web-tools-banner.png)

## ✨ Features & Tools

### 🔐 Cryptography & Hashing
- **Hash Functions**: MD2, MD4, MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512, SHA-512/224, SHA-512/256
- **SHA-3 Family**: SHA3-224, SHA3-256, SHA3-384, SHA3-512, SHAKE-128, SHAKE-256, cSHAKE-128, cSHAKE-256
- **BLAKE Family**: BLAKE2b, BLAKE2s, BLAKE3
- **Keccak**: Keccak-224, Keccak-256, Keccak-384, Keccak-512
- **RIPEMD**: RIPEMD-128, RIPEMD-160, RIPEMD-256, RIPEMD-320
- **KMAC**: KMAC-128, KMAC-256
- **Checksum**: CRC16, CRC32
- **Special**: Double SHA-256

### 🔑 Encryption & Digital Signatures
- **Symmetric Encryption**: AES, DES, Triple DES, RC4
- **Asymmetric Encryption**: RSA, ECDSA (Digital Signatures)

### 📝 Encoding & Decoding
- **Base Encoding**: Base32, Base58, Base64 (Text & File)
- **Hex Encoding**: Hexadecimal encode/decode (Text & File)
- **URL Encoding**: URL encode/decode
- **HTML Encoding**: HTML encode/decode

### 🛠️ Data & Text Tools
- **Case Conversion**: Various text case transformations
- **JSON Tools**: JSON formatting and validation
- **XML Tools**: XML formatting and validation
- **SQL Tools**: SQL formatting
- **QR Code**: QR code generator
- **Syntax Highlighting**: Code syntax highlighter

### 📁 File Processing
- Support for file hash calculation for all hash algorithms
- File encoding/decoding for Base32, Base58, Base64, Hex
- Drag-and-drop file support

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
