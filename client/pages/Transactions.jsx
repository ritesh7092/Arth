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

  // Chart refs - not strictly necessary for Chart.js in React, but can be useful for direct Chart.js API calls
  const barChartRef = useRef();
  const pieChartRef = useRef();
  const lineChartRef = useRef();
  const netLineChartRef = useRef();


  // Mock API call - replace with actual API
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setTransactions(mockApiResponse.content);
    } catch (err) {
      setError("Failed to fetch transactions");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

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
    const totalIncome = filteredData
      .filter(txn => txn.transactionType === 'INCOME')
      .reduce((sum, txn) => sum + txn.amount, 0);

    const totalExpense = filteredData
      .filter(txn => txn.transactionType === 'EXPENSE')
      .reduce((sum, txn) => sum + txn.amount, 0);

    const netBalance = totalIncome - totalExpense;

    // Loan calculations
    const loansGiven = filteredData
      .filter(txn => txn.category === 'Loan' && txn.transactionType === 'EXPENSE');

    const totalLoansGiven = loansGiven.reduce((sum, txn) => sum + txn.amount, 0);
    const unpaidLoans = loansGiven
      .filter(txn => txn.dueStatus === 'UNPAID')
      .reduce((sum, txn) => sum + txn.amount, 0);
    const partiallyPaidLoans = loansGiven
      .filter(txn => txn.dueStatus === 'PARTIALLY_PAID')
      .reduce((sum, txn) => sum + txn.amount, 0);

    // Borrow calculations
    const borrowTransactions = filteredData
      .filter(txn => txn.category === 'Borrow');

    const totalBorrowed = borrowTransactions
      .filter(txn => txn.transactionType === 'INCOME')
      .reduce((sum, txn) => sum + txn.amount, 0);

    const totalRepaid = borrowTransactions
      .filter(txn => txn.transactionType === 'EXPENSE')
      .reduce((sum, txn) => sum + txn.amount, 0);

    const outstandingDebt = totalBorrowed - totalRepaid;

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
      netBalance,
      totalLoansGiven,
      unpaidLoans,
      partiallyPaidLoans,
      totalBorrowed,
      totalRepaid,
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













// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { Bar, Pie } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import {
//   FaCalendarAlt, FaFilter, FaDownload, FaSun, FaMoon, FaFileCsv
// } from "react-icons/fa";
// import "./print.css"; // Assuming this CSS is for print styles
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import baseUrl from '../api/api'; // Import your axios instance (or base URL utility)
// import { AlertTriangle } from 'lucide-react'; // For error icon if you wish

// // Register ChartJS components
// ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// const paymentMethods = [
//   "All", "Bank Transfer", "Credit Card", "Net Banking", "Cheque", "Cash", "UPI"
// ];

// const categoriesList = [
//   "Salary", "Food", "Rent", "Loan", "Borrow", "Savings", "Lent", "Other", "Entertainment", "testUpdate", "test92"
// ];

// const Transactions = () => {
//   // --- Theme ---
//   const [theme, setTheme] = useState(() => {
//     if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
//       return localStorage.getItem('theme');
//     }
//     if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//       return 'dark';
//     }
//     return 'light';
//   });

//   useEffect(() => {
//     const html = document.documentElement;
//     if (theme === 'dark') {
//       html.classList.add('dark');
//     } else {
//       html.classList.remove('dark');
//     }
//     localStorage.setItem('theme', theme);
//   }, [theme]);

//   const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

//   // --- Transactions State ---
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [flashMessage, setFlashMessage] = useState(null); // Added for auth errors

//   // --- Filtering States ---
//   const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
//   const [filterMonth, setFilterMonth] = useState("");
//   const [filterMinAmount, setFilterMinAmount] = useState("");
//   const [filterMaxAmount, setFilterMaxAmount] = useState("");
//   const [filterCategories, setFilterCategories] = useState([]);
//   const [filterPaymentMethod, setFilterPaymentMethod] = useState("All");

//   // --- Pagination States (for API) ---
//   const [currentPage, setCurrentPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);

//   // --- Category Dropdown State ---
//   const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

//   // --- Chart refs ---
//   const barChartRef = useRef();
//   const pieChartRef = useRef();

//   const navigate = useNavigate(); // Initialize useNavigate

//   // --- Fetch Transactions from API with Authentication ---
//   const fetchTransactions = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     setFlashMessage(null); // Clear previous flash messages

//     const token = localStorage.getItem('authToken'); // Get the token from localStorage
//     if (!token) {
//       const authErrorMessage = 'Authentication required. Please log in.';
//       setFlashMessage({ type: 'error', message: authErrorMessage });
//       setError(authErrorMessage); // Set error for component display
//       setLoading(false);
//       // Optional: Redirect to login after a delay or immediately
//       setTimeout(() => navigate('/login'), 1500);
//       return;
//     }

//     let url = `/api/finance/transactions?page=${currentPage}&size=20`; // Use relative path with baseUrl

//     try {
//       const response = await baseUrl.get(url, { // Use baseUrl.get for authenticated requests
//         headers: {
//           Authorization: `Bearer ${token}` // Add Authorization header
//         }
//       });

//       setTransactions(response.data.content);
//       setTotalPages(response.data.totalPages);
//     } catch (err) {
//       console.error("Failed to fetch transactions:", err);
//       let errorMessage = "Failed to load transactions. Please try again.";

//       if (err.response) {
//         if (err.response.status === 401 || err.response.status === 403) {
//           errorMessage = 'Session expired or unauthorized. Please log in again.';
//           setFlashMessage({ type: 'error', message: errorMessage });
//           setTimeout(() => navigate('/login'), 1500); // Redirect to login
//         } else {
//           errorMessage = err.response.data?.message || errorMessage;
//         }
//       }
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, navigate]); // Add navigate to dependency array

//   useEffect(() => {
//     fetchTransactions();
//   }, [fetchTransactions, filterYear, filterMonth, filterMinAmount, filterMaxAmount, filterCategories, filterPaymentMethod]);

//   // --- Filtering Logic (Client-side for now, as backend filter integration is not specified) ---
//   const filteredData = transactions.filter((txn) => {
//     if (!txn.transactionDate) return false;
//     const txnYear = txn.transactionDate.substring(0, 4);
//     const txnMonth = txn.transactionDate.substring(5, 7);
//     const matchesYear = txnYear === filterYear;
//     const matchesMonth = filterMonth ? txnMonth === filterMonth : true;
//     const matchesMin = filterMinAmount ? txn.amount >= Number(filterMinAmount) : true;
//     const matchesMax = filterMaxAmount ? txn.amount <= Number(filterMaxAmount) : true;
//     const matchesCategory = filterCategories.length > 0 ? filterCategories.includes(txn.category) : true;
//     const matchesPayment = filterPaymentMethod === "All" ? true : txn.paymentMethod === filterPaymentMethod;
//     return matchesYear && matchesMonth && matchesMin && matchesMax && matchesCategory && matchesPayment;
//   });

//   // --- Chart Data ---
//   const getTotals = (data) => {
//     return data.reduce((acc, txn) => {
//       acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
//       return acc;
//     }, {});
//   };

//   const totals = getTotals(filteredData);

//   const pastelColors = [
//     "#60a5fa", "#f472b6", "#34d399", "#fbbf24", "#a78bfa", "#f87171", "#38bdf8",
//     "#facc15", "#4ade80", "#c084fc", "#fb7185", "#f472b6", "#818cf8", "#fca5a5"
//   ];

//   const isDark = theme === 'dark';
//   const axisColor = isDark ? "#e5e7eb" : "#374151";
//   const legendColor = isDark ? "#f3f4f6" : "#374151";

//   const barData = {
//     labels: Object.keys(totals),
//     datasets: [
//       {
//         label: "Amount (₹)",
//         data: Object.values(totals),
//         backgroundColor: pastelColors,
//         borderColor: 'rgba(0,0,0,0.1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
//   const monthlyTotals = months.map((m) => {
//     const monthData = transactions.filter(
//       (txn) =>
//         txn.transactionDate &&
//         txn.transactionDate.substring(0, 4) === filterYear &&
//         txn.transactionDate.substring(5, 7) === m
//     );
//     return monthData.reduce((sum, txn) => {
//       return sum + (txn.transactionType === "INCOME" ? txn.amount : -txn.amount);
//     }, 0);
//   });

//   const pieData = {
//     labels: months.map((m) => {
//       const d = new Date(`${filterYear}-${m}-01`);
//       return d.toLocaleString("default", { month: "short" });
//     }),
//     datasets: [
//       {
//         label: "Net Total (₹)",
//         data: monthlyTotals,
//         backgroundColor: pastelColors,
//         borderColor: 'rgba(0,0,0,0.1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const chartOptions = {
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: true,
//         position: 'bottom',
//         labels: {
//           color: legendColor,
//           font: { size: 13, weight: 'bold' },
//           boxWidth: 18,
//           padding: 18,
//         },
//       },
//       tooltip: {
//         titleFont: { size: 14 },
//         bodyFont: { size: 12 },
//         backgroundColor: isDark ? '#22223b' : 'rgba(0,0,0,0.8)',
//         titleColor: '#fff',
//         bodyColor: '#fff',
//       },
//     },
//     scales: {
//       y: {
//         ticks: { color: axisColor, font: { weight: 'bold' } },
//         grid: { color: isDark ? "#334155" : "#e5e7eb" },
//         title: {
//           display: true,
//           text: "Amount (₹)",
//           color: axisColor,
//           font: { size: 14, weight: 'bold' }
//         }
//       },
//       x: {
//         ticks: { color: axisColor, font: { weight: 'bold' } },
//         grid: { display: false },
//         title: {
//           display: true,
//           text: "Category",
//           color: axisColor,
//           font: { size: 14, weight: 'bold' }
//         }
//       },
//     },
//   };

//   const pieChartOptions = {
//     ...chartOptions,
//     scales: {},
//     plugins: {
//       ...chartOptions.plugins,
//       legend: {
//         ...chartOptions.plugins.legend,
//         display: true,
//       },
//     },
//   };

//   // Theme-aware classes
//   const themeClasses = {
//     bg: isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
//     card: isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900',
//     heading: isDark ? 'text-white' : 'text-blue-700',
//     tableHead: isDark ? 'bg-teal-800 text-white' : 'bg-teal-600 text-white',
//     tableRow: isDark ? 'hover:bg-gray-700' : 'hover:bg-blue-50',
//     tableCell: isDark ? 'text-gray-100' : 'text-gray-900',
//     tableStripe: isDark ? 'bg-gray-900' : 'bg-blue-50',
//     border: isDark ? 'border-gray-700' : 'border-gray-200',
//     muted: isDark ? 'text-gray-400' : 'text-gray-500',
//     accent: isDark ? 'text-teal-400' : 'text-teal-600',
//     credit: isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800',
//     debit: isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800',
//     button: isDark ? 'bg-blue-700 hover:bg-blue-800 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
//   };

//   const exportToCSV = () => {
//     const headers = ["Date", "Description", "Category", "Type", "Amount", "Payment Method", "Counterparty"];
//     const rows = filteredData.map(txn =>
//       [
//         `="${txn.transactionDate}"`,
//         txn.description,
//         txn.category,
//         txn.transactionType,
//         txn.amount,
//         txn.paymentMethod || "",
//         txn.counterparty || ""
//       ]
//     );
//     let csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "transactions.csv";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const handlePrint = async () => {
//     const prevTheme = theme;
//     setTheme('light');
//     await new Promise(resolve => setTimeout(resolve, 200));
//     window.print();
//     setTheme(prevTheme);
//   };

//   const exportToPDF = async () => {
//     const prevTheme = theme;
//     setTheme('light');
//     await new Promise(resolve => setTimeout(resolve, 200));

//     const doc = new jsPDF("p", "mm", "a4");

//     // Branding
//     doc.setFillColor(30, 64, 175);
//     doc.rect(0, 0, 210, 30, "F");
//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(22);
//     doc.setFont("helvetica", "bold");
//     doc.text("Arth", 14, 16);
//     doc.setFontSize(10);
//     doc.setFont("helvetica", "normal");
//     doc.text("PRODUCTIVITY", 40, 13);
//     doc.setFontSize(9);
//     doc.text("World's #1 Productivity Platform", 140, 10, { align: "right", maxWidth: 60 });
//     doc.setFontSize(13);
//     doc.setTextColor(30, 64, 175);
//     doc.text("Revolutionize Your Productivity", 14, 36);
//     doc.setTextColor(60, 60, 60);
//     doc.setFontSize(10);
//     doc.text("The ultimate ecosystem for Financial Intelligence, Task Mastery & AI-Powered Insights", 14, 42, { maxWidth: 180 });
//     doc.setFontSize(9);
//     doc.text("Arth is your all-in-one platform for mastering productivity, personal finance, and AI-powered insights. Built for students, professionals, and teams who want to achieve more with less effort—securely, beautifully, and intelligently.", 14, 48, { maxWidth: 180 });

//     // CREDIT
//     doc.setFontSize(12);
//     doc.setFont("helvetica", "bold");
//     doc.setTextColor(30, 64, 175);
//     doc.text("Designed, Developed and By Ritesh Raj Tiwari", 14, 60);

//     // Main Report Title
//     doc.setTextColor(30, 64, 175);
//     doc.setFontSize(16);
//     doc.setFont("helvetica", "bold");
//     doc.text("Transaction Analytics & Summary", 14, 70);

//     // Bar Chart
//     const barChart = barChartRef.current;
//     if (barChart && barChart.toBase64Image) {
//       const barImg = barChart.toBase64Image();
//       doc.setFontSize(12);
//       doc.setTextColor(30, 64, 175);
//       doc.text("Category Breakdown", 14, 80);
//       doc.addImage(barImg, "PNG", 14, 84, 180, 50);
//     }

//     // Pie Chart
//     const pieChart = pieChartRef.current;
//     if (pieChart && pieChart.toBase64Image) {
//       doc.setTextColor(30, 64, 175);
//       doc.text("Monthly Net Total", 14, 144);
//       const pieImg = pieChart.toBase64Image();
//       doc.addImage(pieImg, "PNG", 14, 148, 80, 50);
//     }

//     // Table
//     doc.setFontSize(13);
//     doc.setTextColor(30, 64, 175);
//     doc.setFont("helvetica", "bold");
//     doc.text("Transaction Details", 14, 204);

//     const tableColumn = [
//       "Date", "Description", "Category", "Type", "Amount", "Payment Method", "Counterparty"
//     ];
//     const tableRows = filteredData.map(txn => [
//       txn.transactionDate,
//       txn.description,
//       txn.category,
//       txn.transactionType,
//       txn.amount,
//       txn.paymentMethod || "",
//       txn.counterparty || ""
//     ]);
//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: 210,
//       styles: { fontSize: 9 },
//       headStyles: { fillColor: [30, 64, 175] },
//       margin: { left: 14, right: 14 }
//     });

//     doc.save("transactions.pdf");
//     setTheme(prevTheme);
//   };

//   // --- Clear Filters ---
//   const clearFilters = () => {
//     setFilterYear(new Date().getFullYear().toString());
//     setFilterMonth("");
//     setFilterMinAmount("");
//     setFilterMaxAmount("");
//     setFilterCategories([]);
//     setFilterPaymentMethod("All");
//     setCurrentPage(0);
//   };

//   // --- Category Dropdown: Close on outside click ---
//   useEffect(() => {
//     if (!categoryDropdownOpen) return;
//     const handleClick = (e) => {
//       if (!e.target.closest("#category-dropdown")) setCategoryDropdownOpen(false);
//     };
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, [categoryDropdownOpen]);

//   // Handle Pagination
//   const handlePageChange = (newPage) => {
//     if (newPage >= 0 && newPage < totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   return (
//     <div className={`min-h-screen ${themeClasses.bg} flex flex-col transition-colors duration-300`}>
//       <main className="container mx-auto py-6 px-2 sm:px-4 flex-grow">
//         <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
//           <h1 className={`text-3xl sm:text-4xl font-extrabold ${themeClasses.heading} transition-colors duration-300 text-center md:text-left`}>
//             Transaction Analytics & Summary
//           </h1>
//           <div className="flex gap-2">
//             <button
//               onClick={toggleTheme}
//               className="no-print p-3 rounded-full shadow-md bg-white dark:bg-gray-700 text-gray-800 hover:scale-105 transition-transform duration-200"
//               aria-label="Toggle theme"
//             >
//               {theme === 'dark' ? (
//                 <FaSun className="text-yellow-400 text-xl" />
//               ) : (
//                 <FaMoon className="text-indigo-600 text-xl" />
//               )}
//             </button>
//             <button
//               onClick={() => navigate("/finance/dashboard")}
//               className="no-print ml-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow transition"
//               title="Go to Finance Dashboard"
//             >
//               Go to Dashboard
//             </button>
//           </div>
//         </header>

//         {/* Flash Message Display */}
//         {flashMessage && (
//           <div className={`fixed top-24 right-6 z-50 max-w-xs md:max-w-sm p-4 rounded-xl shadow-2xl flex items-start space-x-3 transform animate__animated animate__fadeInDown ${flashMessage.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'} transition-all duration-300`}
//             style={{ animationDuration: '0.5s' }}
//           >
//             <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
//             <span className="font-medium text-base leading-tight">{flashMessage.message}</span>
//             <button onClick={() => setFlashMessage(null)} className="ml-auto p-1 rounded-full hover:bg-white/20 transition-colors self-start">
//               &times;
//             </button>
//           </div>
//         )}

//         {/* --- Advanced Filtering Section --- */}
//         <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8 p-4 rounded-xl shadow-lg ${themeClasses.card} ${themeClasses.border} border`}>
//           <div>
//             <label className={`block text-sm font-medium mb-1 flex items-center ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
//               <FaCalendarAlt className="mr-2 text-blue-500" />
//               Select Year
//             </label>
//             <input
//               type="number"
//               value={filterYear}
//               onChange={(e) => { setFilterYear(e.target.value); setCurrentPage(0); }}
//               className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 text-gray-100 border-gray-700 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400'}`}
//               placeholder="Year"
//             />
//           </div>
//           <div>
//             <label className={`block text-sm font-medium mb-1 flex items-center ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
//               <FaFilter className="mr-2 text-blue-500" />
//               Select Month (optional)
//             </label>
//             <input
//               type="month"
//               value={filterMonth ? `${filterYear}-${filterMonth}` : ""}
//               onChange={(e) => { setFilterMonth(e.target.value.substring(5, 7)); setCurrentPage(0); }}
//               className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 text-gray-100 border-gray-700 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400'}`}
//               placeholder="Month"
//             />
//           </div>
//           <div>
//             <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Min Amount</label>
//             <input
//               type="number"
//               value={filterMinAmount}
//               onChange={e => { setFilterMinAmount(e.target.value); setCurrentPage(0); }}
//               className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 text-gray-100 border-gray-700 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400'}`}
//               placeholder="Min"
//             />
//           </div>
//           <div>
//             <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Max Amount</label>
//             <input
//               type="number"
//               value={filterMaxAmount}
//               onChange={e => { setFilterMaxAmount(e.target.value); setCurrentPage(0); }}
//               className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 text-gray-100 border-gray-700 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400'}`}
//               placeholder="Max"
//             />
//           </div>
//           <div className="relative" id="category-dropdown">
//             <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Categories</label>
//             <button
//               type="button"
//               className={`w-full border rounded-lg px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
//               onClick={() => setCategoryDropdownOpen((open) => !open)}
//             >
//               {filterCategories.length === 0
//                 ? "All"
//                 : filterCategories.join(", ")}
//               <span className="float-right">&#9662;</span>
//             </button>
//             {categoryDropdownOpen && (
//               <div className={`absolute z-20 mt-1 w-full rounded-lg shadow-lg border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'}`}>
//                 <div
//                   className="px-3 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer"
//                   onClick={() => {
//                     setFilterCategories([]);
//                     setCategoryDropdownOpen(false);
//                     setCurrentPage(0);
//                   }}
//                 >
//                   All
//                 </div>
//                 {categoriesList.map(cat => (
//                   <div
//                     key={cat}
//                     className={`px-3 py-2 flex items-center hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer`}
//                     onClick={() => {
//                       let newCats = filterCategories.includes(cat)
//                         ? filterCategories.filter(c => c !== cat)
//                         : [...filterCategories, cat];
//                       setFilterCategories(newCats);
//                       setCurrentPage(0);
//                     }}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={filterCategories.includes(cat)}
//                       readOnly
//                       className="mr-2"
//                     />
//                     {cat}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//           <div>
//             <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Payment Method</label>
//             <select
//               value={filterPaymentMethod}
//               onChange={e => { setFilterPaymentMethod(e.target.value); setCurrentPage(0); }}
//               className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
//             >
//               {paymentMethods.map(pm => (
//                 <option key={pm} value={pm}>{pm}</option>
//               ))}
//             </select>
//           </div>
//           <div className="flex flex-col gap-2 col-span-1 xl:col-span-1">
//             <label className="block text-sm font-medium mb-1 opacity-0 select-none">Actions</label>
//             <button
//               onClick={clearFilters}
//               className="w-full px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition"
//               type="button"
//             >
//               Clear Filters
//             </button>
//           </div>
//         </div>

//         {/* Conditional Rendering based on loading/error */}
//         {loading ? (
//           <div className="text-center text-lg py-8 flex items-center justify-center">
//             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             Loading transactions...
//           </div>
//         ) : error ? (
//           <div className="text-center text-lg py-8 text-red-500 flex items-center justify-center">
//             <AlertTriangle className="h-6 w-6 mr-2" />
//             {error}
//           </div>
//         ) : (
//           <>
//             {/* --- Charts --- */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//               <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg transition-colors duration-300`}>
//                 <h2 className="text-xl font-bold mb-4 text-center">
//                   Category Breakdown {filterMonth ? `(${filterYear}-${filterMonth})` : `(${filterYear})`}
//                 </h2>
//                 <div className="h-64">
//                   {Object.keys(totals).length > 0 ? (
//                     <Bar ref={barChartRef} data={barData} options={chartOptions} />
//                   ) : (
//                     <p className={`text-center py-4 ${themeClasses.muted}`}>No data for this filter.</p>
//                   )}
//                 </div>
//               </div>
//               <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg transition-colors duration-300`}>
//                 <h2 className="text-xl font-bold mb-4 text-center">
//                   Monthly Net Total for {filterYear}
//                 </h2>
//                 <div className="h-64">
//                   {monthlyTotals.some(val => val !== 0) ? (
//                     <Pie ref={pieChartRef} data={pieData} options={pieChartOptions} />
//                   ) : (
//                     <p className={`text-center py-4 ${themeClasses.muted}`}>No data for this filter.</p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* --- Table --- */}
//             <div className={`mt-8 p-4 sm:p-6 rounded-xl shadow-lg ${themeClasses.card} transition-colors duration-300`}>
//               <h2 className="text-2xl font-bold mb-4 text-center">
//                 Transaction Details
//               </h2>
//               <div className="overflow-x-auto shadow-lg rounded-lg border" style={{ maxHeight: "400px" }}>
//                 <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                   <thead className={themeClasses.tableHead + " sticky top-0 z-10"}>
//                     <tr>
//                       {["Date", "Description", "Category", "Type", "Amount", "Payment Method", "Counterparty"].map((heading) => (
//                         <th key={heading} className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide">
//                           {heading}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredData.length > 0 ? (
//                       filteredData.map((txn, idx) => (
//                         <tr
//                           key={txn.id}
//                           className={`${idx % 2 === 0 ? themeClasses.tableStripe : ""} ${themeClasses.tableRow} transition-colors duration-200`}
//                         >
//                           <td className={`px-4 py-3 text-center text-sm ${themeClasses.tableCell}`}>{txn.transactionDate}</td>
//                           <td className={`px-4 py-3 text-center text-sm ${themeClasses.tableCell}`}>{txn.description}</td>
//                           <td className={`px-4 py-3 text-center text-sm ${themeClasses.tableCell}`}>{txn.category}</td>
//                           <td className={`px-4 py-3 text-center text-sm`}>
//                             <span className={`px-2 py-1 rounded-full text-xs font-semibold ${txn.transactionType === "INCOME" ? themeClasses.credit : themeClasses.debit}`}>
//                               {txn.transactionType}
//                             </span>
//                           </td>
//                           <td className={`px-4 py-3 text-center text-sm font-semibold ${themeClasses.accent}`}>
//                             ₹ {txn.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                           </td>
//                           <td className={`px-4 py-3 text-center text-sm ${themeClasses.tableCell}`}>{txn.paymentMethod || "--"}</td>
//                           <td className={`px-4 py-3 text-center text-sm ${themeClasses.tableCell}`}>{txn.counterparty || "--"}</td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="7" className={`px-4 py-3 text-center text-sm ${themeClasses.muted}`}>
//                           No transactions found for the current filters.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination Controls */}
//               <div className="flex justify-center items-center mt-4 space-x-2">
//                 <button
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 0}
//                   className={`px-4 py-2 rounded-lg font-semibold transition ${currentPage === 0 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : themeClasses.button}`}
//                 >
//                   Previous
//                 </button>
//                 <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
//                   Page {currentPage + 1} of {totalPages}
//                 </span>
//                 <button
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage >= totalPages - 1}
//                   className={`px-4 py-2 rounded-lg font-semibold transition ${currentPage >= totalPages - 1 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : themeClasses.button}`}
//                 >
//                   Next
//                 </button>
//               </div>

//             </div>
//           </>
//         )}

//         {/* --- Export Buttons --- */}
//         <div className="flex flex-wrap gap-4 mb-4 mt-8 justify-center">
//           <button
//             onClick={exportToCSV}
//             className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
//           >
//             <FaFileCsv className="mr-2" />
//             Export CSV
//           </button>
//           <button
//             onClick={exportToPDF}
//             className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
//           >
//             <FaDownload className="mr-2" />
//             Export PDF
//           </button>
//           <button
//             onClick={handlePrint}
//             className="no-print inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
//           >
//             <FaDownload className="mr-2" />
//             Print Report
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Transactions;













// // import React, { useState, useEffect, useRef } from "react";
// // import { Bar, Pie } from "react-chartjs-2";
// // import {
// //   Chart as ChartJS,
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   ArcElement,
// //   Tooltip,
// //   Legend,
// // } from "chart.js";
// // import {
// //   FaCalendarAlt, FaFilter, FaDownload, FaSun, FaMoon, FaFileCsv, FaPaperclip, FaStickyNote
// // } from "react-icons/fa";
// // import "./print.css";
// // import jsPDF from "jspdf";
// // import autoTable from "jspdf-autotable";
// // import { useNavigate } from "react-router-dom";
// // import { Paperclip } from "lucide-react";

// // // Register ChartJS components
// // ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// // const paymentMethods = [
// //   "All", "Bank Transfer", "Credit Card", "Net Banking", "Cheque", "Cash", "UPI"
// // ];

// // const categoriesList = [
// //   "Salary", "Food", "Rent", "Loan", "Borrow", "Savings", "Lent"
// // ];

// // const Transactions = () => {
// //   // --- Theme ---
// //   const [theme, setTheme] = useState(() => {
// //     if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
// //       return localStorage.getItem('theme');
// //     }
// //     if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
// //       return 'dark';
// //     }
// //     return 'light';
// //   });

// //   useEffect(() => {
// //     const html = document.documentElement;
// //     if (theme === 'dark') {
// //       html.classList.add('dark');
// //     } else {
// //       html.classList.remove('dark');
// //     }
// //     localStorage.setItem('theme', theme);
// //   }, [theme]);

// //   const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

// //   // --- Transactions State ---
// //   const [transactions, setTransactions] = useState([
// //     { id: 1, transactionDate: "2025-02-01", description: "Salary for February", category: "Salary", transactionType: "Credit", amount: 50000, paymentMethod: "Bank Transfer", counterparty: "Employer Inc.", note: "", attachment: null },
// //     { id: 2, transactionDate: "2025-01-05", description: "Grocery Shopping", category: "Food", transactionType: "Debit", amount: 3000, paymentMethod: "Credit Card", counterparty: "Supermarket", note: "", attachment: null },
// //     { id: 3, transactionDate: "2025-02-05", description: "Monthly Rent", category: "Rent", transactionType: "Debit", amount: 15000, paymentMethod: "Net Banking", counterparty: "Landlord", note: "", attachment: null },
// //     { id: 4, transactionDate: "2025-03-10", description: "Loan Payment", category: "Loan", transactionType: "Debit", amount: 10000, paymentMethod: "Cheque", counterparty: "Bank", note: "", attachment: null },
// //     { id: 5, transactionDate: "2025-03-12", description: "Money Borrowed", category: "Borrow", transactionType: "Credit", amount: 5000, paymentMethod: "Cash", counterparty: "Friend", note: "", attachment: null },
// //     { id: 6, transactionDate: "2025-03-15", description: "Monthly Savings", category: "Savings", transactionType: "Credit", amount: 2000, paymentMethod: "Bank Transfer", counterparty: "Self", note: "", attachment: null },
// //     { id: 7, transactionDate: "2025-03-20", description: "Lent to Friend", category: "Lent", transactionType: "Debit", amount: 5000, paymentMethod: "Cash", counterparty: "Friend", note: "", attachment: null },
// //     { id: 8, transactionDate: "2025-03-15", description: "Another Monthly Savings", category: "Savings", transactionType: "Credit", amount: 2000, paymentMethod: "Bank Transfer", counterparty: "Self", note: "", attachment: null },
// //     { id: 9, transactionDate: "2025-03-20", description: "Another Lent to Friend", category: "Lent", transactionType: "Debit", amount: 5000, paymentMethod: "Cash", counterparty: "Friend", note: "", attachment: null },
// //   ]);

// //   // --- Filtering States ---
// //   const [filterYear, setFilterYear] = useState("2025");
// //   const [filterMonth, setFilterMonth] = useState("");
// //   const [filterMinAmount, setFilterMinAmount] = useState("");
// //   const [filterMaxAmount, setFilterMaxAmount] = useState("");
// //   const [filterCategories, setFilterCategories] = useState([]);
// //   const [filterPaymentMethod, setFilterPaymentMethod] = useState("All");

// //   // --- Modal State ---
// //   const [modalTxn, setModalTxn] = useState(null);
// //   const [modalNote, setModalNote] = useState("");
// //   const [modalAttachment, setModalAttachment] = useState(null);
// //   const [modalError, setModalError] = useState("");

// //   // --- Category Dropdown State ---
// //   const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

// //   // --- Chart refs ---
// //   const barChartRef = useRef();
// //   const pieChartRef = useRef();

// //   // --- Filtering Logic ---
// //   const filteredData = transactions.filter((txn) => {
// //     if (!txn.transactionDate) return false;
// //     const txnYear = txn.transactionDate.substring(0, 4);
// //     const txnMonth = txn.transactionDate.substring(5, 7);
// //     const matchesYear = txnYear === filterYear;
// //     const matchesMonth = filterMonth ? txnMonth === filterMonth : true;
// //     const matchesMin = filterMinAmount ? txn.amount >= Number(filterMinAmount) : true;
// //     const matchesMax = filterMaxAmount ? txn.amount <= Number(filterMaxAmount) : true;
// //     const matchesCategory = filterCategories.length > 0 ? filterCategories.includes(txn.category) : true;
// //     const matchesPayment = filterPaymentMethod === "All" ? true : txn.paymentMethod === filterPaymentMethod;
// //     return matchesYear && matchesMonth && matchesMin && matchesMax && matchesCategory && matchesPayment;
// //   });

// //   // --- Chart Data ---
// //   const getTotals = (data) => {
// //     return data.reduce((acc, txn) => {
// //       acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
// //       return acc;
// //     }, {});
// //   };

// //   const totals = getTotals(filteredData);

// //   const pastelColors = [
// //     "#60a5fa", "#f472b6", "#34d399", "#fbbf24", "#a78bfa", "#f87171", "#38bdf8",
// //     "#facc15", "#4ade80", "#c084fc", "#fb7185", "#f472b6"
// //   ];

// //   const isDark = theme === 'dark';
// //   const axisColor = isDark ? "#e5e7eb" : "#374151";
// //   const legendColor = isDark ? "#f3f4f6" : "#374151";

// //   const barData = {
// //     labels: Object.keys(totals),
// //     datasets: [
// //       {
// //         label: "Amount (₹)",
// //         data: Object.values(totals),
// //         backgroundColor: pastelColors,
// //         borderColor: 'rgba(0,0,0,0.1)',
// //         borderWidth: 1,
// //       },
// //     ],
// //   };

// //   const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
// //   const monthlyTotals = months.map((m) => {
// //     const monthData = transactions.filter(
// //       (txn) =>
// //         txn.transactionDate.substring(0, 4) === filterYear &&
// //         txn.transactionDate.substring(5, 7) === m
// //     );
// //     return monthData.reduce((sum, txn) => {
// //       return sum + (txn.transactionType === "Credit" ? txn.amount : -txn.amount);
// //     }, 0);
// //   });

// //   const pieData = {
// //     labels: months.map((m) => {
// //       const d = new Date(`${filterYear}-${m}-01`);
// //       return d.toLocaleString("default", { month: "short" });
// //     }),
// //     datasets: [
// //       {
// //         label: "Net Total (₹)",
// //         data: monthlyTotals,
// //         backgroundColor: pastelColors,
// //         borderColor: 'rgba(0,0,0,0.1)',
// //         borderWidth: 1,
// //       },
// //     ],
// //   };

// //   const chartOptions = {
// //     maintainAspectRatio: false,
// //     plugins: {
// //       legend: {
// //         display: true,
// //         position: 'bottom',
// //         labels: {
// //           color: legendColor,
// //           font: { size: 13, weight: 'bold' },
// //           boxWidth: 18,
// //           padding: 18,
// //         },
// //       },
// //       tooltip: {
// //         titleFont: { size: 14 },
// //         bodyFont: { size: 12 },
// //         backgroundColor: isDark ? '#22223b' : 'rgba(0,0,0,0.8)',
// //         titleColor: '#fff',
// //         bodyColor: '#fff',
// //       },
// //     },
// //     scales: {
// //       y: {
// //         ticks: { color: axisColor, font: { weight: 'bold' } },
// //         grid: { color: isDark ? "#334155" : "#e5e7eb" },
// //         title: {
// //           display: true,
// //           text: "Amount (₹)",
// //           color: axisColor,
// //           font: { size: 14, weight: 'bold' }
// //         }
// //       },
// //       x: {
// //         ticks: { color: axisColor, font: { weight: 'bold' } },
// //         grid: { display: false },
// //         title: {
// //           display: true,
// //           text: "Category",
// //           color: axisColor,
// //           font: { size: 14, weight: 'bold' }
// //         }
// //       },
// //     },
// //   };

// //   const pieChartOptions = {
// //     ...chartOptions,
// //     scales: {},
// //     plugins: {
// //       ...chartOptions.plugins,
// //       legend: {
// //         ...chartOptions.plugins.legend,
// //         display: true,
// //       },
// //     },
// //   };

// //   // Theme-aware classes
// //   const themeClasses = {
// //     bg: isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
// //     card: isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900',
// //     heading: isDark ? 'text-white' : 'text-blue-700',
// //     tableHead: isDark ? 'bg-teal-800 text-white' : 'bg-teal-600 text-white',
// //     tableRow: isDark ? 'hover:bg-gray-700' : 'hover:bg-blue-50',
// //     tableCell: isDark ? 'text-gray-100' : 'text-gray-900',
// //     tableStripe: isDark ? 'bg-gray-900' : 'bg-blue-50',
// //     border: isDark ? 'border-gray-700' : 'border-gray-200',
// //     muted: isDark ? 'text-gray-400' : 'text-gray-500',
// //     accent: isDark ? 'text-teal-400' : 'text-teal-600',
// //     credit: isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800',
// //     debit: isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800',
// //   };

// //   const exportToCSV = () => {
// //     const headers = ["Date", "Description", "Category", "Type", "Amount", "Payment Method", "Counterparty", "Note", "Attachment"];
// //     const rows = filteredData.map(txn =>
// //       [
// //         `="${txn.transactionDate}"`,
// //         txn.description,
// //         txn.category,
// //         txn.transactionType,
// //         txn.amount,
// //         txn.paymentMethod,
// //         txn.counterparty,
// //         txn.note || "",
// //         txn.attachment ? txn.attachment.name : ""
// //       ]
// //     );
// //     let csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
// //     const blob = new Blob([csvContent], { type: "text/csv" });
// //     const url = URL.createObjectURL(blob);
// //     const a = document.createElement("a");
// //     a.href = url;
// //     a.download = "transactions.csv";
// //     a.click();
// //     URL.revokeObjectURL(url);
// //   };

// //   // --- Print Logic: Force light theme and readable charts for print ---
// //   const handlePrint = async () => {
// //     const prevTheme = theme;
// //     setTheme('light');
// //     await new Promise(resolve => setTimeout(resolve, 200));
// //     window.print();
// //     setTheme(prevTheme);
// //   };

// //   // --- Export PDF with charts, table, and branding ---
// //   const exportToPDF = async () => {
// //     const prevTheme = theme;
// //     setTheme('light');
// //     await new Promise(resolve => setTimeout(resolve, 200));
// //     const doc = new jsPDF("p", "mm", "a4");

// //     // Branding
// //     doc.setFillColor(30, 64, 175);
// //     doc.rect(0, 0, 210, 30, "F");
// //     doc.setTextColor(255, 255, 255);
// //     doc.setFontSize(22);
// //     doc.setFont("helvetica", "bold");
// //     doc.text("Arth", 14, 16);
// //     doc.setFontSize(10);
// //     doc.setFont("helvetica", "normal");
// //     doc.text("PRODUCTIVITY", 40, 13);
// //     doc.setFontSize(9);
// //     doc.text("World's #1 Productivity Platform", 140, 10, { align: "right", maxWidth: 60 });
// //     doc.setFontSize(13);
// //     doc.setTextColor(30, 64, 175);
// //     doc.text("Revolutionize Your Productivity", 14, 36);
// //     doc.setTextColor(60, 60, 60);
// //     doc.setFontSize(10);
// //     doc.text("The ultimate ecosystem for Financial Intelligence, Task Mastery & AI-Powered Insights", 14, 42, { maxWidth: 180 });
// //     doc.setFontSize(9);
// //     doc.text("Arth is your all-in-one platform for mastering productivity, personal finance, and AI-powered insights. Built for students, professionals, and teams who want to achieve more with less effort—securely, beautifully, and intelligently.", 14, 48, { maxWidth: 180 });

// //     // CREDIT
// //     doc.setFontSize(12);
// //     doc.setFont("helvetica", "bold");
// //     doc.setTextColor(30, 64, 175);
// //     doc.text("Designed, Developed and By Ritesh Raj Tiwari", 14, 60);

// //     // Main Report Title
// //     doc.setTextColor(30, 64, 175);
// //     doc.setFontSize(16);
// //     doc.setFont("helvetica", "bold");
// //     doc.text("Transaction Analytics & Summary", 14, 70);

// //     // Bar Chart
// //     const barChart = barChartRef.current;
// //     if (barChart && barChart.toBase64Image) {
// //       const barImg = barChart.toBase64Image();
// //       doc.setFontSize(12);
// //       doc.setTextColor(30, 64, 175);
// //       doc.text("Category Breakdown", 14, 80);
// //       doc.addImage(barImg, "PNG", 14, 84, 180, 50);
// //     }

// //     // Pie Chart
// //     const pieChart = pieChartRef.current;
// //     if (pieChart && pieChart.toBase64Image) {
// //       doc.setTextColor(30, 64, 175);
// //       doc.text("Monthly Net Total", 14, 144);
// //       const pieImg = pieChart.toBase64Image();
// //       doc.addImage(pieImg, "PNG", 14, 148, 80, 50);
// //     }

// //     // Table
// //     doc.setFontSize(13);
// //     doc.setTextColor(30, 64, 175);
// //     doc.setFont("helvetica", "bold");
// //     doc.text("Transaction Details", 14, 204);

// //     const tableColumn = [
// //       "Date", "Description", "Category", "Type", "Amount", "Payment Method", "Counterparty", "Note", "Attachment"
// //     ];
// //     const tableRows = filteredData.map(txn => [
// //       txn.transactionDate,
// //       txn.description,
// //       txn.category,
// //       txn.transactionType,
// //       txn.amount,
// //       txn.paymentMethod,
// //       txn.counterparty,
// //       txn.note ? "Yes" : "",
// //       txn.attachment ? txn.attachment.name : ""
// //     ]);
// //     autoTable(doc, {
// //       head: [tableColumn],
// //       body: tableRows,
// //       startY: 210,
// //       styles: { fontSize: 9 },
// //       headStyles: { fillColor: [30, 64, 175] },
// //       margin: { left: 14, right: 14 }
// //     });

// //     doc.save("transactions.pdf");
// //     setTheme(prevTheme);
// //   };

// //   // --- Clear Filters ---
// //   const clearFilters = () => {
// //     setFilterYear("2025");
// //     setFilterMonth("");
// //     setFilterMinAmount("");
// //     setFilterMaxAmount("");
// //     setFilterCategories([]);
// //     setFilterPaymentMethod("All");
// //   };

// //   // --- Modal Handlers ---
// //   const openNoteModal = (txn) => {
// //     setModalTxn(txn);
// //     setModalNote(txn.note || "");
// //     setModalAttachment(txn.attachment || null);
// //     setModalError("");
// //   };
// //   const closeNoteModal = () => {
// //     setModalTxn(null);
// //     setModalNote("");
// //     setModalAttachment(null);
// //     setModalError("");
// //   };
// //   const saveNoteAttachment = () => {
// //     if (modalAttachment && modalAttachment.size > 5 * 1024 * 1024) {
// //       setModalError("Attachment must be less than 5MB.");
// //       return;
// //     }
// //     setTransactions((prev) =>
// //       prev.map((t) =>
// //         t.id === modalTxn.id
// //           ? { ...t, note: modalNote, attachment: modalAttachment }
// //           : t
// //       )
// //     );
// //     closeNoteModal();
// //   };

// //   // --- Category Dropdown: Close on outside click ---
// //   useEffect(() => {
// //     if (!categoryDropdownOpen) return;
// //     const handleClick = (e) => {
// //       if (!e.target.closest("#category-dropdown")) setCategoryDropdownOpen(false);
// //     };
// //     document.addEventListener("mousedown", handleClick);
// //     return () => document.removeEventListener("mousedown", handleClick);
// //   }, [categoryDropdownOpen]);

// //   const navigate = useNavigate();

// //   return (
// //     <div className={`min-h-screen ${themeClasses.bg} flex flex-col transition-colors duration-300`}>
// //       <main className="container mx-auto py-6 px-2 sm:px-4 flex-grow">
// //         <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
// //           <h1 className={`text-3xl sm:text-4xl font-extrabold ${themeClasses.heading} transition-colors duration-300 text-center md:text-left`}>
// //             Transaction Analytics & Summary
// //           </h1>
// //           <div className="flex gap-2">
// //             <button
// //               onClick={toggleTheme}
// //               className="no-print p-3 rounded-full shadow-md bg-white dark:bg-gray-700 text-gray-800 hover:scale-105 transition-transform duration-200"
// //               aria-label="Toggle theme"
// //             >
// //               {theme === 'dark' ? (
// //                 <FaSun className="text-yellow-400 text-xl" />
// //               ) : (
// //                 <FaMoon className="text-indigo-600 text-xl" />
// //               )}
// //             </button>
// //             <button
// //               onClick={() => navigate("/finance/dashboard")}
// //               className="no-print ml-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow transition"
// //               title="Go to Finance Dashboard"
// //             >
// //               Go to Dashboard
// //             </button>
// //           </div>
// //         </header>

// //         {/* --- Advanced Filtering Section --- */}
// //         <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8 p-4 rounded-xl shadow-lg ${themeClasses.card} ${themeClasses.border} border`}>
// //           <div>
// //             <label className={`block text-sm font-medium mb-1 flex items-center ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
// //               <FaCalendarAlt className="mr-2 text-blue-500" />
// //               Select Year
// //             </label>
// //             <input
// //               type="number"
// //               value={filterYear}
// //               onChange={(e) => setFilterYear(e.target.value)}
// //               className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 text-gray-100 border-gray-700 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400'}`}
// //               placeholder="Year"
// //             />
// //           </div>
// //           <div>
// //             <label className={`block text-sm font-medium mb-1 flex items-center ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
// //               <FaFilter className="mr-2 text-blue-500" />
// //               Select Month (optional)
// //             </label>
// //             <input
// //               type="month"
// //               value={filterMonth ? `${filterYear}-${filterMonth}` : ""}
// //               onChange={(e) => setFilterMonth(e.target.value.substring(5, 7))}
// //               className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 text-gray-100 border-gray-700 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400'}`}
// //               placeholder="Month"
// //             />
// //           </div>
// //           <div>
// //             <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Min Amount</label>
// //             <input
// //               type="number"
// //               value={filterMinAmount}
// //               onChange={e => setFilterMinAmount(e.target.value)}
// //               className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 text-gray-100 border-gray-700 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400'}`}
// //               placeholder="Min"
// //             />
// //           </div>
// //           <div>
// //             <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Max Amount</label>
// //             <input
// //               type="number"
// //               value={filterMaxAmount}
// //               onChange={e => setFilterMaxAmount(e.target.value)}
// //               className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 text-gray-100 border-gray-700 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400'}`}
// //               placeholder="Max"
// //             />
// //           </div>
// //           <div className="relative" id="category-dropdown">
// //             <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Categories</label>
// //             <button
// //               type="button"
// //               className={`w-full border rounded-lg px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
// //               onClick={() => setCategoryDropdownOpen((open) => !open)}
// //             >
// //               {filterCategories.length === 0
// //                 ? "All"
// //                 : filterCategories.join(", ")}
// //               <span className="float-right">&#9662;</span>
// //             </button>
// //             {categoryDropdownOpen && (
// //               <div className={`absolute z-20 mt-1 w-full rounded-lg shadow-lg border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'}`}>
// //                 <div
// //                   className="px-3 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer"
// //                   onClick={() => {
// //                     setFilterCategories([]);
// //                     setCategoryDropdownOpen(false);
// //                   }}
// //                 >
// //                   All
// //                 </div>
// //                 {categoriesList.map(cat => (
// //                   <div
// //                     key={cat}
// //                     className={`px-3 py-2 flex items-center hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer`}
// //                     onClick={() => {
// //                       let newCats = filterCategories.includes(cat)
// //                         ? filterCategories.filter(c => c !== cat)
// //                         : [...filterCategories, cat];
// //                       setFilterCategories(newCats);
// //                     }}
// //                   >
// //                     <input
// //                       type="checkbox"
// //                       checked={filterCategories.includes(cat)}
// //                       readOnly
// //                       className="mr-2"
// //                     />
// //                     {cat}
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //           <div>
// //             <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Payment Method</label>
// //             <select
// //               value={filterPaymentMethod}
// //               onChange={e => setFilterPaymentMethod(e.target.value)}
// //               className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
// //             >
// //               {paymentMethods.map(pm => (
// //                 <option key={pm} value={pm}>{pm}</option>
// //               ))}
// //             </select>
// //           </div>
// //           <div className="flex flex-col gap-2 col-span-1 xl:col-span-1">
// //             <label className="block text-sm font-medium mb-1 opacity-0 select-none">Actions</label>
// //             <button
// //               onClick={clearFilters}
// //               className="w-full px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition"
// //               type="button"
// //             >
// //               Clear Filters
// //             </button>
// //           </div>
// //         </div>

// //         {/* --- Charts --- */}
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
// //           <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg transition-colors duration-300`}>
// //             <h2 className="text-xl font-bold mb-4 text-center">
// //               Category Breakdown {filterMonth ? `(${filterYear}-${filterMonth})` : `(${filterYear})`}
// //             </h2>
// //             <div className="h-64">
// //               <Bar ref={barChartRef} data={barData} options={chartOptions} />
// //             </div>
// //           </div>
// //           <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg transition-colors duration-300`}>
// //             <h2 className="text-xl font-bold mb-4 text-center">
// //               Monthly Net Total for {filterYear}
// //             </h2>
// //             <div className="h-64">
// //               <Pie ref={pieChartRef} data={pieData} options={pieChartOptions} />
// //             </div>
// //           </div>
// //         </div>

// //         {/* --- Table --- */}
// //         <div className={`mt-8 p-4 sm:p-6 rounded-xl shadow-lg ${themeClasses.card} transition-colors duration-300`}>
// //           <h2 className="text-2xl font-bold mb-4 text-center">
// //             Transaction Details
// //           </h2>
// //           <div className="overflow-x-auto shadow-lg rounded-lg border" style={{ maxHeight: "400px" }}>
// //             <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
// //               <thead className={themeClasses.tableHead + " sticky top-0 z-10"}>
// //                 <tr>
// //                   {["Date", "Description", "Category", "Type", "Amount", "Payment Method", "Counterparty", "Note/Attachment", ""].map((heading) => (
// //                     <th key={heading} className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide">
// //                       {heading}
// //                     </th>
// //                   ))}
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {filteredData.length > 0 ? (
// //                   filteredData.map((txn, idx) => (
// //                     <tr
// //                       key={txn.id}
// //                       className={`${idx % 2 === 0 ? themeClasses.tableStripe : ""} ${themeClasses.tableRow} transition-colors duration-200`}
// //                     >
// //                       <td className={`px-4 py-3 text-center text-sm ${themeClasses.tableCell}`}>{txn.transactionDate}</td>
// //                       <td className={`px-4 py-3 text-center text-sm ${themeClasses.tableCell}`}>{txn.description}</td>
// //                       <td className={`px-4 py-3 text-center text-sm ${themeClasses.tableCell}`}>{txn.category}</td>
// //                       <td className={`px-4 py-3 text-center text-sm`}>
// //                         <span className={`px-2 py-1 rounded-full text-xs font-semibold ${txn.transactionType === "Credit" ? themeClasses.credit : themeClasses.debit}`}>
// //                           {txn.transactionType}
// //                         </span>
// //                       </td>
// //                       <td className={`px-4 py-3 text-center text-sm font-semibold ${themeClasses.accent}`}>
// //                         ₹ {txn.amount?.toLocaleString()}
// //                       </td>
// //                       <td className={`px-4 py-3 text-center text-sm ${themeClasses.tableCell}`}>{txn.paymentMethod || "--"}</td>
// //                       <td className={`px-4 py-3 text-center text-sm ${themeClasses.tableCell}`}>{txn.counterparty || "--"}</td>
// //                       <td className="px-4 py-3 text-center text-sm">
// //                         {txn.note && (
// //                           <span title="Note exists" className="inline-block mr-1 align-middle">
// //                             <FaStickyNote className="inline text-yellow-500" />
// //                           </span>
// //                         )}
// //                         {txn.attachment && (
// //                           <a
// //                             href={URL.createObjectURL(txn.attachment)}
// //                             download={txn.attachment.name}
// //                             title="Download attachment"
// //                             className="inline-block align-middle"
// //                           >
// //                             <FaPaperclip className="inline text-blue-500" />
// //                           </a>
// //                         )}
// //                       </td>
// //                       <td className="px-4 py-3 text-center text-sm">
// //                         <button
// //                           className="inline-flex items-center px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold"
// //                           onClick={() => openNoteModal(txn)}
// //                           title="Add/View Note or Attachment"
// //                         >
// //                           <FaStickyNote className="mr-1" /> Note/Attachment
// //                         </button>
// //                       </td>
// //                     </tr>
// //                   ))
// //                 ) : (
// //                   <tr>
// //                     <td colSpan="9" className={`px-4 py-3 text-center text-sm ${themeClasses.muted}`}>
// //                       No transactions found.
// //                     </td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>

// //         {/* --- Export Buttons --- */}
// //         <div className="flex flex-wrap gap-4 mb-4 mt-8 justify-center">
// //           <button
// //             onClick={exportToCSV}
// //             className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
// //           >
// //             <FaFileCsv className="mr-2" />
// //             Export CSV
// //           </button>
// //           <button
// //             onClick={exportToPDF}
// //             className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
// //           >
// //             <FaDownload className="mr-2" />
// //             Export PDF
// //           </button>
// //           <button
// //             onClick={handlePrint}
// //             className="no-print inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
// //           >
// //             <FaDownload className="mr-2" />
// //             Print Report
// //           </button>
// //         </div>
// //       </main>

// //       {/* --- Note/Attachment Modal --- */}
// //       {modalTxn && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
// //           <div className={`rounded-xl shadow-2xl p-8 max-w-md w-full ${themeClasses.card} border ${themeClasses.border}`}>
// //             <h3 className="text-xl font-bold mb-4">Note & Attachment</h3>
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium mb-1">Note</label>
// //               <textarea
// //                 value={modalNote}
// //                 onChange={e => setModalNote(e.target.value)}
// //                 rows={3}
// //                 className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
// //                 placeholder="Add a note for this transaction"
// //               />
// //             </div>
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium mb-1">Attachment (optional, max 5MB)</label>
// //               <input
// //                 type="file"
// //                 accept="image/*,application/pdf"
// //                 onChange={e => {
// //                   const file = e.target.files[0];
// //                   if (file && file.size > 5 * 1024 * 1024) {
// //                     setModalError("Attachment must be less than 5MB.");
// //                   } else {
// //                     setModalAttachment(file);
// //                     setModalError("");
// //                   }
// //                 }}
// //                 className="block w-full text-sm"
// //               />
// //               {modalAttachment && (
// //                 <div className="mt-2 text-xs text-blue-600">
// //                   {modalAttachment.name}
// //                 </div>
// //               )}
// //               {modalError && (
// //                 <div className="mt-2 text-xs text-red-600">
// //                   {modalError}
// //                 </div>
// //               )}
// //             </div>
// //             <div className="flex justify-end gap-2">
// //               <button
// //                 className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold"
// //                 onClick={closeNoteModal}
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
// //                 onClick={saveNoteAttachment}
// //                 disabled={!!modalError}
// //               >
// //                 Save
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Transactions;

