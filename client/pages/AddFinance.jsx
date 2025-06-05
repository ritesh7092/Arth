// src/components/AddFinance.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import baseUrl from '../api/api';

const AddFinance = () => {
  const [serverTime, setServerTime] = useState(new Date().toLocaleString());
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
  const [flashMessage, setFlashMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Update server time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setServerTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFinanceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFlashMessage(null);

    // Let browser enforce HTML5 required checks
    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      setFlashMessage({
        type: 'error',
        message: 'You must be logged in to create a finance record.'
      });
      setTimeout(() => setFlashMessage(null), 3000);
      return;
    }

    // Build payload by omitting any empty‐string fields
    const payload = {};
    Object.entries(financeData).forEach(([key, value]) => {
      if (value !== '') {
        payload[key] = value;
      }
    });

    setSubmitting(true);
    try {
      await baseUrl.post(
        '/api/finance/create',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setFlashMessage({
        type: 'success',
        message: 'Finance record saved successfully.'
      });

      // Reset form
      setFinanceData({
        transactionDate: '',
        amount: '',
        description: '',
        category: '',
        transactionType: '',
        paymentMethod: '',
        counterparty: '',
        dueStatus: ''
      });

      setTimeout(() => {
        setFlashMessage(null);
        navigate('/finance/dashboard');
      }, 2000);
    } catch (error) {
      console.error('AXIOS ERROR', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred. Please try again.';
      setFlashMessage({ type: 'error', message: errorMessage });
      setTimeout(() => setFlashMessage(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="container mx-auto py-8 px-6 flex-grow">
        {flashMessage && (
          <div
            className={`mb-6 p-4 rounded-md text-center shadow-lg ${
              flashMessage.type === 'error'
                ? 'bg-red-200 text-red-800'
                : 'bg-green-200 text-green-800'
            }`}
          >
            {flashMessage.message}
          </div>
        )}

        <section className="bg-white p-8 rounded-xl shadow-2xl transform transition duration-500 hover:scale-105">
          <h4 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
            Add New Finance Record
          </h4>
          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {/* Required: transactionDate, amount, description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700">
                  Transaction Date
                </label>
                <input
                  type="date"
                  id="transactionDate"
                  name="transactionDate"
                  value={financeData.transactionDate}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={financeData.amount}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={financeData.description}
                onChange={handleChange}
                rows="3"
                required
                className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              ></textarea>
            </div>

            {/* Now both Category and Transaction Type are required */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={financeData.category}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value="">Select Category</option>
                  <option value="Salary">Salary</option>
                  <option value="Food">Food</option>
                  <option value="Rent">Rent</option>
                  <option value="Loan">Loan</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700">
                  Transaction Type
                </label>
                <select
                  id="transactionType"
                  name="transactionType"
                  value={financeData.transactionType}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value="">Select Type</option>
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                  <option value="BORROW">Borrow</option>
                  <option value="LOAN">Loan</option>
                </select>
              </div>

              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <input
                  type="text"
                  id="paymentMethod"
                  name="paymentMethod"
                  value={financeData.paymentMethod}
                  onChange={handleChange}
                  className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* Optional: counterparty, dueStatus */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="counterparty" className="block text-sm font-medium text-gray-700">
                  Counterparty
                </label>
                <input
                  type="text"
                  id="counterparty"
                  name="counterparty"
                  value={financeData.counterparty}
                  onChange={handleChange}
                  className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label htmlFor="dueStatus" className="block text-sm font-medium text-gray-700">
                  Due Status
                </label>
                <select
                  id="dueStatus"
                  name="dueStatus"
                  value={financeData.dueStatus}
                  onChange={handleChange}
                  className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value="">Select Status (if applicable)</option>
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Finance Record'}
            </button>
          </form>
        </section>

        <section className="text-right mt-4">
          <small className="text-gray-600">Server Date: {serverTime}</small>
        </section>
      </main>
    </div>
  );
};

export default AddFinance;

