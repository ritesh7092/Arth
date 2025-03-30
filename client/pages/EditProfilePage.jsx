import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditUserProfilePage() {
  // In production, load the user profile from an API
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
    // Validate required fields (further validation may be added)
    if (!formData.username || !formData.email || !formData.highestQualification || !formData.hobbies) {
      setError('Please fill out all required fields.');
      return;
    }
    try {
      // Simulate API call to update the profile.
      // const response = await fetch('/api/update-profile', { ... });
      // if (!response.ok) {
      //   const data = await response.json();
      //   setError(data.message || 'Profile update failed.');
      //   return;
      // }
      // On success, redirect back to the profile page
      navigate('/profile');
    } catch (err) {
      setError('An error occurred while updating your profile.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#141E30] to-[#243B55] p-6">
      {/* Content Container */}
      <div className="flex items-center justify-center flex-grow">
        <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Edit Profile</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center">
              <img
                src={formData.avatar}
                alt="User Avatar"
                className="w-28 h-28 rounded-full object-cover border-4 border-[#5D9CEC] mb-4"
              />
              {/* Optionally, add image upload functionality here */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#1565C0] text-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#1565C0] text-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Highest Qualification</label>
                <input
                  type="text"
                  name="highestQualification"
                  value={formData.highestQualification}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#1565C0] text-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Hobbies</label>
                <input
                  type="text"
                  name="hobbies"
                  value={formData.hobbies}
                  onChange={handleChange}
                  placeholder="Comma separated"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#1565C0] text-white transition-colors"
                />
              </div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-[#1565C0] hover:bg-[#0D47A1] text-white py-3 px-8 rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
