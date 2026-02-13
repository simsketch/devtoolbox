import React, { useState, useEffect } from 'react';
import { CodeEditor } from '@/components/common/CodeEditor';
import { CopyButton } from '@/components/common/CopyButton';
import { jwtDecode, jwtVerify } from '@/lib/tauri';
import { useToolAction } from '@/hooks/useToolAction';

export const JwtDecoderComponent: React.FC = () => {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');
  const [secret, setSecret] = useState('');
  const [algorithm, setAlgorithm] = useState('HS256');
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);

  useToolAction(setToken);

  useEffect(() => {
    decodeToken();
  }, [token]);

  const decodeToken = async () => {
    if (!token.trim()) {
      setHeader('');
      setPayload('');
      setSignature('');
      setError('');
      setVerifyResult(null);
      return;
    }

    setError('');
    setVerifyResult(null);

    try {
      const result = await jwtDecode(token);
      setHeader(JSON.stringify(result.header, null, 2));
      setPayload(JSON.stringify(result.payload, null, 2));
      setSignature(result.signature);
    } catch (err: any) {
      setError(err?.message || 'Invalid JWT token');
      setHeader('');
      setPayload('');
      setSignature('');
    }
  };

  const handleVerify = async () => {
    if (!token.trim() || !secret.trim()) {
      return;
    }

    setVerifying(true);
    setVerifyResult(null);

    try {
      const result = await jwtVerify(token, secret, algorithm);
      setVerifyResult(result);
    } catch (err: any) {
      setError(err?.message || 'Verification failed');
      setVerifyResult(false);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto' }}>
      {/* Token Input Section */}
      <div
        style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--border-secondary)',
        }}
      >
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
          JWT Token
        </label>
        <textarea
          className="textarea-macos"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JWT token here..."
          style={{
            width: '100%',
            minHeight: '100px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            resize: 'vertical',
          }}
        />
        {error && (
          <div
            style={{
              marginTop: 'var(--spacing-sm)',
              color: '#ef4444',
              fontSize: '13px',
              fontWeight: '500',
            }}
          >
            Error: {error}
          </div>
        )}
      </div>

      {/* Token Info Summary */}
      {payload && (() => {
        try {
          const parsed = JSON.parse(payload);
          const formatEpoch = (epoch: number) =>
            new Date(epoch * 1000).toLocaleString('en-US', {
              month: 'numeric',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            });
          const now = Math.floor(Date.now() / 1000);
          const isExpired = parsed.exp ? parsed.exp < now : false;

          return (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--spacing-md)',
                padding: 'var(--spacing-md) var(--spacing-lg)',
                borderBottom: '1px solid var(--border-secondary)',
              }}
            >
              <div
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '13px',
                }}
              >
                <span style={{ color: 'var(--text-tertiary)' }}>Length: </span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{token.trim().length} chars</span>
              </div>
              {parsed.exp && (
                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: isExpired ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                    border: `1px solid ${isExpired ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
                    fontSize: '13px',
                  }}
                >
                  <span style={{ color: 'var(--text-tertiary)' }}>Expires: </span>
                  <span style={{ color: isExpired ? '#ef4444' : '#10b981', fontWeight: 500 }}>
                    {formatEpoch(parsed.exp)}{isExpired ? ' (expired)' : ''}
                  </span>
                </div>
              )}
              {parsed.iat && (
                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ color: 'var(--text-tertiary)' }}>Issued: </span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{formatEpoch(parsed.iat)}</span>
                </div>
              )}
              {parsed.nbf && (
                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ color: 'var(--text-tertiary)' }}>Not Before: </span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{formatEpoch(parsed.nbf)}</span>
                </div>
              )}
              {parsed.sub && (
                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ color: 'var(--text-tertiary)' }}>Subject: </span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{parsed.sub}</span>
                </div>
              )}
            </div>
          );
        } catch {
          return null;
        }
      })()}

      {/* Decoded Sections */}
      {(header || payload) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-lg)',
            padding: 'var(--spacing-lg)',
          }}
        >
          {/* Header Card */}
          <div
            className="card-macos"
            style={{
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-sm)',
              }}
            >
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#3b82f6',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Header
              </h3>
              <CopyButton text={header} />
            </div>
            <CodeEditor value={header} language="json" readOnly minHeight="150px" />
          </div>

          {/* Payload Card */}
          <div
            className="card-macos"
            style={{
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-sm)',
              }}
            >
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#10b981',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Payload
              </h3>
              <CopyButton text={payload} />
            </div>
            <CodeEditor value={payload} language="json" readOnly minHeight="150px" />
          </div>
        </div>
      )}

      {/* Signature Section */}
      {signature && (
        <div style={{ padding: '0 var(--spacing-lg) var(--spacing-lg)' }}>
          <div
            className="card-macos"
            style={{
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-sm)',
              }}
            >
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#f59e0b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Signature
              </h3>
              <CopyButton text={signature} />
            </div>
            <input
              className="input-macos"
              type="text"
              value={signature}
              readOnly
              style={{
                width: '100%',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
              }}
            />
          </div>
        </div>
      )}

      {/* Verify Section */}
      {token && (
        <div
          style={{
            padding: 'var(--spacing-lg)',
            borderTop: '1px solid var(--border-secondary)',
          }}
        >
          <h3
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-md)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Verify Signature
          </h3>
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-md)',
              alignItems: 'flex-end',
            }}
          >
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                Secret Key
              </label>
              <input
                className="input-macos"
                type="text"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter secret key..."
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                Algorithm
              </label>
              <select
                className="select-macos"
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
              >
                <option value="HS256">HS256</option>
                <option value="HS384">HS384</option>
                <option value="HS512">HS512</option>
              </select>
            </div>
            <button
              className="btn-macos"
              onClick={handleVerify}
              disabled={verifying || !secret.trim()}
              style={{ padding: '8px 16px' }}
            >
              {verifying ? 'Verifying...' : 'Verify'}
            </button>
          </div>
          {verifyResult !== null && (
            <div
              style={{
                marginTop: 'var(--spacing-md)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: verifyResult ? '#d1fae5' : '#fee2e2',
                color: verifyResult ? '#065f46' : '#991b1b',
                fontWeight: '500',
                fontSize: '13px',
              }}
            >
              {verifyResult ? '✓ Signature is valid' : '✗ Signature is invalid'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
