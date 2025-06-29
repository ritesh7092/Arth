import React from "react";
import { Sun, Moon } from "lucide-react";

const AnalyticsHeader = ({ theme, toggleTheme, isDark, onDashboard }) => (
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
    <div>
      <h1 className={`text-4xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-2`}>
        Transaction Analytics
      </h1>
      <p className={isDark ? "text-gray-400" : "text-gray-600"}>
        Comprehensive insights into your financial data
      </p>
      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mt-1`}>
        Arth: Revolutionize Your Productivity | Designed & Developed by Ritesh Raj Tiwari
      </p>
    </div>
    <div className="flex items-center gap-3">
      <button
        onClick={toggleTheme}
        className={`p-3 rounded-lg ${isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"} border ${isDark ? "border-gray-700" : "border-gray-200"} hover:scale-105 transition-transform`}
        aria-label="Toggle theme"
        title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      >
        {isDark ? <Sun className="w-5 h-5 text-yellow-300" /> : <Moon className="w-5 h-5 text-indigo-700" />}
      </button>
      <button
        onClick={onDashboard}
        className="no-print ml-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow transition"
        title="Go to Finance Dashboard"
      >
        Go to Dashboard
      </button>
    </div>
  </div>
);

export default AnalyticsHeader;