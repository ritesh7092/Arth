// NavbarWithSidebar.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  FaBell,
  FaSearch,
  FaCog,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { useTheme } from "../src/theme/ThemeProvider";
import ThemeToggle from "./ThemeToggle";

export default function NavbarWithSidebar({ heading }) {
  const [serverDate, setServerDate] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [financeOpen, setFinanceOpen] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const sidebarRef = useRef(null);
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Real-time clock update
  useEffect(() => {
    const interval = setInterval(() => {
      setServerDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target) && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  // Auto-collapse sections when navigating
  useEffect(() => {
    if (!currentPath.startsWith("/finance")) {
      setFinanceOpen(false);
    }
    if (!currentPath.startsWith("/todo") && !currentPath.startsWith("/addtask")) {
      setTasksOpen(false);
    }
  }, [currentPath]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      // Clear authentication data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      // Small delay for better UX
      setTimeout(() => {
        navigate('/login', { replace: true });
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoading(false);
    }
  }, [navigate]);

  // Remove the local toggleDarkMode function since we're using the global theme context

  const isActive = (path) => currentPath === path;
  const isParentActive = (paths) => paths.some(path => currentPath.startsWith(path));

  // Navigation items configuration
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      path: '/',
      icon: FaHome,
      color: '#4facfe'
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: FaChartLine,
      color: '#a78bfa',
      isSection: true,
      isOpen: financeOpen,
      setOpen: setFinanceOpen,
      children: [
        { label: 'Dashboard', path: '/finance/dashboard' },
        { label: 'Add Finance', path: '/finance/add' },
        { label: 'Analytics', path: '/finance/report' },
        { label: 'Budget Planner', path: '/finance/budget' }
      ]
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: FaTasks,
      color: '#f9a8d4',
      isSection: true,
      isOpen: tasksOpen,
      setOpen: setTasksOpen,
      children: [
        { label: 'Todo Dashboard', path: '/todo/dashboard' },
        { label: 'Add Todo', path: '/addtask' },
        { label: 'Task Calendar', path: '/tasks/calendar' }
      ]
    },
    {
      id: 'ai-assistant',
      label: 'AI Assistant',
      path: '/chatbot',
      icon: FaComments,
      color: '#34d399'
    }
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString(undefined, {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-all duration-300 backdrop-blur-sm ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen w-80 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 text-gray-100 z-50 transform transition-all duration-300 ease-in-out shadow-2xl border-r border-slate-700 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Main navigation"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700 bg-slate-800/50">
          <Link 
            to="/" 
            onClick={closeSidebar} 
            className="flex items-center group"
            aria-label="Go to home"
          >
            <div className="relative">
              <h3
                className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-400 transition-all duration-300"
                style={{ fontFamily: '"Brush Script MT", cursive' }}
              >
                Arth
              </h3>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></div>
            </div>
          </Link>
          <button
            onClick={closeSidebar}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            aria-label="Close sidebar"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 border-b border-slate-700">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search menu..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                {item.isSection ? (
                  <>
                    <button
                      onClick={() => item.setOpen((prev) => !prev)}
                      className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 group ${
                        isParentActive([`/${item.id}`])
                          ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white shadow-lg border border-blue-500/20"
                          : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
                      }`}
                      aria-expanded={item.isOpen}
                    >
                      <item.icon 
                        className="mr-3 text-lg transition-transform duration-200 group-hover:scale-110" 
                        style={{ color: item.color }} 
                      />
                      <span className="flex-grow font-medium text-base text-left">
                        {item.label}
                      </span>
                      <div className="transition-transform duration-200">
                        {item.isOpen ? (
                          <FaChevronDown className="text-sm opacity-70" />
                        ) : (
                          <FaChevronRight className="text-sm opacity-50" />
                        )}
                      </div>
                    </button>
                    
                    {/* Collapsible submenu */}
                    <div className={`overflow-hidden transition-all duration-300 ${
                      item.isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}>
                      <ul className="mt-2 ml-8 space-y-1">
                        {item.children.map((child, index) => (
                          <li key={index}>
                            <Link
                              to={child.path}
                              onClick={closeSidebar}
                              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-150 text-sm group ${
                                isActive(child.path)
                                  ? "bg-blue-600/30 text-white border-l-2 border-blue-400"
                                  : "text-gray-300 hover:bg-slate-700/30 hover:text-white hover:translate-x-1"
                              }`}
                            >
                              <span className="font-medium">{child.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    onClick={closeSidebar}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive(item.path)
                        ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white shadow-lg border border-blue-500/20"
                        : "text-gray-300 hover:bg-slate-700/50 hover:text-white hover:translate-x-1"
                    }`}
                  >
                    <item.icon 
                      className="mr-3 text-lg transition-transform duration-200 group-hover:scale-110" 
                      style={{ color: item.color }} 
                    />
                    <span className="font-medium text-base">{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="my-6 border-t border-slate-700"></div>

          {/* Bottom Navigation */}
          <ul className="space-y-1">
            <li>
              <Link
                to="/dashboard"
                onClick={closeSidebar}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive("/dashboard")
                    ? "bg-gradient-to-r from-orange-600/20 to-yellow-600/20 text-white shadow-lg border border-orange-500/20"
                    : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
                }`}
              >
                <FaUserCircle className="mr-3 text-lg text-orange-400 transition-transform duration-200 group-hover:scale-110" />
                <span className="font-medium text-base">Profile</span>
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                onClick={closeSidebar}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive("/settings")
                    ? "bg-gradient-to-r from-gray-600/20 to-slate-600/20 text-white shadow-lg border border-gray-500/20"
                    : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
                }`}
              >
                <FaCog className="mr-3 text-lg text-gray-400 transition-transform duration-200 group-hover:rotate-90" />
                <span className="font-medium text-base">Settings</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex items-center w-full px-4 py-3 rounded-xl text-gray-300 hover:bg-red-600/20 hover:text-red-300 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSignOutAlt className="mr-3 text-lg text-red-400 transition-transform duration-200 group-hover:scale-110" />
                <span className="font-medium text-base">
                  {isLoading ? "Logging out..." : "Logout"}
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Top Navbar */}
      <header className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 text-gray-100 fixed top-0 z-30 shadow-xl backdrop-blur-md">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                aria-label="Toggle navigation menu"
              >
                <div className="relative w-6 h-6">
                  <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    sidebarOpen ? 'rotate-45 translate-y-2.5' : 'translate-y-1'
                  }`} />
                  <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    sidebarOpen ? 'opacity-0' : 'translate-y-2.5'
                  }`} />
                  <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    sidebarOpen ? '-rotate-45 translate-y-2.5' : 'translate-y-4'
                  }`} />
                </div>
              </button>

              <Link to="/" className="group">
                <div className="flex flex-col">
                  <h2
                    className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-400 transition-all duration-300"
                    style={{ fontFamily: '"Brush Script MT", cursive' }}
                  >
                    Arth
                  </h2>
                  <p className="text-xs text-gray-400 italic -mt-1 hidden sm:block">
                    Advance. Secure. Global.
                  </p>
                </div>
              </Link>
            </div>

            {/* Center Section - Page Heading */}
            <div className="hidden lg:flex flex-1 justify-center px-8">
              <div className="text-center">
                <h1 className="text-xl xl:text-2xl font-semibold tracking-wide text-white">
                  {heading}
                </h1>
                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mt-1"></div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Notifications */}
              <button
                className="relative p-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                aria-label="Notifications"
              >
                <FaBell className="text-lg" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Theme Toggle */}
              <ThemeToggle variant="minimal" size="default" />

              {/* Profile */}
              <Link
                to="/dashboard"
                className="p-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200 group"
                title="Profile"
              >
                <FaUserCircle className="text-xl text-orange-400 group-hover:scale-110 transition-transform duration-200" />
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="p-2 text-gray-300 hover:text-white hover:bg-red-600/20 rounded-lg transition-all duration-200 group disabled:opacity-50"
                title="Logout"
              >
                <FaSignOutAlt className="text-lg text-red-400 group-hover:scale-110 transition-transform duration-200" />
              </button>

              {/* Server Time */}
              <div className="hidden md:flex flex-col text-right">
                <time 
                  dateTime={serverDate.toISOString()}
                  className="text-xs text-gray-300 font-mono"
                >
                  {formatTime(serverDate)}
                </time>
                <time 
                  dateTime={serverDate.toISOString()}
                  className="text-xs text-gray-400 font-mono"
                >
                  {formatDate(serverDate)}
                </time>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Page Heading */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-20 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 px-4 py-2">
        <h1 className="text-lg font-semibold text-center text-white">
          {heading}
        </h1>
      </div>
    </>
  );
}








// // NavbarWithSidebar.jsx
// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   FaBars,
//   FaTimes,
//   FaHome,
//   FaChartLine,
//   FaTasks,
//   FaPlus,
//   FaComments,
//   FaFileAlt,
//   FaUserCircle,
//   FaEdit,
//   FaSignOutAlt,
//   FaChevronDown,
//   FaChevronRight,
// } from "react-icons/fa";

// export default function NavbarWithSidebar({ heading }) {
//   const [serverDate, setServerDate] = useState(new Date());
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [financeOpen, setFinanceOpen] = useState(false);
//   const [tasksOpen, setTasksOpen] = useState(false);

//   const location = useLocation();
//   const currentPath = location.pathname;

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setServerDate(new Date());
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const toggleSidebar = () => setSidebarOpen((prev) => !prev);
//   const closeSidebar = () => setSidebarOpen(false);
//   const handleLogout = () => {
//   localStorage.removeItem('authToken'); // or clear() if you want to remove all
//   window.location.href = '/'; // or use navigate("/") if using react-router
// };


//   const isActive = (path) => currentPath === path;

//   return (
//     <>
//       {/* Overlay */}
//       <div
//         className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 ${
//           sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
//         }`}
//         onClick={closeSidebar}
//       />

//       {/* Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-[#1e293b] to-[#0f172a] text-gray-100 z-50 transform transition-transform duration-300 ease-in-out shadow-xl ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         {/* Header / Branding */}
//         <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
//           <Link to="/" onClick={closeSidebar} className="flex items-center">
//             <h3
//               className="text-2xl font-bold text-white"
//               style={{ fontFamily: '"Brush Script MT", cursive' }}
//             >
//               Arth
//             </h3>
//           </Link>
//           <button
//             onClick={closeSidebar}
//             className="text-xl text-gray-400 hover:text-white focus:outline-none transition-colors"
//             aria-label="Close sidebar"
//           >
//             <FaTimes />
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="mt-6 px-2 overflow-y-auto h-[calc(100vh-80px)] scrollbar-thin scrollbar-thumb-gray-600">
//           <ul className="space-y-2">
//             {/* Home */}
//             <li>
//               <Link
//                 to="/"
//                 onClick={closeSidebar}
//                 className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
//                   isActive("/")
//                     ? "bg-gradient-to-r from-[#4facfe] to-[#0066ff] text-white shadow-lg"
//                     : "text-gray-300 hover:bg-[#334155] hover:text-white"
//                 }`}
//               >
//                 <FaHome className="mr-3 text-lg text-[#4facfe]" />
//                 <span className="font-medium text-base">Home</span>
//               </Link>
//             </li>

//             {/* Finance Section */}
//             <li>
//               <button
//                 onClick={() => setFinanceOpen((prev) => !prev)}
//                 className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
//                   financeOpen
//                     ? "bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white shadow-lg"
//                     : "text-gray-300 hover:bg-[#334155] hover:text-white"
//                 }`}
//               >
//                 <FaChartLine className="mr-3 text-lg text-[#a78bfa]" />
//                 <span className="flex-grow font-medium text-base">Finance</span>
//                 {financeOpen ? (
//                   <FaChevronDown className="text-sm opacity-70" />
//                 ) : (
//                   <FaChevronRight className="text-sm opacity-50" />
//                 )}
//               </button>
//               {financeOpen && (
//                 <ul className="mt-1 ml-8 space-y-1">
//                   <li>
//                     <Link
//                       to="/finance/dashboard"
//                       onClick={closeSidebar}
//                       className={`flex items-center px-3 py-2 rounded-md transition-colors duration-150 ${
//                         isActive("/finance/dashboard")
//                           ? "bg-[#1e3a8a] text-white"
//                           : "text-gray-300 hover:bg-[#1e293b] hover:text-white"
//                       }`}
//                     >
//                       <span className="text-sm">Dashboard</span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/finance/add"
//                       onClick={closeSidebar}
//                       className={`flex items-center px-3 py-2 rounded-md transition-colors duration-150 ${
//                         isActive("/finance/add")
//                           ? "bg-[#1e3a8a] text-white"
//                           : "text-gray-300 hover:bg-[#1e293b] hover:text-white"
//                       }`}
//                     >
//                       <span className="text-sm">Add Finance</span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/finance/report"
//                       onClick={closeSidebar}
//                       className={`flex items-center px-3 py-2 rounded-md transition-colors duration-150 ${
//                         isActive("/finance/report")
//                           ? "bg-[#1e3a8a] text-white"
//                           : "text-gray-300 hover:bg-[#1e293b] hover:text-white"
//                       }`}
//                     >
//                       <span className="text-sm">Reports</span>
//                     </Link>
//                   </li>
//                 </ul>
//               )}
//             </li>

//             {/* Tasks Section */}
//             <li>
//               <button
//                 onClick={() => setTasksOpen((prev) => !prev)}
//                 className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
//                   tasksOpen
//                     ? "bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-white shadow-lg"
//                     : "text-gray-300 hover:bg-[#334155] hover:text-white"
//                 }`}
//               >
//                 <FaTasks className="mr-3 text-lg text-[#f9a8d4]" />
//                 <span className="flex-grow font-medium text-base">Tasks</span>
//                 {tasksOpen ? (
//                   <FaChevronDown className="text-sm opacity-70" />
//                 ) : (
//                   <FaChevronRight className="text-sm opacity-50" />
//                 )}
//               </button>
//               {tasksOpen && (
//                 <ul className="mt-1 ml-8 space-y-1">
//                   <li>
//                     <Link
//                       to="/todo/dashboard"
//                       onClick={closeSidebar}
//                       className={`flex items-center px-3 py-2 rounded-md transition-colors duration-150 ${
//                         isActive("/todo/dashboard")
//                           ? "bg-[#831843] text-white"
//                           : "text-gray-300 hover:bg-[#1e293b] hover:text-white"
//                       }`}
//                     >
//                       <span className="text-sm">Todo Dashboard</span>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/addtask"
//                       onClick={closeSidebar}
//                       className={`flex items-center px-3 py-2 rounded-md transition-colors duration-150 ${
//                         isActive("/addtask")
//                           ? "bg-[#831843] text-white"
//                           : "text-gray-300 hover:bg-[#1e293b] hover:text-white"
//                       }`}
//                     >
//                       <span className="text-sm">Add Todo</span>
//                     </Link>
//                   </li>
//                 </ul>
//               )}
//             </li>

//             {/* AI Assistant */}
//             <li>
//               <Link
//                 to="/chatbot"
//                 onClick={closeSidebar}
//                 className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
//                   isActive("/chatbot")
//                     ? "bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg"
//                     : "text-gray-300 hover:bg-[#334155] hover:text-white"
//                 }`}
//               >
//                 <FaComments className="mr-3 text-lg text-[#34d399]" />
//                 <span className="font-medium text-base">AI Assistant</span>
//               </Link>
//             </li>
//           </ul>

//           {/* Divider */}
//           <div className="mt-6 border-t border-gray-700"></div>

//           {/* Profile & Logout */}
//           <ul className="mt-4 space-y-2">
//             <li>
//               <Link
//                 to="/dashboard"
//                 onClick={closeSidebar}
//                 className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
//                   isActive("/dashboard")
//                     ? "bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white shadow-lg"
//                     : "text-gray-300 hover:bg-[#334155] hover:text-white"
//                 }`}
//               >
//                 <FaUserCircle className="mr-3 text-lg text-[#f9c74f]" />
//                 <span className="font-medium text-base">Dashboard/Profile</span>
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/"
//                 onClick={handleLogout}
//                 className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-[#334155] hover:text-white transition-colors duration-200"
//               >
//                 <FaSignOutAlt className="mr-3 text-lg text-[#ef4444]" />
//                 <span className="font-medium text-base">Logout</span>
//               </Link>
//             </li>
//           </ul>
//         </nav>
//       </aside>

//       {/* Top Navbar */}
//       <header className="w-full bg-gradient-to-r from-[#020617] to-[#0f172a] border-b border-gray-700 text-gray-100 fixed top-0 z-30 shadow-lg">
//         <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
//           {/* Left: Toggle & Branding */}
//           <div className="flex items-center">
//             <button
//               onClick={toggleSidebar}
//               className="text-2xl text-gray-300 hover:text-white focus:outline-none transition-colors"
//               aria-label="Toggle menu"
//             >
//               {sidebarOpen ? <FaTimes /> : <FaBars />}
//             </button>
//             <Link to="/" className="ml-4">
//               <h2
//                 className="text-3xl font-bold text-white"
//                 style={{ fontFamily: '"Brush Script MT", cursive' }}
//               >
//                 Arth
//               </h2>
//               <p className="text-xs text-gray-400 italic -mt-1">
//                 Advance. Secure. Global.
//               </p>
//             </Link>
//           </div>

//           {/* Center: Page Heading */}
//           <div className="hidden lg:flex flex-grow justify-center px-4">
//             <h1 className="text-xl font-semibold tracking-wide text-white">
//               {heading}
//             </h1>
//           </div>

//           {/* Right: Profile, Logout, Server Time */}
//           <div className="flex items-center space-x-4">
//             <Link
//               to="/dashboard"
//               className="text-gray-300 hover:text-white transition-colors"
//               title="Profile"
//             >
//               <FaUserCircle className="text-2xl text-[#f9c74f]" />
//             </Link>
//             <Link
//               to="/"
//               onClick={handleLogout}
//               className="text-gray-300 hover:text-white transition-colors"
//               title="Logout"
//             >
//               <FaSignOutAlt className="text-2xl text-[#ef4444]" />
//             </Link>
//             <div className="text-xs text-gray-400 whitespace-nowrap hidden md:inline-block">
//               <time dateTime={serverDate.toISOString()}>
//                 {serverDate.toLocaleDateString(undefined, {
//                   year: "numeric",
//                   month: "short",
//                   day: "numeric",
//                 })}{" "}
//                 {serverDate.toLocaleTimeString(undefined, {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                   second: "2-digit",
//                 })}
//               </time>
//             </div>
//           </div>
//         </div>
//       </header>
//     </>
//   );
// }

