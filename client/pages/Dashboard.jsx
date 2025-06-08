// UserProfilePage.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaGraduationCap,
  FaMoneyBillWave,
  FaStar,
  FaChartLine,
  FaTasks,
  FaRobot,
  FaBell,
  FaCog,
  FaChevronDown,
  FaChevronRight,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaEdit,
} from "react-icons/fa";
import { Sun, Moon } from 'lucide-react';

// Import the theme hook (assuming you have this from Home.jsx)
import { useTheme } from "../src/theme/ThemeProvider";

export default function UserProfilePage() {
  // Use theme provider instead of local state
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Dummy data (replace with real API/context)
  const user = {
    username: "John Doe",
    email: "johndoe@example.com",
    highestQualification: "Bachelor's in Computer Science",
    hobbies: ["Reading", "Gaming", "Traveling"],
    balance: 1000.5,
    avatar: "https://via.placeholder.com/150",
    notifications: 3,
  };

  const location = useLocation();
  const currentPath = location.pathname;

  // State for collapsible menus
  const [financeOpen, setFinanceOpen] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Ref to the mobile-sidebar wrapper
  const sidebarRef = useRef(null);
  // Ref to the hamburger button (so we can restore focus when sidebar closes)
  const hamburgerRef = useRef(null);

  // Toggle inert on the sidebar wrapper whenever sidebarOpen changes
  useEffect(() => {
    if (!sidebarRef.current) return;

    if (sidebarOpen) {
      // When opening: remove inert, make all children focusable again
      sidebarRef.current.removeAttribute("inert");
    } else {
      // When closing: add inert so subtree is hidden from AT and unfocusable
      sidebarRef.current.setAttribute("inert", "");
      // If any element inside the sidebar had focus, move focus back to the hamburger
      if (hamburgerRef.current) {
        hamburgerRef.current.focus();
      }
    }
  }, [sidebarOpen]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // or clear() if you want to remove all
    window.location.href = "/"; // or use navigate("/") if using react-router
  };

  // Close sidebar when clicking outside or pressing Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target) && !hamburgerRef.current?.contains(e.target)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  // Memoized navigation items to prevent unnecessary re-renders
  const navigationItems = React.useMemo(() => [
    {
      id: 'dashboard',
      path: '/dashboard',
      icon: FaUserCircle,
      label: 'Dashboard/Profile',
      isActive: currentPath === '/dashboard'
    },
    {
      id: 'edit-profile',
      path: '/edit-profile',
      icon: FaEdit,
      label: 'Edit Profile',
      isActive: currentPath === '/edit-profile'
    },
    {
      id: 'chatbot',
      path: '/chatbot',
      icon: FaRobot,
      label: 'Chatbot',
      isActive: currentPath === '/chatbot'
    }
  ], [currentPath]);

  const financeItems = React.useMemo(() => [
    { path: '/finance/dashboard', label: 'Dashboard', isActive: currentPath === '/finance/dashboard' },
    { path: '/finance/add', label: 'Add Finance', isActive: currentPath === '/finance/add' },
    { path: '/finance/report', label: 'Reports', isActive: currentPath === '/finance/report' }
  ], [currentPath]);

  const taskItems = React.useMemo(() => [
    { path: '/todo/dashboard', label: 'Dashboard', isActive: currentPath === '/todo/dashboard' },
    { path: '/addtask', label: 'Add Task', isActive: currentPath === '/addtask' }
  ], [currentPath]);

  // Memoized sidebar content to prevent unnecessary re-renders
  const SidebarContent = React.memo(({ isMobile = false }) => (
    <>
      <div
        className={`px-4 py-4 sm:px-6 sm:py-5 border-b flex items-center ${isMobile ? 'justify-between' : ''} ${
          isDarkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <div className="flex items-center">
          <FaCog className="text-2xl text-teal-400" />
          <Link
            to="/"
            className={`ml-2 text-lg sm:text-xl md:text-2xl font-bold tracking-tight truncate ${
              isDarkMode ? "text-gray-100" : "text-gray-800"
            }`}
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            MyArth
          </Link>
        </div>
        {isMobile && (
          <button
            className={`text-xl ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        )}
      </div>

      <div
        className={`px-4 py-4 sm:px-6 sm:py-5 border-b flex items-center space-x-3 ${
          isDarkMode ? "border-gray-800 bg-gray-800" : "border-gray-200 bg-gray-100"
        }`}
      >
        <img
          src={user.avatar}
          alt="Avatar"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-teal-400 object-cover"
        />
        <div className="overflow-hidden min-w-0">
          <span
            className={`block text-xs sm:text-sm font-medium truncate ${
              isDarkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {user.username}
          </span>
          <span
            className={`block text-[10px] sm:text-xs truncate ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {user.email}
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6">
        <ul className="space-y-4">
          {/* Regular Navigation Items */}
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={`flex items-center px-3 py-2 sm:px-4 sm:py-2.5 rounded-md transition-colors duration-200 ${
                    item.isActive
                      ? "bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white shadow-lg"
                      : isDarkMode
                      ? "text-gray-200 hover:bg-gray-800 hover:text-gray-100"
                      : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  <IconComponent className="mr-2 sm:mr-3 text-lg text-teal-300" />
                  <span className="text-sm sm:text-base">{item.label}</span>
                  {item.id === 'chatbot' && (
                    <FaChevronRight className="text-sm opacity-50 ml-auto" />
                  )}
                </Link>
              </li>
            );
          })}

          {/* Finance Group */}
          <li>
            <button
              onClick={() => setFinanceOpen((prev) => !prev)}
              className={`flex items-center w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-md transition-colors duration-200 ${
                financeOpen
                  ? isDarkMode
                    ? "bg-gray-800 text-gray-100 shadow-inner"
                    : "bg-gray-200 text-gray-900 shadow-inner"
                  : isDarkMode
                  ? "text-gray-200 hover:bg-gray-800"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaChartLine className="mr-2 sm:mr-3 text-lg text-teal-300" />
              <span className="flex-grow text-sm sm:text-base">Finance</span>
              {financeOpen ? (
                <FaChevronDown className="text-sm opacity-75" />
              ) : (
                <FaChevronRight className="text-sm opacity-50" />
              )}
            </button>
            {financeOpen && (
              <ul className="mt-2 ml-6 sm:ml-8 space-y-2">
                {financeItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => isMobile && setSidebarOpen(false)}
                      className={`flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm ${
                        item.isActive
                          ? isDarkMode
                            ? "bg-gray-700 text-gray-100"
                            : "bg-gray-300 text-gray-900"
                          : isDarkMode
                          ? "text-gray-200 hover:bg-gray-800"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Tasks Group */}
          <li>
            <button
              onClick={() => setTasksOpen((prev) => !prev)}
              className={`flex items-center w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-md transition-colors duration-200 ${
                tasksOpen
                  ? isDarkMode
                    ? "bg-gray-800 text-gray-100 shadow-inner"
                    : "bg-gray-200 text-gray-900 shadow-inner"
                  : isDarkMode
                  ? "text-gray-200 hover:bg-gray-800"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaTasks className="mr-2 sm:mr-3 text-lg text-teal-300" />
              <span className="flex-grow text-sm sm:text-base">Tasks</span>
              {tasksOpen ? (
                <FaChevronDown className="text-sm opacity-75" />
              ) : (
                <FaChevronRight className="text-sm opacity-50" />
              )}
            </button>
            {tasksOpen && (
              <ul className="mt-2 ml-6 sm:ml-8 space-y-2">
                {taskItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => isMobile && setSidebarOpen(false)}
                      className={`flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm ${
                        item.isActive
                          ? isDarkMode
                            ? "bg-gray-700 text-gray-100"
                            : "bg-gray-300 text-gray-900"
                          : isDarkMode
                          ? "text-gray-200 hover:bg-gray-800"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>

      <div
        className={`px-4 py-4 sm:px-6 sm:py-6 border-t ${
          isDarkMode ? "border-gray-800 bg-gray-800" : "border-gray-200 bg-gray-100"
        }`}
      >
        <Link
          to="/settings"
          onClick={() => isMobile && setSidebarOpen(false)}
          className={`flex items-center px-3 py-2 sm:px-4 sm:py-2.5 rounded-md transition-colors duration-200 ${
            isDarkMode
              ? "text-gray-300 hover:text-gray-100 hover:bg-gray-700"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
          }`}
        >
          <FaCog className="mr-2 sm:mr-3 text-lg text-teal-300" />
          <span className="text-sm sm:text-base">Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className="mt-3 w-full inline-flex justify-center items-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md shadow transition-transform duration-200 hover:scale-105 text-sm sm:text-base"
        >
          <FaSignOutAlt className="mr-2 text-lg" /> Logout
        </button>
      </div>
    </>
  ));

  return (
    <div
      className={`flex flex-col min-h-screen font-sans overflow-x-hidden ${
        isDarkMode
          ? "bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-b from-gray-100 to-gray-200 text-gray-800"
      }`}
    >
      <div className="flex flex-1">
        {/* ========================= */}
        {/* Mobile Sidebar Drawer  */}
        {/* ========================= */}
        <div
          ref={sidebarRef}
          className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          inert={!sidebarOpen ? "" : undefined}
        >
          {/* semi-transparent backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-60"
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className={`relative w-64 flex flex-col shadow-xl h-full ${
              isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
            }`}
          >
            <SidebarContent isMobile={true} />
          </aside>
        </div>

        {/* ========================= */}
        {/* Static Sidebar (md+)   */}
        {/* ========================= */}
        <aside
          className={`hidden md:flex md:w-72 lg:w-64 flex-col shadow-xl ${
            isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
          }`}
        >
          <SidebarContent />
        </aside>

        {/* ========================= */}
        {/* Main Content       */}
        {/* ========================= */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar (Navbar) */}
          <header
            className={`sticky top-0 z-30 border-b px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3 md:py-4 flex flex-wrap justify-between items-center shadow-lg ${
              isDarkMode
                ? "bg-gradient-to-r from-purple-600 to-pink-600 border-pink-700"
                : "bg-gradient-to-r from-purple-300 to-pink-300 border-pink-400"
            }`}
          >
            {/* Left: Hamburger + Title */}
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-auto">
              <button
                id="openSidebarButton"
                ref={hamburgerRef}
                className={`md:hidden text-xl sm:text-2xl ${
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                }`}
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <FaBars />
              </button>
              <h2
                className={`text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl font-semibold truncate ${
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                Dashboard / Profile
              </h2>
            </div>

            {/* Right: Icons + Dark/Light Mode Toggle */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mt-2 sm:mt-0">
              <button
                onClick={toggleTheme}
                className={`text-lg sm:text-xl md:text-2xl hover:text-gray-200 transition-colors duration-200 ${
                  isDarkMode ? "text-yellow-300" : "text-gray-700"
                }`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="relative group">
                <FaBell
                  className={`text-lg sm:text-xl md:text-2xl transition-colors duration-200 ${
                    isDarkMode ? "text-gray-100 hover:text-gray-200" : "text-gray-700 hover:text-gray-900"
                  }`}
                />
                {user.notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2 ring-2 ring-gray-900" />
                )}
                <div
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-1 w-max text-[10px] sm:text-xs md:text-sm px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    isDarkMode ? "bg-gray-800 text-gray-100" : "bg-gray-200 text-gray-800"
                  }`}
                >
                  Notifications
                </div>
              </button>
              <FaUserCircle
                className={`text-lg sm:text-xl md:text-2xl ${
                  isDarkMode ? "text-gray-100" : "text-gray-700"
                }`}
              />
            </div>
          </header>

          {/* Main Scrollable Area */}
          <main
            className={`flex-1 overflow-auto py-4 ${
              isDarkMode
                ? "bg-gradient-to-b from-gray-900 to-gray-800"
                : "bg-gradient-to-b from-gray-200 to-gray-100"
            }`}
          >
            {/* Centered container, up to 7xl wide */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 space-y-8">
              {/* Profile Header Card */}
              <div className="bg-gradient-to-r from-teal-600 to-indigo-600 text-gray-100 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col md:flex-row items-center md:justify-between">
                {/* Left text block */}
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold truncate">
                    Welcome, {user.username}!
                  </h1>
                  <p className="text-teal-200 mt-1 text-xs sm:text-sm md:text-base lg:text-lg">
                    Here's your profile overview
                  </p>
                </div>

                {/* Right avatar block */}
                <div className="mt-4 md:mt-0 flex items-center bg-indigo-600 bg-opacity-20 rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-lg">
                  <img
                    src={user.avatar}
                    alt="User Avatar"
                    className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full border-2 border-gray-100 object-cover mr-3 sm:mr-4"
                  />
                  <div className="min-w-0">
                    <span className="block text-base sm:text-lg md:text-xl lg:text-2xl font-semibold truncate">
                      {user.username}
                    </span>
                    <span className="block text-[10px] sm:text-xs md:text-sm lg:text-base text-teal-200 truncate">
                      {user.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                {/* Qualification Card */}
                <div
                  className={`rounded-lg border-t-4 border-indigo-400 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-200 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <FaGraduationCap className="text-3xl sm:text-4xl md:text-5xl text-indigo-400 mb-2 sm:mb-3" />
                  <h3
                    className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-1 sm:mb-2 truncate ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    Qualification
                  </h3>
                  <p
                    className={`text-center text-xs sm:text-sm md:text-base lg:text-lg ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {user.highestQualification}
                  </p>
                </div>

                {/* Balance Card */}
                <div
                  className={`rounded-lg border-t-4 border-teal-400 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-200 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <FaMoneyBillWave className="text-3xl sm:text-4xl md:text-5xl text-teal-400 mb-2 sm:mb-3" />
                  <h3
                    className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-1 sm:mb-2 truncate ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    Balance
                  </h3>
                  <p
                    className={`text-center text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    ₹{user.balance.toFixed(2)}
                  </p>
                </div>

                {/* Hobbies Card */}
                <div
                  className={`rounded-lg border-t-4 border-amber-400 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-200 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <FaStar className="text-3xl sm:text-4xl md:text-5xl text-amber-400 mb-2 sm:mb-3" />
                  <h3
                    className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-1 sm:mb-2 truncate ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    Hobbies
                  </h3>
                  <p
                    className={`text-center text-xs sm:text-sm md:text-base lg:text-lg ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {user.hobbies.join(", ")}
                  </p>
                </div>
              </div>

              {/* Dashboard Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-start sm:space-x-4 md:space-x-6 lg:space-x-8 space-y-3 sm:space-y-0">
                <Link to="/finance/dashboard" className="w-full sm:w-auto">
                  <button className="w-full inline-flex justify-center items-center bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-gray-100 font-semibold py-2 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 rounded-lg shadow-2xl transition-transform duration-200 hover:scale-105 text-sm sm:text-base md:text-lg lg:text-xl">
                    <FaChartLine className="mr-2 sm:mr-3" />
                    Finance Dashboard
                  </button>
                </Link>
                <Link to="/todo/dashboard" className="w-full sm:w-auto">
                  <button className="w-full inline-flex justify-center items-center bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-gray-100 font-semibold py-2 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 rounded-lg shadow-2xl transition-transform duration-200 hover:scale-105 text-sm sm:text-base md:text-lg lg:text-xl">
                    <FaTasks className="mr-2 sm:mr-3" />
                    Todo Dashboard
                  </button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
