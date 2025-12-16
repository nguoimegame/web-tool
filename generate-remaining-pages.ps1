# Script to generate remaining Hash pages for Astro

$pages = @(
    @{name="Double SHA256"; file="double_sha256"; algo="double_sha256"; js="crypto-api.js"},
    @{name="SHAKE128"; file="shake128"; algo="shake128"; js="hash-wasm.js"; folder=$true},
    @{name="SHAKE256"; file="shake256"; algo="shake256"; js="hash-wasm.js"; folder=$true},
    @{name="cSHAKE128"; file="cshake128"; algo="cshake128"; js="hash-wasm.js"; folder=$true},
    @{name="cSHAKE256"; file="cshake256"; algo="cshake256"; js="hash-wasm.js"; folder=$true},
    @{name="KMAC128"; file="kmac128"; algo="kmac128"; js="hash-wasm.js"; folder=$true},
    @{name="KMAC256"; file="kmac256"; algo="kmac256"; js="hash-wasm.js"; folder=$true},
    @{name="RIPEMD-128"; file="ripemd-128"; algo="ripemd_128"; js="crypto-api.js"; folder=$true},
    @{name="RIPEMD-160"; file="ripemd-160"; algo="ripemd_160"; js="crypto-api.js"; folder=$true},
    @{name="RIPEMD-256"; file="ripemd-256"; algo="ripemd_256"; js="crypto-api.js"; folder=$true},
    @{name="RIPEMD-320"; file="ripemd-320"; algo="ripemd_320"; js="crypto-api.js"; folder=$true},
    @{name="BLAKE2b"; file="blake2b"; algo="blake2b"; js="hash-wasm.js"; folder=$true},
    @{name="BLAKE2s"; file="blake2s"; algo="blake2s"; js="hash-wasm.js"; folder=$true},
    @{name="BLAKE3"; file="blake3"; algo="blake3"; js="blake3.js"; folder=$true}
)

$template = @'
---
import HashPage from '../components/HashPage.astro';
---

<HashPage 
  title="{{NAME}}"
  description="This {{NAME}} online tool helps you calculate hashes from strings. You can input UTF-8, UTF-16, Hex, Base64, or other encodings. It also supports HMAC."
  algorithmName="{{ALGO}}"
  jsFile="{{JS}}"
  activePage="{{FILE}}"
/>
'@

foreach ($page in $pages) {
    $content = $template `
        -replace '{{NAME}}', $page.name `
        -replace '{{ALGO}}', $page.algo `
        -replace '{{JS}}', $page.js `
        -replace '{{FILE}}', $page.file
    
    if ($page.folder) {
        $dir = "d:\WorkSpace\all-web-tools\Astro\src\pages\$($page.file)"
        if (!(Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }
        $filePath = "$dir\index.astro"
    } else {
        $filePath = "d:\WorkSpace\all-web-tools\Astro\src\pages\$($page.file).astro"
    }
    
    $content | Out-File -FilePath $filePath -Encoding UTF8
    Write-Host "Created: $filePath"
}

Write-Host "`nDone! Created $($pages.Count) pages."
