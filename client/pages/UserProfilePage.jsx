import React from 'react';

export default function UserProfilePage() {
  // Example user data (in production, retrieve this from your backend)
  const user = {
    username: "John Doe",
    email: "johndoe@example.com",
    highestQualification: "Bachelor's Degree in Computer Science",
    hobbies: ["Reading", "Gaming", "Traveling"],
    balance: 1000.50,
    avatar: "https://via.placeholder.com/150",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xl font-semibold">Highest Qualification</h3>
            <p className="text-gray-700">{user.highestQualification}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Account Balance</h3>
            <p className="text-gray-700">${user.balance.toFixed(2)}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold">Hobbies</h3>
            <p className="text-gray-700">{user.hobbies.join(', ')}</p>
          </div>
        </div>
        <div className="mt-6 text-right">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
