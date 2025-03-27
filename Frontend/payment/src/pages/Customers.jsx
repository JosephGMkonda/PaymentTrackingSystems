import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  BsFillPersonPlusFill, BsClipboard2Check, 
  BsFillPencilFill, BsFillTrashFill,  
  BsChevronDoubleRight, BsChevronDoubleLeft,
  BsSearch 
} from "react-icons/bs";
import { fetchCustomers, deleteCustomer } from '../features/Customers/CustomersSlice';
import CustomerModal from '../components/CustomerModal';
import DeleteConfirmation from '../components/DeleteConfirmation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Customers() {
  const dispatch = useDispatch();
  const { data: customers, loading, error, operationLoading } = useSelector((state) => state.customers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const filteredCustomers = customers?.filter(customer => 
    customer?.fullName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
    customer?.phoneNumber?.includes(searchTerm)
  ) || [];
  
  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    dispatch(deleteCustomer(customerToDelete.uuid));
    setIsDeleteModalOpen(false);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) {
    toast.error(`Error: ${error.message || 'Failed to load customers'}`);
    return <div className="text-center py-8 text-red-500">Error loading data</div>;
  }

  return (
    <div className="container py-[20px] px-[30px]">
      <ToastContainer position="top-center" autoClose={3000} />
      
      <div className="flex items-center justify-between mb-4">
        <div className="bg-[#26344B]">
          <button 
            onClick={() => {
              setSelectedCustomer(null);
              setIsModalOpen(true);
            }}
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
            placeholder="Search by name or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 pr-2 mb-4 border rounded-md"
          />
          <BsSearch className='absolute left-3 top-2.5 text-gray-500 pointer-events-none'/>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-[#4A4360] text-white">
              <th className="py-2 px-4 text-left">Fullname</th>
              <th className="py-2 px-4 text-left">PhoneNumber</th>
              <th className="py-2 px-4 text-left">Balance</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.uuid} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{customer.fullName}</td>
                <td className="py-2 px-4">{customer.phoneNumber}</td>
                <td className="py-2 px-4">{customer.accountBalance}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    customer.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {customer.status}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(customer)}
                      className="px-2 text-blue-500 hover:text-blue-700"
                      disabled={operationLoading}
                    >
                      <BsFillPencilFill/>
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(customer)}
                      className="px-2 text-red-500 hover:text-red-700"
                      disabled={operationLoading}
                    >
                      <BsFillTrashFill/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2">
          <BsChevronDoubleLeft/>
        </button>
        <span className="px-4 py-2">1 of 1</span>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-4">
          <BsChevronDoubleRight/>
        </button>
      </div>

      <CustomerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        customerToEdit={selectedCustomer}
      />

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        loading={operationLoading}
      />
    </div>
  );
}

export default Customers;