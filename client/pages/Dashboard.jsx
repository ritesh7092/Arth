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

export default function Dashboard() {
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

  // Ref to the mobile‐sidebar wrapper
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 font-sans text-gray-100 overflow-x-hidden">
      <div className="flex flex-1">
        {/* ========================= */}
        {/*   Mobile Sidebar Drawer  */}
        {/* ========================= */}
        <div
          // We removed `aria-hidden`; instead, we toggle `inert` via useEffect + ref
          ref={sidebarRef}
          className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* semi‐transparent backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-60"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 bg-gray-900 text-gray-100 flex flex-col shadow-xl h-full">
            <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center">
                <FaCog className="text-2xl text-teal-400" />
                <Link
                  to="/"
                  className="ml-2 text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-gray-100 truncate"
                >
                  MyArth
                </Link>
              </div>
              <button
                className="text-gray-100 text-xl"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <FaTimes />
              </button>
            </div>

            <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-800 flex items-center space-x-3 bg-gray-800">
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-teal-400 object-cover"
              />
              <div className="overflow-hidden min-w-0">
                <span className="block text-xs sm:text-sm font-medium truncate">
                  {user.username}
                </span>
                <span className="block text-[10px] sm:text-xs text-gray-400 truncate">
                  {user.email}
                </span>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6">
              <ul className="space-y-4">
                {/* Edit Profile */}
                <li>
                  <Link
                    to="/edit-profile"
                    className="flex items-center px-3 py-2 sm:px-4 sm:py-2.5 rounded-md text-gray-200 hover:bg-gray-800 hover:text-gray-100 transition-colors duration-200"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaEdit className="mr-2 sm:mr-3 text-lg text-teal-300" />
                    <span className="text-sm sm:text-base">Edit Profile</span>
                  </Link>
                </li>

                {/* Finance Group */}
                <li>
                  <button
                    onClick={() => setFinanceOpen((prev) => !prev)}
                    className={`flex items-center w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-md transition-colors duration-200 ${
                      financeOpen
                        ? "bg-gray-800 text-gray-100 shadow-inner"
                        : "text-gray-200 hover:bg-gray-800"
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
                      <li>
                        <Link
                          to="/finance"
                          className={`flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm ${
                            currentPath === "/finance"
                              ? "bg-gray-700 text-gray-100"
                              : "text-gray-200 hover:bg-gray-800"
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/finance/add"
                          className={`flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm ${
                            currentPath === "/finance/add"
                              ? "bg-gray-700 text-gray-100"
                              : "text-gray-200 hover:bg-gray-800"
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          Add Finance
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/finance/report"
                          className={`flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm ${
                            currentPath === "/finance/report"
                              ? "bg-gray-700 text-gray-100"
                              : "text-gray-200 hover:bg-gray-800"
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          Reports
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Tasks Group */}
                <li>
                  <button
                    onClick={() => setTasksOpen((prev) => !prev)}
                    className={`flex items-center w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-md transition-colors duration-200 ${
                      tasksOpen
                        ? "bg-gray-800 text-gray-100 shadow-inner"
                        : "text-gray-200 hover:bg-gray-800"
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
                      <li>
                        <Link
                          to="/tasks"
                          className={`flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm ${
                            currentPath === "/tasks"
                              ? "bg-gray-700 text-gray-100"
                              : "text-gray-200 hover:bg-gray-800"
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/tasks/add"
                          className={`flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm ${
                            currentPath === "/tasks/add"
                              ? "bg-gray-700 text-gray-100"
                              : "text-gray-200 hover:bg-gray-800"
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          Add Task
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Chatbot Link */}
                <li>
                  <Link
                    to="/chatbot"
                    className={`flex items-center px-3 py-2 sm:px-4 sm:py-2.5 rounded-md ${
                      currentPath === "/chatbot"
                        ? "bg-gray-800 text-gray-100"
                        : "text-gray-200 hover:bg-gray-800"
                    } transition-colors duration-200`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaRobot className="mr-2 sm:mr-3 text-lg text-teal-300" />
                    <span className="text-sm sm:text-base">Chatbot</span>
                    <FaChevronRight className="text-sm opacity-50 ml-auto" />
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="px-4 py-4 sm:px-6 sm:py-6 border-t border-gray-800 bg-gray-800">
              <Link
                to="/settings"
                className="flex items-center px-3 py-2 sm:px-4 sm:py-2.5 rounded-md text-gray-300 hover:text-gray-100 hover:bg-gray-700 transition-colors duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <FaCog className="mr-2 sm:mr-3 text-lg text-teal-300" />
                <span className="text-sm sm:text-base">Settings</span>
              </Link>
              <Link
                to="/logout"
                className="mt-3 w-full inline-flex justify-center items-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md shadow transition-transform duration-200 hover:scale-105 text-sm sm:text-base"
                onClick={() => setSidebarOpen(false)}
              >
                <FaSignOutAlt className="mr-2 text-lg" /> Logout
              </Link>
            </div>
          </aside>
        </div>

        {/* ========================= */}
        {/*   Static Sidebar (md+)   */}
        {/* ========================= */}
        <aside className="hidden md:flex md:w-72 lg:w-64 bg-gray-900 text-gray-100 flex-col shadow-xl">
          <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-800 flex items-center">
            <FaCog className="text-2xl text-teal-400" />
            <Link
              to="/"
              className="ml-2 text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-gray-100 truncate"
            >
              MyArth
            </Link>
          </div>

          <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-800 flex items-center space-x-3 bg-gray-800">
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-teal-400 object-cover"
            />
            <div className="overflow-hidden min-w-0">
              <span className="block text-xs sm:text-sm font-medium truncate">
                {user.username}
              </span>
              <span className="block text-[10px] sm:text-xs text-gray-400 truncate">
                {user.email}
              </span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/edit-profile"
                  className="flex items-center px-3 py-2 sm:px-4 sm:py-2.5 rounded-md text-gray-200 hover:bg-gray-800 hover:text-gray-100 transition-colors duration-200"
                >
                  <FaEdit className="mr-2 sm:mr-3 text-lg text-teal-300" />
                  <span className="text-sm sm:text-base">Edit Profile</span>
                </Link>
              </li>

              <li>
                <button
                  onClick={() => setFinanceOpen((prev) => !prev)}
                  className={`flex items-center w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-md transition-colors duration-200 ${
                    financeOpen
                      ? "bg-gray-800 text-gray-100 shadow-inner"
                      : "text-gray-200 hover:bg-gray-800"
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
                    <li>
                      <Link
                        to="/finance"
                        className={`flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm ${
                          currentPath === "/finance"
                            ? "bg-gray-700 text-gray-100"
                            : "text-gray-200 hover:bg-gray-800"
                        }`}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/finance/add"
                        className={`flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm ${
                          currentPath === "/finance/add"
                            ? "bg-gray-700 text-gray-100"
                            : "text-gray-200 hover:bg-gray-800"
                        }`}
                      >
                        Add Finance
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/finance/report"
                        className={`flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm ${
                          currentPath === "/finance/report"
                            ? "bg-gray-700 text-gray-100"
                            : "text-gray-200 hover:bg-gray-800"
                        }`}
                      >
                        Reports
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <button
                  onClick={() => setTasksOpen((prev) => !prev)}
                  className={`flex items-center w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-md transition-colors duration-200 ${
                    tasksOpen
                      ? "bg-gray-800 text-gray-100 shadow-inner"
                      : "text-gray-200 hover:bg-gray-800"
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
                    <li>
                      <Link
                        to="/tasks"
                        className={`flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm ${
                          currentPath === "/tasks"
                            ? "bg-gray-700 text-gray-100"
                            : "text-gray-200 hover:bg-gray-800"
                        }`}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tasks/add"
                        className={`flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm ${
                          currentPath === "/tasks/add"
                            ? "bg-gray-700 text-gray-100"
                            : "text-gray-200 hover:bg-gray-800"
                        }`}
                      >
                        Add Task
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <Link
                  to="/chatbot"
                  className={`flex items-center px-3 py-2 sm:px-4 sm:py-2.5 rounded-md ${
                    currentPath === "/chatbot"
                      ? "bg-gray-800 text-gray-100"
                      : "text-gray-200 hover:bg-gray-800"
                  } transition-colors duration-200`}
                >
                  <FaRobot className="mr-2 sm:mr-3 text-lg text-teal-300" />
                  <span className="text-sm sm:text-base">Chatbot</span>
                  <FaChevronRight className="text-sm opacity-50 ml-auto" />
                </Link>
              </li>
            </ul>
          </nav>

          <div className="px-4 py-4 sm:px-6 sm:py-6 border-t border-gray-800 bg-gray-800">
            <Link
              to="/settings"
              className="flex items-center px-3 py-2 sm:px-4 sm:py-2.5 rounded-md text-gray-300 hover:text-gray-100 hover:bg-gray-700 transition-colors duration-200"
            >
              <FaCog className="mr-2 sm:mr-3 text-lg text-teal-300" />
              <span className="text-sm sm:text-base">Settings</span>
            </Link>
            <Link
              to="/logout"
              className="mt-3 w-full inline-flex justify-center items-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md shadow transition-transform duration-200 hover:scale-105 text-sm sm:text-base"
            >
              <FaSignOutAlt className="mr-2 text-lg" /> Logout
            </Link>
          </div>
        </aside>

        {/* ========================= */}
        {/*       Main Content       */}
        {/* ========================= */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar (Navbar) */}
          <header className="sticky top-0 z-30 bg-gradient-to-r from-purple-600 to-pink-600 border-b border-pink-700 px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3 md:py-4 flex flex-wrap justify-between items-center shadow-lg">
            {/* Left: Hamburger + Title */}
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-auto">
              <button
                id="openSidebarButton"
                ref={hamburgerRef}
                className="text-gray-100 md:hidden text-xl sm:text-2xl"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <FaBars />
              </button>
              <h2 className="text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl font-semibold text-gray-100 truncate">
                Dashboard / Profile
              </h2>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mt-2 sm:mt-0">
              <button className="relative group">
                <FaBell className="text-lg sm:text-xl md:text-2xl text-gray-100 hover:text-gray-200 transition-colors duration-200" />
                {user.notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2 ring-2 ring-gray-900" />
                )}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-1 w-max bg-gray-800 text-[10px] sm:text-xs md:text-sm text-gray-100 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Notifications
                </div>
              </button>
              <FaUserCircle className="text-lg sm:text-xl md:text-2xl text-gray-100" />
            </div>
          </header>

          {/* Main Scrollable Area */}
          <main className="flex-1 overflow-auto bg-gradient-to-b from-gray-900 to-gray-800 py-4">
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
                    Here’s your profile overview
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
                <div className="bg-gray-800 rounded-lg border-t-4 border-indigo-400 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-200">
                  <FaGraduationCap className="text-3xl sm:text-4xl md:text-5xl text-indigo-400 mb-2 sm:mb-3" />
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-100 mb-1 sm:mb-2 truncate">
                    Qualification
                  </h3>
                  <p className="text-gray-300 text-center text-xs sm:text-sm md:text-base lg:text-lg">
                    {user.highestQualification}
                  </p>
                </div>

                {/* Balance Card */}
                <div className="bg-gray-800 rounded-lg border-t-4 border-teal-400 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-200">
                  <FaMoneyBillWave className="text-3xl sm:text-4xl md:text-5xl text-teal-400 mb-2 sm:mb-3" />
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-100 mb-1 sm:mb-2 truncate">
                    Balance
                  </h3>
                  <p className="text-gray-300 text-center text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                    ₹{user.balance.toFixed(2)}
                  </p>
                </div>

                {/* Hobbies Card */}
                <div className="bg-gray-800 rounded-lg border-t-4 border-amber-400 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-200">
                  <FaStar className="text-3xl sm:text-4xl md:text-5xl text-amber-400 mb-2 sm:mb-3" />
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-100 mb-1 sm:mb-2 truncate">
                    Hobbies
                  </h3>
                  <p className="text-gray-300 text-center text-xs sm:text-sm md:text-base lg:text-lg">
                    {user.hobbies.join(", ")}
                  </p>
                </div>
              </div>

              {/* Dashboard Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-start sm:space-x-4 md:space-x-6 lg:space-x-8 space-y-3 sm:space-y-0">
                <Link to="/finance" className="w-full sm:w-auto">
                  <button className="w-full inline-flex justify-center items-center bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-gray-100 font-semibold py-2 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 rounded-lg shadow-2xl transition-transform duration-200 hover:scale-105 text-sm sm:text-base md:text-lg lg:text-xl">
                    {/* Icon‐text gap enlarged: mr-2 (base) / sm:mr-3 */}
                    <FaChartLine className="mr-2 sm:mr-3" />
                    Finance Dashboard
                  </button>
                </Link>
                <Link to="/tasks" className="w-full sm:w-auto">
                  <button className="w-full inline-flex justify-center items-center bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-gray-100 font-semibold py-2 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 rounded-lg shadow-2xl transition-transform duration-200 hover:scale-105 text-sm sm:text-base md:text-lg lg:text-xl">
                    {/* Icon‐text gap enlarged: mr-2 (base) / sm:mr-3 */}
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
