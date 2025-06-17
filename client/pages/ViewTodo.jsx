import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'animate.css';
import { useTheme } from '../src/theme/ThemeProvider'; // Adjust path if necessary
import baseUrl from '../api/api'; // Adjust path if necessary

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
  List, 
  Star, 
  Bell, 
  XCircle,
  Edit,
  Clock,
  User
} from 'lucide-react';

const ViewTodo = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const navigate = useNavigate();
  const { id } = useParams(); // Get task ID from URL parameters

  const [todoData, setTodoData] = useState(null); // Null initially, then populated
  const [loading, setLoading] = useState(true);
  const [flashMessage, setFlashMessage] = useState(null);

  // --- THEME-AWARE STYLING (Enhanced version like ViewFinance) ---
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
    // Specific colors for priority tags
    priorityHigh: 'bg-red-600 text-white',
    priorityMedium: 'bg-yellow-500 text-gray-900',
    priorityLow: 'bg-green-600 text-white',
    // Specific colors for completion status
    statusCompleted: 'bg-green-500 text-white',
    statusPending: 'bg-orange-500 text-white',
    // Section styling
    sectionBg: isDarkMode ? 'bg-gray-700/30 border border-gray-600/30' : 'bg-gray-50/80 border border-gray-200/50',
  };

  // --- FETCH TASK DATA ON COMPONENT MOUNT ---
  useEffect(() => {
    const fetchTask = async () => {
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
        setTodoData(response.data);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch task details.';
        setFlashMessage({ type: 'error', message: errorMessage });
        setTimeout(() => navigate('/todo/dashboard'), 3000); // Redirect back on error
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    } else {
      setFlashMessage({ type: 'error', message: 'No task ID provided for viewing.' });
      setLoading(false);
      navigate('/todo/dashboard');
    }
  }, [id, navigate]); // Depend on 'id' and 'navigate'

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper to get priority tag classes
  const getPriorityClasses = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return themeClasses.priorityHigh;
      case 'medium': return themeClasses.priorityMedium;
      case 'low': return themeClasses.priorityLow;
      default: return 'bg-gray-400 text-white'; // Default for unknown priority
    }
  };

  // Helper to get completion status classes
  const getStatusClasses = (completed) => {
    return completed ? themeClasses.statusCompleted : themeClasses.statusPending;
  };

  // Helper to get priority display name
  const getPriorityDisplay = (priority) => {
    if (!priority) return 'Not Set';
    return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
  };

  // Helper to get type display name
  const getTypeDisplay = (type) => {
    if (!type) return 'General';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  // --- RENDER ---
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
            <p className={`mt-4 text-xl font-semibold ${themeClasses.text}`}>Loading Task Details...</p>
          </div>
        ) : todoData ? (
          <div className={`w-full max-w-4xl p-10 rounded-3xl ${themeClasses.cardBg} transition-all duration-700 animate__animated animate__fadeInUp animate__slow`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className={`text-4xl font-extrabold ${themeClasses.text} tracking-tight leading-tight`}>
                  Task Details
                </h2>
                <p className={`${themeClasses.textSecondary} mt-2 text-lg leading-relaxed`}>
                  Complete information about this task
                </p>
              </div>
              <button
                onClick={() => navigate('/todo/dashboard')}
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
                  {/* Title */}
                  <div className="flex items-start space-x-4">
                    <List size={20} className="mt-1 text-indigo-500 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>Title</h4>
                      <p className={`mt-1 text-xl font-bold ${themeClasses.textValue}`}>{todoData.title || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex items-start space-x-4">
                    <Info size={20} className="mt-1 text-blue-500 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>Description</h4>
                      <p className={`mt-1 text-lg ${themeClasses.textValue} leading-relaxed`}>{todoData.description || 'No description provided'}</p>
                    </div>
                  </div>

                  {/* Type */}
                  <div className="flex items-start space-x-4">
                    <Tag size={20} className="mt-1 text-purple-500 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>Type</h4>
                      <p className={`mt-1 text-lg ${themeClasses.textValue} capitalize`}>{getTypeDisplay(todoData.type)}</p>
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="flex items-start space-x-4">
                    <Star size={20} className="mt-1 text-yellow-500 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>Priority</h4>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getPriorityClasses(todoData.priority)}`}>
                          {getPriorityDisplay(todoData.priority)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Dates Section */}
              <div className={`p-6 rounded-2xl ${themeClasses.sectionBg}`}>
                <h3 className={`text-2xl font-bold ${themeClasses.text} mb-6 flex items-center`}>
                  <Clock size={24} className="mr-3 text-green-500" />
                  Status & Timeline
                </h3>
                
                <div className="space-y-5">
                  {/* Completion Status */}
                  <div className="flex items-start space-x-4">
                    <CheckCircle size={20} className="mt-1 text-green-500 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>Status</h4>
                      <div className="mt-2 flex items-center space-x-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusClasses(todoData.completed)}`}>
                          {todoData.completed ? 'Completed' : 'Pending'}
                        </span>
                        {todoData.completed && (
                          <span className="text-green-500 font-semibold text-xl">✓</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="flex items-start space-x-4">
                    <Calendar size={20} className="mt-1 text-orange-500 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>Due Date</h4>
                      <p className={`mt-1 text-lg font-medium ${themeClasses.textValue}`}>{formatDate(todoData.dueDate)}</p>
                    </div>
                  </div>

                  {/* Created Date - if available */}
                  {todoData.createdAt && (
                    <div className="flex items-start space-x-4">
                      <Calendar size={20} className="mt-1 text-gray-500 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>Created Date</h4>
                        <p className={`mt-1 text-lg ${themeClasses.textValue}`}>{formatDate(todoData.createdAt)}</p>
                      </div>
                    </div>
                  )}

                  {/* Updated Date - if available */}
                  {todoData.updatedAt && todoData.updatedAt !== todoData.createdAt && (
                    <div className="flex items-start space-x-4">
                      <Clock size={20} className="mt-1 text-blue-500 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>Last Updated</h4>
                        <p className={`mt-1 text-lg ${themeClasses.textValue}`}>{formatDate(todoData.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information - Full Width Sections */}
            <div className="mt-8 space-y-6">
              {/* Assigned User - Only show if exists */}
              {todoData.assignedTo && (
                <div className={`p-6 rounded-2xl ${themeClasses.sectionBg}`}>
                  <div className="flex items-center space-x-4">
                    <User size={24} className="text-teal-500 flex-shrink-0" />
                    <div>
                      <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>Assigned To</h4>
                      <p className={`mt-1 text-xl font-semibold ${themeClasses.textValue}`}>{todoData.assignedTo}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Reminder Status - Only show if exists */}
              {todoData.emailReminder !== undefined && (
                <div className={`p-6 rounded-2xl ${themeClasses.sectionBg}`}>
                  <div className="flex items-center space-x-4">
                    <Bell size={20} className="text-purple-500 flex-shrink-0" />
                    <div>
                      <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>Email Reminder</h4>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${todoData.emailReminder ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                          {todoData.emailReminder ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes Section - Only show if notes exist */}
              {todoData.notes && (
                <div className={`p-6 rounded-2xl ${themeClasses.sectionBg}`}>
                  <h3 className={`text-xl font-bold ${themeClasses.text} mb-4 flex items-center`}>
                    <Info size={20} className="mr-3 text-yellow-500" />
                    Notes
                  </h3>
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50 border border-gray-200'}`}>
                    <p className={`text-lg ${themeClasses.textValue} leading-relaxed`}>{todoData.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-8 flex justify-end space-x-4">
              <button
                onClick={() => navigate('/todo/dashboard')}
                className={`py-3 px-6 rounded-xl font-bold text-lg ${themeClasses.buttonSecondary} transform hover:-translate-y-1 active:scale-95 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}`}
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate(`/todo/edit/${todoData._id || todoData.id}`)} // Support both _id and id
                className={`py-3 px-6 rounded-xl font-bold text-lg ${themeClasses.buttonPrimary} transform hover:-translate-y-1 active:scale-95 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'} flex items-center space-x-2`}
              >
                <Edit size={20} />
                <span>Edit Task</span>
              </button>
            </div>
          </div>
        ) : (
          <div className={`w-full max-w-4xl p-10 rounded-3xl ${themeClasses.cardBg} flex flex-col items-center justify-center min-h-[300px] animate__animated animate__fadeIn`}>
            <AlertTriangle className={`w-10 h-10 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            <p className={`mt-4 text-xl font-semibold ${themeClasses.text}`}>Task not found or an error occurred.</p>
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

export default ViewTodo;









// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import 'animate.css';
// import { useTheme } from '../src/theme/ThemeProvider'; // Adjust path if necessary
// import baseUrl from '../api/api'; // Adjust path if necessary

// // Import Lucide React Icons
// import { ArrowLeft, Loader2, AlertTriangle, CheckCircle, Moon, Sun, Calendar, Tag, Info, List, Star, Bell } from 'lucide-react';

// const ViewTodo = () => {
//   const { theme, toggleTheme } = useTheme();
//   const isDarkMode = theme === 'dark';
//   const navigate = useNavigate();
//   const { id } = useParams(); // Get task ID from URL parameters

//   const [todoData, setTodoData] = useState(null); // Null initially, then populated
//   const [loading, setLoading] = useState(true);
//   const [flashMessage, setFlashMessage] = useState(null);

//   // --- THEME-AWARE STYLING (Consistent with AddTodo) ---
//   const themeClasses = {
//     bg: isDarkMode
//       ? 'bg-gradient-to-br from-gray-900 via-gray-950 to-black'
//       : 'bg-white',
//     cardBg: isDarkMode
//       ? 'bg-gray-800/60 backdrop-blur-lg border border-gray-700/50'
//       : 'bg-white shadow-2xl border border-gray-100',
//     text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
//     textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
//     textMuted: isDarkMode ? 'text-gray-500' : 'text-gray-400', // For labels
//     textValue: isDarkMode ? 'text-gray-200' : 'text-gray-800', // For actual values
//     buttonSecondary: isDarkMode ? 'bg-gray-700/50 hover:bg-gray-600/70 text-gray-200 shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-md',
//     // Specific colors for priority tags
//     priorityHigh: 'bg-red-500 text-white',
//     priorityMedium: 'bg-yellow-500 text-gray-900',
//     priorityLow: 'bg-green-500 text-white',
//   };

//   // --- FETCH TASK DATA ON COMPONENT MOUNT ---
//   useEffect(() => {
//     const fetchTask = async () => {
//       setLoading(true);
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         setFlashMessage({ type: 'error', message: 'Authentication required. Please log in.' });
//         setLoading(false);
//         navigate('/login');
//         return;
//       }

//       try {
//         const response = await baseUrl.get(`/api/tasks/${id}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setTodoData(response.data);
//       } catch (error) {
//         const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch task details.';
//         setFlashMessage({ type: 'error', message: errorMessage });
//         setTimeout(() => navigate('/todo/dashboard'), 3000); // Redirect back on error
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchTask();
//     } else {
//       setFlashMessage({ type: 'error', message: 'No task ID provided for viewing.' });
//       setLoading(false);
//       navigate('/todo/dashboard');
//     }
//   }, [id, navigate]); // Depend on 'id' and 'navigate'

//   // Helper to format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   // Helper to get priority tag classes
//   const getPriorityClasses = (priority) => {
//     switch (priority) {
//       case 'high': return themeClasses.priorityHigh;
//       case 'medium': return themeClasses.priorityMedium;
//       case 'low': return themeClasses.priorityLow;
//       default: return 'bg-gray-400 text-white'; // Default for unknown priority
//     }
//   };

//   // --- RENDER ---
//   return (
//     <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${themeClasses.bg} font-sans antialiased transition-colors duration-700 relative overflow-hidden`}>
//       {/* Dynamic Background Elements */}
//       {!isDarkMode && (
//         <>
//           <div className={`absolute top-1/4 left-1/4 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob bg-indigo-200`}></div>
//           <div className={`absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000 bg-purple-200`}></div>
//           <div className={`absolute top-1/2 left-1/2 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000 bg-teal-200`}></div>
//         </>
//       )}
//       {isDarkMode && (
//         <>
//           <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob bg-purple-600`}></div>
//           <div className={`absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000 bg-indigo-600`}></div>
//           <div className={`absolute top-1/2 left-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000 bg-teal-600`}></div>
//         </>
//       )}

//       {/* --- THEME TOGGLE BUTTON --- */}
//       <div className="fixed top-6 right-6 z-50">
//         <button
//           onClick={toggleTheme}
//           className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 ${themeClasses.buttonSecondary} focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-950' : 'focus:ring-offset-white'} focus:ring-indigo-500 shadow-md`}
//           aria-label="Toggle theme"
//           title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
//         >
//           {isDarkMode ? (
//             <Sun className="w-6 h-6 text-yellow-300 animate__animated animate__fadeIn animate__faster" />
//           ) : (
//             <Moon className="w-6 h-6 text-indigo-700 animate__animated animate__fadeIn animate__faster" />
//           )}
//         </button>
//       </div>

//       <main className="relative z-10 container mx-auto py-12 px-4 flex-grow flex items-center justify-center">
//         {/* Flash Messages */}
//         {flashMessage && (
//           <div className={`fixed top-24 right-6 z-50 max-w-xs md:max-w-sm p-4 rounded-xl shadow-2xl flex items-start space-x-3 transform animate__animated ${flashMessage.type === 'error' ? 'animate__shakeX bg-red-600 text-white' : 'animate__fadeInDown bg-green-600 text-white'} transition-all duration-300`}
//           >
//             {flashMessage.type === 'error' ? (
//               <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
//             ) : (
//               <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
//             )}
//             <span className="font-medium text-base leading-tight">{flashMessage.message}</span>
//             <button onClick={() => setFlashMessage(null)} className="ml-auto p-1 rounded-full hover:bg-white/20 transition-colors self-start">
//               <XCircle size={20} />
//             </button>
//           </div>
//         )}

//         {loading ? (
//           <div className={`w-full max-w-2xl p-10 rounded-3xl ${themeClasses.cardBg} flex flex-col items-center justify-center min-h-[300px] animate__animated animate__fadeIn`}>
//             <Loader2 className={`w-10 h-10 animate-spin ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
//             <p className={`mt-4 text-xl font-semibold ${themeClasses.text}`}>Loading Task Details...</p>
//           </div>
//         ) : todoData ? (
//           <div className={`w-full max-w-2xl p-10 rounded-3xl ${themeClasses.cardBg} transition-all duration-700 animate__animated animate__fadeInUp animate__slow`}>
//             <div className="flex justify-between items-center mb-8">
//               <h2 className={`text-4xl font-extrabold ${themeClasses.text} tracking-tight leading-tight`}>
//                 Task Details
//               </h2>
//               <button
//                 onClick={() => navigate('/todo/dashboard')}
//                 className={`p-3 rounded-full ${themeClasses.buttonSecondary} transition-all duration-300 hover:scale-105 shadow-md`}
//                 title="Return to Dashboard"
//               >
//                 <ArrowLeft size={24} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
//               </button>
//             </div>

//             <p className={`${themeClasses.textSecondary} mb-10 text-lg leading-relaxed`}>
//               A comprehensive overview of your task.
//             </p>

//             <div className="space-y-6">
//               {/* Title */}
//               <div>
//                 <h3 className={`text-lg font-bold ${themeClasses.textMuted} flex items-center`}>
//                   <List size={20} className="mr-2 text-indigo-500" /> Title:
//                 </h3>
//                 <p className={`mt-2 text-xl font-semibold ${themeClasses.textValue} pl-7`}>{todoData.title}</p>
//               </div>

//               {/* Description */}
//               <div>
//                 <h3 className={`text-lg font-bold ${themeClasses.textMuted} flex items-center`}>
//                   <Info size={20} className="mr-2 text-indigo-500" /> Description:
//                 </h3>
//                 <p className={`mt-2 text-lg ${themeClasses.textValue} leading-relaxed pl-7`}>{todoData.description}</p>
//               </div>
             
//               {/* Priority */}
//               <div>
//                 <h3 className={`text-lg font-bold ${themeClasses.textMuted} flex items-center`}>
//                   <Star size={20} className="mr-2 text-indigo-500" /> Priority:
//                 </h3>
//                 <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mt-2 ml-7 ${getPriorityClasses(todoData.priority)} capitalize`}>
//                   {todoData.priority}
//                 </span>
//               </div>

//               {/* Due Date */}
//               <div>
//                 <h3 className={`text-lg font-bold ${themeClasses.textMuted} flex items-center`}>
//                   <Calendar size={20} className="mr-2 text-indigo-500" /> Due Date:
//                 </h3>
//                 <p className={`mt-2 text-lg ${themeClasses.textValue} pl-7`}>{formatDate(todoData.dueDate)}</p>
//               </div>

//               {/* Type */}
//               <div>
//                 <h3 className={`text-lg font-bold ${themeClasses.textMuted} flex items-center`}>
//                   <Tag size={20} className="mr-2 text-indigo-500" /> Type:
//                 </h3>
//                 <p className={`mt-2 text-lg ${themeClasses.textValue} capitalize pl-7`}>{todoData.type}</p>
//               </div>

//               {/*Completion Status*/}
//               <div>
//                 <h3 className={`text-lg font-bold ${themeClasses.textMuted} flex items-center`}>
//                   <CheckCircle size={20} className="mr-2 text-indigo-500"
//                   /> Completion Status:
//                 </h3>
//                 <p className={`mt-2 text-lg ${themeClasses.textValue} pl-7`}>
//                   {todoData.completed ? 'Completed' : 'Pending'}  
//                   {todoData.completed && (
//                     <span className="text-green-500 font-semibold ml-2">✓</span>
//                   )}
//                 </p>
//               </div>

//                {todoData.emailReminder !== undefined && (
//                 <div className={`p-6 rounded-2xl ${themeClasses.sectionBg}`}>
//                   <div className="flex items-center space-x-4">
//                     <Bell size={20} className="text-purple-500 flex-shrink-0" />
//                     <div>
//                       <h4 className={`font-semibold ${themeClasses.textMuted} text-sm uppercase tracking-wide`}>Email Reminder</h4>
//                       <div className="mt-2 flex items-center space-x-2">
//                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${todoData.emailReminder ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
//                           {todoData.emailReminder ? 'Enabled' : 'Disabled'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Add more fields here if needed, e.g., createdDate, status, etc. */}
//             </div>

//             {/* Action Buttons */}
//             <div className="pt-8 flex justify-end">
//               <button
//                 onClick={() => navigate(`/todo/edit/${todoData._id}`)} // Assuming _id is the task ID
//                 className={`py-3 px-6 rounded-xl font-bold text-lg ${themeClasses.buttonPrimary} transform hover:-translate-y-1 active:scale-95 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}`}
//               >
//                 Edit Task
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className={`w-full max-w-2xl p-10 rounded-3xl ${themeClasses.cardBg} flex flex-col items-center justify-center min-h-[300px] animate__animated animate__fadeIn`}>
//             <AlertTriangle className={`w-10 h-10 ${themeClasses.errorText}`} />
//             <p className={`mt-4 text-xl font-semibold ${themeClasses.text}`}>Task not found or an error occurred.</p>
//             <button
//                 onClick={() => navigate('/todo/dashboard')}
//                 className={`mt-6 py-3 px-6 rounded-xl font-bold ${themeClasses.buttonSecondary} transform hover:-translate-y-0.5 active:scale-95 transition-all duration-300`}
//             >
//                 Go to Dashboard
//             </button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ViewTodo;
