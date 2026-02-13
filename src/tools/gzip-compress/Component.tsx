import React, { useState, useEffect } from 'react';
import { InputOutput } from '@/components/common/InputOutput';
import { gzipCompress, gzipDecompress } from '@/lib/tauri';
import { ArrowRight } from 'lucide-react';
import { useToolAction } from '@/hooks/useToolAction';

export const GzipCompressComponent: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'compress' | 'decompress'>('compress');
  const [error, setError] = useState('');
  const [inputSize, setInputSize] = useState(0);
  const [outputSize, setOutputSize] = useState(0);
  const [compressionRatio, setCompressionRatio] = useState('');

  useEffect(() => {
    processInput();
  }, [input, mode]);

  const processInput = async () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      setInputSize(0);
      setOutputSize(0);
      setCompressionRatio('');
      return;
    }

    setError('');

    try {
      const result = mode === 'compress' ? await gzipCompress(input) : await gzipDecompress(input);
      setOutput(result);

      const inputBytes = new TextEncoder().encode(input).length;
      const outputBytes = new TextEncoder().encode(result).length;

      setInputSize(inputBytes);
      setOutputSize(outputBytes);

      if (mode === 'compress' && inputBytes > 0) {
        const ratio = ((1 - outputBytes / inputBytes) * 100).toFixed(1);
        setCompressionRatio(`${ratio}% reduction`);
      } else {
        setCompressionRatio('');
      }
    } catch (err: any) {
      setError(err?.message || `Failed to ${mode}`);
      setOutput('');
      setInputSize(0);
      setOutputSize(0);
      setCompressionRatio('');
    }
  };

  const handleModeToggle = () => {
    const newMode = mode === 'compress' ? 'decompress' : 'compress';
    setMode(newMode);
    if (output) {
      setInput(output);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <button
            className={mode === 'compress' ? 'btn-macos' : 'btn-macos-secondary'}
            onClick={() => setMode('compress')}
            style={{ fontSize: '13px', padding: '6px 12px' }}
          >
            Compress
          </button>
          <button
            className={mode === 'decompress' ? 'btn-macos' : 'btn-macos-secondary'}
            onClick={() => setMode('decompress')}
            style={{ fontSize: '13px', padding: '6px 12px' }}
          >
            Decompress
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

        {inputSize > 0 && outputSize > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginLeft: 'auto' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {formatBytes(inputSize)} → {formatBytes(outputSize)}
            </div>
            {compressionRatio && (
              <div
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  color: '#22c55e',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                {compressionRatio}
              </div>
            )}
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
      </div>

      {/* Input/Output area */}
      <InputOutput
        input={input}
        onInputChange={setInput}
        output={output}
        inputLabel={mode === 'compress' ? 'Text to Compress' : 'Base64-encoded Gzip'}
        outputLabel={mode === 'compress' ? 'Base64-encoded Gzip' : 'Decompressed Text'}
        inputPlaceholder={
          mode === 'compress'
            ? 'Enter text to compress...'
            : 'Enter base64-encoded gzip data...'
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
