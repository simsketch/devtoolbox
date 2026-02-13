import React from 'react';
import { useAppStore } from '../../stores/app-store';
import { getToolById } from '../../tools';

export const TitleBar: React.FC = () => {
  const activeTool = useAppStore((state) => state.activeTool);
  const tool = activeTool ? getToolById(activeTool) : null;

  return (
    <div
      className="titlebar flex items-center justify-center"
      style={{
        height: 'var(--titlebar-height)',
        paddingLeft: 'var(--traffic-light-inset)',
        paddingRight: 'var(--spacing-lg)',
        background: 'rgba(255, 255, 255, 0.02)',
        borderBottom: '1px solid var(--glass-border)',
        backdropFilter: 'blur(40px) saturate(150%)',
        WebkitBackdropFilter: 'blur(40px) saturate(150%)',
      }}
      data-tauri-drag-region
    >
      {tool && (
        <div
          className="px-4 py-1 text-xs font-medium tracking-wide"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 20,
            color: 'var(--text-secondary)',
            boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.04)',
          }}
          data-tauri-drag-region
        >
          {tool.name}
        </div>
      )}
    </div>
  );
};
