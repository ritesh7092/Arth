import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBars, FaTimes, FaHome, FaChartLine, 
  FaTasks, FaPlus, FaComments, FaFileAlt,
  FaUserEdit, FaSignOutAlt
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

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black opacity-50 z-40 transition-opacity duration-300 ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h3 className="text-xl font-bold" style={{ fontFamily: '"Brush Script MT", cursive' }}>
            Arth
          </h3>
          <button onClick={closeSidebar} className="text-2xl focus:outline-none hover:text-gray-300 transition-colors">
            <FaTimes />
          </button>
        </div>
        <ul className="mt-4 space-y-1">
          <li className="px-4 py-2 hover:bg-gray-700 transition-colors">
            <Link to="/" onClick={closeSidebar} className="flex items-center">
              <FaHome className="mr-2" /> Home
            </Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700 transition-colors">
            <Link to="/finance/dashboard" onClick={closeSidebar} className="flex items-center">
              <FaChartLine className="mr-2" /> Finance Dashboard
            </Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700 transition-colors">
            <Link to="/todo/dashboard" onClick={closeSidebar} className="flex items-center">
              <FaTasks className="mr-2" /> Todo Dashboard
            </Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700 transition-colors">
            <Link to="/finance/add" onClick={closeSidebar} className="flex items-center">
              <FaPlus className="mr-2" /> Add Finance
            </Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700 transition-colors">
            <Link to="/addtask" onClick={closeSidebar} className="flex items-center">
              <FaPlus className="mr-2" /> Add Todo
            </Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700 transition-colors">
            <Link to="/chatbot" onClick={closeSidebar} className="flex items-center">
              <FaComments className="mr-2" /> Arth (AI Assistant)
            </Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700 transition-colors">
            <Link to="/finance/report" onClick={closeSidebar} className="flex items-center">
              <FaFileAlt className="mr-2" /> Finance Reports
            </Link>
          </li>
          {/* Profile and Logout in Sidebar */}
          <li className="px-4 py-2 hover:bg-gray-700 transition-colors">
            <Link to="/profile" onClick={closeSidebar} className="flex items-center">
              <FaUserEdit className="mr-2" /> Profile
            </Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700 transition-colors">
            <Link to="/logout" onClick={closeSidebar} className="flex items-center">
              <FaSignOutAlt className="mr-2" /> Logout
            </Link>
          </li>
        </ul>
      </div>

      {/* Navbar */}
      <nav className="w-full bg-gradient-to-r from-slate-800 to-gray-800 text-white shadow-md">
        <div className="max-w-full mx-auto px-6 py-3 flex items-center justify-between">
          {/* Left: Menu Icon and Branding */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-2xl focus:outline-none hover:text-gray-300 transition-colors"
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <div className="ml-4">
              <Link to="/" className="text-3xl font-bold" style={{ fontFamily: '"Brush Script MT", cursive' }}>
                Arth
              </Link>
              <p className="text-sm italic">Keep Your Finance and Goals On Track</p>
            </div>
          </div>

          {/* Center: Dynamic Heading */}
          <div className="hidden md:flex flex-grow justify-center">
            <h1 className="text-xl font-semibold">{heading}</h1>
          </div>

          {/* Right: Profile, Logout, and Server Date/Time */}
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="hover:text-gray-300 transition-colors">
              <FaUserEdit className="text-2xl" />
            </Link>
            <Link to="/logout" className="hover:text-gray-300 transition-colors">
              <FaSignOutAlt className="text-2xl" />
            </Link>
            <span className="text-sm whitespace-nowrap hidden sm:inline-block">
              {serverDate.toLocaleDateString()} {serverDate.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavbarWithSidebar;
