// src/components/EditFinance.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import baseUrl from '../api/api';
import 'animate.css'; // Ensure animate.css is imported
import { useTheme } from '../src/theme/ThemeProvider'; // Adjust path if necessary

// Import Lucide React Icons
import { ArrowLeft, Loader2, AlertTriangle, CheckCircle, XCircle, Moon, Sun, Save, DollarSign } from 'lucide-react';

const EditFinance = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const navigate = useNavigate();
  const { id } = useParams(); // Get finance record ID from URL parameters

  const [financeData, setFinanceData] = useState({
    transactionDate: '',
    amount: '',
    description: '',
    category: '',
    transactionType: '',
    paymentMethod: '',
    counterparty: '',
    dueStatus: ''
  });
  const [loading, setLoading] = useState(true); // Initial load for fetching data
  const [saving, setSaving] = useState(false); // For form submission
  const [flashMessage, setFlashMessage] = useState(null);

  // --- THEME-AWARE STYLING (Consistent with AddFinance) ---
  const themeClasses = {
    bg: isDarkMode
      ? 'bg-gradient-to-br from-gray-900 via-gray-950 to-black'
      : 'bg-white',
    cardBg: isDarkMode
      ? 'bg-gray-800/60 backdrop-blur-lg border border-gray-700/50'
      : 'bg-white shadow-2xl border border-gray-100',
    text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    textHighlight: isDarkMode ? 'text-indigo-400' : 'text-indigo-600',
    inputBg: isDarkMode ? 'bg-gray-700/40' : 'bg-gray-50 shadow-inner',
    inputBorder: isDarkMode ? 'border-gray-600 focus:border-indigo-500' : 'border-gray-200 focus:border-indigo-500',
    focusRing: 'focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-60',
    buttonPrimary: 'bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl',
    buttonSecondary: isDarkMode ? 'bg-gray-700/50 hover:bg-gray-600/70 text-gray-200 shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-md',
    errorText: 'text-red-500'
  };

  // --- FETCH FINANCE RECORD DATA ON COMPONENT MOUNT ---
  useEffect(() => {
    const fetchFinanceRecord = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        setFlashMessage({ type: 'error', message: 'Authentication required. Please log in.' });
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        const response = await baseUrl.get(`/api/finance/transactions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Format dueDate to 'YYYY-MM-DD' for input type="date"
        setFinanceData({
          ...response.data,
          transactionDate: response.data.transactionDate ? new Date(response.data.transactionDate).toISOString().split('T')[0] : ''
        });
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch finance record details.';
        setFlashMessage({ type: 'error', message: errorMessage });
        setTimeout(() => navigate('/finance/dashboard'), 3000);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFinanceRecord();
    } else {
      setFlashMessage({ type: 'error', message: 'No finance record ID provided for editing.' });
      setLoading(false);
      navigate('/finance/dashboard');
    }
  }, [id, navigate]);

  // --- FORM HANDLING ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFinanceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFlashMessage(null);

    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      setFlashMessage({ type: 'error', message: 'Please fill in all required fields.' });
      setTimeout(() => setFlashMessage(null), 4000);
      return;
    }

    setSaving(true);
    const token = localStorage.getItem('authToken');

    const payload = {};
    Object.entries(financeData).forEach(([key, value]) => {
      if (value !== '') {
        payload[key] = value;
      }
    });

    try {
      await baseUrl.put(`/api/finance/transactions/update/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      setFlashMessage({ type: 'success', message: 'Finance record updated successfully!' });
      setTimeout(() => {
        setFlashMessage(null);
        navigate('/finance/dashboard');
      }, 2000);
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred during update.';
      setFlashMessage({ type: 'error', message: errorMessage });
      setTimeout(() => setFlashMessage(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${themeClasses.bg} font-sans antialiased transition-colors duration-700 relative overflow-hidden`}>
      {/* Dynamic Background Elements */}
      {!isDarkMode && (
        <>
          <div className={`absolute top-1/4 left-1/4 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob bg-indigo-200`}></div>
          <div className={`absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000 bg-purple-200`}></div>
          <div className={`absolute top-1/2 left-1/2 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000 bg-teal-200`}></div>
        </>
      )}
      {isDarkMode && (
        <>
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob bg-purple-600`}></div>
          <div className={`absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000 bg-indigo-600`}></div>
          <div className={`absolute top-1/2 left-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000 bg-teal-600`}></div>
        </>
      )}

      {/* --- THEME TOGGLE BUTTON --- */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 ${themeClasses.buttonSecondary} focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-950' : 'focus:ring-offset-white'} focus:ring-indigo-500 shadow-md`}
          aria-label="Toggle theme"
          title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6 text-yellow-300 animate__animated animate__fadeIn animate__faster" />
          ) : (
            <Moon className="w-6 h-6 text-indigo-700 animate__animated animate__fadeIn animate__faster" />
          )}
        </button>
      </div>

      <main className="relative z-10 container mx-auto py-12 px-4 flex-grow flex items-center justify-center">
        {/* Flash Messages */}
        {flashMessage && (
          <div className={`fixed top-24 right-6 z-50 max-w-xs md:max-w-sm p-4 rounded-xl shadow-2xl flex items-start space-x-3 transform animate__animated ${flashMessage.type === 'error' ? 'animate__shakeX bg-red-600 text-white' : 'animate__fadeInDown bg-green-600 text-white'} transition-all duration-300`}
          >
            {flashMessage.type === 'error' ? (
              <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            )}
            <span className="font-medium text-base leading-tight">{flashMessage.message}</span>
            <button onClick={() => setFlashMessage(null)} className="ml-auto p-1 rounded-full hover:bg-white/20 transition-colors self-start">
              <XCircle size={20} />
            </button>
          </div>
        )}

        {loading ? (
          <div className={`w-full max-w-2xl p-10 rounded-3xl ${themeClasses.cardBg} flex flex-col items-center justify-center min-h-[300px] animate__animated animate__fadeIn`}>
            <Loader2 className={`w-10 h-10 animate-spin ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <p className={`mt-4 text-xl font-semibold ${themeClasses.text}`}>Loading Finance Record...</p>
          </div>
        ) : financeData ? (
          <div className={`w-full max-w-3xl p-10 rounded-3xl ${themeClasses.cardBg} transition-all duration-700 animate__animated animate__fadeInUp animate__slow`}>
            <div className="flex justify-between items-center mb-8">
              <h2 className={`text-4xl font-extrabold ${themeClasses.text} tracking-tight leading-tight`}>
                Edit Finance Record
              </h2>
              <button
                onClick={() => navigate('/finance/dashboard')}
                className={`p-3 rounded-full ${themeClasses.buttonSecondary} transition-all duration-300 hover:scale-105 shadow-md`}
                title="Return to Dashboard"
              >
                <ArrowLeft size={24} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
              </button>
            </div>

            <p className={`${themeClasses.textSecondary} mb-10 text-lg leading-relaxed`}>
              Make changes to your financial transaction and save them.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              {/* Transaction Date & Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="transactionDate" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Transaction Date <span className={themeClasses.textHighlight}>*</span></label>
                  <input
                    type="date"
                    id="transactionDate"
                    name="transactionDate"
                    value={financeData.transactionDate}
                    onChange={handleChange}
                    required
                    className={`mt-1 w-full border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300`}
                  />
                </div>
                <div>
                  <label htmlFor="amount" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Amount (₹) <span className={themeClasses.textHighlight}>*</span></label>
                  <div className="relative">
                    <span className={`absolute inset-y-0 left-0 pl-3 flex items-center ${themeClasses.textSecondary}`}>₹</span>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={financeData.amount}
                      onChange={handleChange}
                      required
                      step="0.01"
                      min="0"
                      className={`mt-1 w-full border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 pl-9 focus:outline-none ${themeClasses.focusRing} transition duration-300`}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Description <span className={themeClasses.textHighlight}>*</span></label>
                <textarea
                  id="description"
                  name="description"
                  value={financeData.description}
                  onChange={handleChange}
                  rows="3"
                  required
                  placeholder="e.g., Monthly rent payment, Groceries, Freelance income"
                  className={`mt-1 w-full border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300`}
                ></textarea>
              </div>

              {/* Category, Transaction Type, Payment Method */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label htmlFor="category" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Category <span className={themeClasses.textHighlight}>*</span></label>
                  <select
                    id="category"
                    name="category"
                    value={financeData.category}
                    onChange={handleChange}
                    required
                    className={`mt-1 w-full border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300 appearance-none pr-10 custom-select-arrow`}
                  >
                    <option value="">Select Category</option>
                    <option value="Salary">Salary</option>
                    <option value="Food">Food</option>
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Loan">Loan Repayment</option>
                    <option value="Investment">Investment</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="transactionType" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Transaction Type <span className={themeClasses.textHighlight}>*</span></label>
                  <select
                    id="transactionType"
                    name="transactionType"
                    value={financeData.transactionType}
                    onChange={handleChange}
                    required
                    className={`mt-1 w-full border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300 appearance-none pr-10 custom-select-arrow`}
                  >
                    <option value="">Select Type</option>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                    <option value="BORROW">Borrow</option>
                    <option value="LOAN">Loan (Given)</option>
                    <option value="TRANSFER">Transfer</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="paymentMethod" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Payment Method</label>
                  <input
                    type="text"
                    id="paymentMethod"
                    name="paymentMethod"
                    value={financeData.paymentMethod}
                    onChange={handleChange}
                    placeholder="e.g., Cash, Bank Transfer, UPI, Card"
                    className={`mt-1 w-full border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300`}
                  />
                </div>
              </div>

              {/* Counterparty & Due Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="counterparty" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Counterparty</label>
                  <input
                    type="text"
                    id="counterparty"
                    name="counterparty"
                    value={financeData.counterparty}
                    onChange={handleChange}
                    placeholder="e.g., Landlord, Employer, Friend"
                    className={`mt-1 w-full border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300`}
                  />
                </div>
                <div>
                  <label htmlFor="dueStatus" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Due Status</label>
                  <select
                    id="dueStatus"
                    name="dueStatus"
                    value={financeData.dueStatus}
                    onChange={handleChange}
                    className={`mt-1 w-full border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300 appearance-none pr-10 custom-select-arrow`}
                  >
                    <option value="">Select Status (if applicable)</option>
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="OVERDUE">Overdue</option>
                    <option value="N/A">Not Applicable</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={saving} // Use 'saving' state for this button
                  className={`w-full flex items-center justify-center py-4 px-8 rounded-xl font-bold text-lg ${themeClasses.buttonPrimary} transform hover:-translate-y-1 active:scale-95 transition-all duration-300 ease-out disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}`}
                >
                  {saving ? (
                    <> <Loader2 className="w-6 h-6 mr-3 animate-spin" /> Saving Changes... </>
                  ) : (
                    <> <Save className="w-6 h-6 mr-3" /> Save Changes </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className={`w-full max-w-2xl p-10 rounded-3xl ${themeClasses.cardBg} flex flex-col items-center justify-center min-h-[300px] animate__animated animate__fadeIn`}>
            <AlertTriangle className={`w-10 h-10 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            <p className={`mt-4 text-xl font-semibold ${themeClasses.text}`}>Record not found or an error occurred.</p>
            <button
                onClick={() => navigate('/finance/dashboard')}
                className={`mt-6 py-3 px-6 rounded-xl font-bold ${themeClasses.buttonSecondary} transform hover:-translate-y-0.5 active:scale-95 transition-all duration-300`}
            >
                Go to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default EditFinance;



// // EditFinance.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useParams } from 'react-router-dom';

// const EditFinance = () => {
//   const { id } = useParams(); // Get the record id from URL
//   const [serverTime, setServerTime] = useState(new Date().toLocaleString());
//   const [financeData, setFinanceData] = useState({
//     transactionDate: '',
//     amount: '',
//     description: '',
//     category: '',
//     transactionType: '',
//     paymentMethod: '',
//     counterparty: '',
//     loanStatus: ''
//   });
//   const [flashMessage, setFlashMessage] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   // Update server time every second
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setServerTime(new Date().toLocaleString());
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   // Simulate fetching existing finance record by id
//   useEffect(() => {
//     const fetchFinanceRecord = async () => {
//       // Replace with actual API call; here we simulate a delay and data
//       await new Promise(resolve => setTimeout(resolve, 500));
//       // Simulated fetched record
//       const record = {
//         transactionDate: '2025-03-15',
//         amount: '2000',
//         description: 'Monthly Savings',
//         category: 'Savings',
//         transactionType: 'INCOME',
//         paymentMethod: 'Bank Transfer',
//         counterparty: 'Self',
//         loanStatus: ''
//       };
//       setFinanceData(record);
//     };
//     fetchFinanceRecord();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFinanceData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // HTML5 validation; browser will show errors if not valid.
//     if (!e.target.checkValidity()) {
//       e.target.reportValidity();
//       return;
//     }
//     setSubmitting(true);
//     try {
//       // Simulate an API update call; replace with your actual update logic.
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       if (parseFloat(financeData.amount) <= 0) {
//         throw new Error('Amount must be greater than zero.');
//       }
//       setFlashMessage({ type: 'success', message: 'Finance record updated successfully.' });
//     } catch (error) {
//       setFlashMessage({ type: 'error', message: error.message || 'An error occurred while updating the record.' });
//     } finally {
//       setSubmitting(false);
//       setTimeout(() => setFlashMessage(null), 3000);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Main Content (Navbar and Footer are global) */}
//       <main className="container mx-auto py-8 px-6 flex-grow">
//         {flashMessage && (
//           <div className={`mb-6 p-4 rounded-md text-center shadow-lg ${flashMessage.type === 'error' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
//             {flashMessage.message}
//           </div>
//         )}

//         <section className="bg-white p-8 rounded-xl shadow-2xl">
//           <h4 className="text-3xl font-bold text-indigo-700 mb-8 text-center">Edit Finance Record</h4>
//           <form onSubmit={handleSubmit} className="space-y-8" noValidate>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div>
//                 <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700">Transaction Date</label>
//                 <input
//                   type="date"
//                   id="transactionDate"
//                   name="transactionDate"
//                   value={financeData.transactionDate}
//                   onChange={handleChange}
//                   required
//                   className="mt-2 w-full border border-gray-300 rounded-lg p-3 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (₹)</label>
//                 <input
//                   type="number"
//                   id="amount"
//                   name="amount"
//                   value={financeData.amount}
//                   onChange={handleChange}
//                   required
//                   step="0.01"
//                   className="mt-2 w-full border border-gray-300 rounded-lg p-3 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={financeData.description}
//                 onChange={handleChange}
//                 rows="3"
//                 required
//                 className="mt-2 w-full border border-gray-300 rounded-lg p-3 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               ></textarea>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <div>
//                 <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
//                 <select
//                   id="category"
//                   name="category"
//                   value={financeData.category}
//                   onChange={handleChange}
//                   required
//                   className="mt-2 w-full border border-gray-300 rounded-lg p-3 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 >
//                   <option value="">Select Category</option>
//                   <option value="Salary">Salary</option>
//                   <option value="Food">Food</option>
//                   <option value="Rent">Rent</option>
//                   <option value="Loan">Loan</option>
//                 </select>
//               </div>
//               <div>
//                 <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700">Transaction Type</label>
//                 <select
//                   id="transactionType"
//                   name="transactionType"
//                   value={financeData.transactionType}
//                   onChange={handleChange}
//                   required
//                   className="mt-2 w-full border border-gray-300 rounded-lg p-3 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 >
//                   <option value="">Select Type</option>
//                   <option value="INCOME">Income</option>
//                   <option value="EXPENSE">Expense</option>
//                   <option value="BORROW">Borrow</option>
//                   <option value="LOAN">Loan</option>
//                 </select>
//               </div>
//               <div>
//                 <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Payment Method</label>
//                 <input
//                   type="text"
//                   id="paymentMethod"
//                   name="paymentMethod"
//                   value={financeData.paymentMethod}
//                   onChange={handleChange}
//                   className="mt-2 w-full border border-gray-300 rounded-lg p-3 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div>
//                 <label htmlFor="counterparty" className="block text-sm font-medium text-gray-700">Counterparty</label>
//                 <input
//                   type="text"
//                   id="counterparty"
//                   name="counterparty"
//                   value={financeData.counterparty}
//                   onChange={handleChange}
//                   className="mt-2 w-full border border-gray-300 rounded-lg p-3 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="loanStatus" className="block text-sm font-medium text-gray-700">Loan Status</label>
//                 <select
//                   id="loanStatus"
//                   name="loanStatus"
//                   value={financeData.loanStatus}
//                   onChange={handleChange}
//                   className="mt-2 w-full border border-gray-300 rounded-lg p-3 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 >
//                   <option value="">Select Status (if applicable)</option>
//                   <option value="PENDING">Pending</option>
//                   <option value="COMPLETED">Completed</option>
//                 </select>
//               </div>
//             </div>

//             <button type="submit" disabled={submitting} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
//               {submitting ? 'Updating...' : 'Update Finance Record'}
//             </button>
//           </form>
//         </section>

//         <section className="text-right mt-4">
//           <small className="text-gray-600">Server Date: {serverTime}</small>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default EditFinance;


