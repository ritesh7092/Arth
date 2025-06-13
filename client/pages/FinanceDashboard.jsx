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
} from 'lucide-react';
import baseUrl from '../api/api';
import { useTheme } from '../src/theme/ThemeProvider';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Format INR
const formatRupee = amount =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount ?? 0);

// Metric Card Component
const MetricCard = ({ icon: Icon, title, value, colorClass }) => (
  <div className={`${colorClass} text-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center space-y-2 transform transition hover:-translate-y-1 hover:shadow-2xl`}>
    <div className="bg-white/20 p-3 sm:p-4 rounded-full mb-2">
      <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
    </div>
    <p className="text-xs sm:text-sm font-medium opacity-80 text-center">{title}</p>
    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-center">{value}</p>
  </div>
);

// Transaction Card
const TransactionCard = ({ transaction, themeClasses, onView, onEdit, onDelete }) => {
  // Support both 'type' and 'transactionType'
  const type = (transaction.type || transaction.transactionType || '').toUpperCase();
  const isExpense = type === 'EXPENSE';
  const isLoanOrBorrow = type === 'LOAN' || type === 'BORROW';
  const isPending = isLoanOrBorrow && (transaction.dueStatus === 'UNPAID' || transaction.dueStatus === 'PARTIALLY_PAID');
  const amountColor = isExpense ? 'text-red-500' : 'text-green-500';

  
  return (
    <div
      className={`
        ${themeClasses.cardBg} border ${themeClasses.border} rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200 animate__animated animate__fadeIn
        ${isPending ? 'ring-2 ring-yellow-400/80 dark:ring-yellow-500/80 bg-yellow-50 dark:bg-yellow-900/30' : ''}
      `}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`font-semibold ${themeClasses.text} truncate text-base sm:text-lg`}>
              {transaction.note || transaction.description}
            </p>
            {transaction.attachment && (
              <a
                href={URL.createObjectURL(transaction.attachment)}
                download={transaction.attachment.name}
                title="Download attachment"
                className="inline-block align-middle"
              >
                <Paperclip className="inline w-4 h-4 text-blue-500" />
              </a>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className={`${themeClasses.textSecondary} text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full`}>
              {transaction.category}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isExpense ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            }`}>
              {type}
            </span>
            {(type === 'LOAN' || type === 'BORROW') && transaction.dueStatus && (
              <span className={`text-xs px-2 py-1 rounded-full ${
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
          <p className={`${themeClasses.textSecondary} text-xs sm:text-sm mt-2`}>
            {new Date(transaction.date || transaction.transactionDate).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              weekday: 'short',
            })}
          </p>
        </div>
        <div className="flex flex-col sm:items-end w-full sm:w-auto">
          <p className={`font-bold text-lg sm:text-xl ${amountColor} mb-2 sm:mb-3`}>
            {formatRupee(isExpense ? -Math.abs(transaction.amount) : Math.abs(transaction.amount))}
          </p>
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

export default function FinanceDashboard() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

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
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-300',
    inputBorder: isDarkMode ? 'border-gray-600' : 'border-gray-400',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    buttonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    buttonSecondary: isDarkMode
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
      : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
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
                <div className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-6`}>
                  <p className={`font-semibold ${themeClasses.text}`}>{transaction.note || transaction.description}</p>
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
      {/* HEADER */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-4xl font-black text-white">Personal Finance Tracker</h1>
                  <p className="text-teal-700 text-xs sm:text-sm lg:text-lg">Your financial health at a glance</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-white/90">
                <div className="flex items-center space-x-2">
                  <IndianRupee className="w-5 h-5" />
                  <span className="font-medium text-xs sm:text-base">Net Balance: {formatRupee(netBalance)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5" />
                  <span className="font-medium text-xs sm:text-base">Transactions: {filteredTransactions.length}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <button
                onClick={toggleTheme}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all flex items-center justify-center"
                title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
              </button>
              <Link
                to="/finance/report"
                className="inline-flex items-center justify-center px-4 sm:px-5 py-3 rounded-xl font-semibold shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition text-xs sm:text-base"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Detailed Report</span>
                <span className="sm:hidden">Report</span>
              </Link>
              <Link
                to="/finance/add"
                className="inline-flex items-center justify-center px-4 sm:px-6 py-3 rounded-xl font-semibold shadow-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-400 hover:to-green-500 transition text-xs sm:text-base"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">New Transaction</span>
                <span className="sm:hidden">Add</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* --- METRICS --- */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8 space-y-8">
        {/* --- CURRENT MONTH METRICS --- */}
        <section>
          <h2 className="mb-4 text-base sm:text-xl font-bold text-gray-800 dark:text-gray-100">Current Month</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
            <MetricCard icon={TrendingUp} title="Income (Month)" value={formatRupee(currentIncome)} colorClass="bg-gradient-to-br from-green-500 to-emerald-500" />
            <MetricCard icon={TrendingDown} title="Expense (Month)" value={formatRupee(currentExpense)} colorClass="bg-gradient-to-br from-red-500 to-pink-500" />
            <MetricCard icon={PiggyBank} title="Savings (Month)" value={formatRupee(currentSavings)} colorClass="bg-gradient-to-br from-blue-500 to-indigo-500" />
            <MetricCard icon={AlertCircle} title="Loss (Month)" value={formatRupee(currentLoss)} colorClass="bg-gradient-to-br from-yellow-400 to-red-500" />
            <MetricCard icon={CreditCard} title="Transactions (Month)" value={currentMonthTxns.length} colorClass="bg-gradient-to-br from-purple-500 to-fuchsia-500" />
            <MetricCard icon={Wallet} title="Net Balance (Month)" value={formatRupee(currentSavings)} colorClass="bg-gradient-to-br from-blue-500 to-purple-500" />
          </div>
        </section>

        {/* --- PENDING LOANS/BORROWS METRICS --- */}
        <section>
          <h2 className="mb-4 text-base sm:text-xl font-bold text-gray-800 dark:text-gray-100">Pending Loans & Borrows</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <MetricCard
              icon={AlertCircle}
              title="Pending Loans Given"
              value={pendingLoansGiven}
              colorClass="bg-gradient-to-br from-yellow-400 to-orange-500"
            />
            <MetricCard
              icon={AlertCircle}
              title="Pending Borrows Taken"
              value={pendingBorrowsTaken}
              colorClass="bg-gradient-to-br from-yellow-400 to-pink-500"
            />
            <MetricCard
              icon={AlertCircle}
              title="All Pending (Loans/Borrows)"
              value={totalPending}
              colorClass="bg-gradient-to-br from-yellow-400 to-red-500"
            />
          </div>
        </section>

        {/* --- PREVIOUS MONTH METRICS --- */}
        <section>
          <h2 className="mb-4 text-base sm:text-xl font-bold text-gray-800 dark:text-gray-100">Previous Month</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <MetricCard icon={TrendingUp} title="Income (Prev)" value={formatRupee(prevIncome)} colorClass="bg-gradient-to-br from-green-600 to-emerald-600" />
            <MetricCard icon={TrendingDown} title="Expense (Prev)" value={formatRupee(prevExpense)} colorClass="bg-gradient-to-br from-red-600 to-rose-600" />
            <MetricCard icon={PiggyBank} title="Savings (Prev)" value={formatRupee(prevSavings)} colorClass="bg-gradient-to-br from-blue-600 to-indigo-600" />
            <MetricCard icon={AlertCircle} title="Loss (Prev)" value={formatRupee(prevLoss)} colorClass="bg-gradient-to-br from-yellow-400 to-red-500" />
          </div>
        </section>

        {/* --- THIS YEAR --- */}
        <section>
          <h2 className="mb-4 text-base sm:text-xl font-bold text-gray-800 dark:text-gray-100">This Year</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <MetricCard icon={TrendingUp} title="Income (Year)" value={formatRupee(thisYearIncome)} colorClass="bg-gradient-to-br from-green-400 to-emerald-400" />
            <MetricCard icon={TrendingDown} title="Expense (Year)" value={formatRupee(thisYearExpense)} colorClass="bg-gradient-to-br from-red-400 to-pink-400" />
            <MetricCard icon={PiggyBank} title="Savings (Year)" value={formatRupee(thisYearSavings)} colorClass="bg-gradient-to-br from-blue-400 to-purple-400" />
            <MetricCard icon={AlertCircle} title="Loss (Year)" value={formatRupee(thisYearLoss)} colorClass="bg-gradient-to-br from-yellow-400 to-red-500" />
          </div>
          <div className={`mt-4 text-base sm:text-lg font-semibold text-center ${netBalanceColor} animate__animated animate__fadeIn`}>
            {netBalanceMessage}
            <div className="text-xs sm:text-base mt-2 text-gray-700 dark:text-gray-300">{suggestion}</div>
          </div>
        </section>

        {/* --- TRANSACTION RECORDS --- */}
        <section id="transaction-table-section" className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-2xl p-2 sm:p-4 md:p-6 shadow-lg animate__animated animate__fadeInUp`}>
          <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className={`text-base sm:text-xl font-bold ${themeClasses.text} flex items-center`}>
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 mr-3 flex-shrink-0" />
              Transaction Records ({filteredTransactions.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportCSV}
                className="px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium shadow hover:from-emerald-600 hover:to-green-600 transition text-xs sm:text-base"
                title="Export as CSV"
              >
                Export CSV
              </button>
              <button
                onClick={handleExportPDF}
                className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium shadow hover:from-blue-600 hover:to-indigo-600 transition text-xs sm:text-base"
                title="Export as PDF"
              >
                Export PDF
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium shadow hover:from-pink-600 hover:to-rose-600 transition text-xs sm:text-base"
                title="Print"
              >
                Print
              </button>
            </div>
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
                  placeholder="Search note or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full border ${themeClasses.inputBorder} rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${themeClasses.bg} ${themeClasses.text} text-xs sm:text-sm`}
                />
              </div>

              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`border ${themeClasses.inputBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${themeClasses.bg} ${themeClasses.text} text-xs sm:text-sm`}
              >
                <option value="All">All Types</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
                <option value="LOAN">Loan (Given)</option>
                <option value="BORROW">Borrow (Taken)</option>
              </select>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`border ${themeClasses.inputBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${themeClasses.bg} ${themeClasses.text} text-xs sm:text-sm`}
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
                className={`border ${themeClasses.inputBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${themeClasses.bg} ${themeClasses.text} text-xs sm:text-sm`}
                title="Filter by Start Date"
              />
              <input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className={`border ${themeClasses.inputBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${themeClasses.bg} ${themeClasses.text} text-xs sm:text-sm`}
                title="Filter by End Date"
              />

              {/* Amount Filters */}
              <input
                type="number"
                placeholder="Min Amount"
                value={filterMinAmount}
                onChange={(e) => setFilterMinAmount(e.target.value)}
                className={`border ${themeClasses.inputBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${themeClasses.bg} ${themeClasses.text} text-xs sm:text-sm`}
                title="Filter by Minimum Amount"
              />
              <input
                type="number"
                placeholder="Max Amount"
                value={filterMaxAmount}
                onChange={(e) => setFilterMaxAmount(e.target.value)}
                className={`border ${themeClasses.inputBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${themeClasses.bg} ${themeClasses.text} text-xs sm:text-sm`}
                title="Filter by Maximum Amount"
              />

              {/* Due Status Filter */}
              <select
                value={filterDueStatus}
                onChange={e => setFilterDueStatus(e.target.value)}
                className={`border ${themeClasses.inputBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${themeClasses.bg} ${themeClasses.text} text-xs sm:text-sm`}
              >
                <option value="">All Status</option>
                <option value="PAID">Paid</option>
                <option value="UNPAID">Unpaid</option>
                <option value="PARTIALLY_PAID">Partially Paid</option>
              </select>

              {/* Clear Filters Button */}
              <button
                onClick={clearAllFilters}
                className={`col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-6 w-full flex items-center justify-center p-2 rounded-lg ${themeClasses.buttonSecondary} transition-colors font-medium text-xs sm:text-sm`}
              >
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Transaction List */}
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {currentTransactions.length === 0 ? (
              <div className="text-center py-8 sm:py-10 md:py-16">
                <Search className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 ${themeClasses.textSecondary} mx-auto mb-4 opacity-50`} />
                <p className={`${themeClasses.textSecondary} text-sm sm:text-base md:text-lg font-medium mb-2`}>
                  No transactions found matching your criteria.
                </p>
                <p className={`${themeClasses.textSecondary} text-xs sm:text-sm mb-4`}>
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearAllFilters}
                  className={`px-4 py-2 rounded-lg ${themeClasses.buttonSecondary} transition-colors text-xs sm:text-sm font-medium`}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
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
                {totalPages > 1 && (
                  <div className={`flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t ${themeClasses.border} gap-2`}>
                    <button
                      onClick={goPrev}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-medium transition ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base`}
                    >
                      Previous
                    </button>
                    <span className={`${themeClasses.textSecondary} text-xs sm:text-base`}>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={goNext}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base"
                    >
                      Next
                    </button>
                  </div>
                )}
                <div className={`text-center pt-4 border-t ${themeClasses.border}`}>
                  <p className={`${themeClasses.textSecondary} text-xs sm:text-sm`}>
                    Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredTransactions.length)} of {filteredTransactions.length} transactions
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
        <div className="mt-6 text-right text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center justify-end">
          <Clock className="w-4 h-4 mr-1" /> Server Time: {new Date().toLocaleString()}
        </div>
      </main>
      <div className="flex items-center mt-2 text-xs text-yellow-700 dark:text-yellow-300">
        <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
        Highlighted = Pending Loan/Borrow (Unpaid or Partially Paid)
      </div>
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
