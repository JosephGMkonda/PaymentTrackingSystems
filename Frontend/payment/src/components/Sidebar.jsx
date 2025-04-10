import {Link} from 'react-router-dom'

import { BsGrid3X3GapFill,BsPeopleFill,BsReception4,BsBank2 } from "react-icons/bs";
import { FaMoneyBills } from "react-icons/fa6";


const Sidebar = () => {

   return(
    <div className="bg-[#404258] h-full w-[18%] fixed top-0 left-0 z-50">

        <div className=" px-[20px] py-[10px] items-center justify-center border-b-[1px] ">
            
            <div className="bg-gray-500">
            <h1 className='text-2xl font-bold ml-2'>
                        <span className="text-[#26344B]">Payment</span>
                        <span className="text-[rgb(255,201,71)]">Tracker</span>
            </h1>
         </div>

       
        
        </div>

        <Link to="/" className="flex items-center gap-[15px] py-[20px] px-[20px] cursor-pointer text-white">
        <BsGrid3X3GapFill />
        <span className="font-bold"> Home </span>
        
        </Link>


        <Link to="/customers" className="flex items-center gap-[15px] py-[20px] px-[20px] cursor-pointer text-white">
        <BsPeopleFill />
        <span className="font-bold"> Customers </span>
        
        </Link>
        <Link to="/bills" className="flex items-center gap-[15px] py-[20px] px-[20px] cursor-pointer text-white">
        <BsBank2 />
        <span className="font-bold"> Bills </span>
        
        </Link>

        <Link to="/payments" className="flex items-center gap-[15px] py-[20px] px-[20px] cursor-pointer text-white">
        <FaMoneyBills />
        <span className="font-bold">Payments </span>
        
        </Link>
{/* 
        <Link to={`/reports/${year}/${month}`} className="flex items-center gap-[15px] py-[20px] px-[20px] cursor-pointer text-white">
  <BsReception4 />
  <span className="font-bold"> Reports </span>
</Link> */}






    </div>
   )


}

export default Sidebar;