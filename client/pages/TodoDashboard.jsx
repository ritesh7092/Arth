// TodoDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'animate.css'; // For animations

const TodoDashboard = () => {
  // Sample tasks simulating fetched data
  const sampleTasks = [
    { id: 1, title: "Finish report", shortDescription: "Complete quarterly report", priority: "high", dateAdded: "2025-03-28", dueDate: "2025-03-28", completed: false },
    { id: 2, title: "Team meeting", shortDescription: "Discuss project progress", priority: "medium", dateAdded: "2025-02-15", dueDate: "2025-02-15", completed: false },
    { id: 3, title: "Email client", shortDescription: "Follow up on proposal", priority: "low", dateAdded: "2025-03-25", dueDate: "2025-03-25", completed: false },
    { id: 4, title: "Design review", shortDescription: "Review new UI designs", priority: "high", dateAdded: "2025-01-10", dueDate: "2025-01-10", completed: true },
    { id: 5, title: "Plan webinar", shortDescription: "Outline topics and create slides", priority: "medium", dateAdded: "2025-03-20", dueDate: "2025-03-20", completed: false },
    { id: 6, title: "Budget analysis", shortDescription: "Review monthly budget", priority: "high", dateAdded: "2025-03-29", dueDate: "2025-03-29", completed: false },
    { id: 7, title: "Client follow-up", shortDescription: "Call to discuss feedback", priority: "medium", dateAdded: "2025-02-28", dueDate: "2025-02-28", completed: false },
    { id: 8, title: "Old Task Example", shortDescription: "Task from previous year", priority: "medium", dateAdded: "2024-10-05", dueDate: "2024-10-05", completed: false },
  ];

  const [todayTasks, setTodayTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  // Pagination state for "My Todos"
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;
  // Filter states
  const [selectedDate, setSelectedDate] = useState(""); // For a specific day
  const [selectedMonth, setSelectedMonth] = useState("All"); // For month filtering
  const [selectedYear, setSelectedYear] = useState("All");   // For year filtering

  // Predefined options for months and years
  const months = ["All", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const years = ["All", "2024", "2025"]; // Adjust as needed

  useEffect(() => {
    // Simulate API fetching and sort tasks (most recent first)
    const sortedTasks = [...sampleTasks].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    setTodayTasks(sortedTasks);
    setAllTasks(sortedTasks);
  }, []);

  const completedCount = allTasks.filter(task => task.completed).length;
  const pendingCount = allTasks.length - completedCount;

  // For priority columns (using today's tasks)
  const filterByPriority = (priority) => todayTasks.filter(task => task.priority === priority);

  // Filtering "My Todos" based on either a specific date or month/year
  const filteredTodos = allTasks.filter(task => {
    if (selectedDate) {
      return task.dateAdded === selectedDate;
    } else {
      const taskDate = new Date(task.dateAdded);
      const taskMonth = taskDate.getMonth(); // 0-indexed: Jan=0, Feb=1, etc.
      const taskYear = taskDate.getFullYear();
      let monthMatch = selectedMonth === "All" || taskMonth === (months.indexOf(selectedMonth) - 1); 
      let yearMatch = selectedYear === "All" || taskYear === parseInt(selectedYear, 10);
      return monthMatch && yearMatch;
    }
  });

  // Pagination calculations
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTodos.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTodos.length / tasksPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  // Handlers for filter changes; reset pagination on filter change.
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    // Clear month/year filters when a specific date is selected.
    if (e.target.value) {
      setSelectedMonth("All");
      setSelectedYear("All");
    }
    setCurrentPage(1);
  };

  const handleMonthChange = (e) => {
    setSelectedDate(""); // Clear specific date filter
    setSelectedMonth(e.target.value);
    setCurrentPage(1);
  };

  const handleYearChange = (e) => {
    setSelectedDate(""); // Clear specific date filter
    setSelectedYear(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-10">
      {/* Header Section */}
      <header 
        className="relative rounded-xl overflow-hidden shadow-2xl animate__animated animate__fadeIn"
        style={{
          background: "linear-gradient(135deg, #1F2937, #111827)",
          backgroundImage: "url('/assets/images/todo-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="relative z-10 p-8 flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h2 className="text-4xl font-bold text-white">Tasks Due Today</h2>
            <p className="text-lg text-gray-300 mt-2">Keep your goals on track with precision.</p>
          </div>
          <Link 
            to="/todo/add" 
            className="mt-6 sm:mt-0 bg-green-500 text-white px-8 py-3 rounded-full shadow-lg hover:bg-green-600 transition duration-300"
          >
            + Add Task
          </Link>
        </div>
      </header>

      {/* Priority Columns Section (Smaller Boxes) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 animate__animated animate__fadeInUp">
        {/* High Priority */}
        <div className="bg-red-100 border-l-4 border-red-500 rounded-lg shadow p-4">
          <h3 className="text-lg font-bold text-red-700 mb-3">High Priority</h3>
          {filterByPriority('high').length === 0 ? (
            <p className="text-base text-gray-600">No tasks for today.</p>
          ) : (
            filterByPriority('high').map(task => (
              <div
                key={task.id}
                className="p-3 mb-3 bg-white rounded shadow hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <p className="font-semibold text-gray-800 text-base">{task.title}</p>
                <p className="text-xs text-gray-500">{task.shortDescription}</p>
                <div className="mt-2 flex justify-end space-x-2">
                  <Link
                    to={`/todo/${task.id}/done`}
                    className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600 transition"
                  >
                    Done
                  </Link>
                  <Link
                    to={`/todo/${task.id}`}
                    className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Show
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Medium Priority */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 rounded-lg shadow p-4">
          <h3 className="text-lg font-bold text-yellow-700 mb-3">Medium Priority</h3>
          {filterByPriority('medium').length === 0 ? (
            <p className="text-base text-gray-600">No tasks for today.</p>
          ) : (
            filterByPriority('medium').map(task => (
              <div
                key={task.id}
                className="p-3 mb-3 bg-white rounded shadow hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <p className="font-semibold text-gray-800 text-base">{task.title}</p>
                <p className="text-xs text-gray-500">{task.shortDescription}</p>
                <div className="mt-2 flex justify-end space-x-2">
                  <Link
                    to={`/todo/${task.id}/done`}
                    className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600 transition"
                  >
                    Done
                  </Link>
                  <Link
                    to={`/todo/${task.id}`}
                    className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Show
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Low Priority */}
        <div className="bg-green-100 border-l-4 border-green-500 rounded-lg shadow p-4">
          <h3 className="text-lg font-bold text-green-700 mb-3">Low Priority</h3>
          {filterByPriority('low').length === 0 ? (
            <p className="text-base text-gray-600">No tasks for today.</p>
          ) : (
            filterByPriority('low').map(task => (
              <div
                key={task.id}
                className="p-3 mb-3 bg-white rounded shadow hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <p className="font-semibold text-gray-800 text-base">{task.title}</p>
                <p className="text-xs text-gray-500">{task.shortDescription}</p>
                <div className="mt-2 flex justify-end space-x-2">
                  <Link
                    to={`/todo/${task.id}/done`}
                    className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600 transition"
                  >
                    Done
                  </Link>
                  <Link
                    to={`/todo/${task.id}`}
                    className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Show
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* My Todos Section with Filters and Pagination */}
      <section className="bg-white border border-gray-300 rounded-lg shadow-xl p-6 animate__animated animate__fadeInUp">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-800">My Todos</h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-base text-gray-700">
              Total: {allTasks.length} | Completed: {completedCount} | Pending: {pendingCount}
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="divide-y divide-gray-300">
          {filteredTodos.length === 0 ? (
            <p className="py-4 text-gray-500 text-base">No tasks found for the selected filters.</p>
          ) : (
            currentTasks.map((task, index) => (
              <div
                key={task.id}
                className={`py-4 flex flex-col md:flex-row justify-between items-start md:items-center ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
                } transition duration-300 hover:bg-gray-200 rounded`}
              >
                <div className="mb-2 md:mb-0">
                  <p className="font-semibold text-gray-800 text-lg">{task.title}</p>
                  <p className="text-base text-gray-600">{task.shortDescription}</p>
                  <p className="text-sm text-gray-500">
                    Added: {task.dateAdded} | Due: {task.dueDate}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button className="bg-red-600 text-white px-4 py-2 rounded text-base hover:bg-red-700 transition">
                    Delete
                  </button>
                  {!task.completed && (
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded text-base hover:bg-yellow-600 transition">
                      Edit
                    </button>
                  )}
                  <Link
                    to={`/todo/${task.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-base hover:bg-blue-700 transition"
                  >
                    Show
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
              className={`px-4 py-2 rounded transition ${
                currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Previous
            </button>
            <span className="text-base text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded transition ${
                currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
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

