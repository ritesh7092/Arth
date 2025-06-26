// CalendarView.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'animate.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {
  Moon,
  Sun,
  PlusCircle,
  X,
  AlertCircle,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  ClipboardCheck, // for tasks
} from 'lucide-react';
import baseUrl from '../api/api'; // Your Axios instance
import { useTheme } from '../src/theme/ThemeProvider'; // Your Theme Provider

// --- Re-usable Helpers & Components ---

// Get days in a month for a given year and month (0-indexed month)
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

// Get the first day of the month (0 for Sunday, 6 for Saturday)
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

// Get an array of day numbers for a month
const getMonthDaysArray = (year, month) => {
  const numDays = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = [];

  // Add leading empty cells for days before the 1st
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= numDays; i++) {
    days.push(i);
  }
  return days;
};

// --- Modal Form for Add/Edit Event ---
const EventFormModal = ({ isOpen, onClose, initialData, onSave, isDarkMode, eventDate }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    date: initialData?.date || eventDate?.toISOString().substring(0, 10) || '',
    time: initialData?.time || '',
    description: initialData?.description || '',
    type: initialData?.type || 'personal', // Default type
    isCompleted: initialData?.isCompleted || false, // For tasks
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        date: initialData.date || '',
        time: initialData.time || '',
        description: initialData.description || '',
        type: initialData.type || 'personal',
        isCompleted: initialData.isCompleted || false,
      });
    } else {
      setFormData({
        title: '',
        date: eventDate?.toISOString().substring(0, 10) || '',
        time: '',
        description: '',
        type: 'personal',
        isCompleted: false,
      });
    }
  }, [initialData, eventDate]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) {
      alert("Please fill in event title and date.");
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
    buttonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    buttonSecondary: isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  };

  const eventTypes = ['personal', 'work', 'meeting', 'task', 'social', 'finance', 'other'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate__animated animate__fadeIn">
      <div className={`${themeClasses.modalBg} rounded-xl shadow-2xl p-6 w-full max-w-md animate__animated animate__zoomIn`} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={`absolute top-4 right-4 p-2 rounded-full ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
          <X size={20} />
        </button>
        <h2 className={`text-2xl font-bold mb-6 text-center ${themeClasses.text}`}>
          {initialData ? 'Edit Event' : 'Add New Event'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="event-title" className={`block text-sm font-medium mb-1 ${themeClasses.textLabel}`}>Title</label>
            <input
              type="text"
              id="event-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Project Deadline"
              required
              className={`w-full p-3 rounded-lg border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} focus:ring-indigo-500 focus:border-indigo-500`}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="event-date" className={`block text-sm font-medium mb-1 ${themeClasses.textLabel}`}>Date</label>
              <input
                type="date"
                id="event-date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className={`w-full p-3 rounded-lg border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} focus:ring-indigo-500 focus:border-indigo-500`}
              />
            </div>
            <div>
              <label htmlFor="event-time" className={`block text-sm font-medium mb-1 ${themeClasses.textLabel}`}>Time (Optional)</label>
              <input
                type="time"
                id="event-time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} focus:ring-indigo-500 focus:border-indigo-500`}
              />
            </div>
          </div>
          <div>
            <label htmlFor="event-description" className={`block text-sm font-medium mb-1 ${themeClasses.textLabel}`}>Description</label>
            <textarea
              id="event-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={`w-full p-3 rounded-lg border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} focus:ring-indigo-500 focus:border-indigo-500`}
            ></textarea>
          </div>
          <div>
            <label htmlFor="event-type" className={`block text-sm font-medium mb-1 ${themeClasses.textLabel}`}>Type</label>
            <select
              id="event-type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${themeClasses.inputBorder} ${themeClasses.inputBg} ${themeClasses.text} focus:ring-indigo-500 focus:border-indigo-500`}
            >
              {eventTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>
          {formData.type === 'task' && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isCompleted"
                name="isCompleted"
                checked={formData.isCompleted}
                onChange={handleChange}
                className={`h-5 w-5 rounded border-gray-300 ${isDarkMode ? "bg-gray-700 border-gray-600 text-teal-600" : "text-teal-600 focus:ring-teal-500"}`}
              />
              <label htmlFor="isCompleted" className={`ml-2 block text-sm ${themeClasses.textLabel}`}>
                Mark as Completed
              </label>
            </div>
          )}
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
              {initialData ? 'Update Event' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default function CalendarView() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const isDarkMode = theme === 'dark';

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentDate, setCurrentDate] = useState(new Date()); // Represents the month displayed
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // null for add, object for edit
  const [selectedDayEvents, setSelectedDayEvents] = useState([]); // Events for the currently clicked day
  const [modalEventDate, setModalEventDate] = useState(null); // Date for the add/view modal

  // Theme-aware Tailwind classes (from your FinanceDashboard)
  const themeClasses = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-300',
    inputBorder: isDarkMode ? 'border-gray-600' : 'border-gray-400',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    buttonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    buttonSecondary: isDarkMode
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
      : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  };

  // --- API Calls (Mocked for now) ---
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please login to continue.');
        setTimeout(() => navigate('/login'), 1500);
        return;
      }

      // --- Mock API call for events ---
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

      const mockEventsResponse = {
        content: [
          { id: 'ev1', title: 'Team Sync', date: '2025-06-28', time: '10:00', description: 'Weekly team meeting', type: 'meeting' },
          { id: 'ev2', title: 'Pay Electricity Bill', date: '2025-06-28', time: '15:00', description: 'Due today', type: 'finance' },
          { id: 'ev3', title: 'Gym Session', date: '2025-06-29', time: '07:00', description: 'Morning workout', type: 'personal' },
          { id: 'ev4', title: 'Submit Expense Report', date: '2025-06-30', time: '17:00', description: 'For June', type: 'work', isCompleted: false },
          { id: 'ev5', title: 'Dinner with Family', date: '2025-07-03', time: '19:30', description: 'At Grandma\'s house', type: 'social' },
          { id: 'ev6', title: 'Review Q2 Performance', date: '2025-07-05', time: '11:00', description: 'Internal review', type: 'work' },
          { id: 'ev7', title: 'Haircut', date: '2025-07-10', time: '14:00', description: '', type: 'personal' },
          { id: 'ev8', title: 'Client Call - Project Alpha', date: '2025-07-15', time: '09:00', description: 'Discuss new features', type: 'meeting' },
        ]
      };
      setEvents(mockEventsResponse.content || []);

      // Uncomment and adapt for real API calls:
      /*
      const eventRes = await baseUrl.get('/api/calendar/events', { headers: { Authorization: `Bearer ${token}` } });
      setEvents(eventRes.data.content || []); // Adjust based on your actual response structure
      */
    } catch (err) {
      let errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch calendar data.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthDays = useMemo(() => getMonthDaysArray(year, month), [year, month]);
  const dayNames = useMemo(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], []);

  // Events grouped by day for easy lookup
  const eventsByDay = useMemo(() => {
    if (!events) return {};
    return events.reduce((acc, event) => {
      const eventDate = new Date(event.date);
      // Ensure the event falls within the current displayed month
      if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
        const day = eventDate.getDate();
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(event);
      }
      return acc;
    }, {});
  }, [events, year, month]);

  // --- Handlers ---
  const handlePrevMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDayEvents([]); // Clear selected events when changing month
    setModalEventDate(null);
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDayEvents([]); // Clear selected events when changing month
    setModalEventDate(null);
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
    setSelectedDayEvents([]); // Clear selected events when changing month
    setModalEventDate(null);
  }, []);

  const handleDayClick = useCallback((day) => {
    if (!day) return; // For empty cells
    const clickedDate = new Date(year, month, day);
    const eventsForDay = eventsByDay[day] || [];
    setSelectedDayEvents(eventsForDay);
    setModalEventDate(clickedDate);
    setEditingEvent(null); // Ensure add mode by default
    setIsEventModalOpen(true);
  }, [year, month, eventsByDay]);

  const handleAddEvent = useCallback(() => {
    setEditingEvent(null); // Clear any editing data
    setModalEventDate(currentDate); // Default to current calendar month/year
    setIsEventModalOpen(true);
  }, [currentDate]);

  const handleEditEvent = useCallback((event) => {
    setEditingEvent(event);
    setModalEventDate(new Date(event.date)); // Set modal date to event date for consistency
    setIsEventModalOpen(true);
  }, []);

  const handleSaveEvent = useCallback(async (eventData) => {
    try {
      const token = localStorage.getItem('authToken');
      // In a real app, send to your backend:
      // if (eventData.id) {
      //   await baseUrl.put(`/api/calendar/events/${eventData.id}`, eventData, { headers: { Authorization: `Bearer ${token}` } });
      // } else {
      //   await baseUrl.post('/api/calendar/events', eventData, { headers: { Authorization: `Bearer ${token}` } });
      // }
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call

      // Update local state after successful API call
      if (eventData.id) {
        setEvents(prev => prev.map(e => e.id === eventData.id ? eventData : e));
      } else {
        setEvents(prev => [...prev, { ...eventData, id: `ev${Date.now()}` }]); // Mock ID
      }
      setIsEventModalOpen(false);
      setEditingEvent(null);
      // Re-fetch events for the selected day if it was open
      if (modalEventDate) {
        const day = modalEventDate.getDate();
        setSelectedDayEvents(eventsByDay[day] || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save event.');
    }
  }, [eventsByDay, modalEventDate]);

  const handleDeleteEvent = useCallback((id) => {
    const eventToDelete = events.find(e => e.id === id);
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
                Are you sure you want to delete the event: <span className="font-semibold">{eventToDelete?.title}</span>?
              </p>
              <div className="flex gap-3">
                <button onClick={onClose} className={`flex-1 px-4 py-2 rounded-lg ${themeClasses.buttonSecondary} font-medium transition-colors`}>
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('authToken');
                      // await baseUrl.delete(`/api/calendar/events/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
                      setEvents(prev => prev.filter(e => e.id !== id));
                      setSelectedDayEvents(prev => prev.filter(e => e.id !== id)); // Update modal view if open
                      onClose();
                    } catch (error) {
                      setError(error.response?.data?.message || error.message || 'Failed to delete event.');
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
  }, [events, themeClasses]);


  // --- Render Logic ---
  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
        <AlertCircle className="animate-spin text-5xl text-indigo-500" />
        <p className="ml-4 text-xl font-semibold">Loading your calendar data...</p>
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
              <h1 className={`text-2xl font-bold ${themeClasses.text}`}>Calendar View</h1>
              <p className={`text-sm ${themeClasses.textSecondary}`}>
                Plan your events and tasks
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Calendar Navigation */}
        <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-xl shadow-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <button
            onClick={handlePrevMonth}
            className={`p-2 rounded-full ${themeClasses.hover} ${themeClasses.textSecondary}`}
            aria-label="Previous month"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className={`text-xl sm:text-2xl font-bold ${themeClasses.text}`}>
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToToday}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${themeClasses.buttonSecondary}`}
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className={`p-2 rounded-full ${themeClasses.hover} ${themeClasses.textSecondary}`}
              aria-label="Next month"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-xl shadow-lg p-4 sm:p-6`}>
          <div className={`grid grid-cols-7 gap-1 sm:gap-2 text-center font-semibold text-xs sm:text-sm mb-4 ${themeClasses.textSecondary}`}>
            {dayNames.map(day => (
              <div key={day} className="py-2">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {monthDays.map((day, index) => {
              const isToday = day &&
                new Date().getDate() === day &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;
              const eventsOnThisDay = eventsByDay[day] || [];
              const hasEvents = eventsOnThisDay.length > 0;

              return (
                <div
                  key={index}
                  onClick={() => handleDayClick(day)}
                  className={`relative aspect-square flex flex-col items-center justify-center p-1 rounded-lg cursor-pointer transition-colors duration-200
                    ${day
                      ? isToday
                        ? 'bg-indigo-500 text-white shadow-lg'
                        : hasEvents
                          ? isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                          : isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                      : '' // No styling for empty cells
                    } ${!day ? 'pointer-events-none' : ''}
                  `}
                  title={day ? `${day} ${currentDate.toLocaleString('default', { month: 'short' })}, ${eventsOnThisDay.map(e => e.title).join(', ')}` : ''}
                >
                  {day && (
                    <>
                      <span className={`text-base sm:text-lg font-bold ${isToday ? 'text-white' : ''}`}>{day}</span>
                      {hasEvents && (
                        <div className="absolute bottom-1.5 flex flex-wrap justify-center gap-0.5 px-0.5">
                          {eventsOnThisDay.slice(0, 4).map((event, i) => (
                            <span
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                event.type === 'meeting' ? 'bg-purple-400' :
                                event.type === 'task' ? 'bg-green-400' :
                                event.type === 'personal' ? 'bg-orange-400' :
                                event.type === 'work' ? 'bg-red-400' :
                                event.type === 'social' ? 'bg-yellow-400' :
                                event.type === 'finance' ? 'bg-teal-400' :
                                'bg-gray-400'
                              }`}
                              title={event.title}
                            ></span>
                          ))}
                          {eventsOnThisDay.length > 4 && (
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500" title={`+${eventsOnThisDay.length - 4} more`}></span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Event Button (Global) */}
        <div className="text-center mt-8">
          <button
            onClick={handleAddEvent}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm transition-colors duration-200 ${themeClasses.buttonPrimary}`}
          >
            <PlusCircle className="mr-2 -ml-1 h-5 w-5" /> Add New Event
          </button>
        </div>
      </main>

      {/* Event Details/Add/Edit Modal */}
      <EventFormModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null); // Clear editing state on close
          setSelectedDayEvents([]); // Clear selected events
          setModalEventDate(null);
        }}
        initialData={editingEvent}
        onSave={handleSaveEvent}
        isDarkMode={isDarkMode}
        eventDate={modalEventDate}
      />

      {/* Side Panel or another Modal for Day's Events (if not combined) */}
      {isEventModalOpen && !editingEvent && selectedDayEvents.length > 0 && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black bg-opacity-30" onClick={() => {
          setIsEventModalOpen(false);
          setSelectedDayEvents([]);
        }}>
          <div className={`${themeClasses.cardBg} rounded-xl shadow-2xl p-6 w-full max-w-lg animate__animated animate__fadeInRight animate__faster`} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${themeClasses.text}`}>
                Events on {modalEventDate?.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
              </h3>
              <button
                onClick={() => {
                  setIsEventModalOpen(false);
                  setSelectedDayEvents([]);
                }}
                className={`p-2 rounded-full ${themeClasses.hover} ${themeClasses.textSecondary}`}
              >
                <X size={20} />
              </button>
            </div>
            <div className={`space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar`}>
              {selectedDayEvents.length === 0 ? (
                <p className={`${themeClasses.textSecondary} text-center py-4`}>No events for this day.</p>
              ) : (
                selectedDayEvents.map(event => (
                  <div
                    key={event.id}
                    className={`p-3 rounded-lg flex items-start justify-between gap-3 ${
                      isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className="flex-1">
                      <p className={`font-semibold text-lg ${themeClasses.text}`}>
                        {event.title}
                        {event.type === 'task' && event.isCompleted && (
                          <span className="ml-2 text-green-500"><ClipboardCheck size={18} className="inline-block" /></span>
                        )}
                      </p>
                      <p className={`text-sm ${themeClasses.textSecondary} ${event.time ? 'flex items-center gap-1' : ''}`}>
                        {event.time && <Clock size={14} className="inline-block" />} {event.time}
                        {event.time && event.description && ' - '} {event.description}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                        event.type === 'meeting' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' :
                        event.type === 'task' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                        event.type === 'personal' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' :
                        event.type === 'work' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                        event.type === 'social' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
                        event.type === 'finance' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300'
                      }`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                    </div>
                    <div className="flex space-x-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className={`p-2 rounded-full ${themeClasses.buttonSecondary} group`}
                        title="Edit Event"
                      >
                        <Edit2 size={16} className={`${themeClasses.textSecondary} group-hover:scale-110 transition-transform`} />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors group"
                        title="Delete Event"
                      >
                        <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Button to add new event for this specific day */}
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setEditingEvent(null); // Ensure add mode
                  setIsEventModalOpen(true); // Open form for adding
                  // modalEventDate is already set from handleDayClick
                }}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors duration-200 ${themeClasses.buttonPrimary}`}
              >
                <PlusCircle className="mr-2 -ml-1 h-4 w-4" /> Add Event for this Day
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
