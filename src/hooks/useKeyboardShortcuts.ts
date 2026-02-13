import { useEffect } from 'react';
import { useAppStore } from '../stores/app-store';

export function useKeyboardShortcuts() {
  const toggleCommandPalette = useAppStore((state) => state.toggleCommandPalette);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const closeCommandPalette = useAppStore((state) => state.closeCommandPalette);
  const commandPaletteOpen = useAppStore((state) => state.commandPaletteOpen);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

      // Cmd/Ctrl + K: Toggle command palette
      if (cmdOrCtrl && event.key === 'k') {
        event.preventDefault();
        toggleCommandPalette();
        return;
      }

      // Cmd/Ctrl + B: Toggle sidebar
      if (cmdOrCtrl && event.key === 'b') {
        event.preventDefault();
        toggleSidebar();
        return;
      }

      // Escape: Close command palette
      if (event.key === 'Escape' && commandPaletteOpen) {
        event.preventDefault();
        closeCommandPalette();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleCommandPalette, toggleSidebar, closeCommandPalette, commandPaletteOpen]);
}
