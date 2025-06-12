// src/components/ViewFinance.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Paperclip } from 'lucide-react';
import baseUrl from '../api/api';
import 'animate.css'; // Ensure animate.css is imported
import { useTheme } from '../src/theme/ThemeProvider'; // Adjust path if necessary
import { FaPaperclip } from 'react-icons/fa';

// Import Lucide React Icons
import { ArrowLeft, Loader2, AlertTriangle, CheckCircle, Moon, Sun, Calendar, Tag, Info, List, DollarSign, Wallet, Repeat, User2, Clock } from 'lucide-react';

const ViewFinance = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const navigate = useNavigate();
  const { id } = useParams(); // Get finance record ID from URL parameters

  const [financeData, setFinanceData] = useState(null); // Null initially, then populated
  const [loading, setLoading] = useState(true);
  const [flashMessage, setFlashMessage] = useState(null);

  // --- THEME-AWARE STYLING ---
  const themeClasses = {
    bg: isDarkMode
      ? 'bg-gradient-to-br from-gray-900 via-gray-950 to-black'
      : 'bg-white',
    cardBg: isDarkMode
      ? 'bg-gray-800/60 backdrop-blur-lg border border-gray-700/50'
      : 'bg-white shadow-2xl border border-gray-100',
    text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-500' : 'text-gray-400', // For labels
    textValue: isDarkMode ? 'text-gray-200' : 'text-gray-800', // For actual values
    buttonPrimary: 'bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl',
    buttonSecondary: isDarkMode ? 'bg-gray-700/50 hover:bg-gray-600/70 text-gray-200 shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-md',
    // Specific colors for transaction type tags
    typeIncome: 'bg-green-600 text-white',
    typeExpense: 'bg-red-600 text-white',
    typeBorrow: 'bg-orange-500 text-white',
    typeLoan: 'bg-blue-500 text-white',
    typeTransfer: 'bg-purple-500 text-white',
    // Specific colors for due status tags
    duePending: 'bg-yellow-500 text-gray-900',
    dueCompleted: 'bg-green-500 text-white',
    dueOverdue: 'bg-red-700 text-white',
    dueNA: 'bg-gray-400 text-white',
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
        const response = await baseUrl.get(`/api/finance/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFinanceData(response.data);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch finance record details.';
        setFlashMessage({ type: 'error', message: errorMessage });
        setTimeout(() => navigate('/finance/dashboard'), 3000); // Redirect back on error
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFinanceRecord();
    } else {
      setFlashMessage({ type: 'error', message: 'No finance record ID provided for viewing.' });
      setLoading(false);
      navigate('/finance/dashboard');
    }
  }, [id, navigate]);

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper to get transaction type tag classes
  const getTypeClasses = (type) => {
    switch (type) {
      case 'INCOME': return themeClasses.typeIncome;
      case 'EXPENSE': return themeClasses.typeExpense;
      case 'BORROW': return themeClasses.typeBorrow;
      case 'LOAN': return themeClasses.typeLoan;
      case 'TRANSFER': return themeClasses.typeTransfer;
      default: return 'bg-gray-400 text-white';
    }
  };

  // Helper to get due status tag classes
  const getDueStatusClasses = (status) => {
    switch (status) {
      case 'PENDING': return themeClasses.duePending;
      case 'COMPLETED': return themeClasses.dueCompleted;
      case 'OVERDUE': return themeClasses.dueOverdue;
      case 'N/A': return themeClasses.dueNA;
      default: return 'bg-gray-400 text-white';
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
          <div className={`w-full max-w-2xl p-10 rounded-3xl ${themeClasses.cardBg} transition-all duration-700 animate__animated animate__fadeInUp animate__slow`}>
            <div className="flex justify-between items-center mb-8">
              <h2 className={`text-4xl font-extrabold ${themeClasses.text} tracking-tight leading-tight`}>
                Finance Record Details
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
              Detailed information about this financial transaction.
            </p>

            <div className="space-y-6">
              {/* Transaction Date */}
              <div>
                <h3 className={`text-lg font-bold ${themeClasses.textMuted} flex items-center`}>
                  <Calendar size={20} className="mr-2 text-indigo-500" /> Transaction Date:
                </h3>
                <p className={`mt-2 text-xl font-semibold ${themeClasses.textValue} pl-7`}>{formatDate(financeData.transactionDate)}</p>
              </div>

              {/* Amount */}
              <div>
                <h3 className={`text-lg font-bold ${themeClasses.textMuted} flex items-center`}>
                  <DollarSign size={20} className="mr-2 text-indigo-500" /> Amount:
                </h3>
                <p className={`mt-2 text-xl font-semibold ${themeClasses.textValue} pl-7`}>₹{financeData.amount ? financeData.amount.toLocaleString('en-IN') : '0.00'}</p>
              </div>

              {/* Description */}
              <div>
                <h3 className={`text-lg font-bold ${themeClasses.textMuted} flex items-center`}>
                  <Info size={20} className="mr-2 text-indigo-500" /> Description:
                </h3>
                <p className={`mt-2 text-lg ${themeClasses.textValue} leading-relaxed pl-7`}>{financeData.description || 'N/A'}</p>
              </div>

              {/* Category */}
              <div>
                <h3 className={`text-lg font-bold ${themeClasses.textMuted} flex items-center`}>
                  <Tag size={20} className="mr-2 text-indigo-500" /> Category:
                </h3>
                <p className={`mt-2 text-lg ${themeClasses.textValue} capitalize pl-7`}>{financeData.category || 'N/A'}</p>
              </div>

              {/* Transaction Type */}
              <div>
                <h3 className={`text-lg font-bold ${themeClasses.textMuted} flex items-center`}>
                  <Repeat size={20} className="mr-2 text-indigo-500" /> Transaction Type:
                </h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mt-2 ml-7 ${getTypeClasses(financeData.transactionType)}`}>
                  {financeData.transactionType || 'N/A'}
                </span>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className={`text-lg font-bold ${themeClasses.textMuted} flex items-center`}>
                  <Wallet size={20} className="mr-2 text-indigo-500" /> Payment Method:
                </h3>
                <p className={`mt-2 text-lg ${themeClasses.textValue} pl-7`}>{financeData.paymentMethod || 'N/A'}</p>
              </div>

              {/* Counterparty */}
              <div>
                <h3 className={`text-lg font-bold ${themeClasses.textMuted} flex items-center`}>
                  <User2 size={20} className="mr-2 text-indigo-500" /> Counterparty:
                </h3>
                <p className={`mt-2 text-lg ${themeClasses.textValue} pl-7`}>{financeData.counterparty || 'N/A'}</p>
              </div>

              {/* Due Status */}
              <div>
                <h3 className={`text-lg font-bold ${themeClasses.textMuted} flex items-center`}>
                  <Clock size={20} className="mr-2 text-indigo-500" /> Due Status:
                </h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mt-2 ml-7 ${getDueStatusClasses(financeData.dueStatus)}`}>
                  {financeData.dueStatus || 'N/A'}
                </span>
              </div>
            </div>

            {/* Note and Attachment (New Section) */}
            {financeData.note && (
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-1">Note</h3>
                <p className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">{financeData.note}</p>
              </div>
            )}

            {financeData.attachment && (
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-1">Attachment</h3>
                <a
                  href={URL.createObjectURL(financeData.attachment)}
                  download={financeData.attachment.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-semibold"
                >
                  <FaPaperclip className="mr-2" /> {financeData.attachment.name}
                </a>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-8 flex justify-end">
              <button
                onClick={() => navigate(`/finance/edit/${financeData._id}`)} // Assuming _id is the record ID
                className={`py-3 px-6 rounded-xl font-bold text-lg ${themeClasses.buttonPrimary} transform hover:-translate-y-1 active:scale-95 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}`}
              >
                Edit Record
              </button>
            </div>
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

export default ViewFinance;