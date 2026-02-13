import type { PipelineNode, PipelineEdge } from '../types/pipeline';
import { getToolById } from '../tools/index';

/**
 * Execute a pipeline by running nodes in topological order.
 * Each node's output becomes the input for its connected downstream nodes.
 */
export async function executePipeline(
  nodes: PipelineNode[],
  edges: PipelineEdge[],
  onNodeStart: (nodeId: string) => void,
  onNodeComplete: (nodeId: string, result: string) => void,
  onNodeError: (nodeId: string, error: string) => void
): Promise<void> {
  // Build adjacency list and in-degree map for topological sort
  const adjacencyList = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  const nodeOutputs = new Map<string, string>();

  // Initialize all nodes
  nodes.forEach((node) => {
    adjacencyList.set(node.id, []);
    inDegree.set(node.id, 0);
  });

  // Build graph
  edges.forEach((edge) => {
    const sourceList = adjacencyList.get(edge.source);
    if (sourceList) {
      sourceList.push(edge.target);
    }
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  });

  // Topological sort using Kahn's algorithm
  const queue: string[] = [];
  nodes.forEach((node) => {
    if (inDegree.get(node.id) === 0) {
      queue.push(node.id);
    }
  });

  const executionOrder: string[] = [];
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    executionOrder.push(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    neighbors.forEach((neighborId) => {
      const degree = inDegree.get(neighborId)! - 1;
      inDegree.set(neighborId, degree);
      if (degree === 0) {
        queue.push(neighborId);
      }
    });
  }

  // Check for cycles
  if (executionOrder.length !== nodes.length) {
    throw new Error('Pipeline contains cycles');
  }

  // Execute nodes in topological order
  for (const nodeId of executionOrder) {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) continue;

    onNodeStart(nodeId);

    try {
      let result: string = '';

      if (node.type === 'input') {
        // Input nodes just pass through their value
        result = node.data.value || '';
      } else if (node.type === 'tool' && node.toolId) {
        // Get the tool definition
        const tool = getToolById(node.toolId);
        if (!tool) {
          throw new Error(`Tool not found: ${node.toolId}`);
        }

        // Collect inputs from incoming edges
        const incomingEdges = edges.filter((e) => e.target === nodeId);
        let input = '';

        if (incomingEdges.length > 0) {
          // Use output from the first connected node as input
          const sourceNodeId = incomingEdges[0].source;
          input = nodeOutputs.get(sourceNodeId) || '';
        }

        // Execute the tool's transform function
        if (tool.transform) {
          result = await tool.transform(input, node.data.config);
        } else {
          // If no transform function, just pass through
          result = input;
        }
      } else if (node.type === 'output') {
        // Output nodes just display their input
        const incomingEdges = edges.filter((e) => e.target === nodeId);
        if (incomingEdges.length > 0) {
          const sourceNodeId = incomingEdges[0].source;
          result = nodeOutputs.get(sourceNodeId) || '';
        }
      }

      // Store the output for downstream nodes
      nodeOutputs.set(nodeId, result);
      onNodeComplete(nodeId, result);
    } catch (err: any) {
      const errorMessage = err?.message || 'Unknown error occurred';
      onNodeError(nodeId, errorMessage);
      throw err; // Stop execution on error
    }
  }
}
