import React, { useState } from 'react';
import { generateLorem } from '@/lib/tauri';
import { CopyButton } from '@/components/common/CopyButton';
import { FileText } from 'lucide-react';

export const LoremIpsumComponent: React.FC = () => {
  const [text, setText] = useState('');
  const [paragraphs, setParagraphs] = useState(3);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const result = await generateLorem(paragraphs);
      setText(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate lorem ipsum');
      setText('');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Header with controls */}
      <div
        style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--border-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-lg)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <label
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Paragraphs: {paragraphs}
          </label>
          <input
            type="range"
            min={1}
            max={20}
            value={paragraphs}
            onChange={(e) => setParagraphs(Number(e.target.value))}
            style={{ width: '200px' }}
          />
        </div>

        <button
          className="btn-macos"
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{
            fontSize: '13px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
          }}
        >
          <FileText size={16} />
          Generate
        </button>

        {error && (
          <div style={{ color: '#ef4444', fontSize: '13px', fontWeight: '500' }}>
            Error: {error}
          </div>
        )}

        {text && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {text.split(' ').length} words, {text.length} characters
            </span>
            <CopyButton text={text} />
          </div>
        )}
      </div>

      {/* Generated text */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--spacing-xl)',
        }}
      >
        {text ? (
          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              fontSize: '15px',
              lineHeight: '1.8',
              color: 'var(--text-primary)',
            }}
          >
            {text.split('\n\n').map((paragraph, idx) => (
              <p
                key={idx}
                style={{
                  marginBottom: 'var(--spacing-lg)',
                  textAlign: 'justify',
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-secondary)',
              gap: 'var(--spacing-md)',
            }}
          >
            <FileText size={48} style={{ opacity: 0.3 }} />
            <p style={{ fontSize: '14px' }}>
              Click "Generate" to create lorem ipsum text
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
