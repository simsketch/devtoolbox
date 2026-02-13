import { useEffect } from 'react';
import { useAppStore } from '../stores/app-store';
import { getToolById } from '../tools';

/**
 * Hook for tool components to respond to toolbar actions (Sample, Clear, Clipboard).
 *
 * Usage:
 *   useToolAction(setInput);
 *   // or with custom handler:
 *   useToolAction((text) => { setInput(text); setOtherState(''); });
 */
export function useToolAction(
  setInput: (value: string) => void,
  toolId?: string,
) {
  const toolAction = useAppStore((state) => state.toolAction);
  const clipboardText = useAppStore((state) => state.clipboardText);
  const activeTool = useAppStore((state) => state.activeTool);
  const clearToolAction = useAppStore((state) => state.clearToolAction);

  useEffect(() => {
    if (!toolAction) return;

    const currentToolId = toolId || activeTool;
    const tool = currentToolId ? getToolById(currentToolId) : null;

    switch (toolAction) {
      case 'sample':
        if (tool?.sampleData) {
          setInput(tool.sampleData);
        }
        break;
      case 'clear':
        setInput('');
        break;
      case 'clipboard':
        if (clipboardText) {
          setInput(clipboardText);
        }
        break;
    }

    clearToolAction();
  }, [toolAction]);
}
