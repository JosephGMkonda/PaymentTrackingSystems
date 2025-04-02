import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBill } from '../features/Bill/BillSlice';
import axios from 'axios';

const BillModal = ({ isOpen, onClose, billToEdit }) => {
  const dispatch = useDispatch();
  const operationLoading = useSelector((state) => state.bills?.operationLoading) || false;
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    amount: '',
    billingMonth: '',
    dueDate: '',
    status: 'unpaid'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search customers by name
  const searchCustomers = async () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/customers/search?name=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Set customer when selected from search results
  const selectCustomer = (customer) => {
    setFormData({
      ...formData,
      customerId: customer.uuid,
      customerName: `${customer.fullName} (${customer.phoneNumber})`
    });
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FORM SUBMISSION TRIGGERED");
    try {
      console.log("SUBMITTING BILLS", formData);
      await dispatch(addBill({
        customerId: formData.customerId,
        amount: parseFloat(formData.amount),
        billingMonth: formData.billingMonth,
        dueDate: formData.dueDate,
        status: formData.status
      })).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to add bill:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Monthly Bill</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Customer Search Section */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Search Customer</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by customer name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && searchCustomers()}
                className="w-full p-2 pl-10 pr-2 border rounded"
              />
              <button 
                type="button"
                onClick={searchCustomers}
                className="absolute left-3 top-2.5 text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            
            {/* Search Results */}
            {isSearching && (
              <div className="mt-2 text-center text-gray-500">Searching...</div>
            )}
            {searchResults.length > 0 && (
              <div className="mt-2 border rounded max-h-40 overflow-y-auto">
                {searchResults.map(customer => (
                  <div 
                    key={customer.uuid}
                    onClick={() => selectCustomer(customer)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {customer.fullName} - {customer.phoneNumber}
                  </div>
                ))}
              </div>
            )}
            
            {/* Selected Customer */}
            {formData.customerName && (
              <div className="mt-2 p-2 bg-blue-50 rounded">
                <p className="font-medium">Selected Customer:</p>
                <p>{formData.customerName}</p>
              </div>
            )}
          </div>

          {/* Bill Details */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Billing Month</label>
            <input
              type="month"
              name="billingMonth"
              value={formData.billingMonth}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
              disabled={operationLoading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={operationLoading || !formData.customerId}

            
            >
              {operationLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : 'Create Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillModal;