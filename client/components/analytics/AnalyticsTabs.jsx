import React from "react";
import { BarChart3, LineChart, PieChart, Users } from "lucide-react";

const TabButton = ({ id, label, icon: Icon, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      activeTab === id
        ? 'bg-blue-500 text-white shadow-lg'
        : 'text-gray-900 hover:bg-blue-100'
    }`}
  >
    <Icon className="w-4 h-4 mr-2" />
    {label}
  </button>
);

const AnalyticsTabs = ({ activeTab, setActiveTab }) => (
  <div className="flex flex-wrap gap-2 mb-6">
    <TabButton id="overview" label="Overview" icon={BarChart3} activeTab={activeTab} setActiveTab={setActiveTab} />
    <TabButton id="trends" label="Trends" icon={LineChart} activeTab={activeTab} setActiveTab={setActiveTab} />
    <TabButton id="categories" label="Categories" icon={PieChart} activeTab={activeTab} setActiveTab={setActiveTab} />
    <TabButton id="loans" label="Loans & Debts" icon={Users} activeTab={activeTab} setActiveTab={setActiveTab} />
  </div>
);

export default AnalyticsTabs;