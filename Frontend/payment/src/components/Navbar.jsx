import { BsFillBellFill } from "react-icons/bs";
import UserImage from "../assets/UserImage.jpg";
const Navbar = () => {


    return(

     <div className="flex items-center justify-between h-[70px] shadow-lg px-[25px] py-[20px] bg-white fixed top-0 left-0 w-full z-40">

        <div>

        </div>

     

     <div className="flex items-center ">

       


        <div className="flex items-center px-[20px]">
            
            <div >
            <img 
            src={UserImage} 
            alt="Logo" 
            className="w-10 h-10 rounded-full object-cover"
            />

            </div>
        </div>

        </div>

</div>
    )

}

export default Navbar;