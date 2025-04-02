import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsFillPersonPlusFill, BsClipboard2Check, BsFillPencilFill, BsFillTrashFill, BsChevronDoubleRight, BsChevronDoubleLeft, BsSearch } from "react-icons/bs";
import { fetchBills, deleteBill, setCurrentBill, openModal, closeModal, fetchCustomers } from '../features/Bill/BillSlice'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Bills() {
  const dispatch = useDispatch();
  const { 
    bills, 
    customers,
    status, 
    error, 
    isModalOpen, 
    modalType, 
    currentBill,
    customerStatus
  } = useSelector(state => state.bills);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    dispatch(fetchBills());
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleAdd = () => {
    dispatch(openModal('add'));
  };

  const handleEdit = (bill) => {
    dispatch(setCurrentBill(bill));
    setSelectedCustomer(bill.Customer);
    dispatch(openModal('edit'));
  };

  const handleDelete = (id) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteBill(showDeleteConfirm)).unwrap();
      toast.success('Bill deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete bill: ' + error.message);
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const filteredBills = bills.filter(bill => {
    if (!bill.Customer) return false;
    return (
      bill.Customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.amount.toString().includes(searchTerm)
    );
  });

  return (
    <div className="container py-[20px] px-[30px]">
      {/* Search and Add Button */}
      <div className="flex items-center justify-between mb-4">
        <div className="bg-[#26344B]">
          <button 
            onClick={handleAdd}
            className="flex justify-center items-center py-[10px] h-[30px] rounded-[10px] px-[10px] bg-[#26344B] text-white"
          >
            <div className="flex items-center space-x-2 text-white">
              <BsFillPersonPlusFill />
              <span>Add</span>
            </div>
          </button>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by customer name, amount or status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 pr-2 mb-4 border rounded-md"
          />
          <BsSearch className='absolute left-3 top-2.5 text-gray-500 pointer-events-none'/>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        {status === 'loading' ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4">{error}</div>
        ) : (
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-[#4A4360] text-white">
                <th className="py-2 px-4 text-left">Customer Name</th>
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-left">Billing Month</th>
                <th className="py-2 px-4 text-left">Due Date</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => (
                <tr key={bill.uuid} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{bill.Customer?.fullName || 'N/A'}</td>
                  <td className="py-2 px-4">{bill.amount}</td>
                  <td className="py-2 px-4">{new Date(bill.billingMonth).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{new Date(bill.dueDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      bill.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <button 
                      onClick={() => handleEdit(bill)}
                      className="px-2 text-blue-500 hover:text-blue-700"
                    >
                      <BsFillPencilFill/>
                    </button>
                    <button 
                      onClick={() => handleDelete(bill.uuid)}
                      className="px-2 text-red-500 hover:text-red-700"
                    >
                      <BsFillTrashFill/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2">
          <BsChevronDoubleLeft/>
        </button>
        <span className="px-4 py-2">1 of 1</span>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-4">
          <BsChevronDoubleRight/>
        </button>
      </div>

      {/* Bill Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {modalType === 'add' ? 'Add New Bill' : 'Edit Bill'}
            </h2>
            <BillForm 
              currentBill={currentBill} 
              modalType={modalType} 
              customers={customers}
              customerStatus={customerStatus}
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
              onClose={() => {
                dispatch(closeModal());
                setSelectedCustomer(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this bill?</p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// BillForm Component
function BillForm({ 
  currentBill, 
  modalType, 
  customers, 
  customerStatus,
  selectedCustomer,
  setSelectedCustomer,
  onClose 
}) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    amount: currentBill?.amount || '',
    billingMonth: currentBill?.billingMonth ? 
      new Date(currentBill.billingMonth).toISOString().split('T')[0] : '',
    dueDate: currentBill?.dueDate ? 
      new Date(currentBill.dueDate).toISOString().split('T')[0] : '',
    status: currentBill?.status || 'pending',
    customerId: currentBill?.customerId || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setFormData(prev => ({ ...prev, customerId: customer.uuid }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerId) {
      toast.error('Please select a customer');
      return;
    }

    setIsSubmitting(true);
    try {
      const billData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (modalType === 'add') {
        await dispatch(addBill(billData)).unwrap();
        toast.success('Bill added successfully!');
      } else {
        await dispatch(updateBill({ 
          id: currentBill.uuid, 
          billData: billData 
        })).unwrap();
        toast.success('Bill updated successfully!');
      }
      onClose();
    } catch (error) {
      toast.error('Operation failed: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Customer Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Customer</label>
          {customerStatus === 'loading' ? (
            <div className="p-2 border rounded-md bg-gray-100">Loading customers...</div>
          ) : (
            <>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full p-2 border rounded-md"
                  value={selectedCustomer?.fullName || ''}
                  readOnly
                />
              </div>
              <div className="mt-2 max-h-40 overflow-y-auto border rounded-md">
                {customers.map(customer => (
                  <div 
                    key={customer.uuid}
                    onClick={() => handleCustomerSelect(customer)}
                    className={`p-2 hover:bg-blue-50 cursor-pointer ${
                      selectedCustomer?.uuid === customer.uuid ? 'bg-blue-100' : ''
                    }`}
                  >
                    {customer.fullName} ({customer.phoneNumber})
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
            step="0.01"
            min="0"
          />
        </div>

        {/* Billing Month */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Billing Month</label>
          <input
            type="date"
            name="billingMonth"
            value={formData.billingMonth}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {modalType === 'add' ? 'Adding...' : 'Updating...'}
            </span>
          ) : (
            modalType === 'add' ? 'Add Bill' : 'Update Bill'
          )}
        </button>
      </div>
    </form>
  );
}

export default Bills;