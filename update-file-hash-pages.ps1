# Script to update all file hash pages to use FileHashPage component

$pages = @(
    "md2_file_hash.astro",
    "md4_file_hash.astro",
    "md5_checksum.astro",
    "sha1_checksum.astro",
    "sha224_checksum.astro",
    "sha256_checksum.astro",
    "sha384_file_hash.astro",
    "sha512_file_hash.astro",
    "sha512_224_file_hash.astro",
    "sha512_256_file_hash.astro",
    "sha3_224_checksum.astro",
    "sha3_256_checksum.astro",
    "sha3_384_checksum.astro",
    "sha3_512_checksum.astro",
    "keccak_224_checksum.astro",
    "keccak_256_checksum.astro",
    "keccak_384_checksum.astro",
    "keccak_512_checksum.astro",
    "shake_128_checksum.astro",
    "shake_256_checksum.astro",
    "cshake128_file_hash.astro",
    "cshake256_file_hash.astro",
    "kmac128_file_hash.astro",
    "kmac256_file_hash.astro",
    "ripemd_128_checksum.astro",
    "ripemd_160_checksum.astro",
    "ripemd_256_checksum.astro",
    "ripemd_320_checksum.astro",
    "blake2b_file_hash.astro",
    "blake2s_file_hash.astro",
    "blake3_file_hash.astro",
    "crc16_checksum.astro",
    "crc32_checksum.astro"
)

$pagesDir = "src\pages"

foreach ($pageName in $pages) {
    $filePath = Join-Path $pagesDir $pageName
    
    if (Test-Path $filePath) {
        $content = Get-Content -Path $filePath -Raw
        
        # Replace HashPage with FileHashPage
        $content = $content -replace "import HashPage from '../components/HashPage.astro';", "import FileHashPage from '../components/FileHashPage.astro';"
        $content = $content -replace "<HashPage ", "<FileHashPage "
        $content = $content -replace "</HashPage>", "</FileHashPage>"
        
        # Update description to match HTML original
        if ($pageName -match "^md2_file_hash") {
            $content = $content -replace 'const description = ".*?";', 'const description = "This MD2 online tool helps you calculate the hash of a file from local or URL using MD2 without uploading the file. It also supports HMAC.";'
        }
        elseif ($pageName -match "^md4_file_hash") {
            $content = $content -replace 'const description = ".*?";', 'const description = "This MD4 online tool helps you calculate the hash of a file from local or URL using MD4 without uploading the file. It also supports HMAC.";'
        }
        elseif ($pageName -match "^md5_checksum") {
            $content = $content -replace 'const description = ".*?";', 'const description = "This MD5 online tool helps you calculate the hash of a file from local or URL using MD5 without uploading the file. It also supports HMAC.";'
        }
        
        Set-Content -Path $filePath -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Updated: $pageName"
    }
}

Write-Host "Done! Updated $($pages.Count) file hash pages."
