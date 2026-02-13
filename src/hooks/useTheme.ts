import { useEffect } from 'react';
import { useAppStore } from '../stores/app-store';

export function useTheme() {
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);

  useEffect(() => {
    const root = document.documentElement;
    // The Liquid Glass design only supports dark mode.
    // Always apply dark class regardless of theme setting.
    root.classList.add('dark');
    root.classList.remove('light');
  }, [theme]);

  return { theme, setTheme };
}
