import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

const palette = {
  bg: 'rgba(0, 0, 0, 0.25)',
  gutter: 'rgba(0, 0, 0, 0.15)',
  gutterText: '#5c5e7a',
  text: '#d0d4f0',
  selection: 'rgba(108, 180, 255, 0.15)',
  cursor: '#d0d4f0',
  activeLine: 'rgba(108, 180, 255, 0.04)',
  matchingBracket: 'rgba(108, 180, 255, 0.2)',

  string: '#8ee8a0',
  keyword: '#c4a0f5',
  number: '#f0b080',
  comment: '#5c5e7a',
  function: '#80b8f8',
  type: '#f0d880',
  variable: '#d0d4f0',
  operator: '#80d8e8',
  property: '#80b8f8',
  tag: '#f08898',
  attribute: '#f0b080',
  bool: '#f0b080',
};

export const devutilsTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: palette.bg,
      color: palette.text,
    },
    '.cm-content': {
      caretColor: palette.cursor,
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: palette.cursor,
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: palette.selection,
    },
    '.cm-activeLine': {
      backgroundColor: palette.activeLine,
    },
    '.cm-gutters': {
      backgroundColor: palette.gutter,
      color: palette.gutterText,
      border: 'none',
    },
    '.cm-activeLineGutter': {
      backgroundColor: palette.activeLine,
    },
    '&.cm-focused .cm-matchingBracket': {
      backgroundColor: palette.matchingBracket,
    },
  },
  { dark: true }
);

export const devutilsHighlighting = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.keyword, color: palette.keyword },
    { tag: tags.operator, color: palette.operator },
    { tag: tags.special(tags.variableName), color: palette.variable },
    { tag: tags.typeName, color: palette.type },
    { tag: tags.atom, color: palette.bool },
    { tag: tags.bool, color: palette.bool },
    { tag: tags.number, color: palette.number },
    { tag: tags.string, color: palette.string },
    { tag: tags.special(tags.string), color: palette.string },
    { tag: tags.comment, color: palette.comment, fontStyle: 'italic' },
    { tag: tags.variableName, color: palette.variable },
    { tag: tags.function(tags.variableName), color: palette.function },
    { tag: tags.definition(tags.variableName), color: palette.function },
    { tag: tags.propertyName, color: palette.property },
    { tag: tags.function(tags.propertyName), color: palette.function },
    { tag: tags.definition(tags.propertyName), color: palette.function },
    { tag: tags.tagName, color: palette.tag },
    { tag: tags.attributeName, color: palette.attribute },
    { tag: tags.className, color: palette.type },
    { tag: tags.labelName, color: palette.type },
    { tag: tags.namespace, color: palette.type },
    { tag: tags.macroName, color: palette.function },
    { tag: tags.literal, color: palette.number },
    { tag: tags.separator, color: palette.text },
    { tag: tags.punctuation, color: palette.text },
    { tag: tags.bracket, color: palette.text },
  ])
);

export const devutilsExtensions = [devutilsTheme, devutilsHighlighting];
