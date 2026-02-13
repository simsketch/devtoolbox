import React, { useState, useEffect } from 'react';
import { timestampToDate, dateToTimestamp, nowTimestamp } from '@/lib/tauri';
import { CopyButton } from '@/components/common/CopyButton';
import { useToolAction } from '@/hooks/useToolAction';
import { Clock } from 'lucide-react';

export const TimestampConverterComponent: React.FC = () => {
  const [timestamp, setTimestamp] = useState('');
  const [timestampMs, setTimestampMs] = useState('');
  const [dateOutput, setDateOutput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [dateTimestamp, setDateTimestamp] = useState('');
  const [format, setFormat] = useState('');
  const [error, setError] = useState('');

  useToolAction(setTimestamp);

  useEffect(() => {
    convertTimestampToDate();
  }, [timestamp, format]);

  useEffect(() => {
    convertDateToTimestamp();
  }, [dateInput, format]);

  const convertTimestampToDate = async () => {
    if (!timestamp.trim()) {
      setDateOutput('');
      setTimestampMs('');
      return;
    }

    try {
      const ts = parseInt(timestamp);
      if (isNaN(ts)) {
        setDateOutput('Invalid timestamp');
        setTimestampMs('');
        return;
      }

      // Detect if it's seconds or milliseconds
      const timestampValue = ts.toString().length <= 10 ? ts : Math.floor(ts / 1000);
      const timestampMsValue = ts.toString().length <= 10 ? ts * 1000 : ts;

      setTimestampMs(timestampMsValue.toString());

      const result = await timestampToDate(timestampValue, format);
      setDateOutput(result);
      setError('');
    } catch (err: any) {
      setError(err?.message || 'Failed to convert timestamp');
      setDateOutput('');
    }
  };

  const convertDateToTimestamp = async () => {
    if (!dateInput.trim()) {
      setDateTimestamp('');
      return;
    }

    try {
      const result = await dateToTimestamp(dateInput, format);
      setDateTimestamp(result.toString());
      setError('');
    } catch (err: any) {
      setError(err?.message || 'Failed to convert date');
      setDateTimestamp('');
    }
  };

  const handleNow = async () => {
    try {
      const now = await nowTimestamp();
      setTimestamp(now.toString());
    } catch (err: any) {
      setError(err?.message || 'Failed to get current timestamp');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto' }}>
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
        <button
          className="btn-macos"
          onClick={handleNow}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            padding: '8px 16px',
          }}
        >
          <Clock size={16} />
          Now
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <label
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              fontWeight: '500',
            }}
          >
            Format:
          </label>
          <select
            className="select-macos"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            style={{ fontSize: '13px' }}
          >
            <option value="">ISO 8601</option>
            <option value="%Y-%m-%d %H:%M:%S">YYYY-MM-DD HH:MM:SS</option>
            <option value="%Y-%m-%d">YYYY-MM-DD</option>
            <option value="%d/%m/%Y">DD/MM/YYYY</option>
            <option value="%m/%d/%Y">MM/DD/YYYY</option>
            <option value="%B %d, %Y">Month DD, YYYY</option>
          </select>
        </div>

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

      {/* Converters */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--spacing-lg)',
          padding: 'var(--spacing-lg)',
        }}
      >
        {/* Timestamp to Date */}
        <div
          className="card-macos"
          style={{
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-md)',
            }}
          >
            Timestamp to Date
          </h3>

          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--spacing-xs)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Timestamp (seconds or milliseconds)
            </label>
            <input
              className="input-macos"
              type="text"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="1234567890"
              style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
            />
          </div>

          {dateOutput && (
            <>
              <div
                style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--spacing-sm)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--spacing-xs)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                    }}
                  >
                    Date
                  </span>
                  <CopyButton text={dateOutput} />
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                  }}
                >
                  {dateOutput}
                </div>
              </div>

              <div
                style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--spacing-sm)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--spacing-xs)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                    }}
                  >
                    Seconds
                  </span>
                  <CopyButton text={timestamp} />
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                  }}
                >
                  {timestamp}
                </div>
              </div>

              {timestampMs && (
                <div
                  style={{
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                      }}
                    >
                      Milliseconds
                    </span>
                    <CopyButton text={timestampMs} />
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {timestampMs}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Date to Timestamp */}
        <div
          className="card-macos"
          style={{
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-md)',
            }}
          >
            Date to Timestamp
          </h3>

          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--spacing-xs)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Date String
            </label>
            <input
              className="input-macos"
              type="text"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              placeholder="2024-01-01 12:00:00"
              style={{ width: '100%' }}
            />
            <div
              style={{
                marginTop: 'var(--spacing-xs)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
              }}
            >
              Enter date in selected format above
            </div>
          </div>

          {dateTimestamp && (
            <>
              <div
                style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--spacing-sm)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--spacing-xs)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                    }}
                  >
                    Seconds
                  </span>
                  <CopyButton text={dateTimestamp} />
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                  }}
                >
                  {dateTimestamp}
                </div>
              </div>

              <div
                style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--spacing-xs)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                    }}
                  >
                    Milliseconds
                  </span>
                  <CopyButton text={(parseInt(dateTimestamp) * 1000).toString()} />
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                  }}
                >
                  {parseInt(dateTimestamp) * 1000}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
