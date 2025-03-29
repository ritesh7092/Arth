// AddTodo.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddTodo = () => {
  const [todoData, setTodoData] = useState({
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    type: ''
  });
  const [flashMessage, setFlashMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTodoData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic client-side validation
    if (!todoData.title.trim() || !todoData.description.trim() || !todoData.priority || !todoData.dueDate || !todoData.type) {
      setFlashMessage({ type: 'error', message: 'Please fill in all required fields.' });
      setTimeout(() => setFlashMessage(null), 3000);
      return;
    }
    // Simulate API submission – replace with your logic
    setFlashMessage({ type: 'success', message: 'TODO Task created successfully.' });
    setTodoData({ title: '', description: '', priority: '', dueDate: '', type: '' });
    setTimeout(() => setFlashMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content (Navbar & Footer are global) */}
      <main className="container mx-auto py-10 px-4 flex-grow">
        {flashMessage && (
          <div className={`mb-6 p-4 rounded-md text-center shadow-lg ${flashMessage.type === 'error' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
            {flashMessage.message}
          </div>
        )}

        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-2xl transform transition duration-500 hover:scale-105">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
            Add TODO Task
          </h2>
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
            <div className="flex space-x-4 mt-6">
              <button type="submit" className="w-1/2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Create Task
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

export default AddTodo;

