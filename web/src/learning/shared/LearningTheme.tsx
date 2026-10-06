'use client';

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import styles from '@/app/learn/learn.module.css';

export type ThemePreference = 'light' | 'dark' | 'system';
type ThemeContextValue = {
  isDark: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function subscribeToSystemTheme(callback: () => void) {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function LearningTheme({
  initialTheme,
  children,
}: {
  initialTheme: ThemePreference;
  children: ReactNode;
}) {
  const [preference, setPreference] = useState(initialTheme);
  const systemDark = useSyncExternalStore(subscribeToSystemTheme, getSystemTheme, () => false);
  const isDark = preference === 'system' ? systemDark : preference === 'dark';

  const setTheme = (theme: 'light' | 'dark') => {
    // Server đọc cùng cookie ở lần mở tiếp để dùng đúng màu từ đầu.
    document.cookie = `smart-kids-learning-theme=${theme}; Path=/learn; Max-Age=31536000; SameSite=Lax`;
    setPreference(theme);
  };

  return (
    <ThemeContext.Provider value={{ isDark, setTheme }}>
      <div className={styles.themeRoot} data-learning-theme={preference}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useLearningTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('Khu học tập cần LearningTheme bao quanh.');
  return context;
}
