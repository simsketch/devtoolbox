import React, { useState, useEffect } from 'react';
import { InputOutput } from '@/components/common/InputOutput';
import { css as cssBeautify } from 'js-beautify';
import { ArrowRight } from 'lucide-react';
import { useToolAction } from '@/hooks/useToolAction';

export const CssFormatterComponent: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indentSize, setIndentSize] = useState(2);

  useToolAction(setInput);

  useEffect(() => {
    formatCss();
  }, [input, indentSize]);

  const formatCss = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      const formatted = cssBeautify(input, {
        indent_size: indentSize,
        indent_char: ' ',
        max_preserve_newlines: 2,
        preserve_newlines: true,
        wrap_line_length: 0,
        end_with_newline: true,
        selector_separator_newline: true,
        newline_between_rules: true,
        space_around_combinator: true,
      });

      setOutput(formatted);
      setError('');
    } catch (err: any) {
      setError(err?.message || 'Failed to format CSS');
      setOutput('');
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
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            style={{ fontSize: '13px', padding: '4px 8px' }}
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={8}>8 spaces</option>
          </select>
        </div>

        {error && (
          <div style={{ color: '#ef4444', fontSize: '13px', fontWeight: '500' }}>
            Error: {error}
          </div>
        )}
      </div>

      {/* Input/Output area */}
      <InputOutput
        input={input}
        onInputChange={setInput}
        output={output}
        inputLabel="CSS Input"
        outputLabel="Formatted CSS"
        inputLanguage="css"
        outputLanguage="css"
        inputPlaceholder="Paste your CSS here..."
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
