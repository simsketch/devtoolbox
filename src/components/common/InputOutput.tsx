import React from 'react';
import { CodeEditor } from './CodeEditor';
import { CopyButton } from './CopyButton';

interface InputOutputProps {
  input: string;
  onInputChange: (value: string) => void;
  output: string;
  inputLabel?: string;
  outputLabel?: string;
  inputLanguage?: 'json' | 'javascript' | 'html' | 'css' | 'xml' | 'sql' | 'yaml' | 'markdown' | 'text';
  outputLanguage?: 'json' | 'javascript' | 'html' | 'css' | 'xml' | 'sql' | 'yaml' | 'markdown' | 'text';
  inputPlaceholder?: string;
  outputPlaceholder?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const InputOutput: React.FC<InputOutputProps> = ({
  input,
  onInputChange,
  output,
  inputLabel = 'Input',
  outputLabel = 'Output',
  inputLanguage = 'text',
  outputLanguage = 'text',
  inputPlaceholder = 'Enter input...',
  outputPlaceholder = 'Output will appear here...',
  actions,
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 'var(--spacing-lg)',
          flex: 1,
          overflow: 'hidden',
          padding: 'var(--spacing-lg)',
        }}
      >
        {/* Input Section */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--spacing-sm)',
            }}
          >
            <label
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {inputLabel}
            </label>
          </div>
          <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
            <CodeEditor
              value={input}
              onChange={onInputChange}
              language={inputLanguage}
              placeholder={inputPlaceholder}
              minHeight="100%"
              maxHeight="100%"
            />
          </div>
        </div>

        {/* Actions (between input and output) */}
        {actions && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-sm)',
            }}
          >
            {actions}
          </div>
        )}

        {/* Output Section */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--spacing-sm)',
            }}
          >
            <label
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {outputLabel}
            </label>
            {output && <CopyButton text={output} />}
          </div>
          <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
            <CodeEditor
              value={output}
              language={outputLanguage}
              placeholder={outputPlaceholder}
              readOnly
              minHeight="100%"
              maxHeight="100%"
            />
          </div>
        </div>
      </div>

      {/* Mobile responsive layout */}
      <style>
        {`
          @media (max-width: 768px) {
            .input-output-container {
              flex-direction: column !important;
            }
          }
        `}
      </style>
    </div>
  );
};
