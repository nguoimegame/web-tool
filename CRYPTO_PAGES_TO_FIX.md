# Danh sách 16 trang Crypto cần fix custom

Các trang này KHÔNG thể dùng EncodingPage component vì cần custom settings UI phức tạp và withOptions() wrapper.

## Tình trạng

| STT | Đường dẫn | Trạng thái | Method | Options Count |
|-----|-----------|------------|--------|---------------|
| 1 | aes/encrypt | ✅ ĐÃ FIX | aes.encrypt | 12 options |
| 2 | aes/decrypt | ❌ CẦN FIX | aes.decrypt | 12 options |
| 3 | des/encrypt | ❌ CẦN FIX | des.encrypt | 11 options |
| 4 | des/decrypt | ❌ CẦN FIX | des.decrypt | 11 options |
| 5 | triple-des/encrypt | ❌ CẦN FIX | tripleDes.encrypt | 12 options |
| 6 | triple-des/decrypt | ❌ CẦN FIX | tripleDes.decrypt | 12 options |
| 7 | rc4/encrypt | ❌ CẦN FIX | rc4.encrypt | 10 options |
| 8 | rc4/decrypt | ❌ CẦN FIX | rc4.decrypt | 10 options |
| 9 | rsa/key-generator | ❌ CẦN FIX | rsa.generate | 5 options |
| 10 | rsa/sign | ❌ CẦN FIX | rsa.sign | ? options |
| 11 | rsa/verify | ❌ CẦN FIX | rsa.verify | ? options |
| 12 | rsa/encrypt | ❌ CẦN FIX | rsa.encrypt | 2 options |
| 13 | rsa/decrypt | ❌ CẦN FIX | rsa.decrypt | ? options |
| 14 | ecdsa/key-generator | ❌ CẤN FIX | ecdsa.generate | ? options |
| 15 | ecdsa/sign | ❌ CẦN FIX | ecdsa.sign | 5 options |
| 16 | ecdsa/verify | ❌ CẦN FIX | ecdsa.verify | ? options |

## Chi tiết từng trang

### 1. AES Encryption ✅ (ĐÃ FIX)
- **Path**: `src/pages/aes/encrypt/index.astro`
- **Method**: `withOptions(aes.encrypt, [...])`
- **Options**: `'key-size', 'mode', 'padding', 'key-type', 'passphrase', 'hash', 'custom-iteration', 'iteration', 'key', 'iv', 'salt-type', 'salt'`
- **Settings UI**: Key Size dropdown, Mode dropdown, Padding dropdown, Key Type dropdown, Passphrase input, Hash dropdown, Salt settings, Iteration settings, Custom Key/IV inputs
- **Scripts**: crypto-js CDN, crypto-js.js wrapper, encoding.js, clipboard.min.js, file-loader.js

### 2. AES Decryption
- **Path**: `src/pages/aes/decrypt/index.astro`
- **Method**: `withOptions(aes.decrypt, [...])`
- **Options**: `'key-size', 'mode', 'padding', 'key-type', 'passphrase', 'hash', 'custom-iteration', 'iteration', 'key', 'iv', 'salt-type', 'salt'`
- **Settings UI**: Giống AES Encryption
- **Button**: "Decrypt"

### 3. DES Encryption
- **Path**: `src/pages/des/encrypt/index.astro`
- **Method**: `withOptions(des.encrypt, [...])`
- **Options**: `'mode', 'padding', 'key-type', 'passphrase', 'hash', 'custom-iteration', 'iteration', 'key', 'iv', 'salt-type', 'salt'`
- **Settings UI**: Không có Key Size (DES cố định 56-bit), còn lại giống AES
- **Button**: "Encrypt"

### 4. DES Decryption
- **Path**: `src/pages/des/decrypt/index.astro`
- **Method**: `withOptions(des.decrypt, [...])`
- **Options**: `'mode', 'padding', 'key-type', 'passphrase', 'hash', 'custom-iteration', 'iteration', 'key', 'iv', 'salt-type', 'salt'`
- **Settings UI**: Giống DES Encryption
- **Button**: "Decrypt"

### 5. Triple DES Encryption
- **Path**: `src/pages/triple-des/encrypt/index.astro`
- **Method**: `withOptions(tripleDes.encrypt, [...])`
- **Options**: `'key-size', 'mode', 'padding', 'key-type', 'passphrase', 'hash', 'custom-iteration', 'iteration', 'key', 'iv', 'salt-type', 'salt'`
- **Settings UI**: Giống AES (có Key Size: 128/192 bits)
- **Button**: "Encrypt"

### 6. Triple DES Decryption
- **Path**: `src/pages/triple-des/decrypt/index.astro`
- **Method**: `withOptions(tripleDes.decrypt, [...])`
- **Options**: `'key-size', 'mode', 'padding', 'key-type', 'passphrase', 'hash', 'custom-iteration', 'iteration', 'key', 'iv', 'salt-type', 'salt'`
- **Settings UI**: Giống Triple DES Encryption
- **Button**: "Decrypt"

### 7. RC4 Encryption
- **Path**: `src/pages/rc4/encrypt/index.astro`
- **Method**: `withOptions(rc4.encrypt, [...])`
- **Options**: `'drop', 'key-type', 'passphrase', 'hash', 'custom-iteration', 'iteration', 'key', 'dk-size', 'salt-type', 'salt'`
- **Settings UI**: Drop bytes setting, DK Size, không có Mode/Padding (RC4 là stream cipher)
- **Button**: "Encrypt"

### 8. RC4 Decryption
- **Path**: `src/pages/rc4/decrypt/index.astro`
- **Method**: `withOptions(rc4.decrypt, [...])`
- **Options**: `'drop', 'key-type', 'passphrase', 'hash', 'custom-iteration', 'iteration', 'key', 'dk-size', 'salt-type', 'salt'`
- **Settings UI**: Giống RC4 Encryption
- **Button**: "Decrypt"

### 9. RSA Key Generator
- **Path**: `src/pages/rsa/key-generator/index.astro`
- **Method**: `withOptions(rsa.generate, [...])`
- **Options**: `'rsa-bits', 'pem-format', 'cipher-algorithm', 'passphrase-enabled', 'passphrase'`
- **Settings UI**: RSA Bits dropdown (1024/2048/3072/4096), PEM Format checkbox, Cipher Algorithm dropdown, Passphrase settings
- **Button**: "Generate Keys"
- **Scripts**: rsa.js thay vì crypto-js

### 10. RSA Sign
- **Path**: `src/pages/rsa/sign/index.astro`
- **Method**: `withOptions(rsa.sign, [...])`
- **Settings UI**: Private Key input, Algorithm dropdown, Passphrase
- **Button**: "Sign"
- **Scripts**: rsa.js

### 11. RSA Verify
- **Path**: `src/pages/rsa/verify/index.astro`
- **Method**: `withOptions(rsa.verify, [...])`
- **Settings UI**: Public Key input, Signature input, Algorithm dropdown
- **Button**: "Verify"
- **Scripts**: rsa.js

### 12. RSA Encryption
- **Path**: `src/pages/rsa/encrypt/index.astro`
- **Method**: `withOptions(rsa.encrypt, [...])`
- **Options**: `'rsa-algorithm', 'public-key'`
- **Settings UI**: RSA Algorithm dropdown (PKCS1-v1_5, OAEP), Public Key input
- **Button**: "Encrypt"
- **Scripts**: rsa.js

### 13. RSA Decryption
- **Path**: `src/pages/rsa/decrypt/index.astro`
- **Method**: `withOptions(rsa.decrypt, [...])`
- **Settings UI**: RSA Algorithm dropdown, Private Key input, Passphrase
- **Button**: "Decrypt"
- **Scripts**: rsa.js

### 14. ECDSA Key Generator
- **Path**: `src/pages/ecdsa/key-generator/index.astro`
- **Method**: `withOptions(ecdsa.generate, [...])`
- **Settings UI**: Curve dropdown (P-256, P-384, P-521, secp256k1), PEM Format
- **Button**: "Generate Keys"
- **Scripts**: ecdsa.js

### 15. ECDSA Sign
- **Path**: `src/pages/ecdsa/sign/index.astro`
- **Method**: `withOptions(ecdsa.sign, [...])`
- **Options**: `'curve', 'private-key-input-type', 'private-key', 'algorithm', 'passphrase'`
- **Settings UI**: Curve dropdown, Private Key input, Algorithm dropdown (SHA-256, SHA-384, SHA-512), Passphrase
- **Button**: "Sign"
- **Scripts**: ecdsa.js

### 16. ECDSA Verify
- **Path**: `src/pages/ecdsa/verify/index.astro`
- **Method**: `withOptions(ecdsa.verify, [...])`
- **Settings UI**: Curve dropdown, Public Key input, Signature input, Algorithm dropdown
- **Button**: "Verify"
- **Scripts**: ecdsa.js

## Cách fix

### Template từ AES Encryption
Sử dụng `src/pages/aes/encrypt/index.astro` làm template:

1. Copy toàn bộ file AES encrypt
2. Thay đổi:
   - Title và description
   - activePage path
   - Button text (Encrypt/Decrypt/Generate/Sign/Verify)
   - window.method call với method và options tương ứng
   - Script loading (crypto-js.js / rsa.js / ecdsa.js)
3. Copy phần settings HTML từ file HTML gốc tương ứng

### Scripts cần load

**AES, DES, Triple-DES, RC4:**
```javascript
// Load crypto-js from CDN
++waitLoadCount;
delayScripts.push({
  src: 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js',
  onload: function () { methodLoad(); }
});

// Load crypto-js wrapper
++waitLoadCount;
delayScripts.push({
  src: '/js/crypto-js.js?v=5',
  onload: function() {
    window.method = withOptions(METHOD_HERE, [OPTIONS_HERE]);
    methodLoad();
  }
});
```

**RSA:**
```javascript
++waitLoadCount;
delayScripts.push({
  src: '/js/rsa.js?v=1',
  onload: function() {
    window.method = withOptions(rsa.METHOD, [OPTIONS]);
    methodLoad();
  }
});
```

**ECDSA:**
```javascript
++waitLoadCount;
delayScripts.push({
  src: '/js/ecdsa.js?v=1',
  onload: function() {
    window.method = withOptions(ecdsa.METHOD, [OPTIONS]);
    methodLoad();
  }
});
```

## Ưu tiên

1. **High Priority** (8 trang): AES decrypt, DES encrypt/decrypt, Triple-DES encrypt/decrypt, RC4 encrypt/decrypt
   - Lý do: Symmetric encryption là use case phổ biến nhất

2. **Medium Priority** (5 trang): RSA key-generator, RSA encrypt/decrypt, RSA sign, RSA verify
   - Lý do: Asymmetric encryption cũng quan trọng

3. **Low Priority** (3 trang): ECDSA key-generator, ECDSA sign, ECDSA verify
   - Lý do: Ít dùng hơn RSA

## Ước tính thời gian

- Mỗi trang: ~5-10 phút (copy HTML settings + modify scripts)
- **Tổng**: ~1.5 - 2.5 giờ cho 15 trang còn lại
