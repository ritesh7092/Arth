// useTheme.js
import { useState, useEffect, useCallback } from 'react';

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  }, []);

  return [theme, toggle];
}
