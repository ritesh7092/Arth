import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from "react";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Title,
} from "chart.js";
import {
  Calendar, Filter, Download, Sun, Moon, FileText, TrendingUp,
  TrendingDown, DollarSign, CreditCard, AlertTriangle, BarChart3,
  PieChart, LineChart, Users, Clock, CheckCircle, XCircle, AlertCircle, Printer
} from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useTheme } from "../src/theme/ThemeProvider"; // Importing the custom theme hook
import { toast } from "react-hot-toast"; // Assuming you're using react-hot-toast for notifications
import { Link } from "react-router-dom"; // For navigation
import { useNavigate } from "react-router-dom";
import baseUrl from '../api/api'; // Adjust path if needed


// --- ThemeProvider and useTheme defined within this file ---
// This makes the component self-contained for theme management within this environment.
// In a full application, you would typically import these from a dedicated file like `src/theme/ThemeProvider.jsx`.
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    document.body.classList.toggle('light-theme', theme === 'light');
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to consume theme/context - used by TransactionAnalytics component
// export function useTheme() {
//   return useContext(ThemeContext);
// }
// --- End of ThemeProvider and useTheme definition ---


// Helper to load external scripts dynamically for PDF generation
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Register ChartJS components
ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend,
  LineElement, PointElement, Title
);

// Mock API data (updated with more diverse monthly data for better trends)
const mockApiResponse = {
  "content": [
    { "id": 21, "description": "Jan Income", "category": "Salary", "transactionType": "INCOME", "paymentMethod": "Cash", "counterparty": "Self", "transactionDate": "2025-01-14", "amount": 900.00, "dueStatus": null, "dueDate": null, "clientDescription": null, "emailReminder": null },
    { "id": 22, "description": "Feb Income", "category": "Salary", "transactionType": "INCOME", "paymentMethod": "Bank Transfer", "counterparty": "Self", "transactionDate": "2025-02-13", "amount": 5000.00, "dueStatus": null, "dueDate": null, "clientDescription": null, "emailReminder": null },
    { "id": 23, "description": "Mar Income", "category": "Other", "transactionType": "INCOME", "paymentMethod": "Credit Card", "counterparty": "Mohit", "transactionDate": "2025-03-13", "amount": 920.00, "dueStatus": null, "dueDate": null, "clientDescription": null, "emailReminder": null },
    { "id": 26, "description": "Apr Expense", "category": "Other", "transactionType": "EXPENSE", "paymentMethod": "Credit Card", "counterparty": "Self", "transactionDate": "2025-04-13", "amount": 900.00, "dueStatus": null, "dueDate": null, "clientDescription": "", "emailReminder": false },
    { "id": 28, "description": "May Loan", "category": "Loan", "transactionType": "EXPENSE", "paymentMethod": "Bank Transfer", "counterparty": "John", "transactionDate": "2025-05-12", "amount": 2000.00, "dueStatus": "UNPAID", "dueDate": "2025-07-12", "clientDescription": "Personal loan", "emailReminder": true },
    { "id": 29, "description": "Jun Borrowed", "category": "Borrow", "transactionType": "INCOME", "paymentMethod": "Bank Transfer", "counterparty": "Bank of India", "transactionDate": "2025-06-10", "amount": 50000.00, "dueStatus": "PARTIALLY_PAID", "dueDate": "2025-12-10", "clientDescription": "Home loan", "emailReminder": true },
    { "id": 30, "description": "Jun Repayment", "category": "Borrow", "transactionType": "EXPENSE", "paymentMethod": "UPI", "counterparty": "Bank of India", "transactionDate": "2025-06-11", "amount": 15000.00, "dueStatus": "PAID", "dueDate": null, "clientDescription": "Partial repayment", "emailReminder": false },
    { "id": 31, "description": "Jan Bill", "category": "Utilities", "transactionType": "EXPENSE", "paymentMethod": "Net Banking", "counterparty": "Electricity Board", "transactionDate": "2025-01-20", "amount": 1200.00, "dueStatus": "PAID", "dueDate": null, "clientDescription": null, "emailReminder": false },
    { "id": 32, "description": "Feb Freelance", "category": "Freelance", "transactionType": "INCOME", "paymentMethod": "Bank Transfer", "counterparty": "Client A", "transactionDate": "2025-02-05", "amount": 7500.00, "dueStatus": null, "dueDate": null, "clientDescription": null, "emailReminder": false },
    { "id": 33, "description": "Mar Groceries", "category": "Food", "transactionType": "EXPENSE", "paymentMethod": "Cash", "counterparty": "Supermart", "transactionDate": "2025-03-01", "amount": 800.00, "dueStatus": null, "dueDate": null, "clientDescription": null, "emailReminder": false },
    { "id": 34, "description": "Apr Dinner", "category": "Food", "transactionType": "EXPENSE", "paymentMethod": "Credit Card", "counterparty": "Restaurant Z", "transactionDate": "2025-04-25", "amount": 1500.00, "dueStatus": null, "dueDate": null, "clientDescription": null, "emailReminder": false },
    { "id": 35, "description": "May Investment", "category": "Savings", "transactionType": "INCOME", "paymentMethod": "Bank Transfer", "counterparty": "Investment Firm", "transactionDate": "2025-05-30", "amount": 12000.00, "dueStatus": null, "dueDate": null, "clientDescription": null, "emailReminder": false },
    { "id": 36, "description": "Jun Car Fuel", "category": "Transport", "transactionType": "EXPENSE", "paymentMethod": "Credit Card", "counterparty": "Petrol Pump", "transactionDate": "2025-06-01", "amount": 2000.00, "dueStatus": null, "dueDate": null, "clientDescription": null, "emailReminder": false },
    { "id": 37, "description": "July Income", "category": "Salary", "transactionType": "INCOME", "paymentMethod": "Cash", "counterparty": "Self", "transactionDate": "2025-07-01", "amount": 6000.00, "dueStatus": null, "dueDate": null, "clientDescription": null, "emailReminder": null },
    { "id": 38, "description": "July Rent", "category": "Rent", "transactionType": "EXPENSE", "paymentMethod": "Bank Transfer", "counterparty": "Landlord", "transactionDate": "2025-07-05", "amount": 10000.00, "dueStatus": null, "dueDate": null, "clientDescription": null, "emailReminder": null },
    { "id": 39, "description": "Aug Income", "category": "Salary", "transactionType": "INCOME", "paymentMethod": "Bank Transfer", "counterparty": "Self", "transactionDate": "2025-08-10", "amount": 7000.00, "dueStatus": null, "dueDate": null, "clientDescription": null, "emailReminder": null },
    { "id": 40, "description": "Aug Utilities", "category": "Utilities", "transactionType": "EXPENSE", "paymentMethod": "Net Banking", "counterparty": "Utility Co", "transactionDate": "2025-08-15", "amount": 800.00, "dueStatus": null, "dueDate": null, "clientDescription": null, "emailReminder": null }
  ],
  "pageable": { "pageNumber": 0, "pageSize": 20, "sort": { "empty": true, "sorted": false, "unsorted": true }, "offset": 0, "paged": true, "unpaged": false },
  "last": true, "totalPages": 1, "totalElements": 17, "size": 20, "number": 0, "sort": { "empty": true, "sorted": false, "unsorted": true }, "first": true, "numberOfElements": 17, "empty": false
};

const paymentMethods = ["All", "Bank Transfer", "Credit Card", "Net Banking", "Cheque", "Cash", "UPI"];
const categoriesList = ["Salary", "Food", "Rent", "Loan", "Borrow", "Savings", "Lent", "Other", "Entertainment", "testUpdate", "test92", "Utilities", "Freelance", "Transport"];

const TransactionAnalytics = () => {
  // Theme management: Use the useTheme hook from the shared ThemeProvider
  const navigate = useNavigate(); // For navigation
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false); // New state for PDF loading

  // Filtering states
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  const [filterMonth, setFilterMonth] = useState(""); // MM format
  const [filterMinAmount, setFilterMinAmount] = useState("");
  const [filterMaxAmount, setFilterMaxAmount] = useState("");
  const [filterCategories, setFilterCategories] = useState([]);
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("All");
  const [filterDueStatus, setFilterDueStatus] = useState("All");

  // UI states
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Chart refs - not strictly necessary for Chart.js in React, but can be useful for direct Chart.js API calls
  const barChartRef = useRef();
  const pieChartRef = useRef();
  const lineChartRef = useRef();
  const netLineChartRef = useRef();


  // Mock API call - replace with actual API
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
      // Build query params
      const params = {
        page: currentPage - 1, // Spring pages are 0-based
        size: pageSize,
      };
      if (filterYear) params.startDate = `${filterYear}-01-01`;
      if (filterYear) params.endDate = `${filterYear}-12-31`;
      if (filterMonth) {
        params.startDate = `${filterYear}-${filterMonth}-01`;
        // Calculate last day of month
        const lastDay = new Date(filterYear, filterMonth, 0).getDate();
        params.endDate = `${filterYear}-${filterMonth}-${lastDay}`;
      }
      if (filterPaymentMethod && filterPaymentMethod !== "All") params.paymentMethod = filterPaymentMethod;
      if (filterDueStatus && filterDueStatus !== "All") params.dueStatus = filterDueStatus;
      if (filterMinAmount) params.minAmount = filterMinAmount;
      if (filterMaxAmount) params.maxAmount = filterMaxAmount;
      if (filterCategories && filterCategories.length > 0) params.category = filterCategories.join(',');
      // Add more filters as needed

      const res = await baseUrl.get('/api/finance/transactions', {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });

      let txns = [];
      if (Array.isArray(res.data)) {
        txns = res.data;
      } else if (res.data.content) {
        txns = res.data.content;
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || txns.length);
      }
      setTransactions(txns);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch transactions.'
      );
    } finally {
      setLoading(false);
    }
  }, [
    currentPage, pageSize, filterYear, filterMonth, filterPaymentMethod,
    filterDueStatus, filterMinAmount, filterMaxAmount, filterCategories, navigate
  ]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Enhanced filtering logic
  const filteredData = useMemo(() => {
    return transactions.filter((txn) => {
      if (!txn.transactionDate) return false;
      const txnYear = txn.transactionDate.substring(0, 4);
      const txnMonth = txn.transactionDate.substring(5, 7);

      const matchesYear = filterYear ? txnYear === filterYear : true;
      const matchesMonth = filterMonth ? txnMonth === filterMonth : true;
      const matchesMin = filterMinAmount ? txn.amount >= Number(filterMinAmount) : true;
      const matchesMax = filterMaxAmount ? txn.amount <= Number(filterMaxAmount) : true;
      const matchesCategory = filterCategories.length > 0 ? filterCategories.includes(txn.category) : true;
      const matchesPayment = filterPaymentMethod === "All" ? true : txn.paymentMethod === filterPaymentMethod;
      const matchesDueStatus = filterDueStatus === "All" ? true : txn.dueStatus === filterDueStatus;

      return matchesYear && matchesMonth && matchesMin && matchesMax && matchesCategory && matchesPayment && matchesDueStatus;
    });
  }, [transactions, filterYear, filterMonth, filterMinAmount, filterMaxAmount, filterCategories, filterPaymentMethod, filterDueStatus]);

  // Advanced analytics calculations
  const analytics = useMemo(() => {
    // Only INCOME and EXPENSE for balance
    const totalIncome = filteredData.filter(txn => txn.transactionType === 'INCOME').reduce((sum, txn) => sum + txn.amount, 0);
    const totalExpense = filteredData.filter(txn => txn.transactionType === 'EXPENSE').reduce((sum, txn) => sum + txn.amount, 0);
    const balance = totalIncome - totalExpense;

    // Loans Given (Asset)
    const loansGiven = filteredData.filter(txn => txn.transactionType === 'LOAN');
    const totalLoansGiven = loansGiven.reduce((sum, txn) => sum + txn.amount, 0);
    const unpaidLoans = loansGiven.filter(txn => txn.dueStatus === 'UNPAID').reduce((sum, txn) => sum + txn.amount, 0);
    const partiallyPaidLoans = loansGiven.filter(txn => txn.dueStatus === 'PARTIALLY_PAID').reduce((sum, txn) => sum + txn.amount, 0);

    // Borrows Taken (Liability)
    const borrowsTaken = filteredData.filter(txn => txn.transactionType === 'BORROW');
    const totalBorrowed = borrowsTaken.reduce((sum, txn) => sum + txn.amount, 0);

    // Net Balance (Net Worth)
    const netBalance = balance + totalLoansGiven - totalBorrowed;

    // Outstanding Debt (if you want to show)
    const outstandingDebt = totalBorrowed; // Or subtract repayments if you track them

    // Category breakdown
    const categoryTotals = filteredData.reduce((acc, txn) => {
      acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
      return acc;
    }, {});

    // Monthly trends (Income, Expense, and Net Total)
    const monthlyData = {};
    filteredData.forEach(txn => {
      const monthYear = txn.transactionDate.substring(0, 7); // FormatYYYY-MM
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { income: 0, expense: 0, net: 0 };
      }
      if (txn.transactionType === 'INCOME') {
        monthlyData[monthYear].income += txn.amount;
        monthlyData[monthYear].net += txn.amount; // Add to net
      } else {
        monthlyData[monthYear].expense += txn.amount;
        monthlyData[monthYear].net -= txn.amount; // Subtract from net
      }
    });

    // Sort monthly data by monthYear string for consistent chart labels
    const sortedMonthlyLabels = Object.keys(monthlyData).sort();

    // Payment method analysis
    const paymentMethodTotals = filteredData.reduce((acc, txn) => {
      const method = txn.paymentMethod || 'Unknown';
      acc[method] = (acc[method] || 0) + txn.amount;
      return acc;
    }, {});

    return {
      totalIncome,
      totalExpense,
      balance,
      netBalance,
      totalLoansGiven,
      unpaidLoans,
      partiallyPaidLoans,
      totalBorrowed,
      outstandingDebt,
      categoryTotals,
      monthlyData, // Contains income, expense, and net for each month
      sortedMonthlyLabels, // Sorted labels for charts
      paymentMethodTotals,
      transactionCount: filteredData.length
    };
  }, [filteredData]);

  // Chart colors (can be extended)
  const chartColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1',
    '#D946EF', '#F43F5E', '#22D3EE', '#BE185D', '#6EE7B7'
  ];

  // Dynamic theme classes derived from isDark
  const themeClasses = {
    bg: isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
    card: isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900',
    cardHover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    text: isDark ? 'text-gray-100' : 'text-gray-900',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-600',
    input: isDark ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
  };

  // Chart.js options, dynamically set colors based on theme
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDark ? '#E5E7EB' : '#374151',
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        titleColor: isDark ? '#FFFFFF' : '#000000',
        bodyColor: isDark ? '#E5E7EB' : '#374151',
        borderColor: isDark ? '#374151' : '#E5E7EB',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += `₹${context.parsed.y.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
            return label;
          }
        }
      },
      title: {
        display: false, // Titles are handled by h3 tags above charts
      }
    },
    scales: {
      y: {
        ticks: { color: isDark ? '#E5E7EB' : '#374151' },
        grid: { color: isDark ? '#374151' : '#E5E7EB' }
      },
      x: {
        ticks: { color: isDark ? '#E5E7EB' : '#374151' },
        grid: { display: false }
      }
    }
  };

  // Chart data for Category Breakdown
  const categoryBarData = {
    labels: Object.keys(analytics.categoryTotals),
    datasets: [{
      label: 'Amount (₹)',
      data: Object.values(analytics.categoryTotals),
      backgroundColor: chartColors,
      borderRadius: 4
    }]
  };

  // Chart data for Monthly Income vs Expenses
  const monthlyLineData = {
    labels: analytics.sortedMonthlyLabels,
    datasets: [
      {
        label: 'Income',
        data: analytics.sortedMonthlyLabels.map(month => analytics.monthlyData[month].income),
        borderColor: '#10B981', // Green
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#10B981',
      },
      {
        label: 'Expense',
        data: analytics.sortedMonthlyLabels.map(month => analytics.monthlyData[month].expense),
        borderColor: '#EF4444', // Red
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#EF4444',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#EF4444',
      }
    ]
  };

  // Monthly Net Total Chart data
  const monthlyNetTotalData = {
    labels: analytics.sortedMonthlyLabels,
    datasets: [
      {
        label: 'Net Balance',
        data: analytics.sortedMonthlyLabels.map(month => analytics.monthlyData[month].net),
        borderColor: '#3B82F6', // Blue
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3B82F6',
      },
    ],
  };

  // Chart data for Payment Methods Distribution
  const paymentMethodPieData = {
    labels: Object.keys(analytics.paymentMethodTotals),
    datasets: [{
      data: Object.values(analytics.paymentMethodTotals),
      backgroundColor: chartColors,
      borderWidth: 2,
      borderColor: isDark ? '#1F2937' : '#FFFFFF'
    }]
  };

  // Chart data for Loan Status Distribution
  const loanStatusData = {
    labels: ['Paid Loans', 'Unpaid Loans', 'Partially Paid'],
    datasets: [{
      data: [
        analytics.totalLoansGiven - analytics.unpaidLoans - analytics.partiallyPaidLoans, // Calculated paid portion
        analytics.unpaidLoans,
        analytics.partiallyPaidLoans
      ],
      backgroundColor: ['#10B981', '#EF4444', '#F59E0B'], // Green, Red, Orange
      borderWidth: 2,
      borderColor: isDark ? '#1F2937' : '#FFFFFF'
    }]
  };

  // StatCard Component for key metrics
  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => (
    <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg border ${themeClasses.border} transition-all duration-300 ${themeClasses.cardHover}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${themeClasses.textMuted}`}>{title}</p>
          <p className={`text-2xl font-bold ${themeClasses.text} mt-1`}>
            ₹{typeof value === 'number' ? value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}
          </p>
          {/* Trend display - conceptual, needs actual trend calculation */}
          {trend && (
            <p className={`text-sm flex items-center mt-2 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {Math.abs(trend)}%
            </p>
          )}
        </div>
        <Icon className={`w-8 h-8 text-${color}-500`} />
      </div>
    </div>
  );

  // Function to clear all filters
  const clearFilters = () => {
    setFilterYear(new Date().getFullYear().toString());
    setFilterMonth("");
    setFilterMinAmount("");
    setFilterMaxAmount("");
    setFilterCategories([]);
    setFilterPaymentMethod("All");
    setFilterDueStatus("All");
  };

  // Function to export filtered data to CSV
  const exportToCSV = () => {
    // Define headers for the CSV file
    const headers = ["Date", "Description", "Category", "Type", "Amount", "Payment Method", "Counterparty", "Due Status", "Due Date", "Client Description", "Email Reminder"];
    // Map filtered data to rows, ensuring date is formatted and all fields are present
    const rows = filteredData.map(txn => [
      txn.transactionDate || "N/A", // Ensure date is included
      txn.description || "",
      txn.category || "",
      txn.transactionType || "",
      txn.amount ? txn.amount.toFixed(2) : "0.00", // Format amount
      txn.paymentMethod || "",
      txn.counterparty || "",
      txn.dueStatus || "N/A",
      txn.dueDate || "",
      txn.clientDescription || "",
      txn.emailReminder !== undefined ? (txn.emailReminder ? "Yes" : "No") : "",
    ]);

    // Combine headers and rows, handle commas within data by quoting fields
    const csvContent = [
      headers.map(h => `"${h}"`).join(','), // Quote headers
      ...rows.map(row => row.map(field => {
        const stringField = String(field);
        return `"${stringField.replace(/"/g, '""')}"`; // Escape double quotes and wrap in quotes
      }).join(','))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Arth_Financial_Report_${filterYear}${filterMonth ? `-${filterMonth}` : ''}.csv`; // Branded filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Function to handle printing the current view (dashboard content)
  const handlePrint = () => {
    window.print(); // Triggers the browser's print dialog
  };

  // Functional PDF export function using html2canvas and jspdf
  const exportToPDF = async () => {
    setIsPdfGenerating(true);
    try {
      // Load html2canvas and jspdf dynamically if not already loaded
      if (typeof html2canvas === 'undefined') {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
      }
      if (typeof jspdf === 'undefined') {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      }
      const { jsPDF } = window.jspdf; // Access jsPDF globally

      const input = document.getElementById('analytics-dashboard-content');
      if (!input) {
        console.error("Content div not found for PDF export.");
        setIsPdfGenerating(false);
        return;
      }

      // Convert HTML content to canvas
      const canvas = await html2canvas(input, {
        scale: 2, // Increase scale for better resolution in PDF
        useCORS: true, // Important if you have images from other origins
        logging: true, // Enable logging for debugging html2canvas
        // ignoreElements: (element) => {
        //   // Optionally ignore elements that shouldn't be in the PDF, e.g., print buttons
        //   return element.classList.contains('no-print');
        // }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgCanvasHeight = canvas.height; // Original canvas height in pixels
      const imgCanvasWidth = canvas.width; // Original canvas width in pixels

      // Calculate the image height scaled to PDF width
      const imgPdfHeight = (imgCanvasHeight * imgWidth) / imgCanvasWidth;

      let imgY = 0; // Current Y position in the source canvas image
      const headerSpace = 50; // Space for header/branding on PDF
      const footerSpace = 10; // Space for a small footer/margin on PDF
      const usablePageHeight = pageHeight - headerSpace - footerSpace;

      while (imgY < imgCanvasHeight) {
        if (imgY > 0) { // Add a new page for subsequent content
          pdf.addPage();
        }

        // Re-add header/branding to new page
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(18);
        pdf.setTextColor(59, 130, 246);
        pdf.text('Arth: Revolutionize Your Productivity (Cont.)', 14, 20);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Report for ${filterYear}${filterMonth ? `/${filterMonth}` : ''}`, 14, 28);

        // Calculate how much of the source image can fit on the current PDF page
        // This is done by figuring out the height in canvas pixels that corresponds to usablePageHeight in PDF mm
        let imgSegmentHeightInPx = Math.min(imgCanvasHeight - imgY, (usablePageHeight * imgCanvasWidth) / imgWidth);

        // Add image segment to PDF
        // Args: imgData, format, x, y, width, height, alias, compression, rotation, sX, sY, sWidth, sHeight
        pdf.addImage(
          imgData,
          'PNG',
          0, // x on PDF page
          headerSpace, // y on PDF page (below header)
          imgWidth, // width on PDF page
          (imgSegmentHeightInPx * imgWidth) / imgCanvasWidth, // height on PDF page
          null, null, 0, // optional parameters for alias, compression, rotation
          0, // sX (start X in source image - no horizontal cropping)
          imgY, // sY (start Y in source image)
          imgCanvasWidth, // sWidth (width of source segment)
          imgSegmentHeightInPx // sHeight (height of source segment)
        );

        imgY += imgSegmentHeightInPx; // Move to the next segment in the source image
      }
      
      pdf.save(`Arth_Financial_Report_${filterYear}${filterMonth ? `-${filterMonth}` : ''}.pdf`);

    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF. Please try again or use the print option. Check browser console for details.");
    } finally {
      setIsPdfGenerating(false);
    }
  };


  // Tab button component for navigation
  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        activeTab === id
          ? 'bg-blue-500 text-white shadow-lg'
          : `${themeClasses.text} hover:bg-blue-100 dark:hover:bg-gray-700`
      }`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </button>
  );

  // Render loading state
  if (loading || isPdfGenerating) { // Show loading for PDF generation too
    return (
      <div className={`min-h-screen ${themeClasses.bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={themeClasses.text}>{isPdfGenerating ? 'Generating PDF, please wait...' : 'Loading analytics...'}</p>
        </div>
      </div>
    );
  }

  // Main component render
  return (
    <div className={`min-h-screen ${themeClasses.bg} transition-colors duration-300`}>
      <div id="analytics-dashboard-content" className="container mx-auto px-4 py-6"> {/* ID for PDF capture */}
        {/* Header with Branding and Theme Toggle */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className={`text-4xl font-bold ${themeClasses.text} mb-2`}>
              Transaction Analytics
            </h1>
            <p className={themeClasses.textMuted}>
              Comprehensive insights into your financial data
            </p>
            {/* Branding */}
            <p className={`text-sm ${themeClasses.textMuted} mt-1`}>
              Arth: Revolutionize Your Productivity | Designed & Developed by Ritesh Raj Tiwari
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-lg ${themeClasses.card} border ${themeClasses.border} hover:scale-105 transition-transform`}
              aria-label="Toggle theme"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-300" /> : <Moon className="w-5 h-5 text-indigo-700" />}
            </button>
            {/* Dashboard Button */}
             <button
              onClick={() => navigate("/finance/dashboard")}
              className="no-print ml-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow transition"
              title="Go to Finance Dashboard"
            >
              Go to Dashboard
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Income"
            value={analytics.totalIncome}
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="Total Expenses"
            value={analytics.totalExpense}
            icon={TrendingDown}
            color="red"
          />
          <StatCard
            title="Net Balance"
            value={analytics.netBalance}
            icon={DollarSign}
            color={analytics.netBalance >= 0 ? "green" : "red"}
          />
          <StatCard
            title="Outstanding Debt"
            value={analytics.outstandingDebt}
            icon={AlertTriangle}
            color="orange"
          />
        </div>

        {/* Loan & Borrow Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Loans Given"
            value={analytics.totalLoansGiven}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Unpaid Loans"
            value={analytics.unpaidLoans}
            icon={Clock}
            color="red"
          />
          <StatCard
            title="Total Borrowed"
            value={analytics.totalBorrowed}
            icon={CreditCard}
            color="purple"
          />
        </div>

        {/* Filters and Export Options */}
        <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg border ${themeClasses.border} mb-8`}>
          <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4 flex items-center`}>
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <div>
              <label htmlFor="filter-year" className={`block text-sm font-medium ${themeClasses.textMuted} mb-1`}>Year</label>
              <input
                id="filter-year"
                type="number"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="e.g., 2025"
              />
            </div>
            <div>
              <label htmlFor="filter-month" className={`block text-sm font-medium ${themeClasses.textMuted} mb-1`}>Month</label>
              <input
                id="filter-month"
                type="month"
                // Format for input type="month" isYYYY-MM
                value={filterMonth ? `${filterYear}-${filterMonth}` : ""}
                onChange={(e) => setFilterMonth(e.target.value ? e.target.value.substring(5, 7) : "")}
                className={`w-full px-3 py-2 rounded-lg border ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            <div>
              <label htmlFor="filter-min-amount" className={`block text-sm font-medium ${themeClasses.textMuted} mb-1`}>Min Amount</label>
              <input
                id="filter-min-amount"
                type="number"
                value={filterMinAmount}
                onChange={(e) => setFilterMinAmount(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${themeClasses.input} focus:ring-2 focus="ring-blue-500 focus:border-transparent`}
                placeholder="Min"
              />
            </div>
            <div>
              <label htmlFor="filter-max-amount" className={`block text-sm font-medium ${themeClasses.textMuted} mb-1`}>Max Amount</label>
              <input
                id="filter-max-amount"
                type="number"
                value={filterMaxAmount}
                onChange={(e) => setFilterMaxAmount(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Max"
              />
            </div>
            <div>
              <label htmlFor="filter-payment-method" className={`block text-sm font-medium ${themeClasses.textMuted} mb-1`}>Payment Method</label>
              <select
                id="filter-payment-method"
                value={filterPaymentMethod}
                onChange={(e) => setFilterPaymentMethod(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                {paymentMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filter-due-status" className={`block text-sm font-medium ${themeClasses.textMuted} mb-1`}>Due Status</label>
              <select
                id="filter-due-status"
                value={filterDueStatus}
                onChange={(e) => setFilterDueStatus(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="All">All</option>
                <option value="PAID">Paid</option>
                <option value="UNPAID">Unpaid</option>
                <option value="PARTIALLY_PAID">Partially Paid</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors flex items-center"
              disabled={isPdfGenerating} // Disable button while generating
            >
              {isPdfGenerating ? (
                 <span className="flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                 </span>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Export PDF
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors flex items-center"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Report
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          <TabButton id="overview" label="Overview" icon={BarChart3} />
          <TabButton id="trends" label="Trends" icon={LineChart} />
          <TabButton id="categories" label="Categories" icon={PieChart} />
          <TabButton id="loans" label="Loans & Debts" icon={Users} />
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg border ${themeClasses.border}`}>
              <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Category Breakdown (Filtered Data)</h3>
              <div style={{ height: '300px' }}>
                <Bar ref={barChartRef} data={categoryBarData} options={chartOptions} />
              </div>
            </div>
            <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg border ${themeClasses.border}`}>
              <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Payment Methods Distribution (Filtered Data)</h3>
              <div style={{ height: '300px' }}>
                <Doughnut data={paymentMethodPieData} options={chartOptions} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg border ${themeClasses.border}`}>
              <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Monthly Income vs Expenses ({filterYear})</h3>
              <div style={{ height: '400px' }}>
                <Line ref={lineChartRef} data={monthlyLineData} options={chartOptions} />
              </div>
            </div>
            {/* Monthly Net Total Graph */}
            <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg border ${themeClasses.border}`}>
              <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Monthly Net Balance ({filterYear})</h3>
              <div style={{ height: '400px' }}>
                <Line ref={netLineChartRef} data={monthlyNetTotalData} options={chartOptions} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg border ${themeClasses.border} mb-8`}>
            <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Category Distribution (Overall Filtered Data)</h3>
            <div style={{ height: '400px' }}>
              <Pie ref={pieChartRef} data={categoryBarData} options={chartOptions} />
            </div>
          </div>
        )}

        {activeTab === 'loans' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg border ${themeClasses.border}`}>
              <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Loan Status Distribution (Filtered Data)</h3>
              <div style={{ height: '300px' }}>
                <Doughnut data={loanStatusData} options={chartOptions} />
              </div>
            </div>
            <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg border ${themeClasses.border}`}>
              <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Outstanding Loans Summary</h3>
              <ul className="list-disc pl-5">
                <li className={`text-sm ${themeClasses.text} flex items-center mb-2`}>
                  <CheckCircle className="inline w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                  <span className="font-medium">Total Loans Given:</span> ₹{analytics.totalLoansGiven.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </li>
                <li className={`text-sm ${themeClasses.text} flex items-center mb-2`}>
                  <AlertCircle className="inline w-4 h-4 mr-2 text-yellow-500 flex-shrink-0" />
                  <span className="font-medium">Partially Paid Loans:</span> ₹{analytics.partiallyPaidLoans.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </li>
                <li className={`text-sm ${themeClasses.text} flex items-center`}>
                  <XCircle className="inline w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
                  <span className="font-medium">Unpaid Loans:</span> ₹{analytics.unpaidLoans.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default TransactionAnalytics;













