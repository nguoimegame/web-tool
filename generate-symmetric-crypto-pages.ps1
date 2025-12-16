# Generate all remaining crypto pages from AES encrypt template
# This script creates 15 custom Astro pages with proper settings

$pages = @(
    @{
        path = "aes/decrypt"
        title = "AES Decryption"
        desc = "This online tool helps you decrypt text or a file using AES. It supports various modes and padding schemes. It also supports PBKDF2 or EvpKDF, with customizable salt, iteration, and hash settings."
        h1 = "AES Decryption"
        button = "Decrypt"
        method = "aes.decrypt"
        options = "'key-size', 'mode', 'padding', 'key-type', 'passphrase', 'hash', 'custom-iteration', 'iteration', 'key', 'iv', 'salt-type', 'salt'"
        hasKeySize = $true
        script = "crypto-js"
    },
    @{
        path = "des/encrypt"
        title = "DES Encryption"
        desc = "This online tool helps you encrypt text or a file from local storage or a URL using DES. It supports various modes and padding schemes. It also supports PBKDF2 or EvpKDF, with customizable salt, iteration, and hash settings."
        h1 = "DES Encryption"
        button = "Encrypt"
        method = "des.encrypt"
        options = "'mode', 'padding', 'key-type', 'passphrase', 'hash', 'custom-iteration', 'iteration', 'key', 'iv', 'salt-type', 'salt'"
        hasKeySize = $false
        script = "crypto-js"
    },
    @{
        path = "des/decrypt"
        title = "DES Decryption"
        desc = "This online tool helps you decrypt text or a file using DES. It supports various modes and padding schemes. It also supports PBKDF2 or EvpKDF, with customizable salt, iteration, and hash settings."
        h1 = "DES Decryption"
        button = "Decrypt"
        method = "des.decrypt"
        options = "'mode', 'padding', 'key-type', 'passphrase', 'hash', 'custom-iteration', 'iteration', 'key', 'iv', 'salt-type', 'salt'"
        hasKeySize = $false
        script = "crypto-js"
    },
    @{
        path = "triple-des/encrypt"
        title = "Triple DES Encryption"
        desc = "This online tool helps you encrypt text or a file from local storage or a URL using Triple DES. It supports various modes and padding schemes. It also supports PBKDF2 or EvpKDF, with customizable salt, iteration, and hash settings."
        h1 = "Triple DES Encryption"
        button = "Encrypt"
        method = "tripleDes.encrypt"
        options = "'key-size', 'mode', 'padding', 'key-type', 'passphrase', 'hash', 'custom-iteration', 'iteration', 'key', 'iv', 'salt-type', 'salt'"
        hasKeySize = $true
        script = "crypto-js"
    },
    @{
        path = "triple-des/decrypt"
        title = "Triple DES Decryption"
        desc = "This online tool helps you decrypt text or a file using Triple DES. It supports various modes and padding schemes. It also supports PBKDF2 or EvpKDF, with customizable salt, iteration, and hash settings."
        h1 = "Triple DES Decryption"
        button = "Decrypt"
        method = "tripleDes.decrypt"
        options = "'key-size', 'mode', 'padding', 'key-type', 'passphrase', 'hash', 'custom-iteration', 'iteration', 'key', 'iv', 'salt-type', 'salt'"
        hasKeySize = $true
        script = "crypto-js"
    },
    @{
        path = "rc4/encrypt"
        title = "RC4 Encryption"
        desc = "This online tool helps you encrypt text or a file from local storage or a URL using RC4. RC4 is a stream cipher. It also supports PBKDF2 or EvpKDF, with customizable salt, iteration, and hash settings."
        h1 = "RC4 Encryption"
        button = "Encrypt"
        method = "rc4.encrypt"
        options = "'drop', 'key-type', 'passphrase', 'hash', 'custom-iteration', 'iteration', 'key', 'dk-size', 'salt-type', 'salt'"
        hasKeySize = $false
        isRC4 = $true
        script = "crypto-js"
    },
    @{
        path = "rc4/decrypt"
        title = "RC4 Decryption"
        desc = "This online tool helps you decrypt text or a file using RC4. RC4 is a stream cipher. It also supports PBKDF2 or EvpKDF, with customizable salt, iteration, and hash settings."
        h1 = "RC4 Decryption"
        button = "Decrypt"
        method = "rc4.decrypt"
        options = "'drop', 'key-type', 'passphrase', 'hash', 'custom-iteration', 'iteration', 'key', 'dk-size', 'salt-type', 'salt'"
        hasKeySize = $false
        isRC4 = $true
        script = "crypto-js"
    }
)

Write-Host "`n===== Generating Crypto Pages =====" -ForegroundColor Cyan
Write-Host "Generating $($pages.Count) symmetric crypto pages...`n" -ForegroundColor Yellow

# Read AES encrypt template
$templatePath = "src\pages\aes\encrypt\index.astro"
$template = Get-Content $templatePath -Raw

foreach ($page in $pages) {
    Write-Host "Creating: $($page.title)" -ForegroundColor Yellow
    
    # Create new content from template
    $content = $template
    
    # Replace title and description in frontmatter
    $content = $content -replace 'const title = "AES Encryption";', "const title = `"$($page.title)`";"
    $content = $content -replace 'const description = ".*?";', "const description = `"$($page.desc)`";"
    $content = $content -replace 'const activePage = "aes/encrypt/";', "const activePage = `"$($page.path)/`";"
    
    # Replace h1
    $content = $content -replace '<h1>AES Encryption</h1>', "<h1>$($page.h1)</h1>"
    
    # Replace description in paragraph
    $content = $content -replace '<p>This online tool helps you encrypt text or a file.*?</p>', "<p>$($page.desc)</p>"
    
    # Replace button text
    $content = $content -replace '<a class="btn" id="execute">Encrypt</a>', "<a class=`"btn`" id=`"execute`">$($page.button)</a>"
    
    # Replace method call
    $content = $content -replace "window\.method = withOptions\(aes\.encrypt, \['key-size',.*?\]\);", 
        "window.method = withOptions($($page.method), [$($page.options)]);"
    
    # Remove key-size setting if not needed (for DES)
    if (-not $page.hasKeySize) {
        $content = $content -replace '(?s)<div class="setting">\s*<label for="key-size">Key Size</label>.*?</select>\s*</div>', ''
    }
    
    # Handle RC4 specific changes (remove Mode and Padding, add Drop and DK Size)
    if ($page.isRC4) {
        # Remove Mode setting
        $content = $content -replace '(?s)<div class="setting">\s*<label for="mode">Mode</label>.*?</select>\s*</div>', ''
        
        # Remove Padding setting
        $content = $content -replace '(?s)<div class="setting" id="padding-block">.*?</select>\s*</div>', ''
        
        # Add Drop setting before key-type
        $dropSetting = @'
              <div class="setting">
                <label for="drop">Drop</label>
                <input type="number" id="drop" data-remember="drop" data-option="drop" data-share="drop" value="0" min="0" step="1">
              </div>
'@
        $content = $content -replace '(<div class="setting">\s*<label for="key-type">Key Type</label>)', "$dropSetting`n`$1"
        
        # Add DK Size after iteration
        $dkSetting = @'
                <div class="setting">
                  <label for="dk-size">Derived Key Size</label>
                  <input type="number" id="dk-size" data-remember="dk-size" data-option="dk-size" data-share="dk_size" value="8" min="1" step="1">
                </div>
'@
        $content = $content -replace '(</div>\s*</div>\s*<div class="setting" id="key-iv">)', "$dkSetting`n`$1"
        
        # Remove IV block (RC4 doesn't use IV)
        $content = $content -replace '(?s)<details class="setting-group" open id="iv-block">.*?</details>', ''
    }
    
    # Create directory if needed
    $astroPath = "src\pages\$($page.path)\index.astro"
    $astroDir = Split-Path $astroPath -Parent
    if (-not (Test-Path $astroDir)) {
        New-Item -ItemType Directory -Path $astroDir -Force | Out-Null
    }
    
    # Delete existing file
    if (Test-Path $astroPath) {
        Remove-Item $astroPath -Force
    }
    
    # Write file
    $content | Out-File -FilePath $astroPath -Encoding UTF8 -NoNewline
    
    Write-Host "  ✓ Created: $astroPath" -ForegroundColor Green
}

Write-Host "`n===== Complete! =====" -ForegroundColor Cyan
Write-Host "Generated $($pages.Count) symmetric crypto pages" -ForegroundColor Green
Write-Host "`nNext: Generate RSA and ECDSA pages separately (different structure)" -ForegroundColor Yellow
