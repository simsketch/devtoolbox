import React, { useState } from 'react';
import { decodeCertificate, CertInfo } from '@/lib/tauri';
import { useToolAction } from '@/hooks/useToolAction';

export const CertificateDecoderComponent: React.FC = () => {
  const [input, setInput] = useState('');
  const [certInfo, setCertInfo] = useState<CertInfo | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useToolAction(setInput);

  const handleDecode = async () => {
    if (!input.trim()) {
      setError('Please enter a certificate');
      return;
    }

    setLoading(true);
    setError('');
    setCertInfo(null);

    try {
      const result = await decodeCertificate(input);
      setCertInfo(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to decode certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'var(--spacing-lg)', gap: 'var(--spacing-lg)' }}>
      {/* Input */}
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
          PEM Certificate
        </label>
        <textarea
          className="textarea-macos"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="-----BEGIN CERTIFICATE-----&#10;MIIDXTCCAkWgAwIBAgIJAKL0UG+mRkSvMA0GCSqGSIb3DQEBCwUA...&#10;-----END CERTIFICATE-----"
          style={{
            flex: 1,
            minHeight: '200px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            resize: 'vertical',
          }}
        />
        <div style={{ marginTop: 'var(--spacing-xs)', fontSize: '12px', color: 'var(--text-tertiary)' }}>
          Paste a PEM-encoded X.509 certificate (including BEGIN/END markers)
        </div>
      </div>

      {/* Decode Button */}
      <div>
        <button
          className="btn-macos"
          onClick={handleDecode}
          disabled={loading || !input.trim()}
          style={{ fontSize: '14px', padding: '8px 16px' }}
        >
          {loading ? 'Decoding...' : 'Decode Certificate'}
        </button>
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

      {/* Certificate Info */}
      {certInfo && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <div className="card-macos" style={{ padding: 'var(--spacing-md)' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
              CERTIFICATE DETAILS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              <DetailRow label="Subject" value={certInfo.subject} />
              <DetailRow label="Issuer" value={certInfo.issuer} />
              <DetailRow label="Valid From" value={certInfo.not_before} />
              <DetailRow label="Valid Until" value={certInfo.not_after} />
              <DetailRow label="Serial Number" value={certInfo.serial} mono />
              <DetailRow label="Signature Algorithm" value={certInfo.algorithm} />
            </div>
          </div>

          {/* Validity Status */}
          <div className="card-macos" style={{ padding: 'var(--spacing-md)' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
              VALIDITY STATUS
            </div>
            <ValidityStatus notBefore={certInfo.not_before} notAfter={certInfo.not_after} />
          </div>
        </div>
      )}
    </div>
  );
};

const DetailRow: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
      {label}
    </span>
    <span
      style={{
        fontSize: '14px',
        color: 'var(--text-primary)',
        fontFamily: mono ? 'var(--font-mono)' : 'inherit',
        wordBreak: 'break-all',
      }}
    >
      {value}
    </span>
  </div>
);

const ValidityStatus: React.FC<{ notBefore: string; notAfter: string }> = ({ notBefore, notAfter }) => {
  const now = new Date();
  const validFrom = new Date(notBefore);
  const validUntil = new Date(notAfter);

  const isValid = now >= validFrom && now <= validUntil;
  const isExpired = now > validUntil;
  const isNotYetValid = now < validFrom;

  let status = '';
  let color = '';
  let bgColor = '';

  if (isValid) {
    status = 'Valid';
    color = '#22c55e';
    bgColor = 'rgba(34, 197, 94, 0.1)';
  } else if (isExpired) {
    status = 'Expired';
    color = '#ef4444';
    bgColor = 'rgba(239, 68, 68, 0.1)';
  } else if (isNotYetValid) {
    status = 'Not Yet Valid';
    color = '#f59e0b';
    bgColor = 'rgba(245, 158, 11, 0.1)';
  }

  const daysUntilExpiry = Math.floor((validUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const daysUntilValid = Math.floor((validFrom.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div>
      <div
        style={{
          display: 'inline-block',
          padding: '6px 12px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: bgColor,
          color,
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: 'var(--spacing-sm)',
        }}
      >
        {status}
      </div>
      {isValid && (
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          {daysUntilExpiry > 0
            ? `Expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}`
            : 'Expires today'}
        </div>
      )}
      {isNotYetValid && (
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Valid in {daysUntilValid} day{daysUntilValid === 1 ? '' : 's'}
        </div>
      )}
    </div>
  );
};
