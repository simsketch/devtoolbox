import React, { useState, useEffect } from 'react';
import { InputOutput } from '@/components/common/InputOutput';
import { tomlToJson, jsonToToml } from '@/lib/tauri';
import { ArrowLeftRight } from 'lucide-react';
import { useToolAction } from '@/hooks/useToolAction';

type Direction = 'toml-to-json' | 'json-to-toml';

export const TomlJsonComponent: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [direction, setDirection] = useState<Direction>('toml-to-json');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    convert();
  }, [input, direction]);

  const convert = async () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      let result: string;

      if (direction === 'toml-to-json') {
        result = await tomlToJson(input);
      } else {
        result = await jsonToToml(input);
      }

      setOutput(result);
    } catch (err: any) {
      setError(err?.message || 'Conversion failed');
      setOutput('');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleDirection = () => {
    setDirection((prev) => prev === 'toml-to-json' ? 'json-to-toml' : 'toml-to-json');
    // Swap input and output
    const temp = input;
    setInput(output);
    setOutput(temp);
  };

  const inputLabel = direction === 'toml-to-json' ? 'TOML Input' : 'JSON Input';
  const outputLabel = direction === 'toml-to-json' ? 'JSON Output' : 'TOML Output';
  const inputLanguage = direction === 'toml-to-json' ? 'text' : 'json';
  const outputLanguage = direction === 'toml-to-json' ? 'json' : 'text';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
            {direction === 'toml-to-json' ? 'TOML → JSON' : 'JSON → TOML'}
          </span>
        </div>

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
      </div>

      {/* Input/Output area */}
      <InputOutput
        input={input}
        onInputChange={setInput}
        output={output}
        inputLabel={inputLabel}
        outputLabel={outputLabel}
        inputLanguage={inputLanguage}
        outputLanguage={outputLanguage}
        inputPlaceholder={`Paste your ${direction === 'toml-to-json' ? 'TOML' : 'JSON'} here...`}
        actions={
          <button
            className="btn-macos"
            onClick={toggleDirection}
            style={{
              fontSize: '13px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Switch direction"
          >
            <ArrowLeftRight size={20} />
          </button>
        }
      />
    </div>
  );
};
