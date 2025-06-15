// src/components/ViewFinance.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Paperclip } from 'lucide-react';
import baseUrl from '../api/api';
import 'animate.css'; // Ensure animate.css is imported
import { useTheme } from '../src/theme/ThemeProvider'; // Adjust path if necessary
import { FaPaperclip } from 'react-icons/fa';

// Import Lucide React Icons
import { 
  ArrowLeft, 
  Loader2, 
  AlertTriangle, 
  CheckCircle, 
  Moon, 
  Sun, 
  Calendar, 
  Tag, 
  Info, 
  DollarSign, 
  Wallet, 
  Repeat, 
  User2, 
  Clock, 
  XCircle,
  Mail,
  FileText,
  Bell,
  Edit
} from 'lucide-react';

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
    textHighlight: isDarkMode ? 'text-indigo-400' : 'text-indigo-600',
    buttonPrimary: 'bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl',
    buttonSecondary: isDarkMode ? 'bg-gray-700/50 hover:bg-gray-600/70 text-gray-200 shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-md',
    // Specific colors for transaction type tags
    typeIncome: 'bg-green-600 text-white',
    typeExpense: 'bg-red-600 text-white',
    typeBorrow: 'bg-orange-500 text-white',
    typeLoan: 'bg-blue-500 text-white',
    typeTransfer: 'bg-purple-500 text-white',
    // Specific colors for due status tags
    duePaid: 'bg-green-500 text-white',
    dueUnpaid: 'bg-red-500 text-white',
    duePartiallyPaid: 'bg-yellow-500 text-gray-900',
    dueNA: 'bg-gray-400 text-white',
    // Section styling
    sectionBg: isDarkMode ? 'bg-gray-700/30 border border-gray-600/30' : 'bg-gray-50/80 border border-gray-200/50',
    // Note and attachment styling
    noteBg: isDarkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50 border border-gray-200',
    attachmentBg: isDarkMode ? 'bg-blue-900/30 hover:bg-blue-800/40 text-blue-300 border border-blue-700' : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200',
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

  // Helper to format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0.00';
    return `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
      case 'PAID': return themeClasses.duePaid;
      case 'UNPAID': return themeClasses.dueUnpaid;
      case 'PARTIALLY_PAID': return themeClasses.duePartiallyPaid;
      case 'N/A': return themeClasses.dueNA;
      default: return 'bg-gray-400 text-white';
    }
  };

  // Helper to get transaction type display name
  const getTransactionTypeDisplay = (type) => {
    switch (type) {
      case 'INCOME': return 'Income';
      case 'EXPENSE': return 'Expense';
      case 'BORROW': return 'Borrow';
      case 'LOAN': return 'Loan (Given)';
      case 'TRANSFER': return 'Transfer';
      default: return type || 'N/A';
    }
  };

  // Helper to get due status display name
  const getDueStatusDisplay = (status) => {
    switch (status) {
      case 'PAID': return 'Paid';
      case 'UNPAID': return 'Unpaid';
      case 'PARTIALLY_PAID': return 'Partially Paid';
      case 'N/A': return 'Not Applicable';
      default: return status || 'N/A';
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
          <div className={`w-full max-w-4xl p-10 rounded-3xl ${themeClasses.cardBg} flex flex-col items-center justify-center min-h-[300px] animate__animated animate__fadeIn`}>
            <Loader2 className={`w-10 h-10 animate-spin ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <p className={`mt-4 text-xl font-semibold ${themeClasses.text}`}>Loading Finance Record...</p>
          </div>
        ) : financeData ? (
          <div className={`w-full max-w-4xl p-10 rounded-3xl ${themeClasses.cardBg} transition-all duration-700 animate__animated animate__fadeInUp animate__slow`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className={`text-4xl font-extrabold ${themeClasses.text} tracking-tight leading-tight`}>
                  Finance Record Details
                </h2>
                <p className={`${themeClasses.textSecondary} mt-2 text-lg leading-relaxed`}>
                  Complete information about this financial transaction
                </p>
              </div>
              <button
                onClick={() => navigate('/finance/dashboard')}
                className={`p-3 rounded-full ${themeClasses.buttonSecondary} transition-all duration-300 hover:scale-105 shadow-md`}
                title="Return to Dashboard"
              >
                <ArrowLeft size={24} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
              </button>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information Section */}
              <div className={`p-6 rounded-2xl ${themeClasses.sectionBg}`}>
                <h3 className={`text-2xl font-bold ${themeClasses.text} mb-6 flex items-center`}>
                  <Info size={24} className="mr-3 text-indigo-500" />
                  Basic Information
                </h3>
                
                <div className="space-y-5">
                  {/* Transaction Date */}
                  <div className="flex items-start space-x-4">
                    <Calendar size={20} className="mt-1 text-indigo-500 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>Transaction Date</h4>
                      <p className={`mt-1 text-lg font-medium ${themeClasses.textValue}`}>{formatDate(financeData.transactionDate)}</p>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="flex items-start space-x-4">
                    <DollarSign size={20} className="mt-1 text-green-500 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>Amount</h4>
                      <p className={`mt-1 text-2xl font-bold ${themeClasses.textValue}`}>{formatCurrency(financeData.amount)}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex items-start space-x-4">
                    <FileText size={20} className="mt-1 text-blue-500 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>Description</h4>
                      <p className={`mt-1 text-lg ${themeClasses.textValue} leading-relaxed`}>{financeData.description || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex items-start space-x-4">
                    <Tag size={20} className="mt-1 text-purple-500 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>Category</h4>
                      <p className={`mt-1 text-lg ${themeClasses.textValue} capitalize`}>{financeData.category || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Details Section */}
              <div className={`p-6 rounded-2xl ${themeClasses.sectionBg}`}>
                <h3 className={`text-2xl font-bold ${themeClasses.text} mb-6 flex items-center`}>
                  <Repeat size={24} className="mr-3 text-purple-500" />
                  Transaction Details
                </h3>
                
                <div className="space-y-5">
                  {/* Transaction Type */}
                  <div className="flex items-start space-x-4">
                    <Repeat size={20} className="mt-1 text-indigo-500 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>Transaction Type</h4>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getTypeClasses(financeData.transactionType)}`}>
                          {getTransactionTypeDisplay(financeData.transactionType)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="flex items-start space-x-4">
                    <Wallet size={20} className="mt-1 text-orange-500 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>Payment Method</h4>
                      <p className={`mt-1 text-lg ${themeClasses.textValue}`}>{financeData.paymentMethod || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Counterparty */}
                  <div className="flex items-start space-x-4">
                    <User2 size={20} className="mt-1 text-teal-500 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>Counterparty</h4>
                      <p className={`mt-1 text-lg ${themeClasses.textValue}`}>{financeData.counterparty || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Due Status */}
                  {(financeData.dueStatus || ['LOAN', 'BORROW'].includes(financeData.transactionType)) && (
                    <div className="flex items-start space-x-4">
                      <Clock size={20} className="mt-1 text-red-500 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>Due Status</h4>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getDueStatusClasses(financeData.dueStatus)}`}>
                            {getDueStatusDisplay(financeData.dueStatus)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information - Full Width Sections */}
            <div className="mt-8 space-y-6">
              {/* Due Date - Only show if it exists */}
              {financeData.dueDate && (
                <div className={`p-6 rounded-2xl ${themeClasses.sectionBg}`}>
                  <div className="flex items-center space-x-4">
                    <Calendar size={24} className="text-orange-500 flex-shrink-0" />
                    <div>
                      <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>Due Date</h4>
                      <p className={`mt-1 text-xl font-semibold ${themeClasses.textValue}`}>{formatDate(financeData.dueDate)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information - Only show if exists */}
              {financeData.counterpartyEmail && (
                <div className={`p-6 rounded-2xl ${themeClasses.sectionBg}`}>
                  <h3 className={`text-xl font-bold ${themeClasses.text} mb-4 flex items-center`}>
                    <Mail size={20} className="mr-3 text-blue-500" />
                    Contact Information
                  </h3>
                  <div className="flex items-center space-x-4">
                    <Mail size={20} className="text-blue-500 flex-shrink-0" />
                    <div>
                      <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>
                        {financeData.transactionType === 'LOAN' ? 'Client Email' : 'Lender Email'}
                      </h4>
                      <p className={`mt-1 text-lg ${themeClasses.textValue}`}>{financeData.counterpartyEmail}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Client Description - Only show if exists */}
              {financeData.clientDescription && (
                <div className={`p-6 rounded-2xl ${themeClasses.sectionBg}`}>
                  <div className="flex items-start space-x-4">
                    <Info size={20} className="mt-1 text-green-500 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>Client Description</h4>
                      <p className={`mt-2 text-lg ${themeClasses.textValue} leading-relaxed`}>{financeData.clientDescription}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Reminder Status - Only show if exists */}
              {financeData.emailReminder !== undefined && (
                <div className={`p-6 rounded-2xl ${themeClasses.sectionBg}`}>
                  <div className="flex items-center space-x-4">
                    <Bell size={20} className="text-purple-500 flex-shrink-0" />
                    <div>
                      <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>Email Reminder</h4>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${financeData.emailReminder ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                          {financeData.emailReminder ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Note Section - Only show if note exists */}
              {financeData.note && (
                <div className={`p-6 rounded-2xl ${themeClasses.sectionBg}`}>
                  <h3 className={`text-xl font-bold ${themeClasses.text} mb-4 flex items-center`}>
                    <FileText size={20} className="mr-3 text-yellow-500" />
                    Notes
                  </h3>
                  <div className={`p-4 rounded-xl ${themeClasses.noteBg}`}>
                    <p className={`text-lg ${themeClasses.textValue} leading-relaxed`}>{financeData.note}</p>
                  </div>
                </div>
              )}

              {/* Attachment Section - Only show if attachment exists */}
              {financeData.attachment && (
                <div className={`p-6 rounded-2xl ${themeClasses.sectionBg}`}>
                  <h3 className={`text-xl font-bold ${themeClasses.text} mb-4 flex items-center`}>
                    <Paperclip size={20} className="mr-3 text-blue-500" />
                    Attachment
                  </h3>
                  <div className={`inline-flex items-center px-4 py-3 rounded-xl ${themeClasses.attachmentBg} transition-all duration-200 hover:scale-105 shadow-md cursor-pointer`}>
                    <FaPaperclip className="mr-3 text-lg" />
                    <span className="font-medium">
                      {typeof financeData.attachment === 'string' 
                        ? financeData.attachment 
                        : financeData.attachment.name || 'Attached File'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-8 flex justify-end space-x-4">
              <button
                onClick={() => navigate('/finance/dashboard')}
                className={`py-3 px-6 rounded-xl font-bold text-lg ${themeClasses.buttonSecondary} transform hover:-translate-y-1 active:scale-95 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}`}
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate(`/finance/edit/${financeData._id}`)} // Assuming _id is the record ID
                className={`py-3 px-6 rounded-xl font-bold text-lg ${themeClasses.buttonPrimary} transform hover:-translate-y-1 active:scale-95 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'} flex items-center space-x-2`}
              >
                <Edit size={20} />
                <span>Edit Record</span>
              </button>
            </div>
          </div>
        ) : (
          <div className={`w-full max-w-4xl p-10 rounded-3xl ${themeClasses.cardBg} flex flex-col items-center justify-center min-h-[300px] animate__animated animate__fadeIn`}>
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


