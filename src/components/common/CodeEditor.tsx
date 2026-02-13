import React, { useEffect, useRef, useState } from 'react';
import { EditorView, lineNumbers, highlightActiveLine, highlightSpecialChars, drawSelection, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching } from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { devutilsExtensions } from '../../styles/codemirror-devutils';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { xml } from '@codemirror/lang-xml';
import { sql } from '@codemirror/lang-sql';
import { yaml } from '@codemirror/lang-yaml';
import { markdown } from '@codemirror/lang-markdown';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: 'json' | 'javascript' | 'html' | 'css' | 'xml' | 'sql' | 'yaml' | 'markdown' | 'text';
  readOnly?: boolean;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  className?: string;
}

const languageExtensions = {
  json: json(),
  javascript: javascript(),
  html: html(),
  css: css(),
  xml: xml(),
  sql: sql(),
  yaml: yaml(),
  markdown: markdown(),
  text: [],
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'text',
  readOnly = false,
  placeholder = '',
  minHeight = '200px',
  maxHeight = 'none',
  className = '',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    if (!editorRef.current) return;

    const languageExtension = languageExtensions[language] || [];

    const extensions = [
      lineNumbers(),
      highlightActiveLine(),
      highlightSpecialChars(),
      drawSelection(),
      history(),
      bracketMatching(),
      closeBrackets(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      keymap.of([...defaultKeymap, ...historyKeymap, ...closeBracketsKeymap]),
      ...(Array.isArray(languageExtension) ? languageExtension : [languageExtension]),
      EditorView.editable.of(!readOnly),
      EditorView.lineWrapping,
      EditorState.readOnly.of(readOnly),
      EditorView.updateListener.of((update) => {
        if (update.docChanged && onChange && !readOnly) {
          const newValue = update.state.doc.toString();
          onChange(newValue);
        }
      }),
      ...(isDark ? devutilsExtensions : []),
    ];

    if (placeholder) {
      extensions.push(
        EditorView.contentAttributes.of({
          'aria-placeholder': placeholder,
        })
      );
    }

    const state = EditorState.create({
      doc: value,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [language, readOnly, placeholder, isDark]);

  // Update editor content when value prop changes externally
  useEffect(() => {
    if (viewRef.current) {
      const currentValue = viewRef.current.state.doc.toString();
      if (currentValue !== value) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentValue.length,
            insert: value,
          },
        });
      }
    }
  }, [value]);

  // Watch for dark mode changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDarkMode = document.documentElement.classList.contains('dark');
          setIsDark(isDarkMode);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={editorRef}
      className={className}
      style={{
        minHeight,
        maxHeight,
        overflow: 'auto',
        fontFamily: 'var(--font-mono)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--glass-border, var(--border-primary))',
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.25)' : 'var(--bg-primary)',
        boxShadow: isDark ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.04)' : 'none',
      }}
    />
  );
};
