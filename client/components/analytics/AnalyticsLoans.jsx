import React from "react";
import { Doughnut } from "react-chartjs-2";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

const AnalyticsLoans = ({ loanStatusData, chartOptions, analytics, themeClasses }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg border ${themeClasses.border}`}>
      <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Loan Status Distribution (Filtered Data)</h3>
      <div style={{ height: '300px' }}>
        <Doughnut data={loanStatusData} options={chartOptions} />
      </div>
    </div>
    <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg border ${themeClasses.border}`}>
      <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Outstanding Loans Summary</h3>
      <ul className="list-disc pl-5">
        <li className={`text-sm ${themeClasses.text} flex items-center mb-2`}>
          <CheckCircle className="inline w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
          <span className="font-medium">Total Loans Given:</span> ₹{analytics.totalLoansGiven.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </li>
        <li className={`text-sm ${themeClasses.text} flex items-center mb-2`}>
          <AlertCircle className="inline w-4 h-4 mr-2 text-yellow-500 flex-shrink-0" />
          <span className="font-medium">Partially Paid Loans:</span> ₹{analytics.partiallyPaidLoans.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </li>
        <li className={`text-sm ${themeClasses.text} flex items-center`}>
          <XCircle className="inline w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
          <span className="font-medium">Unpaid Loans:</span> ₹{analytics.unpaidLoans.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </li>
      </ul>
    </div>
  </div>
);

export default AnalyticsLoans;