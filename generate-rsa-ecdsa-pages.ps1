# Generate RSA and ECDSA pages
# These have simpler structure than symmetric crypto (no complex derivation settings)

$pages = @(
    @{
        path = "rsa/key-generator"
        title = "RSA Key Generator"
        desc = "Generate RSA key pairs online. Supports PKCS#1, PKCS#5, and PKCS#8 formats with optional encryption."
        h1 = "RSA Key Generator"
        button = "Generate"
        method = "rsa.generate"
        options = "'rsa-bits', 'pem-format', 'cipher-algorithm', 'passphrase-enabled', 'passphrase'"
        script = "rsa"
        type = "rsa-keygen"
    },
    @{
        path = "rsa/encrypt"
        title = "RSA Encryption"
        desc = "Encrypt text or files using RSA public key encryption. Supports PKCS#1 and OAEP padding schemes."
        h1 = "RSA Encryption"
        button = "Encrypt"
        method = "rsa.encrypt"
        options = "'rsa-algorithm', 'public-key'"
        script = "rsa"
        type = "rsa-encrypt"
    },
    @{
        path = "rsa/decrypt"
        title = "RSA Decryption"
        desc = "Decrypt RSA encrypted text or files using RSA private key. Supports PKCS#1 and OAEP padding schemes."
        h1 = "RSA Decryption"
        button = "Decrypt"
        method = "rsa.decrypt"
        options = "'rsa-algorithm', 'private-key', 'passphrase'"
        script = "rsa"
        type = "rsa-decrypt"
    },
    @{
        path = "rsa/sign"
        title = "RSA Sign Message"
        desc = "Sign messages using RSA private key. Supports various hash algorithms (SHA-256, SHA-384, SHA-512)."
        h1 = "RSA Sign Message"
        button = "Sign"
        method = "rsa.sign"
        options = "'hash-algorithm', 'private-key', 'passphrase'"
        script = "rsa"
        type = "rsa-sign"
    },
    @{
        path = "rsa/verify"
        title = "RSA Verify Signature"
        desc = "Verify RSA signatures using public key. Supports various hash algorithms (SHA-256, SHA-384, SHA-512)."
        h1 = "RSA Verify Signature"
        button = "Verify"
        method = "rsa.verify"
        options = "'hash-algorithm', 'public-key', 'signature'"
        script = "rsa"
        type = "rsa-verify"
    },
    @{
        path = "ecdsa/key-generator"
        title = "ECDSA Key Generator"
        desc = "Generate ECDSA key pairs online. Supports P-256, P-384, P-521, and secp256k1 curves."
        h1 = "ECDSA Key Generator"
        button = "Generate"
        method = "ecdsa.generate"
        options = "'curve', 'pem-format'"
        script = "ecdsa"
        type = "ecdsa-keygen"
    },
    @{
        path = "ecdsa/sign"
        title = "ECDSA Sign Message"
        desc = "Sign messages using ECDSA private key. Supports P-256, P-384, P-521, and secp256k1 curves."
        h1 = "ECDSA Sign Message"
        button = "Sign"
        method = "ecdsa.sign"
        options = "'curve', 'private-key-input-type', 'private-key', 'algorithm', 'passphrase'"
        script = "ecdsa"
        type = "ecdsa-sign"
    },
    @{
        path = "ecdsa/verify"
        title = "ECDSA Verify Signature"
        desc = "Verify ECDSA signatures using public key. Supports P-256, P-384, P-521, and secp256k1 curves."
        h1 = "ECDSA Verify Signature"
        button = "Verify"
        method = "ecdsa.verify"
        options = "'curve', 'public-key-input-type', 'public-key', 'algorithm', 'signature'"
        script = "ecdsa"
        type = "ecdsa-verify"
    }
)

Write-Host "`n===== Generating RSA and ECDSA Pages =====" -ForegroundColor Cyan
Write-Host "Generating $($pages.Count) asymmetric crypto pages...`n" -ForegroundColor Yellow

# Simple template - will be manually customized if needed
$baseTemplate = @'
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import Sidebar from '../../../components/Sidebar.astro';
import EncodingPage from '../../../components/EncodingPage.astro';

const title = "TITLE_HERE";
const description = "DESC_HERE";
const toolName = "BUTTON_HERE";
const jsFile = "SCRIPT_HERE.js?v=1";
const activePage = "PATH_HERE/";
const reverseLink = "";
---

<EncodingPage 
    title={title}
    description={description}
    toolName={toolName}
    jsFile={jsFile}
    activePage={activePage}
    reverseLink={reverseLink}
    hasInputSettings={false}
    hasOutputSettings={false}
    hasFormatSettings={false}
/>
'@

foreach ($page in $pages) {
    Write-Host "Creating: $($page.title)" -ForegroundColor Yellow
    
    $content = $baseTemplate
    $content = $content -replace 'TITLE_HERE', $page.title
    $content = $content -replace 'DESC_HERE', $page.desc
    $content = $content -replace 'BUTTON_HERE', $page.button
    $content = $content -replace 'SCRIPT_HERE', $page.script
    $content = $content -replace 'PATH_HERE', $page.path
    
    # Create directory
    $astroPath = "src\pages\$($page.path)\index.astro"
    $astroDir = Split-Path $astroPath -Parent
    if (-not (Test-Path $astroDir)) {
        New-Item -ItemType Directory -Path $astroDir -Force | Out-Null
    }
    
    # Delete existing
    if (Test-Path $astroPath) {
        Remove-Item $astroPath -Force
    }
    
    # Write file
    $content | Out-File -FilePath $astroPath -Encoding UTF8 -NoNewline
    
    Write-Host "  ✓ Created: $astroPath" -ForegroundColor Green
    Write-Host "  ⚠️  Note: This uses EncodingPage - may need custom settings later" -ForegroundColor Yellow
}

Write-Host "`n===== Complete! =====" -ForegroundColor Cyan
Write-Host "Generated $($pages.Count) RSA/ECDSA pages" -ForegroundColor Green
Write-Host "`n⚠️  Important: RSA/ECDSA pages use EncodingPage for now." -ForegroundColor Yellow
Write-Host "They may need custom implementations if withOptions() doesn't work." -ForegroundColor Yellow
Write-Host "`nTotal crypto pages fixed: 1 (AES encrypt manual) + 7 (symmetric script) + 8 (RSA/ECDSA) = 16/16 ✓" -ForegroundColor Green
