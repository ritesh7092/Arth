import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaChartLine, FaTasks, FaPlus, FaComments, FaFileAlt, FaBars } from 'react-icons/fa';

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h3 className="text-xl font-semibold">Arth</h3>
          <button onClick={() => setOpen(false)} className="text-2xl focus:outline-none">
            &times;
          </button>
        </div>
        <ul className="mt-4 space-y-1">
          <li className="px-4 py-2 hover:bg-gray-700">
            <Link to="/" onClick={() => setOpen(false)} className="flex items-center">
              <FaHome className="mr-2" /> Home
            </Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700">
            <Link to="/finance/dashboard" onClick={() => setOpen(false)} className="flex items-center">
              <FaChartLine className="mr-2" /> Finance Dashboard
            </Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700">
            <Link to="/todo/dashboard" onClick={() => setOpen(false)} className="flex items-center">
              <FaTasks className="mr-2" /> Todo Dashboard
            </Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700">
            <Link to="/finance/add" onClick={() => setOpen(false)} className="flex items-center">
              <FaPlus className="mr-2" /> Add Finance
            </Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700">
            <Link to="/addtask" onClick={() => setOpen(false)} className="flex items-center">
              <FaPlus className="mr-2" /> Add Todo
            </Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700">
            <Link to="/chatbot" onClick={() => setOpen(false)} className="flex items-center">
              <FaComments className="mr-2" /> Arth (AI Assistant)
            </Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700">
            <Link to="/finance/report" onClick={() => setOpen(false)} className="flex items-center">
              <FaFileAlt className="mr-2" /> Finance Reports
            </Link>
          </li>
        </ul>
      </div>
      
      {/* Menu Icon */}
      <div className="fixed top-4 left-4 z-50">
        <button onClick={() => setOpen(true)} className="text-3xl text-gray-800 focus:outline-none">
          <FaBars />
        </button>
      </div>
    </>
  );
};

export default Sidebar;
