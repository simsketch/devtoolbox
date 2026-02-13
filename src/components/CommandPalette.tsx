import React from 'react';
import { Command } from 'cmdk';
import { useAppStore } from '../stores/app-store';
import { allTools } from '../tools';
import * as LucideIcons from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const commandPaletteOpen = useAppStore((state) => state.commandPaletteOpen);
  const closeCommandPalette = useAppStore((state) => state.closeCommandPalette);
  const setActiveTool = useAppStore((state) => state.setActiveTool);

  const handleSelect = (toolId: string) => {
    setActiveTool(toolId);
    closeCommandPalette();
  };

  if (!commandPaletteOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-28"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={closeCommandPalette}
    >
      <Command
        className="w-full max-w-2xl overflow-hidden"
        style={{
          background: 'rgba(20, 20, 40, 0.85)',
          backdropFilter: 'blur(40px) saturate(160%)',
          WebkitBackdropFilter: 'blur(40px) saturate(160%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-xl)',
          boxShadow:
            '0 24px 80px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center gap-3 px-5"
          style={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <LucideIcons.Search size={16} style={{ color: 'var(--text-tertiary)' }} />
          <Command.Input
            className="flex-1 py-4 outline-none text-[14px]"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
            }}
            placeholder="Search tools..."
            autoFocus
          />
        </div>

        <Command.List className="max-h-[400px] overflow-y-auto p-2">
          <Command.Empty
            className="py-10 text-center text-sm"
            style={{ color: 'var(--text-tertiary)' }}
          >
            No tools found.
          </Command.Empty>

          {allTools.map((tool) => {
            const IconComponent = (LucideIcons as any)[tool.icon] || LucideIcons.File;

            return (
              <Command.Item
                key={tool.id}
                value={`${tool.name} ${tool.description} ${tool.keywords.join(' ')} ${tool.category}`}
                onSelect={() => handleSelect(tool.id)}
                className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
                style={{
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(108, 180, 255, 0.1)';
                  e.currentTarget.style.border = 'none';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <IconComponent
                    size={16}
                    style={{ color: tool.iconColor || 'var(--text-secondary)' }}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium">{tool.name}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                    {tool.description}
                  </div>
                </div>
                <div
                  className="text-[10px] px-2 py-1 uppercase tracking-wider font-medium"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  {tool.category}
                </div>
              </Command.Item>
            );
          })}
        </Command.List>
      </Command>
    </div>
  );
};
