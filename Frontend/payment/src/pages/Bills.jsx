import React from 'react'
import {Link} from "react-router-dom"
import { BsFillPersonPlusFill,BsClipboard2Check, BsFillPencilFill, BsFillTrashFill,  BsChevronDoubleRight, BsChevronDoubleLeft} from "react-icons/bs";
import { BsSearch } from "react-icons/bs";

function Bills() {
  return (
      
       <div className="container py-[20px] px-[30px]">
             <div className="flex items-center justify-between mb-4">
               <div className="bg-[#26344B]">
                 <button className="flex justify-center items-center py-[10px] h-[30px] rounded-[10px] px-[10px] bg-[#26344B] text-white">
                   <Link to="/form" className="flex items-center space-x-2 text-white">
                     <BsFillPersonPlusFill />
                     <span>Add</span>
                   </Link>
                 </button>
               </div>
       
                     <div className="relative mb-4">
                                     <input
                                         type="text"
                                         placeholder="Search by name"
                                         
                                         
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
                       <th className="py-2 px-4 text-left">Action</th>
                     </tr>
                   </thead>
                   <tbody>
                     
                         <tr className="border-b" >
                           <td className="py-2 px-4">Joseph</td>
                           <td className="py-2 px-4">Mkonda</td>
                           <td className="py-2 px-4">
                             
                           </td>
                           <td className="py-2 px-4">Male</td>
                           <td className="py-2 px-4">
                             <button 
                             className="px-2 text-blue-500">
                               <BsClipboard2Check/>
                               </button>
                             <button className="px-2 text-blue-500"><BsFillPencilFill/></button>
                             <button className="px-2 text-blue-500"><BsFillTrashFill/></button>
                           </td>
                         </tr>
               
                   </tbody>
                 </table>
               </div>
             
       
             
             <div className="flex justify-center mt-4">
               <button
                 
                 className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
               >
                 <BsChevronDoubleLeft/>
               </button>
               <span className="px-4 py-2">1 of 1</span>
               <button
                 
                 
                 className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-4"
               >
                 < BsChevronDoubleRight/>
               </button>
             </div>
       
             </div>

  )
}

export default Bills