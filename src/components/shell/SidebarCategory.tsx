import React, { useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronRight } from 'lucide-react';

interface SidebarCategoryProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}

export const SidebarCategory: React.FC<SidebarCategoryProps> = ({
  title,
  children,
  defaultOpen = true,
  icon,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className="mb-2">
      <Collapsible.Trigger
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors rounded-md hover:bg-opacity-50"
        style={{
          color: 'var(--text-tertiary)',
        }}
      >
        <ChevronRight
          size={14}
          style={{
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 150ms ease-out',
          }}
        />
        {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
        <span>{title}</span>
      </Collapsible.Trigger>

      <Collapsible.Content className="mt-1 space-y-1">
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
