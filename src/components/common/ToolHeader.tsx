import React from 'react';

interface ToolHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({ title, description, actions }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: 'var(--spacing-lg) var(--spacing-xl)',
        borderBottom: '1px solid var(--border-secondary)',
        gap: 'var(--spacing-lg)',
      }}
    >
      <div style={{ flex: 1 }}>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: description ? 'var(--spacing-xs)' : '0',
          }}
        >
          {title}
        </h2>
        {description && (
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: '1.5',
            }}
          >
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
          }}
        >
          {actions}
        </div>
      )}
    </div>
  );
};
