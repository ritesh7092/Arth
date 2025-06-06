// src/components/TodoDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'animate.css';
import {
  CheckCircle2,
  Calendar,
  ClipboardList,
  PlusCircle,
  Trash2,
  Edit2,
  Eye,
} from 'lucide-react';
import baseUrl from '../api/api';

const TodoDashboard = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const [selectedDate, setSelectedDate] = useState('');        // filter by dueDate
  const [selectedMonth, setSelectedMonth] = useState('All');   // filter by dueDate month
  const [selectedYear, setSelectedYear] = useState('All');     // filter by dueDate year
  const [showNotDoneOnly, setShowNotDoneOnly] = useState(false); // new: only show not-done in My Todos

  const months = [
    'All',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const years = ['All', '2024', '2025'];

  // Pull JWT from localStorage
  const getToken = () => localStorage.getItem('authToken');

  // Normalize date-like string into "YYYY-MM-DD"
  const normalizeDate = (dateString) => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  // Today's date string "YYYY-MM-DD"
  const todayStr = new Date().toISOString().split('T')[0];

  // Fetch tasks once
  const fetchTasks = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await baseUrl.get('/api/tasks?page=0&size=100', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pageObj = response.data; // Page<TaskDto>
      const rawArray = Array.isArray(pageObj.content) ? pageObj.content : [];

      // Normalize dueDate and dateAdded
      const normalized = rawArray.map((t) => ({
        ...t,
        dueDate: normalizeDate(t.dueDate),
        dateAdded: normalizeDate(t.dateAdded),
      }));
      setAllTasks(normalized);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ==== TODAY’S TASKS & COUNTS ====

  const tasksDueToday = allTasks.filter((t) => t.dueDate === todayStr);
  const totalTodayCount = tasksDueToday.length;
  const completedTodayCount = tasksDueToday.filter((t) => t.completed).length;
  const pendingTodayCount = totalTodayCount - completedTodayCount;

  const todayHighPriority = tasksDueToday.filter((t) => t.priority === 'high');
  const todayMediumPriority = tasksDueToday.filter((t) => t.priority === 'medium');
  const todayLowPriority = tasksDueToday.filter((t) => t.priority === 'low');

  // ==== MY TODOS: FILTER BY dueDate THEN OPTIONALLY NOT-DONE ====

  let filteredTodos = allTasks.filter((task) => {
    const d = task.dueDate;
    if (!d) return false;

    if (selectedDate) {
      return d === selectedDate;
    } else {
      const dt = new Date(d);
      const m = dt.getMonth(); // 0 = Jan
      const y = dt.getFullYear();
      const monthMatch = selectedMonth === 'All' || m === months.indexOf(selectedMonth) - 1;
      const yearMatch = selectedYear === 'All' || y === parseInt(selectedYear, 10);
      return monthMatch && yearMatch;
    }
  });

  // If "showNotDoneOnly" is true, filter out completed tasks
  if (showNotDoneOnly) {
    filteredTodos = filteredTodos.filter((t) => !t.completed);
  }

  // Sort by dueDate ascending (earliest due first); tasks with no dueDate go to end
  const filteredSortedByDue = [...filteredTodos].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  // Pagination
  const indexOfLast = currentPage * tasksPerPage;
  const indexOfFirst = indexOfLast - tasksPerPage;
  const currentTasks = filteredSortedByDue.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSortedByDue.length / tasksPerPage);

  const goNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const goPrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    if (e.target.value) {
      setSelectedMonth('All');
      setSelectedYear('All');
    }
    setCurrentPage(1);
  };
  const handleMonthChange = (e) => {
    setSelectedDate('');
    setSelectedMonth(e.target.value);
    setCurrentPage(1);
  };
  const handleYearChange = (e) => {
    setSelectedDate('');
    setSelectedYear(e.target.value);
    setCurrentPage(1);
  };

  const handleToggleNotDone = () => {
    setShowNotDoneOnly((prev) => !prev);
    setCurrentPage(1);
  };

  // Delete a task
  const handleDelete = async (id) => {
    const token = getToken();
    if (!token) return;
    try {
      await baseUrl.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  // Mark Done
  const handleMarkDone = async (id) => {
    const token = getToken();
    if (!token) return;
    try {
      await baseUrl.put(
        `/api/tasks/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.error('Error marking done:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      {/* ===== TODAY’S COUNTS ===== */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-5 flex items-center space-x-4 animate__animated animate__fadeInUp">
          <Calendar className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-500">Total Today</p>
            <p className="mt-1 text-2xl font-bold text-gray-800">
              {totalTodayCount}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5 flex items-center space-x-4 animate__animated animate__fadeInUp animate__delay-1s">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
          <div>
            <p className="text-sm font-medium text-gray-500">Completed Today</p>
            <p className="mt-1 text-2xl font-bold text-gray-800">
              {completedTodayCount}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5 flex items-center space-x-4 animate__animated animate__fadeInUp animate__delay-2s">
          <ClipboardList className="w-8 h-8 text-yellow-600" />
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Today</p>
            <p className="mt-1 text-2xl font-bold text-gray-800">
              {pendingTodayCount}
            </p>
          </div>
        </div>
        {/* New: Priority Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-5 animate__animated animate__fadeInUp animate__delay-3s">
          <p className="text-sm font-medium text-gray-500 mb-2">Priority Today</p>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-gray-700">
              🔴 High: <span className="font-semibold">{todayHighPriority.length}</span>
            </span>
            <span className="text-sm text-gray-700">
              🟡 Medium: <span className="font-semibold">{todayMediumPriority.length}</span>
            </span>
            <span className="text-sm text-gray-700">
              🟢 Low: <span className="font-semibold">{todayLowPriority.length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ===== TASKS DUE TODAY BANNER ===== */}
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
            <h2 className="text-4xl font-extrabold text-white">
              Tasks Due Today
            </h2>
            <p className="text-lg text-gray-300 mt-2">
              Keep your goals on track with focus.
            </p>
          </div>
          <Link
            to="/addtask"
            className="mt-6 sm:mt-0 inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition duration-300"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Task
          </Link>
        </div>
      </header>

      {/* ===== PRIORITY COLUMNS (Due Today) ===== */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate__animated animate__fadeInUp">
        {/* High Priority */}
        <div className="bg-red-50 border-l-4 border-red-600 rounded-lg shadow-md overflow-hidden">
          <div className="bg-red-600 p-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <span className="inline-block w-2 h-2 bg-white rounded-full mr-2" />
              High Priority (Today)
            </h3>
          </div>
          <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
            {todayHighPriority.length === 0 ? (
              <p className="text-gray-600 text-sm">
                No high-priority tasks for today.
              </p>
            ) : (
              todayHighPriority.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {task.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {task.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Due: {task.dueDate}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {!task.completed && (
                        <button
                          onClick={() => handleMarkDone(task.id)}
                          className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                          title="Mark Done"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      <Link
                        to={`/todo/edit/${task.id}`}
                        className="p-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition"
                        title="Edit Task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/todo/${task.id}`}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
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
        <div className="bg-yellow-50 border-l-4 border-yellow-600 rounded-lg shadow-md overflow-hidden">
          <div className="bg-yellow-600 p-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <span className="inline-block w-2 h-2 bg-white rounded-full mr-2" />
              Medium Priority (Today)
            </h3>
          </div>
          <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
            {todayMediumPriority.length === 0 ? (
              <p className="text-gray-600 text-sm">
                No medium-priority tasks for today.
              </p>
            ) : (
              todayMediumPriority.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {task.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {task.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Due: {task.dueDate}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {!task.completed && (
                        <button
                          onClick={() => handleMarkDone(task.id)}
                          className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                          title="Mark Done"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      <Link
                        to={`/todo/edit/${task.id}`}
                        className="p-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition"
                        title="Edit Task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/todo/${task.id}`}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
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
        <div className="bg-green-50 border-l-4 border-green-600 rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-600 p-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <span className="inline-block w-2 h-2 bg-white rounded-full mr-2" />
              Low Priority (Today)
            </h3>
          </div>
          <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
            {todayLowPriority.length === 0 ? (
              <p className="text-gray-600 text-sm">
                No low-priority tasks for today.
              </p>
            ) : (
              todayLowPriority.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {task.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {task.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Due: {task.dueDate}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {!task.completed && (
                        <button
                          onClick={() => handleMarkDone(task.id)}
                          className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                          title="Mark Done"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      <Link
                        to={`/todo/edit/${task.id}`}
                        className="p-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition"
                        title="Edit Task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/todo/${task.id}`}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
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

      {/* =====================================
          MY TODOS (ascending dueDate, with FILTERS)
         ===================================== */}
      <section className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-lg shadow-md p-6 animate__animated animate__fadeInUp">
        {/* Filters & Counts */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center border-b border-gray-300 pb-2">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
            My Todos
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-base text-gray-600">
              Total: <span className="font-semibold">{filteredSortedByDue.length}</span> |{' '}
              Completed: <span className="font-semibold text-green-600">
                {filteredSortedByDue.filter((t) => t.completed).length}
              </span> | Pending: <span className="font-semibold text-yellow-600">
                {filteredSortedByDue.filter((t) => !t.completed).length}
              </span>
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
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showNotDoneOnly}
                onChange={handleToggleNotDone}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Show only not-done</span>
            </label>
          </div>
        </div>

        {/* Task List */}
        <div className="divide-y divide-gray-200">
          {filteredSortedByDue.length === 0 ? (
            <p className="py-6 text-center text-gray-500">
              No tasks match your filters.
            </p>
          ) : (
            currentTasks.map((task, index) => (
              <div
                key={task.id}
                className={`py-5 px-4 flex flex-col md:flex-row justify-between items-start md:items-center ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
                } hover:bg-gray-200 transition duration-200 rounded-lg mb-2`}
              >
                <div>
                  <p className="font-semibold text-gray-800 text-lg">
                    {task.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {task.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Due: <span className="font-medium">{task.dueDate}</span>
                  </p>
                </div>
                <div className="mt-3 md:mt-0 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="flex items-center space-x-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Delete</span>
                  </button>
                  {!task.completed && (
                    <button
                      onClick={() => handleMarkDone(task.id)}
                      className="flex items-center space-x-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition"
                      title="Mark Done"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm">Done</span>
                    </button>
                  )}
                  {!task.completed && (
                    <Link
                      to={`/todo/edit/${task.id}`}
                      className="flex items-center space-x-1 bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-700 transition"
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

        {/* Pagination */}
        {filteredSortedByDue.length > tasksPerPage && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={goPrev}
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
              onClick={goNext}
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
