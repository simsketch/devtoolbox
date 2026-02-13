import React from 'react';
import type { FormatDetection } from '@/lib/format-detector';
import { Sparkles, X } from 'lucide-react';

interface AutoDetectBannerProps {
  detection: FormatDetection;
  onAccept: () => void;
  onDismiss: () => void;
}

export const AutoDetectBanner: React.FC<AutoDetectBannerProps> = ({
  detection,
  onAccept,
  onDismiss,
}) => {
  return (
    <div
      className="auto-detect-banner"
      style={{
        position: 'fixed',
        top: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        width: 'auto',
        maxWidth: '600px',
        animation: 'slideDown 0.3s ease-out',
      }}
    >
      <div
        className="card-macos"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)',
          padding: 'var(--spacing-md) var(--spacing-lg)',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Sparkles
          size={20}
          style={{
            color: 'var(--accent)',
            flexShrink: 0,
          }}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '14px',
              color: 'var(--text-primary)',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Looks like <strong>{detection.format}</strong> — Open{' '}
            <strong>{detection.description.replace(' detected', '')}</strong>?
          </div>
          {detection.confidence < 1 && (
            <div
              style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginTop: '2px',
              }}
            >
              {Math.round(detection.confidence * 100)}% confident
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-sm)',
            flexShrink: 0,
          }}
        >
          <button
            className="btn-macos"
            onClick={onAccept}
            style={{
              fontSize: '13px',
              padding: '6px 16px',
            }}
          >
            Open
          </button>
          <button
            className="btn-macos-secondary"
            onClick={onDismiss}
            style={{
              fontSize: '13px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <X size={14} />
            Dismiss
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};
