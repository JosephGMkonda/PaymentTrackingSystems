import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMonthlyReport } from "../features/Report/reportSlice.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Reports() {
  const { year: urlYear, month: urlMonth } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, report } = useSelector(state => state.report);
  
  // State for controlled inputs
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  // Initialize from URL params or current date
  useEffect(() => {
    const currentDate = new Date();
    const initialYear = urlYear || currentDate.getFullYear().toString();
    const initialMonth = urlMonth || (currentDate.getMonth() + 1).toString();
    
    setSelectedYear(initialYear);
    setSelectedMonth(initialMonth);

    // Load data if URL params exist
    if (urlYear && urlMonth) {
      const yearNum = parseInt(urlYear);
      const monthNum = parseInt(urlMonth);
      if (!isNaN(yearNum) && !isNaN(monthNum)) {
        dispatch(fetchMonthlyReport({ year: yearNum, month: monthNum }));
      }
    }
  }, [urlYear, urlMonth, dispatch]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const yearNum = parseInt(selectedYear);
    const monthNum = parseInt(selectedMonth);
    
    if (!isNaN(yearNum) && !isNaN(monthNum)) {
      navigate(`/reports/${yearNum}/${monthNum}`);
    }
  };

  // Generate year and month options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Prepare data for charts
  const dailyPaymentsData = report ? {
    labels: report.dailyPayments.map(item => item.date),
    datasets: [
      {
        label: 'Daily Payments (MK)',
        data: report.dailyPayments.map(item => item.totalAmount),
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
      },
    ],
  } : { labels: [], datasets: [] };

  const billStatusData = report ? {
    labels: report.billStatus.map(item => item.status),
    datasets: [
      {
        label: 'Bill Status Count',
        data: report.billStatus.map(item => item.count),
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)', // paid - green
          'rgba(239, 68, 68, 0.7)',   // unpaid - red
          'rgba(245, 158, 11, 0.7)',  // overdue - yellow
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 1,
      },
    ],
  } : { labels: [], datasets: [] };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Date Selection Form */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Report Period</h2>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Generate Report
              </button>
              <button
                type="button"
                onClick={() => {
                  const date = new Date();
                  navigate(`/reports/${date.getFullYear()}/${date.getMonth() + 1}`);
                }}
                className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
              >
                Current Month
              </button>
            </div>
          </form>
        </div>

        {/* Loading/Error States */}
        {loading && <div className="flex justify-center items-center h-64">Loading report data...</div>}
        {error && <div className="text-red-500 text-center p-4">Error: {error}</div>}
        
        {/* Report Display */}
        {report && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Monthly Report for {new Date(report.period).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </h1>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <SummaryCard
                title="Total Customers"
                value={report.totalCustomers}
                icon={<UsersIcon />}
                color="bg-indigo-100 text-indigo-600"
              />
              <SummaryCard
                title="New Customers"
                value={report.newCustomers}
                icon={<UserAddIcon />}
                color="bg-green-100 text-green-600"
              />
              <SummaryCard
                title="Total Payments (MK)"
                value={report.monthlyPayments.toLocaleString()}
                icon={<CurrencyIcon />}
                color="bg-blue-100 text-blue-600"
              />
              <SummaryCard
                title="Collection Rate"
                value={`${report.collectionRate}%`}
                icon={<TrendingUpIcon />}
                color="bg-purple-100 text-purple-600"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Daily Payments</h2>
                <div className="h-80">
                  <Bar
                    data={dailyPaymentsData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `MK ${context.raw.toLocaleString()}`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return `MK ${value.toLocaleString()}`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Bill Status</h2>
                <div className="h-80">
                  <Bar
                    data={billStatusData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Top Customers */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h2 className="text-xl font-semibold mb-4">Top 5 Customers</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Paid (MK)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {report.topCustomers.map((customer, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-600 font-medium">
                                {customer.customerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{customer.customerName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phoneNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {parseFloat(customer.totalPaid).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Daily Payment Details</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount (MK)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Count</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {report.dailyPayments.map((payment, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {parseFloat(payment.totalAmount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.paymentCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Summary Card Component
const SummaryCard = ({ title, value, icon, color }) => (
  <div className={`p-6 rounded-lg shadow ${color.split(' ')[0]}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

// Icons
const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const UserAddIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const CurrencyIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export default Reports;