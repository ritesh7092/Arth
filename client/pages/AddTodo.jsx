
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'animate.css'; // Ensure animate.css is imported
import { useTheme } from '../src/theme/ThemeProvider'; // Adjust path if necessary
import baseUrl from '../api/api'; // Adjust path if necessary

// Import Lucide React Icons for a modern look
import { PlusCircle, XCircle, ArrowLeft, Loader2, AlertTriangle, CheckCircle, Moon, Sun } from 'lucide-react';

const AddTodo = () => {
  // --- STATE MANAGEMENT & THEME HOOK ---
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [todoData, setTodoData] = useState({
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    type: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState(null);
  const navigate = useNavigate();

  // --- THEME-AWARE STYLING (Refined for Premium Light & Dark) ---
  const themeClasses = {
    // Background: Clean white with subtle texture for light, deep rich for dark
    bg: isDarkMode
      ? 'bg-gradient-to-br from-gray-900 via-gray-950 to-black'
      : 'bg-white', // Pure white background for a clean look

    // Card Background: Truly frosted glass for dark, crisp white with soft shadow for light
    cardBg: isDarkMode
      ? 'bg-gray-800/60 backdrop-blur-lg border border-gray-700/50'
      : 'bg-white shadow-2xl border border-gray-100', // Solid white with a prominent, soft shadow for premium feel

    // Text Colors
    text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    textHighlight: isDarkMode ? 'text-indigo-400' : 'text-indigo-600',

    // Input Styles: Subtle transparency for dark, light with soft shadow for light
    inputBg: isDarkMode ? 'bg-gray-700/40' : 'bg-gray-50 shadow-inner', // Light gray background for inputs in light mode
    inputBorder: isDarkMode ? 'border-gray-600 focus:border-indigo-500' : 'border-gray-200 focus:border-indigo-500', // Softer border for light mode
    focusRing: 'focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-60',

    // Button Primary: Consistent vibrant gradient
    buttonPrimary: 'bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl',

    // Button Secondary: Elegant, subtle contrast, better on light
    buttonSecondary: isDarkMode ? 'bg-gray-700/50 hover:bg-gray-600/70 text-gray-200 shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-md',

    // Error Text
    errorText: 'text-red-500' // Stronger red for visibility on white
  };

  // --- FORM HANDLING ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTodoData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!todoData.title.trim()) newErrors.title = 'A clear task title is required.';
    if (!todoData.description.trim()) newErrors.description = 'Please provide a detailed description.';
    if (!todoData.priority) newErrors.priority = 'Please select a priority level.';
    if (!todoData.dueDate) newErrors.dueDate = 'A due date is essential for planning.';
    if (!todoData.type) newErrors.type = 'Please categorize your task type.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFlashMessage(null);

    if (!validateForm()) {
      setFlashMessage({ type: 'error', message: 'Please correct the highlighted errors before submitting.' });
      setTimeout(() => setFlashMessage(null), 4000);
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('authToken');
    if (!token) {
      setFlashMessage({ type: 'error', message: 'Authentication required. Please log in again.' });
      setLoading(false);
      setTimeout(() => setFlashMessage(null), 4000);
      return;
    }

    baseUrl.post('/api/tasks/create', todoData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
    .then(response => {
      setFlashMessage({ type: 'success', message: 'Task created successfully! Redirecting...' });
      setTimeout(() => {
        setFlashMessage(null);
        navigate('/todo/dashboard');
      }, 2000);
    })
    .catch(error => {
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.';
      setFlashMessage({ type: 'error', message: errorMessage });
      setTimeout(() => setFlashMessage(null), 5000);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  // --- RENDER ---
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${themeClasses.bg} font-sans antialiased transition-colors duration-700 relative overflow-hidden`}>
      {/* Dynamic Background Elements - More subtle/removed for clean white */}
      {!isDarkMode && (
        <>
          {/* Subtle light background blobs for texture on white */}
          <div className={`absolute top-1/4 left-1/4 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob bg-indigo-200`}></div>
          <div className={`absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000 bg-purple-200`}></div>
          <div className={`absolute top-1/2 left-1/2 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000 bg-teal-200`}></div>
        </>
      )}
      {isDarkMode && (
        <>
          {/* Dark background blobs (more prominent) */}
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob bg-purple-600`}></div>
          <div className={`absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000 bg-indigo-600`}></div>
          <div className={`absolute top-1/2 left-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000 bg-teal-600`}></div>
        </>
      )}


      {/* --- START: THEME TOGGLE BUTTON (Precise Positioning & Perfect Shape) --- */}
      {/* Fixed position, ensuring it stays visible even when scrolling (though this page won't scroll much) */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          // The key to a perfect circle: equal padding, and rounded-full
          // Using `w-12 h-12` and `flex items-center justify-center` for explicit sizing and centering
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
      {/* --- END: THEME TOGGLE BUTTON --- */}

      <main className="relative z-10 container mx-auto py-12 px-4 flex-grow flex items-center justify-center">
        {/* Flash Messages (Sophisticated) */}
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

        <div className={`w-full max-w-2xl p-10 rounded-3xl ${themeClasses.cardBg} transition-all duration-700 animate__animated animate__fadeInUp animate__slow`}>
          <div className="flex justify-between items-center mb-8">
            <h2 className={`text-4xl font-extrabold ${themeClasses.text} tracking-tight leading-tight`}>
              Craft Your New Task
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
            Enter the details for your task below. Thoughtful planning leads to successful execution.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {/* Title */}
            <div>
              <label htmlFor="title" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Task Title <span className={themeClasses.textHighlight}>*</span></label>
              <input
                type="text"
                id="title"
                name="title"
                value={todoData.title}
                onChange={handleChange}
                placeholder="e.g., Finalize Q3 Marketing Strategy Report"
                className={`mt-1 w-full border ${errors.title ? 'border-red-500' : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300`}
                aria-invalid={errors.title ? "true" : "false"}
                aria-describedby="title-error"
              />
              {errors.title && <p id="title-error" className={`${themeClasses.errorText} text-sm mt-2 flex items-center animate__animated animate__headShake animate__faster`}><XCircle size={16} className="mr-1.5" />{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Task Description <span className={themeClasses.textHighlight}>*</span></label>
              <textarea
                id="description"
                name="description"
                value={todoData.description}
                onChange={handleChange}
                placeholder="Provide a comprehensive description of the task, including key objectives and steps."
                rows="5"
                className={`mt-1 w-full border ${errors.description ? 'border-red-500' : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300`}
                aria-invalid={errors.description ? "true" : "false"}
                aria-describedby="description-error"
              ></textarea>
              {errors.description && <p id="description-error" className={`${themeClasses.errorText} text-sm mt-2 flex items-center animate__animated animate__headShake animate__faster`}><XCircle size={16} className="mr-1.5" />{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Priority */}
              <div>
                <label htmlFor="priority" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Priority Level <span className={themeClasses.textHighlight}>*</span></label>
                <select
                  id="priority"
                  name="priority"
                  value={todoData.priority}
                  onChange={handleChange}
                  className={`mt-1 w-full border ${errors.priority ? 'border-red-500' : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300 appearance-none pr-10 custom-select-arrow`} // Custom select arrow via CSS
                  aria-invalid={errors.priority ? "true" : "false"}
                  aria-describedby="priority-error"
                >
                  <option value="">-- Select Priority --</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                {errors.priority && <p id="priority-error" className={`${themeClasses.errorText} text-sm mt-2 flex items-center animate__animated animate__headShake animate__faster`}><XCircle size={16} className="mr-1.5" />{errors.priority}</p>}
              </div>

              {/* Due Date */}
              <div>
                <label htmlFor="dueDate" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Due Date <span className={themeClasses.textHighlight}>*</span></label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={todoData.dueDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]} // Ensures past dates cannot be selected
                  className={`mt-1 w-full border ${errors.dueDate ? 'border-red-500' : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300`}
                  aria-invalid={errors.dueDate ? "true" : "false"}
                  aria-describedby="dueDate-error"
                />
                {errors.dueDate && <p id="dueDate-error" className={`${themeClasses.errorText} text-sm mt-2 flex items-center animate__animated animate__headShake animate__faster`}><XCircle size={16} className="mr-1.5" />{errors.dueDate}</p>}
              </div>
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Task Type <span className={themeClasses.textHighlight}>*</span></label>
              <select
                id="type"
                name="type"
                value={todoData.type}
                onChange={handleChange}
                className={`mt-1 w-full border ${errors.type ? 'border-red-500' : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300 appearance-none pr-10 custom-select-arrow`}
                aria-invalid={errors.type ? "true" : "false"}
                aria-describedby="type-error"
              >
                <option value="">-- Select Type --</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="health">Health & Fitness</option>
                <option value="learning">Learning</option>
                <option value="finance">Finance</option>
                <option value="social">Social</option>
                <option value="home">Home & Chores</option>
              </select>
              {errors.type && <p id="type-error" className={`${themeClasses.errorText} text-sm mt-2 flex items-center animate__animated animate__headShake animate__faster`}><XCircle size={16} className="mr-1.5" />{errors.type}</p>}
            </div>

            {/* Action Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center py-4 px-8 rounded-xl font-bold text-lg ${themeClasses.buttonPrimary} transform hover:-translate-y-1 active:scale-95 transition-all duration-300 ease-out disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}`}
              >
                {loading ? (
                  <> <Loader2 className="w-6 h-6 mr-3 animate-spin" /> Creating Task... </>
                ) : (
                  <> <PlusCircle className="w-6 h-6 mr-3" /> Create Task </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddTodo;








// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import 'animate.css';
// import { useTheme } from '../theme/ThemeProvider';
// import baseUrl from '../api/api';

// // Import Lucide React Icons, including Sun and Moon for the toggler
// import { PlusCircle, XCircle, ArrowLeft, Loader2, AlertTriangle, CheckCircle, Moon, Sun } from 'lucide-react';

// const AddTodo = () => {
//   // --- STATE MANAGEMENT & THEME HOOK ---
//   // Get both `theme` and `toggleTheme` from the hook
//   const { theme, toggleTheme } = useTheme(); 
//   const isDarkMode = theme === 'dark';

//   const [todoData, setTodoData] = useState({
//     title: '',
//     description: '',
//     priority: '',
//     dueDate: '',
//     type: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [flashMessage, setFlashMessage] = useState(null);
//   const navigate = useNavigate();

//   // --- THEME-AWARE STYLING ---
//   const themeClasses = {
//     bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
//     cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
//     text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
//     textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
//     inputBg: isDarkMode ? 'bg-gray-700' : 'bg-white',
//     inputBorder: isDarkMode ? 'border-gray-600' : 'border-gray-300',
//     focusRing: 'focus:ring-indigo-500',
//     buttonPrimary: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700',
//     buttonSecondary: isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
//   };

//   // --- FORM HANDLING ---
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTodoData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: null }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!todoData.title.trim()) newErrors.title = 'Title is required.';
//     if (!todoData.description.trim()) newErrors.description = 'Description is required.';
//     if (!todoData.priority) newErrors.priority = 'Priority must be selected.';
//     if (!todoData.dueDate) newErrors.dueDate = 'Due date is required.';
//     if (!todoData.type) newErrors.type = 'Type must be selected.';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setFlashMessage(null);
//     if (!validateForm()) return;

//     setLoading(true);
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       setFlashMessage({ type: 'error', message: 'Authentication error. Please log in again.' });
//       setLoading(false);
//       setTimeout(() => setFlashMessage(null), 4000);
//       return;
//     }

//     baseUrl.post('/api/tasks/create', todoData, {
//       headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
//     })
//     .then(response => {
//       setFlashMessage({ type: 'success', message: 'Task created successfully! Redirecting...' });
//       setTimeout(() => {
//         setFlashMessage(null);
//         navigate('/todo/dashboard');
//       }, 2000);
//     })
//     .catch(error => {
//       const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.';
//       setFlashMessage({ type: 'error', message: errorMessage });
//       setTimeout(() => setFlashMessage(null), 4000);
//     })
//     .finally(() => {
//       setLoading(false);
//     });
//   };

//   // --- RENDER ---
//   return (
//     <div className={`min-h-screen ${themeClasses.bg} font-sans transition-colors duration-300`}>
//       {/* --- START: THEME TOGGLE BUTTON --- */}
//       <div className="absolute top-5 right-5 z-50">
//         <button
//           onClick={toggleTheme}
//           className={`p-3 rounded-full transition-all duration-300 shadow-md ${themeClasses.buttonSecondary}`}
//           aria-label="Toggle theme"
//           title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
//         >
//           {isDarkMode ? (
//             <Sun className="w-5 h-5 text-yellow-400" />
//           ) : (
//             <Moon className="w-5 h-5 text-indigo-700" />
//           )}
//         </button>
//       </div>
//       {/* --- END: THEME TOGGLE BUTTON --- */}

//       <main className="container mx-auto py-10 px-4 flex-grow">
//         {flashMessage && (
//           <div className={`fixed top-20 right-5 z-50 max-w-sm p-4 rounded-lg shadow-2xl flex items-center animate__animated animate__fadeInRight ${
//               flashMessage.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
//             }`}
//           >
//             {flashMessage.type === 'error' ? (
//               <AlertTriangle className="w-6 h-6 mr-3 flex-shrink-0" />
//             ) : (
//               <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
//             )}
//             <span>{flashMessage.message}</span>
//             <button onClick={() => setFlashMessage(null)} className="ml-4 text-white hover:text-gray-200">
//               <XCircle size={20} />
//             </button>
//           </div>
//         )}

//         <div className={`max-w-2xl mx-auto ${themeClasses.cardBg} p-8 rounded-2xl shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-transparent'} transition-all duration-300 mt-10`}>
//           <div className="flex justify-between items-center mb-6">
//             <h2 className={`text-3xl font-bold ${themeClasses.text}`}>
//               Create a New Task
//             </h2>
//             <button
//               onClick={() => navigate('/todo/dashboard')}
//               className={`p-2 rounded-full ${themeClasses.buttonSecondary} ${themeClasses.textSecondary} transition-transform duration-300 hover:scale-110`}
//               title="Back to Dashboard"
//             >
//               <ArrowLeft size={20} />
//             </button>
//           </div>
          
//           <p className={`${themeClasses.textSecondary} mb-8`}>
//             Fill in the details below to add a new task to your dashboard.
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-6" noValidate>
//             {/* Title */}
//             <div>
//               <label htmlFor="title" className={`block text-sm font-semibold ${themeClasses.textSecondary}`}>TODO Name</label>
//               <input type="text" id="title" name="title" value={todoData.title} onChange={handleChange} placeholder="e.g., Finalize project report" className={`mt-2 w-full border ${errors.title ? 'border-red-500' : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${themeClasses.focusRing} transition`} />
//               {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
//             </div>

//             {/* Description */}
//             <div>
//               <label htmlFor="description" className={`block text-sm font-semibold ${themeClasses.textSecondary}`}>Task Description</label>
//               <textarea id="description" name="description" value={todoData.description} onChange={handleChange} placeholder="Add more details about the task..." rows="4" className={`mt-2 w-full border ${errors.description ? 'border-red-500' : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${themeClasses.focusRing} transition`}></textarea>
//               {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Priority */}
//               <div>
//                 <label htmlFor="priority" className={`block text-sm font-semibold ${themeClasses.textSecondary}`}>Priority</label>
//                 <select id="priority" name="priority" value={todoData.priority} onChange={handleChange} className={`mt-2 w-full border ${errors.priority ? 'border-red-500' : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${themeClasses.focusRing} transition`}>
//                   <option value="">Select Priority</option>
//                   <option value="high">High</option>
//                   <option value="medium">Medium</option>
//                   <option value="low">Low</option>
//                 </select>
//                 {errors.priority && <p className="text-red-500 text-xs mt-1">{errors.priority}</p>}
//               </div>

//               {/* Due Date */}
//               <div>
//                 <label htmlFor="dueDate" className={`block text-sm font-semibold ${themeClasses.textSecondary}`}>Due Date</label>
//                 <input type="date" id="dueDate" name="dueDate" value={todoData.dueDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className={`mt-2 w-full border ${errors.dueDate ? 'border-red-500' : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${themeClasses.focusRing} transition`}/>
//                 {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
//               </div>
//             </div>

//             {/* Type */}
//             <div>
//               <label htmlFor="type" className={`block text-sm font-semibold ${themeClasses.textSecondary}`}>Type</label>
//               <select id="type" name="type" value={todoData.type} onChange={handleChange} className={`mt-2 w-full border ${errors.type ? 'border-red-500' : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${themeClasses.focusRing} transition`}>
//                 <option value="">Select Type</option>
//                 <option value="official">Official</option>
//                 <option value="family">Family</option>
//                 <option value="personal">Personal</option>
//               </select>
//               {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-end pt-4">
//               <button type="submit" disabled={loading} className={`w-full flex items-center justify-center ${themeClasses.buttonPrimary} text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed`}>
//                 {loading ? (
//                   <> <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creating... </>
//                 ) : (
//                   <> <PlusCircle className="w-5 h-5 mr-2" /> Create Task </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AddTodo;










// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import 'animate.css'; // For animations
// // import { useTheme } from '../src/theme/ThemeProvider'; // Import the theme hook
// // import baseUrl from '../api/api';

// // // Import Lucide React Icons for a modern look
// // import { PlusCircle, XCircle, ArrowLeft, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

// // const AddTodo = () => {
// //   // --- STATE MANAGEMENT ---
// //   const { theme } = useTheme(); // Use the theme from your context
// //   const isDarkMode = theme === 'dark';

// //   const [todoData, setTodoData] = useState({
// //     title: '',
// //     description: '',
// //     priority: '',
// //     dueDate: '',
// //     type: ''
// //   });
// //   const [errors, setErrors] = useState({});
// //   const [loading, setLoading] = useState(false);
// //   const [flashMessage, setFlashMessage] = useState(null);
// //   const navigate = useNavigate();

// //   // --- THEME-AWARE STYLING ---
// //   // Central object for theme-specific Tailwind CSS classes
// //   const themeClasses = {
// //     bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
// //     cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
// //     text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
// //     textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
// //     inputBg: isDarkMode ? 'bg-gray-700' : 'bg-white',
// //     inputBorder: isDarkMode ? 'border-gray-600' : 'border-gray-300',
// //     focusRing: 'focus:ring-indigo-500',
// //     buttonPrimary: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700',
// //     buttonSecondary: isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
// //   };

// //   // --- FORM HANDLING ---
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setTodoData(prev => ({ ...prev, [name]: value }));
// //     // Clear validation error when user starts typing
// //     if (errors[name]) {
// //       setErrors(prev => ({ ...prev, [name]: null }));
// //     }
// //   };

// //   const validateForm = () => {
// //     const newErrors = {};
// //     if (!todoData.title.trim()) newErrors.title = 'Title is required.';
// //     if (!todoData.description.trim()) newErrors.description = 'Description is required.';
// //     if (!todoData.priority) newErrors.priority = 'Priority must be selected.';
// //     if (!todoData.dueDate) newErrors.dueDate = 'Due date is required.';
// //     if (!todoData.type) newErrors.type = 'Type must be selected.';
// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     setFlashMessage(null);

// //     if (!validateForm()) {
// //       return;
// //     }

// //     setLoading(true);
// //     const token = localStorage.getItem('authToken');

// //     if (!token) {
// //       setFlashMessage({ type: 'error', message: 'Authentication error. Please log in again.' });
// //       setLoading(false);
// //       setTimeout(() => setFlashMessage(null), 4000);
// //       return;
// //     }

// //     baseUrl.post('/api/tasks/create', todoData, {
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //         'Content-Type': 'application/json'
// //       }
// //     })
// //     .then(response => {
// //       setFlashMessage({ type: 'success', message: 'Task created successfully! Redirecting...' });
// //       setTodoData({ title: '', description: '', priority: '', dueDate: '', type: '' });
// //       setTimeout(() => {
// //         setFlashMessage(null);
// //         navigate('/todo/dashboard');
// //       }, 2000);
// //     })
// //     .catch(error => {
// //       const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.';
// //       setFlashMessage({ type: 'error', message: errorMessage });
// //       setTimeout(() => setFlashMessage(null), 4000);
// //     })
// //     .finally(() => {
// //       setLoading(false);
// //     });
// //   };

// //   // --- RENDER ---
// //   return (
// //     <div className={`min-h-screen ${themeClasses.bg} font-sans transition-colors duration-300`}>
// //       <main className="container mx-auto py-10 px-4 flex-grow">
// //         {flashMessage && (
// //           <div className={`fixed top-5 right-5 z-50 max-w-sm p-4 rounded-lg shadow-2xl flex items-center animate__animated animate__fadeInRight ${
// //               flashMessage.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
// //             }`}
// //           >
// //             {flashMessage.type === 'error' ? (
// //               <AlertTriangle className="w-6 h-6 mr-3 flex-shrink-0" />
// //             ) : (
// //               <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
// //             )}
// //             <span>{flashMessage.message}</span>
// //             <button onClick={() => setFlashMessage(null)} className="ml-4 text-white hover:text-gray-200">
// //               <XCircle size={20} />
// //             </button>
// //           </div>
// //         )}

// //         <div className={`max-w-2xl mx-auto ${themeClasses.cardBg} p-8 rounded-2xl shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-transparent'} transition-all duration-300`}>
// //           <div className="flex justify-between items-center mb-6">
// //             <h2 className={`text-3xl font-bold ${themeClasses.text}`}>
// //               Create a New Task
// //             </h2>
// //             <button
// //                 onClick={() => navigate('/todo/dashboard')}
// //                 className={`p-2 rounded-full ${themeClasses.buttonSecondary} ${themeClasses.textSecondary} transition-transform duration-300 hover:scale-110`}
// //                 title="Back to Dashboard"
// //             >
// //               <ArrowLeft size={20} />
// //             </button>
// //           </div>
          
// //           <p className={`${themeClasses.textSecondary} mb-8`}>
// //             Fill in the details below to add a new task to your dashboard.
// //           </p>

// //           <form onSubmit={handleSubmit} className="space-y-6" noValidate>
// //             {/* Title */}
// //             <div>
// //               <label htmlFor="title" className={`block text-sm font-semibold ${themeClasses.textSecondary}`}>
// //                 TODO Name
// //               </label>
// //               <input
// //                 type="text"
// //                 id="title"
// //                 name="title"
// //                 value={todoData.title}
// //                 onChange={handleChange}
// //                 placeholder="e.g., Finalize project report"
// //                 className={`mt-2 w-full border ${errors.title ? 'border-red-500' : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${themeClasses.focusRing} transition`}
// //               />
// //               {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
// //             </div>

// //             {/* Description */}
// //             <div>
// //               <label htmlFor="description" className={`block text-sm font-semibold ${themeClasses.textSecondary}`}>
// //                 Task Description
// //               </label>
// //               <textarea
// //                 id="description"
// //                 name="description"
// //                 value={todoData.description}
// //                 onChange={handleChange}
// //                 placeholder="Add more details about the task..."
// //                 rows="4"
// //                 className={`mt-2 w-full border ${errors.description ? 'border-red-500' : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${themeClasses.focusRing} transition`}
// //               ></textarea>
// //               {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               {/* Priority */}
// //               <div>
// //                 <label htmlFor="priority" className={`block text-sm font-semibold ${themeClasses.textSecondary}`}>Priority</label>
// //                 <select id="priority" name="priority" value={todoData.priority} onChange={handleChange} className={`mt-2 w-full border ${errors.priority ? 'border-red-500' : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${themeClasses.focusRing} transition`}>
// //                   <option value="">Select Priority</option>
// //                   <option value="high">High</option>
// //                   <option value="medium">Medium</option>
// //                   <option value="low">Low</option>
// //                 </select>
// //                 {errors.priority && <p className="text-red-500 text-xs mt-1">{errors.priority}</p>}
// //               </div>

// //               {/* Due Date */}
// //               <div>
// //                 <label htmlFor="dueDate" className={`block text-sm font-semibold ${themeClasses.textSecondary}`}>Due Date</label>
// //                 <input type="date" id="dueDate" name="dueDate" value={todoData.dueDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className={`mt-2 w-full border ${errors.dueDate ? 'border-red-500' : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${themeClasses.focusRing} transition`}/>
// //                 {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
// //               </div>
// //             </div>

// //             {/* Type */}
// //             <div>
// //               <label htmlFor="type" className={`block text-sm font-semibold ${themeClasses.textSecondary}`}>Type</label>
// //               <select id="type" name="type" value={todoData.type} onChange={handleChange} className={`mt-2 w-full border ${errors.type ? 'border-red-500' : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${themeClasses.focusRing} transition`}>
// //                 <option value="">Select Type</option>
// //                 <option value="official">Official</option>
// //                 <option value="family">Family</option>
// //                 <option value="personal">Personal</option>
// //               </select>
// //               {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
// //             </div>

// //             {/* Action Buttons */}
// //             <div className="flex justify-end pt-4">
// //               <button
// //                 type="submit"
// //                 disabled={loading}
// //                 className={`w-full flex items-center justify-center ${themeClasses.buttonPrimary} text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed`}
// //               >
// //                 {loading ? (
// //                   <>
// //                     <Loader2 className="w-5 h-5 mr-2 animate-spin" />
// //                     Creating...
// //                   </>
// //                 ) : (
// //                   <>
// //                     <PlusCircle className="w-5 h-5 mr-2" />
// //                     Create Task
// //                   </>
// //                 )}
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // };

// // export default AddTodo;



// // // // src/components/AddTodo.jsx
// // // import React, { useState } from 'react';
// // // import { useNavigate } from 'react-router-dom';
// // // import baseUrl from '../api/api';

// // // const AddTodo = () => {
// // //   const [todoData, setTodoData] = useState({
// // //     title: '',
// // //     description: '',
// // //     priority: '',
// // //     dueDate: '',
// // //     type: ''
// // //   });
// // //   const [flashMessage, setFlashMessage] = useState(null);
// // //   const navigate = useNavigate();

// // //   const handleChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setTodoData(prev => ({ ...prev, [name]: value }));
// // //   };

// // //   const handleSubmit = (e) => {
// // //     e.preventDefault();
// // //     setFlashMessage(null);

// // //     // Basic front-end validation
// // //     if (
// // //       !todoData.title.trim() ||
// // //       !todoData.description.trim() ||
// // //       !todoData.priority ||
// // //       !todoData.dueDate ||
// // //       !todoData.type
// // //     ) {
// // //       setFlashMessage({ type: 'error', message: 'Please fill in all required fields.' });
// // //       setTimeout(() => setFlashMessage(null), 3000);
// // //       return;
// // //     }

// // //     // *** Pull the JWT out of localStorage using the same key your login saved ***
// // //     const token = localStorage.getItem('authToken');
// // //     // console.log('Token:', token);

// // //     if (!token) {
// // //       setFlashMessage({ type: 'error', message: 'You must be logged in to create a task.' });
// // //       setTimeout(() => setFlashMessage(null), 3000);
// // //       return;
// // //     }

// // //     baseUrl.post(
// // //       '/api/tasks/create',
// // //       todoData,
// // //       {
// // //         headers: {
// // //           Authorization: `Bearer ${token}`,
// // //           'Content-Type': 'application/json'
// // //         }
// // //       }
// // //     )
// // //     .then(response => {
// // //       setFlashMessage({ type: 'success', message: 'TODO Task created successfully.' });
// // //       // Clear the form
// // //       setTodoData({ title: '', description: '', priority: '', dueDate: '', type: '' });
// // //       setTimeout(() => {
// // //         setFlashMessage(null);
// // //         navigate('/todo/dashboard');
// // //       }, 3000);
// // //     })
// // //     .catch(error => {
// // //       console.error('AXIOS ERROR', error);

// // //       const errorMessage =
// // //         error.response?.data?.message ||
// // //         error.message ||
// // //         'An unexpected error occurred. Please try again.';
        
// // //       setFlashMessage({ type: 'error', message: errorMessage });
// // //       setTimeout(() => setFlashMessage(null), 3000);
// // //     });
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-gray-50 flex flex-col">
// // //       {/* Main Content (Navbar & Footer are global) */}
// // //       <main className="container mx-auto py-10 px-4 flex-grow">
// // //         {flashMessage && (
// // //           <div
// // //             className={`mb-6 p-4 rounded-md text-center shadow-lg ${
// // //               flashMessage.type === 'error'
// // //                 ? 'bg-red-200 text-red-800'
// // //                 : 'bg-green-200 text-green-800'
// // //             }`}
// // //           >
// // //             {flashMessage.message}
// // //           </div>
// // //         )}

// // //         <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-2xl transform transition duration-500 hover:scale-105">
// // //           <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
// // //             Add TODO Task
// // //           </h2>
// // //           <form onSubmit={handleSubmit} className="space-y-6" noValidate>
// // //             <div>
// // //               <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
// // //                 TODO Name
// // //               </label>
// // //               <input
// // //                 type="text"
// // //                 id="title"
// // //                 name="title"
// // //                 value={todoData.title}
// // //                 onChange={handleChange}
// // //                 placeholder="Name here..."
// // //                 required
// // //                 className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
// // //               />
// // //             </div>
// // //             <div>
// // //               <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
// // //                 Task Description
// // //               </label>
// // //               <textarea
// // //                 id="description"
// // //                 name="description"
// // //                 value={todoData.description}
// // //                 onChange={handleChange}
// // //                 placeholder="Enter task description"
// // //                 rows="4"
// // //                 required
// // //                 className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
// // //               ></textarea>
// // //             </div>
// // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //               <div>
// // //                 <label htmlFor="priority" className="block text-sm font-semibold text-gray-700">
// // //                   Priority
// // //                 </label>
// // //                 <select
// // //                   id="priority"
// // //                   name="priority"
// // //                   value={todoData.priority}
// // //                   onChange={handleChange}
// // //                   required
// // //                   className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
// // //                 >
// // //                   <option value="">Select Priority</option>
// // //                   <option value="high">High</option>
// // //                   <option value="medium">Medium</option>
// // //                   <option value="low">Low</option>
// // //                 </select>
// // //               </div>
// // //               <div>
// // //                 <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700">
// // //                   Due Date
// // //                 </label>
// // //                 <input
// // //                   type="date"
// // //                   id="dueDate"
// // //                   name="dueDate"
// // //                   value={todoData.dueDate}
// // //                   onChange={handleChange}
// // //                   required
// // //                   className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
// // //                 />
// // //               </div>
// // //             </div>
// // //             <div>
// // //               <label htmlFor="type" className="block text-sm font-semibold text-gray-700">
// // //                 Type
// // //               </label>
// // //               <select
// // //                 id="type"
// // //                 name="type"
// // //                 value={todoData.type}
// // //                 onChange={handleChange}
// // //                 required
// // //                 className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
// // //               >
// // //                 <option value="">Select Type</option>
// // //                 <option value="official">Official</option>
// // //                 <option value="family">Family</option>
// // //                 <option value="personal">Personal</option>
// // //               </select>
// // //             </div>
// // //             <div className="flex space-x-4 mt-6">
// // //               <button
// // //                 type="submit"
// // //                 className="w-1/2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
// // //               >
// // //                 Create Task
// // //               </button>
// // //               <button
// // //                 type="button"
// // //                 onClick={() => navigate('/todo/dashboard')}
// // //                 className="w-1/2 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
// // //               >
// // //                 Cancel
// // //               </button>
// // //             </div>
// // //           </form>
// // //         </div>
// // //       </main>
// // //     </div>
// // //   );
// // // };

// // // export default AddTodo;
