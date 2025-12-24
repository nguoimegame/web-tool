/**
 * JWT (JSON Web Token) Encoder/Decoder
 * Client-side implementation for encoding, decoding, and verifying JWTs
 */

// Base64URL encoding/decoding utilities
const base64urlEncode = (str) => {
  const base64 = btoa(str);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const base64urlDecode = (str) => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = base64.length % 4;
  if (padding) {
    base64 += '='.repeat(4 - padding);
  }
  return atob(base64);
};

const textToArrayBuffer = (text) => {
  const encoder = new TextEncoder();
  return encoder.encode(text);
};

const arrayBufferToBase64url = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return base64urlEncode(binary);
};

// JWT Decoder
const jwtDecode = (token) => {
  const result = {
    valid: false,
    header: null,
    payload: null,
    signature: null,
    error: null,
  };

  if (!token || typeof token !== 'string') {
    result.error = 'Invalid token: Token is empty or not a string';
    return result;
  }

  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    result.error = `Invalid token: Expected 3 parts, got ${parts.length}`;
    return result;
  }

  try {
    // Decode header
    const headerJson = base64urlDecode(parts[0]);
    result.header = JSON.parse(headerJson);
  } catch (e) {
    result.error = 'Invalid token: Could not decode header - ' + e.message;
    return result;
  }

  try {
    // Decode payload
    const payloadJson = base64urlDecode(parts[1]);
    result.payload = JSON.parse(payloadJson);
  } catch (e) {
    result.error = 'Invalid token: Could not decode payload - ' + e.message;
    return result;
  }

  // Store signature (base64url encoded)
  result.signature = parts[2];
  result.valid = true;

  return result;
};

// Get algorithm info for Web Crypto API
const getAlgorithmInfo = (alg) => {
  const algorithms = {
    HS256: { name: 'HMAC', hash: 'SHA-256' },
    HS384: { name: 'HMAC', hash: 'SHA-384' },
    HS512: { name: 'HMAC', hash: 'SHA-512' },
  };
  return algorithms[alg] || null;
};

// JWT Signature Verification (HMAC algorithms)
const jwtVerify = async (token, secret, secretEncoding = 'utf-8') => {
  const decoded = jwtDecode(token);
  if (!decoded.valid) {
    return { verified: false, error: decoded.error };
  }

  const alg = decoded.header.alg;
  const algInfo = getAlgorithmInfo(alg);

  if (!algInfo) {
    return {
      verified: false,
      error: `Unsupported algorithm: ${alg}. Supported: HS256, HS384, HS512`,
    };
  }

  try {
    // Prepare secret key
    let secretBytes;
    if (secretEncoding === 'base64') {
      const base64 = secret.replace(/-/g, '+').replace(/_/g, '/');
      const padding = base64.length % 4;
      const paddedBase64 = padding ? base64 + '='.repeat(4 - padding) : base64;
      const binary = atob(paddedBase64);
      secretBytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        secretBytes[i] = binary.charCodeAt(i);
      }
    } else {
      secretBytes = textToArrayBuffer(secret);
    }

    // Import key
    const key = await crypto.subtle.importKey('raw', secretBytes, algInfo, false, ['sign']);

    // Get the signing input
    const parts = token.trim().split('.');
    const signingInput = parts[0] + '.' + parts[1];
    const signingInputBytes = textToArrayBuffer(signingInput);

    // Sign and compare
    const signatureBuffer = await crypto.subtle.sign(algInfo.name, key, signingInputBytes);
    const expectedSignature = arrayBufferToBase64url(signatureBuffer);

    if (expectedSignature === decoded.signature) {
      return { verified: true, error: null };
    } else {
      return { verified: false, error: 'Invalid signature' };
    }
  } catch (e) {
    return { verified: false, error: 'Verification failed: ' + e.message };
  }
};

// JWT Encoder
const jwtEncode = async (header, payload, secret, secretEncoding = 'utf-8') => {
  // Validate and parse header
  let headerObj;
  try {
    headerObj = typeof header === 'string' ? JSON.parse(header) : header;
  } catch (e) {
    return { success: false, token: null, error: 'Invalid header JSON: ' + e.message };
  }

  // Validate and parse payload
  let payloadObj;
  try {
    payloadObj = typeof payload === 'string' ? JSON.parse(payload) : payload;
  } catch (e) {
    return { success: false, token: null, error: 'Invalid payload JSON: ' + e.message };
  }

  const alg = headerObj.alg;
  const algInfo = getAlgorithmInfo(alg);

  if (!algInfo) {
    return {
      success: false,
      token: null,
      error: `Unsupported algorithm: ${alg}. Supported: HS256, HS384, HS512`,
    };
  }

  try {
    // Create header and payload parts
    const headerPart = base64urlEncode(JSON.stringify(headerObj));
    const payloadPart = base64urlEncode(JSON.stringify(payloadObj));
    const signingInput = headerPart + '.' + payloadPart;

    // Prepare secret key
    let secretBytes;
    if (secretEncoding === 'base64') {
      const base64 = secret.replace(/-/g, '+').replace(/_/g, '/');
      const padding = base64.length % 4;
      const paddedBase64 = padding ? base64 + '='.repeat(4 - padding) : base64;
      const binary = atob(paddedBase64);
      secretBytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        secretBytes[i] = binary.charCodeAt(i);
      }
    } else {
      secretBytes = textToArrayBuffer(secret);
    }

    // Import key and sign
    const key = await crypto.subtle.importKey('raw', secretBytes, algInfo, false, ['sign']);
    const signingInputBytes = textToArrayBuffer(signingInput);
    const signatureBuffer = await crypto.subtle.sign(algInfo.name, key, signingInputBytes);
    const signaturePart = arrayBufferToBase64url(signatureBuffer);

    const token = signingInput + '.' + signaturePart;
    return { success: true, token: token, error: null };
  } catch (e) {
    return { success: false, token: null, error: 'Encoding failed: ' + e.message };
  }
};

// Format JSON for display
const formatJson = (obj, indent = 2) => {
  return JSON.stringify(obj, null, indent);
};

// Parse claims to table data
const parseClaimsToTable = (claims) => {
  const knownClaims = {
    iss: 'Issuer',
    sub: 'Subject',
    aud: 'Audience',
    exp: 'Expiration Time',
    nbf: 'Not Before',
    iat: 'Issued At',
    jti: 'JWT ID',
    alg: 'Algorithm',
    typ: 'Type',
    name: 'Name',
    admin: 'Admin',
    email: 'Email',
  };

  const result = [];
  for (const [key, value] of Object.entries(claims)) {
    let displayValue = value;
    let description = knownClaims[key] || key;

    // Format timestamp claims
    if (['exp', 'nbf', 'iat'].includes(key) && typeof value === 'number') {
      const date = new Date(value * 1000);
      displayValue = `${value} (${date.toISOString()})`;
    }

    result.push({
      claim: key,
      description: description,
      value: displayValue,
    });
  }
  return result;
};

// Generate example JWT data
const generateExample = () => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    sub: '1234567890',
    name: 'John Doe',
    admin: true,
    iat: Math.floor(Date.now() / 1000),
  };

  const secret = 'a-string-secret-at-least-256-bits-long';

  return { header, payload, secret };
};

// Export for global use
window.jwtDecode = jwtDecode;
window.jwtEncode = jwtEncode;
window.jwtVerify = jwtVerify;
window.formatJson = formatJson;
window.parseClaimsToTable = parseClaimsToTable;
window.generateJwtExample = generateExample;
