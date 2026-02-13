import React, { useState, useEffect } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { useToolAction } from '@/hooks/useToolAction';

interface ParsedUrl {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  params: Array<{ key: string; value: string }>;
}

export const UrlParserComponent: React.FC = () => {
  const [url, setUrl] = useState('');
  const [parsed, setParsed] = useState<ParsedUrl | null>(null);
  const [error, setError] = useState('');

  useToolAction(setUrl);

  useEffect(() => {
    parseUrl();
  }, [url]);

  const parseUrl = () => {
    if (!url.trim()) {
      setParsed(null);
      setError('');
      return;
    }

    try {
      const urlObj = new URL(url);
      const params: Array<{ key: string; value: string }> = [];

      urlObj.searchParams.forEach((value, key) => {
        params.push({ key, value });
      });

      setParsed({
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        port: urlObj.port || '(default)',
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash,
        origin: urlObj.origin,
        params,
      });
      setError('');
    } catch (err: any) {
      setError('Invalid URL format');
      setParsed(null);
    }
  };

  const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        borderBottom: '1px solid var(--border-secondary)',
      }}
    >
      <div
        style={{
          flex: '0 0 150px',
          fontSize: '13px',
          fontWeight: '600',
          color: 'var(--text-secondary)',
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          fontFamily: value ? 'var(--font-mono)' : 'inherit',
          fontSize: '13px',
          color: value ? 'var(--text-primary)' : 'var(--text-secondary)',
          wordBreak: 'break-all',
        }}
      >
        {value || '(empty)'}
      </div>
      {value && <CopyButton text={value} />}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto' }}>
      {/* URL Input Section */}
      <div
        style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--border-secondary)',
        }}
      >
        <label
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--spacing-sm)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          URL
        </label>
        <input
          className="input-macos"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com:8080/path?key=value#hash"
          style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '13px' }}
        />
        {error && (
          <div
            style={{
              marginTop: 'var(--spacing-sm)',
              color: '#ef4444',
              fontSize: '13px',
              fontWeight: '500',
            }}
          >
            Error: {error}
          </div>
        )}
      </div>

      {/* Parsed Output */}
      {parsed && (
        <div style={{ padding: 'var(--spacing-lg)', flex: 1 }}>
          {/* Basic Info Card */}
          <div
            className="card-macos"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-primary)',
              marginBottom: 'var(--spacing-lg)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: 'var(--spacing-md)',
                borderBottom: '1px solid var(--border-secondary)',
                backgroundColor: 'var(--bg-tertiary)',
              }}
            >
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                URL Components
              </h3>
            </div>
            <InfoRow label="Protocol" value={parsed.protocol} />
            <InfoRow label="Origin" value={parsed.origin} />
            <InfoRow label="Hostname" value={parsed.hostname} />
            <InfoRow label="Port" value={parsed.port} />
            <InfoRow label="Pathname" value={parsed.pathname} />
            <InfoRow label="Search" value={parsed.search} />
            <InfoRow label="Hash" value={parsed.hash} />
          </div>

          {/* Query Parameters Table */}
          {parsed.params.length > 0 && (
            <div
              className="card-macos"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-primary)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: 'var(--spacing-md)',
                  borderBottom: '1px solid var(--border-secondary)',
                  backgroundColor: 'var(--bg-tertiary)',
                }}
              >
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Query Parameters ({parsed.params.length})
                </h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      <th
                        style={{
                          padding: 'var(--spacing-sm) var(--spacing-md)',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'var(--text-secondary)',
                          textTransform: 'uppercase',
                          borderBottom: '1px solid var(--border-secondary)',
                        }}
                      >
                        Key
                      </th>
                      <th
                        style={{
                          padding: 'var(--spacing-sm) var(--spacing-md)',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'var(--text-secondary)',
                          textTransform: 'uppercase',
                          borderBottom: '1px solid var(--border-secondary)',
                        }}
                      >
                        Value
                      </th>
                      <th
                        style={{
                          padding: 'var(--spacing-sm) var(--spacing-md)',
                          textAlign: 'right',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'var(--text-secondary)',
                          textTransform: 'uppercase',
                          borderBottom: '1px solid var(--border-secondary)',
                          width: '100px',
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.params.map((param, index) => (
                      <tr
                        key={index}
                        style={{
                          borderBottom: '1px solid var(--border-secondary)',
                        }}
                      >
                        <td
                          style={{
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '13px',
                            color: 'var(--text-primary)',
                            wordBreak: 'break-word',
                          }}
                        >
                          {param.key}
                        </td>
                        <td
                          style={{
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '13px',
                            color: 'var(--text-primary)',
                            wordBreak: 'break-word',
                          }}
                        >
                          {param.value}
                        </td>
                        <td
                          style={{
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            textAlign: 'right',
                          }}
                        >
                          <CopyButton text={`${param.key}=${param.value}`} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {parsed.params.length === 0 && parsed.search === '' && (
            <div
              style={{
                textAlign: 'center',
                color: 'var(--text-secondary)',
                padding: 'var(--spacing-lg)',
                fontSize: '13px',
              }}
            >
              No query parameters found
            </div>
          )}
        </div>
      )}

      {!parsed && !error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            color: 'var(--text-secondary)',
          }}
        >
          Enter a URL above to parse it
        </div>
      )}
    </div>
  );
};
