import React, { useState, useEffect } from 'react';
import { InputOutput } from '@/components/common/InputOutput';
import { ArrowRight } from 'lucide-react';

import { useToolAction } from '@/hooks/useToolAction';
const escapeString = (str: string): string => {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\f/g, '\\f')
    .replace(/\b/g, '\\b')
    .replace(/\v/g, '\\v')
    .replace(/\0/g, '\\0');
};

const unescapeString = (str: string): string => {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\f/g, '\f')
    .replace(/\\b/g, '\b')
    .replace(/\\v/g, '\v')
    .replace(/\\0/g, '\0')
    .replace(/\\\\/g, '\\');
};

export const BackslashEscapeComponent: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');

  useEffect(() => {
    processInput();
  }, [input, mode]);

  const processInput = () => {
    if (!input) {
      setOutput('');
      return;
    }

    try {
      const result = mode === 'escape' ? escapeString(input) : unescapeString(input);
      setOutput(result);
    } catch (err) {
      setOutput('');
    }
  };

  const handleModeToggle = () => {
    const newMode = mode === 'escape' ? 'unescape' : 'escape';
    setMode(newMode);
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
            className={mode === 'escape' ? 'btn-macos' : 'btn-macos-secondary'}
            onClick={() => setMode('escape')}
            style={{ fontSize: '13px', padding: '6px 12px' }}
          >
            Escape
          </button>
          <button
            className={mode === 'unescape' ? 'btn-macos' : 'btn-macos-secondary'}
            onClick={() => setMode('unescape')}
            style={{ fontSize: '13px', padding: '6px 12px' }}
          >
            Unescape
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
      </div>

      {/* Input/Output area */}
      <InputOutput
        input={input}
        onInputChange={setInput}
        output={output}
        inputLabel={mode === 'escape' ? 'Original Text' : 'Escaped Text'}
        outputLabel={mode === 'escape' ? 'Escaped Text' : 'Original Text'}
        inputPlaceholder={mode === 'escape' ? 'Enter text to escape...' : 'Enter escaped text...'}
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
