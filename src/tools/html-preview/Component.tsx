import React, { useState, useEffect, useRef } from 'react';
import { CodeEditor } from '@/components/common/CodeEditor';
import { RefreshCw, Eye } from 'lucide-react';
import { useToolAction } from '@/hooks/useToolAction';

export const HtmlPreviewComponent: React.FC = () => {
  const [input, setInput] = useState(`<!DOCTYPE html>
<html>
<head>
  <title>HTML Preview</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      padding: 20px;
    }
    h1 {
      color: #3b82f6;
    }
  </style>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Edit the HTML on the left to see changes here.</p>
  <button onclick="alert('Button clicked!')">Click Me</button>
</body>
</html>`);
  const [preview, setPreview] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useToolAction(setInput);

  useEffect(() => {
    if (autoRefresh) {
      const timer = setTimeout(() => {
        updatePreview();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [input, autoRefresh]);

  const updatePreview = () => {
    setPreview(input);
  };

  const handleRefresh = () => {
    updatePreview();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header with controls */}
      <div
        style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--border-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-lg)',
        }}
      >
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
            Auto-refresh
          </span>
        </label>

        {!autoRefresh && (
          <button
            className="btn-macos"
            onClick={handleRefresh}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              padding: '6px 12px',
            }}
          >
            <RefreshCw size={14} />
            Refresh Preview
          </button>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', color: 'var(--text-tertiary)', fontSize: '12px' }}>
          <Eye size={14} />
          {autoRefresh ? 'Live preview enabled' : 'Manual refresh mode'}
        </div>
      </div>

      {/* Editor and Preview */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 'var(--spacing-lg)',
          flex: 1,
          overflow: 'hidden',
          padding: 'var(--spacing-lg)',
        }}
      >
        {/* Editor */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--spacing-sm)',
            }}
          >
            <label
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              HTML Code
            </label>
          </div>
          <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
            <CodeEditor
              value={input}
              onChange={setInput}
              language="html"
              placeholder="Enter HTML code..."
              minHeight="100%"
              maxHeight="100%"
            />
          </div>
        </div>

        {/* Preview */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--spacing-sm)',
            }}
          >
            <label
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Live Preview
            </label>
          </div>
          <div
            style={{
              flex: 1,
              overflow: 'hidden',
              minHeight: 0,
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-primary)',
            }}
          >
            <iframe
              ref={iframeRef}
              srcDoc={preview}
              title="HTML Preview"
              sandbox="allow-scripts allow-same-origin"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: 'var(--radius-md)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Info */}
      <div
        style={{
          padding: 'var(--spacing-sm) var(--spacing-lg)',
          borderTop: '1px solid var(--border-secondary)',
          fontSize: '12px',
          color: 'var(--text-tertiary)',
        }}
      >
        <strong>Note:</strong> The preview runs in a sandboxed iframe for security. Some features may be restricted.
      </div>

      {/* Mobile responsive layout */}
      <style>
        {`
          @media (max-width: 768px) {
            .html-preview-container {
              flex-direction: column !important;
            }
          }
        `}
      </style>
    </div>
  );
};
