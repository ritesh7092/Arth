// DetailedReport.jsx
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

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const DetailedReport = () => {
  // Sample transactions data – replace with your actual data source or API call
  const [transactions, setTransactions] = useState([
    { id: 1, transactionDate: "2025-02-01", category: "Salary", transactionType: "Credit", amount: 50000 },
    { id: 2, transactionDate: "2025-01-05", category: "Food", transactionType: "Debit", amount: 3000 },
    { id: 3, transactionDate: "2025-02-05", category: "Rent", transactionType: "Debit", amount: 15000 },
    { id: 4, transactionDate: "2025-03-10", category: "Loan", transactionType: "Debit", amount: 10000 },
    { id: 5, transactionDate: "2025-03-12", category: "Borrow", transactionType: "Credit", amount: 5000 },
    { id: 6, transactionDate: "2025-03-15", category: "Savings", transactionType: "Credit", amount: 2000 },
    { id: 7, transactionDate: "2025-03-20", category: "Lent", transactionType: "Debit", amount: 5000 },
    // Add additional transactions as needed
  ]);

  const [filterYear, setFilterYear] = useState("2025");
  const [filterMonth, setFilterMonth] = useState(""); // if empty, show whole year

  // Filter transactions by year and optional month
  const filteredData = transactions.filter((txn) => {
    const txnYear = txn.transactionDate.substring(0, 4);
    const txnMonth = txn.transactionDate.substring(5, 7);
    if (filterMonth) {
      return txnYear === filterYear && txnMonth === filterMonth;
    }
    return txnYear === filterYear;
  });

  // Calculate totals by category for the filtered data
  const getTotals = (data) => {
    const totals = {};
    data.forEach((txn) => {
      const cat = txn.category;
      totals[cat] = (totals[cat] || 0) + txn.amount;
    });
    return totals;
  };

  const totals = getTotals(filteredData);

  // Prepare Bar chart data for category breakdown
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

  // For the Pie chart, calculate monthly net totals for the entire year
  const months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
  const monthlyTotals = months.map((month) => {
    const monthData = transactions.filter(
      (txn) =>
        txn.transactionDate.substring(0, 4) === filterYear &&
        txn.transactionDate.substring(5, 7) === month
    );
    // For demonstration, net total = credits minus debits
    const total = monthData.reduce((sum, txn) => {
      return sum + (txn.transactionType === "Credit" ? txn.amount : -txn.amount);
    }, 0);
    return total;
  });

  const pieData = {
    labels: months,
    datasets: [
      {
        label: "Net Total (₹)",
        data: monthlyTotals,
        backgroundColor: months.map((m) => `hsl(${(parseInt(m) * 30) % 360}, 70%, 50%)`),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="container mx-auto py-8 px-4 flex-grow">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Detailed Transaction Report</h1>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Year:</label>
            <input
              type="number"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="mt-1 w-32 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Month (optional):</label>
            <input
              type="month"
              value={filterMonth ? `${filterYear}-${filterMonth}` : ""}
              onChange={(e) => setFilterMonth(e.target.value.substring(5, 7))}
              className="mt-1 w-40 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Category Breakdown {filterMonth ? `for ${filterYear}-${filterMonth}` : `for ${filterYear}`}
            </h2>
            <div className="h-72">
              <Bar
                data={barData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { ticks: { color: "#4A5568" }, grid: { color: "#E2E8F0" } },
                    x: { ticks: { color: "#4A5568" }, grid: { display: false } },
                  },
                }}
              />
            </div>
          </div>
          {/* Pie Chart */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Monthly Net Total for {filterYear}
            </h2>
            <div className="h-72">
              <Pie
                data={pieData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "bottom", labels: { color: "#4A5568" } },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Transaction Details Table */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Transaction Details</h2>
          <div className="overflow-x-auto shadow-lg rounded-lg" style={{ maxHeight: "400px" }}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-800 sticky top-0 z-10">
                <tr>
                  {["Date", "Description", "Category", "Type", "Amount", "Payment Method", "Counterparty"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-center text-white text-sm font-medium">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-gray-100 divide-y divide-gray-300">
                {filteredData.length > 0 ? (
                  filteredData.map((txn) => (
                    <tr key={txn.id} className="hover:bg-gray-200">
                      <td className="px-4 py-3 text-center text-sm text-gray-800">{txn.transactionDate}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-800">{txn.description}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-800">{txn.category}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-800">{txn.transactionType}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-800">₹ {txn.amount}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-800">{txn.paymentMethod}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-800">{txn.counterparty}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-3 text-center text-sm text-gray-800">
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


