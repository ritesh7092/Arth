import React from 'react';
import { Link } from 'react-router-dom';

export default function UserProfilePage() {
  // In production, retrieve user data from your backend
  const user = {
    username: "John Doe",
    email: "johndoe@example.com",
    highestQualification: "Bachelor's Degree in Computer Science",
    hobbies: ["Reading", "Gaming", "Traveling"],
    balance: 1000.50,
    avatar: "https://via.placeholder.com/150",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141E30] to-[#243B55] p-6">
      {/* Content Container */}
      <div className="flex items-center justify-center flex-grow">
        <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
          <div className="flex items-center space-x-6 mb-8">
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-[#5D9CEC]"
            />
            <div>
              <h2 className="text-3xl font-bold text-white">{user.username}</h2>
              <p className="text-gray-300">{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-white">Highest Qualification</h3>
              <p className="text-gray-300">{user.highestQualification}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Account Balance</h3>
              <p className="text-gray-300">${user.balance.toFixed(2)}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold text-white">Hobbies</h3>
              <p className="text-gray-300">{user.hobbies.join(', ')}</p>
            </div>
          </div>
          <div className="mt-8 text-right">
            <Link to="/edit-profile">
              <button className="bg-[#5D9CEC] hover:bg-[#4267B2] transition-colors text-white py-3 px-6 rounded-lg">
                Edit Profile
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
