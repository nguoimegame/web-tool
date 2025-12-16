# Script to generate all Hash pages for Astro

$pages = @(
    @{name="SHA3-224"; file="sha3_224"; algo="sha3_224"; js="crypto-api.js"},
    @{name="SHA3-256"; file="sha3_256"; algo="sha3_256"; js="crypto-api.js"},
    @{name="SHA3-384"; file="sha3_384"; algo="sha3_384"; js="crypto-api.js"},
    @{name="SHA3-512"; file="sha3_512"; algo="sha3_512"; js="crypto-api.js"},
    @{name="Keccak-224"; file="keccak_224"; algo="keccak_224"; js="crypto-api.js"},
    @{name="Keccak-256"; file="keccak_256"; algo="keccak_256"; js="crypto-api.js"},
    @{name="Keccak-384"; file="keccak_384"; algo="keccak_384"; js="crypto-api.js"},
    @{name="Keccak-512"; file="keccak_512"; algo="keccak_512"; js="crypto-api.js"}
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
    
    $filePath = "d:\WorkSpace\all-web-tools\Astro\src\pages\$($page.file).astro"
    $content | Out-File -FilePath $filePath -Encoding UTF8
    Write-Host "Created: $filePath"
}

Write-Host "`nDone! Created $($pages.Count) pages."
