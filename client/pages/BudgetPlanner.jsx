// BudgetPlanner.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'animate.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {
  IndianRupee,
  Wallet,
  PieChart,
  Moon,
  Sun,
  PlusCircle,
  X,
  AlertCircle,
  Edit2,
  Trash2,
  PiggyBank,
  ChevronLeft,
} from 'lucide-react';
import baseUrl from '../api/api'; // Your Axios instance
import { useTheme } from '../src/theme/ThemeProvider'; // Your Theme Provider

// --- Re-usable Helpers & Components from FinanceDashboard ---

// Format INR (from your FinanceDashboard)
const formatRupee = amount =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount ?? 0);

// --- New/Adapted Components for BudgetPlanner ---

const BudgetCard = React.memo(({ budget, themeClasses, onEdit, onDelete }) => {
  const progress = Math.min((budget.spent / budget.limit) * 100, 100);
  const isOverBudget = budget.spent > budget.limit;
  const progressBarColor = isOverBudget ? 'bg-red-500' : 'bg-emerald-500';

  return (
    <div
      className={`
        ${themeClasses.cardBg} border ${themeClasses.border} rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 animate__animated animate__fadeIn
        ${isOverBudget ? 'ring-2 ring-red-400/80 dark:ring-red-500/80 bg-red-50 dark:bg-red-900/30' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className={`text-lg sm:text-xl font-semibold ${themeClasses.text}`}>
          {budget.name}
        </h4>
        <PieChart className={`w-6 h-6 ${isOverBudget ? 'text-red-500' : 'text-emerald-500'}`} />
      </div>
      <p className={`${themeClasses.textSecondary} text-sm mb-3`}>
        Category: <span className="font-medium">{budget.category}</span>
      </p>

      <div className="flex justify-between items-baseline text-sm mb-2">
        <span className={`${themeClasses.textSecondary}`}>
          Spent: <strong className={`${isOverBudget ? 'text-red-500' : themeClasses.text}`}>
            {formatRupee(budget.spent)}
          </strong>
        </span>
        <span className={`${themeClasses.textSecondary}`}>
          Limit: <strong className={`${themeClasses.text}`}>{formatRupee(budget.limit)}</strong>
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className={`${progressBarColor} h-2.5 rounded-full`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className={`text-right text-xs sm:text-sm mt-2 ${themeClasses.textSecondary}`}>
        {isOverBudget ? (
          <span className="text-red-500 font-semibold">Over budget by {formatRupee(budget.spent - budget.limit)}</span>
        ) : (
          `${Math.round(progress)}% spent`
        )}
      </p>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => onEdit(budget.id)}
          className={`p-2 rounded-full ${themeClasses.buttonSecondary} group`}
          title="Edit Budget"
        >
          <Edit2 size={16} className={`${themeClasses.textSecondary} group-hover:scale-110 transition-transform`} />
        </button>
        <button
          onClick={() => onDelete(budget.id)}
          className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors group"
          title="Delete Budget"
        >
          <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
});

const FinancialGoalCard = React.memo(({ goal, themeClasses, onEdit, onDelete }) => {
  const progress = Math.min((goal.saved / goal.target) * 100, 100);
  const isCompleted = goal.saved >= goal.target;
  const progressBarColor = isCompleted ? 'bg-blue-500' : 'bg-purple-500';

  return (
    <div
      className={`
        ${themeClasses.cardBg} border ${themeClasses.border} rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 animate__animated animate__fadeIn
        ${isCompleted ? 'ring-2 ring-blue-400/80 dark:ring-blue-500/80 bg-blue-50 dark:bg-blue-900/30' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className={`text-lg sm:text-xl font-semibold ${themeClasses.text}`}>
          {goal.name}
        </h4>
        <PiggyBank className={`w-6 h-6 ${isCompleted ? 'text-blue-500' : 'text-purple-500'}`} />
      </div>
      <p className={`${themeClasses.textSecondary} text-sm mb-2`}>
        Target: <strong className="font-semibold">{formatRupee(goal.target)}</strong>
      </p>
      <p className={`${themeClasses.textSecondary} text-sm mb-3`}>
        Saved: <strong className="font-semibold">{formatRupee(goal.saved)}</strong>
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className={`${progressBarColor} h-2.5 rounded-full`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className={`text-right text-xs sm:text-sm mt-2 ${themeClasses.textSecondary}`}>
        {isCompleted ? (
          <span className="text-blue-500 font-semibold">Goal Achieved!</span>
        ) : (
          `${Math.round(progress)}% complete (Due: ${new Date(goal.deadline).toLocaleDateString('en-IN')})`
        )}
      </p>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => onEdit(goal.id)}
          className={`p-2 rounded-full ${themeClasses.buttonSecondary} group`}
          title="Edit Goal"
        >
          <Edit2 size={16} className={`${themeClasses.textSecondary} group-hover:scale-110 transition-transform`} />
        </button>
        <button
          onClick={() => onDelete(goal.id)}
          className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors group"
          title="Delete Goal"
        >
          <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
});

// Modal Form for Add/Edit Budget
const BudgetFormModal = ({ isOpen, onClose, initialData, onSave, isDarkMode }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || 'Housing', // Default category
    limit: initialData?.limit || '',
    spent: initialData?.spent || 0, // Should be calculated, but good for initial mock
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        category: initialData.category,
        limit: initialData.limit,
        spent: initialData.spent,
      });
    } else {
      setFormData({ name: '', category: 'Housing', limit: '', spent: 0 });
    }
  }, [initialData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'limit' || name === 'spent' ? parseFloat(value) || '' : value
    }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.limit) {
      alert('Please fill all required fields: Name, Category, and Limit.');
      return;
    }
    if (isNaN(formData.limit) || formData.limit <= 0) {
      alert('Budget limit must be a positive number.');
      return;
    }
    onSave({ ...formData, id: initialData?.id }); // Pass ID for editing
  }, [formData, initialData, onSave]);

  if (!isOpen) return null;

  const themeClasses = {
    modalBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    inputBg: isDarkMode ? 'bg-gray-700' : 'bg-gray-50',
    inputBorder: isDarkMode ? 'border-gray-600' : 'border-gray-300',
    text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
    textLabel: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    buttonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    buttonSecondary: isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  };

  const categories = [
    'Housing', 'Food', 'Utilities', 'Transport', 'Health',
    'Education', 'Entertainment', 'Shopping', 'Other'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate__animated animate__fadeIn">
      <div className={`${themeClasses.modalBg} rounded-xl shadow-2xl p-6 w-full max-w-md animate__animated animate__zoomIn`} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={`absolute top-4 right-4 p-2 rounded-full ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
          <X size={20} />
        </button>
        <h2 className={`text-2xl font-bold mb-6 text-center ${themeClasses.text}`}>
          {initialData ? 'Edit Budget' : 'Add New Budget'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className={`block text-sm font-medium mb-1 ${themeClasses.textLabel}`}>Budget Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Monthly Essentials"
              required
              className={`w-full p-3 rounded-lg border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} focus:ring-emerald-500 focus:border-emerald-500`}
            />
          </div>
          <div>
            <label htmlFor="category" className={`block text-sm font-medium mb-1 ${themeClasses.textLabel}`}>Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={`w-full p-3 rounded-lg border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} focus:ring-emerald-500 focus:border-emerald-500`}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="limit" className={`block text-sm font-medium mb-1 ${themeClasses.textLabel}`}>Budget Limit (INR)</label>
            <input
              type="number"
              id="limit"
              name="limit"
              value={formData.limit}
              onChange={handleChange}
              placeholder="e.g., 30000"
              required
              min="0.01"
              step="0.01"
              className={`w-full p-3 rounded-lg border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} focus:ring-emerald-500 focus:border-emerald-500`}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2 rounded-lg font-medium transition-colors ${themeClasses.buttonSecondary}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-lg shadow-md font-medium transition-colors ${themeClasses.buttonPrimary}`}
            >
              {initialData ? 'Update Budget' : 'Add Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal Form for Add/Edit Financial Goal
const FinancialGoalFormModal = ({ isOpen, onClose, initialData, onSave, isDarkMode }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    target: initialData?.target || '',
    saved: initialData?.saved || 0,
    deadline: initialData?.deadline?.substring(0, 10) || '', // Ensure 'YYYY-MM-DD'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        target: initialData.target,
        saved: initialData.saved,
        deadline: initialData.deadline?.substring(0, 10),
      });
    } else {
      setFormData({ name: '', target: '', saved: 0, deadline: '' });
    }
  }, [initialData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'target' || name === 'saved' ? parseFloat(value) || '' : value
    }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!formData.name || !formData.target || !formData.deadline) {
      alert('Please fill all required fields: Name, Target, and Deadline.');
      return;
    }
    if (isNaN(formData.target) || formData.target <= 0) {
      alert('Target amount must be a positive number.');
      return;
    }
    if (new Date(formData.deadline) < new Date()) {
        alert('Deadline cannot be in the past.');
        return;
    }
    onSave({ ...formData, id: initialData?.id });
  }, [formData, initialData, onSave]);

  if (!isOpen) return null;

  const themeClasses = {
    modalBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    inputBg: isDarkMode ? 'bg-gray-700' : 'bg-gray-50',
    inputBorder: isDarkMode ? 'border-gray-600' : 'border-gray-300',
    text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
    textLabel: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    buttonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    buttonSecondary: isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate__animated animate__fadeIn">
      <div className={`${themeClasses.modalBg} rounded-xl shadow-2xl p-6 w-full max-w-md animate__animated animate__zoomIn`} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={`absolute top-4 right-4 p-2 rounded-full ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
          <X size={20} />
        </button>
        <h2 className={`text-2xl font-bold mb-6 text-center ${themeClasses.text}`}>
          {initialData ? 'Edit Financial Goal' : 'Add New Financial Goal'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="goal-name" className={`block text-sm font-medium mb-1 ${themeClasses.textLabel}`}>Goal Name</label>
            <input
              type="text"
              id="goal-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., New Car Down Payment"
              required
              className={`w-full p-3 rounded-lg border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} focus:ring-purple-500 focus:border-purple-500`}
            />
          </div>
          <div>
            <label htmlFor="goal-target" className={`block text-sm font-medium mb-1 ${themeClasses.textLabel}`}>Target Amount (INR)</label>
            <input
              type="number"
              id="goal-target"
              name="target"
              value={formData.target}
              onChange={handleChange}
              placeholder="e.g., 500000"
              required
              min="0.01"
              step="0.01"
              className={`w-full p-3 rounded-lg border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} focus:ring-purple-500 focus:border-purple-500`}
            />
          </div>
          <div>
            <label htmlFor="goal-saved" className={`block text-sm font-medium mb-1 ${themeClasses.textLabel}`}>Amount Saved (INR)</label>
            <input
              type="number"
              id="goal-saved"
              name="saved"
              value={formData.saved}
              onChange={handleChange}
              placeholder="e.g., 100000"
              min="0"
              step="0.01"
              className={`w-full p-3 rounded-lg border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} focus:ring-purple-500 focus:border-purple-500`}
            />
          </div>
          <div>
            <label htmlFor="goal-deadline" className={`block text-sm font-medium mb-1 ${themeClasses.textLabel}`}>Deadline</label>
            <input
              type="date"
              id="goal-deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className={`w-full p-3 rounded-lg border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} focus:ring-purple-500 focus:border-purple-500`}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2 rounded-lg font-medium transition-colors ${themeClasses.buttonSecondary}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-lg shadow-md font-medium transition-colors bg-purple-600 hover:bg-purple-700 text-white`}
            >
              {initialData ? 'Update Goal' : 'Add Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default function BudgetPlanner() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const isDarkMode = theme === 'dark';

  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null); // null for add, object for edit

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null); // null for add, object for edit

  // Theme-aware Tailwind classes (from your FinanceDashboard)
  const themeClasses = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-300',
    inputBorder: isDarkMode ? 'border-gray-600' : 'border-gray-400',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    buttonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    buttonSecondary: isDarkMode
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
      : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  };

  // --- API Calls (Mocked for now, integrate with your backend) ---
  const fetchBudgetsAndGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please login to continue.');
        setTimeout(() => navigate('/login'), 1500);
        return;
      }

      // --- Mock API calls ---
      // In a real app, replace with actual baseUrl.get('/api/finance/budgets') and '/api/finance/goals'
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

      // Example Backend Response structure for Budgets (similar to your transactions)
      const mockBudgetsResponse = {
        content: [
          { id: 'b1', name: 'Monthly Essentials', limit: 30000, spent: 22500, category: 'Housing' },
          { id: 'b2', name: 'Groceries', limit: 8000, spent: 6500, category: 'Food' },
          { id: 'b3', name: 'Entertainment', limit: 4000, spent: 4200, category: 'Entertainment' }, // Over budget
          { id: 'b4', name: 'Transportation', limit: 5000, spent: 4200, category: 'Transport' },
          { id: 'b5', name: 'Utilities', limit: 7000, spent: 5000, category: 'Utilities' },
        ]
      };

      // Example Backend Response structure for Goals
      const mockGoalsResponse = {
        content: [
          { id: 'g1', name: 'New Laptop', target: 80000, saved: 45000, deadline: '2025-12-31' },
          { id: 'g2', name: 'Vacation Fund', target: 50000, saved: 15000, deadline: '2026-06-30' },
          { id: 'g3', name: 'Emergency Fund', target: 100000, saved: 105000, deadline: '2025-10-01' }, // Achieved
        ]
      };

      setBudgets(mockBudgetsResponse.content || []);
      setGoals(mockGoalsResponse.content || []);

      // Uncomment and adapt for real API calls:
      /*
      const budgetRes = await baseUrl.get('/api/finance/budgets', { headers: { Authorization: `Bearer ${token}` } });
      setBudgets(budgetRes.data.content || []); // Adjust based on your actual response structure

      const goalRes = await baseUrl.get('/api/finance/goals', { headers: { Authorization: `Bearer ${token}` } });
      setGoals(goalRes.data.content || []); // Adjust based on your actual response structure
      */

    } catch (err) {
      let errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch data.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchBudgetsAndGoals();
  }, [fetchBudgetsAndGoals]);

  // --- Budget Actions ---
  const handleAddBudget = useCallback(() => {
    setEditingBudget(null);
    setIsBudgetModalOpen(true);
  }, []);

  const handleEditBudget = useCallback((id) => {
    const budgetToEdit = budgets.find(b => b.id === id);
    setEditingBudget(budgetToEdit);
    setIsBudgetModalOpen(true);
  }, [budgets]);

  const handleSaveBudget = useCallback(async (budgetData) => {
    try {
      const token = localStorage.getItem('authToken');
      // In a real app, send to your backend:
      // if (budgetData.id) {
      //   await baseUrl.put(`/api/finance/budgets/${budgetData.id}`, budgetData, { headers: { Authorization: `Bearer ${token}` } });
      // } else {
      //   await baseUrl.post('/api/finance/budgets', budgetData, { headers: { Authorization: `Bearer ${token}` } });
      // }
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call

      // Update local state after successful API call
      if (budgetData.id) {
        setBudgets(prev => prev.map(b => b.id === budgetData.id ? budgetData : b));
      } else {
        setBudgets(prev => [...prev, { ...budgetData, id: `b${Date.now()}` }]); // Mock ID
      }
      setIsBudgetModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save budget.');
    }
  }, []);

  const handleDeleteBudget = useCallback((id) => {
    const budgetToDelete = budgets.find(b => b.id === id);
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-xl shadow-2xl p-6 max-w-md w-full animate__animated animate__zoomIn`}>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h1 className={`text-2xl font-bold mb-2 ${themeClasses.text}`}>Confirm Delete</h1>
              <p className={`${themeClasses.textSecondary} mb-4`}>
                Are you sure you want to delete the budget: <span className="font-semibold">{budgetToDelete?.name}</span>?
              </p>
              <div className="flex gap-3">
                <button onClick={onClose} className={`flex-1 px-4 py-2 rounded-lg ${themeClasses.buttonSecondary} font-medium transition-colors`}>
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('authToken');
                      // await baseUrl.delete(`/api/finance/budgets/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
                      setBudgets(prev => prev.filter(b => b.id !== id));
                      onClose();
                    } catch (error) {
                      setError(error.response?.data?.message || error.message || 'Failed to delete budget.');
                    }
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    });
  }, [budgets, themeClasses]);

  // --- Financial Goal Actions ---
  const handleAddGoal = useCallback(() => {
    setEditingGoal(null);
    setIsGoalModalOpen(true);
  }, []);

  const handleEditGoal = useCallback((id) => {
    const goalToEdit = goals.find(g => g.id === id);
    setEditingGoal(goalToEdit);
    setIsGoalModalOpen(true);
  }, [goals]);

  const handleSaveGoal = useCallback(async (goalData) => {
    try {
      const token = localStorage.getItem('authToken');
      // In a real app, send to your backend:
      // if (goalData.id) {
      //   await baseUrl.put(`/api/finance/goals/${goalData.id}`, goalData, { headers: { Authorization: `Bearer ${token}` } });
      // } else {
      //   await baseUrl.post('/api/finance/goals', goalData, { headers: { Authorization: `Bearer ${token}` } });
      // }
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call

      if (goalData.id) {
        setGoals(prev => prev.map(g => g.id === goalData.id ? goalData : g));
      } else {
        setGoals(prev => [...prev, { ...goalData, id: `g${Date.now()}` }]);
      }
      setIsGoalModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save goal.');
    }
  }, []);

  const handleDeleteGoal = useCallback((id) => {
    const goalToDelete = goals.find(g => g.id === id);
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-xl shadow-2xl p-6 max-w-md w-full animate__animated animate__zoomIn`}>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h1 className={`text-2xl font-bold mb-2 ${themeClasses.text}`}>Confirm Delete</h1>
              <p className={`${themeClasses.textSecondary} mb-4`}>
                Are you sure you want to delete the goal: <span className="font-semibold">{goalToDelete?.name}</span>?
              </p>
              <div className="flex gap-3">
                <button onClick={onClose} className={`flex-1 px-4 py-2 rounded-lg ${themeClasses.buttonSecondary} font-medium transition-colors`}>
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('authToken');
                      // await baseUrl.delete(`/api/finance/goals/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
                      setGoals(prev => prev.filter(g => g.id !== id));
                      onClose();
                    } catch (error) {
                      setError(error.response?.data?.message || error.message || 'Failed to delete goal.');
                    }
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    });
  }, [goals, themeClasses]);

  // --- Render Logic ---
  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
        <AlertCircle className="animate-spin text-5xl text-emerald-500" />
        <p className="ml-4 text-xl font-semibold">Loading your financial data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-8 text-center ${isDarkMode ? 'bg-gray-900 text-red-400' : 'bg-gray-100 text-red-600'}`}>
        <AlertCircle className="text-6xl mb-4" />
        <h2 className="text-3xl font-bold mb-2">Error Loading Data</h2>
        <p className="text-lg mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} transition-colors duration-300`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 sm:px-6 lg:px-8 py-4 ${
        isDarkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className={`p-2 rounded-md transition-colors ${themeClasses.hover} ${themeClasses.textSecondary}`}>
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className={`text-2xl font-bold ${themeClasses.text}`}>Budget & Goals</h1>
              <p className={`text-sm ${themeClasses.textSecondary}`}>
                Plan your finances and track progress
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-md transition-colors ${themeClasses.hover} ${isDarkMode ? 'text-yellow-400' : 'text-gray-600'}`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Budgets Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-3xl font-bold ${themeClasses.text}`}>Your Budgets</h2>
            <button
              onClick={handleAddBudget}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors duration-200 ${themeClasses.buttonPrimary}`}
            >
              <PlusCircle className="mr-2 -ml-1 h-5 w-5" /> Add Budget
            </button>
          </div>
          {budgets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map(budget => (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  themeClasses={themeClasses}
                  onEdit={handleEditBudget}
                  onDelete={handleDeleteBudget}
                />
              ))}
            </div>
          ) : (
            <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-xl p-6 text-center shadow-md animate__animated animate__fadeIn`}>
              <p className={`text-lg mb-4 ${themeClasses.textSecondary}`}>
                You haven't set up any budgets yet. Start planning your spending!
              </p>
              <button
                onClick={handleAddBudget}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors duration-200 ${themeClasses.buttonPrimary}`}
              >
                <PlusCircle className="mr-2 -ml-1 h-5 w-5" /> Create First Budget
              </button>
            </div>
          )}
        </section>

        {/* Financial Goals Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-3xl font-bold ${themeClasses.text}`}>Financial Goals</h2>
            <button
              onClick={handleAddGoal}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors duration-200 bg-purple-600 hover:bg-purple-700 text-white`}
            >
              <PlusCircle className="mr-2 -ml-1 h-5 w-5" /> Add Goal
            </button>
          </div>
          {goals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map(goal => (
                <FinancialGoalCard
                  key={goal.id}
                  goal={goal}
                  themeClasses={themeClasses}
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteGoal}
                />
              ))}
            </div>
          ) : (
            <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-xl p-6 text-center shadow-md animate__animated animate__fadeIn`}>
              <p className={`text-lg mb-4 ${themeClasses.textSecondary}`}>
                No financial goals set. Start saving for your dreams!
              </p>
              <button
                onClick={handleAddGoal}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors duration-200 bg-purple-600 hover:bg-purple-700 text-white`}
              >
                <PlusCircle className="mr-2 -ml-1 h-5 w-5" /> Set First Goal
              </button>
            </div>
          )}
        </section>

        {/* Budget Modal */}
        <BudgetFormModal
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
          initialData={editingBudget}
          onSave={handleSaveBudget}
          isDarkMode={isDarkMode}
        />

        {/* Financial Goal Modal */}
        <FinancialGoalFormModal
          isOpen={isGoalModalOpen}
          onClose={() => setIsGoalModalOpen(false)}
          initialData={editingGoal}
          onSave={handleSaveGoal}
          isDarkMode={isDarkMode}
        />
      </main>
    </div>
  );
}
