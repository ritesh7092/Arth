// EditTodo.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditTodo = () => {
  const { id } = useParams(); // Get task id from URL
  const navigate = useNavigate();

  const [serverTime, setServerTime] = useState(new Date().toLocaleString());
  const [todoData, setTodoData] = useState({
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    type: ''
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

  // Simulate fetching an existing task based on id.
  useEffect(() => {
    const fetchTask = async () => {
      // Simulate API delay.
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Replace this with your actual API call.
      const fetchedTask = {
        title: 'Edit Report',
        description: 'Update the quarterly report and review edits.',
        priority: 'high',
        dueDate: '2025-04-15',
        type: 'official'
      };
      setTodoData(fetchedTask);
    };
    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTodoData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (
      !todoData.title.trim() ||
      !todoData.description.trim() ||
      !todoData.priority ||
      !todoData.dueDate ||
      !todoData.type
    ) {
      setFlashMessage({ type: 'error', message: 'Please fill in all required fields.' });
      setTimeout(() => setFlashMessage(null), 3000);
      return;
    }

    setSubmitting(true);
    try {
      // Simulate an API update call – replace with your actual submission logic.
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setFlashMessage({ type: 'success', message: 'TODO Task updated successfully.' });
    } catch (error) {
      setFlashMessage({ type: 'error', message: error.message || 'An error occurred.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setFlashMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content (Assuming Navbar & Footer are global) */}
      <main className="container mx-auto py-10 px-4 flex-grow">
        {flashMessage && (
          <div className={`mb-8 p-4 rounded-md text-center shadow-lg ${flashMessage.type === 'error' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
            {flashMessage.message}
          </div>
        )}

        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-2xl transform transition duration-500 hover:scale-105">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Edit TODO Task</h2>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700">TODO Name</label>
              <input
                type="text"
                id="title"
                name="title"
                value={todoData.title}
                onChange={handleChange}
                placeholder="Name here..."
                required
                className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Task Description</label>
              <textarea
                id="description"
                name="description"
                value={todoData.description}
                onChange={handleChange}
                placeholder="Enter task description"
                rows="4"
                required
                className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="priority" className="block text-sm font-semibold text-gray-700">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={todoData.priority}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">Select Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700">Due Date</label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={todoData.dueDate}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-semibold text-gray-700">Type</label>
              <select
                id="type"
                name="type"
                value={todoData.type}
                onChange={handleChange}
                required
                className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">Select Type</option>
                <option value="official">Official</option>
                <option value="family">Family</option>
                <option value="personal">Personal</option>
              </select>
            </div>
            <div className="flex space-x-4 mt-8">
              <button type="submit" disabled={submitting} className="w-1/2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                {submitting ? 'Updating...' : 'Update Task'}
              </button>
              <button type="button" onClick={() => navigate('/dashboard')} className="w-1/2 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditTodo;







// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import 'animate.css';
// import { useTheme } from '../src/theme/ThemeProvider'; // Adjust path if necessary
// import baseUrl from '../api/api'; // Adjust path if necessary

// // Import Lucide React Icons
// import { CheckCircle, XCircle, ArrowLeft, Loader2, AlertTriangle, Save, Sun, Moon } from 'lucide-react';

// const EditTodo = () => {
//   const { theme, toggleTheme } = useTheme();
//   const isDarkMode = theme === 'dark';
//   const navigate = useNavigate();
//   const { id } = useParams(); // Get task ID from URL parameters

//   const [todoData, setTodoData] = useState({
//     title: '',
//     description: '',
//     priority: '',
//     dueDate: '',
//     type: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(true); // Set to true initially to fetch data
//   const [saving, setSaving] = useState(false); // New state for save operation
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
//     textHighlight: isDarkMode ? 'text-indigo-400' : 'text-indigo-600',
//     inputBg: isDarkMode ? 'bg-gray-700/40' : 'bg-gray-50 shadow-inner',
//     inputBorder: isDarkMode ? 'border-gray-600 focus:border-indigo-500' : 'border-gray-200 focus:border-indigo-500',
//     focusRing: 'focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-60',
//     buttonPrimary: 'bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl',
//     buttonSecondary: isDarkMode ? 'bg-gray-700/50 hover:bg-gray-600/70 text-gray-200 shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-md',
//     errorText: 'text-red-500'
//   };

//   // --- FETCH TASK DATA ON COMPONENT MOUNT ---
//   useEffect(() => {
//     const fetchTask = async () => {
//       setLoading(true);
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         setFlashMessage({ type: 'error', message: 'Authentication required. Please log in.' });
//         setLoading(false);
//         navigate('/login'); // Redirect to login if no token
//         return;
//       }

//       try {
//         const response = await baseUrl.get(`/api/tasks/${id}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         // Format dueDate to 'YYYY-MM-DD' for input type="date"
//         setTodoData({
//           ...response.data,
//           dueDate: response.data.dueDate ? new Date(response.data.dueDate).toISOString().split('T')[0] : ''
//         });
//       } catch (error) {
//         const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch task details.';
//         setFlashMessage({ type: 'error', message: errorMessage });
//         // Optionally redirect if task not found or error
//         setTimeout(() => navigate('/todo/dashboard'), 3000);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchTask();
//     } else {
//       setFlashMessage({ type: 'error', message: 'No task ID provided for editing.' });
//       setLoading(false);
//       navigate('/todo/dashboard'); // Redirect if no ID
//     }
//   }, [id, navigate]); // Depend on 'id' and 'navigate'

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
//     if (!todoData.title.trim()) newErrors.title = 'A clear task title is required.';
//     if (!todoData.description.trim()) newErrors.description = 'Please provide a detailed description.';
//     if (!todoData.priority) newErrors.priority = 'Please select a priority level.';
//     if (!todoData.dueDate) newErrors.dueDate = 'A due date is essential for planning.';
//     if (!todoData.type) newErrors.type = 'Please categorize your task type.';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setFlashMessage(null);

//     if (!validateForm()) {
//       setFlashMessage({ type: 'error', message: 'Please correct the highlighted errors before submitting.' });
//       setTimeout(() => setFlashMessage(null), 4000);
//       return;
//     }

//     setSaving(true); // Indicate saving operation
//     const token = localStorage.getItem('authToken');

//     baseUrl.put(`/api/tasks/update/${id}`, todoData, {
//       headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
//     })
//     .then(response => {
//       setFlashMessage({ type: 'success', message: 'Task updated successfully! Redirecting...' });
//       setTimeout(() => {
//         setFlashMessage(null);
//         navigate('/todo/dashboard');
//       }, 2000);
//     })
//     .catch(error => {
//       const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred during update.';
//       setFlashMessage({ type: 'error', message: errorMessage });
//       setTimeout(() => setFlashMessage(null), 5000);
//     })
//     .finally(() => {
//       setSaving(false);
//     });
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
//             <Loader2 className={`w-10 h-10 animate-spin ${themeClasses.textHighlight}`} />
//             <p className={`mt-4 text-xl font-semibold ${themeClasses.text}`}>Loading Task Data...</p>
//           </div>
//         ) : (
//           <div className={`w-full max-w-2xl p-10 rounded-3xl ${themeClasses.cardBg} transition-all duration-700 animate__animated animate__fadeInUp animate__slow`}>
//             <div className="flex justify-between items-center mb-8">
//               <h2 className={`text-4xl font-extrabold ${themeClasses.text} tracking-tight leading-tight`}>
//                 Edit Task
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
//               Update the details for your task below and save your changes.
//             </p>

//             <form onSubmit={handleSubmit} className="space-y-8" noValidate>
//               {/* Title */}
//               <div>
//                 <label htmlFor="title" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Task Title <span className={themeClasses.textHighlight}>*</span></label>
//                 <input
//                   type="text"
//                   id="title"
//                   name="title"
//                   value={todoData.title}
//                   onChange={handleChange}
//                   placeholder="e.g., Finalize Q3 Marketing Strategy Report"
//                   className={`mt-1 w-full border ${errors.title ? 'border-red-500' : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300`}
//                   aria-invalid={errors.title ? "true" : "false"}
//                   aria-describedby="title-error"
//                 />
//                 {errors.title && <p id="title-error" className={`${themeClasses.errorText} text-sm mt-2 flex items-center animate__animated animate__headShake animate__faster`}><XCircle size={16} className="mr-1.5" />{errors.title}</p>}
//               </div>

//               {/* Description */}
//               <div>
//                 <label htmlFor="description" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Task Description <span className={themeClasses.textHighlight}>*</span></label>
//                 <textarea
//                   id="description"
//                   name="description"
//                   value={todoData.description}
//                   onChange={handleChange}
//                   placeholder="Provide a comprehensive description of the task, including key objectives and steps."
//                   rows="5"
//                   className={`mt-1 w-full border ${errors.description ? 'border-red-500' : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300`}
//                   aria-invalid={errors.description ? "true" : "false"}
//                   aria-describedby="description-error"
//                 ></textarea>
//                 {errors.description && <p id="description-error" className={`${themeClasses.errorText} text-sm mt-2 flex items-center animate__animated animate__headShake animate__faster`}><XCircle size={16} className="mr-1.5" />{errors.description}</p>}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 {/* Priority */}
//                 <div>
//                   <label htmlFor="priority" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Priority Level <span className={themeClasses.textHighlight}>*</span></label>
//                   <select
//                     id="priority"
//                     name="priority"
//                     value={todoData.priority}
//                     onChange={handleChange}
//                     className={`mt-1 w-full border ${errors.priority ? 'border-red-500' : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300 appearance-none pr-10 custom-select-arrow`}
//                     aria-invalid={errors.priority ? "true" : "false"}
//                     aria-describedby="priority-error"
//                   >
//                     <option value="">-- Select Priority --</option>
//                     <option value="high">High</option>
//                     <option value="medium">Medium</option>
//                     <option value="low">Low</option>
//                   </select>
//                   {errors.priority && <p id="priority-error" className={`${themeClasses.errorText} text-sm mt-2 flex items-center animate__animated animate__headShake animate__faster`}><XCircle size={16} className="mr-1.5" />{errors.priority}</p>}
//                 </div>

//                 {/* Due Date */}
//                 <div>
//                   <label htmlFor="dueDate" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Due Date <span className={themeClasses.textHighlight}>*</span></label>
//                   <input
//                     type="date"
//                     id="dueDate"
//                     name="dueDate"
//                     value={todoData.dueDate}
//                     onChange={handleChange}
//                     min={new Date().toISOString().split('T')[0]}
//                     className={`mt-1 w-full border ${errors.dueDate ? 'border-red-500' : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300`}
//                     aria-invalid={errors.dueDate ? "true" : "false"}
//                     aria-describedby="dueDate-error"
//                   />
//                   {errors.dueDate && <p id="dueDate-error" className={`${themeClasses.errorText} text-sm mt-2 flex items-center animate__animated animate__headShake animate__faster`}><XCircle size={16} className="mr-1.5" />{errors.dueDate}</p>}
//                 </div>
//               </div>

//               {/* Type */}
//               <div>
//                 <label htmlFor="type" className={`block text-sm font-semibold mb-2 ${themeClasses.textSecondary}`}>Task Type <span className={themeClasses.textHighlight}>*</span></label>
//                 <select
//                   id="type"
//                   name="type"
//                   value={todoData.type}
//                   onChange={handleChange}
//                   className={`mt-1 w-full border ${errors.type ? 'border-red-500' : themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} rounded-xl px-5 py-3.5 focus:outline-none ${themeClasses.focusRing} transition duration-300 appearance-none pr-10 custom-select-arrow`}
//                   aria-invalid={errors.type ? "true" : "false"}
//                   aria-describedby="type-error"
//                 >
//                   <option value="">-- Select Type --</option>
//                   <option value="work">Work</option>
//                   <option value="personal">Personal</option>
//                   <option value="health">Health & Fitness</option>
//                   <option value="learning">Learning</option>
//                   <option value="finance">Finance</option>
//                   <option value="social">Social</option>
//                   <option value="home">Home & Chores</option>
//                 </select>
//                 {errors.type && <p id="type-error" className={`${themeClasses.errorText} text-sm mt-2 flex items-center animate__animated animate__headShake animate__faster`}><XCircle size={16} className="mr-1.5" />{errors.type}</p>}
//               </div>

//               {/* Action Button */}
//               <div className="pt-6">
//                 <button
//                   type="submit"
//                   disabled={saving} // Use 'saving' state for this button
//                   className={`w-full flex items-center justify-center py-4 px-8 rounded-xl font-bold text-lg ${themeClasses.buttonPrimary} transform hover:-translate-y-1 active:scale-95 transition-all duration-300 ease-out disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}`}
//                 >
//                   {saving ? (
//                     <> <Loader2 className="w-6 h-6 mr-3 animate-spin" /> Saving... </>
//                   ) : (
//                     <> <Save className="w-6 h-6 mr-3" /> Save Changes </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default EditTodo;