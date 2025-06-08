import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'animate.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {
    IndianRupee, // Changed from DollarSign to IndianRupee
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
    RefreshCw,
    AlertCircle,
    Eye,
    Edit2,
    Trash2,
    BarChart3, // For Detailed Report
    Info
} from 'lucide-react';

// Assuming baseUrl is configured similarly to your Todo Dashboard
import baseUrl from '../api/api';

// --- Mock Data (Replace with real API data later) ---
const mockTransactions = [
    { id: 't1', description: 'Monthly Salary', type: 'Income', amount: 50000.00, category: 'Salary', date: '2025-06-01' },
    { id: 't2', description: 'Groceries (SuperMart)', type: 'Expense', amount: 1500.50, category: 'Food', date: '2025-06-02' },
    { id: 't3', description: 'Apartment Rent', type: 'Expense', amount: 12000.00, category: 'Housing', date: '2025-06-01' },
    { id: 't4', description: 'Freelance Design Project', type: 'Income', amount: 8000.00, category: 'Freelance', date: '2025-06-05' },
    { id: 't5', description: 'Dinner with Friends', type: 'Expense', amount: 750.25, category: 'Food', date: '2025-06-03' },
    { id: 't6', description: 'Electricity Bill', type: 'Expense', amount: 1000.80, category: 'Utilities', date: '2025-06-04' },
    { id: 't7', description: 'Online Photography Course', type: 'Expense', amount: 2500.00, category: 'Education', date: '2025-06-06' },
    { id: 't8', description: 'Work Bonus', type: 'Income', amount: 10000.00, category: 'Salary', date: '2025-06-07' },
    { id: 't9', description: 'Public Transport Pass', type: 'Expense', amount: 500.00, category: 'Transport', date: '2025-06-07' },
    { id: 't10', description: 'Gym Membership', type: 'Expense', amount: 400.00, category: 'Health', date: '2025-06-08' },
    { id: 't11', description: 'Weekend Trip Fuel', type: 'Expense', amount: 600.00, category: 'Transport', date: '2025-06-08' },
    { id: 't12', description: 'Investment Dividend', type: 'Income', amount: 3000.00, category: 'Investments', date: '2025-05-28' },
    { id: 't13', description: 'Shopping (Clothes)', type: 'Expense', amount: 2000.00, category: 'Shopping', date: '2025-05-29' },
    { id: 't14', description: 'Phone Bill', type: 'Expense', amount: 450.00, category: 'Utilities', date: '2025-05-30' },
    { id: 't15', description: 'Coffee Shop Visit', type: 'Expense', amount: 85.00, category: 'Food', date: '2025-06-08' },
];

// Helper for Rupee formatting
const formatRupee = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

// --- TransactionCard Component ---
const TransactionCard = ({ transaction, themeClasses, onView, onEdit, onDelete }) => {
    const isExpense = transaction.type === 'Expense';
    const amountColor = isExpense ? 'text-red-500' : 'text-green-500';
    const amountSign = isExpense ? '-' : ''; // Rupee symbol includes negative for expenses

    return (
        <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200 animate__animated animate__fadeIn`}>
            <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0 pr-2">
                    <p className={`font-semibold ${themeClasses.text} truncate`}>
                        {transaction.description}
                    </p>
                    <p className={`${themeClasses.textSecondary} text-sm mt-1`}>
                        Category: <span className="font-medium">{transaction.category}</span>
                    </p>
                    <p className={`${themeClasses.textSecondary} text-xs mt-1`}>
                        Date: {new Date(transaction.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex flex-col items-end space-y-1 ml-2 flex-shrink-0">
                    <p className={`font-bold text-lg ${amountColor}`}>
                        {formatRupee(transaction.amount * (isExpense ? -1 : 1))}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isExpense ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {transaction.type}
                    </span>
                    {/* Action Buttons */}
                    <div className="flex space-x-1 mt-2">
                        <button
                            onClick={() => onView(transaction.id)}
                            className={`p-1 rounded-full ${themeClasses.buttonSecondary} hover:bg-opacity-80 transition-colors`}
                            title="View Details"
                        >
                            <Eye size={16} className={`${themeClasses.text}`} />
                            {/* <Eye className={`w-4 h-4 ${themeClasses.text}`} /> */}

                        </button>
                        <button
                            onClick={() => onEdit(transaction.id)}
                            className={`p-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors`}
                            title="Edit Transaction"
                        >
                             <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(transaction.id)}
                            className={`p-1 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors`}
                            title="Delete Transaction"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const FinanceDashboard = () => {
    // State management
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // 1. Use state, initialize from localStorage (default to false if not set)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const stored = localStorage.getItem('isDarkMode');
        return stored === null ? false : stored === 'true';
    });

    // 2. Sync HTML class and localStorage when isDarkMode changes
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
        localStorage.setItem('isDarkMode', isDarkMode);
    }, [isDarkMode]);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [filterMinAmount, setFilterMinAmount] = useState('');
    const [filterMaxAmount, setFilterMaxAmount] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const navigate = useNavigate();

    // Available categories for filtering
    const categories = [
        'All', 'Salary', 'Freelance', 'Investments',
        'Food', 'Housing', 'Utilities', 'Transport',
        'Health', 'Education', 'Entertainment', 'Shopping', 'Other'
    ];

    // --- Theme Classes (Directly from Todo Dashboard logic) ---
    const themeClasses = {
        bg: isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
        cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm',
        text: isDarkMode ? 'text-white' : 'text-gray-900',
        textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
        border: isDarkMode ? 'border-gray-700' : 'border-gray-200/50',
        inputBorder: isDarkMode ? 'border-gray-600' : 'border-gray-300',
        hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white/90',
        accentBg: isDarkMode ? 'bg-emerald-700' : 'bg-emerald-600',
        accentText: 'text-white',
        buttonPrimary: isDarkMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700',
        buttonSecondary: isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-300 hover:bg-gray-400 text-gray-800',
    };

    // 4. Toggle handler
    const handleToggleDarkMode = () => setIsDarkMode((prev) => !prev);

    // Utility function to get auth token (as in Todo Dashboard)
    const getToken = useCallback(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('No authentication token found. Please login again.');
            setTimeout(() => navigate('/login'), 2000);
            return null;
        }
        return token;
    }, [navigate]);

    // Fetch transactions (using mock data for now)
    const fetchTransactions = useCallback(async () => {
        const token = getToken();
        if (!token) return;

        setLoading(true);
        setError(null);
        try {
            // In a real application, you would make an API call here:
            // const response = await baseUrl.get('/api/transactions', { headers: { Authorization: `Bearer ${token}` } });
            // setTransactions(response.data.content || []); // Assuming paged response

            // Simulate API call delay with mock data
            await new Promise(resolve => setTimeout(resolve, 700));
            setTransactions(mockTransactions);
        } catch (err) {
            console.error('Error fetching transactions:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch financial data. Please try again.';
            setError(errorMessage);
            if (err.response?.status === 401) {
                localStorage.removeItem('authToken');
                setTimeout(() => navigate('/login'), 2000);
            }
        } finally {
            setLoading(false);
        }
    }, [getToken, navigate]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    // Financial calculations
    const totalIncome = transactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalIncome - totalExpense;

    // Filtered Transactions Logic
    const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const transactionAmount = transaction.amount;

        const matchesSearch = searchQuery === '' ||
                              transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              transaction.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = filterType === 'All' || transaction.type === filterType;
        const matchesCategory = filterCategory === 'All' || transaction.category === filterCategory;

        const startDateObj = filterStartDate ? new Date(filterStartDate) : null;
        const endDateObj = filterEndDate ? new Date(filterEndDate) : null;

        const matchesStartDate = !startDateObj || transactionDate >= startDateObj;
        const matchesEndDate = !endDateObj || transactionDate <= endDateObj;

        const minAmount = filterMinAmount !== '' ? parseFloat(filterMinAmount) : -Infinity;
        const maxAmount = filterMaxAmount !== '' ? parseFloat(filterMaxAmount) : Infinity;
        const matchesAmount = transactionAmount >= minAmount && transactionAmount <= maxAmount;

        return matchesSearch && matchesType && matchesCategory && matchesStartDate && matchesEndDate && matchesAmount;
    }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by most recent date first

    // Clear filters function
    const clearAllFilters = () => {
        setSearchQuery('');
        setFilterType('All');
        setFilterCategory('All');
        setFilterStartDate('');
        setFilterEndDate('');
        setFilterMinAmount('');
        setFilterMaxAmount('');
    };

    // --- Action Handlers for Transactions (now using navigate) ---

    // Handle View Details - redirects to /finance/view/:id
    const handleViewDetails = useCallback((id) => {
        navigate(`/finance/view/${id}`);
    }, [navigate]);

    // Handle Edit - redirects to /finance/edit/:id
    const handleEdit = useCallback((id) => {
        navigate(`/finance/edit/${id}`);
    }, [navigate]);

    // Handle Delete with Confirmation (still using react-confirm-alert)
    const handleDelete = useCallback((id) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg shadow-xl p-6 w-full max-w-sm animate__animated animate__zoomIn`}>
                        <h1 className={`text-2xl font-bold mb-4 ${themeClasses.text}`}>Confirm Delete</h1>
                        <p className={`${themeClasses.textSecondary} mb-6`}>Are you sure you want to delete this transaction? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={onClose}
                                className={`px-4 py-2 rounded-lg ${themeClasses.buttonSecondary} transition-colors font-medium`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    // In a real app, this would be an API call (DELETE)
                                    // await baseUrl.delete(`/api/transactions/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
                                    setTransactions(prevTransactions => prevTransactions.filter(t => t.id !== id));
                                    onClose();
                                    console.log('Transaction deleted:', id);
                                }}
                                className={`px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors font-medium`}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                );
            }
        });
    }, [setTransactions, themeClasses]); // Include themeClasses in dependency array

    // --- Loading State Display ---
    if (loading) {
        return (
            <div className={`min-h-screen ${themeClasses.bg} flex items-center justify-center`}>
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <IndianRupee className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <p className={`${themeClasses.textSecondary} text-lg font-medium`}>Loading your financial overview...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${themeClasses.bg} transition-all duration-300 font-sans`}>
            {/* Header */}
            <header className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600"></div>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
                        <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                    <Wallet className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                                        Personal Finance Tracker
                                    </h1>
                                    <p className="text-teal-100 text-lg font-medium">Your financial health at a glance</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6 text-white/90">
                                <div className="flex items-center space-x-2">
                                    <IndianRupee className="w-5 h-5" />
                                    <span className="font-medium">Net Balance: {formatRupee(netBalance)}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <PieChart className="w-5 h-5" />
                                    <span className="font-medium">
                                        Transactions: {filteredTransactions.length}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleToggleDarkMode}
                                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200"
                                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            >
                                {isDarkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
                            </button>
                            {/* New: Detailed Report Button */}
                            {/* <Link
                                to="/finance/report"
                                className={`inline-flex items-center ${themeClasses.buttonPrimary}  text-white px-5 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                            >
                                <BarChart3 className="w-5 h-5 mr-2" />
                                Detailed Report
                            </Link> */}
             <Link
                  to="/finance/report"
                  className={`
                      inline-flex items-center
                      px-5 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                      bg-gradient-to-r from-blue-600 to-purple-600
                      text-white
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-blue-400
                      ${isDarkMode ? 'hover:from-blue-500 hover:to-purple-500' : 'hover:from-blue-700 hover:to-purple-700'}
                  `}
              >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Detailed Report
              </Link>
                            {/* New Transaction Button (now a Link) */}
                            {/* <Link
                                to="/finance/add"
                                className={`inline-flex items-center ${themeClasses.buttonPrimary} ${themeClasses.accentText} px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                            >
                                <PlusCircle className="w-5 h-5 mr-2" />
                                New Transaction
                            </Link> */}
                        <Link
                            to="/finance/add"
                            className={`
                                inline-flex items-center
                                px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                                bg-gradient-to-r from-emerald-500 to-green-600
                                text-white
                                transition-all duration-200
                                focus:outline-none focus:ring-2 focus:ring-emerald-400
                                ${isDarkMode ? 'hover:from-emerald-600 hover:to-green-700' : 'hover:from-emerald-400 hover:to-green-500'}
                            `}
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            New Transaction
                        </Link>
                        </div>
                    </div>
                </div>

                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full blur-3xl"></div>
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
                {/* Finance Stats Cards (Rupee Symbol) */}
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`${themeClasses.textSecondary} text-sm font-medium`}>Total Income (Current Month)</p>
                                    <p className={`text-3xl font-bold mt-1 text-green-500`}>{formatRupee(totalIncome)}</p>
                                    <div className="flex items-center mt-2">
                                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                        <span className="text-green-500 text-sm font-medium">Positive flow</span>
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                    <IndianRupee className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`${themeClasses.textSecondary} text-sm font-medium`}>Total Expense (Current Month)</p>
                                    <p className={`text-3xl font-bold mt-1 text-red-500`}>{formatRupee(totalExpense)}</p>
                                    <div className="flex items-center mt-2">
                                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                                        <span className="text-red-500 text-sm font-medium">Outflow</span>
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`${themeClasses.textSecondary} text-sm font-medium`}>Net Balance (Current Month)</p>
                                    <p className={`text-3xl font-bold mt-1 ${netBalance >= 0 ? 'text-blue-500' : 'text-orange-500'}`}>{formatRupee(netBalance)}</p>
                                    <div className="flex items-center mt-2">
                                        {netBalance >= 0 ? (
                                            <>
                                                <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                                                <span className="text-blue-500 text-sm font-medium">Healthy</span>
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle className="w-4 h-4 text-orange-500 mr-1" />
                                                <span className="text-orange-500 text-sm font-medium">Needs attention</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                    <Wallet className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* My Transactions List */}
                <section className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-2xl p-6 shadow-lg animate__animated animate__fadeInUp`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h2 className={`text-2xl font-bold ${themeClasses.text} flex items-center`}>
                            <CreditCard className="w-6 h-6 mr-3" />
                            Transaction Records ({filteredTransactions.length})
                        </h2>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center space-x-2 p-2 rounded-lg ${themeClasses.hover} transition-colors md:hidden ${themeClasses.text}`}
                        >
                            <Filter className="w-5 h-5" />
                            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                        </button>
                    </div>

                    {/* Filter Section */}
                    <div className={`${showFilters ? 'block' : 'hidden'} md:block animate__animated animate__fadeIn mb-6`}>
                        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 p-4 border rounded-xl ${themeClasses.border}`}>
                            <div className="relative col-span-1 sm:col-span-2 lg:col-span-2">
                                <Search className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${themeClasses.textSecondary}`} />
                                <input
                                    type="text"
                                    placeholder="Search description or category..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full border ${themeClasses.inputBorder} rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${themeClasses.bg} ${themeClasses.text}`}
                                />
                            </div>

                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className={`border ${themeClasses.inputBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${themeClasses.bg} ${themeClasses.text}`}
                            >
                                <option value="All">All Types</option>
                                <option value="Income">Income</option>
                                <option value="Expense">Expense</option>
                            </select>

                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className={`border ${themeClasses.inputBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${themeClasses.bg} ${themeClasses.text}`}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <input
                                type="date"
                                value={filterStartDate}
                                onChange={(e) => setFilterStartDate(e.target.value)}
                                className={`border ${themeClasses.inputBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${themeClasses.bg} ${themeClasses.text}`}
                                title="Filter by Start Date"
                            />
                            <input
                                type="date"
                                value={filterEndDate}
                                onChange={(e) => setFilterEndDate(e.target.value)}
                                className={`border ${themeClasses.inputBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${themeClasses.bg} ${themeClasses.text}`}
                                title="Filter by End Date"
                            />

                            <input
                                type="number"
                                placeholder="Min Amount"
                                value={filterMinAmount}
                                onChange={(e) => setFilterMinAmount(e.target.value)}
                                className={`border ${themeClasses.inputBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${themeClasses.bg} ${themeClasses.text}`}
                                title="Filter by Minimum Amount"
                            />
                            <input
                                type="number"
                                placeholder="Max Amount"
                                value={filterMaxAmount}
                                onChange={(e) => setFilterMaxAmount(e.target.value)}
                                className={`border ${themeClasses.inputBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${themeClasses.bg} ${themeClasses.text}`}
                                title="Filter by Maximum Amount"
                            />

                            <button
                                onClick={clearAllFilters}
                                className={`col-span-1 sm:col-span-2 lg:col-span-6 w-full flex items-center justify-center p-2 rounded-lg ${themeClasses.buttonSecondary} transition-colors font-medium`}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Clear All Filters
                            </button>
                        </div>
                    </div>

                    {/* Transactions List */}
                    <div className="space-y-4">
                        {filteredTransactions.length === 0 ? (
                            <div className="text-center py-10">
                                <Search className={`w-16 h-16 ${themeClasses.textSecondary} mx-auto mb-4 opacity-50`} />
                                <p className={`${themeClasses.textSecondary} text-lg font-medium`}>No transactions found matching your criteria.</p>
                                <button
                                    onClick={clearAllFilters}
                                    className={`mt-4 px-4 py-2 rounded-lg ${themeClasses.buttonSecondary} transition-colors`}
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            filteredTransactions.map((transaction) => (
                                <TransactionCard
                                    key={transaction.id}
                                    transaction={transaction}
                                    themeClasses={themeClasses}
                                    onView={handleViewDetails}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default FinanceDashboard;






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