// LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaUserAlt, FaLock, FaArrowRight } from 'react-icons/fa';
import baseUrl from '../api/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a192f] to-[#020c1b]">
      {/* Toast Notifications */}
      <Toaster position="bottom-center" reverseOrder={false} />

      {/* Header */}
      <header className="py-6 bg-gradient-to-r from-[#1f2a40] to-[#16202e] shadow-xl">
        <div className="container mx-auto px-4 flex justify-center">
          <Link to="/" className="transform hover:scale-105 transition-transform">
            <h1
              className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4facfe] to-[#00f2fe]"
              style={{ fontFamily: '"Brush Script MT", cursive' }}
            >
              Arth
            </h1>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center relative overflow-hidden px-4">
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#3b82f680] rounded-full filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#9333ea80] rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        {/* Glassmorphic Card */}
        <div className="relative z-10 w-full max-w-md bg-[rgba(255,255,255,0.05)] backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105">
          <h2 className="text-3xl font-bold text-white text-center mb-6">Log In</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="relative">
              <FaUserAlt className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1f2937] border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition-colors"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1f2937] border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4facfe] focus:border-transparent transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-gradient-to-r from-[#4facfe] to-[#00f2fe] hover:from-[#3b82f6] hover:to-[#0ea5e9] text-white font-semibold py-3 rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
              {!loading && <FaArrowRight className="ml-2 animate-bounce" />}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-gray-300 text-sm">
            Don’t have an account?{' '}
            <Link
              to="/signup"
              className="text-[#4facfe] hover:text-[#00f2fe] underline transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

