import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics, fetchBillTrends, fetchPaymentsTrends } from '../features/Home/analyticsSlice';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Home() {
  const dispatch = useDispatch();
  const { data, historicalPayments,billsTrends, status, error } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchAnalytics());
    dispatch(fetchBillTrends());
    dispatch(fetchPaymentsTrends());

  }, [dispatch]);

  if (status === 'loading') return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (status === 'failed') {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!data) {
    return null;
  }

  // Prepare chart data
  const barChartData = {
    labels: billsTrends?.map(item => item.month) || [],
    datasets: [
      {
        label: 'Total Amount (MWK)',
        data: billsTrends?.map(item => item.totalAmount) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        label: 'Total Bills',
        data: billsTrends?.map(item => item.totalBills) || [],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        yAxisID: 'y1',
      }
    ]
  };
  

  const paymentPieChartData = {
  labels: historicalPayments?.trends?.map(item => item.month) || [],
  datasets: [
    {
      label: 'Payment Amount (MWK)',
      data: historicalPayments?.trends?.map(item => item.billing.totalAmount) || [0, 0, 0],
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(153, 102, 255, 0.6)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 1
    }
  ]
};

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Total Customers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Customers</p>
              <h2 className="text-3xl font-bold text-gray-800">
                {data.customers.total}
              </h2>
              <p className="text-green-500 text-sm mt-1">
                {data.customers.active} active
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 2: Current Month Bills */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Bills ({data.currentMonth.month})</p>
              <h2 className="text-3xl font-bold text-gray-800">
                {data.currentMonth.bills.count}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Total: {new Intl.NumberFormat('en-MW', { 
                  style: 'currency', 
                  currency: 'MWK',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(data.currentMonth.bills.totalAmount)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 3: Current Month Payments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Payments ({data.currentMonth.month})</p>
              <h2 className="text-3xl font-bold text-gray-800">
                {data.currentMonth.payments.count}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Total: {new Intl.NumberFormat('en-MW', { 
                  style: 'currency', 
                  currency: 'MWK',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(data.currentMonth.payments.totalAmount)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 w-full">
  <h2 className="text-xl font-semibold mb-4">Billing Trends (Last 3 Months)</h2>
  <div className="h-80 w-full">
    <Bar 
      data={barChartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Amount (MWK)'
            },
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              callback: function(value) {
                return `MK ${value.toLocaleString('en-MW')}`;
              }
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Number of Bills'
            },
            beginAtZero: true,
            grid: {
              drawOnChartArea: false,
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  if (context.datasetIndex === 0) {
                    label += `MK ${context.parsed.y.toLocaleString('en-MW')}`;
                  } else {
                    label += context.parsed.y;
                  }
                }
                return label;
              }
            }
          }
        },
        barPercentage: 0.4,
        categoryPercentage: 0.8
      }}
    />
  </div>
</div>

<div className="bg-white rounded-lg shadow-md p-6 w-full">
  <h2 className="text-xl font-semibold mb-4">Monthly Payment Amounts (Last 3 Months)</h2>
  <div className="h-80 w-full">
    {historicalPayments ? (
      <Pie 
        data={paymentPieChartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right' },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return [
                    `${context.label}`,
                    `Amount: MK ${context.raw.toLocaleString('en-MW')}`,
                    `${Math.round(context.percent)}% of total`
                  ];
                }
              }
            }
          }
        }}
      />
    ) : (
      <div className="flex items-center justify-center h-full">
        <p>Loading payment data...</p>
      </div>
    )}
  </div>
  </div>
</div>


    </div>
  );
}

export default Home;