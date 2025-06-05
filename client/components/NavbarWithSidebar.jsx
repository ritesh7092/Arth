// NavbarWithSidebar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaChartLine,
  FaTasks,
  FaPlus,
  FaComments,
  FaFileAlt,
  FaUserCircle,
  FaEdit,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";

export default function NavbarWithSidebar({ heading }) {
  const [serverDate, setServerDate] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [financeOpen, setFinanceOpen] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(false);

  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const interval = setInterval(() => {
      setServerDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  const isActive = (path) => currentPath === path;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-[#1e293b] to-[#0f172a] text-gray-100 z-50 transform transition-transform duration-300 ease-in-out shadow-xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header / Branding */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
          <Link to="/" onClick={closeSidebar} className="flex items-center">
            <h3
              className="text-2xl font-bold text-white"
              style={{ fontFamily: '"Brush Script MT", cursive' }}
            >
              Arth
            </h3>
          </Link>
          <button
            onClick={closeSidebar}
            className="text-xl text-gray-400 hover:text-white focus:outline-none transition-colors"
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-2 overflow-y-auto h-[calc(100vh-80px)] scrollbar-thin scrollbar-thumb-gray-600">
          <ul className="space-y-2">
            {/* Home */}
            <li>
              <Link
                to="/"
                onClick={closeSidebar}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive("/")
                    ? "bg-gradient-to-r from-[#4facfe] to-[#0066ff] text-white shadow-lg"
                    : "text-gray-300 hover:bg-[#334155] hover:text-white"
                }`}
              >
                <FaHome className="mr-3 text-lg text-[#4facfe]" />
                <span className="font-medium text-base">Home</span>
              </Link>
            </li>

            {/* Finance Section */}
            <li>
              <button
                onClick={() => setFinanceOpen((prev) => !prev)}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
                  financeOpen
                    ? "bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white shadow-lg"
                    : "text-gray-300 hover:bg-[#334155] hover:text-white"
                }`}
              >
                <FaChartLine className="mr-3 text-lg text-[#a78bfa]" />
                <span className="flex-grow font-medium text-base">Finance</span>
                {financeOpen ? (
                  <FaChevronDown className="text-sm opacity-70" />
                ) : (
                  <FaChevronRight className="text-sm opacity-50" />
                )}
              </button>
              {financeOpen && (
                <ul className="mt-1 ml-8 space-y-1">
                  <li>
                    <Link
                      to="/finance/dashboard"
                      onClick={closeSidebar}
                      className={`flex items-center px-3 py-2 rounded-md transition-colors duration-150 ${
                        isActive("/finance/dashboard")
                          ? "bg-[#1e3a8a] text-white"
                          : "text-gray-300 hover:bg-[#1e293b] hover:text-white"
                      }`}
                    >
                      <span className="text-sm">Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/finance/add"
                      onClick={closeSidebar}
                      className={`flex items-center px-3 py-2 rounded-md transition-colors duration-150 ${
                        isActive("/finance/add")
                          ? "bg-[#1e3a8a] text-white"
                          : "text-gray-300 hover:bg-[#1e293b] hover:text-white"
                      }`}
                    >
                      <span className="text-sm">Add Finance</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/finance/report"
                      onClick={closeSidebar}
                      className={`flex items-center px-3 py-2 rounded-md transition-colors duration-150 ${
                        isActive("/finance/report")
                          ? "bg-[#1e3a8a] text-white"
                          : "text-gray-300 hover:bg-[#1e293b] hover:text-white"
                      }`}
                    >
                      <span className="text-sm">Reports</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Tasks Section */}
            <li>
              <button
                onClick={() => setTasksOpen((prev) => !prev)}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
                  tasksOpen
                    ? "bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-white shadow-lg"
                    : "text-gray-300 hover:bg-[#334155] hover:text-white"
                }`}
              >
                <FaTasks className="mr-3 text-lg text-[#f9a8d4]" />
                <span className="flex-grow font-medium text-base">Tasks</span>
                {tasksOpen ? (
                  <FaChevronDown className="text-sm opacity-70" />
                ) : (
                  <FaChevronRight className="text-sm opacity-50" />
                )}
              </button>
              {tasksOpen && (
                <ul className="mt-1 ml-8 space-y-1">
                  <li>
                    <Link
                      to="/todo/dashboard"
                      onClick={closeSidebar}
                      className={`flex items-center px-3 py-2 rounded-md transition-colors duration-150 ${
                        isActive("/todo/dashboard")
                          ? "bg-[#831843] text-white"
                          : "text-gray-300 hover:bg-[#1e293b] hover:text-white"
                      }`}
                    >
                      <span className="text-sm">Todo Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/addtask"
                      onClick={closeSidebar}
                      className={`flex items-center px-3 py-2 rounded-md transition-colors duration-150 ${
                        isActive("/addtask")
                          ? "bg-[#831843] text-white"
                          : "text-gray-300 hover:bg-[#1e293b] hover:text-white"
                      }`}
                    >
                      <span className="text-sm">Add Todo</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* AI Assistant */}
            <li>
              <Link
                to="/chatbot"
                onClick={closeSidebar}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive("/chatbot")
                    ? "bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg"
                    : "text-gray-300 hover:bg-[#334155] hover:text-white"
                }`}
              >
                <FaComments className="mr-3 text-lg text-[#34d399]" />
                <span className="font-medium text-base">AI Assistant</span>
              </Link>
            </li>
          </ul>

          {/* Divider */}
          <div className="mt-6 border-t border-gray-700"></div>

          {/* Profile & Logout */}
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                to="/dashboard"
                onClick={closeSidebar}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive("/dashboard")
                    ? "bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white shadow-lg"
                    : "text-gray-300 hover:bg-[#334155] hover:text-white"
                }`}
              >
                <FaUserCircle className="mr-3 text-lg text-[#f9c74f]" />
                <span className="font-medium text-base">Dashboard/Profile</span>
              </Link>
            </li>
            <li>
              <Link
                to="/logout"
                onClick={closeSidebar}
                className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-[#334155] hover:text-white transition-colors duration-200"
              >
                <FaSignOutAlt className="mr-3 text-lg text-[#ef4444]" />
                <span className="font-medium text-base">Logout</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Top Navbar */}
      <header className="w-full bg-gradient-to-r from-[#020617] to-[#0f172a] border-b border-gray-700 text-gray-100 fixed top-0 z-30 shadow-lg">
        <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Left: Toggle & Branding */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-2xl text-gray-300 hover:text-white focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <Link to="/" className="ml-4">
              <h2
                className="text-3xl font-bold text-white"
                style={{ fontFamily: '"Brush Script MT", cursive' }}
              >
                Arth
              </h2>
              <p className="text-xs text-gray-400 italic -mt-1">
                Advance. Secure. Global.
              </p>
            </Link>
          </div>

          {/* Center: Page Heading */}
          <div className="hidden lg:flex flex-grow justify-center px-4">
            <h1 className="text-xl font-semibold tracking-wide text-white">
              {heading}
            </h1>
          </div>

          {/* Right: Profile, Logout, Server Time */}
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="text-gray-300 hover:text-white transition-colors"
              title="Profile"
            >
              <FaUserCircle className="text-2xl text-[#f9c74f]" />
            </Link>
            <Link
              to="/logout"
              className="text-gray-300 hover:text-white transition-colors"
              title="Logout"
            >
              <FaSignOutAlt className="text-2xl text-[#ef4444]" />
            </Link>
            <div className="text-xs text-gray-400 whitespace-nowrap hidden md:inline-block">
              <time dateTime={serverDate.toISOString()}>
                {serverDate.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}{" "}
                {serverDate.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </time>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

