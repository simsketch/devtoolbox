import React, { useState } from 'react';
import { Play, Square, Save, FolderOpen, Download, Upload, Trash2 } from 'lucide-react';
import { usePipelineStore } from '@/stores/pipeline-store';

export const PipelineToolbar: React.FC<{
  onRun: () => void;
  onStop: () => void;
  onClear: () => void;
}> = ({ onRun, onStop, onClear }) => {
  const {
    activePipelineId,
    pipelines,
    updatePipeline,
    savePipeline,
    createPipeline,
    loadPipeline,
    isExecuting,
    nodes,
    edges,
  } = usePipelineStore();

  const [isLoadMenuOpen, setIsLoadMenuOpen] = useState(false);
  const [pipelineName, setPipelineName] = useState('Untitled Pipeline');

  const activePipeline = pipelines.find((p) => p.id === activePipelineId);

  React.useEffect(() => {
    if (activePipeline) {
      setPipelineName(activePipeline.name);
    }
  }, [activePipeline]);

  const handleSave = () => {
    if (activePipelineId) {
      updatePipeline(activePipelineId, { name: pipelineName });
      savePipeline();
    } else {
      // Create new pipeline
      const id = createPipeline(pipelineName);
      savePipeline();
    }
  };

  const handleExport = () => {
    const data = {
      name: pipelineName,
      nodes,
      edges,
      version: '1.0',
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pipelineName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.nodes && data.edges) {
            const id = createPipeline(data.name || 'Imported Pipeline');
            usePipelineStore.getState().setNodes(data.nodes);
            usePipelineStore.getState().setEdges(data.edges);
            savePipeline();
          }
        } catch (err) {
          alert('Invalid pipeline file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div
      style={{
        height: '52px',
        borderBottom: '1px solid var(--border-secondary)',
        backgroundColor: 'var(--bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
        padding: '0 var(--spacing-lg)',
      }}
    >
      {/* Pipeline Name */}
      <input
        type="text"
        value={pipelineName}
        onChange={(e) => setPipelineName(e.target.value)}
        onBlur={() => {
          if (activePipelineId) {
            updatePipeline(activePipelineId, { name: pipelineName });
          }
        }}
        style={{
          flex: 1,
          maxWidth: '300px',
          fontSize: '14px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          backgroundColor: 'transparent',
          border: '1px solid transparent',
          borderRadius: 'var(--radius-md)',
          padding: '6px 10px',
          outline: 'none',
          transition: 'all 0.15s ease',
        }}
        onFocus={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
          e.currentTarget.style.borderColor = 'var(--border-primary)';
        }}
        onBlurCapture={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.borderColor = 'transparent';
        }}
      />

      <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-secondary)' }} />

      {/* Run/Stop */}
      {!isExecuting ? (
        <button
          className="btn-macos"
          onClick={onRun}
          disabled={nodes.length === 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            fontSize: '13px',
            padding: '6px 14px',
          }}
        >
          <Play size={14} />
          Run
        </button>
      ) : (
        <button
          className="btn-macos"
          onClick={onStop}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            fontSize: '13px',
            padding: '6px 14px',
            backgroundColor: '#FF3B30',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FF2D20';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FF3B30';
          }}
        >
          <Square size={14} />
          Stop
        </button>
      )}

      {/* Save */}
      <button
        className="btn-macos-secondary"
        onClick={handleSave}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
          fontSize: '13px',
          padding: '6px 14px',
        }}
      >
        <Save size={14} />
        Save
      </button>

      {/* Load */}
      <div style={{ position: 'relative' }}>
        <button
          className="btn-macos-secondary"
          onClick={() => setIsLoadMenuOpen(!isLoadMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            fontSize: '13px',
            padding: '6px 14px',
          }}
        >
          <FolderOpen size={14} />
          Load
        </button>

        {isLoadMenuOpen && (
          <>
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999,
              }}
              onClick={() => setIsLoadMenuOpen(false)}
            />
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                minWidth: '250px',
                maxHeight: '300px',
                overflowY: 'auto',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-secondary)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                zIndex: 1000,
                padding: 'var(--spacing-xs)',
              }}
            >
              {pipelines.length === 0 ? (
                <div
                  style={{
                    padding: 'var(--spacing-lg)',
                    fontSize: '12px',
                    color: 'var(--text-tertiary)',
                    textAlign: 'center',
                  }}
                >
                  No saved pipelines
                </div>
              ) : (
                pipelines.map((pipeline) => (
                  <button
                    key={pipeline.id}
                    onClick={() => {
                      loadPipeline(pipeline.id);
                      setIsLoadMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '2px',
                      padding: 'var(--spacing-sm)',
                      border: 'none',
                      backgroundColor:
                        pipeline.id === activePipelineId ? 'var(--bg-tertiary)' : 'transparent',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      if (pipeline.id !== activePipelineId) {
                        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (pipeline.id !== activePipelineId) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: '500',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {pipeline.name}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      {pipeline.nodes.length} nodes • Updated{' '}
                      {new Date(pipeline.updatedAt).toLocaleDateString()}
                    </div>
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </div>

      <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-secondary)' }} />

      {/* Export/Import */}
      <button
        className="btn-macos-secondary"
        onClick={handleExport}
        disabled={nodes.length === 0}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
          fontSize: '13px',
          padding: '6px 14px',
        }}
      >
        <Download size={14} />
        Export
      </button>

      <button
        className="btn-macos-secondary"
        onClick={handleImport}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
          fontSize: '13px',
          padding: '6px 14px',
        }}
      >
        <Upload size={14} />
        Import
      </button>

      {/* Clear */}
      <button
        className="btn-macos-secondary"
        onClick={onClear}
        disabled={nodes.length === 0}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
          fontSize: '13px',
          padding: '6px 14px',
          marginLeft: 'auto',
        }}
      >
        <Trash2 size={14} />
        Clear
      </button>
    </div>
  );
};
