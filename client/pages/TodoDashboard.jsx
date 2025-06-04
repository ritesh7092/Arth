// TodoDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'animate.css'; // For animations
import {
  CheckCircle2,
  Calendar,
  ClipboardList,
  PlusCircle,
  Trash2,
  Edit2,
  Eye,
} from 'lucide-react';

const TodoDashboard = () => {
  // Sample tasks simulating fetched data
  const sampleTasks = [
    { id: 1, title: 'Finish report', shortDescription: 'Complete quarterly report', priority: 'high', dateAdded: '2025-03-28', dueDate: '2025-03-28', completed: false },
    { id: 2, title: 'Team meeting', shortDescription: 'Discuss project progress', priority: 'medium', dateAdded: '2025-02-15', dueDate: '2025-02-15', completed: false },
    { id: 3, title: 'Email client', shortDescription: 'Follow up on proposal', priority: 'low', dateAdded: '2025-03-25', dueDate: '2025-03-25', completed: false },
    { id: 4, title: 'Design review', shortDescription: 'Review new UI designs', priority: 'high', dateAdded: '2025-01-10', dueDate: '2025-01-10', completed: true },
    { id: 5, title: 'Plan webinar', shortDescription: 'Outline topics and create slides', priority: 'medium', dateAdded: '2025-03-20', dueDate: '2025-03-20', completed: false },
    { id: 6, title: 'Budget analysis', shortDescription: 'Review monthly budget', priority: 'high', dateAdded: '2025-03-29', dueDate: '2025-03-29', completed: false },
    { id: 7, title: 'Client follow-up', shortDescription: 'Call to discuss feedback', priority: 'medium', dateAdded: '2025-02-28', dueDate: '2025-02-28', completed: false },
    { id: 8, title: 'Old Task Example', shortDescription: 'Task from previous year', priority: 'medium', dateAdded: '2024-10-05', dueDate: '2024-10-05', completed: false },
  ];

  const [todayTasks, setTodayTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  // Pagination state for "My Todos"
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;
  // Filter states
  const [selectedDate, setSelectedDate] = useState(''); // For a specific day
  const [selectedMonth, setSelectedMonth] = useState('All'); // For month filtering
  const [selectedYear, setSelectedYear] = useState('All'); // For year filtering

  // Predefined options for months and years
  const months = ['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = ['All', '2024', '2025']; // Adjust as needed

  useEffect(() => {
    // Simulate API fetching and sort tasks (most recent first)
    const sortedTasks = [...sampleTasks].sort(
      (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
    );
    setTodayTasks(sortedTasks);
    setAllTasks(sortedTasks);
  }, []);

  const completedCount = allTasks.filter((task) => task.completed).length;
  const pendingCount = allTasks.length - completedCount;

  // For priority columns (using today's tasks)
  const filterByPriority = (priority) =>
    todayTasks.filter((task) => task.priority === priority);

  // Filtering "My Todos" based on either a specific date or month/year
  const filteredTodos = allTasks.filter((task) => {
    if (selectedDate) {
      return task.dateAdded === selectedDate;
    } else {
      const taskDate = new Date(task.dateAdded);
      const taskMonth = taskDate.getMonth(); // 0-indexed: Jan=0, Feb=1, etc.
      const taskYear = taskDate.getFullYear();
      const monthMatch =
        selectedMonth === 'All' || taskMonth === months.indexOf(selectedMonth) - 1;
      const yearMatch =
        selectedYear === 'All' || taskYear === parseInt(selectedYear, 10);
      return monthMatch && yearMatch;
    }
  });

  // Pagination calculations
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTodos.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTodos.length / tasksPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Handlers for filter changes; reset pagination on filter change.
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    // Clear month/year filters when a specific date is selected.
    if (e.target.value) {
      setSelectedMonth('All');
      setSelectedYear('All');
    }
    setCurrentPage(1);
  };

  const handleMonthChange = (e) => {
    setSelectedDate(''); // Clear specific date filter
    setSelectedMonth(e.target.value);
    setCurrentPage(1);
  };

  const handleYearChange = (e) => {
    setSelectedDate(''); // Clear specific date filter
    setSelectedYear(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Statistics Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow-lg p-5 flex items-center space-x-4 animate__animated animate__fadeInUp">
          <Calendar className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-gray-500">Total Tasks</p>
            <p className="mt-1 text-2xl font-bold text-gray-800">{allTasks.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-5 flex items-center space-x-4 animate__animated animate__fadeInUp animate__delay-1s">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
          <div>
            <p className="text-sm font-medium text-gray-500">Completed</p>
            <p className="mt-1 text-2xl font-bold text-gray-800">{completedCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-5 flex items-center space-x-4 animate__animated animate__fadeInUp animate__delay-2s">
          <ClipboardList className="w-8 h-8 text-yellow-500" />
          <div>
            <p className="text-sm font-medium text-gray-500">Pending</p>
            <p className="mt-1 text-2xl font-bold text-gray-800">{pendingCount}</p>
          </div>
        </div>
      </div>

      {/* Header Section: Tasks Due Today */}
      <header
        className="relative rounded-xl overflow-hidden shadow-2xl mb-10 animate__animated animate__fadeIn"
        style={{
          background: 'linear-gradient(135deg, #1F2937, #111827)',
          backgroundImage: "url('/assets/images/todo-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '200px',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 p-8 flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-white">Tasks Due Today</h2>
            <p className="text-lg text-gray-300 mt-2">
              Keep your goals on track with precision.
            </p>
          </div>
          <Link
            to="/addtask"
            className="mt-6 sm:mt-0 inline-flex items-center bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 transition duration-300"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Task
          </Link>
        </div>
      </header>

      {/* Priority Columns Section */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate__animated animate__fadeInUp">
        {/* High Priority */}
        <div className="bg-red-50 border-l-4 border-red-600 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-red-500 p-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <span className="inline-block w-2 h-2 bg-white rounded-full mr-2"></span>
              High Priority
            </h3>
          </div>
          <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
            {filterByPriority('high').length === 0 ? (
              <p className="text-gray-600">No tasks for today.</p>
            ) : (
              filterByPriority('high').map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{task.title}</p>
                      <p className="text-sm text-gray-500">{task.shortDescription}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Due: {task.dueDate}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/todo/${task.id}/done`}
                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                        title="Mark Done"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/todo/edit/${task.id}`}
                        className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition"
                        title="Edit Task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/todo/${task.id}`}
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Medium Priority */}
        <div className="bg-yellow-50 border-l-4 border-yellow-600 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-yellow-500 p-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <span className="inline-block w-2 h-2 bg-white rounded-full mr-2"></span>
              Medium Priority
            </h3>
          </div>
          <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
            {filterByPriority('medium').length === 0 ? (
              <p className="text-gray-600">No tasks for today.</p>
            ) : (
              filterByPriority('medium').map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{task.title}</p>
                      <p className="text-sm text-gray-500">{task.shortDescription}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Due: {task.dueDate}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/todo/${task.id}/done`}
                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                        title="Mark Done"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/todo/edit/${task.id}`}
                        className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition"
                        title="Edit Task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/todo/${task.id}`}
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Priority */}
        <div className="bg-green-50 border-l-4 border-green-600 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-green-500 p-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <span className="inline-block w-2 h-2 bg-white rounded-full mr-2"></span>
              Low Priority
            </h3>
          </div>
          <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
            {filterByPriority('low').length === 0 ? (
              <p className="text-gray-600">No tasks for today.</p>
            ) : (
              filterByPriority('low').map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{task.title}</p>
                      <p className="text-sm text-gray-500">{task.shortDescription}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Due: {task.dueDate}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/todo/${task.id}/done`}
                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                        title="Mark Done"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/todo/edit/${task.id}`}
                        className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition"
                        title="Edit Task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/todo/${task.id}`}
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* My Todos Section with Filters and Pagination */}
      <section className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-lg shadow-lg p-6 animate__animated animate__fadeInUp">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
            My Todos
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-base text-gray-600">
              Total: <span className="font-semibold">{allTasks.length}</span> |
              Completed: <span className="font-semibold text-green-600">{completedCount}</span> |
              Pending: <span className="font-semibold text-yellow-600">{pendingCount}</span>
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredTodos.length === 0 ? (
            <p className="py-6 text-center text-gray-500">No tasks found for the selected filters.</p>
          ) : (
            currentTasks.map((task, index) => (
              <div
                key={task.id}
                className={`py-5 px-4 flex flex-col md:flex-row justify-between items-start md:items-center ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
                } hover:bg-gray-200 transition duration-200 rounded-lg mb-2`}
              >
                <div>
                  <p className="font-semibold text-gray-800 text-lg">{task.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{task.shortDescription}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Added: <span className="font-medium">{task.dateAdded}</span> | Due: <span className="font-medium">{task.dueDate}</span>
                  </p>
                </div>
                {/* Responsive Button Group */}
                <div className="mt-3 md:mt-0 flex flex-wrap gap-2">
                  <button
                    className="flex items-center space-x-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Delete</span>
                  </button>
                  {!task.completed && (
                    <Link
                      to={`/todo/edit/${task.id}`}
                      className="flex items-center space-x-1 bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition"
                      title="Edit Task"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm">Edit</span>
                    </Link>
                  )}
                  <Link
                    to={`/todo/${task.id}`}
                    className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Show</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
        {filteredTodos.length > tasksPerPage && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`px-5 py-2 rounded-lg transition ${
                currentPage === 1
                  ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Previous
            </button>
            <span className="text-base text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of{' '}
              <span className="font-medium">{totalPages}</span>
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-5 py-2 rounded-lg transition ${
                currentPage === totalPages
                  ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default TodoDashboard;

