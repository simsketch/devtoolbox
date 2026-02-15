import React, { useCallback, useEffect, useRef } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useAppStore } from '../../stores/app-store';
import { getToolById } from '../../tools';

export const TitleBar: React.FC = () => {
  const activeTool = useAppStore((state) => state.activeTool);
  const tool = activeTool ? getToolById(activeTool) : null;
  const titleBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = titleBarRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      // Only left-click, skip interactive elements
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest('button, input, select, a')) return;

      e.preventDefault();
      getCurrentWindow().startDragging();
    };

    el.addEventListener('mousedown', onMouseDown);
    return () => el.removeEventListener('mousedown', onMouseDown);
  }, []);

  return (
    <div
      ref={titleBarRef}
      className="titlebar flex items-center justify-center"
      style={{
        height: 'var(--titlebar-height)',
        paddingLeft: 'var(--traffic-light-inset)',
        paddingRight: 'var(--spacing-lg)',
        background: 'rgba(255, 255, 255, 0.02)',
        borderBottom: '1px solid var(--glass-border)',
        backdropFilter: 'blur(40px) saturate(150%)',
        WebkitBackdropFilter: 'blur(40px) saturate(150%)',
        cursor: 'default',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
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
            pointerEvents: 'none',
          }}
        >
          {tool.name}
        </div>
      )}
    </div>
  );
};
