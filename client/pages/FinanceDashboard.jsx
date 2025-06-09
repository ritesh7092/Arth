// src/components/FinanceDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'animate.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  PieChart,
  Search,
  Moon,
  Sun,
  PlusCircle,
  X,
  Filter,
  AlertCircle,
  Eye,
  Edit2,
  Trash2,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import baseUrl from '../api/api';
import { useTheme } from '../src/theme/ThemeProvider';

// Enhanced Mock Data for Testing
const mockTransactions = [
  {
    id: 1,
    description: 'Monthly Salary',
    amount: 75000,
    type: 'Income',
    category: 'Salary',
    date: '2024-12-01',
  },
  {
    id: 2,
    description: 'Grocery Shopping',
    amount: 3500,
    type: 'Expense',
    category: 'Food',
    date: '2024-12-02',
  },
  {
    id: 3,
    description: 'Freelance Project Payment',
    amount: 25000,
    type: 'Income',
    category: 'Freelance',
    date: '2024-12-03',
  },
  {
    id: 4,
    description: 'Electricity Bill',
    amount: 2800,
    type: 'Expense',
    category: 'Utilities',
    date: '2024-12-04',
  },
  {
    id: 5,
    description: 'Rent Payment',
    amount: 15000,
    type: 'Expense',
    category: 'Housing',
    date: '2024-12-05',
  },
  {
    id: 6,
    description: 'Stock Dividend',
    amount: 5000,
    type: 'Income',
    category: 'Investments',
    date: '2024-12-06',
  },
  {
    id: 7,
    description: 'Restaurant Dinner',
    amount: 1200,
    type: 'Expense',
    category: 'Food',
    date: '2024-12-07',
  },
  {
    id: 8,
    description: 'Bus Pass',
    amount: 800,
    type: 'Expense',
    category: 'Transport',
    date: '2024-12-08',
  },
  {
    id: 9,
    description: 'Medical Checkup',
    amount: 2500,
    type: 'Expense',
    category: 'Health',
    date: '2024-12-09',
  },
  {
    id: 10,
    description: 'Online Course',
    amount: 4000,
    type: 'Expense',
    category: 'Education',
    date: '2024-12-10',
  },
  {
    id: 11,
    description: 'Movie Tickets',
    amount: 600,
    type: 'Expense',
    category: 'Entertainment',
    date: '2024-12-11',
  },
  {
    id: 12,
    description: 'Clothing Shopping',
    amount: 3200,
    type: 'Expense',
    category: 'Shopping',
    date: '2024-12-12',
  },
  {
    id: 13,
    description: 'Bonus Payment',
    amount: 10000,
    type: 'Income',
    category: 'Salary',
    date: '2024-12-13',
  },
  {
    id: 14,
    description: 'Internet Bill',
    amount: 1500,
    type: 'Expense',
    category: 'Utilities',
    date: '2024-12-14',
  },
  {
    id: 15,
    description: 'Consulting Work',
    amount: 15000,
    type: 'Income',
    category: 'Freelance',
    date: '2024-12-15',
  },
  {
    id: 16,
    description: 'Gym Membership',
    amount: 2000,
    type: 'Expense',
    category: 'Health',
    date: '2024-12-16',
  },
  {
    id: 17,
    description: 'Fuel Expenses',
    amount: 3000,
    type: 'Expense',
    category: 'Transport',
    date: '2024-12-17',
  },
  {
    id: 18,
    description: 'Mutual Fund SIP',
    amount: 5000,
    type: 'Expense',
    category: 'Investments',
    date: '2024-12-18',
  },
  {
    id: 19,
    description: 'Birthday Gift',
    amount: 1800,
    type: 'Expense',
    category: 'Shopping',
    date: '2024-12-19',
  },
  {
    id: 20,
    description: 'Side Business Income',
    amount: 8000,
    type: 'Income',
    category: 'Other',
    date: '2024-12-20',
  },
];

// Format INR
const formatRupee = amount =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount);

// Enhanced TransactionCard Component
const TransactionCard = ({ transaction, themeClasses, onView, onEdit, onDelete }) => {
  const isExpense = transaction.type === 'Expense';
  const amountColor = isExpense ? 'text-red-500' : 'text-green-500';

  return (
    <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 animate__animated animate__fadeIn`}>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
        {/* Transaction Details */}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold ${themeClasses.text} truncate text-lg`}>
            {transaction.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className={`${themeClasses.textSecondary} text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full`}>
              {transaction.category}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isExpense ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            }`}>
              {transaction.type}
            </span>
          </div>
          <p className={`${themeClasses.textSecondary} text-sm mt-2`}>
            {new Date(transaction.date).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              weekday: 'short',
            })}
          </p>
        </div>

        {/* Amount and Actions */}
        <div className="flex flex-col sm:items-end w-full sm:w-auto">
          <p className={`font-bold text-xl ${amountColor} mb-3`}>
            {formatRupee(isExpense ? -transaction.amount : transaction.amount)}
          </p>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button 
              onClick={() => onView(transaction.id)} 
              className={`p-2 rounded-full ${themeClasses.buttonSecondary} hover:bg-opacity-80 transition-colors group`} 
              title="View Details"
            >
              <Eye size={16} className={`${themeClasses.text} group-hover:scale-110 transition-transform`} />
            </button>
            <button 
              onClick={() => onEdit(transaction.id)} 
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors group" 
              title="Edit Transaction"
            >
              <Edit2 size={16} className="group-hover:scale-110 transition-transform" />
            </button>
            <button 
              onClick={() => onDelete(transaction.id)} 
              className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors group" 
              title="Delete Transaction"
            >
              <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, themeClasses }) => {
  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg ${themeClasses.buttonSecondary} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
      >
        <ChevronLeft size={16} />
      </button>

      {getPageNumbers().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg font-medium transition-colors ${
            currentPage === page
              ? 'bg-emerald-600 text-white'
              : `${themeClasses.buttonSecondary} hover:bg-opacity-80`
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg ${themeClasses.buttonSecondary} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default function FinanceDashboard() {
  // THEME: use shared provider
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Pagination & Limiting Logic (like TodoDashboard) ---
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10; // You can adjust this as needed

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterMinAmount, setFilterMinAmount] = useState('');
  const [filterMaxAmount, setFilterMaxAmount] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();
  const categories = [
    'All', 'Salary', 'Freelance', 'Investments',
    'Food', 'Housing', 'Utilities', 'Transport',
    'Health', 'Education', 'Entertainment', 'Shopping', 'Other'
  ];

  // Theme-aware Tailwind classes
  const themeClasses = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200/50',
    inputBorder: isDarkMode ? 'border-gray-600' : 'border-gray-300',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white/90',
    buttonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    buttonSecondary: isDarkMode
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
      : 'bg-gray-300 hover:bg-gray-400 text-gray-800',
  };

  // Auth helper
  const getToken = useCallback(() => {
    const t = localStorage.getItem('authToken');
    if (!t) {
      setError('Please login to continue.');
      setTimeout(() => navigate('/login'), 1500);
    }
    return t;
  }, [navigate]);

  // Fetch transactions (mock/API)
  const fetchTransactions = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      // const res = await baseUrl.get('/api/transactions', { headers: { Authorization: `Bearer ${token}` }});
      // setTransactions(res.data.content);
      await new Promise(r => setTimeout(r, 700));
      setTransactions(mockTransactions);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Totals
  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  // --- Filtering and Sorting ---
  const filteredTransactions = transactions
    .filter(t => {
      // ...your filtering logic...
      const d = new Date(t.date);
      const amt = t.amount;
      const matchesSearch = !searchQuery ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'All' || t.type === filterType;
      const matchesCat = filterCategory === 'All' || t.category === filterCategory;
      const start = filterStartDate ? new Date(filterStartDate) : null;
      const end = filterEndDate ? new Date(filterEndDate) : null;
      const matchesDate = (!start || d >= start) && (!end || d <= end);
      const minA = filterMinAmount ? parseFloat(filterMinAmount) : -Infinity;
      const maxA = filterMaxAmount ? parseFloat(filterMaxAmount) : Infinity;
      return matchesSearch && matchesType && matchesCat && matchesDate && amt >= minA && amt <= maxA;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // --- Limiting Logic (like TodoDashboard) ---
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, filterCategory, filterStartDate, filterEndDate, filterMinAmount, filterMaxAmount]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const indexOfLast = currentPage * transactionsPerPage;
  const indexOfFirst = indexOfLast - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirst, indexOfLast);

  // Pagination handlers
  const goNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const goPrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterType('All');
    setFilterCategory('All');
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterMinAmount('');
    setFilterMaxAmount('');
    setCurrentPage(1);
  };

  // Enhanced Action Handlers
  const handleView = (id) => {
    navigate(`/finance/view/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/finance/edit/${id}`);
  };

  const handleDelete = (id) => {
    const transaction = transactions.find(t => t.id === id);
    
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-xl shadow-2xl p-6 max-w-md w-full animate__animated animate__zoomIn`}>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h1 className={`text-2xl font-bold mb-2 ${themeClasses.text}`}>Confirm Delete</h1>
              <p className={`${themeClasses.textSecondary} mb-2`}>
                Are you sure you want to delete this transaction?
              </p>
              {transaction && (
                <div className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-6`}>
                  <p className={`font-semibold ${themeClasses.text}`}>{transaction.description}</p>
                  <p className={`text-sm ${themeClasses.textSecondary}`}>
                    {formatRupee(transaction.amount)} • {transaction.category}
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <button 
                  onClick={onClose} 
                  className={`flex-1 px-4 py-2 rounded-lg ${themeClasses.buttonSecondary} font-medium transition-colors`}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => { 
                    setTransactions(prev => prev.filter(t => t.id !== id)); 
                    onClose(); 
                  }} 
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${themeClasses.bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="relative mb-4">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <IndianRupee className="w-8 h-8 text-blue-600 absolute inset-0 m-auto animate-pulse" />
          </div>
          <p className={`${themeClasses.textSecondary} text-lg`}>Loading your financial overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.bg} transition-all duration-300 font-sans`}>
      {/* HEADER */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">Personal Finance Tracker</h1>
                  <p className="text-teal-100 text-sm sm:text-lg">Your financial health at a glance</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-white/90">
                <div className="flex items-center space-x-2">
                  <IndianRupee className="w-5 h-5" />
                  <span className="font-medium">Net Balance: {formatRupee(netBalance)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5" />
                  <span className="font-medium">Transactions: {filteredTransactions.length}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              {/* THEME TOGGLE */}
              <button 
                onClick={toggleTheme} 
                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all flex items-center justify-center" 
                title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
              </button>
              <Link 
                to="/finance/report" 
                className="inline-flex items-center justify-center px-4 sm:px-5 py-3 rounded-xl font-semibold shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition text-sm sm:text-base"
              >
                <BarChart3 className="w-5 h-5 mr-2" /> 
                <span className="hidden sm:inline">Detailed Report</span>
                <span className="sm:hidden">Report</span>
              </Link>
              <Link 
                to="/finance/add" 
                className="inline-flex items-center justify-center px-4 sm:px-6 py-3 rounded-xl font-semibold shadow-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-400 hover:to-green-500 transition text-sm sm:text-base"
              >
                <PlusCircle className="w-5 h-5 mr-2" /> 
                <span className="hidden sm:inline">New Transaction</span>
                <span className="sm:hidden">Add</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ERROR */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 rounded-xl shadow-lg animate__animated animate__fadeIn">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300 font-medium flex-1">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Finance Stats Cards */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Total Income Card */}
            <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className={`${themeClasses.textSecondary} text-xs sm:text-sm font-medium`}>Total Income</p>
                  <p className={`text-xl sm:text-3xl font-bold mt-1 text-green-500 truncate`}>{formatRupee(totalIncome)}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1 flex-shrink-0" />
                    <span className="text-green-500 text-xs sm:text-sm font-medium">Positive flow</span>
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
                  <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Total Expense Card */}
            <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className={`${themeClasses.textSecondary} text-xs sm:text-sm font-medium`}>Total Expense</p>
                  <p className={`text-xl sm:text-3xl font-bold mt-1 text-red-500 truncate`}>{formatRupee(totalExpense)}</p>
                  <div className="flex items-center mt-2">
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1 flex-shrink-0" />
                    <span className="text-red-500 text-xs sm:text-sm font-medium">Outflow</span>
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Net Balance Card */}
            <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 md:col-span-2 lg:col-span-1`}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className={`${themeClasses.textSecondary} text-xs sm:text-sm font-medium`}>Net Balance</p>
                  <p className={`text-xl sm:text-3xl font-bold mt-1 ${netBalance >= 0 ? 'text-blue-500' : 'text-orange-500'} truncate`}>
                    {formatRupee(netBalance)}
                  </p>
                  <div className="flex items-center mt-2">
                    {netBalance >= 0 ? (
                      <>
                        <TrendingUp className="w-4 h-4 text-blue-500 mr-1 flex-shrink-0" />
                        <span className="text-blue-500 text-xs sm:text-sm font-medium">Healthy</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-orange-500 mr-1 flex-shrink-0" />
                        <span className="text-orange-500 text-xs sm:text-sm font-medium">Needs attention</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
                  <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transaction Records Section */}
        <section className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-2xl p-4 sm:p-6 shadow-lg animate__animated animate__fadeInUp`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className={`text-xl sm:text-2xl font-bold ${themeClasses.text} flex items-center`}>
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 mr-3 flex-shrink-0" />
              Transaction Records ({filteredTransactions.length})
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 p-2 rounded-lg ${themeClasses.hover} transition-colors sm:hidden ${themeClasses.text}`}
            >
              <Filter className="w-5 h-5" />
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
          </div>

          {/* Filter Section */}
          <div className={`${showFilters ? 'block' : 'hidden'} sm:block animate__animated animate__fadeIn mb-6`}>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 p-4 border rounded-xl ${themeClasses.border}`}>
              {/* Search Input */}
              <div className="relative col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2">
                <Search className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${themeClasses.textSecondary}`} />
                <input
                  type="text"
                  placeholder="Search description or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full border ${themeClasses.inputBorder} rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${themeClasses.bg} ${themeClasses.text} text-sm`}
                />
              </div>

              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`border ${themeClasses.inputBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${themeClasses.bg} ${themeClasses.text} text-sm`}
              >
                <option value="All">All Types</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`border ${themeClasses.inputBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${themeClasses.bg} ${themeClasses.text} text-sm`}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Date Filters */}
              <input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className={`border ${themeClasses.inputBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${themeClasses.bg} ${themeClasses.text} text-sm`}
                title="Filter by Start Date"
              />
              <input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className={`border ${themeClasses.inputBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${themeClasses.bg} ${themeClasses.text} text-sm`}
                title="Filter by End Date"
              />

              {/* Amount Filters */}
              <input
                type="number"
                placeholder="Min Amount"
                value={filterMinAmount}
                onChange={(e) => setFilterMinAmount(e.target.value)}
                className={`border ${themeClasses.inputBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${themeClasses.bg} ${themeClasses.text} text-sm`}
                title="Filter by Minimum Amount"
              />
              <input
                type="number"
                placeholder="Max Amount"
                value={filterMaxAmount}
                onChange={(e) => setFilterMaxAmount(e.target.value)}
                className={`border ${themeClasses.inputBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${themeClasses.bg} ${themeClasses.text} text-sm`}
                title="Filter by Maximum Amount"
              />

              {/* Clear Filters Button */}
              <button
                onClick={clearAllFilters}
                className={`col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-6 w-full flex items-center justify-center p-2 rounded-lg ${themeClasses.buttonSecondary} transition-colors font-medium text-sm`}
              >
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Transaction List */}
          <div className="space-y-3 sm:space-y-4">
            {currentTransactions.length === 0 ? (
              <div className="text-center py-10 sm:py-16">
                <Search className={`w-12 h-12 sm:w-16 sm:h-16 ${themeClasses.textSecondary} mx-auto mb-4 opacity-50`} />
                <p className={`${themeClasses.textSecondary} text-base sm:text-lg font-medium mb-2`}>
                  No transactions found matching your criteria.
                </p>
                <p className={`${themeClasses.textSecondary} text-sm mb-4`}>
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearAllFilters}
                  className={`px-4 py-2 rounded-lg ${themeClasses.buttonSecondary} transition-colors text-sm font-medium`}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                {/* Transaction Cards */}
                {currentTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    themeClasses={themeClasses}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}

                {/* Pagination Controls */}
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

                {/* Results Summary */}
                <div className={`text-center pt-4 border-t ${themeClasses.border}`}>
                  <p className={`${themeClasses.textSecondary} text-sm`}>
                    Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredTransactions.length)} of {filteredTransactions.length} transactions
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}







// // FinanceDashboard.jsx
// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import 'animate.css'; // Assuming you have animate.css installed for animations
// import {
//   Sun, Moon, // For Dark Mode Toggler
//   DollarSign, // For Income
//   PiggyBank,  // For Savings
//   TrendingUp, // For overall income (Borrow)
//   TrendingDown, // For overall expenses (Loan)
//   Scale,      // For Financial Snapshot
//   Calendar,   // For Date/Month filter
//   Tag,        // For Category filter
//   PlusCircle, // For New Transaction
//   FileText,   // For Detailed Reports
//   Eye,        // For View action
//   Edit2,      // For Edit action
//   Trash2,     // For Delete action
//   Wallet,     // For Expenses
//   Clock,      // For Server Time
//   ArrowLeftRight, // For Transaction Type filter
// } from 'lucide-react';

// // Helper to format currency for India (₹)
// const formatCurrency = (amount) => {
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   }).format(amount);
// };

// // --- Child Components ---

// const MetricCard = ({ icon: Icon, title, value, colorClass }) => {
//   return (
//     <div className={`${colorClass} text-white rounded-2xl shadow-xl p-6 flex flex-col items-center space-y-2 transform transition hover:-translate-y-1 hover:shadow-2xl`}>
//       <div className="bg-white/20 p-4 rounded-full">
//         <Icon className="w-8 h-8" />
//       </div>
//       <div>
//         <p className="text-sm font-medium opacity-80 text-center">{title}</p>
//         <p className="text-3xl font-bold tracking-tight text-center">{value}</p>
//       </div>
//     </div>
//   );
// };

// const SnapshotItem = ({ title, value, color }) => (
//   <div className="bg-gray-700/50 rounded-lg p-4 space-y-1 transform transition hover:-translate-y-1 hover:shadow-xl dark:bg-gray-900/50">
//     <p className="text-xs text-gray-400">{title}</p>
//     <p className={`text-2xl font-semibold ${color}`}>{value}</p>
//   </div>
// );

// const ActionButton = ({ icon: Icon, onClick, to, className, title }) => {
//   const commonProps = {
//     title,
//     className: `p-2 rounded-full transition-colors ${className}`
//   };

//   if (to) {
//     return <Link to={to} {...commonProps}><Icon className="w-5 h-5" /></Link>;
//   }
//   return <button onClick={onClick} {...commonProps}><Icon className="w-5 h-5" /></button>;
// };

// // --- Main FinanceDashboard Component ---

// const FinanceDashboard = () => {
//   const [serverTime, setServerTime] = useState(new Date().toLocaleString());
//   const [transactions, setTransactions] = useState([
//     // Current Month (June 2025 based on current date)
//     { id: 8, transactionDate: '2025-06-01', description: 'June Salary', category: 'Salary', transactionType: 'Credit', amount: 78000, paymentMethod: 'Bank Transfer', counterparty: 'Tech Solutions Ltd.', loanStatus: 'N/A' },
//     { id: 9, transactionDate: '2025-06-03', description: 'Electricity Bill', category: 'Utilities', transactionType: 'Debit', amount: 2500, paymentMethod: 'Online', counterparty: 'Power Board', loanStatus: 'N/A' },
//     { id: 10, transactionDate: '2025-06-07', description: 'Internet Bill', category: 'Utilities', transactionType: 'Debit', amount: 1000, paymentMethod: 'Online', counterparty: 'ISP', loanStatus: 'N/A' },
//     { id: 11, transactionDate: '2025-06-10', description: 'Dining Out', category: 'Food', transactionType: 'Debit', amount: 1200, paymentMethod: 'UPI', counterparty: 'Restaurant A', loanStatus: 'N/A' },
//     { id: 15, transactionDate: '2025-06-12', description: 'June Savings Deposit', category: 'Savings', transactionType: 'Debit', amount: 8000, paymentMethod: 'Bank Transfer', counterparty: 'Self', loanStatus: 'N/A' },
//     { id: 16, transactionDate: '2025-06-15', description: 'June Loan Payment', category: 'Loan', transactionType: 'Debit', amount: 15000, paymentMethod: 'Auto-Debit', counterparty: 'Housing Finance', loanStatus: 'Paid' },
//     { id: 17, transactionDate: '2025-06-18', description: 'Borrowed from Friend', category: 'Borrow', transactionType: 'Credit', amount: 7000, paymentMethod: 'Cash', counterparty: 'Friend B', loanStatus: 'Pending' },
//     { id: 18, transactionDate: '2025-06-20', description: 'Lent to Sibling', category: 'Lent', transactionType: 'Debit', amount: 4000, paymentMethod: 'UPI', counterparty: 'Sibling C', loanStatus: 'Pending' },

//     // Previous Month (May 2025)
//     { id: 1, transactionDate: '2025-05-01', description: 'May Salary', category: 'Salary', transactionType: 'Credit', amount: 75000, paymentMethod: 'Bank Transfer', counterparty: 'Tech Solutions Ltd.', loanStatus: 'N/A' },
//     { id: 2, transactionDate: '2025-05-05', description: 'Grocery Shopping', category: 'Food', transactionType: 'Debit', amount: 4500, paymentMethod: 'Credit Card', counterparty: 'Local Supermarket', loanStatus: 'N/A' },
//     { id: 3, transactionDate: '2025-05-05', description: 'Monthly Rent', category: 'Rent', transactionType: 'Debit', amount: 20000, paymentMethod: 'Net Banking', counterparty: 'Landlord', loanStatus: 'N/A' },
//     { id: 4, transactionDate: '2025-05-10', description: 'Car Loan EMI', category: 'Loan', transactionType: 'Debit', amount: 12000, paymentMethod: 'Auto-Debit', counterparty: 'National Bank', loanStatus: 'Paid' },
//     { id: 5, transactionDate: '2025-05-12', description: 'Freelance Project Payment', category: 'Freelance', transactionType: 'Credit', amount: 15000, paymentMethod: 'UPI', counterparty: 'Client Co.', loanStatus: 'N/A' },
//     { id: 6, transactionDate: '2025-05-15', description: 'Mutual Fund SIP', category: 'Savings', transactionType: 'Debit', amount: 5000, paymentMethod: 'Bank Transfer', counterparty: 'Growth Investments', loanStatus: 'N/A' },
//     { id: 7, transactionDate: '2025-05-20', description: 'Lent money to colleague', category: 'Lent', transactionType: 'Debit', amount: 3000, paymentMethod: 'Cash', counterparty: 'John Doe', loanStatus: 'Pending' },
//     { id: 19, transactionDate: '2025-05-25', description: 'Friend Paid Back', category: 'Borrow', transactionType: 'Credit', amount: 2000, paymentMethod: 'UPI', counterparty: 'Friend D', loanStatus: 'N/A' },

//     // Older transactions (April 2025)
//     { id: 12, transactionDate: '2025-04-15', description: 'April Savings', category: 'Savings', transactionType: 'Debit', amount: 4000, paymentMethod: 'Bank Transfer', counterparty: 'Growth Investments', loanStatus: 'N/A' },
//     { id: 13, transactionDate: '2025-04-20', description: 'April Groceries', category: 'Food', transactionType: 'Debit', amount: 3800, paymentMethod: 'Credit Card', counterparty: 'Local Supermarket', loanStatus: 'N/A' },
//     { id: 14, transactionDate: '2025-04-01', description: 'April Salary', category: 'Salary', transactionType: 'Credit', amount: 72000, paymentMethod: 'Bank Transfer', counterparty: 'Tech Solutions Ltd.', loanStatus: 'N/A' },
//   ]);
//   const [flashMessage, setFlashMessage] = useState({ type: '', message: '' });
//   const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark'); // Default to dark as per screenshot

//   // Filter states for the transaction table
//   const [filterMonth, setFilterMonth] = useState(''); // Can be used for initial month selection or cleared for date range
//   const [filterCategory, setFilterCategory] = useState('');
//   const [filterTransactionType, setFilterTransactionType] = useState(''); // 'Credit' or 'Debit'
//   const [filterDateFrom, setFilterDateFrom] = useState('');
//   const [filterDateTo, setFilterDateTo] = useState('');


//   // --- Effects ---

//   // Server time update
//   useEffect(() => {
//     const interval = setInterval(() => setServerTime(new Date().toLocaleString()), 1000);
//     return () => clearInterval(interval);
//   }, []);

//   // Set initial filter month to current month on component mount
//   useEffect(() => {
//     const today = new Date();
//     // Use current month string to match transactionDate format 'YYYY-MM'
//     const currentMonthStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
//     setFilterMonth(currentMonthStr);
//   }, []);

//   // Dark mode effect - applies 'dark' or 'light' class to the HTML element
//   useEffect(() => {
//     document.documentElement.classList.remove('light', 'dark'); // Remove existing classes
//     document.documentElement.classList.add(theme); // Add current theme
//     localStorage.setItem('theme', theme); // Persist theme
//   }, [theme]);

//   // --- Theme Toggle ---
//   const toggleTheme = () => {
//     setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
//   };

//   // --- Utility Functions ---

//   // Get current and previous month strings for filtering
//   const getCurrentAndPreviousMonthStrings = useCallback(() => {
//     const today = new Date();
//     const currentMonth = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;

//     const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
//     const previousMonth = `${prevMonthDate.getFullYear()}-${(prevMonthDate.getMonth() + 1).toString().padStart(2, '0')}`;
//     return { currentMonth, previousMonth };
//   }, []);

//   const { currentMonth, previousMonth } = useMemo(() => getCurrentAndPreviousMonthStrings(), [getCurrentAndPreviousMonthStrings]);


//   // Calculate specific metrics for a given month (Savings, Expenses, Loan, Borrow, Lent)
//   const calculateMonthBreakdownMetrics = useCallback((month) => {
//     const monthTransactions = transactions.filter(txn => txn.transactionDate.startsWith(month));
//     return monthTransactions.reduce((acc, txn) => {
//       // Savings are generally debit transactions that are "saved"
//       if (txn.category.toLowerCase() === 'savings' && txn.transactionType.toLowerCase() === 'debit') acc.savings += txn.amount;
//       // Expenses are debits not categorized as loan/borrow/savings/lent
//       if (txn.transactionType.toLowerCase() === 'debit' && !['loan', 'borrow', 'savings', 'lent'].includes(txn.category.toLowerCase())) {
//         acc.expenses += txn.amount;
//       }
//       // Loan repayments are debits categorized as 'loan'
//       if (txn.category.toLowerCase() === 'loan' && txn.transactionType.toLowerCase() === 'debit') acc.loan += txn.amount;
//       // Money borrowed is a credit categorized as 'borrow'
//       if (txn.category.toLowerCase() === 'borrow' && txn.transactionType.toLowerCase() === 'credit') acc.borrow += txn.amount;
//       // Money lent is a debit categorized as 'lent'
//       if (txn.category.toLowerCase() === 'lent' && txn.transactionType.toLowerCase() === 'debit') acc.lent += txn.amount;
//       return acc;
//     }, { savings: 0, expenses: 0, loan: 0, borrow: 0, lent: 0 });
//   }, [transactions]);

//   // Calculate previous month's income, expenses, and savings (different from current month breakdown)
//   const calculatePreviousMonthSummaryMetrics = useCallback((month) => {
//     const monthTransactions = transactions.filter(txn => txn.transactionDate.startsWith(month));
//     return monthTransactions.reduce((acc, txn) => {
//       if (txn.transactionType === 'Credit' && txn.category !== 'Borrow') { // Income is credit, excluding 'borrow' as it's a liability, not income
//         acc.income += txn.amount;
//       }
//       if (txn.transactionType === 'Debit' && !['Loan', 'Lent', 'Savings'].includes(txn.category)) { // Expenses are debits, excluding loan repayments, money lent, and savings deposits
//         acc.expenses += txn.amount;
//       }
//       if (txn.category === 'Savings' && txn.transactionType === 'Debit') { // Savings deposits
//         acc.savings += txn.amount;
//       }
//       return acc;
//     }, { income: 0, expenses: 0, savings: 0 });
//   }, [transactions]);


//   // Calculate overall income, expenses, and net worth
//   const calculateOverallMetrics = useCallback(() => {
//     let totalLent = 0;
//     let totalBorrowed = 0;

//     transactions.forEach(txn => {
//       if (txn.category === 'Lent' && txn.transactionType === 'Debit') totalLent += txn.amount;
//       if (txn.category === 'Borrow' && txn.transactionType === 'Credit') totalBorrowed += txn.amount;
//     });

//     const netWorthEffect = totalLent - totalBorrowed; // Lent money is an asset, borrowed is a liability

//     return { totalLent, totalBorrowed, netWorthEffect };
//   }, [transactions]);


//   // Current Month Specific Metrics (for the 5 cards)
//   const currentMonthBreakdown = useMemo(() => calculateMonthBreakdownMetrics(currentMonth), [calculateMonthBreakdownMetrics, currentMonth]);

//   // Previous Month Income/Expenses/Savings (for the 3 cards)
//   const previousMonthSummary = useMemo(() => calculatePreviousMonthSummaryMetrics(previousMonth), [calculatePreviousMonthSummaryMetrics, previousMonth]);


//   // Overall Financial Snapshot Metrics
//   const overallSnapshot = useMemo(() => calculateOverallMetrics(), [calculateOverallMetrics]);


//   // Filtered transactions for the main table
//   const filteredTransactions = useMemo(() => {
//     return transactions.filter((txn) => {
//       const txnDate = new Date(txn.transactionDate + 'T00:00:00'); // Add time to ensure correct date comparison
//       const transactionMonth = txn.transactionDate.slice(0, 7);

//       // Month filter (takes precedence if set)
//       const monthMatch = !filterMonth || transactionMonth === filterMonth;

//       // Date range filter: Only apply if month filter is NOT set
//       const dateFromMatch = !filterDateFrom || !filterMonth || txnDate >= new Date(filterDateFrom + 'T00:00:00');
//       const dateToMatch = !filterDateTo || !filterMonth || txnDate <= new Date(filterDateTo + 'T23:59:59'); // End of day for To date

//       // Category filter
//       const catMatch = !filterCategory || txn.category === filterCategory;

//       // Transaction Type filter
//       const typeMatch = !filterTransactionType || txn.transactionType === filterTransactionType;

//       return monthMatch && dateFromMatch && dateToMatch && catMatch && typeMatch;
//     });
//   }, [filterMonth, filterCategory, filterTransactionType, filterDateFrom, filterDateTo, transactions]);

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
//       setFlashMessage({ type: 'success', message: 'Transaction deleted successfully.' });
//       setTimeout(() => setFlashMessage({ type: '', message: '' }), 3000);
//       setTransactions((prev) => prev.filter((t) => t.id !== id)); // Delete after showing message for better UX
//     }
//   };

//   // Get unique categories for the filter dropdown
//   const categoryOptions = useMemo(() => {
//     const categories = new Set(transactions.map(t => t.category));
//     return ['All', ...Array.from(categories)].sort();
//   }, [transactions]);

//   // Helper for category badge color (now includes dark mode styles)
//   const getCategoryBadgeClass = (category) => {
//     switch (category) {
//       case 'Salary': return 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100';
//       case 'Food': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100';
//       case 'Rent': return 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100';
//       case 'Loan': return 'bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100';
//       case 'Freelance': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-700 dark:text-indigo-100';
//       case 'Savings': return 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100';
//       case 'Lent': return 'bg-orange-100 text-orange-800 dark:bg-orange-700 dark:text-orange-100';
//       case 'Borrow': return 'bg-pink-100 text-pink-800 dark:bg-pink-700 dark:text-pink-100';
//       case 'Utilities': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-700 dark:text-cyan-100';
//       default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 font-sans text-gray-900 dark:from-gray-900 dark:via-gray-950 dark:to-black dark:text-gray-100 transition-colors duration-300">
//       {/* --- HEADER --- */}
//       <header className="relative overflow-hidden bg-gradient-to-r from-gray-800 via-slate-900 to-black text-white shadow-2xl dark:from-black dark:via-gray-950 dark:to-black">
//         <div className="absolute inset-0 bg-black/30"></div>
//         <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
//             <div>
//               <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
//                 Financial Overview
//               </h1>
//               <p className="text-lg text-gray-300 font-medium mt-1">
//                 Your personal command center for wealth management.
//               </p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={toggleTheme}
//                 className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
//                 title="Toggle Theme"
//               >
//                 {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
//               </button>
//               <Link
//                 to="/finance/report"
//                 className="inline-flex items-center bg-white/10 backdrop-blur-sm text-white px-5 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200"
//               >
//                 <FileText className="w-5 h-5 mr-2" />
//                 Detailed Reports
//               </Link>
//               <Link
//                 to="/finance/add"
//                 className="inline-flex items-center bg-blue-500 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//               >
//                 <PlusCircle className="w-5 h-5 mr-2" />
//                 New Transaction
//               </Link>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="w-full max-w-screen-xl mx-auto flex-grow px-4 py-8 sm:px-6 lg:px-8 space-y-8">
//         {flashMessage.message && (
//           <div className="animate__animated animate__fadeIn bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-md dark:bg-green-900 dark:border-green-700 dark:text-green-100" role="alert">
//             <p className="font-bold">Success</p>
//             <p>{flashMessage.message}</p>
//           </div>
//         )}

//         {/* --- CURRENT MONTH METRICS --- */}
//         <section className="animate__animated animate__fadeInUp">
//           <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">Current Month: {new Date(new Date().setMonth(new Date().getMonth())).toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
//             <MetricCard icon={PiggyBank} title="Savings (Month)" value={formatCurrency(currentMonthBreakdown.savings)} colorClass="bg-gradient-to-br from-blue-500 to-indigo-500" />
//             <MetricCard icon={Wallet} title="Expenses (Month)" value={formatCurrency(currentMonthBreakdown.expenses)} colorClass="bg-gradient-to-br from-red-500 to-rose-500" />
//             <MetricCard icon={TrendingDown} title="Loan (Month)" value={formatCurrency(currentMonthBreakdown.loan)} colorClass="bg-gradient-to-br from-purple-500 to-fuchsia-500" />
//             <MetricCard icon={TrendingUp} title="Borrow (Month)" value={formatCurrency(currentMonthBreakdown.borrow)} colorClass="bg-gradient-to-br from-yellow-500 to-amber-500" />
//             <MetricCard icon={DollarSign} title="Lent (Month)" value={formatCurrency(currentMonthBreakdown.lent)} colorClass="bg-gradient-to-br from-green-500 to-emerald-500" />
//           </div>
//         </section>

//         {/* --- PREVIOUS MONTH METRICS --- */}
//         <section className="animate__animated animate__fadeInUp" style={{ animationDelay: '0.1s' }}>
//           <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">Previous Month: {new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <MetricCard icon={DollarSign} title="Previous Income" value={formatCurrency(previousMonthSummary.income)} colorClass="bg-gradient-to-br from-green-600 to-emerald-600" />
//             <MetricCard icon={Wallet} title="Previous Expenses" value={formatCurrency(previousMonthSummary.expenses)} colorClass="bg-gradient-to-br from-red-600 to-rose-600" />
//             <MetricCard icon={PiggyBank} title="Previous Savings" value={formatCurrency(previousMonthSummary.savings)} colorClass="bg-gradient-to-br from-blue-600 to-indigo-600" />
//           </div>
//         </section>

//         {/* --- FINANCIAL SNAPSHOT --- */}
//         <section className="animate__animated animate__fadeInUp" style={{ animationDelay: '0.2s' }}>
//           <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 text-white dark:bg-gray-900">
//             <h2 className="text-2xl font-bold mb-4 flex items-center">
//               <Scale className="w-6 h-6 mr-3 text-blue-400" />
//               Financial Snapshot
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
//               <SnapshotItem title="Total Lent to Others" value={formatCurrency(overallSnapshot.totalLent)} color="text-green-400" />
//               <SnapshotItem title="Total Borrowed" value={formatCurrency(overallSnapshot.totalBorrowed)} color="text-yellow-400" />
//               <SnapshotItem title="Net Position" value={formatCurrency(overallSnapshot.netWorthEffect)} color={overallSnapshot.netWorthEffect >= 0 ? 'text-green-400' : 'text-red-400'} />
//             </div>
//           </div>
//         </section>

//         {/* --- RECENT TRANSACTIONS --- */}
//         <section className="animate__animated animate__fadeInUp" style={{ animationDelay: '0.4s' }}>
//           <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg p-6 dark:bg-gray-800/90 dark:border-gray-700/50">
//             <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Recent Transactions</h2>

//             {/* Filters */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
//               <div className="flex flex-col">
//                 <label htmlFor="filterMonth" className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Filter by Month</label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
//                   <input
//                     type="month"
//                     id="filterMonth"
//                     className="pl-10 pr-3 py-2 w-full rounded-lg bg-gray-100 border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
//                     value={filterMonth}
//                     onChange={(e) => {
//                       setFilterMonth(e.target.value);
//                       setFilterDateFrom(''); // Clear date range when month is selected
//                       setFilterDateTo('');
//                     }}
//                   />
//                 </div>
//               </div>

//               <div className="flex flex-col">
//                 <label htmlFor="filterDateFrom" className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Date From</label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
//                   <input
//                     type="date"
//                     id="filterDateFrom"
//                     className="pl-10 pr-3 py-2 w-full rounded-lg bg-gray-100 border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
//                     value={filterDateFrom}
//                     onChange={(e) => {
//                       setFilterDateFrom(e.target.value);
//                       setFilterMonth(''); // Clear month when date range is selected
//                     }}
//                   />
//                 </div>
//               </div>

//               <div className="flex flex-col">
//                 <label htmlFor="filterDateTo" className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Date To</label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
//                   <input
//                     type="date"
//                     id="filterDateTo"
//                     className="pl-10 pr-3 py-2 w-full rounded-lg bg-gray-100 border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
//                     value={filterDateTo}
//                     onChange={(e) => {
//                       setFilterDateTo(e.target.value);
//                       setFilterMonth(''); // Clear month when date range is selected
//                     }}
//                   />
//                 </div>
//               </div>

//               <div className="flex flex-col">
//                 <label htmlFor="filterCategory" className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Category</label>
//                 <div className="relative">
//                   <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
//                   <select
//                     id="filterCategory"
//                     className="pl-10 pr-3 py-2 w-full rounded-lg bg-gray-100 border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
//                     value={filterCategory}
//                     onChange={(e) => setFilterCategory(e.target.value)}
//                   >
//                     {categoryOptions.map(cat => <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>)}
//                   </select>
//                 </div>
//               </div>

//               <div className="flex flex-col">
//                 <label htmlFor="filterTransactionType" className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Type</label>
//                 <div className="relative">
//                   <ArrowLeftRight className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
//                   <select
//                     id="filterTransactionType"
//                     className="pl-10 pr-3 py-2 w-full rounded-lg bg-gray-100 border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
//                     value={filterTransactionType}
//                     onChange={(e) => setFilterTransactionType(e.target.value)}
//                   >
//                     <option value="">All</option>
//                     <option value="Credit">Credit</option>
//                     <option value="Debit">Debit</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
//               <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                 <thead className="bg-gray-100 dark:bg-gray-700"> {/* Changed header background */}
//                   <tr>
//                     {['Date', 'Description', 'Category', 'Type', 'Amount', 'Payment Method', 'Counterparty', 'Status', 'Actions'].map((hdr) => (
//                       <th key={hdr} className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider dark:text-gray-200"> {/* Changed header text color */}
//                         {hdr}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
//                   {filteredTransactions.length > 0 ? (
//                     filteredTransactions.map((txn) => (
//                       <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(txn.transactionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium dark:text-gray-100">{txn.description}</td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryBadgeClass(txn.category)}`}>
//                             {txn.category}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{txn.transactionType}</td>
//                         <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${txn.transactionType === 'Credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                           {txn.transactionType === 'Credit' ? '+' : '-'} {formatCurrency(txn.amount)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{txn.paymentMethod}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{txn.counterparty}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{txn.loanStatus}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex items-center space-x-3">
//                             <ActionButton icon={Eye} to={`/finance/view/${txn.id}`} className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400" title="View" />
//                             <ActionButton icon={Edit2} to={`/finance/edit/${txn.id}`} className="text-gray-500 hover:text-yellow-600 dark:text-gray-400 dark:hover:text-yellow-400" title="Edit" />
//                             <ActionButton icon={Trash2} onClick={() => handleDelete(txn.id)} className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400" title="Delete" />
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="9" className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
//                         No transactions found for the selected filters.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </section>

//         <div className="mt-6 text-right text-sm text-gray-500 dark:text-gray-400 flex items-center justify-end">
//           <Clock className="w-4 h-4 mr-1" /> Server Time: {serverTime}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default FinanceDashboard;