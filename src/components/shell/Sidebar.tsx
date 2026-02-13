import React, { useMemo } from 'react';
import { Search } from 'lucide-react';
import { useAppStore } from '../../stores/app-store';
import { allTools, searchTools, getToolById } from '../../tools';
import { SidebarItem } from './SidebarItem';

export const Sidebar: React.FC = () => {
  const activeTool = useAppStore((state) => state.activeTool);
  const setActiveTool = useAppStore((state) => state.setActiveTool);
  const sidebarCollapsed = useAppStore((state) => state.sidebarCollapsed);
  const searchQuery = useAppStore((state) => state.searchQuery);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const favorites = useAppStore((state) => state.favorites);

  if (sidebarCollapsed) {
    return null;
  }

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return searchTools(searchQuery);
  }, [searchQuery]);

  const favoriteTools = useMemo(() => {
    return favorites
      .map(id => getToolById(id))
      .filter((tool): tool is NonNullable<typeof tool> => tool !== undefined);
  }, [favorites]);

  const displayTools = filteredTools ?? allTools;

  return (
    <div
      className="vibrancy-sidebar flex flex-col relative"
      style={{
        width: 'var(--sidebar-width)',
        height: '100%',
        borderRight: '1px solid var(--glass-border)',
      }}
    >
      {/* Search Input */}
      <div
        className="sticky top-0 z-10"
        style={{
          padding: '14px 14px 10px',
          background: 'var(--sidebar-bg)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
        }}
      >
        <div
          className="relative flex items-center"
          style={{
            gap: '10px',
            padding: '10px 14px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.04)',
          }}
        >
          <Search size={15} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search... (⌘/)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            style={{ color: 'var(--text-primary)', fontSize: '14px' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="rounded"
              style={{
                color: 'var(--text-tertiary)',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '2px 8px',
                fontSize: '11px',
              }}
            >
              esc
            </button>
          )}
        </div>
      </div>

      {/* Tool List */}
      <div className="flex-1 overflow-y-auto pb-4" style={{ padding: '0 12px 16px' }}>
        {/* Favorites Section */}
        {!filteredTools && favoriteTools.length > 0 && (
          <>
            <div
              className="px-2.5 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Favorites
            </div>
            <div className="space-y-2">
              {favoriteTools.map((tool) => (
                <SidebarItem
                  key={`fav-${tool.id}`}
                  id={tool.id}
                  label={tool.name}
                  icon={tool.icon}
                  iconColor={tool.iconColor}
                  active={activeTool === tool.id}
                  onClick={() => setActiveTool(tool.id)}
                />
              ))}
            </div>
            <div
              className="mx-3 my-2.5"
              style={{
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
              }}
            />
          </>
        )}

        {/* Search results header */}
        {filteredTools && (
          <div
            className="px-2.5 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Results ({filteredTools.length})
          </div>
        )}

        {/* All Tools (flat list) */}
        <div className="space-y-2">
          {displayTools.length > 0 ? (
            displayTools.map((tool) => (
              <SidebarItem
                key={tool.id}
                id={tool.id}
                label={tool.name}
                icon={tool.icon}
                iconColor={tool.iconColor}
                active={activeTool === tool.id}
                onClick={() => setActiveTool(tool.id)}
              />
            ))
          ) : (
            <div
              className="px-2.5 py-6 text-[13px] text-center"
              style={{ color: 'var(--text-tertiary)' }}
            >
              No tools found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
