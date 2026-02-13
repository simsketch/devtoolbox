import React, { useState, useEffect } from 'react';
import { numberBaseConvert } from '@/lib/tauri';
import { CopyButton } from '@/components/common/CopyButton';
import { useToolAction } from '@/hooks/useToolAction';

type BaseType = 'binary' | 'octal' | 'decimal' | 'hex';

interface BaseInfo {
  name: string;
  base: number;
  prefix: string;
  placeholder: string;
  color: string;
}

const baseConfig: Record<BaseType, BaseInfo> = {
  binary: {
    name: 'Binary',
    base: 2,
    prefix: '0b',
    placeholder: '1010',
    color: '#3b82f6',
  },
  octal: {
    name: 'Octal',
    base: 8,
    prefix: '0o',
    placeholder: '12',
    color: '#10b981',
  },
  decimal: {
    name: 'Decimal',
    base: 10,
    prefix: '',
    placeholder: '10',
    color: '#f59e0b',
  },
  hex: {
    name: 'Hexadecimal',
    base: 16,
    prefix: '0x',
    placeholder: 'A',
    color: '#8b5cf6',
  },
};

export const NumberBaseComponent: React.FC = () => {
  const [inputBase, setInputBase] = useState<BaseType>('decimal');
  const [inputValue, setInputValue] = useState('');
  const [outputs, setOutputs] = useState<Record<BaseType, string>>({
    binary: '',
    octal: '',
    decimal: '',
    hex: '',
  });
  const [error, setError] = useState('');

  useToolAction(setInputValue);

  useEffect(() => {
    convertNumber();
  }, [inputValue, inputBase]);

  const convertNumber = async () => {
    if (!inputValue.trim()) {
      setOutputs({
        binary: '',
        octal: '',
        decimal: '',
        hex: '',
      });
      setError('');
      return;
    }

    // Remove prefix if present
    let cleanInput = inputValue.trim();
    const currentBase = baseConfig[inputBase];
    if (cleanInput.startsWith(currentBase.prefix)) {
      cleanInput = cleanInput.slice(currentBase.prefix.length);
    }

    setError('');

    try {
      const bases: BaseType[] = ['binary', 'octal', 'decimal', 'hex'];
      const conversions = await Promise.all(
        bases.map(async (targetBase) => {
          if (targetBase === inputBase) {
            return cleanInput;
          }
          const result = await numberBaseConvert(
            cleanInput,
            baseConfig[inputBase].base,
            baseConfig[targetBase].base
          );
          return result;
        })
      );

      const newOutputs: Record<BaseType, string> = {} as any;
      bases.forEach((base, index) => {
        newOutputs[base] = conversions[index];
      });

      setOutputs(newOutputs);
    } catch (err: any) {
      setError(err?.message || 'Invalid number for selected base');
      setOutputs({
        binary: '',
        octal: '',
        decimal: '',
        hex: '',
      });
    }
  };

  const handleBaseClick = (base: BaseType) => {
    if (outputs[base]) {
      setInputBase(base);
      setInputValue(outputs[base]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto' }}>
      {/* Input Section */}
      <div
        style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--border-secondary)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-md)',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--spacing-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Input Number
            </label>
            <input
              className="input-macos"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Enter ${baseConfig[inputBase].name.toLowerCase()} number...`}
              style={{
                width: '100%',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--spacing-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              From Base
            </label>
            <select
              className="select-macos"
              value={inputBase}
              onChange={(e) => setInputBase(e.target.value as BaseType)}
              style={{ minWidth: '140px' }}
            >
              <option value="binary">Binary (2)</option>
              <option value="octal">Octal (8)</option>
              <option value="decimal">Decimal (10)</option>
              <option value="hex">Hexadecimal (16)</option>
            </select>
          </div>
        </div>

        {error && (
          <div
            style={{
              marginTop: 'var(--spacing-sm)',
              color: '#ef4444',
              fontSize: '13px',
              fontWeight: '500',
            }}
          >
            Error: {error}
          </div>
        )}

        <div
          style={{
            marginTop: 'var(--spacing-sm)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}
        >
          {inputBase === 'binary' && 'Binary: Only 0 and 1'}
          {inputBase === 'octal' && 'Octal: 0-7'}
          {inputBase === 'decimal' && 'Decimal: 0-9'}
          {inputBase === 'hex' && 'Hexadecimal: 0-9, A-F'}
        </div>
      </div>

      {/* Output Section */}
      <div style={{ padding: 'var(--spacing-lg)', flex: 1 }}>
        {!inputValue && (
          <div
            style={{
              textAlign: 'center',
              color: 'var(--text-secondary)',
              padding: 'var(--spacing-xl)',
            }}
          >
            Enter a number above to convert between bases
          </div>
        )}

        {inputValue && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--spacing-lg)',
            }}
          >
            {(Object.keys(baseConfig) as BaseType[]).map((base) => {
              const config = baseConfig[base];
              const isInput = base === inputBase;

              return (
                <div
                  key={base}
                  className="card-macos"
                  style={{
                    padding: 'var(--spacing-md)',
                    backgroundColor: isInput ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-lg)',
                    border: `2px solid ${isInput ? config.color : 'var(--border-primary)'}`,
                    cursor: outputs[base] && !isInput ? 'pointer' : 'default',
                    transition: 'all var(--transition-fast)',
                  }}
                  onClick={() => !isInput && handleBaseClick(base)}
                  onMouseEnter={(e) => {
                    if (outputs[base] && !isInput) {
                      e.currentTarget.style.borderColor = config.color;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isInput) {
                      e.currentTarget.style.borderColor = 'var(--border-primary)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 'var(--spacing-sm)',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: config.color,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {config.name}
                      {isInput && ' (Input)'}
                    </h3>
                    {outputs[base] && !isInput && <CopyButton text={outputs[base]} />}
                  </div>

                  <div
                    style={{
                      padding: 'var(--spacing-sm)',
                      backgroundColor: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-primary)',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '16px',
                        color: outputs[base] ? 'var(--text-primary)' : 'var(--text-secondary)',
                        wordBreak: 'break-all',
                        minHeight: '24px',
                      }}
                    >
                      {outputs[base] || (isInput ? inputValue : '—')}
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 'var(--spacing-sm)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      Base {config.base}
                      {config.prefix && ` • Prefix: ${config.prefix}`}
                    </span>
                    {outputs[base] && !isInput && (
                      <span
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        Click to use as input
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
