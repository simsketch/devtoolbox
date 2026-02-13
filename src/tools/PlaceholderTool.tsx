import React from 'react';

interface PlaceholderToolProps {
  toolName: string;
}

export const PlaceholderTool: React.FC<PlaceholderToolProps> = ({ toolName }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {toolName}
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>Coming soon...</p>
      </div>
    </div>
  );
};

export const createPlaceholder = (name: string) => () => <PlaceholderTool toolName={name} />;
