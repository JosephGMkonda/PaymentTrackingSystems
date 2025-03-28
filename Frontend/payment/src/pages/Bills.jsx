import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  BsFillPersonPlusFill, BsClipboard2Check, 
  BsFillPencilFill, BsFillTrashFill,  
  BsChevronDoubleRight, BsChevronDoubleLeft,
  BsSearch 
} from "react-icons/bs";
import { fetchBills, deleteBill } from '../features/bills/billsSlice';
import BillModal from '../components/BillModal';
import DeleteConfirmation from '../components/DeleteConfirmation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Bills() {
  const dispatch = useDispatch();
  const { data: bills, loading, error, operationLoading } = useSelector((state) => state.bills);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [billToDelete, setBillToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchBills());
  }, [dispatch]);

  const filteredBills = bills?.filter(bill => 
    bill?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
    bill?.patientId?.includes(searchTerm)
  ) || [];

  const handleEdit = (bill) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (bill) => {
    setBillToDelete(bill);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteBill(billToDelete.id)).unwrap();
      setIsDeleteModalOpen(false);
    } catch (error) {
      // Error handled by slice
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) {
    toast.error(`Error: ${error.message || 'Failed to load bills'}`);
    return <div className="text-center py-8 text-red-500">Error loading data</div>;
  }

  return (
    <div className="container py-[20px] px-[30px]">
      <ToastContainer position="top-center" autoClose={3000} />
      
      <div className="flex items-center justify-between mb-4">
        <div className="bg-[#26344B]">
          <button 
            onClick={() => {
              setSelectedBill(null);
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
            placeholder="Search by name or ID"
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
              <th className="py-2 px-4 text-left">Patient ID</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Age</th>
              <th className="py-2 px-4 text-left">Gender</th>
              <th className="py-2 px-4 text-left">Amount</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill) => (
              <tr key={bill.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{bill.patientId}</td>
                <td className="py-2 px-4">{bill.name}</td>
                <td className="py-2 px-4">{bill.age}</td>
                <td className="py-2 px-4">{bill.gender}</td>
                <td className="py-2 px-4">{bill.amount}</td>
                <td className="py-2 px-4">{new Date(bill.date).toLocaleDateString()}</td>
                <td className="py-2 px-4">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(bill)}
                      className="px-2 text-blue-500 hover:text-blue-700"
                      disabled={operationLoading}
                    >
                      <BsFillPencilFill/>
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(bill)}
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

      <BillModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        billToEdit={selectedBill}
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

export default Bills;