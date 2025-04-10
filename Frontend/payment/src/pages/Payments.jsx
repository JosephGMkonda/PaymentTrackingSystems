import React, {useEffect, useState} from 'react'
import {Link} from "react-router-dom"
import { BsFillPersonPlusFill,BsClipboard2Check, BsX ,BsFillPencilFill, BsFillTrashFill,  BsChevronDoubleRight, BsChevronDoubleLeft} from "react-icons/bs";
import { BsSearch } from "react-icons/bs";
import { fetchPayments, getPaymentById } from '../features/Payments/PaymentSlice';
import { useDispatch, useSelector } from 'react-redux';
import PaymentsCard from '../components/PaymentsCard';


function Payments() {
  const dispatch = useDispatch();
  const {data: payments, loading, error} = useSelector((state) => state.payments);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchIterm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);


  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);


  useEffect(() => {
    dispatch(fetchPayments());
  },[dispatch]);

  const filteredPayments = payments?.filter(payment => 
    payment?.Customer?.fullName?.toLowerCase().includes(searchIterm.toLowerCase())
  );

const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentPaymenents = filteredPayments.slice(startIndex, endIndex);

   
   const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
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
         <div className="flex items-center justify-between mb-4">
           
   
         <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by name"
            value={searchIterm}
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
                   <th className="py-2 px-4 text-left">FullName</th>
                   <th className="py-2 px-4 text-left">Amount</th>
                   <th className="py-2 px-4 text-left">Payment Date</th>
                   <th className="py-2 px-4 text-left">Reference Number</th>
                   <th className="py-2 px-4 text-left">Action</th>
                 </tr>
               </thead>
               <tbody>
            {currentPaymenents?.length > 0 ? (
              currentPaymenents.map((payment) => (
                <tr key={payment.uuid} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{payment.Customer?.fullName || 'N/A'}</td>
                  
                  <td className="py-2 px-4">K {payment.amount || '0.00'}</td>
                  <td className="py-2 px-4">{formatDate(payment.paymentDate)}</td>
                  <td className="py-2 px-4">{payment.referenceNumber || 'N/A'}</td>
                  
                  <td className="py-2 px-4">
                    <button 
                     onClick={() => handleViewPayment(payment)}
                    className="px-2
                     text-blue-500
                      hover:text-blue-700">
                      <BsClipboard2Check/>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  {searchIterm ? 'No matching payments found' : 'No payments available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>

 
           </div>
         
   
         
         <div className="flex justify-center mt-4">
           <button
             
             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
             className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
             disabled={currentPage === 1}
           >
             <BsChevronDoubleLeft/>
           </button>
           <span className="px-4 py-2">{currentPage} of {Math.ceil(filteredPayments.length / itemsPerPage)}</span>
           <button
           onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredPayments.length / itemsPerPage)))}
           className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-4"
           disabled={currentPage === Math.ceil(filteredPayments.length / itemsPerPage)}
             
             
           >
             < BsChevronDoubleRight/>
           </button>
         </div>


         {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <BsX className="text-gray-600 text-xl" />
            </button>
            
          
            {selectedPayment && (
              <PaymentsCard payment={selectedPayment} />
            )}
          </div>
        </div>
      )}
   
         </div>


      

  )
}

export default Payments