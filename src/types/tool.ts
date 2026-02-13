export type ToolCategory =
  | 'formatting'
  | 'encoding'
  | 'crypto'
  | 'converters'
  | 'generators'
  | 'text'
  | 'network'
  | 'datetime'
  | 'misc';

export interface ToolPort {
  id: string;
  label: string;
  type: 'string' | 'json' | 'binary' | 'number';
}

export interface ToolConfigField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'toggle';
  default: any;
  options?: { label: string; value: string }[];
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  keywords: string[];
  icon: string;  // Lucide icon name
  iconColor?: string;
  component: React.ComponentType;
  inputs: ToolPort[];
  outputs: ToolPort[];
  configFields?: ToolConfigField[];
  transform?: (input: string, config?: Record<string, any>) => Promise<string>;
  sampleData?: string;
}

export interface ToolInstance {
  id: string;
  toolId: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}
