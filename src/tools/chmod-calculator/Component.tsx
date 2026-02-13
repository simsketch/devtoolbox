import React, { useState, useEffect } from 'react';

interface Permissions {
  owner: { read: boolean; write: boolean; execute: boolean };
  group: { read: boolean; write: boolean; execute: boolean };
  others: { read: boolean; write: boolean; execute: boolean };
}

const permissionsToNumeric = (perms: Permissions): string => {
  const ownerNum = (perms.owner.read ? 4 : 0) + (perms.owner.write ? 2 : 0) + (perms.owner.execute ? 1 : 0);
  const groupNum = (perms.group.read ? 4 : 0) + (perms.group.write ? 2 : 0) + (perms.group.execute ? 1 : 0);
  const othersNum = (perms.others.read ? 4 : 0) + (perms.others.write ? 2 : 0) + (perms.others.execute ? 1 : 0);
  return `${ownerNum}${groupNum}${othersNum}`;
};

const permissionsToSymbolic = (perms: Permissions): string => {
  const ownerStr = `${perms.owner.read ? 'r' : '-'}${perms.owner.write ? 'w' : '-'}${perms.owner.execute ? 'x' : '-'}`;
  const groupStr = `${perms.group.read ? 'r' : '-'}${perms.group.write ? 'w' : '-'}${perms.group.execute ? 'x' : '-'}`;
  const othersStr = `${perms.others.read ? 'r' : '-'}${perms.others.write ? 'w' : '-'}${perms.others.execute ? 'x' : '-'}`;
  return `${ownerStr}${groupStr}${othersStr}`;
};

const numericToPermissions = (numeric: string): Permissions | null => {
  if (!/^[0-7]{3}$/.test(numeric)) return null;

  const [owner, group, others] = numeric.split('').map(d => parseInt(d));

  return {
    owner: {
      read: !!(owner & 4),
      write: !!(owner & 2),
      execute: !!(owner & 1),
    },
    group: {
      read: !!(group & 4),
      write: !!(group & 2),
      execute: !!(group & 1),
    },
    others: {
      read: !!(others & 4),
      write: !!(others & 2),
      execute: !!(others & 1),
    },
  };
};

const symbolicToPermissions = (symbolic: string): Permissions | null => {
  if (!/^[rwx-]{9}$/.test(symbolic)) return null;

  return {
    owner: {
      read: symbolic[0] === 'r',
      write: symbolic[1] === 'w',
      execute: symbolic[2] === 'x',
    },
    group: {
      read: symbolic[3] === 'r',
      write: symbolic[4] === 'w',
      execute: symbolic[5] === 'x',
    },
    others: {
      read: symbolic[6] === 'r',
      write: symbolic[7] === 'w',
      execute: symbolic[8] === 'x',
    },
  };
};

export const ChmodCalculatorComponent: React.FC = () => {
  const [permissions, setPermissions] = useState<Permissions>({
    owner: { read: true, write: true, execute: true },
    group: { read: true, write: false, execute: true },
    others: { read: true, write: false, execute: true },
  });

  const [numericInput, setNumericInput] = useState('755');
  const [symbolicInput, setSymbolicInput] = useState('rwxr-xr-x');

  useEffect(() => {
    setNumericInput(permissionsToNumeric(permissions));
    setSymbolicInput(permissionsToSymbolic(permissions));
  }, [permissions]);

  const handleCheckboxChange = (category: 'owner' | 'group' | 'others', type: 'read' | 'write' | 'execute') => {
    setPermissions(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type],
      },
    }));
  };

  const handleNumericInputChange = (value: string) => {
    setNumericInput(value);
    const perms = numericToPermissions(value);
    if (perms) {
      setPermissions(perms);
    }
  };

  const handleSymbolicInputChange = (value: string) => {
    setSymbolicInput(value);
    const perms = symbolicToPermissions(value);
    if (perms) {
      setPermissions(perms);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'var(--spacing-lg)', gap: 'var(--spacing-lg)' }}>
      {/* Permission Checkboxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-lg)' }}>
        <PermissionColumn
          title="Owner"
          permissions={permissions.owner}
          onChange={(type) => handleCheckboxChange('owner', type)}
        />
        <PermissionColumn
          title="Group"
          permissions={permissions.group}
          onChange={(type) => handleCheckboxChange('group', type)}
        />
        <PermissionColumn
          title="Others"
          permissions={permissions.others}
          onChange={(type) => handleCheckboxChange('others', type)}
        />
      </div>

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
        {/* Numeric */}
        <div className="card-macos" style={{ padding: 'var(--spacing-md)' }}>
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
            Numeric (Octal)
          </label>
          <input
            type="text"
            className="input-macos"
            value={numericInput}
            onChange={(e) => handleNumericInputChange(e.target.value)}
            placeholder="755"
            style={{
              width: '100%',
              fontFamily: 'var(--font-mono)',
              fontSize: '24px',
              fontWeight: '600',
              textAlign: 'center',
              padding: 'var(--spacing-md)',
            }}
            maxLength={3}
          />
          <div style={{ marginTop: 'var(--spacing-xs)', fontSize: '12px', color: 'var(--text-tertiary)', textAlign: 'center' }}>
            Example: 755, 644, 777
          </div>
        </div>

        {/* Symbolic */}
        <div className="card-macos" style={{ padding: 'var(--spacing-md)' }}>
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
            Symbolic
          </label>
          <input
            type="text"
            className="input-macos"
            value={symbolicInput}
            onChange={(e) => handleSymbolicInputChange(e.target.value)}
            placeholder="rwxr-xr-x"
            style={{
              width: '100%',
              fontFamily: 'var(--font-mono)',
              fontSize: '18px',
              fontWeight: '600',
              textAlign: 'center',
              padding: 'var(--spacing-md)',
            }}
            maxLength={9}
          />
          <div style={{ marginTop: 'var(--spacing-xs)', fontSize: '12px', color: 'var(--text-tertiary)', textAlign: 'center' }}>
            Example: rwxr-xr-x, rw-r--r--
          </div>
        </div>

        {/* Command */}
        <div className="card-macos" style={{ padding: 'var(--spacing-md)' }}>
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
            Command
          </label>
          <div
            style={{
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              textAlign: 'center',
            }}
          >
            chmod {numericInput} filename
          </div>
          <div style={{ marginTop: 'var(--spacing-xs)', fontSize: '12px', color: 'var(--text-tertiary)', textAlign: 'center' }}>
            Unix/Linux command
          </div>
        </div>
      </div>

      {/* Common Permissions Guide */}
      <div className="card-macos" style={{ padding: 'var(--spacing-md)' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
          COMMON PERMISSIONS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-sm)' }}>
          <CommonPerm code="755" desc="rwxr-xr-x" note="Directories, executables" />
          <CommonPerm code="644" desc="rw-r--r--" note="Regular files" />
          <CommonPerm code="777" desc="rwxrwxrwx" note="Full access (dangerous)" />
          <CommonPerm code="700" desc="rwx------" note="Private files" />
          <CommonPerm code="600" desc="rw-------" note="Private data files" />
          <CommonPerm code="666" desc="rw-rw-rw-" note="World-writable files" />
        </div>
      </div>
    </div>
  );
};

const PermissionColumn: React.FC<{
  title: string;
  permissions: { read: boolean; write: boolean; execute: boolean };
  onChange: (type: 'read' | 'write' | 'execute') => void;
}> = ({ title, permissions, onChange }) => (
  <div className="card-macos" style={{ padding: 'var(--spacing-md)' }}>
    <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)', textAlign: 'center' }}>
      {title}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
      <CheckboxRow label="Read (4)" checked={permissions.read} onChange={() => onChange('read')} />
      <CheckboxRow label="Write (2)" checked={permissions.write} onChange={() => onChange('write')} />
      <CheckboxRow label="Execute (1)" checked={permissions.execute} onChange={() => onChange('execute')} />
    </div>
  </div>
);

const CheckboxRow: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
  <label
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-sm)',
      cursor: 'pointer',
      padding: 'var(--spacing-xs)',
      borderRadius: 'var(--radius-sm)',
      backgroundColor: checked ? 'var(--bg-secondary)' : 'transparent',
    }}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
    />
    <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
      {label}
    </span>
  </label>
);

const CommonPerm: React.FC<{ code: string; desc: string; note: string }> = ({ code, desc, note }) => (
  <div
    style={{
      padding: 'var(--spacing-sm)',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-sm)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: '4px' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
        {code}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
        {desc}
      </span>
    </div>
    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
      {note}
    </div>
  </div>
);
