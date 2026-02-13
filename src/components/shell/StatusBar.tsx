import React from 'react';

export const StatusBar: React.FC = () => {
  return (
    <div
      className="flex items-center justify-end px-4 text-[11px]"
      style={{
        height: 'var(--statusbar-height)',
        background: 'rgba(255, 255, 255, 0.02)',
        borderTop: '1px solid var(--glass-border)',
        color: 'var(--text-tertiary)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        letterSpacing: '0.02em',
      }}
    >
      <span style={{ opacity: 0.7 }}>DevToolbox v0.1.0</span>
    </div>
  );
};
