import React, { useState, useEffect } from 'react';
import { InputOutput } from '@/components/common/InputOutput';
import { ArrowRight } from 'lucide-react';

import { useToolAction } from '@/hooks/useToolAction';
const inferType = (value: any): string => {
  if (value === null) return 'null';
  if (Array.isArray(value)) {
    if (value.length === 0) return 'any[]';
    const itemTypes = [...new Set(value.map(inferType))];
    if (itemTypes.length === 1) {
      return `${itemTypes[0]}[]`;
    }
    return `(${itemTypes.join(' | ')})[]`;
  }
  if (typeof value === 'object') return 'object';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  return 'any';
};

const generateInterface = (
  obj: any,
  interfaceName: string,
  indent: number = 0,
  useExport: boolean = true,
  makeOptional: boolean = false
): string => {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return '';
  }

  const indentStr = '  '.repeat(indent);
  const prefix = useExport && indent === 0 ? 'export ' : '';
  let result = `${indentStr}${prefix}interface ${interfaceName} {\n`;

  const entries = Object.entries(obj);
  entries.forEach(([key, value]) => {
    const optional = makeOptional ? '?' : '';
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;

    if (value === null) {
      result += `${indentStr}  ${safeKey}${optional}: null;\n`;
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        result += `${indentStr}  ${safeKey}${optional}: any[];\n`;
      } else if (typeof value[0] === 'object' && !Array.isArray(value[0]) && value[0] !== null) {
        const itemInterfaceName = `${interfaceName}${capitalizeFirst(key)}Item`;
        result += `${indentStr}  ${safeKey}${optional}: ${itemInterfaceName}[];\n`;
      } else {
        const itemType = inferType(value[0]);
        result += `${indentStr}  ${safeKey}${optional}: ${itemType}[];\n`;
      }
    } else if (typeof value === 'object') {
      const nestedInterfaceName = `${interfaceName}${capitalizeFirst(key)}`;
      result += `${indentStr}  ${safeKey}${optional}: ${nestedInterfaceName};\n`;
    } else {
      const type = inferType(value);
      result += `${indentStr}  ${safeKey}${optional}: ${type};\n`;
    }
  });

  result += `${indentStr}}\n`;

  // Generate nested interfaces
  entries.forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && !Array.isArray(value[0]) && value[0] !== null) {
      const itemInterfaceName = `${interfaceName}${capitalizeFirst(key)}Item`;
      result += '\n' + generateInterface(value[0], itemInterfaceName, indent, false, makeOptional);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const nestedInterfaceName = `${interfaceName}${capitalizeFirst(key)}`;
      result += '\n' + generateInterface(value, nestedInterfaceName, indent, false, makeOptional);
    }
  });

  return result;
};

const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const JsonToTypescriptComponent: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [interfaceName, setInterfaceName] = useState('RootObject');
  const [useExport, setUseExport] = useState(true);
  const [makeOptional, setMakeOptional] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    generateTypescript();
  }, [input, interfaceName, useExport, makeOptional]);

  const generateTypescript = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      const parsed = JSON.parse(input);

      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Input must be a JSON object');
      }

      if (Array.isArray(parsed)) {
        if (parsed.length === 0) {
          throw new Error('Cannot generate interface from empty array');
        }
        const result = generateInterface(parsed[0], interfaceName, 0, useExport, makeOptional);
        setOutput(result);
      } else {
        const result = generateInterface(parsed, interfaceName, 0, useExport, makeOptional);
        setOutput(result);
      }

      setError('');
    } catch (err: any) {
      setError(err?.message || 'Failed to parse JSON');
      setOutput('');
    }
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
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
            Interface Name:
          </label>
          <input
            type="text"
            className="input-macos"
            value={interfaceName}
            onChange={(e) => setInterfaceName(e.target.value || 'RootObject')}
            style={{ width: '150px', fontSize: '13px', padding: '4px 8px' }}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={useExport}
            onChange={(e) => setUseExport(e.target.checked)}
            style={{ width: '16px', height: '16px' }}
          />
          <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
            Export interface
          </span>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={makeOptional}
            onChange={(e) => setMakeOptional(e.target.checked)}
            style={{ width: '16px', height: '16px' }}
          />
          <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
            Optional fields
          </span>
        </label>

        {error && (
          <div
            style={{
              marginLeft: 'auto',
              color: '#ef4444',
              fontSize: '13px',
              fontWeight: '500',
            }}
          >
            Error: {error}
          </div>
        )}
      </div>

      {/* Input/Output area */}
      <InputOutput
        input={input}
        onInputChange={setInput}
        output={output}
        inputLabel="JSON Input"
        outputLabel="TypeScript Interface"
        inputLanguage="json"
        outputLanguage="javascript"
        inputPlaceholder='{"name": "John", "age": 30}'
        actions={
          <ArrowRight
            size={20}
            style={{
              color: 'var(--text-secondary)',
            }}
          />
        }
      />
    </div>
  );
};
