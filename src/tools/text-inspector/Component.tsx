import React, { useState, useEffect } from 'react';
import { useToolAction } from '@/hooks/useToolAction';

interface TextStats {
  characters: number;
  words: number;
  lines: number;
  paragraphs: number;
  bytes: number;
  hasLeadingWhitespace: boolean;
  hasTrailingWhitespace: boolean;
  hasTabs: boolean;
  hasNonPrintable: boolean;
  hasUnicode: boolean;
  encoding: string;
  charFrequency: Array<{ char: string; count: number }>;
}

const analyzeText = (text: string): TextStats => {
  const bytes = new TextEncoder().encode(text).length;
  const lines = text.split('\n').length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;

  const hasLeadingWhitespace = /^\s/.test(text);
  const hasTrailingWhitespace = /\s$/.test(text);
  const hasTabs = text.includes('\t');
  const hasNonPrintable = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(text);
  const hasUnicode = /[^\x00-\x7F]/.test(text);

  const encoding = hasUnicode ? 'UTF-8' : 'ASCII';

  // Character frequency
  const charMap = new Map<string, number>();
  for (const char of text) {
    if (char !== ' ' && char !== '\n' && char !== '\r' && char !== '\t') {
      charMap.set(char, (charMap.get(char) || 0) + 1);
    }
  }

  const charFrequency = Array.from(charMap.entries())
    .map(([char, count]) => ({ char, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    characters,
    words,
    lines,
    paragraphs,
    bytes,
    hasLeadingWhitespace,
    hasTrailingWhitespace,
    hasTabs,
    hasNonPrintable,
    hasUnicode,
    encoding,
    charFrequency,
  };
};

export const TextInspectorComponent: React.FC = () => {
  const [input, setInput] = useState('');
  const [stats, setStats] = useState<TextStats | null>(null);

  useToolAction(setInput);

  useEffect(() => {
    if (!input) {
      setStats(null);
      return;
    }

    setStats(analyzeText(input));
  }, [input]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'var(--spacing-lg)', gap: 'var(--spacing-lg)' }}>
      {/* Input textarea */}
      <div style={{ flex: 1, minHeight: '200px', display: 'flex', flexDirection: 'column' }}>
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
          Text Input
        </label>
        <textarea
          className="textarea-macos"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter or paste text to analyze..."
          style={{
            flex: 1,
            minHeight: '200px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            resize: 'vertical',
          }}
        />
      </div>

      {/* Statistics */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
          {/* Basic Stats */}
          <div className="card-macos" style={{ padding: 'var(--spacing-md)' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
              BASIC STATISTICS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              <StatRow label="Characters" value={stats.characters.toLocaleString()} />
              <StatRow label="Words" value={stats.words.toLocaleString()} />
              <StatRow label="Lines" value={stats.lines.toLocaleString()} />
              <StatRow label="Paragraphs" value={stats.paragraphs.toLocaleString()} />
              <StatRow label="Bytes" value={stats.bytes.toLocaleString()} />
              <StatRow label="Encoding" value={stats.encoding} />
            </div>
          </div>

          {/* Properties */}
          <div className="card-macos" style={{ padding: 'var(--spacing-md)' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
              TEXT PROPERTIES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              <PropertyRow label="Leading whitespace" value={stats.hasLeadingWhitespace} />
              <PropertyRow label="Trailing whitespace" value={stats.hasTrailingWhitespace} />
              <PropertyRow label="Contains tabs" value={stats.hasTabs} />
              <PropertyRow label="Non-printable chars" value={stats.hasNonPrintable} />
              <PropertyRow label="Unicode characters" value={stats.hasUnicode} />
            </div>
          </div>

          {/* Character Frequency */}
          {stats.charFrequency.length > 0 && (
            <div className="card-macos" style={{ padding: 'var(--spacing-md)', gridColumn: 'span 1' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
                TOP 10 CHARACTERS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                {stats.charFrequency.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--spacing-xs)',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '500' }}>
                      '{item.char}'
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {item.count} times
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!stats && (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--spacing-xl)',
            color: 'var(--text-tertiary)',
            fontSize: '14px',
          }}
        >
          Enter text above to see analysis
        </div>
      )}
    </div>
  );
};

const StatRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</span>
    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
      {value}
    </span>
  </div>
);

const PropertyRow: React.FC<{ label: string; value: boolean }> = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</span>
    <span
      style={{
        fontSize: '12px',
        fontWeight: '600',
        padding: '2px 8px',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: value ? 'rgba(34, 197, 94, 0.1)' : 'rgba(156, 163, 175, 0.1)',
        color: value ? '#22c55e' : '#9ca3af',
      }}
    >
      {value ? 'Yes' : 'No'}
    </span>
  </div>
);
