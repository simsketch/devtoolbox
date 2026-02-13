import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { usePipelineStore } from '@/stores/pipeline-store';
import { getToolById } from '@/tools/index';

interface PipelineNodeProps {
  id: string;
  data: {
    label: string;
    toolId?: string;
    config?: Record<string, any>;
  };
}

export const PipelineNode = memo(({ id, data }: PipelineNodeProps) => {
  const { removeNode, updateNode, executions } = usePipelineStore();
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);
  const execution = executions[id];

  const tool = data.toolId ? getToolById(data.toolId) : null;
  const IconComponent = tool?.icon ? (Icons as any)[tool.icon] : Icons.Box;

  const hasInputs = tool?.inputs && tool.inputs.length > 0;
  const hasOutputs = tool?.outputs && tool.outputs.length > 0;

  // Status border color
  let borderColor = 'var(--border-primary)';
  let bgGlow = 'none';

  if (execution?.status === 'running') {
    borderColor = '#007AFF';
    bgGlow = '0 0 8px rgba(0, 122, 255, 0.3)';
  } else if (execution?.status === 'success') {
    borderColor = '#34C759';
    bgGlow = '0 0 8px rgba(52, 199, 89, 0.2)';
  } else if (execution?.status === 'error') {
    borderColor = '#FF3B30';
    bgGlow = '0 0 8px rgba(255, 59, 48, 0.2)';
  }

  return (
    <div
      style={{
        minWidth: '200px',
        backgroundColor: 'var(--bg-secondary)',
        border: `2px solid ${borderColor}`,
        borderRadius: 'var(--radius-lg)',
        boxShadow: bgGlow !== 'none' ? bgGlow : '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Input Handles */}
      {hasInputs && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            width: '12px',
            height: '12px',
            backgroundColor: 'var(--accent)',
            border: '2px solid var(--bg-secondary)',
            left: '-7px',
          }}
        />
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
          padding: 'var(--spacing-md)',
          borderBottom: '1px solid var(--border-secondary)',
          backgroundColor: 'var(--bg-primary)',
          borderTopLeftRadius: 'var(--radius-md)',
          borderTopRightRadius: 'var(--radius-md)',
        }}
      >
        {IconComponent && (
          <IconComponent
            size={16}
            style={{ color: 'var(--accent)', flexShrink: 0 }}
          />
        )}
        <div
          style={{
            flex: 1,
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {data.label}
        </div>
        <button
          onClick={() => removeNode(id)}
          style={{
            border: 'none',
            background: 'none',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-tertiary)',
            transition: 'color 0.15s',
            borderRadius: '4px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#FF3B30';
            e.currentTarget.style.backgroundColor = 'rgba(255, 59, 48, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-tertiary)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Status Indicator */}
      {execution && (
        <div
          style={{
            padding: 'var(--spacing-sm) var(--spacing-md)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
          }}
        >
          {execution.status === 'running' && (
            <>
              <span style={{ color: '#007AFF' }}>⏳</span>
              <span>Running...</span>
            </>
          )}
          {execution.status === 'success' && (
            <>
              <span style={{ color: '#34C759' }}>✓</span>
              <span>Complete</span>
            </>
          )}
          {execution.status === 'error' && (
            <>
              <span style={{ color: '#FF3B30' }}>✗</span>
              <span>Error</span>
            </>
          )}
        </div>
      )}

      {/* Config Section */}
      {tool?.configFields && tool.configFields.length > 0 && (
        <>
          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: 'none',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              borderBottom: isConfigOpen ? '1px solid var(--border-secondary)' : 'none',
            }}
          >
            {isConfigOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            Configuration
          </button>

          {isConfigOpen && (
            <div
              style={{
                padding: 'var(--spacing-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-sm)',
              }}
            >
              {tool.configFields.map((field) => (
                <div key={field.id}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: '500',
                      color: 'var(--text-secondary)',
                      marginBottom: '4px',
                    }}
                  >
                    {field.label}
                  </label>
                  {field.type === 'text' && (
                    <input
                      type="text"
                      className="input-macos"
                      value={data.config?.[field.id] || field.default}
                      onChange={(e) => {
                        updateNode(id, {
                          data: {
                            ...data,
                            config: { ...data.config, [field.id]: e.target.value },
                          },
                        });
                      }}
                      style={{ fontSize: '11px', padding: '4px 8px' }}
                    />
                  )}
                  {field.type === 'select' && field.options && (
                    <select
                      className="select-macos"
                      value={data.config?.[field.id] || field.default}
                      onChange={(e) => {
                        updateNode(id, {
                          data: {
                            ...data,
                            config: { ...data.config, [field.id]: e.target.value },
                          },
                        });
                      }}
                      style={{ fontSize: '11px', padding: '4px 8px' }}
                    >
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Output error */}
      {execution?.error && (
        <div
          style={{
            padding: 'var(--spacing-sm) var(--spacing-md)',
            fontSize: '11px',
            color: '#FF3B30',
            backgroundColor: 'rgba(255, 59, 48, 0.05)',
            borderTop: '1px solid var(--border-secondary)',
            maxHeight: '60px',
            overflow: 'auto',
          }}
        >
          {execution.error}
        </div>
      )}

      {/* Output Handles */}
      {hasOutputs && (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            width: '12px',
            height: '12px',
            backgroundColor: 'var(--accent)',
            border: '2px solid var(--bg-secondary)',
            right: '-7px',
          }}
        />
      )}
    </div>
  );
});

PipelineNode.displayName = 'PipelineNode';
