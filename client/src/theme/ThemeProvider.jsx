import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

// Wrap your entire app in <ThemeProvider>
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } catch {
      return 'light';
    }
  });

  // Apply theme immediately on mount and changes
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove all theme classes first
    root.classList.remove('light', 'dark');
    body.classList.remove('light-theme', 'dark-theme');
    
    // Add current theme class
    root.classList.add(theme);
    body.classList.add(`${theme}-theme`);
    
    // Persist to localStorage
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      const saved = localStorage.getItem('theme');
      if (!saved) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      // Apply immediately for instant feedback
      const root = document.documentElement;
      const body = document.body;
      
      root.classList.remove('light', 'dark');
      body.classList.remove('light-theme', 'dark-theme');
      root.classList.add(newTheme);
      body.classList.add(`${newTheme}-theme`);
      
      return newTheme;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to consume theme/context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}






// // src/theme/ThemeProvider.jsx
// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// const ThemeContext = createContext();

// export function ThemeProvider({ children }) {
//   // initialize from localStorage or system
//   const [theme, setTheme] = useState(() => {
//     try {
//       const saved = localStorage.getItem('theme');
//       if (saved === 'dark' || saved === 'light') return saved;
//       return window.matchMedia('(prefers-color-scheme: dark)').matches
//         ? 'dark'
//         : 'light';
//     } catch {
//       return 'light';
//     }
//   });

//   // apply to <body> and persist
//   useEffect(() => {
//     document.body.classList.toggle('dark-theme', theme === 'dark');
//     document.body.classList.toggle('light-theme', theme === 'light');
//     try {
//       localStorage.setItem('theme', theme);
//     } catch {}
//   }, [theme]);

//   const toggleTheme = useCallback(() => {
//     setTheme(t => (t === 'light' ? 'dark' : 'light'));
//   }, []);

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

// // custom hook to consume
// export function useTheme() {
//   return useContext(ThemeContext);
// }

