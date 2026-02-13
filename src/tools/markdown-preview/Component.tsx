import React, { useState } from 'react';
import { CodeEditor } from '@/components/common/CodeEditor';
import ReactMarkdown from 'react-markdown';
import { useToolAction } from '@/hooks/useToolAction';
import remarkGfm from 'remark-gfm';

export const MarkdownPreviewComponent: React.FC = () => {
  const [markdown, setMarkdown] = useState('# Welcome to Markdown Preview\n\nStart typing to see the preview...\n\n## Features\n\n- **Bold** and *italic* text\n- Lists and tables\n- Code blocks\n- And more!\n\n```javascript\nconst hello = "world";\n```');

  useToolAction(setMarkdown);

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Editor pane */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border-secondary)',
          padding: 'var(--spacing-lg)',
          minWidth: 0,
        }}
      >
        <label
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--spacing-sm)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Markdown Input
        </label>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CodeEditor
            value={markdown}
            onChange={setMarkdown}
            language="markdown"
            placeholder="Enter markdown here..."
            minHeight="100%"
            maxHeight="100%"
          />
        </div>
      </div>

      {/* Preview pane */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 'var(--spacing-lg)',
          minWidth: 0,
        }}
      >
        <label
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--spacing-sm)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Preview
        </label>
        <div
          className="markdown-preview"
          style={{
            flex: 1,
            overflowY: 'auto',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-lg)',
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdown}
          </ReactMarkdown>
        </div>
      </div>

      <style>
        {`
          .markdown-preview {
            color: var(--text-primary);
            line-height: 1.6;
          }

          .markdown-preview h1 {
            font-size: 2em;
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 0.5em;
            border-bottom: 1px solid var(--border-secondary);
            padding-bottom: 0.3em;
          }

          .markdown-preview h2 {
            font-size: 1.5em;
            font-weight: 600;
            margin-top: 1em;
            margin-bottom: 0.5em;
            border-bottom: 1px solid var(--border-secondary);
            padding-bottom: 0.3em;
          }

          .markdown-preview h3 {
            font-size: 1.25em;
            font-weight: 600;
            margin-top: 1em;
            margin-bottom: 0.5em;
          }

          .markdown-preview h4,
          .markdown-preview h5,
          .markdown-preview h6 {
            font-size: 1em;
            font-weight: 600;
            margin-top: 1em;
            margin-bottom: 0.5em;
          }

          .markdown-preview p {
            margin-top: 0;
            margin-bottom: 1em;
          }

          .markdown-preview ul,
          .markdown-preview ol {
            margin-top: 0;
            margin-bottom: 1em;
            padding-left: 2em;
          }

          .markdown-preview li {
            margin-bottom: 0.25em;
          }

          .markdown-preview pre {
            background-color: var(--bg-tertiary);
            border: 1px solid var(--border-primary);
            border-radius: var(--radius-md);
            padding: 1em;
            overflow-x: auto;
            margin-bottom: 1em;
          }

          .markdown-preview code {
            font-family: var(--font-mono);
            font-size: 0.9em;
            background-color: var(--bg-tertiary);
            padding: 0.2em 0.4em;
            border-radius: var(--radius-sm);
          }

          .markdown-preview pre code {
            background-color: transparent;
            padding: 0;
          }

          .markdown-preview blockquote {
            border-left: 4px solid var(--border-primary);
            padding-left: 1em;
            margin-left: 0;
            margin-right: 0;
            color: var(--text-secondary);
            font-style: italic;
          }

          .markdown-preview table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 1em;
          }

          .markdown-preview th,
          .markdown-preview td {
            border: 1px solid var(--border-primary);
            padding: 0.5em;
            text-align: left;
          }

          .markdown-preview th {
            background-color: var(--bg-tertiary);
            font-weight: 600;
          }

          .markdown-preview a {
            color: var(--accent);
            text-decoration: none;
          }

          .markdown-preview a:hover {
            text-decoration: underline;
          }

          .markdown-preview img {
            max-width: 100%;
            height: auto;
          }

          .markdown-preview hr {
            border: none;
            border-top: 1px solid var(--border-secondary);
            margin: 1.5em 0;
          }

          .markdown-preview strong {
            font-weight: 600;
          }

          .markdown-preview em {
            font-style: italic;
          }

          .markdown-preview del {
            text-decoration: line-through;
          }
        `}
      </style>
    </div>
  );
};
