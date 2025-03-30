import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [highestQualification, setHighestQualification] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [backendError, setBackendError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!username || !email || !password || !highestQualification || !hobbies) {
      setBackendError('Please fill out all fields.');
      return false;
    }
    if (!termsAccepted) {
      setBackendError('You must accept the Terms and Conditions.');
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
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          highestQualification,
          hobbies,
          termsAccepted
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setBackendError(data.message || 'Signup failed. Please try again.');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setBackendError('An unexpected error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#141E30] to-[#243B55]">
      {/* Header */}
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
          <h2 className="text-2xl font-bold text-center text-white mb-6">Sign Up</h2>
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
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#1565C0] text-white transition-colors"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#1565C0] text-white transition-colors"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#1565C0] text-white transition-colors"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="highestQualification" className="block text-gray-300 mb-2">
                Highest Qualification
              </label>
              <input
                type="text"
                id="highestQualification"
                placeholder="Your highest qualification"
                value={highestQualification}
                onChange={(e) => setHighestQualification(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#1565C0] text-white transition-colors"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="hobbies" className="block text-gray-300 mb-2">
                Hobbies (comma separated)
              </label>
              <input
                type="text"
                id="hobbies"
                placeholder="e.g., reading, gaming"
                value={hobbies}
                onChange={(e) => setHobbies(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#1565C0] text-white transition-colors"
              />
            </div>
            <div className="mb-6 flex items-center gap-2">
              <input
                type="checkbox"
                id="termsAccepted"
                className="h-4 w-4 text-[#1565C0] focus:ring-[#1565C0] border-gray-600 rounded"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label htmlFor="termsAccepted" className="text-gray-300 text-sm">
                I accept the Terms and Conditions
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1565C0] text-white p-3 rounded hover:bg-[#0D47A1] transition-colors"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-300">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#f1c40f] hover:underline transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
