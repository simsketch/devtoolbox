import React, { useState } from 'react';
import { generatePassword } from '@/lib/tauri';
import { CopyButton } from '@/components/common/CopyButton';
import { RefreshCw } from 'lucide-react';

export const PasswordGeneratorComponent: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const result = await generatePassword(
        length,
        options.uppercase,
        options.lowercase,
        options.numbers,
        options.symbols
      );
      setPassword(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate password');
      setPassword('');
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateStrength = (pwd: string): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: 'None', color: '#gray' };

    let score = 0;

    // Length
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;

    // Character types
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: score / 7, label: 'Weak', color: '#ef4444' };
    if (score <= 4) return { score: score / 7, label: 'Fair', color: '#f59e0b' };
    if (score <= 6) return { score: score / 7, label: 'Good', color: '#10b981' };
    return { score: score / 7, label: 'Strong', color: '#22c55e' };
  };

  const strength = calculateStrength(password);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 'var(--spacing-xl)',
        gap: 'var(--spacing-xl)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xl)',
        }}
      >
        {/* Generated Password */}
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
            Generated Password
          </label>
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-sm)',
            }}
          >
            <div
              className="card-macos"
              style={{
                flex: 1,
                padding: 'var(--spacing-md)',
                fontFamily: 'var(--font-mono)',
                fontSize: '18px',
                fontWeight: '500',
                color: password ? 'var(--text-primary)' : 'var(--text-secondary)',
                minHeight: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                wordBreak: 'break-all',
              }}
            >
              {password || 'Click generate to create a password'}
            </div>
            {password && <CopyButton text={password} />}
          </div>

          {/* Strength indicator */}
          {password && (
            <div style={{ marginTop: 'var(--spacing-md)' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    fontWeight: '500',
                  }}
                >
                  Password Strength
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: strength.color,
                  }}
                >
                  {strength.label}
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${strength.score * 100}%`,
                    height: '100%',
                    backgroundColor: strength.color,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Length slider */}
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
            Length: {length}
          </label>
          <input
            type="range"
            min={8}
            max={128}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginTop: 'var(--spacing-xs)',
            }}
          >
            <span>8</span>
            <span>128</span>
          </div>
        </div>

        {/* Options checkboxes */}
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
            Character Types
          </label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--spacing-md)',
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={options.uppercase}
                onChange={(e) => setOptions({ ...options, uppercase: e.target.checked })}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                Uppercase (A-Z)
              </span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={options.lowercase}
                onChange={(e) => setOptions({ ...options, lowercase: e.target.checked })}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                Lowercase (a-z)
              </span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={options.numbers}
                onChange={(e) => setOptions({ ...options, numbers: e.target.checked })}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                Numbers (0-9)
              </span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={options.symbols}
                onChange={(e) => setOptions({ ...options, symbols: e.target.checked })}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                Symbols (!@#$...)
              </span>
            </label>
          </div>
        </div>

        {/* Generate button */}
        <button
          className="btn-macos"
          onClick={handleGenerate}
          disabled={isGenerating || (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols)}
          style={{
            fontSize: '14px',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--spacing-sm)',
          }}
        >
          <RefreshCw size={18} />
          Generate Password
        </button>

        {error && (
          <div
            style={{
              color: '#ef4444',
              fontSize: '13px',
              fontWeight: '500',
              textAlign: 'center',
            }}
          >
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
};
