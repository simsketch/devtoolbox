import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md';
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  size = 'md',
}) => {
  const dimensions = size === 'sm' ? { width: 36, height: 20, knob: 16 } : { width: 42, height: 24, knob: 20 };

  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {label && (
        <span
          style={{
            fontSize: size === 'sm' ? '12px' : '13px',
            color: 'var(--text-primary)',
            fontWeight: '500',
          }}
        >
          {label}
        </span>
      )}
      <div
        className="toggle-macos"
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          position: 'relative',
          display: 'inline-block',
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={{
            opacity: 0,
            width: 0,
            height: 0,
          }}
        />
        <span
          className="toggle-macos-slider"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: checked ? 'var(--accent)' : 'var(--border-primary)',
            borderRadius: `${dimensions.height / 2}px`,
            transition: 'all var(--transition-fast)',
          }}
        >
          <span
            style={{
              position: 'absolute',
              content: '""',
              height: `${dimensions.knob}px`,
              width: `${dimensions.knob}px`,
              left: '2px',
              bottom: '2px',
              backgroundColor: 'white',
              borderRadius: '50%',
              transition: 'all var(--transition-fast)',
              transform: checked ? `translateX(${dimensions.width - dimensions.knob - 4}px)` : 'translateX(0)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
            }}
          />
        </span>
      </div>
    </label>
  );
};
