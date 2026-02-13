import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Pipeline, PipelineNode, PipelineEdge, PipelineExecution } from '../types/pipeline';

interface PipelineState {
  pipelines: Pipeline[];
  activePipelineId: string | null;
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  executions: Record<string, PipelineExecution>;
  isExecuting: boolean;

  // Actions
  createPipeline: (name: string, description?: string) => string;
  deletePipeline: (id: string) => void;
  setActivePipeline: (id: string | null) => void;
  updatePipeline: (id: string, updates: Partial<Pipeline>) => void;
  addNode: (node: PipelineNode) => void;
  updateNode: (id: string, updates: Partial<PipelineNode>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: PipelineEdge) => void;
  removeEdge: (id: string) => void;
  setNodes: (nodes: PipelineNode[]) => void;
  setEdges: (edges: PipelineEdge[]) => void;
  startExecution: () => void;
  updateExecution: (nodeId: string, execution: Partial<PipelineExecution>) => void;
  clearExecutions: () => void;
  savePipeline: () => void;
  loadPipeline: (id: string) => void;
}

export const usePipelineStore = create<PipelineState>()(
  persist(
    (set, get) => ({
      pipelines: [],
      activePipelineId: null,
      nodes: [],
      edges: [],
      executions: {},
      isExecuting: false,

      createPipeline: (name, description) => {
        const id = crypto.randomUUID();
        const newPipeline: Pipeline = {
          id,
          name,
          description,
          nodes: [],
          edges: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          pipelines: [...state.pipelines, newPipeline],
          activePipelineId: id,
          nodes: [],
          edges: [],
        }));

        return id;
      },

      deletePipeline: (id) => set((state) => ({
        pipelines: state.pipelines.filter(p => p.id !== id),
        activePipelineId: state.activePipelineId === id ? null : state.activePipelineId,
        nodes: state.activePipelineId === id ? [] : state.nodes,
        edges: state.activePipelineId === id ? [] : state.edges,
      })),

      setActivePipeline: (id) => {
        const pipeline = get().pipelines.find(p => p.id === id);
        if (pipeline) {
          set({
            activePipelineId: id,
            nodes: pipeline.nodes,
            edges: pipeline.edges,
            executions: {},
          });
        } else {
          set({ activePipelineId: null, nodes: [], edges: [], executions: {} });
        }
      },

      updatePipeline: (id, updates) => set((state) => ({
        pipelines: state.pipelines.map(p =>
          p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
        ),
      })),

      addNode: (node) => set((state) => ({
        nodes: [...state.nodes, node],
      })),

      updateNode: (id, updates) => set((state) => ({
        nodes: state.nodes.map(node =>
          node.id === id ? { ...node, ...updates } : node
        ),
      })),

      removeNode: (id) => set((state) => ({
        nodes: state.nodes.filter(node => node.id !== id),
        edges: state.edges.filter(edge => edge.source !== id && edge.target !== id),
      })),

      addEdge: (edge) => set((state) => ({
        edges: [...state.edges, edge],
      })),

      removeEdge: (id) => set((state) => ({
        edges: state.edges.filter(edge => edge.id !== id),
      })),

      setNodes: (nodes) => set({ nodes }),

      setEdges: (edges) => set({ edges }),

      startExecution: () => set({ isExecuting: true, executions: {} }),

      updateExecution: (nodeId, execution) => set((state) => ({
        executions: {
          ...state.executions,
          [nodeId]: {
            ...state.executions[nodeId],
            nodeId,
            ...execution,
          } as PipelineExecution,
        },
      })),

      clearExecutions: () => set({ executions: {}, isExecuting: false }),

      savePipeline: () => {
        const state = get();
        if (state.activePipelineId) {
          set((s) => ({
            pipelines: s.pipelines.map(p =>
              p.id === s.activePipelineId
                ? { ...p, nodes: s.nodes, edges: s.edges, updatedAt: Date.now() }
                : p
            ),
          }));
        }
      },

      loadPipeline: (id) => {
        get().setActivePipeline(id);
      },
    }),
    {
      name: 'devtoolbox-pipeline-store',
      partialize: (state) => ({
        pipelines: state.pipelines,
        activePipelineId: state.activePipelineId,
      }),
    }
  )
);
