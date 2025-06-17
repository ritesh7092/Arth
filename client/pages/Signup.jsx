import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaUserAlt, FaEnvelope, FaLock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import baseUrl from '../api/api';
import { useTheme } from '../src/theme/ThemeProvider'; // Import useTheme hook
import { Moon, Sun } from 'lucide-react'; // Import Lucide icons

export default function SignupPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const isDarkMode = theme === 'dark';

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // State for field-specific errors

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
    inputBorderError: isDarkMode ? 'border-red-400 focus:border-red-400' : 'border-red-500 focus:border-red-500',
    inputPlaceholder: isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500',
    inputText: isDarkMode ? 'text-gray-100' : 'text-gray-800',
    iconColor: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    iconColorError: isDarkMode ? 'text-red-400' : 'text-red-500',
    checkboxBorder: isDarkMode ? 'border-gray-600' : 'border-gray-300',
    buttonPrimary: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl',
    linkText: isDarkMode ? 'text-blue-400 hover:text-cyan-300' : 'text-blue-600 hover:text-cyan-700',
    helperText: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    errorText: isDarkMode ? 'text-red-400' : 'text-red-500',
    // For the theme toggle button
    buttonToggle: isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-md',
  };

  const blobColors = {
    blob1: isDarkMode ? 'bg-indigo-600/30' : 'bg-blue-300/30',
    blob2: isDarkMode ? 'bg-purple-600/30' : 'bg-purple-300/30',
  };

  const parseErrorResponse = (error) => {
    const errorData = error.response?.data;
    const fieldErrors = {};
    let generalMessage = error.message || 'An unexpected error occurred. Please try again.';

    if (errorData) {
      // Prioritize specific 'already exists' messages if present in a general message
      const lowerCaseMessage = (errorData.message || '').toLowerCase();
      if (lowerCaseMessage.includes('already exists') || lowerCaseMessage.includes('duplicate')) {
        generalMessage = errorData.message || 'Username or email already exists. Please try different credentials.';
      }

      // Handle Spring Boot validation errors format (e.g., MethodArgumentNotValidException)
      if (errorData.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach(err => {
          if (err.field) {
            fieldErrors[err.field] = err.defaultMessage || err.message;
          }
        });
        // If there's a general validation message and no specific conflict, use it
        if (!Object.keys(fieldErrors).length && errorData.message) {
             generalMessage = errorData.message;
        } else if (Object.keys(fieldErrors).length > 0) {
            generalMessage = 'Please check the validation errors below.';
        }
      }
      // Handle simple field error object format
      else if (typeof errorData === 'object' && !errorData.message) {
        Object.keys(errorData).forEach(field => {
          if (typeof errorData[field] === 'string') {
            fieldErrors[field] = errorData[field];
          }
        });
        if (Object.keys(fieldErrors).length > 0) {
            generalMessage = 'Please check the validation errors below.';
        }
      }
      // Handle constraint violation format (e.g., ConstraintViolationException)
      else if (errorData.violations && Array.isArray(errorData.violations)) {
        errorData.violations.forEach(violation => {
          const fieldPath = violation.propertyPath;
          // Extract field name from propertyPath like 'register.username'
          const fieldMatch = fieldPath ? fieldPath.match(/\.([^.]+)$/) : null;
          const field = fieldMatch ? fieldMatch[1] : 'general'; // Default to 'general' if field not found
          
          if (field === 'username' || field === 'email') { // Specifically check for username/email conflicts
              if (violation.message.toLowerCase().includes('already exists') || violation.message.toLowerCase().includes('duplicate')) {
                  fieldErrors[field] = violation.message;
                  generalMessage = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists. Please try different credentials.`;
              } else {
                  fieldErrors[field] = violation.message;
              }
          } else {
              fieldErrors[field] = violation.message;
          }
        });
        if (Object.keys(fieldErrors).length > 0) {
            generalMessage = 'Please check the validation errors below.';
        }
      }
      // Fallback for when generalMessage wasn't set by specific cases
      else if (errorData.message) {
          generalMessage = errorData.message;
      }
    }
    
    // If it's a 409 Conflict, make sure the message is clear
    if (error.response?.status === 409) {
        generalMessage = generalMessage.includes('already exists') || generalMessage.includes('duplicate')
            ? generalMessage
            : 'A conflict occurred. This usually means the username or email is already taken.';
    } else if (!error.response) {
        generalMessage = 'Network error. Please check your connection and try again.';
    }

    return {
      fieldErrors,
      generalMessage
    };
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required.';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters long.';
    }
    if (!termsAccepted) {
      newErrors.terms = 'You must accept the Terms and Conditions.';
    }
    
    setErrors(newErrors);
    
    // Only show a general toast if there are client-side validation errors
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fill in all required fields and fix errors.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await baseUrl.post('/api/auth/public/register', {
        username: username.trim(),
        email: email.trim(),
        password,
        role: ["USER"] // Add default role if needed
      });
      toast.success('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1800);
    } catch (error) {
      console.error('Signup error:', error);
      
      const { fieldErrors, generalMessage } = parseErrorResponse(error);
      
      // Update field-specific errors
      setErrors(fieldErrors);

      // Determine the toast message based on the nature of errors
      let toastMessage = generalMessage;

      // If specific username/email already exists errors are present in fieldErrors, prioritize them for toast
      if (fieldErrors.username && (fieldErrors.username.toLowerCase().includes('already exists') || fieldErrors.username.toLowerCase().includes('duplicate'))) {
          toastMessage = fieldErrors.username;
      } else if (fieldErrors.email && (fieldErrors.email.toLowerCase().includes('already exists') || fieldErrors.email.toLowerCase().includes('duplicate'))) {
          toastMessage = fieldErrors.email;
      } else if (Object.keys(fieldErrors).length > 0) {
        // If there are other field-specific errors, prompt the user to fix them
        toastMessage = 'Please fix the validation errors below.';
      } else if (error.response?.status === 409) {
          // If it's a 409 and no specific field error was parsed, use the general conflict message
          toastMessage = 'Username or email already exists. Please try different credentials.';
      }

      toast.error(toastMessage);

    } finally {
      setLoading(false);
    }
  };

  // Helper function to get input classes based on error state
  const getInputClasses = (fieldName) => {
    const hasError = errors[fieldName];
    const borderClass = hasError ? themeClasses.inputBorderError : themeClasses.inputBorder;
    return `w-full pl-10 pr-4 py-3 ${themeClasses.inputBg} border ${borderClass} rounded-lg ${themeClasses.inputText} ${themeClasses.inputPlaceholder} focus:outline-none focus:ring-2 transition-colors`;
  };

  // Helper function to get icon classes based on error state
  const getIconClasses = (fieldName) => {
    const hasError = errors[fieldName];
    return `absolute top-1/2 left-3 transform -translate-y-1/2 ${hasError ? themeClasses.iconColorError : themeClasses.iconColor}`;
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
          <h2 className={`text-3xl font-bold ${themeClasses.cardTitle} text-center mb-6`}>Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="relative">
              <FaUserAlt className={getIconClasses('username')} />
              <input
                type="text"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={getInputClasses('username')}
                aria-invalid={errors.username ? 'true' : 'false'}
                aria-describedby={errors.username ? 'username-error' : undefined}
              />
              {errors.username && (
                <div id="username-error" className={`flex items-center mt-2 text-sm ${themeClasses.errorText}`}>
                  <FaExclamationTriangle className="mr-2 text-xs" />
                  {errors.username}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="relative">
              <FaEnvelope className={getIconClasses('email')} />
              <input
                type="email"
                id="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={getInputClasses('email')}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <div id="email-error" className={`flex items-center mt-2 text-sm ${themeClasses.errorText}`}>
                  <FaExclamationTriangle className="mr-2 text-xs" />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <FaLock className={getIconClasses('password')} />
              <input
                type="password"
                id="password"
                placeholder="Create a Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={getInputClasses('password')}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <div id="password-error" className={`flex items-center mt-2 text-sm ${themeClasses.errorText}`}>
                  <FaExclamationTriangle className="mr-2 text-xs" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Terms Checkbox */}
            <div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className={`h-5 w-5 text-blue-500 focus:ring-blue-500 ${errors.terms ? 'border-red-500' : themeClasses.checkboxBorder} rounded bg-transparent ${isDarkMode ? 'checked:bg-blue-500 checked:border-blue-500' : 'checked:bg-blue-600 checked:border-blue-600'}`}
                  aria-invalid={errors.terms ? 'true' : 'false'}
                  aria-describedby={errors.terms ? 'terms-error' : undefined}
                />
                <label htmlFor="termsAccepted" className={`text-sm flex items-center ${themeClasses.helperText}`}>
                  <FaCheckCircle className={`mr-2 ${themeClasses.iconColor}`} />
                  I accept the{' '}
                  <Link to="/terms" className={`underline ml-1 ${themeClasses.linkText}`}>
                    Terms &amp; Conditions
                  </Link>
                </label>
              </div>
              {errors.terms && (
                <div id="terms-error" className={`flex items-center mt-2 text-sm ${themeClasses.errorText}`}>
                  <FaExclamationTriangle className="mr-2 text-xs" />
                  {errors.terms}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center ${themeClasses.buttonPrimary} font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:scale-95`}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          {/* Existing Account Link */}
          <p className={`mt-6 text-center text-sm ${themeClasses.helperText}`}>
            Already have an account?{' '}
            <Link to="/login" className={`underline ${themeClasses.linkText}`}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}











// // src/components/SignupPage.jsx
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Toaster, toast } from 'react-hot-toast';
// import { FaUserAlt, FaEnvelope, FaLock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
// import baseUrl from '../api/api';
// import { useTheme } from '../src/theme/ThemeProvider'; // Import useTheme hook
// import { Moon, Sun } from 'lucide-react'; // Import Lucide icons

// export default function SignupPage() {
//   const navigate = useNavigate();
//   const { theme, toggleTheme } = useTheme(); // Use the theme context
//   const isDarkMode = theme === 'dark';

//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({}); // State for field-specific errors

//   // --- Theme-aware dynamic classes ---
//   const themeClasses = {
//     bg: isDarkMode
//       ? 'bg-gradient-to-br from-gray-900 via-gray-950 to-black'
//       : 'bg-gradient-to-br from-indigo-50 to-white',
//     headerBg: isDarkMode
//       ? 'bg-gradient-to-r from-gray-800 to-gray-900 shadow-xl'
//       : 'bg-white shadow-lg',
//     headerTitle: isDarkMode
//       ? 'text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300'
//       : 'text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4facfe] to-[#00f2fe]',
//     cardBg: isDarkMode
//       ? 'bg-gray-800/60 backdrop-blur-lg border border-gray-700/50'
//       : 'bg-white/70 backdrop-blur-lg border border-gray-200/80',
//     cardTitle: isDarkMode ? 'text-white' : 'text-gray-800',
//     inputBg: isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100',
//     inputBorder: isDarkMode ? 'border-gray-600 focus:border-blue-400' : 'border-gray-300 focus:border-blue-500',
//     inputBorderError: isDarkMode ? 'border-red-400 focus:border-red-400' : 'border-red-500 focus:border-red-500',
//     inputPlaceholder: isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500',
//     inputText: isDarkMode ? 'text-gray-100' : 'text-gray-800',
//     iconColor: isDarkMode ? 'text-gray-400' : 'text-gray-500',
//     iconColorError: isDarkMode ? 'text-red-400' : 'text-red-500',
//     checkboxBorder: isDarkMode ? 'border-gray-600' : 'border-gray-300',
//     buttonPrimary: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl',
//     linkText: isDarkMode ? 'text-blue-400 hover:text-cyan-300' : 'text-blue-600 hover:text-cyan-700',
//     helperText: isDarkMode ? 'text-gray-300' : 'text-gray-600',
//     errorText: isDarkMode ? 'text-red-400' : 'text-red-500',
//     // For the theme toggle button
//     buttonToggle: isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-md',
//   };

//   // Keep the blob animations as they are visually appealing in both modes,
//   // but we'll adjust their colors dynamically.
//   const blobColors = {
//     blob1: isDarkMode ? 'bg-indigo-600/30' : 'bg-blue-300/30',
//     blob2: isDarkMode ? 'bg-purple-600/30' : 'bg-purple-300/30',
//   };

//   // Parse backend error response
//   const parseErrorResponse = (error) => {
//     const errorData = error.response?.data;
//     const fieldErrors = {};
    
//     // Handle validation errors (400 with field-specific errors)
//     if (error.response?.status === 400 && errorData) {
//       // Handle Spring Boot validation errors format
//       if (errorData.errors && Array.isArray(errorData.errors)) {
//         errorData.errors.forEach(err => {
//           if (err.field) {
//             fieldErrors[err.field] = err.defaultMessage || err.message;
//           }
//         });
//       }
//       // Handle simple field error object format
//       else if (typeof errorData === 'object' && !errorData.message) {
//         Object.keys(errorData).forEach(field => {
//           if (typeof errorData[field] === 'string') {
//             fieldErrors[field] = errorData[field];
//           }
//         });
//       }
//       // Handle constraint violation format
//       else if (errorData.violations && Array.isArray(errorData.violations)) {
//         errorData.violations.forEach(violation => {
//           const field = violation.propertyPath || violation.field;
//           if (field) {
//             fieldErrors[field] = violation.message;
//           }
//         });
//       }
//     }
    
//     // Return general error message and field errors
//     return {
//       fieldErrors,
//       generalMessage: errorData?.message || error.message || 'An error occurred'
//     };
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!username.trim()) {
//       newErrors.username = 'Username is required';
//     }
//     if (!email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }
//     if (!password.trim()) {
//       newErrors.password = 'Password is required';
//     }
//     if (!termsAccepted) {
//       newErrors.terms = 'You must accept the Terms and Conditions';
//     }
    
//     setErrors(newErrors);
    
//     if (Object.keys(newErrors).length > 0) {
//       toast.error('Please fix the errors below');
//       return false;
//     }
    
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Clear previous errors
//     setErrors({});
    
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       await baseUrl.post('/api/auth/public/register', {
//         username: username.trim(),
//         email: email.trim(),
//         password,
//         role: ["USER"] // Add default role if needed
//       });
//       toast.success('Registration successful! Redirecting to login...');
//       setTimeout(() => navigate('/login'), 1800);
//     } catch (error) {
//       console.error('Signup error:', error);
      
//       const { fieldErrors, generalMessage } = parseErrorResponse(error);
      
//       // Set field-specific errors
//       if (Object.keys(fieldErrors).length > 0) {
//         setErrors(fieldErrors);
//         toast.error('Please fix the validation errors below');
//       } else {
//         // Handle general errors
//         let errorMessage = generalMessage;
        
//         // Handle common error cases
//         if (error.response?.status === 409 || generalMessage.includes('already exists') || generalMessage.includes('Duplicate')) {
//           errorMessage = 'Username or email already exists. Please try different credentials.';
//         } else if (error.response?.status === 500) {
//           errorMessage = 'Server error. Please try again later.';
//         } else if (error.response?.status === 422) {
//           errorMessage = 'Invalid input data. Please check your information.';
//         } else if (!error.response) {
//           errorMessage = 'Network error. Please check your connection and try again.';
//         }
        
//         toast.error(errorMessage);
//       }
//     }
//     setLoading(false);
//   };

//   // Helper function to get input classes based on error state
//   const getInputClasses = (fieldName) => {
//     const hasError = errors[fieldName];
//     const borderClass = hasError ? themeClasses.inputBorderError : themeClasses.inputBorder;
//     return `w-full pl-10 pr-4 py-3 ${themeClasses.inputBg} border ${borderClass} rounded-lg ${themeClasses.inputText} ${themeClasses.inputPlaceholder} focus:outline-none focus:ring-2 transition-colors`;
//   };

//   // Helper function to get icon classes based on error state
//   const getIconClasses = (fieldName) => {
//     const hasError = errors[fieldName];
//     return `absolute top-1/2 left-3 transform -translate-y-1/2 ${hasError ? themeClasses.iconColorError : themeClasses.iconColor}`;
//   };

//   return (
//     <div className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-500 ${themeClasses.bg}`}>
//       {/* Toast Notifications */}
//       <Toaster position="bottom-center" reverseOrder={false} />

//       {/* Header */}
//       <header className={`py-6 ${themeClasses.headerBg}`}>
//         <div className="container mx-auto px-4 flex justify-center">
//           <Link to="/" className="transform hover:scale-105 transition-transform">
//             <h1 className={themeClasses.headerTitle} style={{ fontFamily: '"Brush Script MT", cursive' }}>
//               Arth
//             </h1>
//           </Link>
//         </div>
//       </header>

//       {/* --- THEME TOGGLE BUTTON --- */}
//       <div className="fixed top-6 right-6 z-50">
//         <button
//           onClick={toggleTheme}
//           className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 ${themeClasses.buttonToggle} focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-950' : 'focus:ring-offset-white'} focus:ring-blue-500 shadow-md`}
//           aria-label="Toggle theme"
//           title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
//         >
//           {isDarkMode ? (
//             <Sun className="w-6 h-6 text-yellow-300 animate__animated animate__fadeIn animate__faster" />
//           ) : (
//             <Moon className="w-6 h-6 text-indigo-700 animate__animated animate__fadeIn animate__faster" />
//           )}
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="flex-grow flex items-center justify-center relative overflow-hidden px-4">
//         {/* Decorative Blobs */}
//         <div className={`absolute top-0 left-0 w-96 h-96 ${blobColors.blob1} rounded-full filter blur-3xl opacity-30 animate-blob`}></div>
//         <div className={`absolute bottom-0 right-0 w-96 h-96 ${blobColors.blob2} rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000`}></div>

//         {/* Glassmorphic Card */}
//         <div className={`relative z-10 w-full max-w-md ${themeClasses.cardBg} rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105 animate__animated animate__fadeInUp`}>
//           <h2 className={`text-3xl font-bold ${themeClasses.cardTitle} text-center mb-6`}>Sign Up</h2>
//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Username Field */}
//             <div className="relative">
//               <FaUserAlt className={getIconClasses('username')} />
//               <input
//                 type="text"
//                 id="username"
//                 placeholder="Username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className={getInputClasses('username')}
//                 aria-invalid={errors.username ? 'true' : 'false'}
//                 aria-describedby={errors.username ? 'username-error' : undefined}
//               />
//               {errors.username && (
//                 <div id="username-error" className={`flex items-center mt-2 text-sm ${themeClasses.errorText}`}>
//                   <FaExclamationTriangle className="mr-2 text-xs" />
//                   {errors.username}
//                 </div>
//               )}
//             </div>

//             {/* Email Field */}
//             <div className="relative">
//               <FaEnvelope className={getIconClasses('email')} />
//               <input
//                 type="email"
//                 id="email"
//                 placeholder="Email Address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className={getInputClasses('email')}
//                 aria-invalid={errors.email ? 'true' : 'false'}
//                 aria-describedby={errors.email ? 'email-error' : undefined}
//               />
//               {errors.email && (
//                 <div id="email-error" className={`flex items-center mt-2 text-sm ${themeClasses.errorText}`}>
//                   <FaExclamationTriangle className="mr-2 text-xs" />
//                   {errors.email}
//                 </div>
//               )}
//             </div>

//             {/* Password Field */}
//             <div className="relative">
//               <FaLock className={getIconClasses('password')} />
//               <input
//                 type="password"
//                 id="password"
//                 placeholder="Create a Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className={getInputClasses('password')}
//                 aria-invalid={errors.password ? 'true' : 'false'}
//                 aria-describedby={errors.password ? 'password-error' : undefined}
//               />
//               {errors.password && (
//                 <div id="password-error" className={`flex items-center mt-2 text-sm ${themeClasses.errorText}`}>
//                   <FaExclamationTriangle className="mr-2 text-xs" />
//                   {errors.password}
//                 </div>
//               )}
//             </div>

//             {/* Terms Checkbox */}
//             <div>
//               <div className="flex items-center gap-3">
//                 <input
//                   type="checkbox"
//                   id="termsAccepted"
//                   checked={termsAccepted}
//                   onChange={(e) => setTermsAccepted(e.target.checked)}
//                   className={`h-5 w-5 text-blue-500 focus:ring-blue-500 ${errors.terms ? 'border-red-500' : themeClasses.checkboxBorder} rounded bg-transparent ${isDarkMode ? 'checked:bg-blue-500 checked:border-blue-500' : 'checked:bg-blue-600 checked:border-blue-600'}`}
//                   aria-invalid={errors.terms ? 'true' : 'false'}
//                   aria-describedby={errors.terms ? 'terms-error' : undefined}
//                 />
//                 <label htmlFor="termsAccepted" className={`text-sm flex items-center ${themeClasses.helperText}`}>
//                   <FaCheckCircle className={`mr-2 ${themeClasses.iconColor}`} />
//                   I accept the{' '}
//                   <Link to="/terms" className={`underline ml-1 ${themeClasses.linkText}`}>
//                     Terms &amp; Conditions
//                   </Link>
//                 </label>
//               </div>
//               {errors.terms && (
//                 <div id="terms-error" className={`flex items-center mt-2 text-sm ${themeClasses.errorText}`}>
//                   <FaExclamationTriangle className="mr-2 text-xs" />
//                   {errors.terms}
//                 </div>
//               )}
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full flex items-center justify-center ${themeClasses.buttonPrimary} font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:scale-95`}
//             >
//               {loading ? 'Signing up...' : 'Sign Up'}
//             </button>
//           </form>

//           {/* Existing Account Link */}
//           <p className={`mt-6 text-center text-sm ${themeClasses.helperText}`}>
//             Already have an account?{' '}
//             <Link to="/login" className={`underline ${themeClasses.linkText}`}>
//               Login
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }









// // // src/components/SignupPage.jsx
// // import React, { useState } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { Toaster, toast } from 'react-hot-toast';
// // import { FaUserAlt, FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa';
// // import baseUrl from '../api/api';
// // import { useTheme } from '../src/theme/ThemeProvider'; // Import useTheme hook
// // import { Moon, Sun } from 'lucide-react'; // Import Lucide icons

// // export default function SignupPage() {
// //   const navigate = useNavigate();
// //   const { theme, toggleTheme } = useTheme(); // Use the theme context
// //   const isDarkMode = theme === 'dark';

// //   const [username, setUsername] = useState('');
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [termsAccepted, setTermsAccepted] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   // --- Theme-aware dynamic classes ---
// //   const themeClasses = {
// //     bg: isDarkMode
// //       ? 'bg-gradient-to-br from-gray-900 via-gray-950 to-black'
// //       : 'bg-gradient-to-br from-indigo-50 to-white',
// //     headerBg: isDarkMode
// //       ? 'bg-gradient-to-r from-gray-800 to-gray-900 shadow-xl'
// //       : 'bg-white shadow-lg',
// //     headerTitle: isDarkMode
// //       ? 'text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300'
// //       : 'text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4facfe] to-[#00f2fe]',
// //     cardBg: isDarkMode
// //       ? 'bg-gray-800/60 backdrop-blur-lg border border-gray-700/50'
// //       : 'bg-white/70 backdrop-blur-lg border border-gray-200/80',
// //     cardTitle: isDarkMode ? 'text-white' : 'text-gray-800',
// //     inputBg: isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100',
// //     inputBorder: isDarkMode ? 'border-gray-600 focus:border-blue-400' : 'border-gray-300 focus:border-blue-500',
// //     inputPlaceholder: isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500',
// //     inputText: isDarkMode ? 'text-gray-100' : 'text-gray-800',
// //     iconColor: isDarkMode ? 'text-gray-400' : 'text-gray-500',
// //     checkboxBorder: isDarkMode ? 'border-gray-600' : 'border-gray-300',
// //     buttonPrimary: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl',
// //     linkText: isDarkMode ? 'text-blue-400 hover:text-cyan-300' : 'text-blue-600 hover:text-cyan-700',
// //     helperText: isDarkMode ? 'text-gray-300' : 'text-gray-600',
// //     // For the theme toggle button
// //     buttonToggle: isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-md',
// //   };

// //   // Keep the blob animations as they are visually appealing in both modes,
// //   // but we'll adjust their colors dynamically.
// //   const blobColors = {
// //     blob1: isDarkMode ? 'bg-indigo-600/30' : 'bg-blue-300/30',
// //     blob2: isDarkMode ? 'bg-purple-600/30' : 'bg-purple-300/30',
// //   };

// //   const validateForm = () => {
// //     if (!username || !email || !password) {
// //       toast.error('Please fill out all required fields.');
// //       return false;
// //     }
// //     if (!termsAccepted) {
// //       toast.error('You must accept the Terms and Conditions.');
// //       return false;
// //     }
// //     return true;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!validateForm()) return;

// //     setLoading(true);
// //     try {
// //       await baseUrl.post('/api/auth/public/register', {
// //         username,
// //         email,
// //         password,
// //       });
// //       toast.success('Registration successful! Redirecting to login...');
// //       setTimeout(() => navigate('/login'), 1800);
// //     } catch (error) {
// //       const rawMessage =
// //         error.response?.data?.message || 'Signup failed. Please try again.';
// //       if (rawMessage.includes('Duplicate entry')) {
// //         toast.error('Username or email already exists.');
// //       } else if (rawMessage.includes('DataIntegrityViolationException')) {
// //         toast.error('Invalid or duplicate input. Please check your details.');
// //       } else {
// //         toast.error(rawMessage);
// //       }
// //       console.error('Signup error:', error);
// //     }
// //     setLoading(false);
// //   };

// //   return (
// //     <div className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-500 ${themeClasses.bg}`}>
// //       {/* Toast Notifications */}
// //       <Toaster position="bottom-center" reverseOrder={false} />

// //       {/* Header */}
// //       <header className={`py-6 ${themeClasses.headerBg}`}>
// //         <div className="container mx-auto px-4 flex justify-center">
// //           <Link to="/" className="transform hover:scale-105 transition-transform">
// //             <h1 className={themeClasses.headerTitle} style={{ fontFamily: '"Brush Script MT", cursive' }}>
// //               Arth
// //             </h1>
// //           </Link>
// //         </div>
// //       </header>

// //       {/* --- THEME TOGGLE BUTTON --- */}
// //       <div className="fixed top-6 right-6 z-50">
// //         <button
// //           onClick={toggleTheme}
// //           className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 ${themeClasses.buttonToggle} focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-950' : 'focus:ring-offset-white'} focus:ring-blue-500 shadow-md`}
// //           aria-label="Toggle theme"
// //           title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
// //         >
// //           {isDarkMode ? (
// //             <Sun className="w-6 h-6 text-yellow-300 animate__animated animate__fadeIn animate__faster" />
// //           ) : (
// //             <Moon className="w-6 h-6 text-indigo-700 animate__animated animate__fadeIn animate__faster" />
// //           )}
// //         </button>
// //       </div>

// //       {/* Main Content */}
// //       <div className="flex-grow flex items-center justify-center relative overflow-hidden px-4">
// //         {/* Decorative Blobs */}
// //         <div className={`absolute top-0 left-0 w-96 h-96 ${blobColors.blob1} rounded-full filter blur-3xl opacity-30 animate-blob`}></div>
// //         <div className={`absolute bottom-0 right-0 w-96 h-96 ${blobColors.blob2} rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000`}></div>

// //         {/* Glassmorphic Card */}
// //         <div className={`relative z-10 w-full max-w-md ${themeClasses.cardBg} rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105 animate__animated animate__fadeInUp`}>
// //           <h2 className={`text-3xl font-bold ${themeClasses.cardTitle} text-center mb-6`}>Sign Up</h2>
// //           <form onSubmit={handleSubmit} className="space-y-5">
// //             {/* Username Field */}
// //             <div className="relative">
// //               <FaUserAlt className={`absolute top-1/2 left-3 transform -translate-y-1/2 ${themeClasses.iconColor}`} />
// //               <input
// //                 type="text"
// //                 id="username"
// //                 placeholder="Username"
// //                 value={username}
// //                 onChange={(e) => setUsername(e.target.value)}
// //                 className={`w-full pl-10 pr-4 py-3 ${themeClasses.inputBg} border ${themeClasses.inputBorder} rounded-lg ${themeClasses.inputText} ${themeClasses.inputPlaceholder} focus:outline-none focus:ring-2 transition-colors`}
// //               />
// //             </div>

// //             {/* Email Field */}
// //             <div className="relative">
// //               <FaEnvelope className={`absolute top-1/2 left-3 transform -translate-y-1/2 ${themeClasses.iconColor}`} />
// //               <input
// //                 type="email"
// //                 id="email"
// //                 placeholder="Email Address"
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //                 className={`w-full pl-10 pr-4 py-3 ${themeClasses.inputBg} border ${themeClasses.inputBorder} rounded-lg ${themeClasses.inputText} ${themeClasses.inputPlaceholder} focus:outline-none focus:ring-2 transition-colors`}
// //               />
// //             </div>

// //             {/* Password Field */}
// //             <div className="relative">
// //               <FaLock className={`absolute top-1/2 left-3 transform -translate-y-1/2 ${themeClasses.iconColor}`} />
// //               <input
// //                 type="password"
// //                 id="password"
// //                 placeholder="Create a Password"
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //                 className={`w-full pl-10 pr-4 py-3 ${themeClasses.inputBg} border ${themeClasses.inputBorder} rounded-lg ${themeClasses.inputText} ${themeClasses.inputPlaceholder} focus:outline-none focus:ring-2 transition-colors`}
// //               />
// //             </div>

// //             {/* Terms Checkbox */}
// //             <div className="flex items-center gap-3">
// //               <input
// //                 type="checkbox"
// //                 id="termsAccepted"
// //                 checked={termsAccepted}
// //                 onChange={(e) => setTermsAccepted(e.target.checked)}
// //                 className={`h-5 w-5 text-blue-500 focus:ring-blue-500 ${themeClasses.checkboxBorder} rounded bg-transparent ${isDarkMode ? 'checked:bg-blue-500 checked:border-blue-500' : 'checked:bg-blue-600 checked:border-blue-600'}`}
// //               />
// //               <label htmlFor="termsAccepted" className={`text-sm flex items-center ${themeClasses.helperText}`}>
// //                 <FaCheckCircle className={`mr-2 ${themeClasses.iconColor}`} />
// //                 I accept the{' '}
// //                 <Link to="/terms" className={`underline ml-1 ${themeClasses.linkText}`}>
// //                   Terms &amp; Conditions
// //                 </Link>
// //               </label>
// //             </div>

// //             {/* Submit Button */}
// //             <button
// //               type="submit"
// //               disabled={loading}
// //               className={`w-full flex items-center justify-center ${themeClasses.buttonPrimary} font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:scale-95`}
// //             >
// //               {loading ? 'Signing up...' : 'Sign Up'}
// //             </button>
// //           </form>

// //           {/* Existing Account Link */}
// //           <p className={`mt-6 text-center text-sm ${themeClasses.helperText}`}>
// //             Already have an account?{' '}
// //             <Link to="/login" className={`underline ${themeClasses.linkText}`}>
// //               Login
// //             </Link>
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
