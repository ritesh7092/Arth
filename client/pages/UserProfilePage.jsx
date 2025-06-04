// UserProfilePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaUserCircle,
  FaGraduationCap,
  FaMoneyBillWave,
  FaHeart,
  FaEdit,
} from 'react-icons/fa';


export default function UserProfilePage() {
  // In a real app, fetch user data from your backend
  const user = {
    username: "John Doe",
    email: "johndoe@example.com",
    highestQualification: "Bachelor's Degree in Computer Science",
    hobbies: ["Reading", "Gaming", "Traveling"],
    balance: 1000.5,
    avatar: "https://via.placeholder.com/150",
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a192f] to-[#020c1b]">

      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#3b82f680] rounded-full filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#9333ea80] rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 relative">
        <div className="relative z-10 w-full max-w-2xl bg-[rgba(255,255,255,0.05)] backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105">
          {/* Avatar & Basic Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-6 mb-8">
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-[#4facfe]"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-4xl font-bold text-white flex items-center justify-center sm:justify-start">
                <FaUserCircle className="mr-2 text-[#4facfe]" />
                {user.username}
              </h2>
              <p className="mt-2 text-gray-300">{user.email}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
            {/* Qualification */}
            <div className="space-y-3 p-4 bg-[rgba(255,255,255,0.1)] rounded-lg">
              <h3 className="text-2xl font-semibold flex items-center">
                <FaGraduationCap className="mr-3 text-[#10b981] text-2xl" />
                Highest Qualification
              </h3>
              <p className="text-gray-300">{user.highestQualification}</p>
            </div>

            {/* Balance */}
            <div className="space-y-3 p-4 bg-[rgba(255,255,255,0.1)] rounded-lg">
              <h3 className="text-2xl font-semibold flex items-center">
                <FaMoneyBillWave className="mr-3 text-[#f59e0b] text-2xl" />
                Account Balance
              </h3>
              <p className="text-gray-300">₹{user.balance.toFixed(2)}</p>
            </div>

            {/* Hobbies (spans two columns on md+) */}
            <div className="md:col-span-2 space-y-3 p-4 bg-[rgba(255,255,255,0.1)] rounded-lg">
              <h3 className="text-2xl font-semibold flex items-center">
                <FaHeart className="mr-3 text-[#f43f5e] text-2xl" />
                Hobbies
              </h3>
              <p className="text-gray-300">{user.hobbies.join(', ')}</p>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="mt-10 text-right">
            <Link to="/edit-profile">
              <button className="inline-flex items-center bg-gradient-to-r from-[#4facfe] to-[#00f2fe] hover:from-[#3b82f6] hover:to-[#0ea5e9] text-white font-semibold py-3 px-7 rounded-xl shadow-xl transition-all transform hover:scale-105">
                <FaEdit className="mr-2 text-lg" />
                Edit Profile
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

