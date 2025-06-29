import React from "react";
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, Users, Clock, CreditCard } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => (
  <div className={`bg-white text-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 transition-all duration-300 hover:bg-gray-50`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          ₹{typeof value === 'number' ? value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}
        </p>
      </div>
      <Icon className={`w-8 h-8 text-${color}-500`} />
    </div>
  </div>
);

const AnalyticsStats = ({ analytics }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard title="Total Income" value={analytics.totalIncome} icon={TrendingUp} color="green" />
      <StatCard title="Total Expenses" value={analytics.totalExpense} icon={TrendingDown} color="red" />
      <StatCard title="Net Balance" value={analytics.netBalance} icon={DollarSign} color={analytics.netBalance >= 0 ? "green" : "red"} />
      <StatCard title="Outstanding Debt" value={analytics.outstandingDebt} icon={AlertTriangle} color="orange" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard title="Loans Given" value={analytics.totalLoansGiven} icon={Users} color="blue" />
      <StatCard title="Unpaid Loans" value={analytics.unpaidLoans} icon={Clock} color="red" />
      <StatCard title="Total Borrowed" value={analytics.totalBorrowed} icon={CreditCard} color="purple" />
    </div>
  </>
);

export default AnalyticsStats;