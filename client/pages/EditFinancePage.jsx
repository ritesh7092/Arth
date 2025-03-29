// EditFinance.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const EditFinance = () => {
  const { id } = useParams(); // Get the record id from URL
  const [serverTime, setServerTime] = useState(new Date().toLocaleString());
  const [financeData, setFinanceData] = useState({
    transactionDate: '',
    amount: '',
    description: '',
    category: '',
    transactionType: '',
    paymentMethod: '',
    counterparty: '',
    loanStatus: ''
  });
  const [flashMessage, setFlashMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Update server time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setServerTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate fetching existing finance record by id
  useEffect(() => {
    const fetchFinanceRecord = async () => {
      // Replace with actual API call; here we simulate a delay and data
      await new Promise(resolve => setTimeout(resolve, 500));
      // Simulated fetched record
      const record = {
        transactionDate: '2025-03-15',
        amount: '2000',
        description: 'Monthly Savings',
        category: 'Savings',
        transactionType: 'INCOME',
        paymentMethod: 'Bank Transfer',
        counterparty: 'Self',
        loanStatus: ''
      };
      setFinanceData(record);
    };
    fetchFinanceRecord();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFinanceData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // HTML5 validation; browser will show errors if not valid.
    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }
    setSubmitting(true);
    try {
      // Simulate an API update call; replace with your actual update logic.
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (parseFloat(financeData.amount) <= 0) {
        throw new Error('Amount must be greater than zero.');
      }
      setFlashMessage({ type: 'success', message: 'Finance record updated successfully.' });
    } catch (error) {
      setFlashMessage({ type: 'error', message: error.message || 'An error occurred while updating the record.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setFlashMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content (Navbar and Footer are global) */}
      <main className="container mx-auto py-8 px-6 flex-grow">
        {flashMessage && (
          <div className={`mb-6 p-4 rounded-md text-center shadow-lg ${flashMessage.type === 'error' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
            {flashMessage.message}
          </div>
        )}

        <section className="bg-white p-8 rounded-xl shadow-2xl">
          <h4 className="text-3xl font-bold text-indigo-700 mb-8 text-center">Edit Finance Record</h4>
          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700">Transaction Date</label>
                <input
                  type="date"
                  id="transactionDate"
                  name="transactionDate"
                  value={financeData.transactionDate}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border border-gray-300 rounded-lg p-3 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (₹)</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={financeData.amount}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="mt-2 w-full border border-gray-300 rounded-lg p-3 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={financeData.description}
                onChange={handleChange}
                rows="3"
                required
                className="mt-2 w-full border border-gray-300 rounded-lg p-3 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  id="category"
                  name="category"
                  value={financeData.category}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border border-gray-300 rounded-lg p-3 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Category</option>
                  <option value="Salary">Salary</option>
                  <option value="Food">Food</option>
                  <option value="Rent">Rent</option>
                  <option value="Loan">Loan</option>
                </select>
              </div>
              <div>
                <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700">Transaction Type</label>
                <select
                  id="transactionType"
                  name="transactionType"
                  value={financeData.transactionType}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border border-gray-300 rounded-lg p-3 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Type</option>
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                  <option value="BORROW">Borrow</option>
                  <option value="LOAN">Loan</option>
                </select>
              </div>
              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Payment Method</label>
                <input
                  type="text"
                  id="paymentMethod"
                  name="paymentMethod"
                  value={financeData.paymentMethod}
                  onChange={handleChange}
                  className="mt-2 w-full border border-gray-300 rounded-lg p-3 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="counterparty" className="block text-sm font-medium text-gray-700">Counterparty</label>
                <input
                  type="text"
                  id="counterparty"
                  name="counterparty"
                  value={financeData.counterparty}
                  onChange={handleChange}
                  className="mt-2 w-full border border-gray-300 rounded-lg p-3 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="loanStatus" className="block text-sm font-medium text-gray-700">Loan Status</label>
                <select
                  id="loanStatus"
                  name="loanStatus"
                  value={financeData.loanStatus}
                  onChange={handleChange}
                  className="mt-2 w-full border border-gray-300 rounded-lg p-3 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Status (if applicable)</option>
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
              {submitting ? 'Updating...' : 'Update Finance Record'}
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

export default EditFinance;


