import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaMoneyBillWave,
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
  FaPlusCircle,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";
import { Sun, Moon, Activity, TrendingUp, TrendingDown, ArrowRight, Calendar, DollarSign, Target, CheckCircle } from 'lucide-react';
import { useTheme } from "../src/theme/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";

// --- Custom Hooks ---

const useAuth = () => {
  const navigate = useNavigate();
  
  const logout = useCallback(() => {
    try {
      localStorage.removeItem("authToken");
      sessionStorage.clear();
      navigate("/", { replace: true });
      // In a real app, you might also hit a logout API endpoint here
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback in case of localStorage issues
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

  useEffect(() => {
    if (!sidebarRef.current) return;

    if (isOpen) {
      // Ensure sidebar is interactive when open
      sidebarRef.current.removeAttribute("inert");
      // Focus on the first focusable element for accessibility
      const firstFocusable = sidebarRef.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
      }
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      // Make sidebar non-interactive when closed
      sidebarRef.current.setAttribute("inert", "");
      if (hamburgerRef.current) {
        hamburgerRef.current.focus(); // Return focus to hamburger button
      }
      document.body.style.overflow = ''; // Restore background scroll
    }
    // Clean up on component unmount or isOpen change
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeSidebar();
      }
    };

    const handleClickOutside = (e) => {
      // Close sidebar if click is outside sidebar and hamburger button
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
    } 

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
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

// Simulated data fetching hook
const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        // Simulate a successful data fetch
        const data = {
          id: "user_123",
          username: "Indian",
          email: "johndoe@example.com",
          firstName: "Indian",
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
            monthlyIncome: 8000,
            monthlyExpenses: 3500,
            monthlyGoal: 50000,
            currentStreak: 7 
          },
          recentActivities: [
            { type: "task", description: "Completed 'Prepare Q3 Report'", date: "2025-06-26", status: "completed" },
            { type: "finance", description: "Added ₹1,200 for Groceries", date: "2025-06-25", category: "Food" },
            { type: "task", description: "Started 'Learn React Hooks'", date: "2025-06-24", status: "in-progress" },
            { type: "finance", description: "Received ₹5,000 from Client X", date: "2025-06-23", category: "Income" },
            { type: "task", description: "Reviewed project proposal", date: "2025-06-22", status: "completed" },
            { type: "finance", description: "Paid electricity bill ₹800", date: "2025-06-21", category: "Utilities" },
          ],
          goals: [
            { id: 1, name: "Save for new laptop", target: 80000, current: 45000, dueDate: "2025-12-31" },
            { id: 2, name: "Complete 100 tasks", target: 100, current: 38, dueDate: "2025-09-30" },
            { id: 3, name: "Invest ₹10,000", target: 10000, current: 7500, dueDate: "2025-08-15" },
          ]
        };

        // Simulate an error randomly for demonstration
        // if (Math.random() > 0.8) {
        //   throw new Error("Failed to load user data. Please try again.");
        // }

        setUserData(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message || "An unknown error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array means this runs once on mount

  return { userData, loading, error };
};

// --- Main Component ---

export default function UserProfilePage() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const { isOpen: sidebarOpen, openSidebar, closeSidebar, sidebarRef, hamburgerRef } = useSidebar();
  const { userData: user, loading, error } = useUserData(); // Destructure user data, loading, and error
  
  const location = useLocation();
  const currentPath = location.pathname;
  const isDarkMode = theme === 'dark';

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

  // Simplified navigation configuration
  const navigationConfig = useMemo(() => ({
    main: [
      { id: 'dashboard', path: '/dashboard', icon: FaHome, label: 'Dashboard', isActive: currentPath === '/dashboard' },
      { id: 'profile', path: '/edit-profile', icon: FaUserCircle, label: 'Profile', isActive: currentPath === '/edit-profile' },
      { id: 'chatbot', path: '/chatbot', icon: FaRobot, label: 'AI Assistant', isActive: currentPath === '/chatbot' }
    ],
    finance: [
      { path: '/finance/dashboard', label: 'Overview', icon: TrendingUp, isActive: currentPath === '/finance/dashboard' },
      { path: '/finance/add', label: 'Add Transaction', icon: FaMoneyBillWave, isActive: currentPath === '/finance/add' },
      { path: '/finance/report', label: 'Analytics', icon: FaChartLine, isActive: currentPath === '/finance/report' },
      { path: '/finance/budget', label: 'Budget Planner', icon: Target, isActive: currentPath === '/finance/budget' }
    ],
    tasks: [
      { path: '/todo/dashboard', label: 'Task Overview', icon: Activity, isActive: currentPath === '/todo/dashboard' },
      { path: '/addtask', label: 'Create Task', icon: FaTasks, isActive: currentPath === '/addtask' },
      { path: '/todo/calendar', label: 'Calendar', icon: Calendar, isActive: currentPath === '/todo/calendar' }
    ]
  }), [currentPath]);

  // Enhanced stats calculations, dependent on user data
  const enhancedStats = useMemo(() => {
    if (!user) return null; // Return null if user data isn't loaded yet

    const completionRate = user.stats.totalTasks > 0 
      ? Math.round((user.stats.completedTasks / user.stats.totalTasks) * 100) 
      : 0;
    const goalProgress = user.stats.monthlyGoal > 0 
      ? Math.round((user.balance / user.stats.monthlyGoal) * 100) 
      : 0;
    
    return {
      ...user.stats,
      completionRate,
      goalProgress: Math.min(goalProgress, 100)
    };
  }, [user]); // Recalculate only when user object changes

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

      {/* User Info (display only if user data is available) */}
      {user && (
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
      )}

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

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => (
    <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg border ${themeClasses.border} transition-all duration-300 ${themeClasses.cardHover} min-w-0`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${themeClasses.textMuted} truncate`}>{title}</p>
          <p className={`text-2xl sm:text-3xl font-bold ${themeClasses.text} mt-1 break-all truncate`} style={{ fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
            ₹{typeof value === 'number' ? value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}
          </p>
          {trend && (
            <p className={`text-sm flex items-center mt-2 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {Math.abs(trend)}%
            </p>
          )}
        </div>
        <Icon className={`w-8 h-8 text-${color}-500 flex-shrink-0`} />
      </div>
    </div>
  );

  // Professional stats cards configuration
  const statsCards = useMemo(() => {
    if (!user || !enhancedStats) return [];

    const netIncome = user.stats.monthlyIncome - user.stats.monthlyExpenses;
    const savingsRate = user.stats.monthlyIncome > 0 ? Math.round((netIncome / user.stats.monthlyIncome) * 100) : 0;

    return [
      {
        id: 'balance',
        title: 'Total Balance',
        value: `₹${user.balance.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`,
        icon: DollarSign,
        color: 'emerald',
        gradient: 'from-emerald-500 to-teal-600',
        subtitle: 'Available funds',
        trend: savingsRate > 0 ? savingsRate : null
      },
      {
        id: 'monthly-income',
        title: 'Monthly Income',
        value: `₹${user.stats.monthlyIncome.toLocaleString('en-IN')}`,
        icon: TrendingUp,
        color: 'blue',
        gradient: 'from-blue-500 to-indigo-600',
        subtitle: 'This month'
      },
      {
        id: 'monthly-expenses',
        title: 'Monthly Expenses',
        value: `₹${user.stats.monthlyExpenses.toLocaleString('en-IN')}`,
        icon: TrendingDown,
        color: 'red',
        gradient: 'from-red-500 to-rose-600',
        subtitle: 'This month'
      },
      {
        id: 'tasks',
        title: 'Task Completion',
        value: `${enhancedStats.completionRate}%`,
        icon: CheckCircle,
        color: 'purple',
        gradient: 'from-purple-500 to-violet-600',
        subtitle: `${user.stats.completedTasks} of ${user.stats.totalTasks} tasks`
      },
    ];
  }, [user, enhancedStats]);

  // --- Render Logic for Loading/Error/Content ---

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
        <FaSpinner className="animate-spin text-5xl text-teal-500" />
        <p className="ml-4 text-xl font-semibold">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-8 text-center ${isDarkMode ? "bg-gray-900 text-red-400" : "bg-gray-100 text-red-600"}`}>
        <FaExclamationTriangle className="text-6xl mb-4" />
        <h2 className="text-3xl font-bold mb-2">Oops! Something went wrong.</h2>
        <p className="text-lg mb-4">{error}</p>
        <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          We couldn't load your profile data. Please try refreshing the page or contact support if the issue persists.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // If not loading and no error, render the content
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
                    Welcome back, {user.firstName}!
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <ThemeToggle variant="minimal" size="default" />
                
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
              {/* Welcome Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                  <h1 className={`text-3xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                    Welcome back, {user.firstName}
                  </h1>
                  <p className={`text-lg mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Here's your financial and productivity overview
                  </p>
                </div>
                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                  <img
                    src={user.avatar}
                    alt={`${user.username}'s avatar`}
                    className="w-12 h-12 rounded-full border-2 border-teal-400 object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className={`font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                      {user.username}
                    </p>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Member since {new Date(user.joinDate).getFullYear()}
                    </p>
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
                      className={`relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${
                        isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-br ${card.gradient}`}>
                            <IconComponent className="text-xl text-white" />
                          </div>
                          {card.trend && (
                            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                              card.trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {card.trend > 0 ? '+' : ''}{card.trend}%
                            </span>
                          )}
                        </div>
                        <h3 className={`text-sm font-medium mb-1 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
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
                            isDarkMode ? "text-gray-500" : "text-gray-500"
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
                <h3 className={`text-xl font-semibold ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Link
                    to="/finance/dashboard"
                    className={`group flex items-center p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      isDarkMode 
                        ? "bg-gray-800 border-gray-700 hover:border-indigo-500" 
                        : "bg-white border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                      <FaChartLine className="text-indigo-600 text-lg" />
                    </div>
                    <div>
                      <h4 className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                        Finance
                      </h4>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Manage expenses
                      </p>
                    </div>
                    <ArrowRight className="ml-auto text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  </Link>

                  <Link
                    to="/todo/dashboard"
                    className={`group flex items-center p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      isDarkMode 
                        ? "bg-gray-800 border-gray-700 hover:border-amber-500" 
                        : "bg-white border-gray-200 hover:border-amber-300"
                    }`}
                  >
                    <div className="p-2 bg-amber-100 rounded-lg mr-3">
                      <FaTasks className="text-amber-600 text-lg" />
                    </div>
                    <div>
                      <h4 className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                        Tasks
                      </h4>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Stay productive
                      </p>
                    </div>
                    <ArrowRight className="ml-auto text-gray-400 group-hover:text-amber-500 transition-colors" />
                  </Link>

                  <Link
                    to="/chatbot"
                    className={`group flex items-center p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      isDarkMode 
                        ? "bg-gray-800 border-gray-700 hover:border-teal-500" 
                        : "bg-white border-gray-200 hover:border-teal-300"
                    }`}
                  >
                    <div className="p-2 bg-teal-100 rounded-lg mr-3">
                      <FaRobot className="text-teal-600 text-lg" />
                    </div>
                    <div>
                      <h4 className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                        AI Assistant
                      </h4>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Get help
                      </p>
                    </div>
                    <ArrowRight className="ml-auto text-gray-400 group-hover:text-teal-500 transition-colors" />
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xl font-semibold ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}>
                    Recent Activity
                  </h3>
                  <Link
                    to="/edit-profile"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isDarkMode 
                        ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700" 
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    <FaEdit className="mr-2 text-sm" /> Edit Profile
                  </Link>
                </div>

                {user.recentActivities.length > 0 ? (
                  <div className={`rounded-xl shadow-sm ${
                    isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                  }`}>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {user.recentActivities.slice(0, 5).map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-4">
                          <div className="flex items-center">
                            {activity.type === 'task' ? (
                              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                <FaTasks className="text-blue-600 text-sm" />
                              </div>
                            ) : (
                              <div className="p-2 bg-green-100 rounded-lg mr-3">
                                <FaMoneyBillWave className="text-green-600 text-sm" />
                              </div>
                            )}
                            <div>
                              <p className={`font-medium text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                                {activity.description}
                              </p>
                              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                {new Date(activity.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {activity.status && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              activity.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {activity.status}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={`p-8 rounded-xl shadow-sm text-center ${
                    isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                  }`}>
                    <p className={`text-lg mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      No recent activity to display
                    </p>
                    <p className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                      Start by adding a task or transaction to see your activity here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}









