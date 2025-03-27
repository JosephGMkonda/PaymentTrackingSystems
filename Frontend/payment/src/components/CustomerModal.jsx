import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCustomer, updateCustomer } from '../features/Customers/CustomersSlice'

const CustomerModal = ({ isOpen, onClose, customerToEdit }) => {
  const dispatch = useDispatch();
  const { operationLoading } = useSelector((state) => state.customers);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    accountBalance: '',
    status: 'active'
  });

  useEffect(() => {
    if (customerToEdit) {
      setFormData({
        fullName: customerToEdit.fullName,
        phoneNumber: customerToEdit.phoneNumber,
        accountBalance: customerToEdit.accountBalance,
        status: customerToEdit.status
      });
    } else {
      setFormData({
        fullName: '',
        phoneNumber: '',
        accountBalance: '',
        status: 'active'
      });
    }
  }, [customerToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (customerToEdit) {
        await dispatch(updateCustomer({ 
          id: customerToEdit.uuid, 
          customerData: formData 
        })).unwrap();
      } else {
        await dispatch(addCustomer(formData)).unwrap();
      }
      
      onClose();
      
      dispatch(fetchCustomers());
    } catch (error) {
      
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-500 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {customerToEdit ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Account Balance</label>
            <input
              type="number"
              name="accountBalance"
              value={formData.accountBalance}
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
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
              disabled={operationLoading}
            >
              {operationLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {customerToEdit ? 'Updating...' : 'Adding...'}
                </span>
              ) : (
                customerToEdit ? 'Update' : 'Add'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;