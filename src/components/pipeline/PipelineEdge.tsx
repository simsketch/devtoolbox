import React, { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, EdgeProps } from '@xyflow/react';
import { X } from 'lucide-react';
import { usePipelineStore } from '@/stores/pipeline-store';

export const PipelineEdge = memo((props: EdgeProps) => {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd } = props;
  const { removeEdge, isExecuting } = usePipelineStore();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: isExecuting ? '#007AFF' : 'var(--text-tertiary)',
          strokeWidth: isExecuting ? 2.5 : 2,
          strokeDasharray: isExecuting ? '5,5' : 'none',
          animation: isExecuting ? 'dash 20s linear infinite' : 'none',
        }}
      />

      <EdgeLabelRenderer>
        {isHovered && !isExecuting && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
          >
            <button
              onClick={() => removeEdge(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                border: 'none',
                borderRadius: '50%',
                backgroundColor: '#FF3B30',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(255, 59, 48, 0.3)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* Invisible hit area for better hover detection */}
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            width: '40px',
            height: '40px',
            pointerEvents: 'all',
            cursor: 'pointer',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
      </EdgeLabelRenderer>

      <style>
        {`
          @keyframes dash {
            to {
              stroke-dashoffset: -100;
            }
          }
        `}
      </style>
    </>
  );
});

PipelineEdge.displayName = 'PipelineEdge';
