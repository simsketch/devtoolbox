import React, { useState, useEffect } from 'react';
import { InputOutput } from '@/components/common/InputOutput';
import { htmlEntityEncode, htmlEntityDecode } from '@/lib/tauri';
import { ArrowRight } from 'lucide-react';
import { useToolAction } from '@/hooks/useToolAction';

export const HtmlEntitiesComponent: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  useEffect(() => {
    processInput();
  }, [input, mode]);

  const processInput = async () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    setError('');

    try {
      const result =
        mode === 'encode' ? await htmlEntityEncode(input) : await htmlEntityDecode(input);
      setOutput(result);
    } catch (err: any) {
      setError(err?.message || `Failed to ${mode} HTML entities`);
      setOutput('');
    }
  };

  const handleModeToggle = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    // Swap input and output when toggling mode
    if (output) {
      setInput(output);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header with controls */}
      <div
        style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--border-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-lg)',
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <button
            className={mode === 'encode' ? 'btn-macos' : 'btn-macos-secondary'}
            onClick={() => setMode('encode')}
            style={{ fontSize: '13px', padding: '6px 12px' }}
          >
            Encode
          </button>
          <button
            className={mode === 'decode' ? 'btn-macos' : 'btn-macos-secondary'}
            onClick={() => setMode('decode')}
            style={{ fontSize: '13px', padding: '6px 12px' }}
          >
            Decode
          </button>
        </div>

        <button
          className="btn-macos-secondary"
          onClick={handleModeToggle}
          style={{ fontSize: '13px', padding: '6px 12px' }}
          title="Swap input and output"
        >
          Swap
        </button>

        {error && (
          <div
            style={{
              marginLeft: 'auto',
              color: '#ef4444',
              fontSize: '13px',
              fontWeight: '500',
            }}
          >
            Error: {error}
          </div>
        )}

        <div
          style={{
            marginLeft: error ? '0' : 'auto',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}
        >
          {mode === 'encode'
            ? 'Converts special characters to HTML entities (&lt; &gt; &amp; etc.)'
            : 'Converts HTML entities back to special characters'}
        </div>
      </div>

      {/* Input/Output area */}
      <InputOutput
        input={input}
        onInputChange={setInput}
        output={output}
        inputLabel={mode === 'encode' ? 'Plain Text' : 'HTML Entities'}
        outputLabel={mode === 'encode' ? 'HTML Entities' : 'Plain Text'}
        inputLanguage="html"
        outputLanguage="html"
        inputPlaceholder={
          mode === 'encode'
            ? 'Enter text with special characters...'
            : 'Enter text with HTML entities...'
        }
        actions={
          <ArrowRight
            size={20}
            style={{
              color: 'var(--text-secondary)',
            }}
          />
        }
      />
    </div>
  );
};
