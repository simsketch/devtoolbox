import React, { useState, useEffect } from 'react';
import { hashMd5, hashSha1, hashSha256, hashSha512 } from '@/lib/tauri';
import { CopyButton } from '@/components/common/CopyButton';
import { useToolAction } from '@/hooks/useToolAction';

interface HashResult {
  name: string;
  value: string;
  color: string;
}

export const HashGeneratorComponent: React.FC = () => {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<HashResult[]>([]);
  const [loading, setLoading] = useState(false);

  useToolAction(setInput);

  useEffect(() => {
    generateHashes();
  }, [input]);

  const generateHashes = async () => {
    if (!input) {
      setHashes([]);
      return;
    }

    setLoading(true);

    try {
      const [md5, sha1, sha256, sha512] = await Promise.all([
        hashMd5(input),
        hashSha1(input),
        hashSha256(input),
        hashSha512(input),
      ]);

      setHashes([
        { name: 'MD5', value: md5, color: '#f59e0b' },
        { name: 'SHA-1', value: sha1, color: '#3b82f6' },
        { name: 'SHA-256', value: sha256, color: '#10b981' },
        { name: 'SHA-512', value: sha512, color: '#8b5cf6' },
      ]);
    } catch (error) {
      console.error('Failed to generate hashes:', error);
      setHashes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto' }}>
      {/* Input Section */}
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
          Input Text
        </label>
        <textarea
          className="textarea-macos"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          style={{
            width: '100%',
            minHeight: '120px',
            fontSize: '14px',
            resize: 'vertical',
          }}
        />
      </div>

      {/* Hashes Section */}
      <div style={{ padding: 'var(--spacing-lg)', flex: 1 }}>
        {loading && (
          <div
            style={{
              textAlign: 'center',
              color: 'var(--text-secondary)',
              padding: 'var(--spacing-xl)',
            }}
          >
            Generating hashes...
          </div>
        )}

        {!loading && hashes.length === 0 && input === '' && (
          <div
            style={{
              textAlign: 'center',
              color: 'var(--text-secondary)',
              padding: 'var(--spacing-xl)',
            }}
          >
            Enter text above to generate hashes
          </div>
        )}

        {!loading && hashes.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {hashes.map((hash) => (
              <div
                key={hash.name}
                className="card-macos"
                style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--spacing-sm)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: hash.color,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {hash.name}
                  </h3>
                  <CopyButton text={hash.value} />
                </div>
                <input
                  className="input-macos"
                  type="text"
                  value={hash.value}
                  readOnly
                  style={{
                    width: '100%',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    cursor: 'text',
                  }}
                  onClick={(e) => e.currentTarget.select()}
                />
                <div
                  style={{
                    marginTop: 'var(--spacing-xs)',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Length: {hash.value.length} characters
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
