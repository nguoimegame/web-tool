# Script to generate file hash pages for Astro

$pages = @(
    @{Name="MD2 File Hash"; Algorithm="MD2"; JsFile="md2.min.js"; Path="md2_file_hash.astro"},
    @{Name="MD4 File Hash"; Algorithm="MD4"; JsFile="md4.min.js"; Path="md4_file_hash.astro"},
    @{Name="MD5 Checksum"; Algorithm="MD5"; JsFile="md5.min.js"; Path="md5_checksum.astro"},
    @{Name="SHA1 Checksum"; Algorithm="SHA1"; JsFile="crypto-js.js"; Path="sha1_checksum.astro"},
    @{Name="SHA224 Checksum"; Algorithm="SHA224"; JsFile="crypto-js.js"; Path="sha224_checksum.astro"},
    @{Name="SHA256 Checksum"; Algorithm="SHA256"; JsFile="crypto-js.js"; Path="sha256_checksum.astro"},
    @{Name="SHA384 File Hash"; Algorithm="SHA384"; JsFile="crypto-js.js"; Path="sha384_file_hash.astro"},
    @{Name="SHA512 File Hash"; Algorithm="SHA512"; JsFile="crypto-js.js"; Path="sha512_file_hash.astro"},
    @{Name="SHA512/224 File Hash"; Algorithm="SHA512/224"; JsFile="crypto-api.js"; Path="sha512_224_file_hash.astro"},
    @{Name="SHA512/256 File Hash"; Algorithm="SHA512/256"; JsFile="crypto-api.js"; Path="sha512_256_file_hash.astro"},
    @{Name="SHA3-224 Checksum"; Algorithm="SHA3-224"; JsFile="crypto-js.js"; Path="sha3_224_checksum.astro"},
    @{Name="SHA3-256 Checksum"; Algorithm="SHA3-256"; JsFile="crypto-js.js"; Path="sha3_256_checksum.astro"},
    @{Name="SHA3-384 Checksum"; Algorithm="SHA3-384"; JsFile="crypto-js.js"; Path="sha3_384_checksum.astro"},
    @{Name="SHA3-512 Checksum"; Algorithm="SHA3-512"; JsFile="crypto-js.js"; Path="sha3_512_checksum.astro"},
    @{Name="Keccak-224 Checksum"; Algorithm="Keccak-224"; JsFile="keccak.min.js"; Path="keccak_224_checksum.astro"},
    @{Name="Keccak-256 Checksum"; Algorithm="Keccak-256"; JsFile="keccak.min.js"; Path="keccak_256_checksum.astro"},
    @{Name="Keccak-384 Checksum"; Algorithm="Keccak-384"; JsFile="keccak.min.js"; Path="keccak_384_checksum.astro"},
    @{Name="Keccak-512 Checksum"; Algorithm="Keccak-512"; JsFile="keccak.min.js"; Path="keccak_512_checksum.astro"},
    @{Name="SHAKE-128 Checksum"; Algorithm="SHAKE-128"; JsFile="hash-wasm.js"; Path="shake_128_checksum.astro"},
    @{Name="SHAKE-256 Checksum"; Algorithm="SHAKE-256"; JsFile="hash-wasm.js"; Path="shake_256_checksum.astro"},
    @{Name="cSHAKE128 File Hash"; Algorithm="cSHAKE128"; JsFile="hash-wasm.js"; Path="cshake128_file_hash.astro"},
    @{Name="cSHAKE256 File Hash"; Algorithm="cSHAKE256"; JsFile="hash-wasm.js"; Path="cshake256_file_hash.astro"},
    @{Name="KMAC128 File Hash"; Algorithm="KMAC128"; JsFile="hash-wasm.js"; Path="kmac128_file_hash.astro"},
    @{Name="KMAC256 File Hash"; Algorithm="KMAC256"; JsFile="hash-wasm.js"; Path="kmac256_file_hash.astro"},
    @{Name="RIPEMD-128 Checksum"; Algorithm="RIPEMD-128"; JsFile="crypto-api.js"; Path="ripemd_128_checksum.astro"},
    @{Name="RIPEMD-160 Checksum"; Algorithm="RIPEMD-160"; JsFile="crypto-js.js"; Path="ripemd_160_checksum.astro"},
    @{Name="RIPEMD-256 Checksum"; Algorithm="RIPEMD-256"; JsFile="crypto-api.js"; Path="ripemd_256_checksum.astro"},
    @{Name="RIPEMD-320 Checksum"; Algorithm="RIPEMD-320"; JsFile="crypto-api.js"; Path="ripemd_320_checksum.astro"},
    @{Name="BLAKE2b File Hash"; Algorithm="BLAKE2b"; JsFile="blake2b.min.js"; Path="blake2b_file_hash.astro"},
    @{Name="BLAKE2s File Hash"; Algorithm="BLAKE2s"; JsFile="blake2s.min.js"; Path="blake2s_file_hash.astro"},
    @{Name="BLAKE3 File Hash"; Algorithm="BLAKE3"; JsFile="blake3.js"; Path="blake3_file_hash.astro"},
    @{Name="CRC16 Checksum"; Algorithm="CRC16"; JsFile="crc.min.js"; Path="crc16_checksum.astro"},
    @{Name="CRC32 Checksum"; Algorithm="CRC32"; JsFile="crc.min.js"; Path="crc32_checksum.astro"}
)

$pagesDir = "src\pages"

foreach ($page in $pages) {
    $filePath = Join-Path $pagesDir $page.Path
    
    $content = @"
---
import HashPage from '../components/HashPage.astro';

const title = "$($page.Name)";
const description = "Calculate $($page.Algorithm) hash from file. Free online $($page.Algorithm) checksum calculator.";
const algorithmName = "$($page.Algorithm)";
const jsFile = "$($page.JsFile)";
const activePage = "$($page.Path)";
---

<HashPage 
    title={title}
    description={description}
    algorithmName={algorithmName}
    jsFile={jsFile}
    activePage={activePage}
/>
"@
    
    Set-Content -Path $filePath -Value $content -Encoding UTF8
}

Write-Host "Done! Created $($pages.Count) file hash pages."
