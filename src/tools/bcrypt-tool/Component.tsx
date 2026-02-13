import React, { useState } from 'react';
import { bcryptHash, bcryptVerify } from '@/lib/tauri';
import { CopyButton } from '@/components/common/CopyButton';
import { useToolAction } from '@/hooks/useToolAction';
import { CheckCircle, XCircle } from 'lucide-react';

export const BcryptToolComponent: React.FC = () => {
  const [mode, setMode] = useState<'hash' | 'verify'>('hash');

  // Hash mode state
  const [password, setPassword] = useState('');
  const [cost, setCost] = useState(10);
  const [hash, setHash] = useState('');
  const [hashError, setHashError] = useState('');
  const [hashing, setHashing] = useState(false);

  // Verify mode state
  const [verifyPassword, setVerifyPassword] = useState('');
  const [verifyHash, setVerifyHash] = useState('');
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const [verifyError, setVerifyError] = useState('');
  const [verifying, setVerifying] = useState(false);

  useToolAction(setPassword);

  const handleHash = async () => {
    if (!password) {
      setHashError('Please enter a password');
      return;
    }

    setHashing(true);
    setHashError('');
    setHash('');

    try {
      const result = await bcryptHash(password, cost);
      setHash(result);
    } catch (err: any) {
      setHashError(err?.message || 'Failed to hash password');
    } finally {
      setHashing(false);
    }
  };

  const handleVerify = async () => {
    if (!verifyPassword || !verifyHash) {
      setVerifyError('Please enter both password and hash');
      return;
    }

    setVerifying(true);
    setVerifyError('');
    setVerifyResult(null);

    try {
      const result = await bcryptVerify(verifyPassword, verifyHash);
      setVerifyResult(result);
    } catch (err: any) {
      setVerifyError(err?.message || 'Failed to verify password');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header with mode tabs */}
      <div
        style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--border-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
        }}
      >
        <button
          className={mode === 'hash' ? 'btn-macos' : 'btn-macos-secondary'}
          onClick={() => setMode('hash')}
          style={{ fontSize: '13px', padding: '6px 12px' }}
        >
          Hash Password
        </button>
        <button
          className={mode === 'verify' ? 'btn-macos' : 'btn-macos-secondary'}
          onClick={() => setMode('verify')}
          style={{ fontSize: '13px', padding: '6px 12px' }}
        >
          Verify Password
        </button>
      </div>

      {/* Hash Mode */}
      {mode === 'hash' && (
        <div style={{ padding: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {/* Password Input */}
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
              Password
            </label>
            <input
              type="password"
              className="input-macos"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to hash..."
              style={{
                width: '100%',
                fontSize: '14px',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleHash();
              }}
            />
          </div>

          {/* Cost Factor */}
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
              Cost Factor: {cost}
            </label>
            <input
              type="range"
              min="4"
              max="12"
              value={cost}
              onChange={(e) => setCost(parseInt(e.target.value))}
              style={{
                width: '100%',
                cursor: 'pointer',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              <span>4 (Fast)</span>
              <span>12 (Secure)</span>
            </div>
            <div style={{ marginTop: 'var(--spacing-xs)', fontSize: '12px', color: 'var(--text-tertiary)' }}>
              Higher values are more secure but slower. Recommended: 10-12
            </div>
          </div>

          {/* Hash Button */}
          <div>
            <button
              className="btn-macos"
              onClick={handleHash}
              disabled={hashing || !password}
              style={{ fontSize: '14px', padding: '8px 16px' }}
            >
              {hashing ? 'Hashing...' : 'Generate Hash'}
            </button>
          </div>

          {/* Error */}
          {hashError && (
            <div
              className="card-macos"
              style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderColor: '#ef4444',
              }}
            >
              <div style={{ color: '#ef4444', fontWeight: '500', fontSize: '13px' }}>
                Error: {hashError}
              </div>
            </div>
          )}

          {/* Hash Output */}
          {hash && (
            <div className="card-macos" style={{ padding: 'var(--spacing-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  BCRYPT HASH
                </div>
                <CopyButton text={hash} />
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
                {hash}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="card-macos" style={{ padding: 'var(--spacing-md)' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
              ABOUT BCRYPT
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Bcrypt is a password hashing function designed for secure password storage. It automatically handles salt generation and includes a cost factor that makes it resistant to brute-force attacks. Each hash is unique even for the same password.
            </div>
          </div>
        </div>
      )}

      {/* Verify Mode */}
      {mode === 'verify' && (
        <div style={{ padding: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {/* Password Input */}
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
              Password
            </label>
            <input
              type="password"
              className="input-macos"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              placeholder="Enter password to verify..."
              style={{
                width: '100%',
                fontSize: '14px',
              }}
            />
          </div>

          {/* Hash Input */}
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
              Bcrypt Hash
            </label>
            <textarea
              className="textarea-macos"
              value={verifyHash}
              onChange={(e) => setVerifyHash(e.target.value)}
              placeholder="$2b$10$..."
              style={{
                width: '100%',
                minHeight: '80px',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Verify Button */}
          <div>
            <button
              className="btn-macos"
              onClick={handleVerify}
              disabled={verifying || !verifyPassword || !verifyHash}
              style={{ fontSize: '14px', padding: '8px 16px' }}
            >
              {verifying ? 'Verifying...' : 'Verify Password'}
            </button>
          </div>

          {/* Error */}
          {verifyError && (
            <div
              className="card-macos"
              style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderColor: '#ef4444',
              }}
            >
              <div style={{ color: '#ef4444', fontWeight: '500', fontSize: '13px' }}>
                Error: {verifyError}
              </div>
            </div>
          )}

          {/* Verify Result */}
          {verifyResult !== null && (
            <div
              className="card-macos"
              style={{
                padding: 'var(--spacing-lg)',
                backgroundColor: verifyResult ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderColor: verifyResult ? '#22c55e' : '#ef4444',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                {verifyResult ? (
                  <CheckCircle size={32} style={{ color: '#22c55e' }} />
                ) : (
                  <XCircle size={32} style={{ color: '#ef4444' }} />
                )}
                <div>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: verifyResult ? '#22c55e' : '#ef4444',
                      marginBottom: '4px',
                    }}
                  >
                    {verifyResult ? 'Password Match' : 'Password Mismatch'}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {verifyResult
                      ? 'The password matches the provided hash.'
                      : 'The password does not match the provided hash.'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
