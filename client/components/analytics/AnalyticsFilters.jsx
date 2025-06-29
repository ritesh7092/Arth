import React from "react";
import { Filter, Download, FileText, Printer } from "lucide-react";

const AnalyticsFilters = ({
  filterYear, setFilterYear,
  filterMonth, setFilterMonth,
  filterMinAmount, setFilterMinAmount,
  filterMaxAmount, setFilterMaxAmount,
  filterPaymentMethod, setFilterPaymentMethod,
  filterDueStatus, setFilterDueStatus,
  paymentMethods,
  clearFilters, exportToCSV, exportToPDF, handlePrint, isPdfGenerating
}) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Filter className="w-5 h-5 mr-2" /> Filters
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      <div>
        <label htmlFor="filter-year" className="block text-sm font-medium text-gray-600 mb-1">Year</label>
        <input id="filter-year" type="number" value={filterYear} onChange={e => setFilterYear(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., 2025" />
      </div>
      <div>
        <label htmlFor="filter-month" className="block text-sm font-medium text-gray-600 mb-1">Month</label>
        <input id="filter-month" type="month"
          value={filterMonth ? `${filterYear}-${filterMonth}` : ""}
          onChange={e => setFilterMonth(e.target.value ? e.target.value.substring(5, 7) : "")}
          className="w-full px-3 py-2 rounded-lg border bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>
      <div>
        <label htmlFor="filter-min-amount" className="block text-sm font-medium text-gray-600 mb-1">Min Amount</label>
        <input id="filter-min-amount" type="number" value={filterMinAmount} onChange={e => setFilterMinAmount(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Min" />
      </div>
      <div>
        <label htmlFor="filter-max-amount" className="block text-sm font-medium text-gray-600 mb-1">Max Amount</label>
        <input id="filter-max-amount" type="number" value={filterMaxAmount} onChange={e => setFilterMaxAmount(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Max" />
      </div>
      <div>
        <label htmlFor="filter-payment-method" className="block text-sm font-medium text-gray-600 mb-1">Payment Method</label>
        <select id="filter-payment-method" value={filterPaymentMethod} onChange={e => setFilterPaymentMethod(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          {paymentMethods.map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="filter-due-status" className="block text-sm font-medium text-gray-600 mb-1">Due Status</label>
        <select id="filter-due-status" value={filterDueStatus} onChange={e => setFilterDueStatus(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="All">All</option>
          <option value="PAID">Paid</option>
          <option value="UNPAID">Unpaid</option>
          <option value="PARTIALLY_PAID">Partially Paid</option>
        </select>
      </div>
    </div>
    <div className="flex flex-wrap gap-3 mt-4">
      <button onClick={clearFilters} className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center">
        <Filter className="w-4 h-4 mr-2" /> Clear Filters
      </button>
      <button onClick={exportToCSV} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center">
        <Download className="w-4 h-4 mr-2" /> Export CSV
      </button>
      <button onClick={exportToPDF} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors flex items-center" disabled={isPdfGenerating}>
        {isPdfGenerating ? (
          <span className="flex items-center">
            <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </span>
        ) : (
          <>
            <FileText className="w-4 h-4 mr-2" /> Export PDF
          </>
        )}
      </button>
      <button onClick={handlePrint} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors flex items-center">
        <Printer className="w-4 h-4 mr-2" /> Print Report
      </button>
    </div>
  </div>
);

export default AnalyticsFilters;