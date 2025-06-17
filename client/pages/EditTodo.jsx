// src/components/EditTodo.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import baseUrl from '../api/api';
import 'animate.css'; 
import { useTheme } from '../src/theme/ThemeProvider'; 

// Import Lucide React Icons
import { ArrowLeft, Loader2, AlertTriangle, CheckCircle, XCircle, Moon, Sun, Save, Calendar } from 'lucide-react';

const EditTodo = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const navigate = useNavigate();
  const { id } = useParams(); // Get todo ID from URL parameters

  const [todoData, setTodoData] = useState({
    title: '',
    description: '',
    priority: '',
    type: '',
    dateAdded: '',
    dueDate: '',
    completed: false,
    emailReminder: false
  });
  const [loading, setLoading] = useState(true); // Initial load for fetching data
  const [saving, setSaving] = useState(false); // For form submission
  const [flashMessage, setFlashMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

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
    textHighlight: isDarkMode ? 'text-indigo-400' : 'text-indigo-600',
    inputBg: isDarkMode ? 'bg-gray-700/40' : 'bg-gray-50 shadow-inner',
    inputBorder: isDarkMode ? 'border-gray-600 focus:border-indigo-500' : 'border-gray-200 focus:border-indigo-500',
    focusRing: 'focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-60',
    buttonPrimary: 'bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl',
    buttonSecondary: isDarkMode ? 'bg-gray-700/50 hover:bg-gray-600/70 text-gray-200 shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-md',
    errorText: 'text-red-500'
  };

  // --- FETCH TODO DATA ON COMPONENT MOUNT ---
  useEffect(() => {
    const fetchTodo = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        setFlashMessage({ type: 'error', message: 'Authentication required. Please log in.' });
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        const response = await baseUrl.get(`/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Set the response data to match the frontend structure
        const data = response.data;
        setTodoData({
          title: data.title || '',
          description: data.description || '',
          priority: data.priority || '',
          type: data.type || '',
          dateAdded: data.dateAdded ? new Date(data.dateAdded).toISOString().split('T')[0] : '',
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : '',
          completed: data.completed || false,
          emailReminder: data.emailReminder || false
        });
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch todo details.';
        setFlashMessage({ type: 'error', message: errorMessage });
        setTimeout(() => navigate('/todo/dashboard'), 3000);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTodo();
    } else {
      setFlashMessage({ type: 'error', message: 'No todo ID provided for editing.' });
      setLoading(false);
      navigate('/todo/dashboard');
    }
  }, [id, navigate]);

  // --- FORM HANDLING ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTodoData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setFieldErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFlashMessage(null);
    setFieldErrors({});

    // Validate required fields
    if (
      !todoData.title ||
      !todoData.description ||
      !todoData.priority ||
      !todoData.type ||
      !todoData.dateAdded
    ) {
      setFlashMessage({ type: 'error', message: 'Please fill in all required fields.' });
      setTimeout(() => setFlashMessage(null), 4000);
      return;
    }

    setSaving(true);
    const token = localStorage.getItem('authToken');

    // Prepare payload - all fields match the API response structure
    const payload = {
      title: todoData.title,
      description: todoData.description,
      priority: todoData.priority,
      type: todoData.type,
      dateAdded: todoData.dateAdded,
      dueDate: todoData.dueDate || null,
      completed: todoData.completed,
      emailReminder: todoData.emailReminder
    };

    try {
      await baseUrl.put(`/api/tasks/update/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      setFlashMessage({ type: 'success', message: 'Todo updated successfully!' });
      setTimeout(() => {
        setFlashMessage(null);
        navigate('/todo/dashboard');
      }, 2000);
    } catch (error) {
      console.error('API Error:', error);
      
      // Handle field errors from backend
      let errorMessage = 
        error.response?.data?.error ||
        error.response?.data?.message || 
        error.message || 
        'An unexpected error occurred during update.';

      // If backend returns field errors as an object
      if (
        error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        !Array.isArray(error.response.data)
      ) {
        setFieldErrors(error.response.data);
        const firstFieldError = Object.values(error.response.data)[0];
        if (firstFieldError) errorMessage = firstFieldError;
      } else {
        setFieldErrors({});
      }

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
            <p className={`mt-4 text-xl font-semibold ${themeClasses.text}`}>Loading Todo...</p>
          </div>
        ) : todoData ? (
          <div className={`w-full max-w-3xl p-10 rounded-3xl ${themeClasses.cardBg} transition-all duration-700 animate__animated animate__fadeInUp animate__slow`}>
            <div className="flex justify-between items-center mb-8">
              <h2 className={`text-4xl font-extrabold ${themeClasses.text} tracking-tight leading-tight`}>
                Edit Todo
              </h2>
              <button
                onClick={() => navigate('/todo/dashboard')}
                className={`p-3 rounded-full ${themeClasses.buttonSecondary} transition-all duration-300 hover:scale-105 shadow-md`}
                title="Return to Dashboard"
              >
                <ArrowLeft size={24} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
              </button>
            </div>

            <p className={`${themeClasses.textSecondary} mb-10 text-lg leading-relaxed`}>
              Make changes to your todo item and save them.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              {/* Title */}
              <div>
                <label htmlFor="title" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Title <span className={themeClasses.textHighlight}>*</span></label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={todoData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Complete project proposal, Buy groceries"
                  className={`mt-1 w-full border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300`}
                />
                {fieldErrors.title && (
                  <div className={`${themeClasses.errorText} text-xs mt-1`}>{fieldErrors.title}</div>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Description <span className={themeClasses.textHighlight}>*</span></label>
                <textarea
                  id="description"
                  name="description"
                  value={todoData.description}
                  onChange={handleChange}
                  rows="4"
                  required
                  placeholder="Provide detailed description of the task..."
                  className={`mt-1 w-full border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300`}
                ></textarea>
                {fieldErrors.description && (
                  <div className={`${themeClasses.errorText} text-xs mt-1`}>{fieldErrors.description}</div>
                )}
              </div>

              {/* Priority, Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="priority" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Priority <span className={themeClasses.textHighlight}>*</span></label>
                  <select
                    id="priority"
                    name="priority"
                    value={todoData.priority}
                    onChange={handleChange}
                    required
                    className={`mt-1 w-full border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300 appearance-none pr-10 custom-select-arrow`}
                  >
                    <option value="">Select Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  {fieldErrors.priority && (
                    <div className={`${themeClasses.errorText} text-xs mt-1`}>{fieldErrors.priority}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="type" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Type <span className={themeClasses.textHighlight}>*</span></label>
                  <select
                    id="type"
                    name="type"
                    value={todoData.type}
                    onChange={handleChange}
                    required
                    className={`mt-1 w-full border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300 appearance-none pr-10 custom-select-arrow`}
                  >
                    <option value="">Select Type</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="shopping">Shopping</option>
                    <option value="health">Health</option>
                    <option value="education">Education</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="other">Other</option>
                  </select>
                  {fieldErrors.type && (
                    <div className={`${themeClasses.errorText} text-xs mt-1`}>{fieldErrors.type}</div>
                  )}
                </div>
              </div>

              {/* Date Added & Due Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="dateAdded" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Date Added <span className={themeClasses.textHighlight}>*</span></label>
                  <input
                    type="date"
                    id="dateAdded"
                    name="dateAdded"
                    value={todoData.dateAdded}
                    onChange={handleChange}
                    required
                    className={`mt-1 w-full border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300`}
                  />
                  {fieldErrors.dateAdded && (
                    <div className={`${themeClasses.errorText} text-xs mt-1`}>{fieldErrors.dateAdded}</div>
                  )}
                </div>
                <div>
                  <label htmlFor="dueDate" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Due Date</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={todoData.dueDate}
                    onChange={handleChange}
                    className={`mt-1 w-full border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300`}
                  />
                  {fieldErrors.dueDate && (
                    <div className={`${themeClasses.errorText} text-xs mt-1`}>{fieldErrors.dueDate}</div>
                  )}
                </div>
              </div>

              {/* Completed Status */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="completed"
                  name="completed"
                  checked={todoData.completed}
                  onChange={handleChange}
                  className={`w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2`}
                />
                <label htmlFor="completed" className={`text-sm font-semibold ${themeClasses.textSecondary}`}>
                  Mark as completed
                </label>
              </div>

              {/* Email Reminder */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="emailReminder"
                  name="emailReminder"
                  checked={todoData.emailReminder}
                  onChange={handleChange}
                  className={`w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2`}
                />
                <label htmlFor="emailReminder" className={`text-sm font-semibold ${themeClasses.textSecondary}`}>
                  Send email reminder on due date
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={saving}
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
            <p className={`mt-4 text-xl font-semibold ${themeClasses.text}`}>Todo not found or an error occurred.</p>
            <button
                onClick={() => navigate('/todo/dashboard')}
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

export default EditTodo;