import React, { useState, useEffect } from 'react';
import { useToolAction } from '@/hooks/useToolAction';

interface CronPart {
  min: string;
  hour: string;
  dom: string;
  month: string;
  dow: string;
}

const parseField = (field: string, min: number, max: number): number[] => {
  const values: number[] = [];

  if (field === '*') {
    for (let i = min; i <= max; i++) {
      values.push(i);
    }
    return values;
  }

  const parts = field.split(',');
  for (const part of parts) {
    if (part.includes('/')) {
      const [range, step] = part.split('/');
      const stepNum = parseInt(step);
      const rangeVals = range === '*' ? [min, max] : range.split('-').map(v => parseInt(v));
      const start = rangeVals[0];
      const end = rangeVals.length > 1 ? rangeVals[1] : max;

      for (let i = start; i <= end; i += stepNum) {
        values.push(i);
      }
    } else if (part.includes('-')) {
      const [start, end] = part.split('-').map(v => parseInt(v));
      for (let i = start; i <= end; i++) {
        values.push(i);
      }
    } else {
      values.push(parseInt(part));
    }
  }

  return [...new Set(values)].sort((a, b) => a - b);
};

const describeCronField = (field: string, type: 'min' | 'hour' | 'dom' | 'month' | 'dow'): string => {
  if (field === '*') {
    return type === 'min' ? 'every minute' :
           type === 'hour' ? 'every hour' :
           type === 'dom' ? 'every day' :
           type === 'month' ? 'every month' :
           'every day of week';
  }

  if (field.includes('/')) {
    const [range, step] = field.split('/');
    if (range === '*') {
      return type === 'min' ? `every ${step} minutes` :
             type === 'hour' ? `every ${step} hours` :
             type === 'dom' ? `every ${step} days` :
             type === 'month' ? `every ${step} months` :
             `every ${step} days of week`;
    }
  }

  if (field.includes('-')) {
    const [start, end] = field.split('-');
    return `from ${start} to ${end}`;
  }

  if (field.includes(',')) {
    return `at ${field.replace(/,/g, ', ')}`;
  }

  return `at ${field}`;
};

const getNextRun = (cron: CronPart, from: Date): Date | null => {
  try {
    const mins = parseField(cron.min, 0, 59);
    const hours = parseField(cron.hour, 0, 23);
    const doms = parseField(cron.dom, 1, 31);
    const months = parseField(cron.month, 1, 12);
    const dows = parseField(cron.dow, 0, 6);

    let current = new Date(from);
    current.setSeconds(0, 0);

    // Try for up to 4 years
    const maxIterations = 525600 * 4; // minutes in 4 years
    let iterations = 0;

    while (iterations < maxIterations) {
      if (months.includes(current.getMonth() + 1) &&
          doms.includes(current.getDate()) &&
          (cron.dow === '*' || dows.includes(current.getDay())) &&
          hours.includes(current.getHours()) &&
          mins.includes(current.getMinutes())) {
        return current;
      }

      current = new Date(current.getTime() + 60000); // Add 1 minute
      iterations++;
    }

    return null;
  } catch (err) {
    return null;
  }
};

export const CronParserComponent: React.FC = () => {
  const [input, setInput] = useState('*/5 * * * *');
  const [description, setDescription] = useState('');
  const [nextRuns, setNextRuns] = useState<string[]>([]);
  useToolAction(setInput);
  const [error, setError] = useState('');

  useEffect(() => {
    parseCron();
  }, [input]);

  const parseCron = () => {
    if (!input.trim()) {
      setDescription('');
      setNextRuns([]);
      setError('');
      return;
    }

    try {
      const parts = input.trim().split(/\s+/);

      if (parts.length !== 5) {
        throw new Error('Cron expression must have exactly 5 fields (minute hour day month day-of-week)');
      }

      const [min, hour, dom, month, dow] = parts;
      const cron: CronPart = { min, hour, dom, month, dow };

      // Validate fields
      parseField(min, 0, 59);
      parseField(hour, 0, 23);
      parseField(dom, 1, 31);
      parseField(month, 1, 12);
      parseField(dow, 0, 6);

      // Generate description
      const minDesc = describeCronField(min, 'min');
      const hourDesc = describeCronField(hour, 'hour');
      const domDesc = describeCronField(dom, 'dom');
      const monthDesc = describeCronField(month, 'month');
      const dowDesc = describeCronField(dow, 'dow');

      let desc = 'Runs ';

      if (min === '*' && hour === '*' && dom === '*' && month === '*' && dow === '*') {
        desc = 'Runs every minute';
      } else if (min.includes('/') && hour === '*' && dom === '*' && month === '*' && dow === '*') {
        desc = `Runs ${minDesc}`;
      } else if (hour.includes('/') && dom === '*' && month === '*' && dow === '*') {
        desc = `Runs ${hourDesc} ${minDesc}`;
      } else {
        desc = `Runs ${minDesc}`;
        if (hour !== '*') desc += `, ${hourDesc}`;
        if (dom !== '*') desc += `, ${domDesc}`;
        if (month !== '*') desc += `, ${monthDesc}`;
        if (dow !== '*') desc += `, ${dowDesc}`;
      }

      setDescription(desc);

      // Calculate next 5 run times
      const runs: string[] = [];
      let current = new Date();
      current.setSeconds(0, 0);
      current = new Date(current.getTime() + 60000); // Start from next minute

      for (let i = 0; i < 5; i++) {
        const next = getNextRun(cron, current);
        if (!next) break;

        runs.push(next.toLocaleString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }));

        current = new Date(next.getTime() + 60000);
      }

      setNextRuns(runs);
      setError('');
    } catch (err: any) {
      setError(err?.message || 'Invalid cron expression');
      setDescription('');
      setNextRuns([]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'var(--spacing-lg)' }}>
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
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
          Cron Expression (min hour day month day-of-week)
        </label>
        <input
          type="text"
          className="input-macos"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="*/5 * * * *"
          style={{
            width: '100%',
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
          }}
        />
        <div style={{ marginTop: 'var(--spacing-xs)', fontSize: '12px', color: 'var(--text-tertiary)' }}>
          Examples: "*/5 * * * *" (every 5 min), "0 9 * * 1-5" (9am on weekdays), "30 2 * * *" (2:30am daily)
        </div>
      </div>

      {error && (
        <div
          className="card-macos"
          style={{
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-lg)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: '#ef4444',
          }}
        >
          <div style={{ color: '#ef4444', fontWeight: '500', fontSize: '13px' }}>
            Error: {error}
          </div>
        </div>
      )}

      {description && (
        <div
          className="card-macos"
          style={{
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-lg)',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
            DESCRIPTION
          </div>
          <div style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '500' }}>
            {description}
          </div>
        </div>
      )}

      {nextRuns.length > 0 && (
        <div className="card-macos" style={{ padding: 'var(--spacing-md)' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
            NEXT 5 EXECUTIONS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            {nextRuns.map((run, idx) => (
              <div
                key={idx}
                style={{
                  padding: 'var(--spacing-sm)',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                }}
              >
                {idx + 1}. {run}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
