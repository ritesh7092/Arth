// FinanceDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FinanceDashboard = () => {
  const [serverTime, setServerTime] = useState(new Date().toLocaleString());
  const [filterMonth, setFilterMonth] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [transactions, setTransactions] = useState([
    { id: 1, transactionDate: '2025-03-01', description: 'Salary for March', category: 'Salary', transactionType: 'Credit', amount: 50000, paymentMethod: 'Bank Transfer', counterparty: 'Employer Inc.', loanStatus: 'N/A' },
    { id: 2, transactionDate: '2025-03-05', description: 'Grocery Shopping', category: 'Food', transactionType: 'Debit', amount: 3000, paymentMethod: 'Credit Card', counterparty: 'Supermarket', loanStatus: 'N/A' },
    { id: 3, transactionDate: '2025-03-05', description: 'Monthly Rent', category: 'Rent', transactionType: 'Debit', amount: 15000, paymentMethod: 'Net Banking', counterparty: 'Landlord', loanStatus: 'N/A' },
    { id: 4, transactionDate: '2025-03-10', description: 'Loan Payment', category: 'Loan', transactionType: 'Debit', amount: 10000, paymentMethod: 'Cheque', counterparty: 'Bank', loanStatus: 'Paid' },
    { id: 5, transactionDate: '2025-03-12', description: 'Money Borrowed', category: 'Borrow', transactionType: 'Credit', amount: 5000, paymentMethod: 'Cash', counterparty: 'Friend', loanStatus: 'N/A' },
    { id: 6, transactionDate: '2025-03-15', description: 'Monthly Savings', category: 'Savings', transactionType: 'Credit', amount: 2000, paymentMethod: 'Bank Transfer', counterparty: 'Self', loanStatus: 'N/A' },
    { id: 7, transactionDate: '2025-03-20', description: 'Lent money to friend', category: 'Lent', transactionType: 'Debit', amount: 5000, paymentMethod: 'Cash', counterparty: 'Friend', loanStatus: 'Pending' },
    { id: 8, transactionDate: '2025-02-15', description: 'Monthly Savings', category: 'Savings', transactionType: 'Credit', amount: 2000, paymentMethod: 'Bank Transfer', counterparty: 'Self', loanStatus: 'N/A' },
    { id: 9, transactionDate: '2025-01-20', description: 'Lent money to friend', category: 'Lent', transactionType: 'Debit', amount: 5000, paymentMethod: 'Cash', counterparty: 'Friend', loanStatus: 'Pending' },
    // Add more...
  ]);
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  const [flashMessage, setFlashMessage] = useState({ type: '', message: '' });

  useEffect(() => {
    const interval = setInterval(() => setServerTime(new Date().toLocaleString()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const today = new Date();
    const m = (today.getMonth() + 1).toString().padStart(2, '0');
    const y = today.getFullYear();
    setFilterMonth(`${y}-${m}`);
  }, []);

  useEffect(() => {
    const filtered = transactions.filter((txn) => {
      const txnMonth = txn.transactionDate.slice(0, 7);
      const monthMatch = !filterMonth || txnMonth === filterMonth;
      const dateMatch = !filterDate || txn.transactionDate === filterDate;
      const catMatch = !filterCategory || txn.category.toLowerCase() === filterCategory.toLowerCase();
      return monthMatch && dateMatch && catMatch;
    });
    setFilteredTransactions(filtered);
  }, [filterMonth, filterDate, filterCategory, transactions]);

  const monthSavings = filteredTransactions
    .filter((t) => t.category.toLowerCase() === 'savings')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthLoan = filteredTransactions
    .filter((t) => t.category.toLowerCase() === 'loan')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthBorrow = filteredTransactions
    .filter((t) => t.category.toLowerCase() === 'borrow')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthExpenses = filteredTransactions
    .filter((t) => t.transactionType.toLowerCase() === 'debit' && !['loan', 'borrow', 'savings', 'lent'].includes(t.category.toLowerCase()))
    .reduce((sum, t) => sum + t.amount, 0);
  const monthLent = filteredTransactions
    .filter((t) => t.category.toLowerCase() === 'lent')
    .reduce((sum, t) => sum + t.amount, 0);

  const overallSavings = transactions
    .filter((t) => t.category.toLowerCase() === 'savings')
    .reduce((sum, t) => sum + t.amount, 0);
  const overallLoanAndBorrow = transactions
    .filter((t) => ['loan', 'borrow'].includes(t.category.toLowerCase()))
    .reduce((sum, t) => sum + t.amount, 0);
  const overallLent = transactions
    .filter((t) => t.category.toLowerCase() === 'lent')
    .reduce((sum, t) => sum + t.amount, 0);
  const overallSettlement = overallSavings + overallLent - overallLoanAndBorrow;

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      setFlashMessage({ type: 'success', message: 'Transaction deleted successfully.' });
      setTimeout(() => setFlashMessage({ type: '', message: '' }), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="w-full max-w-7xl mx-auto flex-grow px-4 py-6">
        {flashMessage.message && (
          <div className={`mb-6 px-4 py-3 rounded-md text-center text-sm font-medium ${flashMessage.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {flashMessage.message}
          </div>
        )}

        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Finance Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">Server Time: {serverTime}</p>
        </header>

        <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { label: 'Savings (Month)', value: monthSavings, gradient: 'from-teal-500 to-teal-400' },
            { label: 'Expenses (Month)', value: monthExpenses, gradient: 'from-red-500 to-red-400' },
            { label: 'Loan (Month)', value: monthLoan, gradient: 'from-yellow-500 to-yellow-400' },
            { label: 'Borrow (Month)', value: monthBorrow, gradient: 'from-orange-500 to-orange-400' },
            { label: 'Lent (Month)', value: monthLent, gradient: 'from-green-500 to-green-400' },
          ].map((card, idx) => (
            <div key={idx} className={`rounded-xl shadow-lg bg-gradient-to-br ${card.gradient} p-5 flex flex-col justify-center`}>
              <p className="text-xs font-medium text-white/80">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">₹ {card.value.toLocaleString()}</p>
            </div>
          ))}
        </section>

        <section className="mb-8">
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-300">Overall Till Today (Savings + Lent vs. Loan/Borrow)</p>
              <p className="mt-1 text-3xl font-extrabold text-white">₹ {overallSettlement.toLocaleString()}</p>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-400">Overall Savings</p>
                <p className="mt-1 text-lg font-semibold text-teal-300">₹ {overallSavings.toLocaleString()}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-400">Overall Loan/Borrow</p>
                <p className="mt-1 text-lg font-semibold text-red-300">₹ {overallLoanAndBorrow.toLocaleString()}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-400">Total Lent</p>
                <p className="mt-1 text-lg font-semibold text-green-300">₹ {overallLent.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label htmlFor="filterMonth" className="block text-xs font-medium text-gray-600">Filter by Month</label>
              <input
                type="month"
                id="filterMonth"
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="filterDate" className="block text-xs font-medium text-gray-600">Filter by Date</label>
              <input
                type="date"
                id="filterDate"
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="filterCategory" className="block text-xs font-medium text-gray-600">Filter by Category</label>
              <select
                id="filterCategory"
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All</option>
                <option value="Salary">Salary</option>
                <option value="Food">Food</option>
                <option value="Rent">Rent</option>
                <option value="Loan">Loan</option>
                <option value="Borrow">Borrow</option>
                <option value="Savings">Savings</option>
                <option value="Lent">Lent</option>
              </select>
            </div>
            <div className="flex items-end">
              <Link
                to="/finance/report"
                className="w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Detailed Reports
              </Link>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">Recent Transactions (This Month)</h2>
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead className="bg-teal-600">
                <tr>
                  {['Date','Description','Category','Type','Amount','Payment Method','Counterparty','Status','Actions'].map((hdr) => (
                    <th key={hdr} className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      {hdr}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((txn, idx) => (
                    <tr key={txn.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm text-gray-700">{txn.transactionDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{txn.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{txn.category}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{txn.transactionType}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-teal-600">₹ {txn.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{txn.paymentMethod}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{txn.counterparty}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{txn.loanStatus}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            to={`/finance/view/${txn.id}`}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
                          >
                            View
                          </Link>
                          <Link
                            to={`/finance/edit/${txn.id}`}
                            className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-xs font-medium rounded-md transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(txn.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-4 py-4 text-center text-sm text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-6 text-right text-sm text-gray-500">Server Time: {serverTime}</div>
      </main>
    </div>
  );
};

export default FinanceDashboard;






// // FinanceDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// const FinanceDashboard = () => {
//   // State declarations
//   const [serverTime, setServerTime] = useState(new Date().toLocaleString());
//   const [filterMonth, setFilterMonth] = useState('');
//   const [filterDate, setFilterDate] = useState('');
//   const [filterCategory, setFilterCategory] = useState('');
//   const [transactions, setTransactions] = useState([
//     {
//       id: 1,
//       transactionDate: '2025-03-01',
//       description: 'Salary for March',
//       category: 'Salary',
//       transactionType: 'Credit',
//       amount: 50000,
//       paymentMethod: 'Bank Transfer',
//       counterparty: 'Employer Inc.',
//       loanStatus: 'N/A',
//     },
//     {
//       id: 2,
//       transactionDate: '2025-03-05',
//       description: 'Grocery Shopping',
//       category: 'Food',
//       transactionType: 'Debit',
//       amount: 3000,
//       paymentMethod: 'Credit Card',
//       counterparty: 'Supermarket',
//       loanStatus: 'N/A',
//     },
//     {
//       id: 3,
//       transactionDate: '2025-03-05',
//       description: 'Monthly Rent',
//       category: 'Rent',
//       transactionType: 'Debit',
//       amount: 15000,
//       paymentMethod: 'Net Banking',
//       counterparty: 'Landlord',
//       loanStatus: 'N/A',
//     },
//     {
//       id: 4,
//       transactionDate: '2025-03-10',
//       description: 'Loan Payment',
//       category: 'Loan',
//       transactionType: 'Debit',
//       amount: 10000,
//       paymentMethod: 'Cheque',
//       counterparty: 'Bank',
//       loanStatus: 'Paid',
//     },
//     {
//       id: 5,
//       transactionDate: '2025-03-12',
//       description: 'Money Borrowed',
//       category: 'Borrow',
//       transactionType: 'Credit',
//       amount: 5000,
//       paymentMethod: 'Cash',
//       counterparty: 'Friend',
//       loanStatus: 'N/A',
//     },
//     {
//       id: 6,
//       transactionDate: '2025-03-15',
//       description: 'Monthly Savings',
//       category: 'Savings',
//       transactionType: 'Credit',
//       amount: 2000,
//       paymentMethod: 'Bank Transfer',
//       counterparty: 'Self',
//       loanStatus: 'N/A',
//     },
//     {
//       id: 7,
//       transactionDate: '2025-03-20',
//       description: 'Lent money to friend',
//       category: 'Lent',
//       transactionType: 'Debit',
//       amount: 5000,
//       paymentMethod: 'Cash',
//       counterparty: 'Friend',
//       loanStatus: 'Pending',
//     },
//     {
//       id: 8,
//       transactionDate: '2025-02-15',
//       description: 'Monthly Savings',
//       category: 'Savings',
//       transactionType: 'Credit',
//       amount: 2000,
//       paymentMethod: 'Bank Transfer',
//       counterparty: 'Self',
//       loanStatus: 'N/A',
//     },
//     {
//       id: 9,
//       transactionDate: '2025-01-20',
//       description: 'Lent money to friend',
//       category: 'Lent',
//       transactionType: 'Debit',
//       amount: 5000,
//       paymentMethod: 'Cash',
//       counterparty: 'Friend',
//       loanStatus: 'Pending',
//     },
//     // Add additional transactions as needed...
//   ]);
//   const [filteredTransactions, setFilteredTransactions] = useState(transactions);
//   const [flashMessage, setFlashMessage] = useState({ type: '', message: '' });

//   // Update server time every second
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setServerTime(new Date().toLocaleString());
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   // Set default filterMonth to current month on mount
//   useEffect(() => {
//     const today = new Date();
//     const month = (today.getMonth() + 1).toString().padStart(2, '0');
//     const year = today.getFullYear();
//     setFilterMonth(`${year}-${month}`);
//   }, []);

//   // Filter transactions based on selected filters
//   useEffect(() => {
//     const filtered = transactions.filter((txn) => {
//       const txnMonth = txn.transactionDate.substring(0, 7);
//       const txnDate = txn.transactionDate;
//       const monthMatch = !filterMonth || txnMonth === filterMonth;
//       const dateMatch = !filterDate || txnDate === filterDate;
//       const categoryMatch =
//         !filterCategory ||
//         txn.category.toLowerCase() === filterCategory.toLowerCase();
//       return monthMatch && dateMatch && categoryMatch;
//     });
//     setFilteredTransactions(filtered);
//   }, [filterMonth, filterDate, filterCategory, transactions]);

//   // Calculate summary totals for the selected month (using filtered transactions)
//   const monthSavings = filteredTransactions
//     .filter((txn) => txn.category.toLowerCase() === 'savings')
//     .reduce((sum, txn) => sum + txn.amount, 0);
//   const monthLoan = filteredTransactions
//     .filter((txn) => txn.category.toLowerCase() === 'loan')
//     .reduce((sum, txn) => sum + txn.amount, 0);
//   const monthBorrow = filteredTransactions
//     .filter((txn) => txn.category.toLowerCase() === 'borrow')
//     .reduce((sum, txn) => sum + txn.amount, 0);
//   const monthExpenses = filteredTransactions
//     .filter(
//       (txn) =>
//         txn.transactionType.toLowerCase() === 'debit' &&
//         !['loan', 'borrow', 'savings', 'lent'].includes(txn.category.toLowerCase())
//     )
//     .reduce((sum, txn) => sum + txn.amount, 0);
//   const monthLent = filteredTransactions
//     .filter((txn) => txn.category.toLowerCase() === 'lent')
//     .reduce((sum, txn) => sum + txn.amount, 0);

//   // Calculate overall totals (using all transactions)
//   const overallSavings = transactions
//     .filter((txn) => txn.category.toLowerCase() === 'savings')
//     .reduce((sum, txn) => sum + txn.amount, 0);
//   const overallLoanAndBorrow = transactions
//     .filter((txn) =>
//       ['loan', 'borrow'].includes(txn.category.toLowerCase())
//     )
//     .reduce((sum, txn) => sum + txn.amount, 0);
//   const overallLent = transactions
//     .filter((txn) => txn.category.toLowerCase() === 'lent')
//     .reduce((sum, txn) => sum + txn.amount, 0);
//   // Final settlement: overall savings plus overall lent minus overall loan & borrow
//   const overallSettlement = overallSavings + overallLent - overallLoanAndBorrow;

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this transaction?')) {
//       setTransactions((prev) => prev.filter((txn) => txn.id !== id));
//       setFlashMessage({
//         type: 'success',
//         message: 'Transaction deleted successfully.',
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       {/* Main Content */}
//       <main className="container mx-auto my-8 px-4 flex-grow">
//         {/* Flash Message */}
//         {flashMessage.message && (
//           <div
//             className={`mb-6 p-3 rounded-md text-center ${
//               flashMessage.type === 'error'
//                 ? 'bg-red-200 text-red-800'
//                 : 'bg-green-200 text-green-800'
//             }`}
//           >
//             {flashMessage.message}
//           </div>
//         )}

//         {/* Dashboard Heading */}
//         <div className="mb-6 text-center">
//           <h2 className="text-3xl font-extrabold text-gray-900">Finance Dashboard</h2>
//           <p className="mt-1 text-base text-gray-700">Server Time: {serverTime}</p>
//         </div>

//         {/* Summary Cards for Selected Month */}
//         <section className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
//           {[
//             { label: 'Savings (Month)', value: monthSavings },
//             { label: 'Expenses (Month)', value: monthExpenses },
//             { label: 'Loan (Month)', value: monthLoan },
//             { label: 'Borrow (Month)', value: monthBorrow },
//             { label: 'Lent (Month)', value: monthLent },
//           ].map((card, index) => (
//             <div key={index} className="bg-blue-900 p-4 rounded-lg shadow-md text-center">
//               <p className="text-sm text-gray-300">{card.label}</p>
//               <p className="mt-1 text-xl font-bold text-yellow-400">₹ {card.value}</p>
//             </div>
//           ))}
//         </section>

//         {/* Overall Summary Card */}
//         <section className="mb-6">
//           <div className="bg-gray-900 p-4 rounded-lg shadow-lg text-center">
//             <p className="text-sm text-gray-300">
//               Overall Till Today (Savings + Lent vs. Loan/Borrow)
//             </p>
//             <div className="mt-3 grid grid-cols-3 gap-2">
//               <div className="border-r border-gray-700 pr-2">
//                 <p className="text-xs text-gray-300">Overall Savings</p>
//                 <p className="mt-1 text-lg font-bold text-yellow-400">₹ {overallSavings}</p>
//               </div>
//               <div className="border-r border-gray-700 pr-2">
//                 <p className="text-xs text-gray-300">Overall Loan/Borrow</p>
//                 <p className="mt-1 text-lg font-bold text-yellow-400">₹ {overallLoanAndBorrow}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-300">Final Settlement</p>
//                 <p className="mt-1 text-lg font-bold text-yellow-400">₹ {overallSettlement}</p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Filter Section */}
//         <section className="mb-6 bg-gray-800 p-6 rounded-lg shadow-lg">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <label htmlFor="filterMonth" className="block text-sm font-medium text-gray-300">
//                 Filter by Month:
//               </label>
//               <input
//                 type="month"
//                 id="filterMonth"
//                 className="mt-1 w-full border border-gray-700 rounded-md p-2 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 bg-gray-900 text-gray-200"
//                 value={filterMonth}
//                 onChange={(e) => setFilterMonth(e.target.value)}
//               />
//             </div>
//             <div>
//               <label htmlFor="filterDate" className="block text-sm font-medium text-gray-300">
//                 Filter by Date:
//               </label>
//               <input
//                 type="date"
//                 id="filterDate"
//                 className="mt-1 w-full border border-gray-700 rounded-md p-2 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 bg-gray-900 text-gray-200"
//                 value={filterDate}
//                 onChange={(e) => setFilterDate(e.target.value)}
//               />
//             </div>
//             <div>
//               <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-300">
//                 Filter by Category:
//               </label>
//               <select
//                 id="filterCategory"
//                 className="mt-1 w-full border border-gray-700 rounded-md p-2 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 bg-gray-900 text-gray-200"
//                 value={filterCategory}
//                 onChange={(e) => setFilterCategory(e.target.value)}
//               >
//                 <option value="">All</option>
//                 <option value="Salary">Salary</option>
//                 <option value="Food">Food</option>
//                 <option value="Rent">Rent</option>
//                 <option value="Loan">Loan</option>
//                 <option value="Borrow">Borrow</option>
//                 <option value="Savings">Savings</option>
//                 <option value="Lent">Lent</option>
//               </select>
//             </div>
//             <div className="flex items-end">
//               <Link
//                 to="/finance/report"
//                 className="w-full inline-block text-center bg-yellow-600 text-gray-900 py-2 rounded-md font-semibold hover:bg-yellow-700 transition-colors"
//               >
//                 Detailed Reports
//               </Link>
//             </div>
//           </div>
//         </section>

//         {/* Transactions Table */}
//         <section>
//           <h3 className="mb-4 text-2xl font-semibold text-gray-900">Recent Transactions (This Month)</h3>
//           <div className="overflow-x-auto shadow-lg rounded-lg" style={{ maxHeight: '400px' }}>
//             <table className="min-w-full divide-y divide-gray-700">
//               <thead className="bg-gray-700 sticky top-0 z-10">
//                 <tr>
//                   {[
//                     'Date',
//                     'Description',
//                     'Category',
//                     'Type',
//                     'Amount',
//                     'Payment Method',
//                     'Counterparty',
//                     'Status',
//                     'Actions',
//                   ].map((heading) => (
//                     <th
//                       key={heading}
//                       className="px-4 py-3 text-center text-white text-base font-medium"
//                     >
//                       {heading}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-gray-100 divide-y divide-gray-200">
//                 {filteredTransactions.length > 0 ? (
//                   filteredTransactions.map((txn) => (
//                     <tr key={txn.id} className="hover:bg-gray-200">
//                       <td className="px-4 py-3 text-center text-base text-gray-800">{txn.transactionDate}</td>
//                       <td className="px-4 py-3 text-center text-base text-gray-800">{txn.description}</td>
//                       <td className="px-4 py-3 text-center text-base text-gray-800">{txn.category}</td>
//                       <td className="px-4 py-3 text-center text-base text-gray-800">{txn.transactionType}</td>
//                       <td className="px-4 py-3 text-center text-base text-gray-800">₹ {txn.amount}</td>
//                       <td className="px-4 py-3 text-center text-base text-gray-800">{txn.paymentMethod}</td>
//                       <td className="px-4 py-3 text-center text-base text-gray-800">{txn.counterparty}</td>
//                       <td className="px-4 py-3 text-center text-base text-gray-800">{txn.loanStatus}</td>
//                       <td className="px-4 py-3 text-center">
//                         <div className="flex justify-center space-x-2">
//                           <Link
//                             to={`/finance/view/${txn.id}`}
//                             className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-base transition-colors"
//                           >
//                             View
//                           </Link>
//                           <Link
//                             to={`/finance/edit/${txn.id}`}
//                             className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-1 rounded text-base transition-colors"
//                           >
//                             Edit
//                           </Link>
//                           <button
//                             onClick={() => handleDelete(txn.id)}
//                             className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-base transition-colors"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="9" className="px-4 py-3 text-center text-base text-gray-700">
//                       No transactions found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         {/* Server Time at the Bottom */}
//         <div className="mt-4 text-right text-gray-700 text-base">
//           Server Time: {serverTime}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default FinanceDashboard;

