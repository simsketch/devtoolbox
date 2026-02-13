import React, { useState } from 'react';
import { Clipboard, Check } from 'lucide-react';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Try Tauri clipboard first
      await writeText(text);
      setCopied(true);
    } catch (error) {
      // Fallback to browser clipboard API
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
      } catch (fallbackError) {
        console.error('Failed to copy text:', fallbackError);
      }
    }

    // Reset the "Copied!" state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`copy-button ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 10px',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        fontSize: '12px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        outline: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
      }}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <>
          <Check size={14} />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Clipboard size={14} />
          <span>Copy</span>
        </>
      )}
    </button>
  );
};
