import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../stores/app-store';
import { getToolById } from '../../tools';
import { Wrench, Command, Sidebar, Settings } from 'lucide-react';
import { ToolToolbar } from '../common/ToolToolbar';

const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd
    className="inline-flex items-center px-2 py-1 text-xs font-medium"
    style={{
      background: 'rgba(255, 255, 255, 0.06)',
      color: 'var(--text-primary)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: 'var(--radius-sm)',
      boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.04)',
    }}
  >
    {children}
  </kbd>
);

const ShortcutHint: React.FC<{ icon: React.ReactNode; shortcut: string; description: string }> = ({
  icon,
  shortcut,
  description,
}) => (
  <div
    className="flex items-center gap-3 p-3"
    style={{
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.03)',
    }}
  >
    <div
      className="flex items-center justify-center w-8 h-8"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-secondary)',
      }}
    >
      {icon}
    </div>
    <div className="flex-1 text-left">
      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
        {description}
      </div>
    </div>
    <Kbd>{shortcut}</Kbd>
  </div>
);

const WelcomeScreen: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
    className="flex-1 flex items-center justify-center"
  >
    <div className="text-center max-w-xl px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.2, 0, 0, 1] }}
      >
        <div
          className="mx-auto mb-8 flex items-center justify-center"
          style={{
            width: 80,
            height: 80,
            background: 'rgba(108, 180, 255, 0.08)',
            border: '1px solid rgba(108, 180, 255, 0.15)',
            borderRadius: 24,
            boxShadow: '0 0 40px rgba(108, 180, 255, 0.06), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
          }}
        >
          <Wrench size={36} style={{ color: 'var(--accent)' }} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h1 className="text-3xl font-semibold mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
          DevToolbox
        </h1>
        <p className="text-[14px] mb-10 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          35 essential developer tools in one app.
          <br />
          Select a tool or use shortcuts to begin.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="space-y-2 max-w-sm mx-auto"
      >
        <ShortcutHint icon={<Command size={15} />} shortcut="⌘K" description="Search tools" />
        <ShortcutHint icon={<Sidebar size={15} />} shortcut="⌘B" description="Toggle sidebar" />
        <ShortcutHint icon={<Settings size={15} />} shortcut="⌘," description="Settings" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-10 text-xs"
        style={{ color: 'var(--text-tertiary)' }}
      >
        Privacy-first &middot; Keyboard driven &middot; Native performance
      </motion.p>
    </div>
  </motion.div>
);

const ToolView: React.FC<{ toolId: string }> = ({ toolId }) => {
  const tool = getToolById(toolId);
  const triggerToolAction = useAppStore((state) => state.triggerToolAction);

  if (!tool) return null;

  const ToolComponent = tool.component;

  const handleClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      triggerToolAction('clipboard', text);
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  const handleSample = () => {
    if (tool.sampleData) {
      triggerToolAction('sample');
    }
  };

  const handleClear = () => {
    triggerToolAction('clear');
  };

  return (
    <div
      key={toolId}
      className="flex-1 flex flex-col overflow-hidden"
    >
      <ToolToolbar
        onClipboard={handleClipboard}
        onSample={tool.sampleData ? handleSample : undefined}
        onClear={handleClear}
      />
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <ToolComponent />
        </div>
      </div>
    </div>
  );
};

export const ContentArea: React.FC = () => {
  const activeTool = useAppStore((state) => state.activeTool);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {activeTool ? (
        <ToolView key={activeTool} toolId={activeTool} />
      ) : (
        <WelcomeScreen />
      )}
    </div>
  );
};
