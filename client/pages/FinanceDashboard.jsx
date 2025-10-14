import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  PiggyBank,
  Clock,
  Paperclip,
  Download,
  FileText,
  Printer,
  Calendar,
  DollarSign,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Sparkles,
  Zap,
  Shield,
  Star,
} from 'lucide-react';
import baseUrl from '../api/api';
import { useTheme } from '../src/theme/ThemeProvider';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import axios from 'axios';

// Format INR
const formatRupee = amount =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount ?? 0);

// Enhanced Metric Card Component
const MetricCard = ({ icon: Icon, title, value, colorClass, trend, trendValue, subtitle }) => (
  <div className={`${colorClass} text-white rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center space-y-3 min-w-0 overflow-hidden relative group hover:scale-105 transition-all duration-300`}>
    {/* Background Pattern */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
    
    <div className="relative z-10 w-full">
      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl mb-4 group-hover:bg-white/30 transition-all duration-300">
        <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
      </div>
      
       <div className="text-center space-y-2 w-full">
         <p className="text-sm font-medium opacity-90 text-center break-words">{title}</p>
         <div className="w-full overflow-hidden">
           <p
             className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight text-center break-all overflow-hidden"
             style={{ 
               fontVariantNumeric: 'tabular-nums', 
               lineHeight: 1.1,
               wordBreak: 'break-all',
               overflowWrap: 'break-word'
             }}
             title={typeof value === 'number' ? value.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : value}
           >
             {typeof value === 'number'
               ? `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
               : value}
           </p>
         </div>
        
        {subtitle && (
          <p className="text-xs opacity-75">{subtitle}</p>
        )}
        
        {trend && trendValue && (
          <div className="flex items-center justify-center space-x-1 mt-2">
            {trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4 text-green-200" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-200" />
            )}
            <span className="text-xs font-medium opacity-90">{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Enhanced Transaction Card
const TransactionCard = ({ transaction, themeClasses, onView, onEdit, onDelete }) => {
  // Support both 'type' and 'transactionType'
  const type = (transaction.type || transaction.transactionType || '').toUpperCase();
  const isExpense = type === 'EXPENSE';
  const isLoanOrBorrow = type === 'LOAN' || type === 'BORROW';
  const isPending = isLoanOrBorrow && (transaction.dueStatus === 'UNPAID' || transaction.dueStatus === 'PARTIALLY_PAID');
  const amountColor = isExpense ? 'text-red-500' : 'text-green-500';

  const getTypeIcon = () => {
    switch (type) {
      case 'INCOME': return <TrendingUpIcon className="w-4 h-4" />;
      case 'EXPENSE': return <TrendingDownIcon className="w-4 h-4" />;
      case 'LOAN': return <ArrowUpRight className="w-4 h-4" />;
      case 'BORROW': return <ArrowDownRight className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'INCOME': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300';
      case 'EXPENSE': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'LOAN': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'BORROW': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };
  
  return (
    <div
      className={`
        ${themeClasses.cardBg} border ${themeClasses.border} rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 animate__animated animate__fadeIn group
        ${isPending ? 'ring-2 ring-amber-400/60 bg-amber-50/50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' : 'hover:scale-[1.01]'}
      `}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl ${getTypeColor()} flex-shrink-0`}>
              {getTypeIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold ${themeClasses.text} text-lg sm:text-xl truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
                {transaction.note || transaction.description}
              </h3>
              {transaction.attachment && (
                <a
                  href={URL.createObjectURL(transaction.attachment)}
                  download={transaction.attachment.name}
                  title="Download attachment"
                  className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-700 transition-colors mt-1"
                >
                  <Paperclip className="w-3 h-3" />
                  <span className="text-xs">Attachment</span>
                </a>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <span className={`${themeClasses.textSecondary} text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full font-medium`}>
              {transaction.category}
            </span>
            <span className={`text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1 ${getTypeColor()}`}>
              {getTypeIcon()}
              {type}
            </span>
            {(type === 'LOAN' || type === 'BORROW') && transaction.dueStatus && (
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                transaction.dueStatus === 'PAID'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : transaction.dueStatus === 'UNPAID'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
              }`}>
                {type === 'LOAN'
                  ? `Given: ${transaction.dueStatus.replace('_', ' ')}`
                  : `Taken: ${transaction.dueStatus.replace('_', ' ')}`}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-3">
            <Calendar className={`w-4 h-4 ${themeClasses.textSecondary}`} />
            <p className={`${themeClasses.textSecondary} text-sm font-medium`}>
              {new Date(transaction.date || transaction.transactionDate).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                weekday: 'short',
              })}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:items-end w-full sm:w-auto gap-3">
          <div className="text-right">
            <p className={`font-black text-lg sm:text-xl lg:text-2xl ${amountColor} mb-1 break-all`}>
              {formatRupee(isExpense ? -Math.abs(transaction.amount) : Math.abs(transaction.amount))}
            </p>
            <p className={`text-xs ${themeClasses.textSecondary} font-medium`}>
              {isExpense ? 'Expense' : 'Income'}
            </p>
          </div>
          
          <div className="flex space-x-1.5">
            <button
              onClick={() => onView(transaction.id)}
              className={`p-2.5 rounded-lg ${themeClasses.buttonSecondary} hover:bg-opacity-80 transition-all duration-200 group hover:scale-105`}
              title="View Details"
            >
              <Eye size={16} className={`${themeClasses.text} group-hover:scale-110 transition-transform`} />
            </button>
            <button
              onClick={() => onEdit(transaction.id)}
              className="p-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 group hover:scale-105 shadow-lg hover:shadow-xl"
              title="Edit Transaction"
            >
              <Edit2 size={16} className="group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => onDelete(transaction.id)}
              className="p-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-200 group hover:scale-105 shadow-lg hover:shadow-xl"
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

export default function FinanceDashboard() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterMinAmount, setFilterMinAmount] = useState('');
  const [filterMaxAmount, setFilterMaxAmount] = useState('');
  const [filterDueStatus, setFilterDueStatus] = useState('');
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
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white/95 backdrop-blur-sm',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-300/80',
    inputBorder: isDarkMode ? 'border-gray-600' : 'border-gray-400',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    buttonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    buttonSecondary: isDarkMode
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
      : 'bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300',
  };

  // Fetch transactions from backend API
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please login to continue.');
        setTimeout(() => navigate('/login'), 1500);
        return;
      }
      const res = await baseUrl.get('/api/finance/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Robust: support array, {content: [...]}, {transactions: [...]}
      let txns = [];
      if (Array.isArray(res.data)) {
        txns = res.data;
      } else if (res.data.content) {
        txns = res.data.content;
      } else if (res.data.transactions) {
        txns = res.data.transactions;
      }
      setTransactions(txns);
    } catch (err) {
      let errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch transactions.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // --- Memoized Metrics ---
  const today = useMemo(() => new Date(), []);
  const getMonthString = useCallback((date) => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`, []);
  const getYearString = useCallback((date) => `${date.getFullYear()}`, []);

  const currentMonthStr = useMemo(() => getMonthString(today), [getMonthString, today]);
  const prevMonthDate = useMemo(() => new Date(today.getFullYear(), today.getMonth() - 1, 1), [today]);
  const previousMonthStr = useMemo(() => getMonthString(prevMonthDate), [getMonthString, prevMonthDate]);
  const currentYearStr = useMemo(() => getYearString(today), [getYearString, today]);

  // Helper to get correct field names
  const getType = t => t.type || t.transactionType || '';
  const getDate = t => t.date || t.transactionDate || '';
  const getAmount = t => typeof t.amount === 'number' ? t.amount : Number(t.amount) || 0;

  // Memoized calculations for metrics
  const {
    currentMonthTxns, currentIncome, currentExpense, currentSavings, currentLoss,
    prevMonthTxns, prevIncome, prevExpense, prevSavings, prevLoss,
    totalIncome, totalExpense, netBalance,
    thisYearTxns, thisYearIncome, thisYearExpense, thisYearSavings, thisYearLoss
  } = useMemo(() => {
    const currentMonthTxns = transactions.filter(t => getDate(t).startsWith(currentMonthStr));
    const currentIncome = currentMonthTxns.filter(t => getType(t).toUpperCase() === 'INCOME').reduce((s, t) => s + getAmount(t), 0);
    const currentExpense = currentMonthTxns.filter(t => getType(t).toUpperCase() === 'EXPENSE').reduce((s, t) => s + getAmount(t), 0);
    const currentSavings = currentIncome - currentExpense;
    const currentLoss = currentSavings < 0 ? Math.abs(currentSavings) : 0;

    const prevMonthTxns = transactions.filter(t => getDate(t).startsWith(previousMonthStr));
    const prevIncome = prevMonthTxns.filter(t => getType(t).toUpperCase() === 'INCOME').reduce((s, t) => s + getAmount(t), 0);
    const prevExpense = prevMonthTxns.filter(t => getType(t).toUpperCase() === 'EXPENSE').reduce((s, t) => s + getAmount(t), 0);
    const prevSavings = prevIncome - prevExpense;
    const prevLoss = prevSavings < 0 ? Math.abs(prevSavings) : 0;

    const totalIncome = transactions.filter(t => getType(t).toUpperCase() === 'INCOME').reduce((s, t) => s + getAmount(t), 0);
    const totalExpense = transactions.filter(t => getType(t).toUpperCase() === 'EXPENSE').reduce((s, t) => s + getAmount(t), 0);
    const netBalance = totalIncome - totalExpense;

    const thisYearTxns = transactions.filter(t => getDate(t).startsWith(currentYearStr));
    const thisYearIncome = thisYearTxns.filter(t => getType(t).toUpperCase() === 'INCOME').reduce((s, t) => s + getAmount(t), 0);
    const thisYearExpense = thisYearTxns.filter(t => getType(t).toUpperCase() === 'EXPENSE').reduce((s, t) => s + getAmount(t), 0);
    const thisYearSavings = thisYearIncome - thisYearExpense;
    const thisYearLoss = thisYearSavings < 0 ? Math.abs(thisYearSavings) : 0;

    return {
      currentMonthTxns, currentIncome, currentExpense, currentSavings, currentLoss,
      prevMonthTxns, prevIncome, prevExpense, prevSavings, prevLoss,
      totalIncome, totalExpense, netBalance,
      thisYearTxns, thisYearIncome, thisYearExpense, thisYearSavings, thisYearLoss
    };
  }, [transactions, currentMonthStr, previousMonthStr, currentYearStr]);

  // --- Personalized Suggestion ---
  let netBalanceMessage = '';
  let netBalanceColor = '';
  let suggestion = '';
  if (netBalance > 0 && thisYearSavings > 0) {
    netBalanceMessage = `🎉 Awesome! You're growing your wealth and saving money this year. Keep it up!`;
    netBalanceColor = 'text-green-600 dark:text-green-400';
    suggestion = "Consider investing your savings for better returns.";
  } else if (netBalance > 0 && thisYearSavings <= 0) {
    netBalanceMessage = `⚠️ You have a positive net balance, but your savings are low or negative. Try to cut down on expenses and save more!`;
    netBalanceColor = 'text-yellow-600 dark:text-yellow-400';
    suggestion = "Review your discretionary spending and set a monthly savings goal.";
  } else if (netBalance <= 0 && thisYearLoss > 0) {
    netBalanceMessage = `🚨 You're running a loss this year. Review your spending and make a plan to recover!`;
    netBalanceColor = 'text-red-600 dark:text-red-400';
    suggestion = "Analyze your largest expense categories and consider reducing non-essential costs.";
  } else {
    netBalanceMessage = `Keep tracking your finances for better insights and control.`;
    netBalanceColor = 'text-blue-600 dark:text-blue-400';
    suggestion = "Regularly update your records for the most accurate overview.";
  }

  // --- Filtering and Sorting ---
  const filteredTransactions = useMemo(
    () =>
      transactions
        .filter((t) => {
          const d = getDate(t);
          if (!d) return false;
          const dateObj = d ? new Date(d) : null;
          const amt = getAmount(t);
          const note = t.note || t.description || '';
          // Search filter
          const matchesSearch =
            !searchQuery ||
            note.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase()));
          // Type filter (robust: always compare uppercase)
          const matchesType =
            filterType === 'All' ||
            getType(t).toUpperCase() === filterType.toUpperCase();
          // Category filter (robust: always compare lowercase)
          const matchesCat =
            filterCategory === 'All' ||
            (t.category && t.category.toLowerCase() === filterCategory.toLowerCase());
          // Date filter
          const start = filterStartDate ? new Date(filterStartDate) : null;
          const end = filterEndDate ? new Date(filterEndDate) : null;
          const matchesDate =
            (!start || (dateObj && dateObj >= start)) &&
            (!end || (dateObj && dateObj <= end));
          // Amount filter (robust: handle empty string)
          const minA = filterMinAmount !== '' ? parseFloat(filterMinAmount) : -Infinity;
          const maxA = filterMaxAmount !== '' ? parseFloat(filterMaxAmount) : Infinity;
          const matchesAmount = amt >= minA && amt <= maxA;
          // Due status filter
          const matchesDueStatus =
            !filterDueStatus || (t.dueStatus && t.dueStatus === filterDueStatus);
          return (
            matchesSearch &&
            matchesType &&
            matchesCat &&
            matchesDate &&
            matchesAmount &&
            matchesDueStatus
          );
        })
        .sort((a, b) => new Date(getDate(b)) - new Date(getDate(a))),
    [
      transactions,
      searchQuery,
      filterType,
      filterCategory,
      filterStartDate,
      filterEndDate,
      filterMinAmount,
      filterMaxAmount,
      filterDueStatus,
    ]
  );

  // --- Limiting Logic ---
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, filterCategory, filterStartDate, filterEndDate, filterMinAmount, filterMaxAmount, filterDueStatus]);

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
    setFilterDueStatus('');
    setCurrentPage(1);
  };

  // Action Handlers
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
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-6">
                <p className={`font-semibold ${themeClasses.text}`}>
                  {transaction.note || transaction.description}
                </p>
                <p className={`text-sm ${themeClasses.textSecondary}`}>
                  {formatRupee(getAmount(transaction))} • {transaction.category}
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
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('authToken');
                    if (!token) {
                      throw new Error('Unauthorized. Please log in.');
                    }

                    // call your DELETE endpoint
                    await baseUrl.delete(
                      `/api/finance/transactions/delete/${id}`,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );

                    // only update UI after success
                    setTransactions(prev => prev.filter(t => t.id !== id));
                    onClose();
                  } catch (error) {
                    console.error('Delete failed:', error);
                    setError(
                      error.response?.data?.message ||
                      error.message ||
                      'Failed to delete transaction.'
                    );
                  }
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

  // const handleDelete = (id) => {
  //   const transaction = transactions.find(t => t.id === id);
  //   confirmAlert({
  //     customUI: ({ onClose }) => (
  //       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  //         <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-xl shadow-2xl p-6 max-w-md w-full animate__animated animate__zoomIn`}>
  //           <div className="text-center">
  //             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
  //               <Trash2 className="w-8 h-8 text-red-600" />
  //             </div>
  //             <h1 className={`text-2xl font-bold mb-2 ${themeClasses.text}`}>Confirm Delete</h1>
  //             <p className={`${themeClasses.textSecondary} mb-2`}>
  //               Are you sure you want to delete this transaction?
  //             </p>
  //             {transaction && (
  //               <div className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-6`}>
  //                 <p className={`font-semibold ${themeClasses.text}`}>{transaction.note || transaction.description}</p>
  //                 <p className={`text-sm ${themeClasses.textSecondary}`}>
  //                   {formatRupee(getAmount(transaction))} • {transaction.category}
  //                 </p>
  //               </div>
  //             )}
  //             <div className="flex gap-3">
  //               <button
  //                 onClick={onClose}
  //                 className={`flex-1 px-4 py-2 rounded-lg ${themeClasses.buttonSecondary} font-medium transition-colors`}
  //               >
  //                 Cancel
  //               </button>
  //               <button
  //                 onClick={() => {
  //                   setTransactions(prev => prev.filter(t => t.id !== id));
  //                   onClose();
  //                 }}
  //                 className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
  //               >
  //                 Delete
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     ),
  //   });
  // };

  // --- Export Feature ---
  const handleExportCSV = () => {
    const header = ["Date", "Note", "Category", "Type", "Amount", "Attachment"];
    const rows = filteredTransactions.map(t => [
      t.date,
      t.note,
      t.category,
      t.type,
      t.amount,
      t.attachment ? t.attachment.name : ""
    ]);
    let csvContent = "data:text/csv;charset=utf-8," + [header, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // Branding Section
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Arth", 14, 16);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("PRODUCTIVITY", 40, 13);
    doc.setFontSize(9);
    doc.text("World's #1 Productivity Platform", 140, 10, { align: "right", maxWidth: 60 });
    doc.setFontSize(13);
    doc.setTextColor(30, 64, 175);
    doc.text("Revolutionize Your Productivity", 14, 36);
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.text("The ultimate ecosystem for Financial Intelligence, Task Mastery & AI-Powered Insights", 14, 42, { maxWidth: 180 });
    doc.setFontSize(9);
    doc.text("Arth is your all-in-one platform for mastering productivity, personal finance, and AI-powered insights. Built for students, professionals, and teams who want to achieve more with less effort—securely, beautifully, and intelligently.", 14, 48, { maxWidth: 180 });

    // CREDIT
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 64, 175);
    doc.text("Designed and Developed By Ritesh Raj Tiwari", 14, 60);
    // Main Report Title
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Finance Dashboard Summary", 14, 70);

    // Summary Table
    doc.setFontSize(13);
    doc.setTextColor(30, 64, 175);
    doc.setFont("helvetica", "bold");
    doc.text("Summary (Current Month, Previous Month, This Year)", 14, 80);

    autoTable(doc, {
      head: [[
        "Period",
        "Income",
        "Expense",
        "Savings",
        "Loss"
      ]],
      body: [
        [
          "Current Month",
          formatRupee(currentIncome),
          formatRupee(currentExpense),
          formatRupee(currentSavings),
          formatRupee(currentLoss)
        ],
        [
          "Previous Month",
          formatRupee(prevIncome),
          formatRupee(prevExpense),
          formatRupee(prevSavings),
          formatRupee(prevLoss)
        ],
        [
          "This Year",
          formatRupee(thisYearIncome),
          formatRupee(thisYearExpense),
          formatRupee(thisYearSavings),
          formatRupee(thisYearLoss)
        ]
      ],
      startY: 86,
      styles: { fontSize: 11 },
      headStyles: { fillColor: [30, 64, 175] },
      margin: { left: 14, right: 14 }
    });

    // Personalized Suggestion
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.setFont("helvetica", "italic");
    doc.text(`Personalized Suggestion: ${suggestion}`, 14, doc.lastAutoTable.finalY + 10);

    // Transaction Table
    doc.setFontSize(13);
    doc.setTextColor(30, 64, 175);
    doc.setFont("helvetica", "bold");
    doc.text("Transaction Details", 14, doc.lastAutoTable.finalY + 20);

    autoTable(doc, {
      head: [["Date", "Note", "Category", "Type", "Amount", "Attachment"]],
      body: filteredTransactions.map(t => [
        t.date,
        t.note,
        t.category,
        t.type,
        formatRupee(t.amount),
        t.attachment ? t.attachment.name : ""
      ]),
      startY: doc.lastAutoTable.finalY + 26,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [30, 64, 175] },
      margin: { left: 14, right: 14 }
    });

    doc.save("finance_dashboard.pdf");
  };

  const handlePrint = () => {
    let html = `
      <html>
        <head>
          <title>Finance Dashboard Print</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <style>
            body { font-family: Arial, sans-serif; padding: 2vw; }
            h2 { color: #1e40af; font-size: 1.3em; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 24px; }
            th, td { border: 1px solid #ddd; padding: 6px 4px; font-size: 0.95em; word-break: break-word; }
            th { background: #1e40af; color: #fff; }
            .summary-table th, .summary-table td { text-align: center; }
            .branding { background: #1e40af; color: #fff; padding: 2vw; font-size: 1.5em; font-weight: bold; }
            .credit { color: #1e40af; font-weight: bold; margin-bottom: 1em; }
            .suggestion { font-style: italic; color: #444; margin-bottom: 1.5em; }
            @media (max-width: 600px) {
              body { padding: 2vw 1vw; }
              table, th, td { font-size: 0.85em; }
              .branding { font-size: 1.1em; padding: 3vw 1vw; }
            }
          </style>
        </head>
        <body>
          <div class="branding">Arth</div>
          <div class="credit">Designed and Developed By Ritesh Raj Tiwari</div>
          <h2>Finance Dashboard Summary</h2>
          <table class="summary-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Income</th>
                <th>Expense</th>
                <th>Savings</th>
                <th>Loss</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Current Month</td>
                <td>${formatRupee(currentIncome)}</td>
                <td>${formatRupee(currentExpense)}</td>
                <td>${formatRupee(currentSavings)}</td>
                <td>${formatRupee(currentLoss)}</td>
              </tr>
              <tr>
                <td>Previous Month</td>
                <td>${formatRupee(prevIncome)}</td>
                <td>${formatRupee(prevExpense)}</td>
                <td>${formatRupee(prevSavings)}</td>
                <td>${formatRupee(prevLoss)}</td>
              </tr>
              <tr>
                <td>This Year</td>
                <td>${formatRupee(thisYearIncome)}</td>
                <td>${formatRupee(thisYearExpense)}</td>
                <td>${formatRupee(thisYearSavings)}</td>
                <td>${formatRupee(thisYearLoss)}</td>
              </tr>
            </tbody>
          </table>
          <div class="suggestion"><b>Personalized Suggestion:</b> ${suggestion}</div>
          <h2>All Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Note</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Attachment</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTransactions.map(t => `
                <tr>
                  <td>${t.date}</td>
                  <td>${t.note}</td>
                  <td>${t.category}</td>
                  <td>${t.type}</td>
                  <td>${formatRupee(t.amount)}</td>
                  <td>${t.attachment ? t.attachment.name : ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '', 'height=800,width=1200');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  // Add a loading class to body while loading to prevent background flicker and overflow
  useEffect(() => {
    if (loading) {
      document.body.classList.add('arth-bg-loading');
      document.documentElement.classList.add('arth-bg-loading');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';
      document.documentElement.style.overscrollBehavior = 'none';
    } else {
      document.body.classList.remove('arth-bg-loading');
      document.documentElement.classList.remove('arth-bg-loading');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.overscrollBehavior = '';
      document.documentElement.style.overscrollBehavior = '';
    }
    // Clean up on unmount
    return () => {
      document.body.classList.remove('arth-bg-loading');
      document.documentElement.classList.remove('arth-bg-loading');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.overscrollBehavior = '';
      document.documentElement.style.overscrollBehavior = '';
    };
  }, [loading]);

  // --- Pending Loans/Borrows Metrics ---
  const pendingLoansGiven = transactions.filter(
    t => (getType(t) === 'LOAN') && (t.dueStatus === 'UNPAID' || t.dueStatus === 'PARTIALLY_PAID')
  ).length;
  const pendingBorrowsTaken = transactions.filter(
    t => (getType(t) === 'BORROW') && (t.dueStatus === 'UNPAID' || t.dueStatus === 'PARTIALLY_PAID')
  ).length;
  const totalPending = pendingLoansGiven + pendingBorrowsTaken;

  // --- Error/Loading UI ---
  if (loading) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 ${themeClasses.bg}`}>
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

  if (error) {
    return (
      <div className={`min-h-screen ${themeClasses.bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="mb-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          </div>
          <p className="text-lg font-semibold text-red-600">{error}</p>
          <button
            onClick={fetchTransactions}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  

  return (
    <div className={`min-h-screen ${themeClasses.bg} transition-all duration-300 font-sans`}>
      {/* ENHANCED HEADER */}
      <header className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
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
                    <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight">
                    Financial Command Center
                  </h1>
                  <p className="text-white/80 text-base sm:text-lg lg:text-xl font-medium mt-1 sm:mt-2">
                    Master your money with intelligent insights
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <IndianRupee className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-medium">Net Balance</p>
                    <p className="text-white text-lg font-bold">{formatRupee(netBalance)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-medium">Total Transactions</p>
                    <p className="text-white text-lg font-bold">{filteredTransactions.length}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-medium">Financial Health</p>
                    <p className="text-white text-lg font-bold">
                      {netBalance > 0 ? 'Excellent' : 'Needs Attention'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              
              <Link
                to="/finance/report"
                className="inline-flex items-center justify-center px-6 py-4 rounded-2xl font-bold shadow-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-3xl group"
              >
                <BarChart3 className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Analytics Report</span>
                <span className="sm:hidden">Report</span>
              </Link>
              
              <Link
                to="/finance/add"
                className="inline-flex items-center justify-center px-6 py-4 rounded-2xl font-bold shadow-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-3xl group"
              >
                <PlusCircle className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">New Transaction</span>
                <span className="sm:hidden">Add</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* --- ENHANCED METRICS --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* --- CURRENT MONTH METRICS --- */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-xl sm:text-2xl lg:text-3xl font-black ${themeClasses.text} mb-2`}>Current Month Overview</h2>
              <p className={`${themeClasses.textSecondary} font-medium`}>Your financial performance this month</p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl px-4 py-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className={`text-sm font-medium ${themeClasses.textSecondary}`}>
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <MetricCard 
              icon={TrendingUpIcon} 
              title="Income" 
              value={currentIncome} 
              colorClass="bg-gradient-to-br from-emerald-500 to-green-600" 
              subtitle="This month"
              trend={currentIncome > prevIncome ? 'up' : 'down'}
              trendValue={prevIncome > 0 ? `${Math.round(((currentIncome - prevIncome) / prevIncome) * 100)}%` : '0%'}
            />
            <MetricCard 
              icon={TrendingDownIcon} 
              title="Expenses" 
              value={currentExpense} 
              colorClass="bg-gradient-to-br from-red-500 to-rose-600" 
              subtitle="This month"
              trend={currentExpense < prevExpense ? 'up' : 'down'}
              trendValue={prevExpense > 0 ? `${Math.round(((currentExpense - prevExpense) / prevExpense) * 100)}%` : '0%'}
            />
            <MetricCard 
              icon={PiggyBank} 
              title="Savings" 
              value={currentSavings} 
              colorClass="bg-gradient-to-br from-blue-500 to-indigo-600" 
              subtitle="This month"
              trend={currentSavings > prevSavings ? 'up' : 'down'}
              trendValue={prevSavings > 0 ? `${Math.round(((currentSavings - prevSavings) / prevSavings) * 100)}%` : '0%'}
            />
            <MetricCard 
              icon={AlertCircle} 
              title="Loss" 
              value={currentLoss} 
              colorClass="bg-gradient-to-br from-amber-500 to-orange-600" 
              subtitle="This month"
            />
            <MetricCard 
              icon={CreditCard} 
              title="Transactions" 
              value={currentMonthTxns.length} 
              colorClass="bg-gradient-to-br from-purple-500 to-violet-600" 
              subtitle="This month"
            />
            <MetricCard 
              icon={Target} 
              title="Net Balance" 
              value={currentSavings} 
              colorClass="bg-gradient-to-br from-cyan-500 to-blue-600" 
              subtitle="This month"
            />
          </div>
        </section>

        {/* --- PENDING LOANS/BORROWS METRICS --- */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-2xl sm:text-3xl font-black ${themeClasses.text} mb-2`}>Pending Transactions</h2>
              <p className={`${themeClasses.textSecondary} font-medium`}>Track your loans and borrows</p>
            </div>
            {totalPending > 0 && (
              <div className="flex items-center space-x-2 bg-amber-100 dark:bg-amber-900/30 rounded-2xl px-4 py-2">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
                  {totalPending} Pending
                </span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <MetricCard
              icon={ArrowUpRight}
              title="Loans Given"
              value={pendingLoansGiven}
              colorClass="bg-gradient-to-br from-amber-500 to-orange-600"
              subtitle="Awaiting payment"
            />
            <MetricCard
              icon={ArrowDownRight}
              title="Borrows Taken"
              value={pendingBorrowsTaken}
              colorClass="bg-gradient-to-br from-rose-500 to-pink-600"
              subtitle="To be repaid"
            />
            <MetricCard
              icon={AlertCircle}
              title="Total Pending"
              value={totalPending}
              colorClass="bg-gradient-to-br from-red-500 to-rose-600"
              subtitle="All transactions"
            />
          </div>
        </section>

        {/* --- YEARLY OVERVIEW --- */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-2xl sm:text-3xl font-black ${themeClasses.text} mb-2`}>Yearly Overview</h2>
              <p className={`${themeClasses.textSecondary} font-medium`}>Your financial performance this year</p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl px-4 py-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className={`text-sm font-medium ${themeClasses.textSecondary}`}>
                {new Date().getFullYear()}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              icon={TrendingUpIcon} 
              title="Annual Income" 
              value={thisYearIncome} 
              colorClass="bg-gradient-to-br from-emerald-400 to-green-500" 
              subtitle="This year"
            />
            <MetricCard 
              icon={TrendingDownIcon} 
              title="Annual Expenses" 
              value={thisYearExpense} 
              colorClass="bg-gradient-to-br from-red-400 to-rose-500" 
              subtitle="This year"
            />
            <MetricCard 
              icon={PiggyBank} 
              title="Annual Savings" 
              value={thisYearSavings} 
              colorClass="bg-gradient-to-br from-blue-400 to-indigo-500" 
              subtitle="This year"
            />
            <MetricCard 
              icon={Shield} 
              title="Financial Health" 
              value={thisYearLoss} 
              colorClass="bg-gradient-to-br from-purple-400 to-violet-500" 
              subtitle="This year"
            />
          </div>
          
          {/* Financial Insights */}
          <div className={`mt-8 p-6 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 ${netBalanceColor} animate__animated animate__fadeIn`}>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Financial Insights</h3>
                <p className="text-base font-medium mb-3">{netBalanceMessage}</p>
                <p className="text-sm opacity-80">{suggestion}</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- ENHANCED TRANSACTION RECORDS --- */}
        <section id="transaction-table-section" className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-3xl p-6 sm:p-8 shadow-2xl animate__animated animate__fadeInUp`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className={`text-2xl sm:text-3xl font-black ${themeClasses.text}`}>
                    Transaction Records
                  </h2>
                  <p className={`${themeClasses.textSecondary} font-medium`}>
                    {filteredTransactions.length} transactions found
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center space-x-2 p-3 rounded-2xl ${themeClasses.hover} transition-all duration-300 ${themeClasses.text} border ${themeClasses.border} sm:hidden`}
              >
                <Filter className="w-5 h-5" />
                <span className="font-medium">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              </button>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
                  title="Export as CSV"
                >
                  <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Export CSV</span>
                  <span className="sm:hidden">CSV</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="inline-flex items-center px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
                  title="Export as PDF"
                >
                  <FileText className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Export PDF</span>
                  <span className="sm:hidden">PDF</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold shadow-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
                  title="Print"
                >
                  <Printer className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Print</span>
                  <span className="sm:hidden">Print</span>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Filter Section */}
          <div className={`${showFilters ? 'block' : 'hidden'} sm:block animate__animated animate__fadeIn mb-6`}>
            <div className={`bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border ${themeClasses.border}`}>
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {/* Search Input */}
                <div className="relative col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2">
                  <Search className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 ${themeClasses.textSecondary}`} />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full border-2 ${themeClasses.inputBorder} rounded-xl pl-12 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.bg} ${themeClasses.text} font-medium transition-all duration-300`}
                  />
                </div>

                {/* Type Filter */}
                <div className="relative">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className={`w-full border-2 ${themeClasses.inputBorder} rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.bg} ${themeClasses.text} font-medium transition-all duration-300 appearance-none`}
                  >
                    <option value="All">All Types</option>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                    <option value="LOAN">Loan (Given)</option>
                    <option value="BORROW">Borrow (Taken)</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className={`w-full border-2 ${themeClasses.inputBorder} rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.bg} ${themeClasses.text} font-medium transition-all duration-300 appearance-none`}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2 grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className={`border-2 ${themeClasses.inputBorder} rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.bg} ${themeClasses.text} font-medium transition-all duration-300`}
                    title="Start Date"
                  />
                  <input
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className={`border-2 ${themeClasses.inputBorder} rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.bg} ${themeClasses.text} font-medium transition-all duration-300`}
                    title="End Date"
                  />
                </div>

                {/* Amount Range */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2 grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min Amount"
                    value={filterMinAmount}
                    onChange={(e) => setFilterMinAmount(e.target.value)}
                    className={`border-2 ${themeClasses.inputBorder} rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.bg} ${themeClasses.text} font-medium transition-all duration-300`}
                    title="Minimum Amount"
                  />
                  <input
                    type="number"
                    placeholder="Max Amount"
                    value={filterMaxAmount}
                    onChange={(e) => setFilterMaxAmount(e.target.value)}
                    className={`border-2 ${themeClasses.inputBorder} rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.bg} ${themeClasses.text} font-medium transition-all duration-300`}
                    title="Maximum Amount"
                  />
                </div>

                {/* Due Status Filter */}
                <div className="relative">
                  <select
                    value={filterDueStatus}
                    onChange={e => setFilterDueStatus(e.target.value)}
                    className={`w-full border-2 ${themeClasses.inputBorder} rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.bg} ${themeClasses.text} font-medium transition-all duration-300 appearance-none`}
                  >
                    <option value="">All Status</option>
                    <option value="PAID">Paid</option>
                    <option value="UNPAID">Unpaid</option>
                    <option value="PARTIALLY_PAID">Partially Paid</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Transaction List */}
          <div className="space-y-4">
            {currentTransactions.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className={`text-xl font-bold ${themeClasses.text} mb-3`}>
                  No transactions found
                </h3>
                <p className={`${themeClasses.textSecondary} text-base mb-6 max-w-md mx-auto`}>
                  No transactions match your current filters. Try adjusting your search criteria or clear all filters to see all transactions.
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
                      <span className="font-bold text-blue-600 dark:text-blue-400">{Math.min(indexOfLast, filteredTransactions.length)}</span> of{' '}
                      <span className="font-bold text-blue-600 dark:text-blue-400">{filteredTransactions.length}</span> transactions
                    </p>
                  </div>
                </div>
              </>
            )}
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
                <span>Pending transactions highlighted</span>
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
}

// Add this CSS (can be in your global CSS or inside a <style> tag in your main layout)
if (typeof window !== "undefined" && !document.getElementById('arth-bg-loading-style')) {
  const style = document.createElement('style');
  style.id = 'arth-bg-loading-style';
  style.innerHTML = `
    body.arth-bg-loading, html.arth-bg-loading {
      background: linear-gradient(135deg, #e0f2fe 0%, #f8fafc 50%, #ede9fe 100%) !important;
      transition: background 0.2s;
      min-height: 100vh;
      overflow: hidden !important;
    }
  `;
  document.head.appendChild(style);
}
































// // UserProfilePage.jsx
// import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
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
//   FaHome,
//   FaTrophy,
//   FaCalendarAlt,
// } from "react-icons/fa";
// import { Sun, Moon, Activity, TrendingUp } from 'lucide-react';
// import { useTheme } from "../src/theme/ThemeProvider";

// // Custom hooks for better code organization
// const useAuth = () => {
//   const navigate = useNavigate();
  
//   const logout = useCallback(() => {
//     try {
//       localStorage.removeItem("authToken");
//       sessionStorage.clear();
//       navigate("/", { replace: true });
//     } catch (error) {
//       console.error("Logout error:", error);
//       window.location.href = "/";
//     }
//   }, [navigate]);

//   return { logout };
// };

// const useSidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const sidebarRef = useRef(null);
//   const hamburgerRef = useRef(null);

//   const openSidebar = useCallback(() => setIsOpen(true), []);
//   const closeSidebar = useCallback(() => setIsOpen(false), []);

//   // Handle sidebar accessibility and focus management
//   useEffect(() => {
//     if (!sidebarRef.current) return;

//     if (isOpen) {
//       sidebarRef.current.removeAttribute("inert");
//       // Focus first focusable element in sidebar
//       const firstFocusable = sidebarRef.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
//       if (firstFocusable) {
//         setTimeout(() => firstFocusable.focus(), 100);
//       }
//     } else {
//       sidebarRef.current.setAttribute("inert", "");
//       if (hamburgerRef.current) {
//         hamburgerRef.current.focus();
//       }
//     }
//   }, [isOpen]);

//   // Handle escape key and outside clicks
//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === 'Escape' && isOpen) {
//         closeSidebar();
//       }
//     };

//     const handleClickOutside = (e) => {
//       if (isOpen && 
//           sidebarRef.current && 
//           !sidebarRef.current.contains(e.target) && 
//           !hamburgerRef.current?.contains(e.target)) {
//         closeSidebar();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('keydown', handleEscape);
//       document.addEventListener('mousedown', handleClickOutside);
//       document.body.style.overflow = 'hidden'; // Prevent background scroll
//     } else {
//       document.body.style.overflow = '';
//     }

//     return () => {
//       document.removeEventListener('keydown', handleEscape);
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.body.style.overflow = '';
//     };
//   }, [isOpen, closeSidebar]);

//   return {
//     isOpen,
//     openSidebar,
//     closeSidebar,
//     sidebarRef,
//     hamburgerRef
//   };
// };

// // Enhanced user data with more realistic structure
// const useUserData = () => {
//   // In a real app, this would come from an API or context
//   return useMemo(() => ({
//     id: "user_123",
//     username: "John Doe",
//     email: "johndoe@example.com",
//     firstName: "John",
//     lastName: "Doe",
//     avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
//     highestQualification: "Bachelor's in Computer Science",
//     hobbies: ["Reading", "Gaming", "Traveling", "Photography"],
//     balance: 12547.85,
//     notifications: 3,
//     joinDate: "2023-01-15",
//     lastActive: new Date().toISOString(),
//     stats: {
//       totalTasks: 45,
//       completedTasks: 38,
//       totalTransactions: 156,
//       monthlyGoal: 50000,
//       currentStreak: 7
//     }
//   }), []);
// };

// // Main component
// export default function UserProfilePage() {
//   const { theme, toggleTheme } = useTheme();
//   const { logout } = useAuth();
//   const { isOpen: sidebarOpen, openSidebar, closeSidebar, sidebarRef, hamburgerRef } = useSidebar();
//   const user = useUserData();
  
//   const location = useLocation();
//   const currentPath = location.pathname;
//   const isDarkMode = theme === 'dark';

//   // Collapsible menu states
//   const [expandedMenus, setExpandedMenus] = useState({
//     finance: false,
//     tasks: false
//   });

//   const toggleMenu = useCallback((menuName) => {
//     setExpandedMenus(prev => ({
//       ...prev,
//       [menuName]: !prev[menuName]
//     }));
//   }, []);

//   // Memoized navigation configuration
//   const navigationConfig = useMemo(() => ({
//     main: [
//       {
//         id: 'dashboard',
//         path: '/dashboard',
//         icon: FaHome,
//         label: 'Dashboard',
//         isActive: currentPath === '/dashboard'
//       },
//       {
//         id: 'profile',
//         path: '/profile',
//         icon: FaUserCircle,
//         label: 'Profile',
//         isActive: currentPath === '/profile'
//       },
//       {
//         id: 'edit-profile',
//         path: '/edit-profile',
//         icon: FaEdit,
//         label: 'Edit Profile',
//         isActive: currentPath === '/edit-profile'
//       },
//       {
//         id: 'chatbot',
//         path: '/chatbot',
//         icon: FaRobot,
//         label: 'AI Assistant',
//         isActive: currentPath === '/chatbot',
//         badge: 'New'
//       }
//     ],
//     finance: [
//       { path: '/finance/dashboard', label: 'Overview', icon: TrendingUp, isActive: currentPath === '/finance/dashboard' },
//       { path: '/finance/add', label: 'Add Transaction', icon: FaMoneyBillWave, isActive: currentPath === '/finance/add' },
//       { path: '/finance/report', label: 'Reports', icon: FaChartLine, isActive: currentPath === '/finance/report' },
//       { path: '/finance/budget', label: 'Budget Planner', icon: FaTrophy, isActive: currentPath === '/finance/budget' }
//     ],
//     tasks: [
//       { path: '/todo/dashboard', label: 'Task Overview', icon: Activity, isActive: currentPath === '/todo/dashboard' },
//       { path: '/addtask', label: 'Create Task', icon: FaTasks, isActive: currentPath === '/addtask' },
//       { path: '/todo/calendar', label: 'Calendar View', icon: FaCalendarAlt, isActive: currentPath === '/todo/calendar' }
//     ]
//   }), [currentPath]);

//   // Enhanced stats calculations
//   const enhancedStats = useMemo(() => {
//     const completionRate = Math.round((user.stats.completedTasks / user.stats.totalTasks) * 100);
//     const goalProgress = Math.round((user.balance / user.stats.monthlyGoal) * 100);
    
//     return {
//       ...user.stats,
//       completionRate,
//       goalProgress: Math.min(goalProgress, 100)
//     };
//   }, [user.stats, user.balance]);

//   // Memoized sidebar content component
//   const SidebarContent = React.memo(({ isMobile = false }) => (
//     <div className="flex flex-col h-full">
//       {/* Header */}
//       <div className={`px-4 py-4 sm:px-6 sm:py-5 border-b flex items-center ${isMobile ? 'justify-between' : ''} ${
//         isDarkMode ? "border-gray-700" : "border-gray-200"
//       }`}>
//         <div className="flex items-center">
//           <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-indigo-500 rounded-lg flex items-center justify-center">
//             <FaCog className="text-white text-sm" />
//           </div>
//           <Link
//             to="/"
//             className={`ml-3 text-xl font-bold tracking-tight ${
//               isDarkMode ? "text-gray-100" : "text-gray-800"
//             }`}
//             onClick={() => isMobile && closeSidebar()}
//           >
//             MyArth
//           </Link>
//         </div>
//         {isMobile && (
//           <button
//             className={`p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${
//               isDarkMode ? "text-gray-300" : "text-gray-600"
//             }`}
//             onClick={closeSidebar}
//             aria-label="Close sidebar"
//           >
//             <FaTimes className="text-lg" />
//           </button>
//         )}
//       </div>

//       {/* User Info */}
//       <div className={`px-4 py-4 sm:px-6 sm:py-5 border-b ${
//         isDarkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"
//       }`}>
//         <div className="flex items-center space-x-3">
//           <div className="relative">
//             <img
//               src={user.avatar}
//               alt={`${user.username}'s avatar`}
//               className="w-10 h-10 rounded-full border-2 border-teal-400 object-cover"
//               loading="lazy"
//             />
//             <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></div>
//           </div>
//           <div className="min-w-0 flex-1">
//             <p className={`text-sm font-medium truncate ${
//               isDarkMode ? "text-gray-100" : "text-gray-900"
//             }`}>
//               {user.username}
//             </p>
//             <p className={`text-xs truncate ${
//               isDarkMode ? "text-gray-400" : "text-gray-500"
//             }`}>
//               {user.email}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 space-y-6">
//         {/* Main Navigation */}
//         <div>
//           <h3 className={`px-3 text-xs font-semibold uppercase tracking-wider ${
//             isDarkMode ? "text-gray-400" : "text-gray-500"
//           }`}>
//             Main
//           </h3>
//           <ul className="mt-2 space-y-1">
//             {navigationConfig.main.map((item) => {
//               const IconComponent = item.icon;
//               return (
//                 <li key={item.id}>
//                   <Link
//                     to={item.path}
//                     onClick={() => isMobile && closeSidebar()}
//                     className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
//                       item.isActive
//                         ? "bg-gradient-to-r from-teal-500 to-indigo-500 text-white shadow-md"
//                         : isDarkMode
//                         ? "text-gray-300 hover:bg-gray-700 hover:text-white"
//                         : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//                     }`}
//                   >
//                     <IconComponent className={`mr-3 text-lg ${
//                       item.isActive ? "text-white" : "text-teal-400 group-hover:text-teal-300"
//                     }`} />
//                     <span className="truncate">{item.label}</span>
//                     {item.badge && (
//                       <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                         {item.badge}
//                       </span>
//                     )}
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>

//         {/* Finance Section */}
//         <div>
//           <button
//             onClick={() => toggleMenu('finance')}
//             className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
//               expandedMenus.finance
//                 ? isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
//                 : isDarkMode ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-700 hover:bg-gray-100"
//             }`}
//           >
//             <FaChartLine className="mr-3 text-lg text-teal-400 group-hover:text-teal-300" />
//             <span className="flex-1 text-left truncate">Finance</span>
//             {expandedMenus.finance ? (
//               <FaChevronDown className="text-sm" />
//             ) : (
//               <FaChevronRight className="text-sm" />
//             )}
//           </button>
//           {expandedMenus.finance && (
//             <ul className="mt-1 ml-6 space-y-1">
//               {navigationConfig.finance.map((item) => {
//                 const IconComponent = item.icon;
//                 return (
//                   <li key={item.path}>
//                     <Link
//                       to={item.path}
//                       onClick={() => isMobile && closeSidebar()}
//                       className={`group flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 ${
//                         item.isActive
//                           ? isDarkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-900"
//                           : isDarkMode ? "text-gray-400 hover:bg-gray-700 hover:text-gray-300" : "text-gray-600 hover:bg-gray-100"
//                       }`}
//                     >
//                       <IconComponent className="mr-2 text-sm" />
//                       {item.label}
//                     </Link>
//                   </li>
//                 );
//               })}
//             </ul>
//           )}
//         </div>

//         {/* Tasks Section */}
//         <div>
//           <button
//             onClick={() => toggleMenu('tasks')}
//             className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
//               expandedMenus.tasks
//                 ? isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
//                 : isDarkMode ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-700 hover:bg-gray-100"
//             }`}
//           >
//             <FaTasks className="mr-3 text-lg text-teal-400 group-hover:text-teal-300" />
//             <span className="flex-1 text-left truncate">Tasks</span>
//             {expandedMenus.tasks ? (
//               <FaChevronDown className="text-sm" />
//             ) : (
//               <FaChevronRight className="text-sm" />
//             )}
//           </button>
//           {expandedMenus.tasks && (
//             <ul className="mt-1 ml-6 space-y-1">
//               {navigationConfig.tasks.map((item) => {
//                 const IconComponent = item.icon;
//                 return (
//                   <li key={item.path}>
//                     <Link
//                       to={item.path}
//                       onClick={() => isMobile && closeSidebar()}
//                       className={`group flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 ${
//                         item.isActive
//                           ? isDarkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-900"
//                           : isDarkMode ? "text-gray-400 hover:bg-gray-700 hover:text-gray-300" : "text-gray-600 hover:bg-gray-100"
//                       }`}
//                     >
//                       <IconComponent className="mr-2 text-sm" />
//                       {item.label}
//                     </Link>
//                   </li>
//                 );
//               })}
//             </ul>
//           )}
//         </div>
//       </nav>

//       {/* Footer */}
//       <div className={`px-4 py-4 sm:px-6 border-t ${
//         isDarkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"
//       }`}>
//         <Link
//           to="/settings"
//           onClick={() => isMobile && closeSidebar()}
//           className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 mb-3 ${
//             isDarkMode
//               ? "text-gray-300 hover:bg-gray-700 hover:text-white"
//               : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//           }`}
//         >
//           <FaCog className="mr-3 text-lg text-teal-400" />
//           Settings
//         </Link>
//         <button
//           onClick={logout}
//           className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
//         >
//           <FaSignOutAlt className="mr-2" />
//           Logout
//         </button>
//       </div>
//     </div>
//   ));

//   // Stats cards configuration
//   const statsCards = useMemo(() => [
//     {
//       id: 'qualification',
//       title: 'Qualification',
//       value: user.highestQualification,
//       icon: FaGraduationCap,
//       color: 'indigo',
//       gradient: 'from-indigo-500 to-purple-600'
//     },
//     {
//       id: 'balance',
//       title: 'Balance',
//       value: `₹${user.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
//       icon: FaMoneyBillWave,
//       color: 'teal',
//       gradient: 'from-teal-500 to-cyan-600',
//       subtitle: `${enhancedStats.goalProgress}% of monthly goal`
//     },
//     {
//       id: 'tasks',
//       title: 'Task Progress',
//       value: `${enhancedStats.completionRate}%`,
//       icon: FaTasks,
//       color: 'amber',
//       gradient: 'from-amber-500 to-orange-600',
//       subtitle: `${user.stats.completedTasks}/${user.stats.totalTasks} completed`
//     },
//     {
//       id: 'hobbies',
//       title: 'Interests',
//       value: user.hobbies.slice(0, 2).join(', '),
//       icon: FaStar,
//       color: 'pink',
//       gradient: 'from-pink-500 to-rose-600',
//       subtitle: `+${user.hobbies.length - 2} more`
//     }
//   ], [user, enhancedStats]);

//   return (
//     <div className={`flex flex-col min-h-screen transition-colors duration-200 ${
//       isDarkMode
//         ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
//         : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
//     }`}>
//       <div className="flex flex-1 relative">
//         {/* Mobile Sidebar */}
//         <div
//           ref={sidebarRef}
//           className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:hidden ${
//             sidebarOpen ? "translate-x-0" : "-translate-x-full"
//           }`}
//           inert={!sidebarOpen ? "" : undefined}
//         >
//           <div 
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
//             onClick={closeSidebar}
//             aria-hidden="true"
//           />
//           <aside className={`relative h-full shadow-2xl ${
//             isDarkMode ? "bg-gray-900 border-r border-gray-700" : "bg-white border-r border-gray-200"
//           }`}>
//             <SidebarContent isMobile={true} />
//           </aside>
//         </div>

//         {/* Desktop Sidebar */}
//         <aside className={`hidden md:flex md:w-64 lg:w-72 flex-col shadow-xl ${
//           isDarkMode ? "bg-gray-900 border-r border-gray-700" : "bg-white border-r border-gray-200"
//         }`}>
//           <SidebarContent />
//         </aside>

//         {/* Main Content */}
//         <div className="flex-1 flex flex-col min-w-0">
//           {/* Header */}
//           <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 sm:px-6 lg:px-8 py-4 ${
//             isDarkMode
//               ? "bg-gray-900/95 border-gray-700"
//               : "bg-white/95 border-gray-200"
//           }`}>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <button
//                   ref={hamburgerRef}
//                   className={`md:hidden p-2 rounded-md transition-colors ${
//                     isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"
//                   }`}
//                   onClick={openSidebar}
//                   aria-label="Open sidebar"
//                 >
//                   <FaBars className="text-xl" />
//                 </button>
//                 <div>
//                   <h1 className={`text-2xl font-bold ${
//                     isDarkMode ? "text-gray-100" : "text-gray-900"
//                   }`}>
//                     Dashboard/Profile
//                   </h1>
//                   <p className={`text-sm ${
//                     isDarkMode ? "text-gray-400" : "text-gray-600"
//                   }`}>
//                     Welcome back, {user.firstName}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center space-x-4">
//                 <button
//                   onClick={toggleTheme}
//                   className={`p-2 rounded-md transition-colors ${
//                     isDarkMode 
//                       ? "hover:bg-gray-700 text-yellow-400" 
//                       : "hover:bg-gray-100 text-gray-600"
//                   }`}
//                   aria-label="Toggle theme"
//                 >
//                   {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
//                 </button>
                
//                 <button className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
//                   <FaBell className={`text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"}`} />
//                   {user.notifications > 0 && (
//                     <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
//                       {user.notifications}
//                     </span>
//                   )}
//                 </button>
                
//                 <div className="flex items-center space-x-2">
//                   <img
//                     src={user.avatar}
//                     alt={`${user.username}'s avatar`}
//                     className="w-8 h-8 rounded-full border-2 border-teal-400 object-cover"
//                     loading="lazy"
//                   />
//                 </div>
//               </div>
//             </div>
//           </header>

//           {/* Main Content Area */}
//           <main className="flex-1 overflow-auto">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
//               {/* Welcome Banner */}
//               <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl">
//                 <div className="absolute inset-0 bg-black/20"></div>
//                 <div className="relative px-6 py-8 sm:px-8 sm:py-12">
//                   <div className="flex flex-col md:flex-row items-center justify-between">
//                     <div className="text-center md:text-left mb-6 md:mb-0">
//                       <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
//                         Welcome back, {user.firstName}! 👋
//                       </h2>
//                       <p className="text-teal-100 text-lg">
//                         Here's what's happening with your account today
//                       </p>
//                     </div>
//                     <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
//                       <img
//                         src={user.avatar}
//                         alt={`${user.username}'s avatar`}
//                         className="w-16 h-16 rounded-full border-3 border-white object-cover"
//                         loading="lazy"
//                       />
//                       <div className="text-white">
//                         <p className="font-semibold text-lg">{user.username}</p>
//                         <p className="text-teal-100 text-sm">Member since {new Date(user.joinDate).getFullYear()}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Stats Grid */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {statsCards.map((card) => {
//                   const IconComponent = card.icon;
//                   return (
//                     <div
//                       key={card.id}
//                       className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group ${
//                         isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
//                       }`}
//                     >
//                       <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
//                       <div className="relative p-6">
//                         <div className="flex items-center justify-between mb-4">
//                           <div className={`p-3 rounded-lg bg-gradient-to-br ${card.gradient}`}>
//                             <IconComponent className="text-2xl text-white" />
//                           </div>
//                         </div>
//                         <h3 className={`text-lg font-semibold mb-1 ${
//                           isDarkMode ? "text-gray-200" : "text-gray-800"
//                         }`}>
//                           {card.title}
//                         </h3>
//                         <p className={`text-2xl font-bold mb-1 ${
//                           isDarkMode ? "text-gray-100" : "text-gray-900"
//                         }`}>
//                           {card.value}
//                         </p>
//                         {card.subtitle && (
//                           <p className={`text-sm ${
//                             isDarkMode ? "text-gray-400" : "text-gray-600"
//                           }`}>
//                             {card.subtitle}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Quick Actions */}
//               <div className="space-y-6">
//                 <h3 className={`text-2xl font-bold ${
//                   isDarkMode ? "text-gray-100" : "text-gray-900"
//                 }`}>
//                   Quick Actions
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                   <Link
//                     to="/finance/dashboard"
//                     className="group relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//                   >
//                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
//                     <div className="relative p-6 text-white">
//                       <FaChartLine className="text-3xl mb-4" />
//                       <h4 className="text-xl font-semibold mb-2">Finance Dashboard</h4>
//                       <p className="text-indigo-100">Manage your finances and track expenses</p>
//                     </div>
//                   </Link>

//                   <Link
//                     to="/todo/dashboard"
//                     className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//                   >
//                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
//                     <div className="relative p-6 text-white">
//                       <FaTasks className="text-3xl mb-4" />
//                       <h4 className="text-xl font-semibold mb-2">Task Manager</h4>
//                       <p className="text-amber-100">Organize your tasks and stay productive</p>
//                     </div>
//                   </Link>
//                   <Link
//                     to="/chatbot"
//                     className="group relative overflow-hidden bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//                   >
//                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
//                     <div className="relative p-6 text-white">
//                       <FaRobot className="text-3xl mb-4" />
//                       <h4 className="text-xl font-semibold mb-2">AI Assistant</h4>

//                       <p className="text-teal-100">Get help with your tasks using AI</p>


//                     </div>
//                   </Link>
//                 </div>
//               </div>
//               {/* User Stats */}
//               <div className="space-y-6">
//                 <h3 className={`text-2xl font-bold ${
//                   isDarkMode ? "text-gray-100" : "text-gray-900"
//                 }`}>
//                   User Stats
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                   <div className={`p-6 rounded-xl shadow-lg ${
//                     isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
//                   }`}>
//                     <h4 className={`text-lg font-semibold mb-2 ${
//                       isDarkMode ? "text-gray-200" : "text-gray-800"
//                     }`}>
//                       Total Tasks
//                     </h4>
//                     <p className={`text-2xl font-bold ${
//                       isDarkMode ? "text-gray-100" : "text-gray-900"
//                     }`}>
//                       {user.stats.totalTasks}
//                     </p>
//                   </div>
//                   <div className={`p-6 rounded-xl shadow-lg ${
//                     isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
//                   }`}>
//                     <h4 className={`text-lg font-semibold mb-2 ${
//                       isDarkMode ? "text-gray-200" : "text-gray-800"
//                     }`}>
//                       Completed Tasks
//                     </h4>
//                     <p className={`text-2xl font-bold ${
//                       isDarkMode ? "text-gray-100" : "text-gray-900"
//                     }`}>
//                       {user.stats.completedTasks}
//                     </p>
//                   </div>
//                   <div className={`p-6 rounded-xl shadow-lg ${
//                     isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
//                   }`}>
//                     <h4 className={`text-lg font-semibold mb-2 ${
//                       isDarkMode ? "text-gray-200" : "text-gray-800"
//                     }`}>
//                       Current Streak
//                     </h4>
//                     <p className={`text-2xl font-bold ${
//                       isDarkMode ? "text-gray-100" : "text-gray-900"
//                     }`}>
//                       {user.stats.currentStreak} days
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </main>
//         </div>
//       </div>
      
//     </div>
//   );
// }






// // // UserProfilePage.jsx
// // import React, { useState, useRef, useEffect } from "react";
// // import { Link, useLocation } from "react-router-dom";
// // import {
// //   FaGraduationCap,
// //   FaMoneyBillWave,
// //   FaStar,
// //   FaChartLine,
// //   FaTasks,
// //   FaRobot,
// //   FaBell,
// //   FaCog,
// //   FaChevronDown,
// //   FaChevronRight,
// //   FaUserCircle,
// //   FaSignOutAlt,
// //   FaBars,
// //   FaTimes,
// //   FaEdit,
// // } from "react-icons/fa";
// // import { Sun, Moon } from 'lucide-react';

// // // Import the theme hook (assuming you have this from Home.jsx)
// // import { useTheme } from "../src/theme/ThemeProvider";

// // export default function UserProfilePage() {
// //   // Use theme provider instead of local state
// //   const { theme, toggleTheme } = useTheme();
// //   const isDarkMode = theme === 'dark';

// //   // Dummy data (replace with real API/context)
// //   const user = {
// //     username: "John Doe",
// //     email: "johndoe@example.com",
// //     highestQualification: "Bachelor's in Computer Science",
// //     hobbies: ["Reading", "Gaming", "Traveling"],
// //     balance: 1000.5,
// //     avatar: "https://via.placeholder.com/150",
// //     notifications: 3,
// //   };

// //   const location = useLocation();
// //   const currentPath = location.pathname;

// //   // State for collapsible menus
// //   const [financeOpen, setFinanceOpen] = useState(false);
// //   const [tasksOpen, setTasksOpen] = useState(false);
// //   const [sidebarOpen, setSidebarOpen] = useState(false);

// //   // Ref to the mobile-sidebar wrapper
// //   const sidebarRef = useRef(null);
// //   // Ref to the hamburger button (so we can restore focus when sidebar closes)
// //   const hamburgerRef = useRef(null);

// //   // Toggle inert on the sidebar wrapper whenever sidebarOpen changes
// //   useEffect(() => {
// //     if (!sidebarRef.current) return;

// //     if (sidebarOpen) {
// //       // When opening: remove inert, make all children focusable again
// //       sidebarRef.current.removeAttribute("inert");
// //     } else {
// //       // When closing: add inert so subtree is hidden from AT and unfocusable
// //       sidebarRef.current.setAttribute("inert", "");
// //       // If any element inside the sidebar had focus, move focus back to the hamburger
// //       if (hamburgerRef.current) {
// //         hamburgerRef.current.focus();
// //       }
// //     }
// //   }, [sidebarOpen]);

// //   // Handle logout
// //   const handleLogout = () => {
// //     localStorage.removeItem("authToken"); // or clear() if you want to remove all
// //     window.location.href = "/"; // or use navigate("/") if using react-router
// //   };

// //   // Close sidebar when clicking outside or pressing Escape
// //   useEffect(() => {
// //     const handleEscape = (e) => {
// //       if (e.key === 'Escape' && sidebarOpen) {
// //         setSidebarOpen(false);
// //       }
// //     };

// //     const handleClickOutside = (e) => {
// //       if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target) && !hamburgerRef.current?.contains(e.target)) {
// //         setSidebarOpen(false);
// //       }
// //     };

// //     if (sidebarOpen) {
// //       document.addEventListener('keydown', handleEscape);
// //       document.addEventListener('mousedown', handleClickOutside);
// //     }

// //     return () => {
// //       document.removeEventListener('keydown', handleEscape);
// //       document.removeEventListener('mousedown', handleClickOutside);
// //     };
// //   }, [sidebarOpen]);

// //   // Memoized navigation items to prevent unnecessary re-renders
// //   const navigationItems = React.useMemo(() => [
// //     {
// //       id: 'dashboard',
// //       path: '/dashboard',
// //       icon: FaUserCircle,
// //       label: 'Dashboard/Profile',
// //       isActive: currentPath === '/dashboard'
// //     },
// //     {
// //       id: 'edit-profile',
// //       path: '/edit-profile',
// //       icon: FaEdit,
// //       label: 'Edit Profile',
// //       isActive: currentPath === '/edit-profile'
// //     },
// //     {
// //       id: 'chatbot',
// //       path: '/chatbot',
// //       icon: FaRobot,
// //       label: 'Chatbot',
// //       isActive: currentPath === '/chatbot'
// //     }
// //   ], [currentPath]);

// //   const financeItems = React.useMemo(() => [
// //     { path: '/finance/dashboard', label: 'Dashboard', isActive: currentPath === '/finance/dashboard' },
// //     { path: '/finance/add', label: 'Add Finance', isActive: currentPath === '/finance/add' },
// //     { path: '/finance/report', label: 'Reports', isActive: currentPath === '/finance/report' }
// //   ], [currentPath]);

// //   const taskItems = React.useMemo(() => [
// //     { path: '/todo/dashboard', label: 'Dashboard', isActive: currentPath === '/todo/dashboard' },
// //     { path: '/addtask', label: 'Add Task', isActive: currentPath === '/addtask' }
// //   ], [currentPath]);

// //   // Memoized sidebar content to prevent unnecessary re-renders
// //   const SidebarContent = React.memo(({ isMobile = false }) => (
// //     <>
// //       <div
// //         className={`px-4 py-4 sm:px-6 sm:py-5 border-b flex items-center ${isMobile ? 'justify-between' : ''} ${
// //           isDarkMode ? "border-gray-800" : "border-gray-200"
// //         }`}
// //       >
// //         <div className="flex items-center">
// //           <FaCog className="text-2xl text-teal-400" />
// //           <Link
// //             to="/"
// //             className={`ml-2 text-lg sm:text-xl md:text-2xl font-bold tracking-tight truncate ${
// //               isDarkMode ? "text-gray-100" : "text-gray-800"
// //             }`}
// //             onClick={() => isMobile && setSidebarOpen(false)}
// //           >
// //             MyArth
// //           </Link>
// //         </div>
// //         {isMobile && (
// //           <button
// //             className={`text-xl ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}
// //             onClick={() => setSidebarOpen(false)}
// //             aria-label="Close sidebar"
// //           >
// //             <FaTimes />
// //           </button>
// //         )}
// //       </div>

// //       <div
// //         className={`px-4 py-4 sm:px-6 sm:py-5 border-b flex items-center space-x-3 ${
// //           isDarkMode ? "border-gray-800 bg-gray-800" : "border-gray-200 bg-gray-100"
// //         }`}
// //       >
// //         <img
// //           src={user.avatar}
// //           alt="Avatar"
// //           className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-teal-400 object-cover"
// //         />
// //         <div className="overflow-hidden min-w-0">
// //           <span
// //             className={`block text-xs sm:text-sm font-medium truncate ${
// //               isDarkMode ? "text-gray-100" : "text-gray-800"
// //             }`}
// //           >
// //             {user.username}
// //           </span>
// //           <span
// //             className={`block text-[10px] sm:text-xs truncate ${
// //               isDarkMode ? "text-gray-400" : "text-gray-500"
// //             }`}
// //           >
// //             {user.email}
// //           </span>
// //         </div>
// //       </div>

// //       <nav className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6">
// //         <ul className="space-y-4">
// //           {/* Regular Navigation Items */}
// //           {navigationItems.map((item) => {
// //             const IconComponent = item.icon;
// //             return (
// //               <li key={item.id}>
// //                 <Link
// //                   to={item.path}
// //                   onClick={() => isMobile && setSidebarOpen(false)}
// //                   className={`flex items-center px-3 py-2 sm:px-4 sm:py-2.5 rounded-md transition-colors duration-200 ${
// //                     item.isActive
// //                       ? "bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white shadow-lg"
// //                       : isDarkMode
// //                       ? "text-gray-200 hover:bg-gray-800 hover:text-gray-100"
// //                       : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"e toggle
// //                   }`}
// //                 >
// //                   <IconComponent className="mr-2 sm:mr-3 text-lg text-teal-300" />
// //                   <span className="text-sm sm:text-base">{item.label}</span>
// //                   {item.id === 'chatbot' && (
// //                     <FaChevronRight className="text-sm opacity-50 ml-auto" />
// //                   )}
// //                 </Link>
// //               </li>
// //             );
// //           })}

// //           {/* Finance Group */}
// //           <li>
// //             <button
// //               onClick={() => setFinanceOpen((prev) => !prev)}
// //               className={`flex items-center w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-md transition-colors duration-200 ${
// //                 financeOpen
// //                   ? isDarkMode
// //                     ? "bg-gray-800 text-gray-100 shadow-inner"
// //                     : "bg-gray-200 text-gray-900 shadow-inner"
// //                   : isDarkMode
// //                   ? "text-gray-200 hover:bg-gray-800"
// //                   : "text-gray-700 hover:bg-gray-200"
// //               }`}
// //             >
// //               <FaChartLine className="mr-2 sm:mr-3 text-lg text-teal-300" />
// //               <span className="flex-grow text-sm sm:text-base">Finance</span>
// //               {financeOpen ? (
// //                 <FaChevronDown className="text-sm opacity-75" />
// //               ) : (
// //                 <FaChevronRight className="text-sm opacity-50" />
// //               )}
// //             </button>
// //             {financeOpen && (
// //               <ul className="mt-2 ml-6 sm:ml-8 space-y-2">
// //                 {financeItems.map((item) => (
// //                   <li key={item.path}>
// //                     <Link
// //                       to={item.path}
// //                       onClick={() => isMobile && setSidebarOpen(false)}
// //                       className={`flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm ${
// //                         item.isActive
// //                           ? isDarkMode
// //                             ? "bg-gray-700 text-gray-100"
// //                             : "bg-gray-300 text-gray-900"
// //                           : isDarkMode
// //                           ? "text-gray-200 hover:bg-gray-800"
// //                           : "text-gray-700 hover:bg-gray-200"
// //                       }`}
// //                     >
// //                       {item.label}
// //                     </Link>
// //                   </li>
// //                 ))}
// //               </ul>
// //             )}
// //           </li>

// //           {/* Tasks Group */}
// //           <li>
// //             <button
// //               onClick={() => setTasksOpen((prev) => !prev)}
// //               className={`flex items-center w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-md transition-colors duration-200 ${
// //                 tasksOpen
// //                   ? isDarkMode
// //                     ? "bg-gray-800 text-gray-100 shadow-inner"
// //                     : "bg-gray-200 text-gray-900 shadow-inner"
// //                   : isDarkMode
// //                   ? "text-gray-200 hover:bg-gray-800"
// //                   : "text-gray-700 hover:bg-gray-200"
// //               }`}
// //             >
// //               <FaTasks className="mr-2 sm:mr-3 text-lg text-teal-300" />
// //               <span className="flex-grow text-sm sm:text-base">Tasks</span>
// //               {tasksOpen ? (
// //                 <FaChevronDown className="text-sm opacity-75" />
// //               ) : (
// //                 <FaChevronRight className="text-sm opacity-50" />
// //               )}
// //             </button>
// //             {tasksOpen && (
// //               <ul className="mt-2 ml-6 sm:ml-8 space-y-2">
// //                 {taskItems.map((item) => (
// //                   <li key={item.path}>
// //                     <Link
// //                       to={item.path}
// //                       onClick={() => isMobile && setSidebarOpen(false)}
// //                       className={`flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm ${
// //                         item.isActive
// //                           ? isDarkMode
// //                             ? "bg-gray-700 text-gray-100"
// //                             : "bg-gray-300 text-gray-900"
// //                           : isDarkMode
// //                           ? "text-gray-200 hover:bg-gray-800"
// //                           : "text-gray-700 hover:bg-gray-200"
// //                       }`}
// //                     >
// //                       {item.label}
// //                     </Link>
// //                   </li>
// //                 ))}
// //               </ul>
// //             )}
// //           </li>
// //         </ul>
// //       </nav>

// //       <div
// //         className={`px-4 py-4 sm:px-6 sm:py-6 border-t ${
// //           isDarkMode ? "border-gray-800 bg-gray-800" : "border-gray-200 bg-gray-100"
// //         }`}
// //       >
// //         <Link
// //           to="/settings"
// //           onClick={() => isMobile && setSidebarOpen(false)}
// //           className={`flex items-center px-3 py-2 sm:px-4 sm:py-2.5 rounded-md transition-colors duration-200 ${
// //             isDarkMode
// //               ? "text-gray-300 hover:text-gray-100 hover:bg-gray-700"
// //               : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
// //           }`}
// //         >
// //           <FaCog className="mr-2 sm:mr-3 text-lg text-teal-300" />
// //           <span className="text-sm sm:text-base">Settings</span>
// //         </Link>
// //         <button
// //           onClick={handleLogout}
// //           className="mt-3 w-full inline-flex justify-center items-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md shadow transition-transform duration-200 hover:scale-105 text-sm sm:text-base"
// //         >
// //           <FaSignOutAlt className="mr-2 text-lg" /> Logout
// //         </button>
// //       </div>
// //     </>
// //   ));

// //   return (
// //     <div
// //       className={`flex flex-col min-h-screen font-sans overflow-x-hidden ${
// //         isDarkMode
// //           ? "bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100"
// //           : "bg-gradient-to-b from-gray-100 to-gray-200 text-gray-800"
// //       }`}
// //     >
// //       <div className="flex flex-1">
// //         {/* ========================= */}
// //         {/* Mobile Sidebar Drawer  */}
// //         {/* ========================= */}
// //         <div
// //           ref={sidebarRef}
// //           className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ${
// //             sidebarOpen ? "translate-x-0" : "-translate-x-full"
// //           }`}
// //           inert={!sidebarOpen ? "" : undefined}
// //         >
// //           {/* semi-transparent backdrop */}
// //           <div
// //             className="fixed inset-0 bg-black bg-opacity-60"
// //             onClick={() => setSidebarOpen(false)}
// //           />
// //           <aside
// //             className={`relative w-64 flex flex-col shadow-xl h-full ${
// //               isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
// //             }`}
// //           >
// //             <SidebarContent isMobile={true} />
// //           </aside>
// //         </div>

// //         {/* ========================= */}
// //         {/* Static Sidebar (md+)   */}
// //         {/* ========================= */}
// //         <aside
// //           className={`hidden md:flex md:w-72 lg:w-64 flex-col shadow-xl ${
// //             isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
// //           }`}
// //         >
// //           <SidebarContent />
// //         </aside>

// //         {/* ========================= */}
// //         {/* Main Content       */}
// //         {/* ========================= */}
// //         <div className="flex-1 flex flex-col">
// //           {/* Top Bar (Navbar) */}
// //           <header
// //             className={`sticky top-0 z-30 border-b px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3 md:py-4 flex flex-wrap justify-between items-center shadow-lg ${
// //               isDarkMode
// //                 ? "bg-gradient-to-r from-purple-600 to-pink-600 border-pink-700"
// //                 : "bg-gradient-to-r from-purple-300 to-pink-300 border-pink-400"
// //             }`}
// //           >
// //             {/* Left: Hamburger + Title */}
// //             <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-auto">
// //               <button
// //                 id="openSidebarButton"
// //                 ref={hamburgerRef}
// //                 className={`md:hidden text-xl sm:text-2xl ${
// //                   isDarkMode ? "text-gray-100" : "text-gray-800"
// //                 }`}
// //                 onClick={() => setSidebarOpen(true)}
// //                 aria-label="Open sidebar"
// //               >
// //                 <FaBars />
// //               </button>
// //               <h2
// //                 className={`text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl font-semibold truncate ${
// //                   isDarkMode ? "text-gray-100" : "text-gray-800"
// //                 }`}
// //               >
// //                 Dashboard / Profile
// //               </h2>
// //             </div>

// //             {/* Right: Icons + Dark/Light Mode Toggle */}
// //             <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mt-2 sm:mt-0">
// //               <button
// //                 onClick={toggleTheme}
// //                 className={`text-lg sm:text-xl md:text-2xl hover:text-gray-200 transition-colors duration-200 ${
// //                   isDarkMode ? "text-yellow-300" : "text-gray-700"
// //                 }`}
// //                 aria-label="Toggle theme"
// //               >
// //                 {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
// //               </button>
// //               <button className="relative group">
// //                 <FaBell
// //                   className={`text-lg sm:text-xl md:text-2xl transition-colors duration-200 ${
// //                     isDarkMode ? "text-gray-100 hover:text-gray-200" : "text-gray-700 hover:text-gray-900"
// //                   }`}
// //                 />
// //                 {user.notifications > 0 && (
// //                   <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2 ring-2 ring-gray-900" />
// //                 )}
// //                 <div
// //                   className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-1 w-max text-[10px] sm:text-xs md:text-sm px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
// //                     isDarkMode ? "bg-gray-800 text-gray-100" : "bg-gray-200 text-gray-800"
// //                   }`}
// //                 >
// //                   Notifications
// //                 </div>
// //               </button>
// //               <FaUserCircle
// //                 className={`text-lg sm:text-xl md:text-2xl ${
// //                   isDarkMode ? "text-gray-100" : "text-gray-700"
// //                 }`}
// //               />
// //             </div>
// //           </header>

// //           {/* Main Scrollable Area */}
// //           <main
// //             className={`flex-1 overflow-auto py-4 ${
// //               isDarkMode
// //                 ? "bg-gradient-to-b from-gray-900 to-gray-800"
// //                 : "bg-gradient-to-b from-gray-200 to-gray-100"
// //             }`}
// //           >
// //             {/* Centered container, up to 7xl wide */}
// //             <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 space-y-8">
// //               {/* Profile Header Card */}
// //               <div className="bg-gradient-to-r from-teal-600 to-indigo-600 text-gray-100 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col md:flex-row items-center md:justify-between">
// //                 {/* Left text block */}
// //                 <div className="min-w-0">
// //                   <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold truncate">
// //                     Welcome, {user.username}!
// //                   </h1>
// //                   <p className="text-teal-200 mt-1 text-xs sm:text-sm md:text-base lg:text-lg">
// //                     Here's your profile overview
// //                   </p>
// //                 </div>

// //                 {/* Right avatar block */}
// //                 <div className="mt-4 md:mt-0 flex items-center bg-indigo-600 bg-opacity-20 rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-lg">
// //                   <img
// //                     src={user.avatar}
// //                     alt="User Avatar"
// //                     className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full border-2 border-gray-100 object-cover mr-3 sm:mr-4"
// //                   />
// //                   <div className="min-w-0">
// //                     <span className="block text-base sm:text-lg md:text-xl lg:text-2xl font-semibold truncate">
// //                       {user.username}
// //                     </span>
// //                     <span className="block text-[10px] sm:text-xs md:text-sm lg:text-base text-teal-200 truncate">
// //                       {user.email}
// //                     </span>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Info Cards Grid */}
// //               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
// //                 {/* Qualification Card */}
// //                 <div
// //                   className={`rounded-lg border-t-4 border-indigo-400 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-200 ${
// //                     isDarkMode ? "bg-gray-800" : "bg-white"
// //                   }`}
// //                 >
// //                   <FaGraduationCap className="text-3xl sm:text-4xl md:text-5xl text-indigo-400 mb-2 sm:mb-3" />
// //                   <h3
// //                     className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-1 sm:mb-2 truncate ${
// //                       isDarkMode ? "text-gray-100" : "text-gray-800"
// //                     }`}
// //                   >
// //                     Qualification
// //                   </h3>
// //                   <p
// //                     className={`text-center text-xs sm:text-sm md:text-base lg:text-lg ${
// //                       isDarkMode ? "text-gray-300" : "text-gray-600"
// //                     }`}
// //                   >
// //                     {user.highestQualification}
// //                   </p>
// //                 </div>

// //                 {/* Balance Card */}
// //                 <div
// //                   className={`rounded-lg border-t-4 border-teal-400 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-200 ${
// //                     isDarkMode ? "bg-gray-800" : "bg-white"
// //                   }`}
// //                 >
// //                   <FaMoneyBillWave className="text-3xl sm:text-4xl md:text-5xl text-teal-400 mb-2 sm:mb-3" />
// //                   <h3
// //                     className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-1 sm:mb-2 truncate ${
// //                       isDarkMode ? "text-gray-100" : "text-gray-800"
// //                     }`}
// //                   >
// //                     Balance
// //                   </h3>
// //                   <p
// //                     className={`text-center text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold ${
// //                       isDarkMode ? "text-gray-300" : "text-gray-700"
// //                     }`}
// //                   >
// //                     ₹{user.balance.toFixed(2)}
// //                   </p>
// //                 </div>

// //                 {/* Hobbies Card */}
// //                 <div
// //                   className={`rounded-lg border-t-4 border-amber-400 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-200 ${
// //                     isDarkMode ? "bg-gray-800" : "bg-white"
// //                   }`}
// //                 >
// //                   <FaStar className="text-3xl sm:text-4xl md:text-5xl text-amber-400 mb-2 sm:mb-3" />
// //                   <h3
// //                     className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-1 sm:mb-2 truncate ${
// //                       isDarkMode ? "text-gray-100" : "text-gray-800"
// //                     }`}
// //                   >
// //                     Hobbies
// //                   </h3>
// //                   <p
// //                     className={`text-center text-xs sm:text-sm md:text-base lg:text-lg ${
// //                       isDarkMode ? "text-gray-300" : "text-gray-600"
// //                     }`}
// //                   >
// //                     {user.hobbies.join(", ")}
// //                   </p>
// //                 </div>
// //               </div>

// //               {/* Dashboard Buttons */}
// //               <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-start sm:space-x-4 md:space-x-6 lg:space-x-8 space-y-3 sm:space-y-0">
// //                 <Link to="/finance/dashboard" className="w-full sm:w-auto">
// //                   <button className="w-full inline-flex justify-center items-center bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-gray-100 font-semibold py-2 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 rounded-lg shadow-2xl transition-transform duration-200 hover:scale-105 text-sm sm:text-base md:text-lg lg:text-xl">
// //                     <FaChartLine className="mr-2 sm:mr-3" />
// //                     Finance Dashboard
// //                   </button>
// //                 </Link>
// //                 <Link to="/todo/dashboard" className="w-full sm:w-auto">
// //                   <button className="w-full inline-flex justify-center items-center bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-gray-100 font-semibold py-2 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 rounded-lg shadow-2xl transition-transform duration-200 hover:scale-105 text-sm sm:text-base md:text-lg lg:text-xl">
// //                     <FaTasks className="mr-2 sm:mr-3" />
// //                     Todo Dashboard
// //                   </button>
// //                 </Link>
// //               </div>
// //             </div>
// //           </main>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
