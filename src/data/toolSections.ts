export interface ToolItem {
  url: string;
  name: string;
}

export interface ToolBlock {
  title: string;
  items: ToolItem[];
}

export interface ToolSection {
  title: string;
  blocks: ToolBlock[];
}

export const toolSections: ToolSection[] = [
  {
    title: "Hash",
    blocks: [
      { title: "CRC", items: [{ url: "crc/", name: "CRC" }] },
      {
        title: "MD",
        items: [
          { url: "md2", name: "MD2" },
          { url: "md2_file_hash", name: "MD2 File" },
          { url: "md4", name: "MD4" },
          { url: "md4_file_hash", name: "MD4 File" },
          { url: "md5", name: "MD5" },
          { url: "md5_checksum", name: "MD5 File" },
        ],
      },
      {
        title: "SHA1",
        items: [
          { url: "hash/sha1", name: "SHA1" },
          { url: "hash/sha1_checksum", name: "SHA1 File" },
        ],
      },
      {
        title: "SHA2",
        items: [
          { url: "sha224", name: "SHA224" },
          { url: "sha224_checksum", name: "SHA224 File" },
          { url: "sha256", name: "SHA256" },
          { url: "sha256_checksum", name: "SHA256 File" },
          { url: "double_sha256", name: "Double SHA256" },
        ],
      },
      {
        title: "SHA2-512",
        items: [
          { url: "sha384", name: "SHA384" },
          { url: "sha384_file_hash", name: "SHA384 File" },
          { url: "sha512", name: "SHA512" },
          { url: "sha512_file_hash", name: "SHA512 File" },
          { url: "sha512_224", name: "SHA512/224" },
          { url: "sha512_224_file_hash", name: "SHA512/224 File" },
          { url: "sha512_256", name: "SHA512/256" },
          { url: "sha512_256_file_hash", name: "SHA512/256 File" },
        ],
      },
      {
        title: "SHA3",
        items: [
          { url: "sha3_224", name: "SHA3-224" },
          { url: "sha3_224_checksum", name: "SHA3-224 File" },
          { url: "sha3_256", name: "SHA3-256" },
          { url: "sha3_256_checksum", name: "SHA3-256 File" },
          { url: "sha3_384", name: "SHA3-384" },
          { url: "sha3_384_checksum", name: "SHA3-384 File" },
          { url: "sha3_512", name: "SHA3-512" },
          { url: "sha3_512_checksum", name: "SHA3-512 File" },
        ],
      },
      {
        title: "Keccak",
        items: [
          { url: "keccak_224", name: "Keccak-224" },
          { url: "keccak_224_checksum", name: "Keccak-224 File" },
          { url: "keccak_256", name: "Keccak-256" },
          { url: "keccak_256_checksum", name: "Keccak-256 File" },
          { url: "keccak_384", name: "Keccak-384" },
          { url: "keccak_384_checksum", name: "Keccak-384 File" },
          { url: "keccak_512", name: "Keccak-512" },
          { url: "keccak_512_checksum", name: "Keccak-512 File" },
        ],
      },
      {
        title: "SHAKE",
        items: [
          { url: "shake128/", name: "SHAKE128" },
          { url: "shake128/file/", name: "SHAKE128 File" },
          { url: "shake256/", name: "SHAKE256" },
          { url: "shake256/file/", name: "SHAKE256 File" },
        ],
      },
      {
        title: "cSHAKE",
        items: [
          { url: "cshake128/", name: "cSHAKE128" },
          { url: "cshake128/file/", name: "cSHAKE128 File" },
          { url: "cshake256/", name: "cSHAKE256" },
          { url: "cshake256/file/", name: "cSHAKE256 File" },
        ],
      },
      {
        title: "KMAC",
        items: [
          { url: "kmac128/", name: "KMAC128" },
          { url: "kmac128/file/", name: "KMAC128 File" },
          { url: "kmac256/", name: "KMAC256" },
          { url: "kmac256/file/", name: "KMAC256 File" },
        ],
      },
      {
        title: "RIPEMD",
        items: [
          { url: "ripemd-128/", name: "RIPEMD-128" },
          { url: "ripemd-128/file/", name: "RIPEMD-128 File" },
          { url: "ripemd-160/", name: "RIPEMD-160" },
          { url: "ripemd-160/file/", name: "RIPEMD-160 File" },
          { url: "ripemd-256/", name: "RIPEMD-256" },
          { url: "ripemd-256/file/", name: "RIPEMD-256 File" },
          { url: "ripemd-320/", name: "RIPEMD-320" },
          { url: "ripemd-320/file/", name: "RIPEMD-320 File" },
        ],
      },
      {
        title: "BLAKE",
        items: [
          { url: "blake2b/", name: "BLAKE2b" },
          { url: "blake2b/file/", name: "BLAKE2b File" },
          { url: "blake2s/", name: "BLAKE2s" },
          { url: "blake2s/file/", name: "BLAKE2s File" },
          { url: "blake3/", name: "BLAKE3" },
          { url: "blake3/file/", name: "BLAKE3 File" },
        ],
      },
    ],
  },
  {
    title: "Cryptography",
    blocks: [
      {
        title: "AES",
        items: [
          { url: "aes/encrypt/", name: "Encryption" },
          { url: "aes/decrypt/", name: "Decryption" },
        ],
      },
      {
        title: "DES",
        items: [
          { url: "des/encrypt/", name: "Encryption" },
          { url: "des/decrypt/", name: "Decryption" },
        ],
      },
      {
        title: "Triple DES",
        items: [
          { url: "triple-des/encrypt/", name: "Encryption" },
          { url: "triple-des/decrypt/", name: "Decryption" },
        ],
      },
      {
        title: "RC4",
        items: [
          { url: "rc4/encrypt/", name: "Encryption" },
          { url: "rc4/decrypt/", name: "Decryption" },
        ],
      },
      {
        title: "ECDSA",
        items: [
          { url: "ecdsa/key-generator/", name: "Key Generator" },
          { url: "ecdsa/sign/", name: "Sign Message" },
          { url: "ecdsa/verify/", name: "Verify Signature" },
        ],
      },
      {
        title: "RSA",
        items: [
          { url: "rsa/key-generator/", name: "Key Generator" },
          { url: "rsa/sign/", name: "Sign Message" },
          { url: "rsa/verify/", name: "Verify Signature" },
          { url: "rsa/encrypt/", name: "Encryption" },
          { url: "rsa/decrypt/", name: "Decryption" },
        ],
      },
    ],
  },
  {
    title: "Encoding",
    blocks: [
      {
        title: "Hex (Base16)",
        items: [
          { url: "hex_encode", name: "Encode" },
          { url: "hex_decode", name: "Decode" },
          { url: "hex_encode_file", name: "File to Hex" },
          { url: "hex_decode_file", name: "Hex to File" },
        ],
      },
      {
        title: "Base32",
        items: [
          { url: "base32_encode", name: "Encode" },
          { url: "base32_decode", name: "Decode" },
          { url: "base32_encode_file", name: "File to Base32" },
          { url: "base32_decode_file", name: "Base32 to File" },
        ],
      },
      {
        title: "Base58",
        items: [
          { url: "base58/encode/", name: "Encode" },
          { url: "base58/decode/", name: "Decode" },
          { url: "base58/encode/file/", name: "File to Base58" },
          { url: "base58/decode/file/", name: "Base58 to File" },
        ],
      },
      {
        title: "Base64",
        items: [
          { url: "base64_encode", name: "Encode" },
          { url: "base64_decode", name: "Decode" },
          { url: "base64_encode_file", name: "File to Base64" },
          { url: "base64_decode_file", name: "Base64 to File" },
        ],
      },
      {
        title: "HTML",
        items: [
          { url: "html_encode", name: "Encode" },
          { url: "html_decode", name: "Decode" },
        ],
      },
      {
        title: "URL",
        items: [
          { url: "url_encode", name: "Encode" },
          { url: "url_decode", name: "Decode" },
        ],
      },
    ],
  },
  {
    title: "Format",
    blocks: [
      {
        title: "JSON",
        items: [
          { url: "json/validator/", name: "Validator" },
          { url: "json/minifier/", name: "Minifier" },
          { url: "json/formatter/", name: "Formatter" },
          { url: "json/viewer/", name: "Viewer" },
        ],
      },
      {
        title: "XML",
        items: [
          { url: "xml/validator/", name: "Validator" },
          { url: "xml/minifier/", name: "Minifier" },
          { url: "xml/formatter/", name: "Formatter" },
        ],
      },
      {
        title: "SQL",
        items: [{ url: "sql/formatter/", name: "Formatter" }],
      },
    ],
  },
  {
    title: "Convert",
    blocks: [
      {
        title: "Case",
        items: [
          { url: "case/lower/", name: "lower case" },
          { url: "case/upper/", name: "UPPER CASE" },
          { url: "case/lower-camel/", name: "lowerCamelCase" },
          { url: "case/upper-camel/", name: "UpperCamelCase" },
          { url: "case/snake/", name: "snake_case" },
          { url: "case/kebab/", name: "kebab-case" },
          { url: "case/constant/", name: "CONSTANT_CASE" },
        ],
      },
    ],
  },
  {
    title: "Others",
    blocks: [
      {
        title: "Others",
        items: [
          { url: "qr-code/generator/", name: "QR Code Generator" },
          { url: "syntax-highlight/", name: "Syntax Highlight" },
        ],
      },
    ],
  },
];
