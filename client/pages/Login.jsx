// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaUserAlt, FaLock, FaArrowRight } from 'react-icons/fa';
import baseUrl from '../api/api';
import { useTheme } from '../src/theme/ThemeProvider'; // Import useTheme hook
import { Moon, Sun } from 'lucide-react'; // Import Lucide icons

export default function LoginPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const isDarkMode = theme === 'dark';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Theme-aware dynamic classes ---
  const themeClasses = {
    bg: isDarkMode
      ? 'bg-gradient-to-br from-gray-900 via-gray-950 to-black'
      : 'bg-gradient-to-br from-indigo-50 to-white',
    headerBg: isDarkMode
      ? 'bg-gradient-to-r from-gray-800 to-gray-900 shadow-xl'
      : 'bg-white shadow-lg',
    headerTitle: isDarkMode
      ? 'text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300'
      : 'text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4facfe] to-[#00f2fe]',
    cardBg: isDarkMode
      ? 'bg-gray-800/60 backdrop-blur-lg border border-gray-700/50'
      : 'bg-white/70 backdrop-blur-lg border border-gray-200/80',
    cardTitle: isDarkMode ? 'text-white' : 'text-gray-800',
    inputBg: isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100',
    inputBorder: isDarkMode ? 'border-gray-600 focus:border-blue-400' : 'border-gray-300 focus:border-blue-500',
    inputPlaceholder: isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500',
    inputText: isDarkMode ? 'text-gray-100' : 'text-gray-800',
    iconColor: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    buttonPrimary: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl',
    linkText: isDarkMode ? 'text-blue-400 hover:text-cyan-300' : 'text-blue-600 hover:text-cyan-700',
    helperText: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    // For the theme toggle button
    buttonToggle: isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-md',
  };

  // Keep the blob animations as they are visually appealing in both modes,
  // but we'll adjust their colors dynamically.
  const blobColors = {
    blob1: isDarkMode ? 'bg-indigo-600/30' : 'bg-blue-300/30',
    blob2: isDarkMode ? 'bg-purple-600/30' : 'bg-purple-300/30',
  };

  const reset = () => {
    setUsername('');
    setPassword('');
  };

  const validateForm = () => {
    if (!username || !password) {
      toast.error('Please fill out all fields.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await baseUrl.post('/api/auth/public/login', { username, password });
      const data = response.data;
      localStorage.setItem('authToken', data.token);
      reset();
      toast.success('Login successful!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'An unexpected error occurred. Please try again.';
      console.error('Login error:', error);
      toast.error(message);
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-500 ${themeClasses.bg}`}>
      {/* Toast Notifications */}
      <Toaster position="bottom-center" reverseOrder={false} />

      {/* Header */}
      <header className={`py-6 ${themeClasses.headerBg}`}>
        <div className="container mx-auto px-4 flex justify-center">
          <Link to="/" className="transform hover:scale-105 transition-transform">
            <h1 className={themeClasses.headerTitle} style={{ fontFamily: '"Brush Script MT", cursive' }}>
              Arth
            </h1>
          </Link>
        </div>
      </header>

      {/* --- THEME TOGGLE BUTTON --- */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 ${themeClasses.buttonToggle} focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-950' : 'focus:ring-offset-white'} focus:ring-blue-500 shadow-md`}
          aria-label="Toggle theme"
          title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6 text-yellow-300 animate__animated animate__fadeIn animate__faster" />
          ) : (
            <Moon className="w-6 h-6 text-indigo-700 animate__animated animate__fadeIn animate__faster" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center relative overflow-hidden px-4">
        {/* Decorative Blobs */}
        <div className={`absolute top-0 left-0 w-96 h-96 ${blobColors.blob1} rounded-full filter blur-3xl opacity-30 animate-blob`}></div>
        <div className={`absolute bottom-0 right-0 w-96 h-96 ${blobColors.blob2} rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000`}></div>

        {/* Glassmorphic Card */}
        <div className={`relative z-10 w-full max-w-md ${themeClasses.cardBg} rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105 animate__animated animate__fadeInUp`}>
          <h2 className={`text-3xl font-bold ${themeClasses.cardTitle} text-center mb-6`}>Log In</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="relative">
              <FaUserAlt className={`absolute top-1/2 left-3 transform -translate-y-1/2 ${themeClasses.iconColor}`} />
              <input
                type="text"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 ${themeClasses.inputBg} border ${themeClasses.inputBorder} rounded-lg ${themeClasses.inputText} ${themeClasses.inputPlaceholder} focus:outline-none focus:ring-2 transition-colors`}
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <FaLock className={`absolute top-1/2 left-3 transform -translate-y-1/2 ${themeClasses.iconColor}`} />
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 ${themeClasses.inputBg} border ${themeClasses.inputBorder} rounded-lg ${themeClasses.inputText} ${themeClasses.inputPlaceholder} focus:outline-none focus:ring-2 transition-colors`}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center ${themeClasses.buttonPrimary} font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:scale-95`}
            >
              {loading ? 'Logging in...' : 'Login'}
              {!loading && <FaArrowRight className="ml-2 animate-bounce" />}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className={`mt-6 text-center text-sm ${themeClasses.helperText}`}>
            Don’t have an account?{' '}
            <Link
              to="/signup"
              className={`underline transition-colors ${themeClasses.linkText}`}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}



// // LoginPage.jsx
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Toaster, toast } from 'react-hot-toast';
// import { FaUserAlt, FaLock, FaArrowRight } from 'react-icons/fa';
// import baseUrl from '../api/api';

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const reset = () => {
//     setUsername('');
//     setPassword('');
//   };

//   const validateForm = () => {
//     if (!username || !password) {
//       toast.error('Please fill out all fields.');
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const response = await baseUrl.post('/api/auth/public/login', { username, password });
//       const data = response.data;
//       localStorage.setItem('authToken', data.token);
//       reset();
//       toast.success('Login successful!');
//       setTimeout(() => {
//         navigate('/dashboard');
//       }, 1500);
//     } catch (error) {
//       const message =
//         error.response?.data?.message ||
//         'An unexpected error occurred. Please try again.';
//       console.error('Login error:', error);
//       toast.error(message);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a192f] to-[#020c1b]">
//       {/* Toast Notifications */}
//       <Toaster position="bottom-center" reverseOrder={false} />

//       {/* Header */}
//       <header className="py-6 bg-gradient-to-r from-[#1f2a40] to-[#16202e] shadow-xl">
//         <div className="container mx-auto px-4 flex justify-center">
//           <Link to="/" className="transform hover:scale-105 transition-transform">
//             <h1
//               className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4facfe] to-[#00f2fe]"
//               style={{ fontFamily: '"Brush Script MT", cursive' }}
//             >
//               Arth
//             </h1>
//           </Link>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="flex-grow flex items-center justify-center relative overflow-hidden px-4">
//         {/* Decorative Blobs */}
//         <div className="absolute top-0 left-0 w-96 h-96 bg-[#3b82f680] rounded-full filter blur-3xl opacity-30 animate-blob"></div>
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#9333ea80] rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

//         {/* Glassmorphic Card */}
//         <div className="relative z-10 w-full max-w-md bg-[rgba(255,255,255,0.05)] backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105">
//           <h2 className="text-3xl font-bold text-white text-center mb-6">Log In</h2>
//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Username Field */}
//             <div className="relative">
//               <FaUserAlt className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 id="username"
//                 placeholder="Username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 bg-[#1f2937] border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition-colors"
//               />
//             </div>

//             {/* Password Field */}
//             <div className="relative">
//               <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="password"
//                 id="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 bg-[#1f2937] border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition-colors"
//               />
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full flex items-center justify-center bg-gradient-to-r from-[#4facfe] to-[#00f2fe] hover:from-[#3b82f6] hover:to-[#0ea5e9] text-white font-semibold py-3 rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Logging in...' : 'Login'}
//               {!loading && <FaArrowRight className="ml-2 animate-bounce" />}
//             </button>
//           </form>

//           {/* Sign Up Link */}
//           <p className="mt-6 text-center text-gray-300 text-sm">
//             Don’t have an account?{' '}
//             <Link
//               to="/signup"
//               className="text-[#4facfe] hover:text-[#00f2fe] underline transition-colors"
//             >
//               Sign Up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

