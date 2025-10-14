import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'animate.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
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
  Sparkles,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Shield,
  Download,
  FileText,
  Printer,
  Timer,
  CheckSquare,
  Square,
  Flag,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from 'lucide-react';
import baseUrl from '../api/api';
import { useTheme } from '../src/theme/ThemeProvider'; // <-- Add this import

// Enhanced TaskCard Component
const TaskCard = ({ task, onMarkDone, onDelete, actionLoading, themeClasses }) => {
  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return <Flag className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default: return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div className={`${themeClasses.cardBg} border-2 ${themeClasses.border} rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 animate__animated animate__fadeIn group hover:scale-[1.01] ${isOverdue ? 'ring-2 ring-red-400/60 bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : ''}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl ${getPriorityColor(task.priority)} flex-shrink-0`}>
              {getPriorityIcon(task.priority)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-lg ${themeClasses.text} truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${task.completed ? `line-through ${themeClasses.textSecondary}` : ''}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`${themeClasses.textSecondary} text-sm mt-2 line-clamp-2`}>
                  {task.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <span className={`text-xs px-3 py-1.5 rounded-full font-medium border ${getPriorityColor(task.priority)}`}>
              {getPriorityIcon(task.priority)}
              <span className="ml-1 capitalize">{task.priority}</span>
            </span>
            
            {task.category && (
              <span className={`${themeClasses.textSecondary} text-xs bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full font-medium`}>
                {task.category}
              </span>
            )}
            
            {task.completed && (
              <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                <CheckCircle2 className="w-3 h-3 inline mr-1" />
                Completed
              </span>
            )}
            
            {isOverdue && (
              <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                <AlertCircle className="w-3 h-3 inline mr-1" />
                Overdue
              </span>
            )}
          </div>
          
          {task.dueDate && (
            <div className="flex items-center gap-2 mt-3">
              <Calendar className={`w-4 h-4 ${themeClasses.textSecondary}`} />
              <p className={`${themeClasses.textSecondary} text-sm font-medium`}>
                Due: {new Date(task.dueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  weekday: 'short',
                })}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          {!task.completed && (
            <button
              onClick={() => onMarkDone(task.id, task.title)}
              disabled={actionLoading[task.id] === 'marking'}
              className="p-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl group hover:scale-105"
              title="Mark Done"
            >
              {actionLoading[task.id] === 'marking' ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              )}
            </button>
          )}
          
          <Link
            to={`/todo/edit/${task.id}`}
            className="p-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl group hover:scale-105"
            title="Edit Task"
          >
            <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </Link>
          
          <Link
            to={`/todo/view/${task.id}`}
            className="p-2.5 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl hover:from-purple-600 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl group hover:scale-105"
            title="View Details"
          >
            <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </Link>
          
          <button
            onClick={() => onDelete(task.id, task.title)}
            disabled={actionLoading[task.id] === 'deleting'}
            className="p-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl group hover:scale-105"
            title="Delete Task"
          >
            {actionLoading[task.id] === 'deleting' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
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
  const tasksPerPage = 5;

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
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white/95 backdrop-blur-sm',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-300/80',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white/95',
    inputBorder: isDarkMode ? 'border-gray-600' : 'border-gray-400'
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

  // Advanced Analytics Data Processing
  const analyticsData = useMemo(() => {
    const monthlyData = {};
    const priorityData = {};
    const typeData = {};
    const weeklyData = {};

    allTasks.forEach(task => {
      const dateAdded = task.dateAdded;
      const dueDate = task.dueDate;
      const priority = task.priority || 'medium';
      const type = task.category || 'general';
      const completed = task.completed;

      // Monthly completion trends
      if (dateAdded) {
        const monthKey = dateAdded.substring(0, 7); // YYYY-MM
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { 
            month: monthKey, 
            created: 0, 
            completed: 0, 
            pending: 0,
            completionRate: 0
          };
        }
        monthlyData[monthKey].created += 1;
        if (completed) {
          monthlyData[monthKey].completed += 1;
        } else {
          monthlyData[monthKey].pending += 1;
        }
        monthlyData[monthKey].completionRate = Math.round(
          (monthlyData[monthKey].completed / monthlyData[monthKey].created) * 100
        );
      }

      // Priority analysis
      if (!priorityData[priority]) {
        priorityData[priority] = { name: priority, total: 0, completed: 0, pending: 0 };
      }
      priorityData[priority].total += 1;
      if (completed) {
        priorityData[priority].completed += 1;
      } else {
        priorityData[priority].pending += 1;
      }

      // Type analysis
      if (!typeData[type]) {
        typeData[type] = { name: type, total: 0, completed: 0, pending: 0 };
      }
      typeData[type].total += 1;
      if (completed) {
        typeData[type].completed += 1;
      } else {
        typeData[type].pending += 1;
      }

      // Weekly productivity (last 7 days)
      if (dateAdded) {
        const taskDate = new Date(dateAdded);
        const today = new Date();
        const daysDiff = Math.floor((today - taskDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= 7) {
          const weekKey = `Day ${7 - daysDiff}`;
          if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = { day: weekKey, created: 0, completed: 0 };
          }
          weeklyData[weekKey].created += 1;
          if (completed) {
            weeklyData[weekKey].completed += 1;
          }
        }
      }
    });

    return {
      monthlyTrend: Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month)),
      priorityBreakdown: Object.values(priorityData).map(p => ({
        ...p,
        completionRate: Math.round((p.completed / p.total) * 100)
      })),
      typeBreakdown: Object.values(typeData).map(t => ({
        ...t,
        completionRate: Math.round((t.completed / t.total) * 100)
      })),
      weeklyProductivity: Object.values(weeklyData).sort((a, b) => a.day.localeCompare(b.day))
    };
  }, [allTasks]);
  
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

  // Export functionality
  const exportToCSV = () => {
    const csvData = filteredSortedByDue.map(task => ({
      'Task Title': task.title,
      'Description': task.description || '',
      'Priority': task.priority || 'medium',
      'Category': task.category || 'general',
      'Due Date': task.dueDate || '',
      'Date Added': task.dateAdded || '',
      'Status': task.completed ? 'Completed' : 'Pending',
      'Completion Date': task.completed ? (task.completionDate || '') : ''
    }));

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // Escape commas and quotes in CSV
          return `"${value.toString().replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tasks_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const { jsPDF } = require('jspdf');
    const autoTable = require('jspdf-autotable').default;
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Task Management Report', 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add summary stats
    doc.setFontSize(14);
    doc.text('Summary Statistics', 20, 45);
    doc.setFontSize(10);
    doc.text(`Total Tasks: ${filteredSortedByDue.length}`, 20, 55);
    doc.text(`Completed: ${filteredCompleted}`, 20, 62);
    doc.text(`Pending: ${filteredPending}`, 20, 69);
    doc.text(`Completion Rate: ${completionRate}%`, 20, 76);
    
    // Add task table
    const tableData = filteredSortedByDue.map(task => [
      task.title,
      task.priority || 'medium',
      task.category || 'general',
      task.dueDate || 'No date',
      task.completed ? 'Completed' : 'Pending'
    ]);
    
    autoTable(doc, {
      head: [['Task Title', 'Priority', 'Category', 'Due Date', 'Status']],
      body: tableData,
      startY: 85,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    doc.save(`tasks_report_${new Date().toISOString().split('T')[0]}.pdf`);
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
    <div className={`min-h-screen ${themeClasses.bg} transition-all duration-300 font-sans`}>
      {/* Enhanced Header */}
      <header className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600" />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-transparent to-cyan-500/20" />
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg animate-pulse delay-500"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
            <div className="flex-1">
              <div className="flex items-center space-x-4 sm:space-x-6 mb-4 sm:mb-6">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl">
                    <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight">
                    Task Command Center
                  </h1>
                  <p className="text-white/80 text-base sm:text-lg lg:text-xl font-medium mt-1 sm:mt-2">
                    Master your productivity with intelligent task management
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-medium">Today's Date</p>
                    <p className="text-white text-sm font-bold">
                      {new Date().toLocaleDateString('en-US', { 
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-medium">Completion Rate</p>
                    <p className="text-white text-lg font-bold">{completionRate}%</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-medium">Total Tasks</p>
                    <p className="text-white text-lg font-bold">{allTasks.length}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              
              <Link
                to="/todo/calendar"
                className="inline-flex items-center justify-center px-6 py-4 rounded-2xl font-bold shadow-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 hover:shadow-3xl group"
              >
                <Calendar className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Calendar View</span>
                <span className="sm:hidden">Calendar</span>
              </Link>
              
              <Link
                to="/addtask"
                className="inline-flex items-center justify-center px-6 py-4 rounded-2xl font-bold shadow-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-3xl group"
              >
                <PlusCircle className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">New Task</span>
                <span className="sm:hidden">Add</span>
              </Link>
            </div>
          </div>
        </div>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Enhanced Stats Cards */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-xl sm:text-2xl lg:text-3xl font-black ${themeClasses.text} mb-2`}>Today's Overview</h2>
              <p className={`${themeClasses.textSecondary} font-medium`}>Your productivity metrics for today</p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl px-4 py-2">
              <Timer className="w-5 h-5 text-blue-500" />
              <span className={`text-sm font-medium ${themeClasses.textSecondary}`}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`${themeClasses.cardBg} ${themeClasses.border} border-2 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 group`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${themeClasses.textSecondary} text-sm font-medium`}>Today's Tasks</p>
                  <p className={`${themeClasses.text} text-3xl font-black mt-2`}>{totalTodayCount}</p>
                  <div className="flex items-center mt-3">
                    <Activity className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-blue-500 text-sm font-bold">Active</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className={`${themeClasses.cardBg} ${themeClasses.border} border-2 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 group`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${themeClasses.textSecondary} text-sm font-medium`}>Completed</p>
                  <p className={`${themeClasses.text} text-3xl font-black mt-2`}>{completedTodayCount}</p>
                  <div className="flex items-center mt-3">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-green-500 text-sm font-bold">Done</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className={`${themeClasses.cardBg} ${themeClasses.border} border-2 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 group`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${themeClasses.textSecondary} text-sm font-medium`}>Pending</p>
                  <p className={`${themeClasses.text} text-3xl font-black mt-2`}>{pendingTodayCount}</p>
                  <div className="flex items-center mt-3">
                    <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-yellow-500 text-sm font-bold">Waiting</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className={`${themeClasses.cardBg} ${themeClasses.border} border-2 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 group`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${themeClasses.textSecondary} text-sm font-medium`}>Completion Rate</p>
                  <p className={`${themeClasses.text} text-3xl font-black mt-2`}>{completionRate}%</p>
                  <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 mt-3`}>
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Priority Kanban Board */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-2xl sm:text-3xl font-black ${themeClasses.text} mb-2`}>Priority Board</h2>
              <p className={`${themeClasses.textSecondary} font-medium`}>Organize tasks by priority level</p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl px-4 py-2">
              <Flag className="w-5 h-5 text-purple-500" />
              <span className={`text-sm font-medium ${themeClasses.textSecondary}`}>
                {todayHighPriority.length + todayMediumPriority.length + todayLowPriority.length} Tasks Today
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* High Priority */}
            <div className={`${themeClasses.cardBg} ${themeClasses.border} border-2 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300`}>
              <div className="bg-gradient-to-br from-red-500 to-pink-600 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-black text-xl flex items-center">
                    <Flag className="w-6 h-6 mr-3" />
                    High Priority
                  </h3>
                  <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-2xl text-sm font-bold">
                    {todayHighPriority.length}
                  </span>
                </div>
                <p className="text-white/80 text-sm mt-2">Urgent tasks requiring immediate attention</p>
              </div>
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {todayHighPriority.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <Flag className="w-8 h-8 text-red-500" />
                    </div>
                    <p className={`${themeClasses.textSecondary} text-base font-medium`}>No high-priority tasks today</p>
                    <p className={`${themeClasses.textSecondary} text-sm mt-1`}>Great job staying on top of urgent items!</p>
                  </div>
                ) : (
                  todayHighPriority.map((task) => (
                    <TaskCard key={task.id} task={task} onMarkDone={confirmMarkDone} onDelete={confirmDelete} actionLoading={actionLoading} themeClasses={themeClasses} />
                  ))
                )}
              </div>
            </div>

            {/* Medium Priority */}
            <div className={`${themeClasses.cardBg} ${themeClasses.border} border-2 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300`}>
              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-black text-xl flex items-center">
                    <Clock className="w-6 h-6 mr-3" />
                    Medium Priority
                  </h3>
                  <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-2xl text-sm font-bold">
                    {todayMediumPriority.length}
                  </span>
                </div>
                <p className="text-white/80 text-sm mt-2">Important tasks to complete today</p>
              </div>
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {todayMediumPriority.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-yellow-500" />
                    </div>
                    <p className={`${themeClasses.textSecondary} text-base font-medium`}>No medium-priority tasks today</p>
                    <p className={`${themeClasses.textSecondary} text-sm mt-1`}>Focus on high and low priority items</p>
                  </div>
                ) : (
                  todayMediumPriority.map((task) => (
                    <TaskCard key={task.id} task={task} onMarkDone={confirmMarkDone} onDelete={confirmDelete} actionLoading={actionLoading} themeClasses={themeClasses} />
                  ))
                )}
              </div>
            </div>

            {/* Low Priority */}
            <div className={`${themeClasses.cardBg} ${themeClasses.border} border-2 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300`}>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-black text-xl flex items-center">
                    <CheckCircle2 className="w-6 h-6 mr-3" />
                    Low Priority
                  </h3>
                  <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-2xl text-sm font-bold">
                    {todayLowPriority.length}
                  </span>
                </div>
                <p className="text-white/80 text-sm mt-2">Tasks that can be done when time permits</p>
              </div>
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {todayLowPriority.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <p className={`${themeClasses.textSecondary} text-base font-medium`}>No low-priority tasks today</p>
                    <p className={`${themeClasses.textSecondary} text-sm mt-1`}>Perfect time to tackle bigger projects!</p>
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

        {/* --- PRODUCTIVITY ANALYTICS --- */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-2xl sm:text-3xl font-black ${themeClasses.text} mb-2`}>Productivity Analytics</h2>
              <p className={`${themeClasses.textSecondary} font-medium`}>Insights into your task management patterns</p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl px-4 py-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <span className={`text-sm font-medium ${themeClasses.textSecondary}`}>
                {analyticsData.monthlyTrend.length} Months Tracked
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Completion Trend */}
            <div className={`${themeClasses.cardBg} ${themeClasses.border} border-2 rounded-3xl p-6 shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`text-xl font-bold ${themeClasses.text} mb-2`}>Monthly Completion Trend</h3>
                  <p className={`${themeClasses.textSecondary} text-sm`}>Task creation and completion over time</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.monthlyTrend}>
                    <defs>
                      <linearGradient id="createdGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
                    <XAxis 
                      dataKey="month" 
                      stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                      fontSize={12}
                    />
                    <YAxis 
                      stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                        border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                        borderRadius: "12px",
                        color: isDarkMode ? "#f9fafb" : "#111827"
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="created"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="url(#createdGradient)"
                      name="Created"
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stackId="2"
                      stroke="#10b981"
                      fill="url(#completedGradient)"
                      name="Completed"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Priority Performance */}
            <div className={`${themeClasses.cardBg} ${themeClasses.border} border-2 rounded-3xl p-6 shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`text-xl font-bold ${themeClasses.text} mb-2`}>Priority Performance</h3>
                  <p className={`${themeClasses.textSecondary} text-sm`}>Completion rates by priority level</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.priorityBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
                    <XAxis 
                      dataKey="name" 
                      stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                      fontSize={12}
                    />
                    <YAxis 
                      stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                        border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                        borderRadius: "12px",
                        color: isDarkMode ? "#f9fafb" : "#111827"
                      }}
                      formatter={(value, name) => [
                        `${value}%`, 
                        name === 'completionRate' ? 'Completion Rate' : name
                      ]}
                    />
                    <Bar 
                      dataKey="completionRate" 
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Weekly Productivity & Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Productivity */}
            <div className={`${themeClasses.cardBg} ${themeClasses.border} border-2 rounded-3xl p-6 shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`text-xl font-bold ${themeClasses.text} mb-2`}>Weekly Productivity</h3>
                  <p className={`${themeClasses.textSecondary} text-sm`}>Last 7 days activity</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.weeklyProductivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
                    <XAxis 
                      dataKey="day" 
                      stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                      fontSize={12}
                    />
                    <YAxis 
                      stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                        border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                        borderRadius: "12px",
                        color: isDarkMode ? "#f9fafb" : "#111827"
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="created" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      name="Created"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                      name="Completed"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Distribution */}
            <div className={`${themeClasses.cardBg} ${themeClasses.border} border-2 rounded-3xl p-6 shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`text-xl font-bold ${themeClasses.text} mb-2`}>Category Distribution</h3>
                  <p className={`${themeClasses.textSecondary} text-sm`}>Tasks by category</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.typeBreakdown.slice(0, 6)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total"
                    >
                      {analyticsData.typeBreakdown.slice(0, 6).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 60%)`} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                        border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                        borderRadius: "12px",
                        color: isDarkMode ? "#f9fafb" : "#111827"
                      }}
                      formatter={(value) => [`${value} tasks`, 'Count']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>


        {/* Enhanced My Todos List */}
        <section className={`${themeClasses.cardBg} ${themeClasses.border} border-2 rounded-3xl p-6 sm:p-8 shadow-2xl animate__animated animate__fadeInUp`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className={`text-2xl sm:text-3xl font-black ${themeClasses.text}`}>
                    All My Tasks
                  </h2>
                  <p className={`${themeClasses.textSecondary} font-medium`}>
                    {filteredTotal} tasks found
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className={`flex items-center justify-center space-x-2 p-3 rounded-2xl ${themeClasses.hover} transition-all duration-300 ${themeClasses.text} border-2 ${themeClasses.border} sm:hidden`}
              >
                <Filter className="w-5 h-5" />
                <span className="font-medium">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={exportToCSV}
                  className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  title="Export to CSV"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">CSV</span>
                </button>
                
                <button
                  onClick={exportToPDF}
                  className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  title="Export to PDF"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">PDF</span>
                </button>
              </div>
            </div>
          </div>
            
          {/* Enhanced Filter Section */}
          <div className={`${showFilters ? 'block' : 'hidden'} sm:block animate__animated animate__fadeIn mb-6`}>
            <div className={`bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border-2 ${themeClasses.border}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-bold ${themeClasses.text} flex items-center`}>
                  <Filter className="w-5 h-5 mr-2" />
                  Advanced Filters
                </h3>
                <button
                  onClick={clearAllFilters}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-300 font-medium"
                >
                  <X className="w-4 h-4" />
                  <span>Clear All</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {/* Search Input */}
                <div className="relative col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2">
                  <Search className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 ${themeClasses.textSecondary}`} />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full border-2 ${themeClasses.inputBorder} rounded-xl pl-12 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.bg} ${themeClasses.text} font-medium transition-all duration-300`}
                  />
                </div>

                {/* Date Filter */}
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className={`w-full border-2 ${themeClasses.inputBorder} rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.bg} ${themeClasses.text} font-medium transition-all duration-300`}
                  />
                </div>

                {/* Month Filter */}
                <div className="relative">
                  <select 
                    value={selectedMonth} 
                    onChange={handleMonthChange} 
                    className={`w-full border-2 ${themeClasses.inputBorder} rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.bg} ${themeClasses.text} font-medium transition-all duration-300 appearance-none`}
                  >
                    {months.map((m) => (<option key={m} value={m}>{m}</option>))}
                  </select>
                </div>

                {/* Year Filter */}
                <div className="relative">
                  <select 
                    value={selectedYear} 
                    onChange={handleYearChange} 
                    className={`w-full border-2 ${themeClasses.inputBorder} rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.bg} ${themeClasses.text} font-medium transition-all duration-300 appearance-none`}
                  >
                    {years.map((y) => (<option key={y} value={y}>{y}</option>))}
                  </select>
                </div>

                {/* Pending Only Toggle */}
                <div className="flex items-center justify-between col-span-1 sm:col-span-2 lg:col-span-1 gap-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showNotDoneOnly} 
                      onChange={handleToggleNotDone} 
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                    />
                    <span className={`text-sm font-medium ${themeClasses.textSecondary}`}>Pending Only</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Filtered Task Counter */}
          <div className={`flex flex-wrap gap-x-6 gap-y-3 mb-6 p-4 rounded-2xl border-2 ${themeClasses.border} ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <div className={`flex items-center space-x-3 text-sm font-medium ${themeClasses.textSecondary}`}>
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{filteredTotal}</span>
              <span>Total Tasks</span>
            </div>
            <div className="flex-grow border-l-2 border-gray-300 dark:border-gray-600"></div>
            <div className={`flex items-center space-x-3 text-sm font-medium ${themeClasses.textSecondary}`}>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="font-bold text-lg text-yellow-600 dark:text-yellow-400">{filteredPending}</span>
              <span>Pending</span>
            </div>
            <div className="flex-grow border-l-2 border-gray-300 dark:border-gray-600"></div>
            <div className={`flex items-center space-x-3 text-sm font-medium ${themeClasses.textSecondary}`}>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="font-bold text-lg text-green-600 dark:text-green-400">{filteredCompleted}</span>
              <span>Completed</span>
            </div>
          </div>

          {/* Enhanced Task List */}
          <div className="space-y-4">
            {filteredSortedByDue.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <ClipboardList className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className={`text-xl font-bold ${themeClasses.text} mb-3`}>
                  No tasks found
                </h3>
                <p className={`${themeClasses.textSecondary} text-base mb-6 max-w-md mx-auto`}>
                  No tasks match your current filters. Try adjusting your search criteria or clear all filters to see all tasks.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {currentTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onMarkDone={confirmMarkDone}
                      onDelete={confirmDelete}
                      actionLoading={actionLoading}
                      themeClasses={themeClasses}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {totalPages > 1 && (
            <div className={`flex flex-col sm:flex-row justify-between items-center mt-8 pt-8 border-t-2 ${themeClasses.border} gap-4`}>
              <button
                onClick={goPrev}
                disabled={currentPage === 1}
                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'} disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl`}
              >
                ← Previous
              </button>
              
              <div className="flex items-center space-x-2">
                <span className={`${themeClasses.textSecondary} font-medium`}>
                  Page
                </span>
                <span className={`px-4 py-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold`}>
                  {currentPage}
                </span>
                <span className={`${themeClasses.textSecondary} font-medium`}>
                  of {totalPages}
                </span>
              </div>
              
              <button
                onClick={goNext}
                disabled={currentPage === totalPages}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-bold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Next →
              </button>
            </div>
          )}
          
          <div className={`text-center pt-6 border-t ${themeClasses.border}`}>
            <div className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <p className={`${themeClasses.textSecondary} font-medium`}>
                Showing <span className="font-bold text-blue-600 dark:text-blue-400">{indexOfFirst + 1}</span> to{' '}
                <span className="font-bold text-blue-600 dark:text-blue-400">{Math.min(indexOfLast, filteredSortedByDue.length)}</span> of{' '}
                <span className="font-bold text-blue-600 dark:text-blue-400">{filteredSortedByDue.length}</span> tasks
              </p>
            </div>
          </div>
        </section>
        
        {/* Enhanced Footer */}
        <div className="mt-12 pt-8 border-t-2 border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Last updated: {new Date().toLocaleString()}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs text-amber-600 dark:text-amber-400">
                <span className="inline-block w-3 h-3 rounded-full bg-amber-400"></span>
                <span>Overdue tasks highlighted</span>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400">
                <Shield className="w-3 h-3" />
                <span>Secure & Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TodoDashboard;

