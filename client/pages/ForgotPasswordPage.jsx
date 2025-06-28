import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaEnvelope, FaLock, FaKey, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import baseUrl from '../api/api';
import { useTheme } from '../src/theme/ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Form states
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Step management
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Timer effect for OTP resend
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(otpTimer - 1);
      }, 1000);
    } else if (otpTimer === 0 && step === 2) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [otpTimer, step]);

  // Theme classes
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
    buttonPrimary: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl',
    buttonSecondary: isDarkMode 
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300',
    linkText: isDarkMode ? 'text-blue-400 hover:text-cyan-300' : 'text-blue-600 hover:text-cyan-700',
    helperText: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    errorText: isDarkMode ? 'text-red-400' : 'text-red-500',
    successText: isDarkMode ? 'text-green-400' : 'text-green-600',
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
      if (errorData.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach(err => {
          if (err.field) {
            fieldErrors[err.field] = err.defaultMessage || err.message;
          }
        });
        if (!Object.keys(fieldErrors).length && errorData.message) {
          generalMessage = errorData.message;
        } else if (Object.keys(fieldErrors).length > 0) {
          generalMessage = 'Please check the validation errors below.';
        }
      }
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
      else if (errorData.message) {
        generalMessage = errorData.message;
      }
    }
    
    if (error.response?.status === 404) {
      generalMessage = 'Email not found. Please check your email address.';
    } else if (error.response?.status === 400) {
      generalMessage = generalMessage.includes('Invalid') || generalMessage.includes('expired') 
        ? generalMessage 
        : 'Invalid request. Please try again.';
    } else if (!error.response) {
      generalMessage = 'Network error. Please check your connection and try again.';
    }

    return { fieldErrors, generalMessage };
  };

  const validateEmail = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please enter a valid email address.');
      return false;
    }
    
    return true;
  };

  const validateOtp = () => {
    const newErrors = {};
    
    if (!otp.trim()) {
      newErrors.otp = 'OTP is required.';
    } else if (otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits long.';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please enter a valid 6-digit OTP.');
      return false;
    }
    
    return true;
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!newPassword.trim()) {
      newErrors.newPassword = 'New password is required.';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long.';
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the password validation errors.');
      return false;
    }
    
    return true;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateEmail()) return;

    setLoading(true);
    try {
      await baseUrl.post('/api/auth/public/forgot-password', {
        email: email.trim()
      });
      
      toast.success('Password reset OTP sent to your email!');
      setStep(2);
      setOtpTimer(300); // 5 minutes timer
      setCanResend(false);
    } catch (error) {
      console.error('Forgot password error:', error);
      
      const { fieldErrors, generalMessage } = parseErrorResponse(error);
      setErrors(fieldErrors);
      toast.error(generalMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateOtp()) return;

    setOtpLoading(true);
    try {
      await baseUrl.post('/api/auth/public/verify-reset-otp', {
        email: email.trim(),
        otp: otp.trim()
      });
      
      toast.success('OTP verified! Please set your new password.');
      setStep(3);
    } catch (error) {
      console.error('OTP verification error:', error);
      
      const { fieldErrors, generalMessage } = parseErrorResponse(error);
      setErrors(fieldErrors);
      
      let toastMessage = generalMessage;
      if (fieldErrors.otp) {
        toastMessage = fieldErrors.otp;
      } else if (error.response?.status === 400) {
        toastMessage = 'Invalid or expired OTP. Please try again.';
      }
      
      toast.error(toastMessage);
    } finally {
      setOtpLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;

    setResetLoading(true);
    try {
      await baseUrl.post('/api/auth/public/reset-password', {
        email: email.trim(),
        otp: otp.trim(),
        newPassword: newPassword
      });
      
      toast.success('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1800);
    } catch (error) {
      console.error('Password reset error:', error);
      
      const { fieldErrors, generalMessage } = parseErrorResponse(error);
      setErrors(fieldErrors);
      toast.error(generalMessage);
    } finally {
      setResetLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      await baseUrl.post('/api/auth/public/forgot-password', {
        email: email.trim()
      });
      
      toast.success('OTP resent to your email!');
      setOtpTimer(300); // Reset timer
      setCanResend(false);
      setOtp(''); // Clear current OTP
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const getInputClasses = (fieldName) => {
    const hasError = errors[fieldName];
    const borderClass = hasError ? themeClasses.inputBorderError : themeClasses.inputBorder;
    return `w-full pl-10 pr-4 py-3 ${themeClasses.inputBg} border ${borderClass} rounded-lg ${themeClasses.inputText} ${themeClasses.inputPlaceholder} focus:outline-none focus:ring-2 transition-colors`;
  };

  const getIconClasses = (fieldName) => {
    const hasError = errors[fieldName];
    return `absolute top-1/2 left-3 transform -translate-y-1/2 ${hasError ? themeClasses.iconColorError : themeClasses.iconColor}`;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Forgot Password';
      case 2: return 'Verify OTP';
      case 3: return 'Reset Password';
      default: return 'Forgot Password';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return 'Enter your email address and we\'ll send you a code to reset your password.';
      case 2: return `We've sent a 6-digit verification code to ${email}`;
      case 3: return 'Enter your new password below.';
      default: return '';
    }
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

      {/* Theme Toggle Button */}
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
        <div className={`absolute top-0 left-0 w-96 h-96 ${blobColors.blob1} rounded-full filter blur-3xl opacity-30 animate-blob`}></div>
        <div className={`absolute bottom-0 right-0 w-96 h-96 ${blobColors.blob2} rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000`}></div>

        {/* Glassmorphic Card */}
        <div className={`relative z-10 w-full max-w-md ${themeClasses.cardBg} rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105`}>
          <h2 className={`text-3xl font-bold ${themeClasses.cardTitle} text-center mb-2`}>{getStepTitle()}</h2>
          <p className={`text-center text-sm ${themeClasses.helperText} mb-6`}>{getStepDescription()}</p>

          {/* Step 1: Email Input */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div className="relative">
                <FaEnvelope className={getIconClasses('email')} />
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email address"
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

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center ${themeClasses.buttonPrimary} font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:scale-95`}
              >
                {loading ? 'Sending OTP...' : 'Send Reset Code'}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="relative">
                <FaKey className={getIconClasses('otp')} />
                <input
                  type="text"
                  id="otp"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className={getInputClasses('otp')}
                  maxLength="6"
                  aria-invalid={errors.otp ? 'true' : 'false'}
                  aria-describedby={errors.otp ? 'otp-error' : undefined}
                />
                {errors.otp && (
                  <div id="otp-error" className={`flex items-center mt-2 text-sm ${themeClasses.errorText}`}>
                    <FaExclamationTriangle className="mr-2 text-xs" />
                    {errors.otp}
                  </div>
                )}
              </div>

              {/* Timer */}
              {otpTimer > 0 && (
                <div className={`text-center text-sm ${themeClasses.helperText}`}>
                  Resend OTP in {formatTime(otpTimer)}
                </div>
              )}

              <button
                type="submit"
                disabled={otpLoading}
                className={`w-full flex items-center justify-center ${themeClasses.buttonPrimary} font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:scale-95`}
              >
                {otpLoading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || resendLoading}
                className={`w-full flex items-center justify-center ${themeClasses.buttonSecondary} font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {resendLoading ? 'Resending...' : 'Resend OTP'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className={`w-full text-center text-sm ${themeClasses.linkText} hover:underline flex items-center justify-center`}
              >
                <FaArrowLeft className="mr-2" />
                Back to Email
              </button>
            </form>
          )}

          {/* Step 3: Password Reset */}
          {step === 3 && (
            <form onSubmit={handlePasswordReset} className="space-y-5">
              <div className="relative">
                <FaLock className={getIconClasses('newPassword')} />
                <input
                  type="password"
                  id="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={getInputClasses('newPassword')}
                  aria-invalid={errors.newPassword ? 'true' : 'false'}
                  aria-describedby={errors.newPassword ? 'newPassword-error' : undefined}
                />
                {errors.newPassword && (
                  <div id="newPassword-error" className={`flex items-center mt-2 text-sm ${themeClasses.errorText}`}>
                    <FaExclamationTriangle className="mr-2 text-xs" />
                    {errors.newPassword}
                  </div>
                )}
              </div>

              <div className="relative">
                <FaLock className={getIconClasses('confirmPassword')} />
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={getInputClasses('confirmPassword')}
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                  aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                />
                {errors.confirmPassword && (
                  <div id="confirmPassword-error" className={`flex items-center mt-2 text-sm ${themeClasses.errorText}`}>
                    <FaExclamationTriangle className="mr-2 text-xs" />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className={`w-full flex items-center justify-center ${themeClasses.buttonPrimary} font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:scale-95`}
              >
                {resetLoading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          )}

          {/* Login Link */}
          <p className={`mt-6 text-center text-sm ${themeClasses.helperText}`}>
            Remember your password?{' '}
            <Link to="/login" className={`underline ${themeClasses.linkText}`}>
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
