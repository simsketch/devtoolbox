import type { ToolDefinition, ToolCategory } from '../types/tool';

// Import tool components
import { JsonFormatterComponent } from './json-formatter/Component';
import { Base64Component } from './base64/Component';
import { JwtDecoderComponent } from './jwt-decoder/Component';
import { HashGeneratorComponent } from './hash-generator/Component';
import { UuidGeneratorComponent } from './uuid-generator/Component';
import { UrlEncoderComponent } from './url-encoder/Component';
import { HtmlEntitiesComponent } from './html-entities/Component';
import { TimestampConverterComponent } from './timestamp-converter/Component';
import { UrlParserComponent } from './url-parser/Component';
import { NumberBaseComponent } from './number-base/Component';
import { PipelineBuilderComponentWrapper } from './pipeline-builder/Component';

// Import newly created components
import { RegexTesterComponent } from './regex-tester/Component';
import { DiffToolComponent } from './diff-tool/Component';
import { MarkdownPreviewComponent } from './markdown-preview/Component';
import { ColorConverterComponent } from './color-converter/Component';
import { YamlJsonComponent } from './yaml-json/Component';
import { CsvJsonComponent } from './csv-json/Component';
import { XmlJsonComponent } from './xml-json/Component';
import { TomlJsonComponent } from './toml-json/Component';
import { SqlFormatterComponent } from './sql-formatter/Component';
import { CssFormatterComponent } from './css-formatter/Component';
import { PasswordGeneratorComponent } from './password-generator/Component';
import { LoremIpsumComponent } from './lorem-ipsum/Component';

// Import final batch of components
import { CronParserComponent } from './cron-parser/Component';
import { BackslashEscapeComponent } from './backslash-escape/Component';
import { TextInspectorComponent } from './text-inspector/Component';
import { JsonToTypescriptComponent } from './json-to-typescript/Component';
import { ChmodCalculatorComponent } from './chmod-calculator/Component';
import { CertificateDecoderComponent } from './certificate-decoder/Component';
import { GzipCompressComponent } from './gzip-compress/Component';
import { ImageBase64Component } from './image-base64/Component';
import { QrCodeComponent } from './qr-code/Component';
import { HtmlPreviewComponent } from './html-preview/Component';
import { HmacGeneratorComponent } from './hmac-generator/Component';
import { BcryptToolComponent } from './bcrypt-tool/Component';

// Tool definitions
export const allTools: ToolDefinition[] = [
  // Formatting
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, and minify JSON data',
    category: 'formatting',
    keywords: ['json', 'format', 'prettify', 'minify', 'validate'],
    icon: 'Braces',
    iconColor: '#fab387',
    component: JsonFormatterComponent,
    inputs: [{ id: 'input', label: 'JSON Input', type: 'string' }],
    outputs: [{ id: 'output', label: 'Formatted JSON', type: 'json' }],
    sampleData: `{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "isActive": true,
  "roles": ["user", "admin"],
  "address": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94102"
  },
  "preferences": {
    "theme": "dark",
    "notifications": true,
    "language": "en-US"
  }
}`,
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format and beautify SQL queries',
    category: 'formatting',
    keywords: ['sql', 'format', 'query', 'database'],
    icon: 'Database',
    iconColor: '#fab387',
    component: SqlFormatterComponent,
    inputs: [{ id: 'input', label: 'SQL Input', type: 'string' }],
    outputs: [{ id: 'output', label: 'Formatted SQL', type: 'string' }],
    sampleData: `SELECT u.id, u.name, u.email, COUNT(o.id) as order_count, SUM(o.total) as total_spent FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at >= '2024-01-01' AND u.is_active = true GROUP BY u.id, u.name, u.email HAVING COUNT(o.id) > 0 ORDER BY total_spent DESC LIMIT 10;`,
  },
  {
    id: 'css-formatter',
    name: 'CSS/LESS Formatter',
    description: 'Format CSS and LESS stylesheets',
    category: 'formatting',
    keywords: ['css', 'less', 'format', 'style', 'stylesheet'],
    icon: 'Paintbrush',
    iconColor: '#fab387',
    component: CssFormatterComponent,
    inputs: [{ id: 'input', label: 'CSS Input', type: 'string' }],
    outputs: [{ id: 'output', label: 'Formatted CSS', type: 'string' }],
    sampleData: `.container{max-width:1200px;margin:0 auto;padding:20px}.header{display:flex;justify-content:space-between;align-items:center;background:#333;color:#fff;padding:1rem}.button{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border:none;border-radius:8px;color:white;padding:12px 24px;cursor:pointer;transition:all 0.3s ease}.button:hover{transform:translateY(-2px);box-shadow:0 10px 20px rgba(0,0,0,0.2)}`,
  },
  {
    id: 'html-preview',
    name: 'HTML Preview',
    description: 'Preview HTML in real-time',
    category: 'formatting',
    keywords: ['html', 'preview', 'render', 'web'],
    icon: 'Globe',
    iconColor: '#fab387',
    component: HtmlPreviewComponent,
    inputs: [{ id: 'input', label: 'HTML Input', type: 'string' }],
    outputs: [{ id: 'output', label: 'Preview', type: 'string' }],
    sampleData: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Page</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1 { color: #333; }
    .card { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <h1>Welcome to DevToolbox</h1>
  <div class="card">
    <h2>Sample Content</h2>
    <p>This is a sample HTML preview with some basic styling.</p>
    <button onclick="alert('Hello!')">Click Me</button>
  </div>
</body>
</html>`,
  },

  // Encoding
  {
    id: 'base64',
    name: 'Base64 Encode/Decode',
    description: 'Encode and decode Base64 strings',
    category: 'encoding',
    keywords: ['base64', 'encode', 'decode', 'encoding'],
    icon: 'Lock',
    iconColor: '#a6e3a1',
    component: Base64Component,
    inputs: [{ id: 'input', label: 'Input', type: 'string' }],
    outputs: [{ id: 'output', label: 'Output', type: 'string' }],
    sampleData: 'Hello, World! This is a sample text for Base64 encoding.',
  },
  {
    id: 'url-encoder',
    name: 'URL Encode/Decode',
    description: 'Encode and decode URL strings',
    category: 'encoding',
    keywords: ['url', 'encode', 'decode', 'uri', 'percent'],
    icon: 'Link',
    iconColor: '#a6e3a1',
    component: UrlEncoderComponent,
    inputs: [{ id: 'input', label: 'Input', type: 'string' }],
    outputs: [{ id: 'output', label: 'Output', type: 'string' }],
    sampleData: 'https://example.com/search?q=hello world&category=tools&sort=date',
  },
  {
    id: 'html-entities',
    name: 'HTML Entity Encode/Decode',
    description: 'Encode and decode HTML entities',
    category: 'encoding',
    keywords: ['html', 'entity', 'encode', 'decode', 'escape'],
    icon: 'Code',
    iconColor: '#a6e3a1',
    component: HtmlEntitiesComponent,
    inputs: [{ id: 'input', label: 'Input', type: 'string' }],
    outputs: [{ id: 'output', label: 'Output', type: 'string' }],
    sampleData: '<div class="container">Hello & welcome to "DevToolbox"! © 2024</div>',
  },
  {
    id: 'backslash-escape',
    name: 'Backslash Escape/Unescape',
    description: 'Escape and unescape backslashes in strings',
    category: 'encoding',
    keywords: ['backslash', 'escape', 'unescape', 'string'],
    icon: 'Slash',
    iconColor: '#a6e3a1',
    component: BackslashEscapeComponent,
    inputs: [{ id: 'input', label: 'Input', type: 'string' }],
    outputs: [{ id: 'output', label: 'Output', type: 'string' }],
    sampleData: 'This is a "quoted" string with\nnewlines and\ttabs.',
  },
  {
    id: 'gzip-compress',
    name: 'Gzip Compress/Decompress',
    description: 'Compress and decompress data with Gzip',
    category: 'encoding',
    keywords: ['gzip', 'compress', 'decompress', 'compression'],
    icon: 'Archive',
    iconColor: '#a6e3a1',
    component: GzipCompressComponent,
    inputs: [{ id: 'input', label: 'Input', type: 'string' }],
    outputs: [{ id: 'output', label: 'Output', type: 'binary' }],
    sampleData: 'This is a sample text that will be compressed using Gzip. The compression is particularly effective for repetitive text patterns. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 'image-base64',
    name: 'Image to Base64',
    description: 'Convert images to Base64 data URLs',
    category: 'encoding',
    keywords: ['image', 'base64', 'convert', 'data-url'],
    icon: 'Image',
    iconColor: '#a6e3a1',
    component: ImageBase64Component,
    inputs: [{ id: 'input', label: 'Image', type: 'binary' }],
    outputs: [{ id: 'output', label: 'Base64', type: 'string' }],
  },

  // Crypto
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate SHA and MD5 hashes',
    category: 'crypto',
    keywords: ['hash', 'sha', 'md5', 'checksum'],
    icon: 'Hash',
    iconColor: '#f38ba8',
    component: HashGeneratorComponent,
    inputs: [{ id: 'input', label: 'Input', type: 'string' }],
    outputs: [{ id: 'output', label: 'Hash', type: 'string' }],
    sampleData: 'The quick brown fox jumps over the lazy dog',
  },
  {
    id: 'hmac-generator',
    name: 'HMAC Generator',
    description: 'Generate HMAC signatures',
    category: 'crypto',
    keywords: ['hmac', 'signature', 'authenticate'],
    icon: 'KeyRound',
    iconColor: '#f38ba8',
    component: HmacGeneratorComponent,
    inputs: [
      { id: 'input', label: 'Input', type: 'string' },
      { id: 'secret', label: 'Secret', type: 'string' },
    ],
    outputs: [{ id: 'output', label: 'HMAC', type: 'string' }],
    sampleData: 'Message to be signed with HMAC',
  },
  {
    id: 'bcrypt-tool',
    name: 'Bcrypt Hash/Verify',
    description: 'Hash and verify passwords with bcrypt',
    category: 'crypto',
    keywords: ['bcrypt', 'hash', 'password', 'verify'],
    icon: 'Shield',
    iconColor: '#f38ba8',
    component: BcryptToolComponent,
    inputs: [{ id: 'input', label: 'Password', type: 'string' }],
    outputs: [{ id: 'output', label: 'Hash', type: 'string' }],
    sampleData: 'MySecurePassword123!',
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decode/Verify',
    description: 'Decode and verify JSON Web Tokens',
    category: 'crypto',
    keywords: ['jwt', 'token', 'decode', 'verify'],
    icon: 'FileKey',
    iconColor: '#cba6f7',
    component: JwtDecoderComponent,
    inputs: [{ id: 'input', label: 'JWT', type: 'string' }],
    outputs: [{ id: 'output', label: 'Decoded', type: 'json' }],
    sampleData: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjIsInJvbGVzIjpbInVzZXIiLCJhZG1pbiJdfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  },
  {
    id: 'certificate-decoder',
    name: 'Certificate Decoder',
    description: 'Decode and inspect SSL certificates',
    category: 'crypto',
    keywords: ['certificate', 'ssl', 'tls', 'x509', 'decode'],
    icon: 'Award',
    iconColor: '#cba6f7',
    component: CertificateDecoderComponent,
    inputs: [{ id: 'input', label: 'Certificate', type: 'string' }],
    outputs: [{ id: 'output', label: 'Details', type: 'json' }],
    sampleData: `-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKL0UG+mRKuLMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV
BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
aWRnaXRzIFB0eSBMdGQwHhcNMjQwMTAxMDAwMDAwWhcNMjUwMTAxMDAwMDAwWjBF
MQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50
ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
CgKCAQEA0Z3VS6JJi0n==
-----END CERTIFICATE-----`,
  },

  // Converters
  {
    id: 'yaml-json',
    name: 'YAML ↔ JSON',
    description: 'Convert between YAML and JSON formats',
    category: 'converters',
    keywords: ['yaml', 'json', 'convert'],
    icon: 'FileJson',
    iconColor: '#f9e2af',
    component: YamlJsonComponent,
    inputs: [{ id: 'input', label: 'Input', type: 'string' }],
    outputs: [{ id: 'output', label: 'Output', type: 'string' }],
    sampleData: `name: DevToolbox
version: 1.0.0
description: Essential developer tools
settings:
  theme: dark
  notifications: true
  features:
    - json-formatter
    - base64-encoder
    - hash-generator
database:
  host: localhost
  port: 5432
  credentials:
    username: admin
    password: secret`,
  },
  {
    id: 'csv-json',
    name: 'CSV ↔ JSON',
    description: 'Convert between CSV and JSON formats',
    category: 'converters',
    keywords: ['csv', 'json', 'convert', 'spreadsheet'],
    icon: 'Table',
    iconColor: '#f9e2af',
    component: CsvJsonComponent,
    inputs: [{ id: 'input', label: 'Input', type: 'string' }],
    outputs: [{ id: 'output', label: 'Output', type: 'string' }],
    sampleData: `name,email,age,department,salary
John Doe,john@example.com,30,Engineering,95000
Jane Smith,jane@example.com,28,Design,85000
Bob Johnson,bob@example.com,35,Marketing,75000
Alice Williams,alice@example.com,32,Engineering,98000`,
  },
  {
    id: 'xml-json',
    name: 'XML ↔ JSON',
    description: 'Convert between XML and JSON formats',
    category: 'converters',
    keywords: ['xml', 'json', 'convert'],
    icon: 'FileCode',
    iconColor: '#f9e2af',
    component: XmlJsonComponent,
    inputs: [{ id: 'input', label: 'Input', type: 'string' }],
    outputs: [{ id: 'output', label: 'Output', type: 'string' }],
    sampleData: `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="1">
    <title>The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <price currency="USD">12.99</price>
  </book>
  <book id="2">
    <title>To Kill a Mockingbird</title>
    <author>Harper Lee</author>
    <year>1960</year>
    <price currency="USD">14.99</price>
  </book>
</catalog>`,
  },
  {
    id: 'toml-json',
    name: 'TOML ↔ JSON',
    description: 'Convert between TOML and JSON formats',
    category: 'converters',
    keywords: ['toml', 'json', 'convert'],
    icon: 'FileText',
    iconColor: '#f9e2af',
    component: TomlJsonComponent,
    inputs: [{ id: 'input', label: 'Input', type: 'string' }],
    outputs: [{ id: 'output', label: 'Output', type: 'string' }],
    sampleData: `title = "DevToolbox Configuration"
version = "1.0.0"

[database]
host = "localhost"
port = 5432
enabled = true

[server]
host = "0.0.0.0"
port = 8080

[server.ssl]
enabled = true
cert = "/path/to/cert.pem"
key = "/path/to/key.pem"

[[features]]
name = "json-formatter"
enabled = true

[[features]]
name = "base64-encoder"
enabled = true`,
  },
  {
    id: 'json-to-typescript',
    name: 'JSON → TypeScript',
    description: 'Generate TypeScript interfaces from JSON',
    category: 'converters',
    keywords: ['json', 'typescript', 'interface', 'type'],
    icon: 'FileType',
    iconColor: '#f9e2af',
    component: JsonToTypescriptComponent,
    inputs: [{ id: 'input', label: 'JSON', type: 'json' }],
    outputs: [{ id: 'output', label: 'TypeScript', type: 'string' }],
    sampleData: `{
  "user": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "isActive": true,
    "roles": ["admin", "user"],
    "profile": {
      "bio": "Software developer",
      "avatar": "https://example.com/avatar.jpg",
      "social": {
        "twitter": "@johndoe",
        "github": "johndoe"
      }
    }
  }
}`,
  },
  {
    id: 'color-converter',
    name: 'Color Converter',
    description: 'Convert between color formats (HEX, RGB, HSL)',
    category: 'converters',
    keywords: ['color', 'hex', 'rgb', 'hsl', 'convert'],
    icon: 'Palette',
    iconColor: '#f9e2af',
    component: ColorConverterComponent,
    inputs: [{ id: 'input', label: 'Color', type: 'string' }],
    outputs: [{ id: 'output', label: 'Converted', type: 'string' }],
    sampleData: '#667eea',
  },
  {
    id: 'number-base',
    name: 'Number Base Converter',
    description: 'Convert numbers between bases (2, 8, 10, 16)',
    category: 'converters',
    keywords: ['number', 'base', 'binary', 'hex', 'octal', 'decimal'],
    icon: 'Binary',
    iconColor: '#f9e2af',
    component: NumberBaseComponent,
    inputs: [{ id: 'input', label: 'Number', type: 'string' }],
    outputs: [{ id: 'output', label: 'Converted', type: 'string' }],
    sampleData: '255',
  },

  // Generators
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate UUID/GUID values',
    category: 'generators',
    keywords: ['uuid', 'guid', 'generate', 'random'],
    icon: 'Fingerprint',
    iconColor: '#89dceb',
    component: UuidGeneratorComponent,
    inputs: [],
    outputs: [{ id: 'output', label: 'UUID', type: 'string' }],
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure random passwords',
    category: 'generators',
    keywords: ['password', 'generate', 'random', 'secure'],
    icon: 'KeyRound',
    iconColor: '#89dceb',
    component: PasswordGeneratorComponent,
    inputs: [],
    outputs: [{ id: 'output', label: 'Password', type: 'string' }],
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text',
    category: 'generators',
    keywords: ['lorem', 'ipsum', 'placeholder', 'text'],
    icon: 'AlignLeft',
    iconColor: '#89dceb',
    component: LoremIpsumComponent,
    inputs: [],
    outputs: [{ id: 'output', label: 'Text', type: 'string' }],
  },
  {
    id: 'qr-code',
    name: 'QR Code Generator',
    description: 'Generate QR codes from text or URLs',
    category: 'generators',
    keywords: ['qr', 'code', 'generate', 'barcode'],
    icon: 'QrCode',
    iconColor: '#89dceb',
    component: QrCodeComponent,
    inputs: [{ id: 'input', label: 'Text', type: 'string' }],
    outputs: [{ id: 'output', label: 'QR Code', type: 'binary' }],
    sampleData: 'https://github.com/devtoolbox',
  },

  // Text
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test and debug regular expressions',
    category: 'text',
    keywords: ['regex', 'regexp', 'test', 'match'],
    icon: 'Regex',
    iconColor: '#94e2d5',
    component: RegexTesterComponent,
    inputs: [
      { id: 'pattern', label: 'Pattern', type: 'string' },
      { id: 'text', label: 'Text', type: 'string' },
    ],
    outputs: [{ id: 'output', label: 'Matches', type: 'json' }],
    sampleData: `The quick brown fox jumps over the lazy dog.
Contact us at support@example.com or sales@example.com
Phone: (555) 123-4567 or +1-555-987-6543
Visit https://www.example.com for more info.`,
  },
  {
    id: 'diff-tool',
    name: 'Diff Tool',
    description: 'Compare and diff two text blocks',
    category: 'text',
    keywords: ['diff', 'compare', 'merge', 'changes'],
    icon: 'GitCompare',
    iconColor: '#94e2d5',
    component: DiffToolComponent,
    inputs: [
      { id: 'left', label: 'Original', type: 'string' },
      { id: 'right', label: 'Modified', type: 'string' },
    ],
    outputs: [{ id: 'output', label: 'Diff', type: 'string' }],
  },
  {
    id: 'text-inspector',
    name: 'Text Inspector',
    description: 'Analyze text for statistics and metadata',
    category: 'text',
    keywords: ['text', 'inspect', 'analyze', 'statistics'],
    icon: 'Search',
    iconColor: '#94e2d5',
    component: TextInspectorComponent,
    inputs: [{ id: 'input', label: 'Text', type: 'string' }],
    outputs: [{ id: 'output', label: 'Statistics', type: 'json' }],
    sampleData: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.`,
  },
  {
    id: 'markdown-preview',
    name: 'Markdown Preview',
    description: 'Preview Markdown with live rendering',
    category: 'text',
    keywords: ['markdown', 'preview', 'render', 'md'],
    icon: 'BookOpen',
    iconColor: '#94e2d5',
    component: MarkdownPreviewComponent,
    inputs: [{ id: 'input', label: 'Markdown', type: 'string' }],
    outputs: [{ id: 'output', label: 'HTML', type: 'string' }],
    sampleData: `# DevToolbox Documentation

## Getting Started

Welcome to **DevToolbox**! This is a collection of essential developer utilities.

### Features

- 🎨 JSON Formatter
- 🔐 Base64 Encoder/Decoder
- 🔑 Hash Generator
- 📝 And many more!

### Code Example

\`\`\`javascript
const result = await formatJSON(input);
console.log(result);
\`\`\`

### Lists

1. First item
2. Second item
3. Third item

- Unordered item
- Another item
  - Nested item

> This is a blockquote with *important* information.

For more info, visit [our website](https://example.com).`,
  },

  // Network
  {
    id: 'url-parser',
    name: 'URL Parser',
    description: 'Parse and analyze URLs',
    category: 'network',
    keywords: ['url', 'parse', 'query', 'string'],
    icon: 'Globe',
    iconColor: '#74c7ec',
    component: UrlParserComponent,
    inputs: [{ id: 'input', label: 'URL', type: 'string' }],
    outputs: [{ id: 'output', label: 'Parsed', type: 'json' }],
    sampleData: 'https://api.example.com:8080/v1/users?page=2&limit=50&sort=created_at&order=desc#section-top',
  },

  // Date/Time
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    description: 'Convert between timestamps and dates',
    category: 'datetime',
    keywords: ['timestamp', 'unix', 'epoch', 'date', 'time'],
    icon: 'Clock',
    iconColor: '#fab387',
    component: TimestampConverterComponent,
    inputs: [{ id: 'input', label: 'Input', type: 'string' }],
    outputs: [{ id: 'output', label: 'Converted', type: 'string' }],
    sampleData: '1704067200',
  },
  {
    id: 'cron-parser',
    name: 'Cron Expression Parser',
    description: 'Parse and explain cron expressions',
    category: 'datetime',
    keywords: ['cron', 'schedule', 'parse', 'expression'],
    icon: 'Timer',
    iconColor: '#fab387',
    component: CronParserComponent,
    inputs: [{ id: 'input', label: 'Cron Expression', type: 'string' }],
    outputs: [{ id: 'output', label: 'Explanation', type: 'string' }],
    sampleData: '*/15 * * * *',
  },

  // Misc
  {
    id: 'chmod-calculator',
    name: 'Chmod Calculator',
    description: 'Calculate Unix file permissions',
    category: 'misc',
    keywords: ['chmod', 'permissions', 'unix', 'octal'],
    icon: 'Calculator',
    iconColor: '#a6adc8',
    component: ChmodCalculatorComponent,
    inputs: [{ id: 'input', label: 'Permissions', type: 'string' }],
    outputs: [{ id: 'output', label: 'Result', type: 'string' }],
    sampleData: '755',
  },
  {
    id: 'pipeline-builder',
    name: 'Pipeline Builder',
    description: 'Build and execute tool pipelines',
    category: 'misc',
    keywords: ['pipeline', 'workflow', 'automation'],
    icon: 'Workflow',
    iconColor: '#a6adc8',
    component: PipelineBuilderComponentWrapper,
    inputs: [],
    outputs: [],
  },
];

// Helper functions
export function getToolById(id: string): ToolDefinition | undefined {
  return allTools.find(tool => tool.id === id);
}

export function searchTools(query: string): ToolDefinition[] {
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) {
    return allTools;
  }

  return allTools.filter(tool => {
    return (
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery)) ||
      tool.category.toLowerCase().includes(lowerQuery)
    );
  });
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return allTools.filter(tool => tool.category === category);
}

export const categories: Record<ToolCategory, string> = {
  formatting: 'Formatting',
  encoding: 'Encoding',
  crypto: 'Cryptography',
  converters: 'Converters',
  generators: 'Generators',
  text: 'Text Tools',
  network: 'Network',
  datetime: 'Date & Time',
  misc: 'Miscellaneous',
};
