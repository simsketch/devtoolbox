import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HistoryEntry {
  id: string;
  toolId: string;
  toolName: string;
  input: string;
  output: string;
  timestamp: number;
  config?: Record<string, any>;
}

interface HistoryState {
  entries: HistoryEntry[];
  maxEntries: number;

  // Actions
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  removeEntry: (id: string) => void;
  getEntriesByTool: (toolId: string) => HistoryEntry[];
  setMaxEntries: (max: number) => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      entries: [],
      maxEntries: 100,

      addEntry: (entry) => set((state) => {
        const newEntry: HistoryEntry = {
          ...entry,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        };

        const updatedEntries = [newEntry, ...state.entries].slice(0, state.maxEntries);

        return { entries: updatedEntries };
      }),

      clearHistory: () => set({ entries: [] }),

      removeEntry: (id) => set((state) => ({
        entries: state.entries.filter(entry => entry.id !== id)
      })),

      getEntriesByTool: (toolId) => {
        return get().entries.filter(entry => entry.toolId === toolId);
      },

      setMaxEntries: (max) => set((state) => ({
        maxEntries: max,
        entries: state.entries.slice(0, max)
      })),
    }),
    {
      name: 'devtoolbox-history-store',
      partialize: (state) => ({
        entries: state.entries,
        maxEntries: state.maxEntries,
      }),
    }
  )
);
