// EditUserProfilePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaGraduationCap, FaHeart, FaSave, FaCamera } from 'react-icons/fa';

export default function EditUserProfilePage() {
  // In production, load the user profile from your API
  const initialData = {
    username: "John Doe",
    email: "johndoe@example.com",
    highestQualification: "Bachelor's Degree in Computer Science",
    hobbies: "Reading, Gaming, Traveling",
    avatar: "https://via.placeholder.com/150",
  };

  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.username || !formData.email || !formData.highestQualification || !formData.hobbies) {
      setError('Please fill out all required fields.');
      return;
    }
    try {
      // Simulate API call to update profile...
      // await api.updateProfile(formData);
      navigate('/profile');
    } catch {
      setError('An error occurred while updating your profile.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a192f] to-[#020c1b]">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#3b82f680] rounded-full filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#9333ea80] rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-10 relative">
        <div className="relative z-10 w-full max-w-2xl bg-[rgba(255,255,255,0.05)] backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105">
          <h2 className="text-3xl font-bold text-white text-center mb-6">Edit Profile</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={formData.avatar}
                  alt="User Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#4facfe]"
                />
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-[#4facfe] p-2 rounded-full shadow-lg hover:bg-[#3b82f6] transition-colors"
                >
                  <FaCamera className="text-white" />
                </button>
              </div>
              <p className="mt-2 text-gray-300">Click camera to change avatar</p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
              <div>
                <label className="block text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#1f2937] border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4facfe] transition-colors"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#1f2937] border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4facfe] transition-colors"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Highest Qualification</label>
                <input
                  type="text"
                  name="highestQualification"
                  value={formData.highestQualification}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#1f2937] border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4facfe] transition-colors"
                  placeholder="e.g. Bachelor's Degree"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Hobbies</label>
                <input
                  type="text"
                  name="hobbies"
                  value={formData.hobbies}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#1f2937] border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4facfe] transition-colors"
                  placeholder="Comma-separated"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="inline-flex items-center bg-gradient-to-r from-[#4facfe] to-[#00f2fe] hover:from-[#3b82f6] hover:to-[#0ea5e9] text-white font-semibold py-3 px-7 rounded-xl shadow-xl transition-all transform hover:scale-105"
              >
                <FaSave className="mr-2 text-lg" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
