import React, { useState } from 'react';
import { generateUuid } from '@/lib/tauri';
import { CopyButton } from '@/components/common/CopyButton';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { RefreshCw } from 'lucide-react';

export const UuidGeneratorComponent: React.FC = () => {
  const [version, setVersion] = useState<'v4' | 'v7'>('v4');
  const [quantity, setQuantity] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);

    try {
      const promises = Array.from({ length: quantity }, () => generateUuid(version));
      const results = await Promise.all(promises);
      setUuids(results);
    } catch (error) {
      console.error('Failed to generate UUIDs:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyAll = async () => {
    const allUuids = uuids.join('\n');
    try {
      await writeText(allUuids);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto' }}>
      {/* Controls Section */}
      <div
        style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--border-secondary)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-lg)',
            alignItems: 'flex-end',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--spacing-xs)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Version
            </label>
            <select
              className="select-macos"
              value={version}
              onChange={(e) => setVersion(e.target.value as 'v4' | 'v7')}
              style={{ minWidth: '120px' }}
            >
              <option value="v4">UUID v4 (Random)</option>
              <option value="v7">UUID v7 (Timestamp)</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--spacing-xs)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Quantity
            </label>
            <input
              className="input-macos"
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              style={{ width: '100px' }}
            />
          </div>

          <button
            className="btn-macos"
            onClick={handleGenerate}
            disabled={generating}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              padding: '8px 16px',
            }}
          >
            <RefreshCw size={16} />
            {generating ? 'Generating...' : 'Generate'}
          </button>

          {uuids.length > 0 && (
            <button
              className="btn-macos-secondary"
              onClick={handleCopyAll}
              style={{ padding: '8px 16px', marginLeft: 'auto' }}
            >
              Copy All
            </button>
          )}
        </div>

        <div
          style={{
            marginTop: 'var(--spacing-sm)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}
        >
          {version === 'v4'
            ? 'UUID v4 generates random unique identifiers'
            : 'UUID v7 generates timestamp-based sortable identifiers'}
        </div>
      </div>

      {/* UUIDs List */}
      <div style={{ padding: 'var(--spacing-lg)', flex: 1 }}>
        {uuids.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: 'var(--text-secondary)',
              padding: 'var(--spacing-xl)',
            }}
          >
            Click "Generate" to create UUIDs
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            {uuids.map((uuid, index) => (
              <div
                key={`${uuid}-${index}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    minWidth: '30px',
                  }}
                >
                  {index + 1}.
                </span>
                <code
                  style={{
                    flex: 1,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                  }}
                >
                  {uuid}
                </code>
                <CopyButton text={uuid} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
