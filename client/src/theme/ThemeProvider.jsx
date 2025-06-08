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

  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    document.body.classList.toggle('light-theme', theme === 'light');
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to consume theme/context
export function useTheme() {
  return useContext(ThemeContext);
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

