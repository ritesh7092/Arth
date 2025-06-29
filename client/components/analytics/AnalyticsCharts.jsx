import React from "react";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";

const AnalyticsCharts = ({
  activeTab,
  barChartRef,
  pieChartRef,
  lineChartRef,
  netLineChartRef,
  categoryBarData,
  paymentMethodPieData,
  monthlyLineData,
  monthlyNetTotalData,
  loanStatusData,
  chartOptions,
  analytics,
  themeClasses
}) => {
  if (activeTab === "overview") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg border ${themeClasses.border}`}>
          <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Category Breakdown (Filtered Data)</h3>
          <div style={{ height: '300px' }}>
            <Bar ref={barChartRef} data={categoryBarData} options={chartOptions} />
          </div>
        </div>
        <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg border ${themeClasses.border}`}>
          <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Payment Methods Distribution (Filtered Data)</h3>
          <div style={{ height: '300px' }}>
            <Doughnut data={paymentMethodPieData} options={chartOptions} />
          </div>
        </div>
      </div>
    );
  }
  if (activeTab === "trends") {
    return (
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg border ${themeClasses.border}`}>
          <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Monthly Income vs Expenses</h3>
          <div style={{ height: '400px' }}>
            <Line ref={lineChartRef} data={monthlyLineData} options={chartOptions} />
          </div>
        </div>
        <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg border ${themeClasses.border}`}>
          <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Monthly Net Balance</h3>
          <div style={{ height: '400px' }}>
            <Line ref={netLineChartRef} data={monthlyNetTotalData} options={chartOptions} />
          </div>
        </div>
      </div>
    );
  }
  if (activeTab === "categories") {
    return (
      <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg border ${themeClasses.border} mb-8`}>
        <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Category Distribution (Overall Filtered Data)</h3>
        <div style={{ height: '400px' }}>
          <Pie ref={pieChartRef} data={categoryBarData} options={chartOptions} />
        </div>
      </div>
    );
  }
  return null;
};

export default AnalyticsCharts;