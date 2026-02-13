import React, { useState } from 'react';
import { CodeEditor } from '@/components/common/CodeEditor';
import { textDiff, type DiffChange } from '@/lib/tauri';
import { useToolAction } from '@/hooks/useToolAction';
import { GitCompare } from 'lucide-react';

export const DiffToolComponent: React.FC = () => {
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [diff, setDiff] = useState<DiffChange[]>([]);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useToolAction(setOriginal);

  const handleDiff = async () => {
    setIsProcessing(true);
    setError('');

    try {
      const result = await textDiff(original, modified);
      setDiff(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to calculate diff');
      setDiff([]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div
        style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--border-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-lg)',
        }}
      >
        <button
          className="btn-macos"
          onClick={handleDiff}
          disabled={isProcessing || (!original && !modified)}
          style={{
            fontSize: '13px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
          }}
        >
          <GitCompare size={16} />
          Compare
        </button>

        {error && (
          <div style={{ color: '#ef4444', fontSize: '13px', fontWeight: '500' }}>
            Error: {error}
          </div>
        )}

        {isProcessing && (
          <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Processing...
          </div>
        )}

        {diff.length > 0 && !error && (
          <div style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: '500' }}>
            {diff.filter((d) => d.tag === 'insert').length} additions,{' '}
            {diff.filter((d) => d.tag === 'delete').length} deletions
          </div>
        )}
      </div>

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Input panes */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid var(--border-secondary)',
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              borderBottom: '1px solid var(--border-secondary)',
              padding: 'var(--spacing-lg)',
            }}
          >
            <label
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--spacing-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Original
            </label>
            <div style={{ flex: 1, minHeight: 0 }}>
              <CodeEditor
                value={original}
                onChange={setOriginal}
                language="text"
                placeholder="Enter original text..."
                minHeight="100%"
                maxHeight="100%"
              />
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              padding: 'var(--spacing-lg)',
            }}
          >
            <label
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--spacing-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Modified
            </label>
            <div style={{ flex: 1, minHeight: 0 }}>
              <CodeEditor
                value={modified}
                onChange={setModified}
                language="text"
                placeholder="Enter modified text..."
                minHeight="100%"
                maxHeight="100%"
              />
            </div>
          </div>
        </div>

        {/* Diff results */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: 'var(--spacing-lg)',
          }}
        >
          <label
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--spacing-sm)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Diff Result
          </label>
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-md)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              lineHeight: '1.6',
            }}
          >
            {diff.length === 0 ? (
              <div
                style={{
                  color: 'var(--text-secondary)',
                  textAlign: 'center',
                  padding: 'var(--spacing-lg)',
                }}
              >
                Click "Compare" to see diff results
              </div>
            ) : (
              <div>
                {diff.map((change, idx) => {
                  const lines = change.value.split('\n');
                  return lines.map((line, lineIdx) => {
                    if (!line && lineIdx === lines.length - 1) return null;

                    let bgColor = 'transparent';
                    let textColor = 'var(--text-primary)';
                    let prefix = ' ';

                    if (change.tag === 'insert') {
                      bgColor = 'rgba(34, 197, 94, 0.15)';
                      textColor = '#22c55e';
                      prefix = '+';
                    } else if (change.tag === 'delete') {
                      bgColor = 'rgba(239, 68, 68, 0.15)';
                      textColor = '#ef4444';
                      prefix = '-';
                    }

                    return (
                      <div
                        key={`${idx}-${lineIdx}`}
                        style={{
                          backgroundColor: bgColor,
                          color: textColor,
                          padding: '2px 8px',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all',
                        }}
                      >
                        <span style={{ opacity: 0.6, marginRight: '8px' }}>{prefix}</span>
                        {line || ' '}
                      </div>
                    );
                  });
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
