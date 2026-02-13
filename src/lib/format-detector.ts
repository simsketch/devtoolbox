export interface FormatDetection {
  format: string;
  confidence: number;
  toolId: string;
  description: string;
}

export function detectFormat(input: string): FormatDetection | null {
  if (!input || input.trim().length === 0) {
    return null;
  }

  const trimmed = input.trim();

  // JWT (JSON Web Token)
  if (/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/.test(trimmed)) {
    return {
      format: 'JWT',
      confidence: 0.95,
      toolId: 'jwt-decoder',
      description: 'JSON Web Token detected',
    };
  }

  // UUID
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed)) {
    return {
      format: 'UUID',
      confidence: 1.0,
      toolId: 'uuid-generator',
      description: 'UUID/GUID detected',
    };
  }

  // Base64
  if (/^[A-Za-z0-9+/]*={0,2}$/.test(trimmed) && trimmed.length % 4 === 0 && trimmed.length > 20) {
    return {
      format: 'Base64',
      confidence: 0.8,
      toolId: 'base64',
      description: 'Base64 encoded string detected',
    };
  }

  // URL
  if (/^https?:\/\/[^\s]+$/.test(trimmed)) {
    return {
      format: 'URL',
      confidence: 1.0,
      toolId: 'url-parser',
      description: 'URL detected',
    };
  }

  // JSON
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      JSON.parse(trimmed);
      return {
        format: 'JSON',
        confidence: 1.0,
        toolId: 'json-formatter',
        description: 'Valid JSON detected',
      };
    } catch {
      return {
        format: 'JSON (Invalid)',
        confidence: 0.6,
        toolId: 'json-formatter',
        description: 'Possibly malformed JSON',
      };
    }
  }

  // XML
  if (trimmed.startsWith('<?xml') || (trimmed.startsWith('<') && trimmed.endsWith('>') && trimmed.includes('</'))) {
    return {
      format: 'XML',
      confidence: 0.9,
      toolId: 'xml-json',
      description: 'XML document detected',
    };
  }

  // YAML
  if (/^[a-zA-Z_][a-zA-Z0-9_]*:\s*.+/m.test(trimmed) && !trimmed.includes('{') && !trimmed.includes('[')) {
    return {
      format: 'YAML',
      confidence: 0.7,
      toolId: 'yaml-json',
      description: 'YAML document detected',
    };
  }

  // HTML
  if (/^<!DOCTYPE html>/i.test(trimmed) || (trimmed.includes('<html') && trimmed.includes('</html>'))) {
    return {
      format: 'HTML',
      confidence: 0.95,
      toolId: 'html-preview',
      description: 'HTML document detected',
    };
  }

  // CSV
  if (trimmed.split('\n').length > 1 && trimmed.split('\n').every(line => line.includes(','))) {
    return {
      format: 'CSV',
      confidence: 0.75,
      toolId: 'csv-json',
      description: 'CSV data detected',
    };
  }

  // Hex color
  if (/^#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/.test(trimmed)) {
    return {
      format: 'Hex Color',
      confidence: 1.0,
      toolId: 'color-converter',
      description: 'Hex color code detected',
    };
  }

  // RGB color
  if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i.test(trimmed)) {
    return {
      format: 'RGB Color',
      confidence: 1.0,
      toolId: 'color-converter',
      description: 'RGB color detected',
    };
  }

  // Unix timestamp (10 or 13 digits)
  if (/^\d{10}$/.test(trimmed) || /^\d{13}$/.test(trimmed)) {
    const timestamp = parseInt(trimmed, 10);
    const date = new Date(trimmed.length === 10 ? timestamp * 1000 : timestamp);
    const year = date.getFullYear();

    // Reasonable year range for timestamps
    if (year >= 1970 && year <= 2100) {
      return {
        format: 'Unix Timestamp',
        confidence: 0.85,
        toolId: 'timestamp-converter',
        description: 'Unix timestamp detected',
      };
    }
  }

  // ISO 8601 date
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/.test(trimmed)) {
    return {
      format: 'ISO 8601 Date',
      confidence: 0.95,
      toolId: 'timestamp-converter',
      description: 'ISO 8601 date detected',
    };
  }

  // Cron expression
  if (/^[\d*,\-\/]+\s+[\d*,\-\/]+\s+[\d*,\-\/]+\s+[\d*,\-\/]+\s+[\d*,\-\/]+/.test(trimmed)) {
    const parts = trimmed.split(/\s+/);
    if (parts.length === 5 || parts.length === 6) {
      return {
        format: 'Cron Expression',
        confidence: 0.85,
        toolId: 'cron-parser',
        description: 'Cron expression detected',
      };
    }
  }

  // Binary (only 0s and 1s)
  if (/^[01]+$/.test(trimmed) && trimmed.length >= 4) {
    return {
      format: 'Binary',
      confidence: 0.8,
      toolId: 'number-base',
      description: 'Binary number detected',
    };
  }

  // Hexadecimal number
  if (/^0x[0-9A-Fa-f]+$/.test(trimmed) || /^[0-9A-Fa-f]+$/.test(trimmed) && trimmed.length % 2 === 0 && trimmed.length >= 4) {
    return {
      format: 'Hexadecimal',
      confidence: 0.7,
      toolId: 'number-base',
      description: 'Hexadecimal number detected',
    };
  }

  // SQL query
  if (/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\s+/i.test(trimmed)) {
    return {
      format: 'SQL',
      confidence: 0.9,
      toolId: 'sql-formatter',
      description: 'SQL query detected',
    };
  }

  // CSS
  if (/[.#]?[a-zA-Z][a-zA-Z0-9-]*\s*\{[^}]*\}/.test(trimmed)) {
    return {
      format: 'CSS',
      confidence: 0.8,
      toolId: 'css-formatter',
      description: 'CSS stylesheet detected',
    };
  }

  // Markdown
  if (/^#+\s+.+|^\*.+\*|^_.+_|^\[.+\]\(.+\)|^>\s+.+/m.test(trimmed)) {
    return {
      format: 'Markdown',
      confidence: 0.75,
      toolId: 'markdown-preview',
      description: 'Markdown document detected',
    };
  }

  // URL encoded
  if (/%[0-9A-F]{2}/.test(trimmed) && trimmed.includes('%')) {
    return {
      format: 'URL Encoded',
      confidence: 0.8,
      toolId: 'url-encoder',
      description: 'URL encoded string detected',
    };
  }

  // HTML entities
  if (/&[a-zA-Z]+;|&#\d+;|&#x[0-9A-Fa-f]+;/.test(trimmed)) {
    return {
      format: 'HTML Entities',
      confidence: 0.8,
      toolId: 'html-entities',
      description: 'HTML entities detected',
    };
  }

  // PEM certificate
  if (trimmed.includes('-----BEGIN CERTIFICATE-----') || trimmed.includes('-----BEGIN RSA PRIVATE KEY-----')) {
    return {
      format: 'PEM Certificate',
      confidence: 1.0,
      toolId: 'certificate-decoder',
      description: 'PEM certificate/key detected',
    };
  }

  // No clear format detected
  return null;
}

// Detect multiple possible formats
export function detectAllFormats(input: string): FormatDetection[] {
  const detections: FormatDetection[] = [];
  const primary = detectFormat(input);

  if (primary) {
    detections.push(primary);
  }

  return detections;
}
