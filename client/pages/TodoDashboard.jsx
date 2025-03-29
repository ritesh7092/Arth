import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'animate.css'; // For fade-in animations
import Navbar from '../components/NavbarWithSidebar';

const TodoDashboard = () => {
  // Sample tasks simulating fetched data (dateAdded in "YYYY-MM-DD" format)
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

  // For priority columns (using all tasks sorted by date)
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
      // Explanation: months[0] is "All", so Jan is at index 1 which corresponds to 0.
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
      {/* <Navbar/> */}
      <header 
        className="relative rounded-lg overflow-hidden shadow-lg animate__animated animate__fadeIn"
        style={{
          background: "linear-gradient(135deg, #5D9CEC, #4267B2)",
          backgroundImage: "url('/assets/images/dashboard-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-blue-900 opacity-60"></div>
        <div className="relative z-10 p-6 flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h2 className="text-3xl font-semibold text-white">Tasks Due Today</h2>
            <p className="text-sm text-blue-100">Keep your goals on track</p>
          </div>
          <Link 
            to="/todo/add" 
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            + Add Task
          </Link>
        </div>
      </header>

      {/* Priority Columns Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate__animated animate__fadeInUp">
        {/* High Priority Column */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">High Priority</h3>
          {filterByPriority('high').length === 0 ? (
            <p className="text-sm text-gray-500">No tasks for today</p>
          ) : (
            filterByPriority('high').map(task => (
              <div
                key={task.id}
                className="p-3 mb-3 bg-white rounded shadow flex justify-between items-center transition transform hover:scale-105"
              >
                <div>
                  <p className="font-medium text-gray-800">{task.title}</p>
                  <p className="text-xs text-gray-500">{task.shortDescription}</p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/todo/${task.id}/done`}
                    className="bg-green-600 text-white text-xs px-2 py-1 rounded hover:bg-green-700 transition"
                  >
                    Done
                  </Link>
                  <Link
                    to={`/todo/${task.id}`}
                    className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Show
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Medium Priority Column */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">Medium Priority</h3>
          {filterByPriority('medium').length === 0 ? (
            <p className="text-sm text-gray-500">No tasks for today</p>
          ) : (
            filterByPriority('medium').map(task => (
              <div
                key={task.id}
                className="p-3 mb-3 bg-white rounded shadow flex justify-between items-center transition transform hover:scale-105"
              >
                <div>
                  <p className="font-medium text-gray-800">{task.title}</p>
                  <p className="text-xs text-gray-500">{task.shortDescription}</p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/todo/${task.id}/done`}
                    className="bg-green-600 text-white text-xs px-2 py-1 rounded hover:bg-green-700 transition"
                  >
                    Done
                  </Link>
                  <Link
                    to={`/todo/${task.id}`}
                    className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Show
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Low Priority Column */}
        <div className="bg-green-50 border border-green-200 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-4">Low Priority</h3>
          {filterByPriority('low').length === 0 ? (
            <p className="text-sm text-gray-500">No tasks for today</p>
          ) : (
            filterByPriority('low').map(task => (
              <div
                key={task.id}
                className="p-3 mb-3 bg-white rounded shadow flex justify-between items-center transition transform hover:scale-105"
              >
                <div>
                  <p className="font-medium text-gray-800">{task.title}</p>
                  <p className="text-xs text-gray-500">{task.shortDescription}</p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/todo/${task.id}/done`}
                    className="bg-green-600 text-white text-xs px-2 py-1 rounded hover:bg-green-700 transition"
                  >
                    Done
                  </Link>
                  <Link
                    to={`/todo/${task.id}`}
                    className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700 transition"
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
      <section className="bg-gray-50 border border-gray-200 rounded-lg shadow p-6 animate__animated animate__fadeInUp">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
          <h2 className="text-xl font-semibold text-gray-800">My Todos</h2>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-x-4">
            <span className="text-sm text-gray-600">
              Total: {allTasks.length} | Completed: {completedCount} | Pending: {pendingCount}
            </span>
            {/* Specific Date Filter */}
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
            />
            {/* Month Filter */}
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            {/* Year Filter */}
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredTodos.length === 0 ? (
            <p className="py-4 text-gray-500">No tasks found for the selected date or filter</p>
          ) : (
            currentTasks.map((task, index) => (
              <div
                key={task.id}
                className={`py-4 flex flex-col md:flex-row justify-between items-start md:items-center ${
                  index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-50'
                } transition duration-300 hover:bg-gray-200`}
              >
                <div className="mb-2 md:mb-0">
                  <p className="font-medium text-gray-800">{task.title}</p>
                  <p className="text-sm text-gray-600">{task.shortDescription}</p>
                  <p className="text-xs text-gray-500">
                    Added: {task.dateAdded} | Due: {task.dueDate}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition">
                    Delete
                  </button>
                  {!task.completed && (
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition">
                      Edit
                    </button>
                  )}
                  <Link
                    to={`/todo/${task.id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                  >
                    Show
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
        {filteredTodos.length > tasksPerPage && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded transition ${
                currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
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
