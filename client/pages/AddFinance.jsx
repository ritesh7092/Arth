// src/components/AddFinance.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import baseUrl from '../api/api';
import 'animate.css';
import { useTheme } from '../src/theme/ThemeProvider';
import {
  Sun, Moon, CheckCircle, AlertTriangle, XCircle, Loader2, PlusCircle, ArrowLeft
} from 'lucide-react';

const AddFinance = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const navigate = useNavigate();

  const [financeData, setFinanceData] = useState({
    transactionDate: '',
    amount: '',
    description: '',
    category: '',
    transactionType: '',
    paymentMethod: '',
    counterparty: '',
    dueStatus: '',
    dueDate: '', // <-- Added dueDate here
    counterpartyEmail: '',
    emailReminder: false,
    clientDescription: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [flashMessage, setFlashMessage] = useState(null);
  const [serverTime, setServerTime] = useState(new Date().toLocaleString());
  const [fieldErrors, setFieldErrors] = useState({});

  // Theme classes (same as before)
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


  useEffect(() => {
    const interval = setInterval(() => {
      setServerTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFinanceData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setFieldErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFlashMessage(null);
    setFieldErrors({});

    // Prepare data: convert empty dueStatus to null
    // Only include dueDate if transactionType is LOAN or BORROW
    const dataToSend = {
      ...financeData,
      dueStatus: financeData.dueStatus ? financeData.dueStatus : null,
    };

    // Only check required fields manually for instant feedback
    if (
      !financeData.transactionDate ||
      !financeData.amount ||
      !financeData.description ||
      !financeData.category ||
      !financeData.transactionType ||
      (
        // If Loan or Borrow, dueStatus is required
        (financeData.transactionType === 'LOAN' || financeData.transactionType === 'BORROW') &&
        !financeData.dueStatus
      )
    ) {
      setFlashMessage({ type: 'error', message: 'Please fill in all required fields.' });
      setTimeout(() => setFlashMessage(null), 4000);
      return;
    }

    // Email validation: check format if provided
    if (financeData.counterpartyEmail && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(financeData.counterpartyEmail)) {
      setFieldErrors(prev => ({
        ...prev,
        counterpartyEmail: 'Please enter a valid email address.',
      }));
      setFlashMessage({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      setFlashMessage({ type: 'error', message: 'Authentication required. Please log in.' });
      setTimeout(() => setFlashMessage(null), 3000);
      return;
    }

    setSubmitting(true);
    try {
      await baseUrl.post(
        '/api/finance/create',
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setFlashMessage({ type: 'success', message: 'Finance record saved successfully!' });
      setFinanceData({
        transactionDate: '',
        amount: '',
        description: '',
        category: '',
        transactionType: '',
        paymentMethod: '',
        counterparty: '',
        dueStatus: '',
        dueDate: '',
        counterpartyEmail: '',
        emailReminder: false,
        clientDescription: '',
      });
      setFieldErrors({});

      setTimeout(() => {
        setFlashMessage(null);
        navigate('/finance/dashboard');
      }, 2000);
    } catch (error) {
      // Industry-style backend error handling
      let errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred. Please try again.';

      // If backend returns field errors as an object (not array)
      if (
        error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        !Array.isArray(error.response.data)
      ) {
        setFieldErrors(error.response.data); // set all field errors
        // Optionally show the first error as a flash message
        const firstFieldError = Object.values(error.response.data)[0];
        if (firstFieldError) errorMessage = firstFieldError;
      } else {
        setFieldErrors({});
      }

      setFlashMessage({ type: 'error', message: errorMessage });
      setTimeout(() => setFlashMessage(null), 5000);
    } finally {
      setSubmitting(false);
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

      {/* Theme Toggle Button */}
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

        <div className={`w-full max-w-3xl p-10 rounded-3xl ${themeClasses.cardBg} transition-all duration-700 animate__animated animate__fadeInUp animate__slow`}>
          <div className="flex justify-between items-center mb-8">
            <h2 className={`text-4xl font-extrabold ${themeClasses.text} tracking-tight leading-tight`}>
              Add New Finance Record
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
            Carefully record your financial transactions for accurate tracking.
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
                {fieldErrors.transactionDate && (
                  <div className={`${themeClasses.errorText} text-xs mt-1`}>{fieldErrors.transactionDate}</div>
                )}
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
                    // No min here, let backend handle validation
                    className={`mt-1 w-full border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 pl-9 focus:outline-none ${themeClasses.focusRing} transition duration-300`}
                  />
                </div>
                {fieldErrors.amount && (
                  <div className={`${themeClasses.errorText} text-xs mt-1`}>{fieldErrors.amount}</div>
                )}
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
              {fieldErrors.description && (
                <div className={`${themeClasses.errorText} text-xs mt-1`}>{fieldErrors.description}</div>
              )}
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
                {fieldErrors.category && (
                  <div className={`${themeClasses.errorText} text-xs mt-1`}>{fieldErrors.category}</div>
                )}
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
                </select>
                {fieldErrors.transactionType && (
                  <div className={`${themeClasses.errorText} text-xs mt-1`}>{fieldErrors.transactionType}</div>
                )}
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
                {fieldErrors.paymentMethod && (
                  <div className={`${themeClasses.errorText} text-xs mt-1`}>{fieldErrors.paymentMethod}</div>
                )}
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
                {fieldErrors.counterparty && (
                  <div className={`${themeClasses.errorText} text-xs mt-1`}>{fieldErrors.counterparty}</div>
                )}
              </div>
              <div>
                <label htmlFor="dueStatus" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>
                  Due Status
                  {['LOAN', 'BORROW'].includes(financeData.transactionType) && (
                    <span className={themeClasses.textHighlight}> *</span>
                  )}
                </label>
                <select
                  id="dueStatus"
                  name="dueStatus"
                  value={financeData.dueStatus}
                  onChange={handleChange}
                  required={financeData.transactionType === 'LOAN' || financeData.transactionType === 'BORROW'}
                >
                  <option value="">Select Status *</option>
                  <option value="PAID">Paid</option>
                  <option value="UNPAID">Unpaid</option>
                  <option value="PARTIALLY_PAID">Partially Paid</option>
                </select>
                {fieldErrors.dueStatus && (
                  <div className={`${themeClasses.errorText} text-xs mt-1`}>{fieldErrors.dueStatus}</div>
                )}
              </div>
            </div>

            {/* Due Date - Conditionally Rendered */}
            {['LOAN', 'BORROW'].includes(financeData.transactionType) && (
              <div>
                <label htmlFor="dueDate" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Due Date</label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={financeData.dueDate}
                  onChange={handleChange}
                  className={`mt-1 w-full border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300`}
                />
              </div>
            )}

            {/* Counterparty Email (only for Loan or Borrow) */}
            {['LOAN', 'BORROW'].includes(financeData.transactionType) && (
              <div>
                <label htmlFor="counterpartyEmail" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>
                  {financeData.transactionType === 'LOAN'
                    ? 'Client Email (Optional)'
                    : 'Lender Email (Optional)'}
                </label>
                <input
                  type="email"
                  id="counterpartyEmail"
                  name="counterpartyEmail"
                  value={financeData.counterpartyEmail || ''}
                  onChange={handleChange}
                  className={`mt-1 w-full border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300`}
                  placeholder="example@email.com"
                  pattern="^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$"
                  title="Please enter a valid email address"
                />
                {fieldErrors.counterpartyEmail && (
                  <div className={`${themeClasses.errorText} text-xs mt-1`}>{fieldErrors.counterpartyEmail}</div>
                )}
              </div>
            )}

            {/* Client Description (only for Loan or Borrow) */}
            {['LOAN', 'BORROW'].includes(financeData.transactionType) && (
              <div>
                <label htmlFor="clientDescription" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>
                  Client Description (Optional)
                </label>
                <input
                  type="text"
                  id="clientDescription"
                  name="clientDescription"
                  value={financeData.clientDescription || ''}
                  onChange={handleChange}
                  className={`mt-1 w-full border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300`}
                  placeholder="e.g. Company Name, Contact Details, etc."
                  maxLength={100}
                />
                {fieldErrors.clientDescription && (
                  <div className={`${themeClasses.errorText} text-xs mt-1`}>{fieldErrors.clientDescription}</div>
                )}
              </div>
            )}

            {/* Email Reminder Option (only for Loan or Borrow) */}
            {['LOAN', 'BORROW'].includes(financeData.transactionType) && (
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="emailReminder"
                  name="emailReminder"
                  checked={!!financeData.emailReminder}
                  onChange={e =>
                    setFinanceData(prev => ({
                      ...prev,
                      emailReminder: e.target.checked,
                    }))
                  }
                  className="mr-2"
                />
                <label htmlFor="emailReminder" className={`text-sm ${themeClasses.textSecondary}`}>
                  Send email reminder on due date
                </label>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={submitting}
                className={`w-full flex items-center justify-center py-4 px-8 rounded-xl font-bold text-lg ${themeClasses.buttonPrimary} transform hover:-translate-y-1 active:scale-95 transition-all duration-300 ease-out disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}`}
              >
                {submitting ? (
                  <> <Loader2 className="w-6 h-6 mr-3 animate-spin" /> Saving Record... </>
                ) : (
                  <> <PlusCircle className="w-6 h-6 mr-3" /> Save Finance Record </>
                )}
              </button>
            </div>
          </form>
        </div>

        <section className="absolute bottom-6 right-6 text-right">
          <small className={`${themeClasses.textSecondary} text-sm`}>Server Date: {serverTime}</small>
        </section>
      </main>
    </div>
  );
};

export default AddFinance;

