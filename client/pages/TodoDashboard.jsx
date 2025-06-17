import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'animate.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {
  CheckCircle2,
  Calendar,
  ClipboardList,
  PlusCircle,
  Trash2,
  Edit2,
  Eye,
  AlertCircle,
  RefreshCw,
  Filter,
  X,
  TrendingUp,
  Clock,
  Target,
  Zap,
  BarChart3,
  Settings,
  Bell,
  User,
  ChevronDown,
  Search,
  Moon,
  Sun,
  Sparkles
} from 'lucide-react';
import baseUrl from '../api/api';
import { useTheme } from '../src/theme/ThemeProvider'; // <-- Add this import

// --- TaskCard Component (Previously Missing) ---
// This component renders individual task cards for the Kanban-style priority board.
const TaskCard = ({ task, onMarkDone, onDelete, actionLoading, themeClasses }) => {
  return (
    <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200 animate__animated animate__fadeIn`}>
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <p className={`font-semibold ${themeClasses.text} truncate ${task.completed ? `line-through ${themeClasses.textSecondary}` : ''}`}>
            {task.title}
          </p>
          <p className={`${themeClasses.textSecondary} text-xs mt-1 line-clamp-2`}>
            {task.description}
          </p>
        </div>
        <div className="flex flex-col items-center space-y-2 ml-2 flex-shrink-0">
          {!task.completed && (
            <button
              onClick={() => onMarkDone(task.id, task.title)}
              disabled={actionLoading[task.id] === 'marking'}
              className="p-1.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition disabled:opacity-50"
              title="Mark Done"
            >
              {actionLoading[task.id] === 'marking' ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}
          <Link
            to={`/todo/edit/${task.id}`}
            className="p-1.5 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition"
            title="Edit Task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => onDelete(task.id, task.title)}
            disabled={actionLoading[task.id] === 'deleting'}
            className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition disabled:opacity-50"
            title="Delete Task"
          >
            {actionLoading[task.id] === 'deleting' ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
          </button>
        </div>
      </div>
    </div>
  );
};


const TodoDashboard = () => {
  // THEME: use shared provider
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  // State management
  const [allTasks, setAllTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const tasksPerPage = 6;

  // Filter states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [showNotDoneOnly, setShowNotDoneOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  const months = [
    'All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const currentYear = new Date().getFullYear();
  const years = ['All', ...Array.from({ length: 5 }, (_, i) => String(currentYear + i))];

  // Theme classes
  const themeClasses = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200/50',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white/90'
  };

  // Utility functions
  const getToken = useCallback(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('No authentication token found. Please login again.');
      setTimeout(() => navigate('/login'), 2000);
      return null;
    }
    return token;
  }, [navigate]);

  const normalizeDate = (dateString) => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // API functions
  const fetchTasks = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await baseUrl.get('/api/tasks?page=0&size=100', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.data) {
        throw new Error('No data received from server');
      }

      const pageObj = response.data;
      const rawArray = Array.isArray(pageObj.content) ? pageObj.content : 
                       Array.isArray(pageObj) ? pageObj : [];

      const normalized = rawArray.map((task) => {
        if (!task || typeof task !== 'object') {
          console.warn('Invalid task object:', task);
          return null;
        }
        
        return {
          id: task.id || Math.random().toString(36).substr(2, 9),
          title: task.title || 'Untitled Task',
          description: task.description || '',
          dueDate: normalizeDate(task.dueDate),
          dateAdded: normalizeDate(task.dateAdded || task.createdAt),
          priority: task.priority || 'medium',
          completed: Boolean(task.completed),
          category: task.category || 'general'
        };
      }).filter(Boolean);

      setAllTasks(normalized);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      const errorMessage = err.response?.data?.message || 
                             err.message || 
                             'Failed to fetch tasks. Please try again.';
      setError(errorMessage);
      
      if (err.response?.status === 401) {
        localStorage.removeItem('authToken');
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [getToken, navigate]);

  const handleDelete = async (id) => {
    const token = getToken();
    if (!token) return;

    try {
      setActionLoading(prev => ({ ...prev, [id]: 'deleting' }));
      
      await baseUrl.delete(`/api/tasks/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      await fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      const errorMessage = err.response?.data?.message || 
                             'Failed to delete task. Please try again.';
      setError(errorMessage);
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleMarkDone = async (id) => {
    const token = getToken();
    if (!token) return;

    try {
      setActionLoading(prev => ({ ...prev, [id]: 'marking' }));
      
      await baseUrl.put(
        `/api/tasks/${id}/complete`,
        {},
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      await fetchTasks();
    } catch (err) {
      console.error('Error marking task as done:', err);
      const errorMessage = err.response?.data?.message || 
                             'Failed to mark task as done. Please try again.';
      setError(errorMessage);
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }));
    }
  };

  // Confirmation dialogs
  const confirmDelete = (id, title) => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className={`p-8 rounded-2xl shadow-2xl animate__animated animate__fadeInUp ${themeClasses.cardBg} ${themeClasses.text} border ${themeClasses.border}`}>
          <h1 className="text-2xl font-bold mb-4">Confirm Deletion</h1>
          <p className={`mb-6 ${themeClasses.textSecondary}`}>Are you sure you want to delete "{title}"?</p>
          <div className="flex justify-end space-x-4">
             <button onClick={onClose} className="bg-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-400 transition-all duration-200 font-medium">
                Cancel
             </button>
             <button
                onClick={() => {
                   handleDelete(id);
                   onClose();
                }}
                className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-200 font-medium"
             >
                Yes, Delete
             </button>
          </div>
        </div>
      ),
      overlayClassName: 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50'
    });
  };

  const confirmMarkDone = (id, title) => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className={`p-8 rounded-2xl shadow-2xl animate__animated animate__fadeInUp ${themeClasses.cardBg} ${themeClasses.text} border ${themeClasses.border}`}>
          <h1 className="text-2xl font-bold mb-4">Confirm Completion</h1>
          <p className={`mb-6 ${themeClasses.textSecondary}`}>Mark "{title}" as completed?</p>
          <div className="flex justify-end space-x-4">
             <button onClick={onClose} className="bg-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-400 transition-all duration-200 font-medium">
                Cancel
             </button>
             <button
                onClick={() => {
                   handleMarkDone(id);
                   onClose();
                }}
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-200 font-medium"
             >
                Yes, Complete
             </button>
          </div>
        </div>
      ),
      overlayClassName: 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50'
    });
  };

  // Data processing and filtering for stats
  const tasksDueToday = allTasks.filter((t) => t.dueDate === todayStr);
  const totalTodayCount = tasksDueToday.length;
  const completedTodayCount = tasksDueToday.filter((t) => t.completed).length;
  const pendingTodayCount = totalTodayCount - completedTodayCount;
  const todayHighPriority = tasksDueToday.filter((t) => t.priority === 'high');
  const todayMediumPriority = tasksDueToday.filter((t) => t.priority === 'medium');
  const todayLowPriority = tasksDueToday.filter((t) => t.priority === 'low');
  const completionRate = allTasks.length > 0 ? Math.round((allTasks.filter(t => t.completed).length / allTasks.length) * 100) : 0;
  
  // Advanced filtering logic for main list
  let filteredTodos = allTasks.filter((task) => {
    const d = task.dueDate;

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = task.title.toLowerCase().includes(searchLower) ||
                            task.description.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    
    if (!selectedDate && selectedMonth === 'All' && selectedYear === 'All') {
        return true;
    }

    if (!d) return false;

    if (selectedDate) {
      return d === selectedDate;
    } else {
      try {
        const dt = new Date(d);
        if (isNaN(dt.getTime())) return false;
        
        const m = dt.getMonth();
        const y = dt.getFullYear();
        const monthMatch = selectedMonth === 'All' || m === months.indexOf(selectedMonth) - 1;
        const yearMatch = selectedYear === 'All' || y === parseInt(selectedYear, 10);
        return monthMatch && yearMatch;
      } catch {
        return false;
      }
    }
  });

  if (showNotDoneOnly) {
    filteredTodos = filteredTodos.filter((t) => !t.completed);
  }

  const filteredSortedByDue = [...filteredTodos].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    
    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;
    return dateA - dateB;
  });

  // --- NEW: Counts for the filtered list ---
  const filteredTotal = filteredSortedByDue.length;
  const filteredCompleted = filteredSortedByDue.filter(t => t.completed).length;
  const filteredPending = filteredTotal - filteredCompleted;

  // Pagination logic
  const indexOfLast = currentPage * tasksPerPage;
  const indexOfFirst = indexOfLast - tasksPerPage;
  const currentTasks = filteredSortedByDue.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSortedByDue.length / tasksPerPage);

  const goNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  
  const goPrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  // Filter handlers
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    if (e.target.value) {
      setSelectedMonth('All');
      setSelectedYear('All');
    }
    setCurrentPage(1);
  };

  const handleMonthChange = (e) => {
    setSelectedDate('');
    setSelectedMonth(e.target.value);
    setCurrentPage(1);
  };

  const handleYearChange = (e) => {
    setSelectedDate('');
    setSelectedYear(e.target.value);
    setCurrentPage(1);
  };

  const handleToggleNotDone = () => {
    setShowNotDoneOnly((prev) => !prev);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedDate('');
    setSelectedMonth('All');
    setSelectedYear('All');
    setShowNotDoneOnly(false);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No date';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'low': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white';
    }
  };

  // Effects
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (loading) {
      document.body.classList.add('arth-bg-loading');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';
      document.documentElement.style.overscrollBehavior = 'none';
    } else {
      document.body.classList.remove('arth-bg-loading');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.overscrollBehavior = '';
      document.documentElement.style.overscrollBehavior = '';
    }
    return () => {
      document.body.classList.remove('arth-bg-loading');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.overscrollBehavior = '';
      document.documentElement.style.overscrollBehavior = '';
    };
  }, [loading]);

  // Loading state
  if (loading) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center min-h-screen ${themeClasses.bg}`}>
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <Sparkles className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className={`${themeClasses.textSecondary} text-lg font-medium`}>Loading your personal workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.bg} transition-all `}>
      {/* Premium Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                    Personal Command Center
                  </h1>
                  <p className="text-blue-100 text-lg font-medium">Your productivity workspace</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-white/90">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">{new Date().toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-medium">{completionRate}% Complete</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200"
                title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
              </button>
              <Link
                to="/addtask"
                className="inline-flex items-center bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                New Task
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-xl shadow-lg animate__animated animate__fadeIn">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
              <p className="text-red-700 font-medium">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Premium Stats Cards */}
        <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                <div className="flex items-center justify-between">
                <div>
                    <p className={`${themeClasses.textSecondary} text-sm font-medium`}>Today's Tasks</p>
                    <p className={`${themeClasses.text} text-3xl font-bold mt-1`}>{totalTodayCount}</p>
                    <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500 text-sm font-medium">Active</span>
                    </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                </div>
                </div>
            </div>

            <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                <div className="flex items-center justify-between">
                <div>
                    <p className={`${themeClasses.textSecondary} text-sm font-medium`}>Completed</p>
                    <p className={`${themeClasses.text} text-3xl font-bold mt-1`}>{completedTodayCount}</p>
                    <div className="flex items-center mt-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500 text-sm font-medium">Done</span>
                    </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                </div>
            </div>

            <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                <div className="flex items-center justify-between">
                <div>
                    <p className={`${themeClasses.textSecondary} text-sm font-medium`}>Pending</p>
                    <p className={`${themeClasses.text} text-3xl font-bold mt-1`}>{pendingTodayCount}</p>
                    <div className="flex items-center mt-2">
                    <Clock className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-yellow-500 text-sm font-medium">Waiting</span>
                    </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                </div>
                </div>
            </div>

            <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                <div className="flex items-center justify-between">
                <div>
                    <p className={`${themeClasses.textSecondary} text-sm font-medium`}>Completion Rate</p>
                    <p className={`${themeClasses.text} text-3xl font-bold mt-1`}>{completionRate}%</p>
                    <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 mt-2`}>
                    <div 
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${completionRate}%` }}
                    ></div>
                    </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                </div>
                </div>
            </div>
            </div>
        </section>

        {/* Priority Kanban Board */}
        <section>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-2xl overflow-hidden shadow-lg`}>
                <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold text-lg flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    High Priority
                    </h3>
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {todayHighPriority.length}
                    </span>
                </div>
                </div>
                <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
                {todayHighPriority.length === 0 ? (
                    <div className="text-center py-8">
                    <Target className={`w-12 h-12 ${themeClasses.textSecondary} mx-auto mb-2 opacity-50`} />
                    <p className={`${themeClasses.textSecondary} text-sm`}>No high-priority tasks today</p>
                    </div>
                ) : (
                    todayHighPriority.map((task) => (
                    <TaskCard key={task.id} task={task} onMarkDone={confirmMarkDone} onDelete={confirmDelete} actionLoading={actionLoading} themeClasses={themeClasses} />
                    ))
                )}
                </div>
            </div>
            <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-2xl overflow-hidden shadow-lg`}>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold text-lg flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Medium Priority
                    </h3>
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {todayMediumPriority.length}
                    </span>
                </div>
                </div>
                <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
                {todayMediumPriority.length === 0 ? (
                    <div className="text-center py-8">
                    <ClipboardList className={`w-12 h-12 ${themeClasses.textSecondary} mx-auto mb-2 opacity-50`} />
                    <p className={`${themeClasses.textSecondary} text-sm`}>No medium-priority tasks today</p>
                    </div>
                ) : (
                    todayMediumPriority.map((task) => (
                    <TaskCard key={task.id} task={task} onMarkDone={confirmMarkDone} onDelete={confirmDelete} actionLoading={actionLoading} themeClasses={themeClasses} />
                    ))
                )}
                </div>
            </div>
            <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-2xl overflow-hidden shadow-lg`}>
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold text-lg flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Low Priority
                    </h3>
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {todayLowPriority.length}
                    </span>
                </div>
                </div>
                <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
                {todayLowPriority.length === 0 ? (
                    <div className="text-center py-8">
                    <Calendar className={`w-12 h-12 ${themeClasses.textSecondary} mx-auto mb-2 opacity-50`} />
                    <p className={`${themeClasses.textSecondary} text-sm`}>No low-priority tasks today</p>
                    </div>
                ) : (
                    todayLowPriority.map((task) => (
                    <TaskCard key={task.id} task={task} onMarkDone={confirmMarkDone} onDelete={confirmDelete} actionLoading={actionLoading} themeClasses={themeClasses} />
                    ))
                )}
                </div>
            </div>
            </div>
        </section>

        {/* My Todos List */}
        <section className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-2xl p-6 shadow-lg animate__animated animate__fadeInUp`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className={`text-2xl font-bold ${themeClasses.text} flex items-center`}>
                    <ClipboardList className="w-6 h-6 mr-3" />
                    All My Tasks
                </h2>
                <button 
                    onClick={() => setShowFilters(!showFilters)} 
                    className={`flex items-center space-x-2 p-2 rounded-lg ${themeClasses.hover} transition-colors md:hidden`}
                >
                    <Filter className="w-5 h-5" />
                    <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                </button>
            </div>
            
            <div className={`${showFilters ? 'block' : 'hidden'} md:block animate__animated animate__fadeIn mb-6`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 border rounded-xl ${themeClasses.border}">
                    <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
                        <Search className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${themeClasses.textSecondary}`} />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${themeClasses.bg} ${themeClasses.border} ${themeClasses.text}`}
                        />
                    </div>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${themeClasses.bg} ${themeClasses.border} ${themeClasses.text}`}
                    />
                    <select value={selectedMonth} onChange={handleMonthChange} className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${themeClasses.bg} ${themeClasses.border} ${themeClasses.text}`}>
                        {months.map((m) => (<option key={m} value={m}>{m}</option>))}
                    </select>
                    <select value={selectedYear} onChange={handleYearChange} className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${themeClasses.bg} ${themeClasses.border} ${themeClasses.text}`}>
                        {years.map((y) => (<option key={y} value={y}>{y}</option>))}
                    </select>
                    <div className="flex items-center justify-between col-span-1 sm:col-span-2 lg:col-span-1 gap-2">
                         <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" checked={showNotDoneOnly} onChange={handleToggleNotDone} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <span className={`text-sm ${themeClasses.textSecondary}`}>Pending Only</span>
                        </label>
                        <button onClick={clearAllFilters} className={`flex items-center space-x-1 text-sm text-blue-500 hover:underline`}>
                            <X className="w-4 h-4" />
                            <span>Clear</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- NEW: Filtered Task Counter --- */}
            <div className={`flex flex-wrap gap-x-4 gap-y-2 mb-4 p-3 rounded-lg border ${themeClasses.border} ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className={`flex items-center space-x-2 text-sm font-medium ${themeClasses.textSecondary}`}>
                    <span className="font-semibold text-base text-blue-500">{filteredTotal}</span>
                    <span>Total Tasks</span>
                </div>
                <div className="flex-grow border-l border-gray-300 dark:border-gray-600"></div>
                <div className={`flex items-center space-x-2 text-sm font-medium ${themeClasses.textSecondary}`}>
                    <span className="font-semibold text-base text-yellow-500">{filteredPending}</span>
                    <span>Pending</span>
                </div>
                <div className="flex-grow border-l border-gray-300 dark:border-gray-600"></div>
                <div className={`flex items-center space-x-2 text-sm font-medium ${themeClasses.textSecondary}`}>
                    <span className="font-semibold text-base text-green-500">{filteredCompleted}</span>
                    <span>Completed</span>
                </div>
            </div>

            <div className={`divide-y ${themeClasses.border}`}>
            {filteredSortedByDue.length === 0 ? (
                <div className="text-center py-12">
                    <ClipboardList className={`w-16 h-16 ${themeClasses.textSecondary} mx-auto mb-4 opacity-50`} />
                    <p className={`text-lg font-semibold ${themeClasses.text}`}>No Tasks Found</p>
                    <p className={`${themeClasses.textSecondary}`}>Try adjusting your filters or add a new task.</p>
                </div>
            ) : (
                currentTasks.map((task) => (
                <div
                    key={task.id}
                    className={`py-5 px-4 flex flex-col md:flex-row justify-between items-start md:items-center ${themeClasses.hover} transition duration-200 rounded-lg`}
                >
                    <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center flex-wrap">
                            <p className={`font-semibold text-lg truncate ${themeClasses.text} ${task.completed ? 'line-through text-gray-400' : ''}`}>
                            {task.title}
                            </p>
                            {task.completed && <span className="ml-3 my-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Completed</span>}
                        </div>
                        <p className={`mt-1 text-sm ${themeClasses.textSecondary} line-clamp-2`}>{task.description}</p>
                        <div className="flex items-center flex-wrap mt-3 space-x-4 text-sm">
                            <div className={`flex items-center ${themeClasses.textSecondary}`}>
                            <Calendar className="w-4 h-4 mr-1.5" />
                            Due: <span className="font-medium ml-1">{formatDate(task.dueDate)}</span>
                            </div>
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(task.priority)}`}>
                                <span className="capitalize">{task.priority}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 md:mt-0 flex-shrink-0">
                        {!task.completed && (
                        <button
                            onClick={() => confirmMarkDone(task.id, task.title)}
                            disabled={actionLoading[task.id] === 'marking'}
                            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                            title="Mark Done"
                        >
                            {actionLoading[task.id] === 'marking' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        )}
                        <Link
                            to={`/todo/edit/${task.id}`}
                            className="p-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                            title="Edit Task"
                        >
                            <Edit2 className="w-4 h-4" />
                        </Link>
                        <Link
                            to={`/todo/view/${task.id}`}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            title="View Details"
                        >
                            <Eye className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={() => confirmDelete(task.id, task.title)}
                            disabled={actionLoading[task.id] === 'deleting'}
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                            title="Delete Task"
                        >
                            {actionLoading[task.id] === 'deleting' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                ))
            )}
            </div>

            {totalPages > 1 && (
                <div className={`flex justify-between items-center mt-6 pt-6 border-t ${themeClasses.border}`}>
                    <button
                        onClick={goPrev}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg font-medium transition ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        Previous
                    </button>
                    <span className={`${themeClasses.textSecondary}`}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={goNext}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
      </main>
    </div>
  );
};

export default TodoDashboard;

