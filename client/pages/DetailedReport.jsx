import React, { useState, useEffect } from "react";
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
import { FaCalendarAlt, FaFilter, FaDownload } from "react-icons/fa";
import "./print.css"; // ← import our print-specific overrides

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const DetailedReport = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, transactionDate: "2025-02-01", description: "Salary for February", category: "Salary", transactionType: "Credit", amount: 50000, paymentMethod: "Bank Transfer", counterparty: "Employer Inc." },
    { id: 2, transactionDate: "2025-01-05", description: "Grocery Shopping", category: "Food", transactionType: "Debit", amount: 3000, paymentMethod: "Credit Card", counterparty: "Supermarket" },
    { id: 3, transactionDate: "2025-02-05", description: "Monthly Rent", category: "Rent", transactionType: "Debit", amount: 15000, paymentMethod: "Net Banking", counterparty: "Landlord" },
    { id: 4, transactionDate: "2025-03-10", description: "Loan Payment", category: "Loan", transactionType: "Debit", amount: 10000, paymentMethod: "Cheque", counterparty: "Bank" },
    { id: 5, transactionDate: "2025-03-12", description: "Money Borrowed", category: "Borrow", transactionType: "Credit", amount: 5000, paymentMethod: "Cash", counterparty: "Friend" },
    { id: 6, transactionDate: "2025-03-15", description: "Monthly Savings", category: "Savings", transactionType: "Credit", amount: 2000, paymentMethod: "Bank Transfer", counterparty: "Self" },
    { id: 7, transactionDate: "2025-03-20", description: "Lent to Friend", category: "Lent", transactionType: "Debit", amount: 5000, paymentMethod: "Cash", counterparty: "Friend" },
  ]);

  const [filterYear, setFilterYear] = useState("2025");
  const [filterMonth, setFilterMonth] = useState("");

  // Filter transactions by year and optional month
  const filteredData = transactions.filter((txn) => {
    const txnYear = txn.transactionDate.substring(0, 4);
    const txnMonth = txn.transactionDate.substring(5, 7);
    if (filterMonth) {
      return txnYear === filterYear && txnMonth === filterMonth;
    }
    return txnYear === filterYear;
  });

  // Calculate totals by category for filtered data
  const getTotals = (data) => {
    return data.reduce((acc, txn) => {
      acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
      return acc;
    }, {});
  };

  const totals = getTotals(filteredData);

  // Bar chart data
  const barData = {
    labels: Object.keys(totals),
    datasets: [
      {
        label: "Amount (₹)",
        data: Object.values(totals),
        backgroundColor: [
          "#4CAF50",
          "#F44336",
          "#FF9800",
          "#2196F3",
          "#9C27B0",
          "#795548",
          "#00BCD4",
        ],
      },
    ],
  };

  // Pie chart: monthly net totals for the year
  const months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
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
        backgroundColor: months.map(
          (m) => `hsl(${(parseInt(m) * 30) % 360}, 70%, 50%)`
        ),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="container mx-auto py-8 px-4 flex-grow">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Detailed Transaction Report
        </h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-500" />
              Select Year
            </label>
            <input
              type="number"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FaFilter className="mr-2 text-blue-500" />
              Select Month (optional)
            </label>
            <input
              type="month"
              value={filterMonth ? `${filterYear}-${filterMonth}` : ""}
              onChange={(e) => setFilterMonth(e.target.value.substring(5, 7))}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full md:w-1/4 flex justify-center md:justify-end">
            <button
              onClick={() => window.print()}
              className="no-print inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
            >
              <FaDownload className="mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Category Breakdown{" "}
              {filterMonth ? `(${filterYear}-${filterMonth})` : `(${filterYear})`}
            </h2>
            <div className="h-64">
              <Bar
                data={barData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: { titleFont: { size: 14 }, bodyFont: { size: 12 } },
                  },
                  scales: {
                    y: { ticks: { color: "#4A5568" }, grid: { color: "#E2E8F0" } },
                    x: { ticks: { color: "#4A5568" }, grid: { display: false } },
                  },
                }}
              />
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Monthly Net Total for {filterYear}
            </h2>
            <div className="h-64">
              <Pie
                data={pieData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: { color: "#4A5568", font: { size: 12 } },
                    },
                    tooltip: { titleFont: { size: 14 }, bodyFont: { size: 12 } },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Transaction Details Table */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Transaction Details
          </h2>
          <div
            className="overflow-x-auto shadow-lg rounded-lg"
            style={{ maxHeight: "400px" }}
          >
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead className="bg-teal-600 sticky top-0 z-10">
                <tr>
                  {[
                    "Date",
                    "Description",
                    "Category",
                    "Type",
                    "Amount",
                    "Payment Method",
                    "Counterparty",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-center text-white text-sm font-semibold uppercase tracking-wide"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-gray-100 divide-y divide-gray-300">
                {filteredData.length > 0 ? (
                  filteredData.map((txn) => (
                    <tr key={txn.id} className="hover:bg-gray-200">
                      <td className="px-4 py-3 text-center text-sm text-gray-800">
                        {txn.transactionDate}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-800">
                        {txn.description}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-800">
                        {txn.category}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-800">
                        {txn.transactionType}
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-semibold text-teal-600">
                        ₹ {txn.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-800">
                        {txn.paymentMethod || "--"}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-800">
                        {txn.counterparty || "--"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-3 text-center text-sm text-gray-800"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailedReport;
