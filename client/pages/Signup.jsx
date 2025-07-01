import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { User, Mail, Lock, Key, CheckCircle, AlertTriangle, Moon, Sun } from 'lucide-react';
import baseUrl from '../api/api'; // Your real API instance (like axios)
import { useTheme } from '../src/theme/ThemeProvider'; // Use the same ThemeProvider as Login

export default function SignupPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  // OTP states
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Theme classes (same as Login)
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
    buttonSecondary: isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700',
    linkText: isDarkMode ? 'text-blue-400 hover:text-cyan-300' : 'text-blue-600 hover:text-cyan-700',
    helperText: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    errorText: isDarkMode ? 'text-red-400' : 'text-red-500',
    buttonToggle: isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-md',
  };

  // Helper for input classes
  const getInputClasses = (fieldName) => {
    const hasError = errors[fieldName];
    const borderClass = hasError ? themeClasses.inputBorderError : themeClasses.inputBorder;
    return `w-full pl-10 pr-4 py-3 ${themeClasses.inputBg} border ${borderClass} rounded-lg ${themeClasses.inputText} ${themeClasses.inputPlaceholder} focus:outline-none focus:ring-2 transition-colors`;
  };
  const getIconClasses = (fieldName) => {
    const hasError = errors[fieldName];
    return `absolute top-1/2 left-3 transform -translate-y-1/2 ${hasError ? themeClasses.iconColorError : themeClasses.iconColor}`;
  };

  // --- Validation ---
  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required.';
    else if (username.length < 3 || username.length > 20) newErrors.username = 'Username must be 3-20 characters.';
    else if (!/^[a-zA-Z0-9_]+$/.test(username)) newErrors.username = 'Only letters, numbers, underscores allowed.';
    if (!email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address.';
    else if (email.length > 100) newErrors.email = 'Email must not exceed 100 characters.';
    if (!password.trim()) newErrors.password = 'Password is required.';
    else if (password.length < 6 || password.length > 128) newErrors.password = 'Password must be 6-128 characters.';
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(password))
      newErrors.password = 'Password must have lowercase, uppercase, digit, special char.';
    if (!termsAccepted) newErrors.terms = 'You must accept the Terms and Conditions.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fill in all required fields and fix errors.');
      return false;
    }
    return true;
  };
  const validateOtp = () => {
    if (!otp.trim()) {
      setErrors({ otp: 'OTP is required.' });
      toast.error('Please enter the OTP.');
      return false;
    }
    if (otp.length !== 6) {
      setErrors({ otp: 'OTP must be 6 digits.' });
      toast.error('OTP must be 6 digits.');
      return false;
    }
    setErrors({});
    return true;
  };

  // --- API Integration ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;
    setLoading(true);
    try {
      await baseUrl.post('/api/auth/public/register', {
        username: username.trim(),
        email: email.trim(),
        password,
        role: ["USER"]
      });
      toast.success('Registration initiated! Please check your email for OTP.');
      setShowOtpStep(true);
      startResendTimer();
    } catch (error) {
      const msg = error.response?.data || error.message || 'Registration failed.';
      if (typeof msg === 'string') {
        if (msg.toLowerCase().includes('username')) setErrors({ username: msg });
        else if (msg.toLowerCase().includes('email')) setErrors({ email: msg });
        toast.error(msg);
      } else {
        toast.error('Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!validateOtp()) return;
    setOtpLoading(true);
    try {
      await baseUrl.post('/api/auth/public/verify-otp', {
        email: email.trim(),
        otp: otp.trim()
      });
      toast.success('Email verified! Registration complete.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      const msg = error.response?.data || error.message || 'OTP verification failed.';
      setErrors({ otp: msg });
      toast.error(msg);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      await baseUrl.post('/api/auth/public/resend-otp', { email: email.trim() });
      toast.success('OTP sent to your email!');
      startResendTimer();
    } catch (error) {
      const msg = error.response?.data || error.message || 'Failed to resend OTP.';
      toast.error(msg);
    } finally {
      setResendLoading(false);
    }
  };

  // --- OTP resend timer ---
  const startResendTimer = () => {
    setResendTimer(60);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // --- UI ---
  const blobColors = {
    blob1: isDarkMode ? 'bg-indigo-600/30' : 'bg-blue-300/30',
    blob2: isDarkMode ? 'bg-purple-600/30' : 'bg-purple-300/30',
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-500 ${themeClasses.bg}`}>
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
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 ${themeClasses.buttonToggle} focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-950' : 'focus:ring-offset-white'} focus:ring-blue-500 shadow-md`}
          aria-label="Toggle theme"
          title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6 text-yellow-300" />
          ) : (
            <Moon className="w-6 h-6 text-indigo-700" />
          )}
        </button>
      </div>
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center relative overflow-hidden px-4">
        {/* Decorative Blobs */}
        <div className={`absolute top-0 left-0 w-96 h-96 ${blobColors.blob1} rounded-full filter blur-3xl opacity-30 animate-pulse`}></div>
        <div className={`absolute bottom-0 right-0 w-96 h-96 ${blobColors.blob2} rounded-full filter blur-3xl opacity-30 animate-pulse`} style={{animationDelay: '2s'}}></div>
        {/* Glassmorphic Card */}
        <div className={`relative z-10 w-full max-w-md ${themeClasses.cardBg} rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105`}>
          {!showOtpStep ? (
            <>
              <h2 className={`text-3xl font-bold ${themeClasses.cardTitle} text-center mb-6`}>Sign Up</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username */}
                <div className="relative">
                  <User className={getIconClasses('username')} size={16} />
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
                      <AlertTriangle className="mr-2" size={12} />
                      {errors.username}
                    </div>
                  )}
                </div>
                {/* Email */}
                <div className="relative">
                  <Mail className={getIconClasses('email')} size={16} />
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
                      <AlertTriangle className="mr-2" size={12} />
                      {errors.email}
                    </div>
                  )}
                </div>
                {/* Password */}
                <div className="relative">
                  <Lock className={getIconClasses('password')} size={16} />
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
                      <AlertTriangle className="mr-2" size={12} />
                      {errors.password}
                    </div>
                  )}
                </div>
                {/* Terms */}
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
                      <CheckCircle className={`mr-2 ${themeClasses.iconColor}`} size={14} />
                      I accept the{' '}
                      <a href="/terms" target="_blank" rel="noopener noreferrer" className={`underline ml-1 ${themeClasses.linkText}`}>
                        Terms &amp; Conditions
                      </a>
                    </label>
                  </div>
                  {errors.terms && (
                    <div id="terms-error" className={`flex items-center mt-2 text-sm ${themeClasses.errorText}`}>
                      <AlertTriangle className="mr-2" size={12} />
                      {errors.terms}
                    </div>
                  )}
                </div>
                {/* Submit */}
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
            </>
          ) : (
            // OTP Verification
            <>
              <h2 className={`text-3xl font-bold ${themeClasses.cardTitle} text-center mb-2`}>Verify Email</h2>
              <p className={`text-center text-sm ${themeClasses.helperText} mb-6`}>
                We've sent a 6-digit code to <span className={themeClasses.linkText}>{email}</span>
              </p>
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div className="relative">
                  <Key className={getIconClasses('otp')} size={16} />
                  <input
                    type="text"
                    id="otp"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className={getInputClasses('otp')}
                    aria-invalid={errors.otp ? 'true' : 'false'}
                    aria-describedby={errors.otp ? 'otp-error' : undefined}
                    maxLength={6}
                  />
                  {errors.otp && (
                    <div id="otp-error" className={`flex items-center mt-2 text-sm ${themeClasses.errorText}`}>
                      <AlertTriangle className="mr-2" size={12} />
                      {errors.otp}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={otpLoading}
                  className={`w-full flex items-center justify-center ${themeClasses.buttonPrimary} font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:scale-95`}
                >
                  {otpLoading ? 'Verifying...' : 'Verify Email'}
                </button>
              </form>
              {/* Resend OTP */}
              <div className="mt-4 text-center">
                {resendTimer > 0 ? (
                  <p className={`text-sm ${themeClasses.helperText}`}>
                    Resend OTP in {resendTimer}s
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    disabled={resendLoading}
                    className={`text-sm ${themeClasses.linkText} hover:underline disabled:opacity-50`}
                  >
                    {resendLoading ? 'Sending...' : 'Resend OTP'}
                  </button>
                )}
              </div>
              {/* Back to Form */}
              <button
                onClick={() => {
                  setShowOtpStep(false);
                  setOtp('');
                  setErrors({});
                  setResendTimer(0);
                }}
                className={`w-full mt-4 ${themeClasses.buttonSecondary} font-semibold py-2 rounded-lg transition-all duration-300 transform hover:-translate-y-1`}
              >
                Back to Form
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


