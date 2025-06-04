// NavbarWithSidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBars,
  FaTimes,
  FaHome,
  FaChartLine,
  FaTasks,
  FaPlus,
  FaComments,
  FaFileAlt,
  FaUserEdit,
  FaSignOutAlt,
} from 'react-icons/fa';

const NavbarWithSidebar = ({ heading }) => {
  // Simulated server date/time; replace with actual server time if available.
  const [serverDate, setServerDate] = useState(new Date());
  // State to control sidebar open/close
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setServerDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out shadow-lg ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h3
            className="text-2xl font-bold"
            style={{ fontFamily: '"Brush Script MT", cursive' }}
          >
            Arth
          </h3>
          <button
            onClick={closeSidebar}
            className="text-2xl text-gray-300 hover:text-white focus:outline-none transition-colors"
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* Sidebar Link Groups */}
        <nav className="mt-6">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                onClick={closeSidebar}
                className="flex items-center px-6 py-3 hover:bg-gray-700 transition-colors rounded-r-lg"
              >
                <FaHome className="mr-3 text-lg text-blue-400" />
                <span className="text-lg font-medium">Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/finance/dashboard"
                onClick={closeSidebar}
                className="flex items-center px-6 py-3 hover:bg-gray-700 transition-colors rounded-r-lg"
              >
                <FaChartLine className="mr-3 text-lg text-green-400" />
                <span className="text-lg font-medium">Finance Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/todo/dashboard"
                onClick={closeSidebar}
                className="flex items-center px-6 py-3 hover:bg-gray-700 transition-colors rounded-r-lg"
              >
                <FaTasks className="mr-3 text-lg text-yellow-400" />
                <span className="text-lg font-medium">Todo Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/finance/add"
                onClick={closeSidebar}
                className="flex items-center px-6 py-3 hover:bg-gray-700 transition-colors rounded-r-lg"
              >
                <FaPlus className="mr-3 text-lg text-green-400" />
                <span className="text-lg font-medium">Add Finance</span>
              </Link>
            </li>
            <li>
              <Link
                to="/addtask"
                onClick={closeSidebar}
                className="flex items-center px-6 py-3 hover:bg-gray-700 transition-colors rounded-r-lg"
              >
                <FaPlus className="mr-3 text-lg text-yellow-400" />
                <span className="text-lg font-medium">Add Todo</span>
              </Link>
            </li>
            <li>
              <Link
                to="/chatbot"
                onClick={closeSidebar}
                className="flex items-center px-6 py-3 hover:bg-gray-700 transition-colors rounded-r-lg"
              >
                <FaComments className="mr-3 text-lg text-indigo-400" />
                <span className="text-lg font-medium">Arth (AI Assistant)</span>
              </Link>
            </li>
            <li>
              <Link
                to="/finance/report"
                onClick={closeSidebar}
                className="flex items-center px-6 py-3 hover:bg-gray-700 transition-colors rounded-r-lg"
              >
                <FaFileAlt className="mr-3 text-lg text-purple-400" />
                <span className="text-lg font-medium">Finance Reports</span>
              </Link>
            </li>
          </ul>

          {/* Divider */}
          <div className="mt-6 border-t border-gray-700"></div>

          {/* Profile & Logout */}
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                to="/profile"
                onClick={closeSidebar}
                className="flex items-center px-6 py-3 hover:bg-gray-700 transition-colors rounded-r-lg"
              >
                <FaUserEdit className="mr-3 text-lg text-pink-400" />
                <span className="text-lg font-medium">Profile</span>
              </Link>
            </li>
            <li>
              <Link
                to="/logout"
                onClick={closeSidebar}
                className="flex items-center px-6 py-3 hover:bg-gray-700 transition-colors rounded-r-lg"
              >
                <FaSignOutAlt className="mr-3 text-lg text-red-400" />
                <span className="text-lg font-medium">Logout</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Navbar */}
      <header className="w-full bg-gradient-to-r from-slate-800 to-gray-800 text-white shadow-md fixed top-0 z-30">
        <div className="max-w-full mx-auto px-6 py-3 flex items-center justify-between">
          {/* Left: Menu Icon & Branding */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-2xl text-gray-200 hover:text-white focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <div className="ml-4">
              <Link
                to="/"
                className="text-3xl font-bold leading-none"
                style={{ fontFamily: '"Brush Script MT", cursive' }}
              >
                Arth
              </Link>
              <p className="text-xs text-gray-300 italic mt-0.5">
                Keep Your Finance & Goals On Track
              </p>
            </div>
          </div>

          {/* Center: Dynamic Heading (hidden on small screens) */}
          <div className="hidden lg:flex flex-grow justify-center px-4">
            <h1 className="text-xl font-semibold tracking-wide">{heading}</h1>
          </div>

          {/* Right: Profile, Logout, & Server Time */}
          <div className="flex items-center space-x-4">
            <Link
              to="/profile"
              className="text-gray-200 hover:text-white transition-colors"
              title="Profile"
            >
              <FaUserEdit className="text-2xl" />
            </Link>
            <Link
              to="/logout"
              className="text-gray-200 hover:text-white transition-colors"
              title="Logout"
            >
              <FaSignOutAlt className="text-2xl" />
            </Link>
            <div className="text-xs text-gray-300 whitespace-nowrap hidden md:inline-block">
              <time dateTime={serverDate.toISOString()}>
                {serverDate.toLocaleDateString()} {serverDate.toLocaleTimeString()}
              </time>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default NavbarWithSidebar;

