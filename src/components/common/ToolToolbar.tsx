import React from 'react';
import { Clipboard, FileText, Trash2 } from 'lucide-react';

interface ToolToolbarProps {
  onClipboard?: () => void;
  onSample?: () => void;
  onClear?: () => void;
}

const ToolbarButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ icon, label, onClick, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '7px 14px',
      fontSize: '13px',
      fontWeight: 500,
      color: disabled ? 'var(--text-tertiary)' : 'var(--text-secondary)',
      background: disabled ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.06)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      opacity: disabled ? 0.5 : 1,
    }}
    onMouseEnter={(e) => {
      if (!disabled) {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        e.currentTarget.style.color = 'var(--text-primary)';
      }
    }}
    onMouseLeave={(e) => {
      if (!disabled) {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.color = 'var(--text-secondary)';
      }
    }}
  >
    {icon}
    {label}
  </button>
);

export const ToolToolbar: React.FC<ToolToolbarProps> = ({
  onClipboard,
  onSample,
  onClear,
}) => {
  return (
    <div
      className="flex items-center"
      style={{
        gap: '10px',
        padding: '12px 24px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderBottom: '1px solid var(--glass-border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <ToolbarButton
        icon={<Clipboard size={14} />}
        label="Clipboard"
        onClick={onClipboard}
      />
      <ToolbarButton
        icon={<FileText size={14} />}
        label="Sample"
        onClick={onSample}
        disabled={!onSample}
      />
      <ToolbarButton
        icon={<Trash2 size={14} />}
        label="Clear"
        onClick={onClear}
      />
    </div>
  );
};
