import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export const ThemeProvider = ({
  children,
  defaultTheme = 'system',
  storageKey = 'gia-su-theme',
}: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Get system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Update resolved theme based on current theme setting
  const updateResolvedTheme = useCallback((currentTheme: Theme) => {
    const newResolvedTheme = currentTheme === 'system' ? getSystemTheme() : currentTheme;
    setResolvedTheme(newResolvedTheme);

    // Update document class
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newResolvedTheme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', newResolvedTheme === 'dark' ? '#1f2937' : '#ffffff');
    }
  }, []);

  // Set theme with localStorage persistence
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(storageKey, newTheme);
    updateResolvedTheme(newTheme);
  };

  // Toggle between light and dark (ignoring system)
  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null;
    const initialTheme = stored || defaultTheme;
    setThemeState(initialTheme);
    updateResolvedTheme(initialTheme);
  }, [defaultTheme, storageKey, updateResolvedTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (theme === 'system') {
        updateResolvedTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, updateResolvedTheme]);

  // Update resolved theme when theme changes
  useEffect(() => {
    updateResolvedTheme(theme);
  }, [theme, updateResolvedTheme]);

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for conditional rendering based on theme
export const useIsDark = () => {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark';
};
