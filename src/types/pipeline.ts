export interface PipelineNode {
  id: string;
  type: 'tool' | 'input' | 'output';
  toolId?: string;
  position: { x: number; y: number };
  data: {
    label: string;
    config?: Record<string, any>;
    value?: string;
  };
}

export interface PipelineEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface PipelineExecution {
  nodeId: string;
  status: 'pending' | 'running' | 'success' | 'error';
  result?: string;
  error?: string;
  startTime?: number;
  endTime?: number;
}

export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  createdAt: number;
  updatedAt: number;
}
