import React, { useState, useEffect } from 'react';
import { InputOutput } from '@/components/common/InputOutput';
import { jsonFormat, jsonMinify } from '@/lib/tauri';
import { ArrowRight } from 'lucide-react';
import { useToolAction } from '@/hooks/useToolAction';

type IndentType = '2' | '4' | 'tab';

export const JsonFormatterComponent: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indentType, setIndentType] = useState<IndentType>('2');
  const [mode, setMode] = useState<'format' | 'minify'>('format');
  const [isProcessing, setIsProcessing] = useState(false);

  useToolAction(setInput);

  useEffect(() => {
    processJson();
  }, [input, indentType, mode]);

  const processJson = async () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      let result: string;

      if (mode === 'format') {
        const indent = indentType === 'tab' ? 1 : parseInt(indentType);
        result = await jsonFormat(input, indent);
      } else {
        result = await jsonMinify(input);
      }

      setOutput(result);
    } catch (err: any) {
      setError(err?.message || 'Invalid JSON');
      setOutput('');
    } finally {
      setIsProcessing(false);
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
            className={mode === 'format' ? 'btn-macos' : 'btn-macos-secondary'}
            onClick={() => setMode('format')}
            style={{ fontSize: '13px', padding: '6px 12px' }}
          >
            Format
          </button>
          <button
            className={mode === 'minify' ? 'btn-macos' : 'btn-macos-secondary'}
            onClick={() => setMode('minify')}
            style={{ fontSize: '13px', padding: '6px 12px' }}
          >
            Minify
          </button>
        </div>

        {mode === 'format' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <label
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                fontWeight: '500',
              }}
            >
              Indent:
            </label>
            <select
              className="select-macos"
              value={indentType}
              onChange={(e) => setIndentType(e.target.value as IndentType)}
              style={{ fontSize: '13px', padding: '4px 8px' }}
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="tab">Tab</option>
            </select>
          </div>
        )}

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

        {isProcessing && (
          <div
            style={{
              marginLeft: error ? '0' : 'auto',
              color: 'var(--text-secondary)',
              fontSize: '13px',
            }}
          >
            Processing...
          </div>
        )}
      </div>

      {/* Input/Output area */}
      <InputOutput
        input={input}
        onInputChange={setInput}
        output={output}
        inputLabel="JSON Input"
        outputLabel="Formatted JSON"
        inputLanguage="json"
        outputLanguage="json"
        inputPlaceholder="Paste your JSON here..."
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
