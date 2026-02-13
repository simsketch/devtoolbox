import React, { useState, useEffect } from 'react';
import { hmacGenerate } from '@/lib/tauri';
import { useToolAction } from '@/hooks/useToolAction';
import { CopyButton } from '@/components/common/CopyButton';

export const HmacGeneratorComponent: React.FC = () => {
  const [input, setInput] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  useToolAction(setInput);

  useEffect(() => {
    generateHmac();
  }, [input, secretKey, algorithm]);

  const generateHmac = async () => {
    if (!input.trim() || !secretKey.trim()) {
      setOutput('');
      setError('');
      return;
    }

    setError('');

    try {
      const result = await hmacGenerate(input, secretKey, algorithm);
      setOutput(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate HMAC');
      setOutput('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'var(--spacing-lg)', gap: 'var(--spacing-lg)' }}>
      {/* Algorithm Selection */}
      <div>
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
          Algorithm
        </label>
        <select
          className="select-macos"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          style={{ width: '200px', fontSize: '14px' }}
        >
          <option value="SHA-256">HMAC-SHA-256</option>
          <option value="SHA-512">HMAC-SHA-512</option>
        </select>
      </div>

      {/* Input Message */}
      <div style={{ flex: 1, minHeight: '150px', display: 'flex', flexDirection: 'column' }}>
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
          Message
        </label>
        <textarea
          className="textarea-macos"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter message to sign..."
          style={{
            flex: 1,
            minHeight: '150px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            resize: 'vertical',
          }}
        />
      </div>

      {/* Secret Key */}
      <div>
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
          Secret Key
        </label>
        <input
          type="text"
          className="input-macos"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          placeholder="Enter secret key..."
          style={{
            width: '100%',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <div
          className="card-macos"
          style={{
            padding: 'var(--spacing-md)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: '#ef4444',
          }}
        >
          <div style={{ color: '#ef4444', fontWeight: '500', fontSize: '13px' }}>
            Error: {error}
          </div>
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="card-macos" style={{ padding: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              HMAC SIGNATURE
            </div>
            <CopyButton text={output} />
          </div>
          <div
            style={{
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--text-primary)',
              wordBreak: 'break-all',
              lineHeight: '1.6',
            }}
          >
            {output}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="card-macos" style={{ padding: 'var(--spacing-md)' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
          ABOUT HMAC
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          HMAC (Hash-based Message Authentication Code) is used to verify both the data integrity and authenticity of a message. It combines a cryptographic hash function with a secret key to generate a signature that can be verified by anyone with the same secret key.
        </div>
      </div>
    </div>
  );
};
