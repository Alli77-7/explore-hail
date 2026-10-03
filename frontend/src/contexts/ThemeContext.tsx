// الوضع الليلي/النهاري متاح لكل التطبيق عن طريق Context
import { createContext, useEffect, useState, type ReactNode } from 'react';
import type { Theme } from '../types';
import { readStorage, writeStorage } from '../utils/helpers';

const STORAGE_KEY = 'exploreHailTheme';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (readStorage(STORAGE_KEY) === 'dark' ? 'dark' : 'light'));

  // نحط data-theme على <html>، وملف variables.css يغيّر الألوان حسبه
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeStorage(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme(current => (current === 'dark' ? 'light' : 'dark'));

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
