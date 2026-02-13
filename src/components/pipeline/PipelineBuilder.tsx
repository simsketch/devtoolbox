import React, { useCallback, useMemo, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  Node,
  Edge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { usePipelineStore } from '@/stores/pipeline-store';
import { getToolById } from '@/tools/index';
import { executePipeline } from '@/lib/pipeline-engine';
import type { PipelineNode as PipelineNodeType } from '@/types/pipeline';

import { PipelineNode } from './PipelineNode';
import { PipelineEdge } from './PipelineEdge';
import { PipelineToolbar } from './PipelineToolbar';
import { PipelineSidebar } from './PipelineSidebar';

// Define node types outside component to prevent re-renders
const nodeTypes = {
  tool: PipelineNode,
};

// Define edge types outside component to prevent re-renders
const edgeTypes = {
  custom: PipelineEdge,
};

export const PipelineBuilderComponent: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<any>(null);

  const {
    nodes: storeNodes,
    edges: storeEdges,
    addNode,
    setNodes: setStoreNodes,
    setEdges: setStoreEdges,
    removeNode,
    startExecution,
    updateExecution,
    clearExecutions,
    isExecuting,
  } = usePipelineStore();

  // Convert store nodes to React Flow nodes
  const convertToFlowNodes = useCallback((nodes: PipelineNodeType[]): Node[] => {
    return nodes.map((node) => ({
      id: node.id,
      type: 'tool',
      position: node.position,
      data: {
        label: node.data.label,
        toolId: node.toolId,
        config: node.data.config,
      },
    }));
  }, []);

  // Convert store edges to React Flow edges
  const convertToFlowEdges = useCallback((edges: any[]): Edge[] => {
    return edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      type: 'custom',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: 'var(--text-tertiary)',
      },
    }));
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(convertToFlowNodes(storeNodes));
  const [edges, setEdges, onEdgesChange] = useEdgesState(convertToFlowEdges(storeEdges));

  // Sync store changes to React Flow (store is source of truth)
  React.useEffect(() => {
    setNodes(convertToFlowNodes(storeNodes));
  }, [storeNodes, convertToFlowNodes, setNodes]);

  React.useEffect(() => {
    setEdges(convertToFlowEdges(storeEdges));
  }, [storeEdges, convertToFlowEdges, setEdges]);

  // Sync node position changes (from dragging) back to the store
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const updatedNodes = storeNodes.map((n) =>
        n.id === node.id ? { ...n, position: node.position } : n
      );
      setStoreNodes(updatedNodes);
    },
    [storeNodes, setStoreNodes]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        ...connection,
        id: `e${connection.source}-${connection.target}`,
        type: 'custom',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: 'var(--text-tertiary)',
        },
      };

      setEdges((eds) => {
        const updated = addEdge(newEdge, eds);
        setStoreEdges(updated as any[]);
        return updated;
      });
    },
    [setEdges, setStoreEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const toolId = event.dataTransfer.getData('application/reactflow');
      if (!toolId || !reactFlowInstance) return;

      const tool = getToolById(toolId);
      if (!tool) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: PipelineNodeType = {
        id: `node-${Date.now()}`,
        type: 'tool',
        toolId: tool.id,
        position,
        data: {
          label: tool.name,
          config: {},
        },
      };

      addNode(newNode);
    },
    [reactFlowInstance, addNode]
  );

  const handleRun = async () => {
    if (storeNodes.length === 0) return;

    startExecution();

    try {
      await executePipeline(
        storeNodes,
        storeEdges,
        (nodeId) => {
          updateExecution(nodeId, {
            status: 'running',
            startTime: Date.now(),
          });
        },
        (nodeId, result) => {
          updateExecution(nodeId, {
            status: 'success',
            result,
            endTime: Date.now(),
          });
        },
        (nodeId, error) => {
          updateExecution(nodeId, {
            status: 'error',
            error,
            endTime: Date.now(),
          });
        }
      );
    } catch (error: any) {
      console.error('Pipeline execution failed:', error);
    }
  };

  const handleStop = () => {
    clearExecutions();
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the entire pipeline?')) {
      setStoreNodes([]);
      setStoreEdges([]);
      clearExecutions();
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PipelineToolbar onRun={handleRun} onStop={handleStop} onClear={handleClear} />

      <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
        <PipelineSidebar />

        <div ref={reactFlowWrapper} style={{ flex: 1, position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            minZoom={0.2}
            maxZoom={2}
            defaultEdgeOptions={{
              type: 'custom',
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: 'var(--text-tertiary)',
              },
            }}
            style={{
              backgroundColor: 'var(--bg-primary)',
            }}
          >
            <Controls
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-secondary)',
                borderRadius: 'var(--radius-md)',
              }}
            />
            <MiniMap
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-secondary)',
                borderRadius: 'var(--radius-md)',
              }}
              nodeColor={(node) => {
                const execution = usePipelineStore.getState().executions[node.id];
                if (execution?.status === 'running') return '#007AFF';
                if (execution?.status === 'success') return '#34C759';
                if (execution?.status === 'error') return '#FF3B30';
                return 'var(--text-tertiary)';
              }}
            />
            <Background
              variant={BackgroundVariant.Dots}
              gap={16}
              size={1}
              color="var(--border-secondary)"
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};
