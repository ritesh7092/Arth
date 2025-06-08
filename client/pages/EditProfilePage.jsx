/* eslint-disable react/no-unescaped-entities */ // This disables ESLint warning for apostrophes in JSX

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaGraduationCap, FaHeart, FaSave, FaCamera } from 'react-icons/fa';
import { Moon, Sun } from 'lucide-react'; // Make sure lucide-react is installed
import { useTheme } from '../src/theme/ThemeProvider'; // Adjust path if ThemeProvider is elsewhere

export default function EditUserProfilePage() {
  const { theme, toggleTheme } = useTheme(); // Access theme context
  const isDarkMode = theme === 'dark';
  const navigate = useNavigate();

  // In a production app, you would load this data from your API
  const initialData = {
    username: "John Doe",
    email: "johndoe@example.com",
    highestQualification: "Bachelor's Degree in Computer Science",
    hobbies: "Reading, Gaming, Traveling",
    avatar: "https://via.placeholder.com/150", // Placeholder default avatar
  };

  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false); // State to manage save button loading

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]; // Safely access the first file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSaving(true); // Start loading state

    // Basic validation
    if (!formData.username || !formData.email || !formData.highestQualification || !formData.hobbies) {
      setError('Please fill out all required fields.');
      setIsSaving(false); // Stop loading state
      return;
    }

    try {
      // Simulate API call to update profile
      console.log('Attempting to update profile with:', formData);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency
      // In a real application, you would make an actual API call here:
      // await api.updateProfile(formData);
      navigate('/profile'); // Redirect to profile page on success
    } catch (err) {
      setError('An error occurred while updating your profile. Please try again.');
      console.error("Profile update failed:", err);
    } finally {
      setIsSaving(false); // Always stop loading state
    }
  };

  // Dynamic Tailwind CSS classes for theme adaptation
  const themeClasses = {
    bg: isDarkMode
      ? 'bg-gradient-to-br from-gray-900 via-gray-950 to-black'
      : 'bg-gradient-to-br from-indigo-50 to-white',
    cardBg: isDarkMode
      ? 'bg-gray-800/60 backdrop-blur-lg border border-gray-700/50'
      : 'bg-white/70 backdrop-blur-lg border border-gray-200/80',
    inputBg: isDarkMode
      ? 'bg-[#1f2937] border-gray-600 text-gray-100 placeholder-gray-500'
      : 'bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-400',
    inputFocusRing: isDarkMode
      ? 'focus:ring-[#4facfe]'
      : 'focus:ring-indigo-500',
    text: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    headingText: isDarkMode ? 'text-white' : 'text-gray-900',
    errorText: 'text-red-400', // Consistent error text color
    buttonToggle: isDarkMode
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 shadow-lg'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-lg',
    blob1: isDarkMode ? 'bg-blue-600/30' : 'bg-blue-300/30',
    blob2: isDarkMode ? 'bg-purple-600/30' : 'bg-purple-300/30',
  };

  return (
    <>
      {/* Inline CSS for animations to make it a complete working example */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 8s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>

      <div className={`min-h-screen flex flex-col relative overflow-hidden ${themeClasses.bg} transition-colors duration-500`}>
        {/* Theme Toggle Button: Perfectly Circular Shape & Smaller Size */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={toggleTheme}
            // w-10 h-10 for smaller size, rounded-full for perfect circular shape
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 ${themeClasses.buttonToggle} focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-950' : 'focus:ring-offset-white'} focus:ring-blue-500 shadow-md`}
            aria-label="Toggle theme"
            title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-300 animate__animated animate__fadeIn animate__faster" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-700 animate__animated animate__fadeIn animate__faster" />
            )}
          </button>
        </div>

        {/* Decorative Blobs (Slightly Smaller) */}
        <div className={`absolute top-0 left-0 w-72 h-72 ${themeClasses.blob1} rounded-full filter blur-3xl opacity-20 animate-blob`}></div>
        <div className={`absolute bottom-0 right-0 w-72 h-72 ${themeClasses.blob2} rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000`}></div>

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center px-4 py-10 relative">
          <div className={`relative z-10 w-full max-w-2xl ${themeClasses.cardBg} rounded-3xl shadow-2xl p-8 md:p-12 transform transition-all duration-500 hover:scale-[1.01] animate-fadeInUp`}>
            <h2 className={`text-3xl md:text-4xl font-extrabold ${themeClasses.headingText} text-center mb-8`}>
              Edit Your Profile
            </h2>
            {error && (
              <p className={`text-center mb-6 px-4 py-3 rounded-lg ${themeClasses.errorText} bg-red-900/20 border border-red-700/50`}>
                {error}
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Avatar Upload Section */}
              <div className="flex flex-col items-center group relative">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#4facfe] shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/50">
                  <img
                    src={formData.avatar}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                  {/* Hidden file input for avatar selection */}
                  <input
                    type="file"
                    id="avatarUpload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                  {/* Overlay label for avatar change */}
                  <label
                    htmlFor="avatarUpload"
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    title="Change avatar"
                  >
                    <FaCamera className="text-white text-2xl" />
                  </label>
                </div>
                <p className={`mt-4 text-sm ${themeClasses.text}`}>Click to change avatar</p>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="username" className={`block ${themeClasses.text} text-sm font-medium mb-2`}>
                    <FaUserCircle className="inline-block mr-2 text-xl align-middle text-[#4facfe]" /> Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full p-2.5 rounded-md border ${themeClasses.inputBg} ${themeClasses.inputFocusRing} transition-colors duration-200 shadow-inner text-sm`}
                    placeholder="Enter your username"
                  />
                </div>
                <div>
                  <label htmlFor="email" className={`block ${themeClasses.text} text-sm font-medium mb-2`}>
                    <FaUserCircle className="inline-block mr-2 text-xl align-middle text-[#00f2fe]" /> Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-2.5 rounded-md border ${themeClasses.inputBg} ${themeClasses.inputFocusRing} transition-colors duration-200 shadow-inner text-sm`}
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label htmlFor="qualification" className={`block ${themeClasses.text} text-sm font-medium mb-2`}>
                    <FaGraduationCap className="inline-block mr-2 text-xl align-middle text-[#10b981]" /> Highest Qualification
                  </label>
                  <input
                    type="text"
                    id="qualification"
                    name="highestQualification"
                    value={formData.highestQualification}
                    onChange={handleChange}
                    className={`w-full p-2.5 rounded-md border ${themeClasses.inputBg} ${themeClasses.inputFocusRing} transition-colors duration-200 shadow-inner text-sm`}
                    placeholder="e.g. Bachelor's Degree in CS"
                  />
                </div>
                <div>
                  <label htmlFor="hobbies" className={`block ${themeClasses.text} text-sm font-medium mb-2`}>
                    <FaHeart className="inline-block mr-2 text-xl align-middle text-[#f59e0b]" /> Hobbies
                  </label>
                  <input
                    type="text"
                    id="hobbies"
                    name="hobbies"
                    value={formData.hobbies}
                    onChange={handleChange}
                    className={`w-full p-2.5 rounded-md border ${themeClasses.inputBg} ${themeClasses.inputFocusRing} transition-colors duration-200 shadow-inner text-sm`}
                    placeholder="e.g. Reading, Gaming, Traveling"
                  />
                </div>
              </div>

              {/* Submit Button with Loading State */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={isSaving} // Disable button when saving
                  className="inline-flex items-center justify-center min-w-[160px] bg-gradient-to-r from-[#4facfe] to-[#00f2fe] hover:from-[#3b82f6] hover:to-[#0ea5e9] text-white font-semibold py-2.5 px-6 rounded-md shadow-xl transition-all transform hover:scale-105 hover:shadow-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group text-sm md:text-base"
                >
                  {isSaving ? (
                    // Spinner icon for loading state
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <FaSave className="mr-2 text-lg" />
                  )}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}