import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import * as Icons from 'lucide-react';
import { allTools, categories, searchTools } from '@/tools/index';
import type { ToolCategory } from '@/types/tool';

export const PipelineSidebar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => searchTools(searchQuery), [searchQuery]);

  // Group tools by category
  const toolsByCategory = useMemo(() => {
    const grouped = new Map<ToolCategory, typeof allTools>();

    filteredTools.forEach((tool) => {
      // Skip the pipeline builder itself
      if (tool.id === 'pipeline-builder') return;

      if (!grouped.has(tool.category)) {
        grouped.set(tool.category, []);
      }
      grouped.get(tool.category)!.push(tool);
    });

    return grouped;
  }, [filteredTools]);

  const onDragStart = (event: React.DragEvent, toolId: string) => {
    event.dataTransfer.setData('application/reactflow', toolId);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      style={{
        width: '240px',
        height: '100%',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-secondary)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Search */}
      <div style={{ padding: 'var(--spacing-md)' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-macos"
            style={{
              paddingLeft: '32px',
              fontSize: '12px',
              padding: '6px 8px 6px 32px',
            }}
          />
        </div>
      </div>

      {/* Tools List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 var(--spacing-sm)',
        }}
      >
        {Array.from(toolsByCategory.entries()).map(([category, tools]) => (
          <div key={category} style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                padding: '0 var(--spacing-sm)',
                marginBottom: 'var(--spacing-xs)',
              }}
            >
              {categories[category]}
            </div>

            {tools.map((tool) => {
              const IconComponent = (Icons as any)[tool.icon] || Icons.Box;

              return (
                <div
                  key={tool.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, tool.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    padding: 'var(--spacing-sm)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'grab',
                    transition: 'all 0.15s ease',
                    marginBottom: '2px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.cursor = 'grabbing';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.cursor = 'grab';
                  }}
                >
                  <IconComponent
                    size={14}
                    style={{
                      color: 'var(--accent)',
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      fontSize: '12px',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tool.name}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {filteredTools.length === 0 && (
          <div
            style={{
              padding: 'var(--spacing-xl)',
              textAlign: 'center',
              color: 'var(--text-tertiary)',
              fontSize: '12px',
            }}
          >
            No tools found
          </div>
        )}
      </div>
    </div>
  );
};
