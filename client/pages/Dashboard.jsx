
// UserProfilePage.jsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  FaHome,
  FaTrophy,
  FaCalendarAlt,
} from "react-icons/fa";
import { Sun, Moon, Activity, TrendingUp } from 'lucide-react';
import { useTheme } from "../src/theme/ThemeProvider";

// Custom hooks for better code organization
const useAuth = () => {
  const navigate = useNavigate();
  
  const logout = useCallback(() => {
    try {
      localStorage.removeItem("authToken");
      sessionStorage.clear();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/";
    }
  }, [navigate]);

  return { logout };
};

const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);

  const openSidebar = useCallback(() => setIsOpen(true), []);
  const closeSidebar = useCallback(() => setIsOpen(false), []);

  // Handle sidebar accessibility and focus management
  useEffect(() => {
    if (!sidebarRef.current) return;

    if (isOpen) {
      sidebarRef.current.removeAttribute("inert");
      // Focus first focusable element in sidebar
      const firstFocusable = sidebarRef.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
      }
    } else {
      sidebarRef.current.setAttribute("inert", "");
      if (hamburgerRef.current) {
        hamburgerRef.current.focus();
      }
    }
  }, [isOpen]);

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeSidebar();
      }
    };

    const handleClickOutside = (e) => {
      if (isOpen && 
          sidebarRef.current && 
          !sidebarRef.current.contains(e.target) && 
          !hamburgerRef.current?.contains(e.target)) {
        closeSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeSidebar]);

  return {
    isOpen,
    openSidebar,
    closeSidebar,
    sidebarRef,
    hamburgerRef
  };
};

// Enhanced user data with more realistic structure
const useUserData = () => {
  // In a real app, this would come from an API or context
  return useMemo(() => ({
    id: "user_123",
    username: "John Doe",
    email: "johndoe@example.com",
    firstName: "John",
    lastName: "Doe",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    highestQualification: "Bachelor's in Computer Science",
    hobbies: ["Reading", "Gaming", "Traveling", "Photography"],
    balance: 12547.85,
    notifications: 3,
    joinDate: "2023-01-15",
    lastActive: new Date().toISOString(),
    stats: {
      totalTasks: 45,
      completedTasks: 38,
      totalTransactions: 156,
      monthlyGoal: 50000,
      currentStreak: 7
    }
  }), []);
};

// Main component
export default function UserProfilePage() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const { isOpen: sidebarOpen, openSidebar, closeSidebar, sidebarRef, hamburgerRef } = useSidebar();
  const user = useUserData();
  
  const location = useLocation();
  const currentPath = location.pathname;
  const isDarkMode = theme === 'dark';

  // Collapsible menu states
  const [expandedMenus, setExpandedMenus] = useState({
    finance: false,
    tasks: false
  });

  const toggleMenu = useCallback((menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  }, []);

  // Memoized navigation configuration
  const navigationConfig = useMemo(() => ({
    main: [
      {
        id: 'dashboard',
        path: '/dashboard',
        icon: FaHome,
        label: 'Dashboard',
        isActive: currentPath === '/dashboard'
      },
      {
        id: 'profile',
        path: '/profile',
        icon: FaUserCircle,
        label: 'Profile',
        isActive: currentPath === '/profile'
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
        label: 'AI Assistant',
        isActive: currentPath === '/chatbot',
        badge: 'New'
      }
    ],
    finance: [
      { path: '/finance/dashboard', label: 'Overview', icon: TrendingUp, isActive: currentPath === '/finance/dashboard' },
      { path: '/finance/add', label: 'Add Transaction', icon: FaMoneyBillWave, isActive: currentPath === '/finance/add' },
      { path: '/finance/report', label: 'Reports', icon: FaChartLine, isActive: currentPath === '/finance/report' },
      { path: '/finance/budget', label: 'Budget Planner', icon: FaTrophy, isActive: currentPath === '/finance/budget' }
    ],
    tasks: [
      { path: '/todo/dashboard', label: 'Task Overview', icon: Activity, isActive: currentPath === '/todo/dashboard' },
      { path: '/addtask', label: 'Create Task', icon: FaTasks, isActive: currentPath === '/addtask' },
      { path: '/todo/calendar', label: 'Calendar View', icon: FaCalendarAlt, isActive: currentPath === '/todo/calendar' }
    ]
  }), [currentPath]);

  // Enhanced stats calculations
  const enhancedStats = useMemo(() => {
    const completionRate = Math.round((user.stats.completedTasks / user.stats.totalTasks) * 100);
    const goalProgress = Math.round((user.balance / user.stats.monthlyGoal) * 100);
    
    return {
      ...user.stats,
      completionRate,
      goalProgress: Math.min(goalProgress, 100)
    };
  }, [user.stats, user.balance]);

  // Memoized sidebar content component
  const SidebarContent = React.memo(({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`px-4 py-4 sm:px-6 sm:py-5 border-b flex items-center ${isMobile ? 'justify-between' : ''} ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      }`}>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-indigo-500 rounded-lg flex items-center justify-center">
            <FaCog className="text-white text-sm" />
          </div>
          <Link
            to="/"
            className={`ml-3 text-xl font-bold tracking-tight ${
              isDarkMode ? "text-gray-100" : "text-gray-800"
            }`}
            onClick={() => isMobile && closeSidebar()}
          >
            MyArth
          </Link>
        </div>
        {isMobile && (
          <button
            className={`p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <FaTimes className="text-lg" />
          </button>
        )}
      </div>

      {/* User Info */}
      <div className={`px-4 py-4 sm:px-6 sm:py-5 border-b ${
        isDarkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"
      }`}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={user.avatar}
              alt={`${user.username}'s avatar`}
              className="w-10 h-10 rounded-full border-2 border-teal-400 object-cover"
              loading="lazy"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></div>
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-medium truncate ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}>
              {user.username}
            </p>
            <p className={`text-xs truncate ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}>
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 space-y-6">
        {/* Main Navigation */}
        <div>
          <h3 className={`px-3 text-xs font-semibold uppercase tracking-wider ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            Main
          </h3>
          <ul className="mt-2 space-y-1">
            {navigationConfig.main.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={() => isMobile && closeSidebar()}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      item.isActive
                        ? "bg-gradient-to-r from-teal-500 to-indigo-500 text-white shadow-md"
                        : isDarkMode
                        ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <IconComponent className={`mr-3 text-lg ${
                      item.isActive ? "text-white" : "text-teal-400 group-hover:text-teal-300"
                    }`} />
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Finance Section */}
        <div>
          <button
            onClick={() => toggleMenu('finance')}
            className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              expandedMenus.finance
                ? isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
                : isDarkMode ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaChartLine className="mr-3 text-lg text-teal-400 group-hover:text-teal-300" />
            <span className="flex-1 text-left truncate">Finance</span>
            {expandedMenus.finance ? (
              <FaChevronDown className="text-sm" />
            ) : (
              <FaChevronRight className="text-sm" />
            )}
          </button>
          {expandedMenus.finance && (
            <ul className="mt-1 ml-6 space-y-1">
              {navigationConfig.finance.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => isMobile && closeSidebar()}
                      className={`group flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                        item.isActive
                          ? isDarkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-900"
                          : isDarkMode ? "text-gray-400 hover:bg-gray-700 hover:text-gray-300" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <IconComponent className="mr-2 text-sm" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Tasks Section */}
        <div>
          <button
            onClick={() => toggleMenu('tasks')}
            className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              expandedMenus.tasks
                ? isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
                : isDarkMode ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaTasks className="mr-3 text-lg text-teal-400 group-hover:text-teal-300" />
            <span className="flex-1 text-left truncate">Tasks</span>
            {expandedMenus.tasks ? (
              <FaChevronDown className="text-sm" />
            ) : (
              <FaChevronRight className="text-sm" />
            )}
          </button>
          {expandedMenus.tasks && (
            <ul className="mt-1 ml-6 space-y-1">
              {navigationConfig.tasks.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => isMobile && closeSidebar()}
                      className={`group flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                        item.isActive
                          ? isDarkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-900"
                          : isDarkMode ? "text-gray-400 hover:bg-gray-700 hover:text-gray-300" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <IconComponent className="mr-2 text-sm" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className={`px-4 py-4 sm:px-6 border-t ${
        isDarkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"
      }`}>
        <Link
          to="/settings"
          onClick={() => isMobile && closeSidebar()}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 mb-3 ${
            isDarkMode
              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <FaCog className="mr-3 text-lg text-teal-400" />
          Settings
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  ));

  // Stats cards configuration
  const statsCards = useMemo(() => [
    {
      id: 'qualification',
      title: 'Qualification',
      value: user.highestQualification,
      icon: FaGraduationCap,
      color: 'indigo',
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'balance',
      title: 'Balance',
      value: `₹${user.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      icon: FaMoneyBillWave,
      color: 'teal',
      gradient: 'from-teal-500 to-cyan-600',
      subtitle: `${enhancedStats.goalProgress}% of monthly goal`
    },
    {
      id: 'tasks',
      title: 'Task Progress',
      value: `${enhancedStats.completionRate}%`,
      icon: FaTasks,
      color: 'amber',
      gradient: 'from-amber-500 to-orange-600',
      subtitle: `${user.stats.completedTasks}/${user.stats.totalTasks} completed`
    },
    {
      id: 'hobbies',
      title: 'Interests',
      value: user.hobbies.slice(0, 2).join(', '),
      icon: FaStar,
      color: 'pink',
      gradient: 'from-pink-500 to-rose-600',
      subtitle: `+${user.hobbies.length - 2} more`
    }
  ], [user, enhancedStats]);

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-200 ${
      isDarkMode
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
    }`}>
      <div className="flex flex-1 relative">
        {/* Mobile Sidebar */}
        <div
          ref={sidebarRef}
          className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          inert={!sidebarOpen ? "" : undefined}
        >
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={closeSidebar}
            aria-hidden="true"
          />
          <aside className={`relative h-full shadow-2xl ${
            isDarkMode ? "bg-gray-900 border-r border-gray-700" : "bg-white border-r border-gray-200"
          }`}>
            <SidebarContent isMobile={true} />
          </aside>
        </div>

        {/* Desktop Sidebar */}
        <aside className={`hidden md:flex md:w-64 lg:w-72 flex-col shadow-xl ${
          isDarkMode ? "bg-gray-900 border-r border-gray-700" : "bg-white border-r border-gray-200"
        }`}>
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 sm:px-6 lg:px-8 py-4 ${
            isDarkMode
              ? "bg-gray-900/95 border-gray-700"
              : "bg-white/95 border-gray-200"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  ref={hamburgerRef}
                  className={`md:hidden p-2 rounded-md transition-colors ${
                    isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"
                  }`}
                  onClick={openSidebar}
                  aria-label="Open sidebar"
                >
                  <FaBars className="text-xl" />
                </button>
                <div>
                  <h1 className={`text-2xl font-bold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}>
                    Dashboard/Profile
                  </h1>
                  <p className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Welcome back, {user.firstName}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-md transition-colors ${
                    isDarkMode 
                      ? "hover:bg-gray-700 text-yellow-400" 
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                
                <button className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <FaBell className={`text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"}`} />
                  {user.notifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {user.notifications}
                    </span>
                  )}
                </button>
                
                <div className="flex items-center space-x-2">
                  <img
                    src={user.avatar}
                    alt={`${user.username}'s avatar`}
                    className="w-8 h-8 rounded-full border-2 border-teal-400 object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
              {/* Welcome Banner */}
              <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative px-6 py-8 sm:px-8 sm:py-12">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="text-center md:text-left mb-6 md:mb-0">
                      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        Welcome back, {user.firstName}! 👋
                      </h2>
                      <p className="text-teal-100 text-lg">
                        Here's what's happening with your account today
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <img
                        src={user.avatar}
                        alt={`${user.username}'s avatar`}
                        className="w-16 h-16 rounded-full border-3 border-white object-cover"
                        loading="lazy"
                      />
                      <div className="text-white">
                        <p className="font-semibold text-lg">{user.username}</p>
                        <p className="text-teal-100 text-sm">Member since {new Date(user.joinDate).getFullYear()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((card) => {
                  const IconComponent = card.icon;
                  return (
                    <div
                      key={card.id}
                      className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group ${
                        isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                      <div className="relative p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-br ${card.gradient}`}>
                            <IconComponent className="text-2xl text-white" />
                          </div>
                        </div>
                        <h3 className={`text-lg font-semibold mb-1 ${
                          isDarkMode ? "text-gray-200" : "text-gray-800"
                        }`}>
                          {card.title}
                        </h3>
                        <p className={`text-2xl font-bold mb-1 ${
                          isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}>
                          {card.value}
                        </p>
                        {card.subtitle && (
                          <p className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}>
                            {card.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <h3 className={`text-2xl font-bold ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Link
                    to="/finance/dashboard"
                    className="group relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                    <div className="relative p-6 text-white">
                      <FaChartLine className="text-3xl mb-4" />
                      <h4 className="text-xl font-semibold mb-2">Finance Dashboard</h4>
                      <p className="text-indigo-100">Manage your finances and track expenses</p>
                    </div>
                  </Link>

                  <Link
                    to="/todo/dashboard"
                    className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                    <div className="relative p-6 text-white">
                      <FaTasks className="text-3xl mb-4" />
                      <h4 className="text-xl font-semibold mb-2">Task Manager</h4>
                      <p className="text-amber-100">Organize your tasks and stay productive</p>
                    </div>
                  </Link>
                  <Link
                    to="/chatbot"
                    className="group relative overflow-hidden bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                    <div className="relative p-6 text-white">
                      <FaRobot className="text-3xl mb-4" />
                      <h4 className="text-xl font-semibold mb-2">AI Assistant</h4>

                      <p className="text-teal-100">Get help with your tasks using AI</p>


                    </div>
                  </Link>
                </div>
              </div>
              {/* User Stats */}
              <div className="space-y-6">
                <h3 className={`text-2xl font-bold ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}>
                  User Stats
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className={`p-6 rounded-xl shadow-lg ${
                    isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                  }`}>
                    <h4 className={`text-lg font-semibold mb-2 ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}>
                      Total Tasks
                    </h4>
                    <p className={`text-2xl font-bold ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}>
                      {user.stats.totalTasks}
                    </p>
                  </div>
                  <div className={`p-6 rounded-xl shadow-lg ${
                    isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                  }`}>
                    <h4 className={`text-lg font-semibold mb-2 ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}>
                      Completed Tasks
                    </h4>
                    <p className={`text-2xl font-bold ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}>
                      {user.stats.completedTasks}
                    </p>
                  </div>
                  <div className={`p-6 rounded-xl shadow-lg ${
                    isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                  }`}>
                    <h4 className={`text-lg font-semibold mb-2 ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}>
                      Current Streak
                    </h4>
                    <p className={`text-2xl font-bold ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}>
                      {user.stats.currentStreak} days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
    </div>
  );
}






// // UserProfilePage.jsx
// import React, { useState, useRef, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   FaGraduationCap,
//   FaMoneyBillWave,
//   FaStar,
//   FaChartLine,
//   FaTasks,
//   FaRobot,
//   FaBell,
//   FaCog,
//   FaChevronDown,
//   FaChevronRight,
//   FaUserCircle,
//   FaSignOutAlt,
//   FaBars,
//   FaTimes,
//   FaEdit,
// } from "react-icons/fa";
// import { Sun, Moon } from 'lucide-react';

// // Import the theme hook (assuming you have this from Home.jsx)
// import { useTheme } from "../src/theme/ThemeProvider";

// export default function UserProfilePage() {
//   // Use theme provider instead of local state
//   const { theme, toggleTheme } = useTheme();
//   const isDarkMode = theme === 'dark';

//   // Dummy data (replace with real API/context)
//   const user = {
//     username: "John Doe",
//     email: "johndoe@example.com",
//     highestQualification: "Bachelor's in Computer Science",
//     hobbies: ["Reading", "Gaming", "Traveling"],
//     balance: 1000.5,
//     avatar: "https://via.placeholder.com/150",
//     notifications: 3,
//   };

//   const location = useLocation();
//   const currentPath = location.pathname;

//   // State for collapsible menus
//   const [financeOpen, setFinanceOpen] = useState(false);
//   const [tasksOpen, setTasksOpen] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // Ref to the mobile-sidebar wrapper
//   const sidebarRef = useRef(null);
//   // Ref to the hamburger button (so we can restore focus when sidebar closes)
//   const hamburgerRef = useRef(null);

//   // Toggle inert on the sidebar wrapper whenever sidebarOpen changes
//   useEffect(() => {
//     if (!sidebarRef.current) return;

//     if (sidebarOpen) {
//       // When opening: remove inert, make all children focusable again
//       sidebarRef.current.removeAttribute("inert");
//     } else {
//       // When closing: add inert so subtree is hidden from AT and unfocusable
//       sidebarRef.current.setAttribute("inert", "");
//       // If any element inside the sidebar had focus, move focus back to the hamburger
//       if (hamburgerRef.current) {
//         hamburgerRef.current.focus();
//       }
//     }
//   }, [sidebarOpen]);

//   // Handle logout
//   const handleLogout = () => {
//     localStorage.removeItem("authToken"); // or clear() if you want to remove all
//     window.location.href = "/"; // or use navigate("/") if using react-router
//   };

//   // Close sidebar when clicking outside or pressing Escape
//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === 'Escape' && sidebarOpen) {
//         setSidebarOpen(false);
//       }
//     };

//     const handleClickOutside = (e) => {
//       if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target) && !hamburgerRef.current?.contains(e.target)) {
//         setSidebarOpen(false);
//       }
//     };

//     if (sidebarOpen) {
//       document.addEventListener('keydown', handleEscape);
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('keydown', handleEscape);
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [sidebarOpen]);

//   // Memoized navigation items to prevent unnecessary re-renders
//   const navigationItems = React.useMemo(() => [
//     {
//       id: 'dashboard',
//       path: '/dashboard',
//       icon: FaUserCircle,
//       label: 'Dashboard/Profile',
//       isActive: currentPath === '/dashboard'
//     },
//     {
//       id: 'edit-profile',
//       path: '/edit-profile',
//       icon: FaEdit,
//       label: 'Edit Profile',
//       isActive: currentPath === '/edit-profile'
//     },
//     {
//       id: 'chatbot',
//       path: '/chatbot',
//       icon: FaRobot,
//       label: 'Chatbot',
//       isActive: currentPath === '/chatbot'
//     }
//   ], [currentPath]);

//   const financeItems = React.useMemo(() => [
//     { path: '/finance/dashboard', label: 'Dashboard', isActive: currentPath === '/finance/dashboard' },
//     { path: '/finance/add', label: 'Add Finance', isActive: currentPath === '/finance/add' },
//     { path: '/finance/report', label: 'Reports', isActive: currentPath === '/finance/report' }
//   ], [currentPath]);

//   const taskItems = React.useMemo(() => [
//     { path: '/todo/dashboard', label: 'Dashboard', isActive: currentPath === '/todo/dashboard' },
//     { path: '/addtask', label: 'Add Task', isActive: currentPath === '/addtask' }
//   ], [currentPath]);

//   // Memoized sidebar content to prevent unnecessary re-renders
//   const SidebarContent = React.memo(({ isMobile = false }) => (
//     <>
//       <div
//         className={`px-4 py-4 sm:px-6 sm:py-5 border-b flex items-center ${isMobile ? 'justify-between' : ''} ${
//           isDarkMode ? "border-gray-800" : "border-gray-200"
//         }`}
//       >
//         <div className="flex items-center">
//           <FaCog className="text-2xl text-teal-400" />
//           <Link
//             to="/"
//             className={`ml-2 text-lg sm:text-xl md:text-2xl font-bold tracking-tight truncate ${
//               isDarkMode ? "text-gray-100" : "text-gray-800"
//             }`}
//             onClick={() => isMobile && setSidebarOpen(false)}
//           >
//             MyArth
//           </Link>
//         </div>
//         {isMobile && (
//           <button
//             className={`text-xl ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}
//             onClick={() => setSidebarOpen(false)}
//             aria-label="Close sidebar"
//           >
//             <FaTimes />
//           </button>
//         )}
//       </div>

//       <div
//         className={`px-4 py-4 sm:px-6 sm:py-5 border-b flex items-center space-x-3 ${
//           isDarkMode ? "border-gray-800 bg-gray-800" : "border-gray-200 bg-gray-100"
//         }`}
//       >
//         <img
//           src={user.avatar}
//           alt="Avatar"
//           className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-teal-400 object-cover"
//         />
//         <div className="overflow-hidden min-w-0">
//           <span
//             className={`block text-xs sm:text-sm font-medium truncate ${
//               isDarkMode ? "text-gray-100" : "text-gray-800"
//             }`}
//           >
//             {user.username}
//           </span>
//           <span
//             className={`block text-[10px] sm:text-xs truncate ${
//               isDarkMode ? "text-gray-400" : "text-gray-500"
//             }`}
//           >
//             {user.email}
//           </span>
//         </div>
//       </div>

//       <nav className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6">
//         <ul className="space-y-4">
//           {/* Regular Navigation Items */}
//           {navigationItems.map((item) => {
//             const IconComponent = item.icon;
//             return (
//               <li key={item.id}>
//                 <Link
//                   to={item.path}
//                   onClick={() => isMobile && setSidebarOpen(false)}
//                   className={`flex items-center px-3 py-2 sm:px-4 sm:py-2.5 rounded-md transition-colors duration-200 ${
//                     item.isActive
//                       ? "bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white shadow-lg"
//                       : isDarkMode
//                       ? "text-gray-200 hover:bg-gray-800 hover:text-gray-100"
//                       : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
//                   }`}
//                 >
//                   <IconComponent className="mr-2 sm:mr-3 text-lg text-teal-300" />
//                   <span className="text-sm sm:text-base">{item.label}</span>
//                   {item.id === 'chatbot' && (
//                     <FaChevronRight className="text-sm opacity-50 ml-auto" />
//                   )}
//                 </Link>
//               </li>
//             );
//           })}

//           {/* Finance Group */}
//           <li>
//             <button
//               onClick={() => setFinanceOpen((prev) => !prev)}
//               className={`flex items-center w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-md transition-colors duration-200 ${
//                 financeOpen
//                   ? isDarkMode
//                     ? "bg-gray-800 text-gray-100 shadow-inner"
//                     : "bg-gray-200 text-gray-900 shadow-inner"
//                   : isDarkMode
//                   ? "text-gray-200 hover:bg-gray-800"
//                   : "text-gray-700 hover:bg-gray-200"
//               }`}
//             >
//               <FaChartLine className="mr-2 sm:mr-3 text-lg text-teal-300" />
//               <span className="flex-grow text-sm sm:text-base">Finance</span>
//               {financeOpen ? (
//                 <FaChevronDown className="text-sm opacity-75" />
//               ) : (
//                 <FaChevronRight className="text-sm opacity-50" />
//               )}
//             </button>
//             {financeOpen && (
//               <ul className="mt-2 ml-6 sm:ml-8 space-y-2">
//                 {financeItems.map((item) => (
//                   <li key={item.path}>
//                     <Link
//                       to={item.path}
//                       onClick={() => isMobile && setSidebarOpen(false)}
//                       className={`flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm ${
//                         item.isActive
//                           ? isDarkMode
//                             ? "bg-gray-700 text-gray-100"
//                             : "bg-gray-300 text-gray-900"
//                           : isDarkMode
//                           ? "text-gray-200 hover:bg-gray-800"
//                           : "text-gray-700 hover:bg-gray-200"
//                       }`}
//                     >
//                       {item.label}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </li>

//           {/* Tasks Group */}
//           <li>
//             <button
//               onClick={() => setTasksOpen((prev) => !prev)}
//               className={`flex items-center w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-md transition-colors duration-200 ${
//                 tasksOpen
//                   ? isDarkMode
//                     ? "bg-gray-800 text-gray-100 shadow-inner"
//                     : "bg-gray-200 text-gray-900 shadow-inner"
//                   : isDarkMode
//                   ? "text-gray-200 hover:bg-gray-800"
//                   : "text-gray-700 hover:bg-gray-200"
//               }`}
//             >
//               <FaTasks className="mr-2 sm:mr-3 text-lg text-teal-300" />
//               <span className="flex-grow text-sm sm:text-base">Tasks</span>
//               {tasksOpen ? (
//                 <FaChevronDown className="text-sm opacity-75" />
//               ) : (
//                 <FaChevronRight className="text-sm opacity-50" />
//               )}
//             </button>
//             {tasksOpen && (
//               <ul className="mt-2 ml-6 sm:ml-8 space-y-2">
//                 {taskItems.map((item) => (
//                   <li key={item.path}>
//                     <Link
//                       to={item.path}
//                       onClick={() => isMobile && setSidebarOpen(false)}
//                       className={`flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm ${
//                         item.isActive
//                           ? isDarkMode
//                             ? "bg-gray-700 text-gray-100"
//                             : "bg-gray-300 text-gray-900"
//                           : isDarkMode
//                           ? "text-gray-200 hover:bg-gray-800"
//                           : "text-gray-700 hover:bg-gray-200"
//                       }`}
//                     >
//                       {item.label}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </li>
//         </ul>
//       </nav>

//       <div
//         className={`px-4 py-4 sm:px-6 sm:py-6 border-t ${
//           isDarkMode ? "border-gray-800 bg-gray-800" : "border-gray-200 bg-gray-100"
//         }`}
//       >
//         <Link
//           to="/settings"
//           onClick={() => isMobile && setSidebarOpen(false)}
//           className={`flex items-center px-3 py-2 sm:px-4 sm:py-2.5 rounded-md transition-colors duration-200 ${
//             isDarkMode
//               ? "text-gray-300 hover:text-gray-100 hover:bg-gray-700"
//               : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
//           }`}
//         >
//           <FaCog className="mr-2 sm:mr-3 text-lg text-teal-300" />
//           <span className="text-sm sm:text-base">Settings</span>
//         </Link>
//         <button
//           onClick={handleLogout}
//           className="mt-3 w-full inline-flex justify-center items-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md shadow transition-transform duration-200 hover:scale-105 text-sm sm:text-base"
//         >
//           <FaSignOutAlt className="mr-2 text-lg" /> Logout
//         </button>
//       </div>
//     </>
//   ));

//   return (
//     <div
//       className={`flex flex-col min-h-screen font-sans overflow-x-hidden ${
//         isDarkMode
//           ? "bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100"
//           : "bg-gradient-to-b from-gray-100 to-gray-200 text-gray-800"
//       }`}
//     >
//       <div className="flex flex-1">
//         {/* ========================= */}
//         {/* Mobile Sidebar Drawer  */}
//         {/* ========================= */}
//         <div
//           ref={sidebarRef}
//           className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ${
//             sidebarOpen ? "translate-x-0" : "-translate-x-full"
//           }`}
//           inert={!sidebarOpen ? "" : undefined}
//         >
//           {/* semi-transparent backdrop */}
//           <div
//             className="fixed inset-0 bg-black bg-opacity-60"
//             onClick={() => setSidebarOpen(false)}
//           />
//           <aside
//             className={`relative w-64 flex flex-col shadow-xl h-full ${
//               isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
//             }`}
//           >
//             <SidebarContent isMobile={true} />
//           </aside>
//         </div>

//         {/* ========================= */}
//         {/* Static Sidebar (md+)   */}
//         {/* ========================= */}
//         <aside
//           className={`hidden md:flex md:w-72 lg:w-64 flex-col shadow-xl ${
//             isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
//           }`}
//         >
//           <SidebarContent />
//         </aside>

//         {/* ========================= */}
//         {/* Main Content       */}
//         {/* ========================= */}
//         <div className="flex-1 flex flex-col">
//           {/* Top Bar (Navbar) */}
//           <header
//             className={`sticky top-0 z-30 border-b px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3 md:py-4 flex flex-wrap justify-between items-center shadow-lg ${
//               isDarkMode
//                 ? "bg-gradient-to-r from-purple-600 to-pink-600 border-pink-700"
//                 : "bg-gradient-to-r from-purple-300 to-pink-300 border-pink-400"
//             }`}
//           >
//             {/* Left: Hamburger + Title */}
//             <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-auto">
//               <button
//                 id="openSidebarButton"
//                 ref={hamburgerRef}
//                 className={`md:hidden text-xl sm:text-2xl ${
//                   isDarkMode ? "text-gray-100" : "text-gray-800"
//                 }`}
//                 onClick={() => setSidebarOpen(true)}
//                 aria-label="Open sidebar"
//               >
//                 <FaBars />
//               </button>
//               <h2
//                 className={`text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl font-semibold truncate ${
//                   isDarkMode ? "text-gray-100" : "text-gray-800"
//                 }`}
//               >
//                 Dashboard / Profile
//               </h2>
//             </div>

//             {/* Right: Icons + Dark/Light Mode Toggle */}
//             <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mt-2 sm:mt-0">
//               <button
//                 onClick={toggleTheme}
//                 className={`text-lg sm:text-xl md:text-2xl hover:text-gray-200 transition-colors duration-200 ${
//                   isDarkMode ? "text-yellow-300" : "text-gray-700"
//                 }`}
//                 aria-label="Toggle theme"
//               >
//                 {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
//               </button>
//               <button className="relative group">
//                 <FaBell
//                   className={`text-lg sm:text-xl md:text-2xl transition-colors duration-200 ${
//                     isDarkMode ? "text-gray-100 hover:text-gray-200" : "text-gray-700 hover:text-gray-900"
//                   }`}
//                 />
//                 {user.notifications > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2 ring-2 ring-gray-900" />
//                 )}
//                 <div
//                   className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-1 w-max text-[10px] sm:text-xs md:text-sm px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
//                     isDarkMode ? "bg-gray-800 text-gray-100" : "bg-gray-200 text-gray-800"
//                   }`}
//                 >
//                   Notifications
//                 </div>
//               </button>
//               <FaUserCircle
//                 className={`text-lg sm:text-xl md:text-2xl ${
//                   isDarkMode ? "text-gray-100" : "text-gray-700"
//                 }`}
//               />
//             </div>
//           </header>

//           {/* Main Scrollable Area */}
//           <main
//             className={`flex-1 overflow-auto py-4 ${
//               isDarkMode
//                 ? "bg-gradient-to-b from-gray-900 to-gray-800"
//                 : "bg-gradient-to-b from-gray-200 to-gray-100"
//             }`}
//           >
//             {/* Centered container, up to 7xl wide */}
//             <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 space-y-8">
//               {/* Profile Header Card */}
//               <div className="bg-gradient-to-r from-teal-600 to-indigo-600 text-gray-100 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col md:flex-row items-center md:justify-between">
//                 {/* Left text block */}
//                 <div className="min-w-0">
//                   <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold truncate">
//                     Welcome, {user.username}!
//                   </h1>
//                   <p className="text-teal-200 mt-1 text-xs sm:text-sm md:text-base lg:text-lg">
//                     Here's your profile overview
//                   </p>
//                 </div>

//                 {/* Right avatar block */}
//                 <div className="mt-4 md:mt-0 flex items-center bg-indigo-600 bg-opacity-20 rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-lg">
//                   <img
//                     src={user.avatar}
//                     alt="User Avatar"
//                     className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full border-2 border-gray-100 object-cover mr-3 sm:mr-4"
//                   />
//                   <div className="min-w-0">
//                     <span className="block text-base sm:text-lg md:text-xl lg:text-2xl font-semibold truncate">
//                       {user.username}
//                     </span>
//                     <span className="block text-[10px] sm:text-xs md:text-sm lg:text-base text-teal-200 truncate">
//                       {user.email}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Info Cards Grid */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
//                 {/* Qualification Card */}
//                 <div
//                   className={`rounded-lg border-t-4 border-indigo-400 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-200 ${
//                     isDarkMode ? "bg-gray-800" : "bg-white"
//                   }`}
//                 >
//                   <FaGraduationCap className="text-3xl sm:text-4xl md:text-5xl text-indigo-400 mb-2 sm:mb-3" />
//                   <h3
//                     className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-1 sm:mb-2 truncate ${
//                       isDarkMode ? "text-gray-100" : "text-gray-800"
//                     }`}
//                   >
//                     Qualification
//                   </h3>
//                   <p
//                     className={`text-center text-xs sm:text-sm md:text-base lg:text-lg ${
//                       isDarkMode ? "text-gray-300" : "text-gray-600"
//                     }`}
//                   >
//                     {user.highestQualification}
//                   </p>
//                 </div>

//                 {/* Balance Card */}
//                 <div
//                   className={`rounded-lg border-t-4 border-teal-400 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-200 ${
//                     isDarkMode ? "bg-gray-800" : "bg-white"
//                   }`}
//                 >
//                   <FaMoneyBillWave className="text-3xl sm:text-4xl md:text-5xl text-teal-400 mb-2 sm:mb-3" />
//                   <h3
//                     className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-1 sm:mb-2 truncate ${
//                       isDarkMode ? "text-gray-100" : "text-gray-800"
//                     }`}
//                   >
//                     Balance
//                   </h3>
//                   <p
//                     className={`text-center text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold ${
//                       isDarkMode ? "text-gray-300" : "text-gray-700"
//                     }`}
//                   >
//                     ₹{user.balance.toFixed(2)}
//                   </p>
//                 </div>

//                 {/* Hobbies Card */}
//                 <div
//                   className={`rounded-lg border-t-4 border-amber-400 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-200 ${
//                     isDarkMode ? "bg-gray-800" : "bg-white"
//                   }`}
//                 >
//                   <FaStar className="text-3xl sm:text-4xl md:text-5xl text-amber-400 mb-2 sm:mb-3" />
//                   <h3
//                     className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-1 sm:mb-2 truncate ${
//                       isDarkMode ? "text-gray-100" : "text-gray-800"
//                     }`}
//                   >
//                     Hobbies
//                   </h3>
//                   <p
//                     className={`text-center text-xs sm:text-sm md:text-base lg:text-lg ${
//                       isDarkMode ? "text-gray-300" : "text-gray-600"
//                     }`}
//                   >
//                     {user.hobbies.join(", ")}
//                   </p>
//                 </div>
//               </div>

//               {/* Dashboard Buttons */}
//               <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-start sm:space-x-4 md:space-x-6 lg:space-x-8 space-y-3 sm:space-y-0">
//                 <Link to="/finance/dashboard" className="w-full sm:w-auto">
//                   <button className="w-full inline-flex justify-center items-center bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-gray-100 font-semibold py-2 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 rounded-lg shadow-2xl transition-transform duration-200 hover:scale-105 text-sm sm:text-base md:text-lg lg:text-xl">
//                     <FaChartLine className="mr-2 sm:mr-3" />
//                     Finance Dashboard
//                   </button>
//                 </Link>
//                 <Link to="/todo/dashboard" className="w-full sm:w-auto">
//                   <button className="w-full inline-flex justify-center items-center bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-gray-100 font-semibold py-2 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 rounded-lg shadow-2xl transition-transform duration-200 hover:scale-105 text-sm sm:text-base md:text-lg lg:text-xl">
//                     <FaTasks className="mr-2 sm:mr-3" />
//                     Todo Dashboard
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }


