import React from 'react';
import { BsPerson, BsPhone, BsCalendar, BsCashCoin, BsReceipt, BsCheckCircle, BsClock } from 'react-icons/bs';

const PaymentsCard = ({ payment }) => {
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      
      <div className="bg-[#4A4360] p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Payment Details</h2>
            <p className="text-indigo-100">Reference: {payment.referenceNumber}</p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
            payment.MonthlyBill?.status === 'paid' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-amber-100 text-amber-800'
          }`}>
            {payment.MonthlyBill?.status?.toUpperCase() || 'UNKNOWN'}
          </div>
        </div>
      </div>

      
      <div className="p-6">
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <BsPerson className="mr-2 text-indigo-500" />
            Customer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{payment.Customer?.fullName || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium">{payment.Customer?.phoneNumber || 'N/A'}</p>
            </div>
          </div>
        </div>

        
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <BsCashCoin className="mr-2 text-indigo-500" />
            Payment Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-medium text-xl">MK {parseFloat(payment.amount).toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Payment Date</p>
              <p className="font-medium">{formatDate(payment.paymentDate)}</p>
            </div>
          </div>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <BsReceipt className="mr-2 text-indigo-500" />
            Billing Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Billing Month</p>
              <p className="font-medium">{formatDate(payment.MonthlyBill?.billingMonth)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Due Date</p>
              <p className="font-medium flex items-center">
                {formatDate(payment.MonthlyBill?.dueDate)}
                {payment.MonthlyBill?.status === 'paid' ? (
                  <BsCheckCircle className="ml-2 text-green-500" />
                ) : (
                  <BsClock className="ml-2 text-amber-500" />
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

    
      <div className="bg-gray-50 px-6 py-4 border-t">
        <div className="flex justify-between text-sm text-gray-500">
          <p>Payment ID: {payment.uuid}</p>
          <p>Created: {formatDate(payment.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentsCard;