import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import baseUrl from '../api/api'; 


export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [backendError, setBackendError] = useState('');
  const [loading, setLoading] = useState(false);
  const reset = () => {
    setUsername('');
    setPassword('');
  };

  const validateForm = () => {
    if (!username || !password) {
      // setBackendError('Please fill out all fields.');
      toast.error('Please fill out all fields.');
      return false;
    }
    return true;
  };


  const handleSubmit = async (e) => {
  e.preventDefault();
  setBackendError('');
  if (!validateForm()) return;

  setLoading(true);
  try {
    const response = await baseUrl.post('/api/auth/public/login', {
      username,
      password,
    });

    const data = response.data;
    localStorage.setItem('authToken', data.token);
    // console.log('Login successful:', data);
    // console.log('User:', data.user);

    reset();
    toast.success('Login successful!');
    // setTimeout(() => , 2000); // Optional
    setTimeout(() => {
      navigate('/todo/dashboard');
    }, 2000); // Optional
  } catch (error) {
    const message =
      error.response?.data?.message || 'An unexpected error occurred. Please try again.';
      console.error('Login error:', error);
    toast.error(message);
  }
  setLoading(false);
};


  

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#141E30] to-[#243B55]">
      {/* Header */}
      <Toaster position="bottom-center" reverseOrder={false} />
      <header className="py-4 bg-gradient-to-r from-[#34495e] to-[#2c3e50] shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <Link to="/" className="cursor-pointer">
            <h1
              className="text-3xl font-bold text-white transition-transform transform hover:scale-110"
              style={{ fontFamily: '"Brush Script MT", cursive' }}
            >
              Arth
            </h1>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-xl shadow-2xl border border-gray-700 bg-gray-800 transform transition-all duration-300 hover:scale-105">
          <h2 className="text-2xl font-bold text-center text-white mb-6">Login</h2>
          {backendError && (
            <p className="mb-4 text-center text-red-500">{backendError}</p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#1565C0] text-white transition-colors"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#1565C0] text-white transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1565C0] text-white p-3 rounded hover:bg-[#0D47A1] transition-colors"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-300">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#f1c40f] hover:underline transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
