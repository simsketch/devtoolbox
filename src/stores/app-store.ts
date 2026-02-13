import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ToolAction = 'sample' | 'clear' | 'clipboard' | null;

interface AppState {
  activeTool: string | null;
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  theme: 'light' | 'dark' | 'system';
  searchQuery: string;
  commandPaletteOpen: boolean;
  favorites: string[];
  recentTools: string[];
  toolAction: ToolAction;
  clipboardText: string;

  // Actions
  setActiveTool: (toolId: string | null) => void;
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setSearchQuery: (query: string) => void;
  toggleCommandPalette: () => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  addFavorite: (toolId: string) => void;
  removeFavorite: (toolId: string) => void;
  toggleFavorite: (toolId: string) => void;
  addRecentTool: (toolId: string) => void;
  clearRecentTools: () => void;
  triggerToolAction: (action: ToolAction, clipboardText?: string) => void;
  clearToolAction: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeTool: null,
      sidebarCollapsed: false,
      sidebarWidth: 240,
      theme: 'dark',
      searchQuery: '',
      commandPaletteOpen: false,
      favorites: [],
      recentTools: [],
      toolAction: null,
      clipboardText: '',

      setActiveTool: (toolId) => set((state) => {
        if (toolId && toolId !== state.activeTool) {
          const recentTools = [toolId, ...state.recentTools.filter(id => id !== toolId)].slice(0, 10);
          return { activeTool: toolId, recentTools };
        }
        return { activeTool: toolId };
      }),

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarWidth: (width) => set({ sidebarWidth: width }),

      setTheme: (theme) => set({ theme }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      toggleCommandPalette: () => set((state) => ({
        commandPaletteOpen: !state.commandPaletteOpen,
        searchQuery: !state.commandPaletteOpen ? '' : state.searchQuery
      })),

      openCommandPalette: () => set({ commandPaletteOpen: true, searchQuery: '' }),

      closeCommandPalette: () => set({ commandPaletteOpen: false, searchQuery: '' }),

      addFavorite: (toolId) => set((state) => ({
        favorites: state.favorites.includes(toolId)
          ? state.favorites
          : [...state.favorites, toolId]
      })),

      removeFavorite: (toolId) => set((state) => ({
        favorites: state.favorites.filter(id => id !== toolId)
      })),

      toggleFavorite: (toolId) => set((state) => ({
        favorites: state.favorites.includes(toolId)
          ? state.favorites.filter(id => id !== toolId)
          : [...state.favorites, toolId]
      })),

      addRecentTool: (toolId) => set((state) => ({
        recentTools: [toolId, ...state.recentTools.filter(id => id !== toolId)].slice(0, 10)
      })),

      clearRecentTools: () => set({ recentTools: [] }),

      triggerToolAction: (action, clipboardText) => set({ toolAction: action, clipboardText: clipboardText || '' }),

      clearToolAction: () => set({ toolAction: null }),
    }),
    {
      name: 'devtoolbox-app-store',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        sidebarWidth: state.sidebarWidth,
        theme: state.theme,
        favorites: state.favorites,
        recentTools: state.recentTools,
      }),
    }
  )
);
