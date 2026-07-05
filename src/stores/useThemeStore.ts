import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setResolvedTheme: (resolved: 'light' | 'dark') => void;
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const resolveTheme = (theme: Theme): 'light' | 'dark' =>
  theme === 'system' ? getSystemTheme() : theme;

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',
      setTheme: theme => {
        const resolvedTheme = resolveTheme(theme);
        set({ theme, resolvedTheme });
      },
      toggleTheme: () => {
        const resolved = get().resolvedTheme === 'light' ? 'dark' : 'light';
        set({ theme: resolved, resolvedTheme: resolved });
      },
      setResolvedTheme: resolvedTheme => set({ resolvedTheme }),
    }),
    {
      name: 'gia-su-theme',
      partialize: state => ({ theme: state.theme }),
      onRehydrateStorage: () => state => {
        if (state) {
          state.setResolvedTheme(resolveTheme(state.theme));
        }
      },
    }
  )
);
