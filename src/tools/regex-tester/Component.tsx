import React, { useState, useEffect } from 'react';
import { CodeEditor } from '@/components/common/CodeEditor';
import { useToolAction } from '@/hooks/useToolAction';

interface Match {
  text: string;
  index: number;
  groups: string[];
}

export const RegexTesterComponent: React.FC = () => {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState({
    g: true,
    i: false,
    m: false,
    s: false,
  });
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState('');
  const [highlightedText, setHighlightedText] = useState('');

  useToolAction(setTestString);

  useEffect(() => {
    if (!pattern || !testString) {
      setMatches([]);
      setError('');
      setHighlightedText(testString);
      return;
    }

    try {
      const flagString = Object.entries(flags)
        .filter(([_, enabled]) => enabled)
        .map(([flag]) => flag)
        .join('');

      const regex = new RegExp(pattern, flagString);
      const foundMatches: Match[] = [];

      if (flags.g) {
        let match;
        while ((match = regex.exec(testString)) !== null) {
          foundMatches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          foundMatches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      setMatches(foundMatches);
      setError('');

      // Highlight matches in the text
      if (foundMatches.length > 0) {
        let highlighted = testString;
        let offset = 0;
        foundMatches.forEach((match) => {
          const start = match.index + offset;
          const end = start + match.text.length;
          const before = highlighted.substring(0, start);
          const matchText = highlighted.substring(start, end);
          const after = highlighted.substring(end);
          highlighted = `${before}<mark style="background-color: rgba(59, 130, 246, 0.3); padding: 2px 4px; border-radius: 3px;">${matchText}</mark>${after}`;
          offset += 127; // Length of the mark tags
        });
        setHighlightedText(highlighted);
      } else {
        setHighlightedText(testString);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid regex pattern');
      setMatches([]);
      setHighlightedText(testString);
    }
  }, [pattern, testString, flags]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header with controls */}
      <div
        style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--border-secondary)',
        }}
      >
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--spacing-xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Pattern
          </label>
          <input
            type="text"
            className="input-macos"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern (e.g., \d{3}-\d{4})"
            style={{
              width: '100%',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-lg)',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={flags.g}
                onChange={(e) => setFlags({ ...flags, g: e.target.checked })}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                <code>g</code> Global
              </span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={flags.i}
                onChange={(e) => setFlags({ ...flags, i: e.target.checked })}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                <code>i</code> Case-insensitive
              </span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={flags.m}
                onChange={(e) => setFlags({ ...flags, m: e.target.checked })}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                <code>m</code> Multiline
              </span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={flags.s}
                onChange={(e) => setFlags({ ...flags, s: e.target.checked })}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                <code>s</code> Dot matches all
              </span>
            </label>
          </div>

          {error && (
            <div style={{ color: '#ef4444', fontSize: '13px', fontWeight: '500' }}>
              Error: {error}
            </div>
          )}

          {!error && matches.length > 0 && (
            <div style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: '500' }}>
              {matches.length} match{matches.length !== 1 ? 'es' : ''} found
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          gap: 'var(--spacing-lg)',
          padding: 'var(--spacing-lg)',
          overflow: 'hidden',
        }}
      >
        {/* Test string */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <label
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--spacing-sm)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Test String
          </label>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CodeEditor
              value={testString}
              onChange={setTestString}
              language="text"
              placeholder="Enter test string..."
              minHeight="100%"
              maxHeight="100%"
            />
          </div>
        </div>

        {/* Results */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <label
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--spacing-sm)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Matches ({matches.length})
          </label>
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-md)',
            }}
          >
            {matches.length === 0 ? (
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  textAlign: 'center',
                  padding: 'var(--spacing-lg)',
                }}
              >
                No matches found
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {matches.map((match, idx) => (
                  <div
                    key={idx}
                    className="card-macos"
                    style={{
                      padding: 'var(--spacing-md)',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-secondary)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div style={{ marginBottom: 'var(--spacing-xs)' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          fontWeight: '600',
                        }}
                      >
                        Match #{idx + 1}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          marginLeft: 'var(--spacing-sm)',
                        }}
                      >
                        at index {match.index}
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        color: 'var(--text-primary)',
                        padding: 'var(--spacing-sm)',
                        backgroundColor: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: match.groups.length > 0 ? 'var(--spacing-sm)' : 0,
                      }}
                    >
                      {match.text}
                    </div>
                    {match.groups.length > 0 && (
                      <div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                            fontWeight: '600',
                            marginBottom: 'var(--spacing-xs)',
                          }}
                        >
                          Groups:
                        </div>
                        {match.groups.map((group, gIdx) => (
                          <div
                            key={gIdx}
                            style={{
                              fontSize: '12px',
                              fontFamily: 'var(--font-mono)',
                              color: 'var(--text-secondary)',
                              marginLeft: 'var(--spacing-md)',
                            }}
                          >
                            {gIdx + 1}: {group || '(empty)'}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
