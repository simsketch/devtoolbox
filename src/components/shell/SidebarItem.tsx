import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';

interface SidebarItemProps {
  id: string;
  label: string;
  icon: string;
  iconColor?: string;
  active?: boolean;
  onClick: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  id,
  label,
  icon,
  iconColor,
  active,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.File;

  const activeStyle: React.CSSProperties = active
    ? {
        background: 'rgba(108, 180, 255, 0.12)',
        border: '1px solid rgba(108, 180, 255, 0.18)',
        boxShadow:
          '0 0 16px rgba(108, 180, 255, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
        color: '#e8eaf6',
      }
    : {
        background: isHovered ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
        border: '1px solid transparent',
        boxShadow: 'none',
        color: 'var(--text-primary)',
      };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full flex items-center text-[13px]"
      style={{
        ...activeStyle,
        gap: '12px',
        padding: '10px 16px',
        borderRadius: 'var(--radius-md)',
        transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)',
      }}
    >
      <IconComponent
        size={16}
        style={{
          flexShrink: 0,
          color: active ? '#8bc4ff' : (iconColor || 'var(--text-secondary)'),
          filter: active ? 'drop-shadow(0 0 4px rgba(108, 180, 255, 0.3))' : 'none',
          transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)',
        }}
      />
      <span
        className="flex-1 text-left truncate"
        style={{
          fontWeight: active ? 500 : 400,
          letterSpacing: active ? '0.01em' : '0',
        }}
      >
        {label}
      </span>
    </button>
  );
};
