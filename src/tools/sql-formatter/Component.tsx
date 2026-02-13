import React, { useState, useEffect } from 'react';
import { InputOutput } from '@/components/common/InputOutput';
import { format } from 'sql-formatter';
import { ArrowRight } from 'lucide-react';
import { useToolAction } from '@/hooks/useToolAction';

type Dialect = 'sql' | 'mysql' | 'postgresql' | 'mariadb' | 'bigquery';

export const SqlFormatterComponent: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [dialect, setDialect] = useState<Dialect>('sql');
  const [indentSize, setIndentSize] = useState(2);

  useToolAction(setInput);

  useEffect(() => {
    formatSql();
  }, [input, dialect, indentSize]);

  const formatSql = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      const formatted = format(input, {
        language: dialect,
        tabWidth: indentSize,
        keywordCase: 'upper',
      });

      setOutput(formatted);
      setError('');
    } catch (err: any) {
      setError(err?.message || 'Failed to format SQL');
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
          flexWrap: 'wrap',
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
            Dialect:
          </label>
          <select
            className="select-macos"
            value={dialect}
            onChange={(e) => setDialect(e.target.value as Dialect)}
            style={{ fontSize: '13px', padding: '4px 8px' }}
          >
            <option value="sql">Standard SQL</option>
            <option value="mysql">MySQL</option>
            <option value="postgresql">PostgreSQL</option>
            <option value="mariadb">MariaDB</option>
            <option value="bigquery">BigQuery</option>
          </select>
        </div>

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
        inputLabel="SQL Input"
        outputLabel="Formatted SQL"
        inputLanguage="sql"
        outputLanguage="sql"
        inputPlaceholder="Paste your SQL query here..."
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
