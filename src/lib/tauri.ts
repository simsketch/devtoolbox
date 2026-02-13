import { invoke as tauriInvoke, isTauri } from '@tauri-apps/api/core';

// Safe invoke wrapper that checks for Tauri runtime availability
function invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  if (!isTauri()) {
    return Promise.reject(
      new Error(
        `This feature requires the desktop app. Run with 'pnpm tauri dev'.`
      )
    );
  }
  return tauriInvoke<T>(cmd, args);
}

// ============================================================================
// ENCODING
// ============================================================================

export const base64Encode = (input: string): Promise<string> => {
  if (!isTauri()) {
    return base64EncodeFallback(input);
  }
  return invoke<string>('base64_encode', { input });
};

export const base64Decode = (input: string): Promise<string> => {
  if (!isTauri()) {
    return base64DecodeFallback(input);
  }
  return invoke<string>('base64_decode', { input });
};

export const urlEncode = (input: string): Promise<string> => {
  if (!isTauri()) {
    return urlEncodeFallback(input);
  }
  return invoke<string>('url_encode', { input });
};

export const urlDecode = (input: string): Promise<string> => {
  if (!isTauri()) {
    return urlDecodeFallback(input);
  }
  return invoke<string>('url_decode', { input });
};

export const htmlEntityEncode = (input: string): Promise<string> => {
  if (!isTauri()) {
    return htmlEntityEncodeFallback(input);
  }
  return invoke<string>('html_entity_encode', { input });
};

export const htmlEntityDecode = (input: string): Promise<string> => {
  if (!isTauri()) {
    return htmlEntityDecodeFallback(input);
  }
  return invoke<string>('html_entity_decode', { input });
};

export const gzipCompress = (input: string) => invoke<string>('gzip_compress', { input });
export const gzipDecompress = (input: string) => invoke<string>('gzip_decompress', { input });

// ============================================================================
// CRYPTO
// ============================================================================

export const hashSha1 = (input: string): Promise<string> => {
  if (!isTauri()) {
    return hashFallback(input, 'SHA-1');
  }
  return invoke<string>('hash_sha1', { input });
};

export const hashSha256 = (input: string): Promise<string> => {
  if (!isTauri()) {
    return hashFallback(input, 'SHA-256');
  }
  return invoke<string>('hash_sha256', { input });
};

export const hashSha512 = (input: string): Promise<string> => {
  if (!isTauri()) {
    return hashFallback(input, 'SHA-512');
  }
  return invoke<string>('hash_sha512', { input });
};

export const hashMd5 = (input: string): Promise<string> => {
  if (!isTauri()) {
    return hashMd5Fallback(input);
  }
  return invoke<string>('hash_md5', { input });
};

export const hmacGenerate = (input: string, key: string, algorithm: string) =>
  invoke<string>('hmac_generate', { input, key, algorithm });

export const bcryptHash = (input: string, cost: number) =>
  invoke<string>('bcrypt_hash', { input, cost });

export const bcryptVerify = (input: string, hash: string) =>
  invoke<boolean>('bcrypt_verify', { input, hash });

// ============================================================================
// JWT
// ============================================================================

export interface JwtParts {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

export const jwtDecode = (token: string) => invoke<JwtParts>('jwt_decode', { token });
export const jwtVerify = (token: string, secret: string, algorithm: string) =>
  invoke<boolean>('jwt_verify', { token, secret, algorithm });

// ============================================================================
// JSON
// ============================================================================

export const jsonFormat = (input: string, indent: number = 2): Promise<string> => {
  if (!isTauri()) {
    return jsonFormatFallback(input, indent);
  }
  return invoke<string>('json_format', { input, indent });
};

export const jsonMinify = (input: string): Promise<string> => {
  if (!isTauri()) {
    return jsonMinifyFallback(input);
  }
  return invoke<string>('json_minify', { input });
};

// ============================================================================
// TEXT
// ============================================================================

export interface DiffChange {
  tag: string;
  value: string;
}

export const textDiff = (oldText: string, newText: string): Promise<DiffChange[]> => {
  if (!isTauri()) {
    return textDiffFallback(oldText, newText);
  }
  return invoke<DiffChange[]>('text_diff', { oldText, newText });
};

export const caseConvert = (input: string, toCase: string): Promise<string> => {
  if (!isTauri()) {
    return caseConvertFallback(input, toCase);
  }
  return invoke<string>('case_convert', { input, toCase });
};

// ============================================================================
// GENERATORS
// ============================================================================

export const generateUuid = (version: string): Promise<string> => {
  if (!isTauri()) {
    return generateUuidFallback(version);
  }
  return invoke<string>('generate_uuid', { version });
};

export const generatePassword = (
  length: number,
  uppercase: boolean,
  lowercase: boolean,
  numbers: boolean,
  symbols: boolean
): Promise<string> => {
  if (!isTauri()) {
    return generatePasswordFallback(length, uppercase, lowercase, numbers, symbols);
  }
  return invoke<string>('generate_password', { length, uppercase, lowercase, numbers, symbols });
};

export const generateLorem = (paragraphs: number): Promise<string> => {
  if (!isTauri()) {
    return generateLoremFallback(paragraphs);
  }
  return invoke<string>('generate_lorem', { paragraphs });
};

// ============================================================================
// DATETIME
// ============================================================================

export const timestampToDate = (timestamp: number, format: string = ''): Promise<string> => {
  if (!isTauri()) {
    return timestampToDateFallback(timestamp, format);
  }
  return invoke<string>('timestamp_to_date', { timestamp, format });
};

export const dateToTimestamp = (dateStr: string, format: string = ''): Promise<number> => {
  if (!isTauri()) {
    return dateToTimestampFallback(dateStr, format);
  }
  return invoke<number>('date_to_timestamp', { dateStr, format });
};

export const nowTimestamp = (): Promise<number> => {
  if (!isTauri()) {
    return nowTimestampFallback();
  }
  return invoke<number>('now_timestamp');
};

// ============================================================================
// COLOR
// ============================================================================

export const colorConvert = (input: string, fromFormat: string, toFormat: string): Promise<string> => {
  if (!isTauri()) {
    return colorConvertFallback(input, fromFormat, toFormat);
  }
  return invoke<string>('color_convert', { input, fromFormat, toFormat });
};

// ============================================================================
// NUMBERS
// ============================================================================

export const numberBaseConvert = (input: string, fromBase: number, toBase: number): Promise<string> => {
  if (!isTauri()) {
    return numberBaseConvertFallback(input, fromBase, toBase);
  }
  return invoke<string>('number_base_convert', { input, fromBase, toBase });
};

// ============================================================================
// YAML
// ============================================================================

export const yamlToJson = (input: string) => invoke<string>('yaml_to_json', { input });
export const jsonToYaml = (input: string) => invoke<string>('json_to_yaml', { input });

// ============================================================================
// CSV
// ============================================================================

export const csvToJson = (input: string) => invoke<string>('csv_to_json', { input });
export const jsonToCsv = (input: string) => invoke<string>('json_to_csv', { input });

// ============================================================================
// XML
// ============================================================================

export const xmlToJson = (input: string) => invoke<string>('xml_to_json', { input });
export const jsonToXml = (input: string) => invoke<string>('json_to_xml', { input });

// ============================================================================
// TOML
// ============================================================================

export const tomlToJson = (input: string) => invoke<string>('toml_to_json', { input });
export const jsonToToml = (input: string) => invoke<string>('json_to_toml', { input });

// ============================================================================
// CERTIFICATES
// ============================================================================

export interface CertInfo {
  subject: string;
  issuer: string;
  not_before: string;
  not_after: string;
  serial: string;
  algorithm: string;
}

export const decodeCertificate = (input: string) => invoke<CertInfo>('decode_certificate', { input });

// ============================================================================
// PIPELINE
// ============================================================================

export interface PipelineStep {
  tool_id: string;
  config: Record<string, unknown>;
  input: string;
}

export const executePipeline = (steps: PipelineStep[]) =>
  invoke<string>('execute_pipeline', { steps });

// ============================================================================
// FALLBACK IMPLEMENTATIONS
// ============================================================================

// Encoding Fallbacks
function base64EncodeFallback(input: string): Promise<string> {
  try {
    const result = btoa(unescape(encodeURIComponent(input)));
    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
}

function base64DecodeFallback(input: string): Promise<string> {
  try {
    const result = decodeURIComponent(escape(atob(input)));
    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
}

function urlEncodeFallback(input: string): Promise<string> {
  try {
    const result = encodeURIComponent(input);
    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
}

function urlDecodeFallback(input: string): Promise<string> {
  try {
    const result = decodeURIComponent(input);
    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
}

function htmlEntityEncodeFallback(input: string): Promise<string> {
  const entityMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };
  const result = input.replace(/[&<>"'/]/g, (char) => entityMap[char]);
  return Promise.resolve(result);
}

function htmlEntityDecodeFallback(input: string): Promise<string> {
  try {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = input;
    const result = textarea.value;
    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
}

// Crypto Fallbacks
async function hashFallback(input: string, algorithm: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    return Promise.reject(error);
  }
}

// MD5 fallback implementation
function hashMd5Fallback(input: string): Promise<string> {
  // Simple MD5 implementation for client-side fallback
  // Note: This is a basic implementation. For production, consider using a library.
  function md5cycle(x: number[], k: number[]) {
    let a = x[0], b = x[1], c = x[2], d = x[3];

    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }

  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }

  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }

  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }

  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
  }

  function add32(a: number, b: number) {
    return (a + b) & 0xFFFFFFFF;
  }

  function md5blk(s: string) {
    const md5blks: number[] = [];
    for (let i = 0; i < 64; i += 4) {
      md5blks[i >> 2] = s.charCodeAt(i)
        + (s.charCodeAt(i + 1) << 8)
        + (s.charCodeAt(i + 2) << 16)
        + (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
  }

  function rhex(n: number) {
    let s = '';
    for (let j = 0; j < 4; j++) {
      s += ('0' + ((n >> (j * 8 + 4)) & 0x0F).toString(16)).slice(-1)
         + ('0' + ((n >> (j * 8)) & 0x0F).toString(16)).slice(-1);
    }
    return s;
  }

  function md51(s: string) {
    const n = s.length;
    const state = [1732584193, -271733879, -1732584194, 271733878];
    let i;
    for (i = 64; i <= s.length; i += 64) {
      md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++) {
      tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    }
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  }

  try {
    const hash = md51(input);
    const result = rhex(hash[0]) + rhex(hash[1]) + rhex(hash[2]) + rhex(hash[3]);
    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
}

// JSON Fallbacks
function jsonFormatFallback(input: string, indent: number): Promise<string> {
  try {
    const parsed = JSON.parse(input);
    const result = JSON.stringify(parsed, null, indent);
    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
}

function jsonMinifyFallback(input: string): Promise<string> {
  try {
    const parsed = JSON.parse(input);
    const result = JSON.stringify(parsed);
    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
}

// Text Fallbacks
function textDiffFallback(oldText: string, newText: string): Promise<DiffChange[]> {
  try {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    const changes: DiffChange[] = [];

    const maxLen = Math.max(oldLines.length, newLines.length);

    for (let i = 0; i < maxLen; i++) {
      const oldLine = oldLines[i];
      const newLine = newLines[i];

      if (oldLine === undefined) {
        changes.push({ tag: 'insert', value: newLine + '\n' });
      } else if (newLine === undefined) {
        changes.push({ tag: 'delete', value: oldLine + '\n' });
      } else if (oldLine !== newLine) {
        changes.push({ tag: 'delete', value: oldLine + '\n' });
        changes.push({ tag: 'insert', value: newLine + '\n' });
      } else {
        changes.push({ tag: 'equal', value: oldLine + '\n' });
      }
    }

    return Promise.resolve(changes);
  } catch (error) {
    return Promise.reject(error);
  }
}

function caseConvertFallback(input: string, toCase: string): Promise<string> {
  try {
    let result: string;

    switch (toCase.toLowerCase()) {
      case 'lowercase':
        result = input.toLowerCase();
        break;
      case 'uppercase':
        result = input.toUpperCase();
        break;
      case 'camelcase':
        result = input
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase()
          )
          .replace(/\s+/g, '')
          .replace(/[-_]/g, '');
        break;
      case 'pascalcase':
        result = input
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
          .replace(/\s+/g, '')
          .replace(/[-_]/g, '');
        break;
      case 'snakecase':
        result = input
          .replace(/([a-z])([A-Z])/g, '$1_$2')
          .replace(/[\s-]+/g, '_')
          .toLowerCase();
        break;
      case 'kebabcase':
        result = input
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .replace(/[\s_]+/g, '-')
          .toLowerCase();
        break;
      case 'titlecase':
        result = input.replace(/\w\S*/g, (txt) =>
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
      default:
        result = input;
    }

    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
}

// Generator Fallbacks
function generateUuidFallback(version: string): Promise<string> {
  try {
    if (version === 'v4') {
      // Use built-in crypto.randomUUID if available
      if (crypto.randomUUID) {
        return Promise.resolve(crypto.randomUUID());
      }

      // Fallback UUID v4 implementation
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);

      bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
      bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10

      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
      const uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
      return Promise.resolve(uuid);
    } else if (version === 'v7') {
      // UUID v7 implementation (timestamp-based)
      const timestamp = Date.now();
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);

      // Set timestamp (48 bits)
      bytes[0] = (timestamp >> 40) & 0xff;
      bytes[1] = (timestamp >> 32) & 0xff;
      bytes[2] = (timestamp >> 24) & 0xff;
      bytes[3] = (timestamp >> 16) & 0xff;
      bytes[4] = (timestamp >> 8) & 0xff;
      bytes[5] = timestamp & 0xff;

      bytes[6] = (bytes[6] & 0x0f) | 0x70; // Version 7
      bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10

      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
      const uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
      return Promise.resolve(uuid);
    } else {
      return Promise.reject(new Error(`Unsupported UUID version: ${version}`));
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

function generatePasswordFallback(
  length: number,
  uppercase: boolean,
  lowercase: boolean,
  numbers: boolean,
  symbols: boolean,
): Promise<string> {
  if (length <= 0) {
    return Promise.reject(new Error('Password length must be greater than 0'));
  }

  let charset = '';
  if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (numbers) charset += '0123456789';
  if (symbols) charset += '!@#$%^&*()-_=+[]{}|;:\',.<>?/~`';

  if (!charset) {
    return Promise.reject(
      new Error('At least one character type must be selected (uppercase, lowercase, numbers, symbols)')
    );
  }

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  const password = Array.from(array, (val) => charset[val % charset.length]).join('');
  return Promise.resolve(password);
}

function generateLoremFallback(paragraphs: number): Promise<string> {
  const loremParagraphs = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
    'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
  ];

  const result: string[] = [];
  for (let i = 0; i < paragraphs; i++) {
    result.push(loremParagraphs[i % loremParagraphs.length]);
  }

  return Promise.resolve(result.join('\n\n'));
}

// DateTime Fallbacks
function timestampToDateFallback(timestamp: number, format: string): Promise<string> {
  try {
    const date = new Date(timestamp * 1000);

    if (format) {
      // Basic format support - for complex formats, use Tauri backend
      return Promise.reject(new Error('Custom date formats require the desktop app. Run with \'pnpm tauri dev\'.'));
    }

    const result = date.toISOString();
    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
}

function dateToTimestampFallback(dateStr: string, format: string): Promise<number> {
  try {
    if (format) {
      // Basic format support - for complex formats, use Tauri backend
      return Promise.reject(new Error('Custom date formats require the desktop app. Run with \'pnpm tauri dev\'.'));
    }

    const timestamp = Math.floor(new Date(dateStr).getTime() / 1000);
    return Promise.resolve(timestamp);
  } catch (error) {
    return Promise.reject(error);
  }
}

function nowTimestampFallback(): Promise<number> {
  const timestamp = Math.floor(Date.now() / 1000);
  return Promise.resolve(timestamp);
}

// Color Fallbacks
function colorConvertFallback(input: string, fromFormat: string, toFormat: string): Promise<string> {
  try {
    let r = 0, g = 0, b = 0, a = 1;

    // Parse input based on fromFormat
    if (fromFormat === 'hex') {
      const hex = input.replace('#', '');
      if (hex.length === 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      } else if (hex.length === 8) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
        a = parseInt(hex.slice(6, 8), 16) / 255;
      } else if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      }
    } else if (fromFormat === 'rgb') {
      const match = input.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (match) {
        r = parseInt(match[1]);
        g = parseInt(match[2]);
        b = parseInt(match[3]);
        a = match[4] ? parseFloat(match[4]) : 1;
      }
    } else if (fromFormat === 'hsl') {
      const match = input.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([\d.]+))?\)/);
      if (match) {
        const h = parseInt(match[1]) / 360;
        const s = parseInt(match[2]) / 100;
        const l = parseInt(match[3]) / 100;
        a = match[4] ? parseFloat(match[4]) : 1;

        // HSL to RGB conversion
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };

        if (s === 0) {
          r = g = b = l;
        } else {
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
        }

        r = Math.round(r * 255);
        g = Math.round(g * 255);
        b = Math.round(b * 255);
      }
    }

    // Convert to output format
    let result = '';
    if (toFormat === 'hex') {
      const toHex = (n: number) => n.toString(16).padStart(2, '0');
      result = '#' + toHex(r) + toHex(g) + toHex(b);
      if (a < 1) {
        result += toHex(Math.round(a * 255));
      }
    } else if (toFormat === 'rgb') {
      result = a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
    } else if (toFormat === 'hsl') {
      // RGB to HSL conversion
      const rNorm = r / 255;
      const gNorm = g / 255;
      const bNorm = b / 255;

      const max = Math.max(rNorm, gNorm, bNorm);
      const min = Math.min(rNorm, gNorm, bNorm);
      let h = 0, s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break;
          case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break;
          case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break;
        }
      }

      const hDeg = Math.round(h * 360);
      const sPercent = Math.round(s * 100);
      const lPercent = Math.round(l * 100);

      result = a < 1
        ? `hsla(${hDeg}, ${sPercent}%, ${lPercent}%, ${a})`
        : `hsl(${hDeg}, ${sPercent}%, ${lPercent}%)`;
    }

    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
}

// Number Fallbacks
function numberBaseConvertFallback(input: string, fromBase: number, toBase: number): Promise<string> {
  try {
    if (fromBase < 2 || fromBase > 36 || toBase < 2 || toBase > 36) {
      return Promise.reject(new Error('Base must be between 2 and 36'));
    }

    const decimal = parseInt(input.trim(), fromBase);

    if (isNaN(decimal)) {
      return Promise.reject(new Error('Invalid input for the specified base'));
    }

    const result = decimal.toString(toBase).toUpperCase();
    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
}
