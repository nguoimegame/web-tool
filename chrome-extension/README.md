# Web Tools Chrome Extension

Privacy-focused web toolkit as a Chrome Extension. All operations run locally in your browser.

## Features

- 🔐 **Hash Tools**: MD5, SHA256, SHA512, BLAKE2, RIPEMD, and more
- 📝 **Encoding**: Base64, Base32, Hex, URL, HTML encoding/decoding
- 🔒 **Cryptography**: AES, DES, RSA, ECDSA encryption & JWT tools
- 📋 **Format**: JSON, XML, SQL formatters and validators
- 📱 **QR Code**: Generator and reader
- 🖼️ **Image Tools**: Resize, optimize, crop & rotate
- 🔄 **Convert**: Case conversion, unit conversion, currency
- 🌐 **8 Languages**: EN, VI, ZH, HI, ES, FR, PT, JA

## Installation

### From Source (Development)

1. Build the extension:
   ```bash
   pnpm run build:extension
   ```

2. Open Chrome and navigate to `chrome://extensions`

3. Enable "Developer mode" (toggle in top right)

4. Click "Load unpacked"

5. Select the `chrome-extension-build` folder

### From Chrome Web Store

Coming soon!

## Usage

### Popup
Click the extension icon to access:
- Quick tools (MD5, SHA256, Base64, JSON, QR Code, JWT)
- "Open Full App" button to access all tools

### Context Menu
Right-click on selected text to:
- Hash with MD5 or SHA256
- Encode/Decode Base64
- URL Encode/Decode
- Open in Web Tools

### Full App
The complete web application runs locally within the extension with all 70+ tools.

## Development

### Project Structure

```
chrome-extension/
├── manifest.json      # Extension manifest (V3)
├── background.js      # Service worker
├── popup/
│   ├── popup.html    # Popup UI
│   └── popup.js      # Popup logic
├── icons/            # Extension icons
│   ├── icon-16.png
│   ├── icon-32.png
│   ├── icon-48.png
│   └── icon-128.png
└── README.md         # This file

chrome-extension-build/  # Built extension (generated)
├── app/              # Astro build output
├── manifest.json
├── background.js
├── popup/
└── icons/
```

### Build Commands

```bash
# Build extension
pnpm run build:extension

# Build and create ZIP for Chrome Web Store
pnpm run build:extension:zip
```

### Icons

Add your icons to `chrome-extension/icons/`:
- `icon-16.png` - 16x16 pixels
- `icon-32.png` - 32x32 pixels
- `icon-48.png` - 48x48 pixels
- `icon-128.png` - 128x128 pixels

Use PNG format with transparent background.

## Privacy

- ✅ All operations run locally in your browser
- ✅ No data sent to external servers
- ✅ No analytics or tracking
- ✅ Works completely offline

## Permissions

The extension requests minimal permissions:
- `storage` - Save user preferences
- `clipboardWrite` - Copy results to clipboard
- `clipboardRead` - Paste from clipboard (optional)

## License

MIT License - See main project LICENSE file.
