import React, { useState, useEffect, useRef } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FaCalendarAlt, FaFilter, FaDownload, FaSun, FaMoon, FaFileCsv, FaPaperclip, FaStickyNote
} from "react-icons/fa";
import "./print.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const paymentMethods = [
  "All", "Bank Transfer", "Credit Card", "Net Banking", "Cheque", "Cash", "UPI"
];

const categoriesList = [
  "Salary", "Food", "Rent", "Loan", "Borrow", "Savings", "Lent"
];

const Transactions = () => {
  // --- Theme ---
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  // --- Transactions State ---
  const [transactions, setTransactions] = useState([
    { id: 1, transactionDate: "2025-02-01", description: "Salary for February", category: "Salary", transactionType: "Credit", amount: 50000, paymentMethod: "Bank Transfer", counterparty: "Employer Inc.", note: "", attachment: null },
    { id: 2, transactionDate: "2025-01-05", description: "Grocery Shopping", category: "Food", transactionType: "Debit", amount: 3000, paymentMethod: "Credit Card", counterparty: "Supermarket", note: "", attachment: null },
    { id: 3, transactionDate: "2025-02-05", description: "Monthly Rent", category: "Rent", transactionType: "Debit", amount: 15000, paymentMethod: "Net Banking", counterparty: "Landlord", note: "", attachment: null },
    { id: 4, transactionDate: "2025-03-10", description: "Loan Payment", category: "Loan", transactionType: "Debit", amount: 10000, paymentMethod: "Cheque", counterparty: "Bank", note: "", attachment: null },
    { id: 5, transactionDate: "2025-03-12", description: "Money Borrowed", category: "Borrow", transactionType: "Credit", amount: 5000, paymentMethod: "Cash", counterparty: "Friend", note: "", attachment: null },
    { id: 6, transactionDate: "2025-03-15", description: "Monthly Savings", category: "Savings", transactionType: "Credit", amount: 2000, paymentMethod: "Bank Transfer", counterparty: "Self", note: "", attachment: null },
    { id: 7, transactionDate: "2025-03-20", description: "Lent to Friend", category: "Lent", transactionType: "Debit", amount: 5000, paymentMethod: "Cash", counterparty: "Friend", note: "", attachment: null },
    { id: 8, transactionDate: "2025-03-15", description: "Another Monthly Savings", category: "Savings", transactionType: "Credit", amount: 2000, paymentMethod: "Bank Transfer", counterparty: "Self", note: "", attachment: null },
    { id: 9, transactionDate: "2025-03-20", description: "Another Lent to Friend", category: "Lent", transactionType: "Debit", amount: 5000, paymentMethod: "Cash", counterparty: "Friend", note: "", attachment: null },
  ]);

  // --- Filtering States ---
  const [filterYear, setFilterYear] = useState("2025");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterMinAmount, setFilterMinAmount] = useState("");
  const [filterMaxAmount, setFilterMaxAmount] = useState("");
  const [filterCategories, setFilterCategories] = useState([]);
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("All");

  // --- Modal State ---
  const [modalTxn, setModalTxn] = useState(null);
  const [modalNote, setModalNote] = useState("");
  const [modalAttachment, setModalAttachment] = useState(null);
  const [modalError, setModalError] = useState("");

  // --- Category Dropdown State ---
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // --- Chart refs ---
  const barChartRef = useRef();
  const pieChartRef = useRef();

  // --- Filtering Logic ---
  const filteredData = transactions.filter((txn) => {
    if (!txn.transactionDate) return false;
    const txnYear = txn.transactionDate.substring(0, 4);
    const txnMonth = txn.transactionDate.substring(5, 7);
    const matchesYear = txnYear === filterYear;
    const matchesMonth = filterMonth ? txnMonth === filterMonth : true;
    const matchesMin = filterMinAmount ? txn.amount >= Number(filterMinAmount) : true;
    const matchesMax = filterMaxAmount ? txn.amount <= Number(filterMaxAmount) : true;
    const matchesCategory = filterCategories.length > 0 ? filterCategories.includes(txn.category) : true;
    const matchesPayment = filterPaymentMethod === "All" ? true : txn.paymentMethod === filterPaymentMethod;
    return matchesYear && matchesMonth && matchesMin && matchesMax && matchesCategory && matchesPayment;
  });

  // --- Chart Data ---
  const getTotals = (data) => {
    return data.reduce((acc, txn) => {
      acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
      return acc;
    }, {});
  };

  const totals = getTotals(filteredData);

  const pastelColors = [
    "#60a5fa", "#f472b6", "#34d399", "#fbbf24", "#a78bfa", "#f87171", "#38bdf8",
    "#facc15", "#4ade80", "#c084fc", "#fb7185", "#f472b6"
  ];

  const isDark = theme === 'dark';
  const axisColor = isDark ? "#e5e7eb" : "#374151";
  const legendColor = isDark ? "#f3f4f6" : "#374151";

  const barData = {
    labels: Object.keys(totals),
    datasets: [
      {
        label: "Amount (₹)",
        data: Object.values(totals),
        backgroundColor: pastelColors,
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
      },
    ],
  };

  const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const monthlyTotals = months.map((m) => {
    const monthData = transactions.filter(
      (txn) =>
        txn.transactionDate.substring(0, 4) === filterYear &&
        txn.transactionDate.substring(5, 7) === m
    );
    return monthData.reduce((sum, txn) => {
      return sum + (txn.transactionType === "Credit" ? txn.amount : -txn.amount);
    }, 0);
  });

  const pieData = {
    labels: months.map((m) => {
      const d = new Date(`${filterYear}-${m}-01`);
      return d.toLocaleString("default", { month: "short" });
    }),
    datasets: [
      {
        label: "Net Total (₹)",
        data: monthlyTotals,
        backgroundColor: pastelColors,
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: legendColor,
          font: { size: 13, weight: 'bold' },
          boxWidth: 18,
          padding: 18,
        },
      },
      tooltip: {
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        backgroundColor: isDark ? '#22223b' : 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    scales: {
      y: {
        ticks: { color: axisColor, font: { weight: 'bold' } },
        grid: { color: isDark ? "#334155" : "#e5e7eb" },
        title: {
          display: true,
          text: "Amount (₹)",
          color: axisColor,
          font: { size: 14, weight: 'bold' }
        }
      },
      x: {
        ticks: { color: axisColor, font: { weight: 'bold' } },
        grid: { display: false },
        title: {
          display: true,
          text: "Category",
          color: axisColor,
          font: { size: 14, weight: 'bold' }
        }
      },
    },
  };

  const pieChartOptions = {
    ...chartOptions,
    scales: {},
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        display: true,
      },
    },
  };

  // Theme-aware classes
  const themeClasses = {
    bg: isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
    card: isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900',
    heading: isDark ? 'text-white' : 'text-blue-700',
    tableHead: isDark ? 'bg-teal-800 text-white' : 'bg-teal-600 text-white',
    tableRow: isDark ? 'hover:bg-gray-700' : 'hover:bg-blue-50',
    tableCell: isDark ? 'text-gray-100' : 'text-gray-900',
    tableStripe: isDark ? 'bg-gray-900' : 'bg-blue-50',
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    muted: isDark ? 'text-gray-400' : 'text-gray-500',
    accent: isDark ? 'text-teal-400' : 'text-teal-600',
    credit: isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800',
    debit: isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800',
  };

  const exportToCSV = () => {
    const headers = ["Date", "Description", "Category", "Type", "Amount", "Payment Method", "Counterparty", "Note", "Attachment"];
    const rows = filteredData.map(txn =>
      [
        `="${txn.transactionDate}"`,
        txn.description,
        txn.category,
        txn.transactionType,
        txn.amount,
        txn.paymentMethod,
        txn.counterparty,
        txn.note || "",
        txn.attachment ? txn.attachment.name : ""
      ]
    );
    let csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Print Logic: Force light theme and readable charts for print ---
  const handlePrint = async () => {
    const prevTheme = theme;
    setTheme('light');
    await new Promise(resolve => setTimeout(resolve, 200));
    window.print();
    setTheme(prevTheme);
  };

  // --- Export PDF with charts, table, and branding ---
  const exportToPDF = async () => {
    const prevTheme = theme;
    setTheme('light');
    await new Promise(resolve => setTimeout(resolve, 200));
    const doc = new jsPDF("p", "mm", "a4");

    // Branding
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
    doc.text("Designed, Developed and By Ritesh Raj Tiwari", 14, 60);

    // Main Report Title
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Transaction Analytics & Summary", 14, 70);

    // Bar Chart
    const barChart = barChartRef.current;
    if (barChart && barChart.toBase64Image) {
      const barImg = barChart.toBase64Image();
      doc.setFontSize(12);
      doc.setTextColor(30, 64, 175);
      doc.text("Category Breakdown", 14, 80);
      doc.addImage(barImg, "PNG", 14, 84, 180, 50);
    }

    // Pie Chart
    const pieChart = pieChartRef.current;
    if (pieChart && pieChart.toBase64Image) {
      doc.setTextColor(30, 64, 175);
      doc.text("Monthly Net Total", 14, 144);
      const pieImg = pieChart.toBase64Image();
      doc.addImage(pieImg, "PNG", 14, 148, 80, 50);
    }

    // Table
    doc.setFontSize(13);
    doc.setTextColor(30, 64, 175);
    doc.setFont("helvetica", "bold");
    doc.text("Transaction Details", 14, 204);

    const tableColumn = [
      "Date", "Description", "Category", "Type", "Amount", "Payment Method", "Counterparty", "Note", "Attachment"
    ];
    const tableRows = filteredData.map(txn => [
      txn.transactionDate,
      txn.description,
      txn.category,
      txn.transactionType,
      txn.amount,
      txn.paymentMethod,
      txn.counterparty,
      txn.note ? "Yes" : "",
      txn.attachment ? txn.attachment.name : ""
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 210,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [30, 64, 175] },
      margin: { left: 14, right: 14 }
    });

    doc.save("transactions.pdf");
    setTheme(prevTheme);
  };

  // --- Clear Filters ---
  const clearFilters = () => {
    setFilterYear("2025");
    setFilterMonth("");
    setFilterMinAmount("");
    setFilterMaxAmount("");
    setFilterCategories([]);
    setFilterPaymentMethod("All");
  };

  // --- Modal Handlers ---
  const openNoteModal = (txn) => {
    setModalTxn(txn);
    setModalNote(txn.note || "");
    setModalAttachment(txn.attachment || null);
    setModalError("");
  };
  const closeNoteModal = () => {
    setModalTxn(null);
    setModalNote("");
    setModalAttachment(null);
    setModalError("");
  };
  const saveNoteAttachment = () => {
    if (modalAttachment && modalAttachment.size > 5 * 1024 * 1024) {
      setModalError("Attachment must be less than 5MB.");
      return;
    }
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === modalTxn.id
          ? { ...t, note: modalNote, attachment: modalAttachment }
          : t
      )
    );
    closeNoteModal();
  };

  // --- Category Dropdown: Close on outside click ---
  useEffect(() => {
    if (!categoryDropdownOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest("#category-dropdown")) setCategoryDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [categoryDropdownOpen]);

  const navigate = useNavigate();

  return (
    <div className={`min-h-screen ${themeClasses.bg} flex flex-col transition-colors duration-300`}>
      <main className="container mx-auto py-6 px-2 sm:px-4 flex-grow">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className={`text-3xl sm:text-4xl font-extrabold ${themeClasses.heading} transition-colors duration-300 text-center md:text-left`}>
            Transaction Analytics & Summary
          </h1>
          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className="no-print p-3 rounded-full shadow-md bg-white dark:bg-gray-700 text-gray-800 hover:scale-105 transition-transform duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <FaSun className="text-yellow-400 text-xl" />
              ) : (
                <FaMoon className="text-indigo-600 text-xl" />
              )}
            </button>
            <button
              onClick={() => navigate("/finance/dashboard")}
              className="no-print ml-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow transition"
              title="Go to Finance Dashboard"
            >
              Go to Dashboard
            </button>
          </div>
        </header>

        {/* --- Advanced Filtering Section --- */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8 p-4 rounded-xl shadow-lg ${themeClasses.card} ${themeClasses.border} border`}>
          <div>
            <label className={`block text-sm font-medium mb-1 flex items-center ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              <FaCalendarAlt className="mr-2 text-blue-500" />
              Select Year
            </label>
            <input
              type="number"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 text-gray-100 border-gray-700 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400'}`}
              placeholder="Year"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 flex items-center ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              <FaFilter className="mr-2 text-blue-500" />
              Select Month (optional)
            </label>
            <input
              type="month"
              value={filterMonth ? `${filterYear}-${filterMonth}` : ""}
              onChange={(e) => setFilterMonth(e.target.value.substring(5, 7))}
              className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 text-gray-100 border-gray-700 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400'}`}
              placeholder="Month"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Min Amount</label>
            <input
              type="number"
              value={filterMinAmount}
              onChange={e => setFilterMinAmount(e.target.value)}
              className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 text-gray-100 border-gray-700 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400'}`}
              placeholder="Min"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Max Amount</label>
            <input
              type="number"
              value={filterMaxAmount}
              onChange={e => setFilterMaxAmount(e.target.value)}
              className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 text-gray-100 border-gray-700 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400'}`}
              placeholder="Max"
            />
          </div>
          <div className="relative" id="category-dropdown">
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Categories</label>
            <button
              type="button"
              className={`w-full border rounded-lg px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
              onClick={() => setCategoryDropdownOpen((open) => !open)}
            >
              {filterCategories.length === 0
                ? "All"
                : filterCategories.join(", ")}
              <span className="float-right">&#9662;</span>
            </button>
            {categoryDropdownOpen && (
              <div className={`absolute z-20 mt-1 w-full rounded-lg shadow-lg border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'}`}>
                <div
                  className="px-3 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    setFilterCategories([]);
                    setCategoryDropdownOpen(false);
                  }}
                >
                  All
                </div>
                {categoriesList.map(cat => (
                  <div
                    key={cat}
                    className={`px-3 py-2 flex items-center hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer`}
                    onClick={() => {
                      let newCats = filterCategories.includes(cat)
                        ? filterCategories.filter(c => c !== cat)
                        : [...filterCategories, cat];
                      setFilterCategories(newCats);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={filterCategories.includes(cat)}
                      readOnly
                      className="mr-2"
                    />
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Payment Method</label>
            <select
              value={filterPaymentMethod}
              onChange={e => setFilterPaymentMethod(e.target.value)}
              className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
            >
              {paymentMethods.map(pm => (
                <option key={pm} value={pm}>{pm}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 col-span-1 xl:col-span-1">
            <label className="block text-sm font-medium mb-1 opacity-0 select-none">Actions</label>
            <button
              onClick={clearFilters}
              className="w-full px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition"
              type="button"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* --- Charts --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg transition-colors duration-300`}>
            <h2 className="text-xl font-bold mb-4 text-center">
              Category Breakdown {filterMonth ? `(${filterYear}-${filterMonth})` : `(${filterYear})`}
            </h2>
            <div className="h-64">
              <Bar ref={barChartRef} data={barData} options={chartOptions} />
            </div>
          </div>
          <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg transition-colors duration-300`}>
            <h2 className="text-xl font-bold mb-4 text-center">
              Monthly Net Total for {filterYear}
            </h2>
            <div className="h-64">
              <Pie ref={pieChartRef} data={pieData} options={pieChartOptions} />
            </div>
          </div>
        </div>

        {/* --- Table --- */}
        <div className={`mt-8 p-4 sm:p-6 rounded-xl shadow-lg ${themeClasses.card} transition-colors duration-300`}>
          <h2 className="text-2xl font-bold mb-4 text-center">
            Transaction Details
          </h2>
          <div className="overflow-x-auto shadow-lg rounded-lg border" style={{ maxHeight: "400px" }}>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={themeClasses.tableHead + " sticky top-0 z-10"}>
                <tr>
                  {["Date", "Description", "Category", "Type", "Amount", "Payment Method", "Counterparty", "Note/Attachment", ""].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((txn, idx) => (
                    <tr
                      key={txn.id}
                      className={`${idx % 2 === 0 ? themeClasses.tableStripe : ""} ${themeClasses.tableRow} transition-colors duration-200`}
                    >
                      <td className={`px-4 py-3 text-center text-sm ${themeClasses.tableCell}`}>{txn.transactionDate}</td>
                      <td className={`px-4 py-3 text-center text-sm ${themeClasses.tableCell}`}>{txn.description}</td>
                      <td className={`px-4 py-3 text-center text-sm ${themeClasses.tableCell}`}>{txn.category}</td>
                      <td className={`px-4 py-3 text-center text-sm`}>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${txn.transactionType === "Credit" ? themeClasses.credit : themeClasses.debit}`}>
                          {txn.transactionType}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-center text-sm font-semibold ${themeClasses.accent}`}>
                        ₹ {txn.amount?.toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 text-center text-sm ${themeClasses.tableCell}`}>{txn.paymentMethod || "--"}</td>
                      <td className={`px-4 py-3 text-center text-sm ${themeClasses.tableCell}`}>{txn.counterparty || "--"}</td>
                      <td className="px-4 py-3 text-center text-sm">
                        {txn.note && (
                          <span title="Note exists" className="inline-block mr-1 align-middle">
                            <FaStickyNote className="inline text-yellow-500" />
                          </span>
                        )}
                        {txn.attachment && (
                          <a
                            href={URL.createObjectURL(txn.attachment)}
                            download={txn.attachment.name}
                            title="Download attachment"
                            className="inline-block align-middle"
                          >
                            <FaPaperclip className="inline text-blue-500" />
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        <button
                          className="inline-flex items-center px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold"
                          onClick={() => openNoteModal(txn)}
                          title="Add/View Note or Attachment"
                        >
                          <FaStickyNote className="mr-1" /> Note/Attachment
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className={`px-4 py-3 text-center text-sm ${themeClasses.muted}`}>
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- Export Buttons --- */}
        <div className="flex flex-wrap gap-4 mb-4 mt-8 justify-center">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
          >
            <FaFileCsv className="mr-2" />
            Export CSV
          </button>
          <button
            onClick={exportToPDF}
            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
          >
            <FaDownload className="mr-2" />
            Export PDF
          </button>
          <button
            onClick={handlePrint}
            className="no-print inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
          >
            <FaDownload className="mr-2" />
            Print Report
          </button>
        </div>
      </main>

      {/* --- Note/Attachment Modal --- */}
      {modalTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className={`rounded-xl shadow-2xl p-8 max-w-md w-full ${themeClasses.card} border ${themeClasses.border}`}>
            <h3 className="text-xl font-bold mb-4">Note & Attachment</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Note</label>
              <textarea
                value={modalNote}
                onChange={e => setModalNote(e.target.value)}
                rows={3}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
                placeholder="Add a note for this transaction"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Attachment (optional, max 5MB)</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={e => {
                  const file = e.target.files[0];
                  if (file && file.size > 5 * 1024 * 1024) {
                    setModalError("Attachment must be less than 5MB.");
                  } else {
                    setModalAttachment(file);
                    setModalError("");
                  }
                }}
                className="block w-full text-sm"
              />
              {modalAttachment && (
                <div className="mt-2 text-xs text-blue-600">
                  {modalAttachment.name}
                </div>
              )}
              {modalError && (
                <div className="mt-2 text-xs text-red-600">
                  {modalError}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold"
                onClick={closeNoteModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                onClick={saveNoteAttachment}
                disabled={!!modalError}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;

