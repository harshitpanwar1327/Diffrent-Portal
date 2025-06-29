import React, { useState } from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import Swal from 'sweetalert2'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import {motion} from 'motion/react'

const NavigationBar = ({heading}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to logout?",
      text: "You will need to log in again to access your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!"
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        navigate("/login");
        Swal.fire({
          title: "Logged out!",
          text: "You have been successfully logged out.",
          icon: "success"
        });
      }
    });
  }

  return (
    <div className='flex justify-between w-full py-3 px-4 bg-black'>
      <h2 className='text-white text-2xl font-semibold'>{heading}</h2>
      <div className='text-white md:hidden' onClick={()=>setIsOpen(!isOpen)}>
        {isOpen ? 
          <CloseIcon /> : <MenuIcon />
        }
      </div>
      {isOpen && 
        <motion.div className='flex md:hidden flex-col bg-black w-full absolute top-12 left-0'
          initial={{opacity: 0, y: -100}}
          animate={{opacity: 1, y: 0}}
          transition={{type: 'spring', stiffness: 100, damping: 15, delay: 0.2}}
        >
          <NavLink to='/users' className="!text-white p-4 border-b border-white">Users</NavLink>
          <NavLink to='/generate' className="!text-white p-4 border-b border-white">Generate</NavLink>
          <NavLink to='/licenses' className="!text-white p-4 border-b border-white">Licenses</NavLink>
          <NavLink to='/feedbacks' className="!text-white p-4 border-b border-white">Feedbacks</NavLink>
          <p className='text-white flex items-center gap-2 font-semibold p-4' onClick={handleLogout}>Logout <LogoutIcon sx={{fontSize: '20px'}}/></p>
        </motion.div>
      }
      <div className='hidden md:flex items-center gap-10'>
        <NavLink to='/users' className="!text-white transition duration-300 ease-in-out transform hover:scale-110">Users</NavLink>
        <NavLink to='/generate' className="!text-white transition duration-300 ease-in-out transform hover:scale-110">Generate</NavLink>
        <NavLink to='/licenses' className="!text-white transition duration-300 ease-in-out transform hover:scale-110">Licenses</NavLink>
        <NavLink to='/feedbacks' className="!text-white transition duration-300 ease-in-out transform hover:scale-110">Feedbacks</NavLink>
        <p className='text-white hover:text-red-500 flex items-center gap-2 font-semibold cursor-pointer transition duration-300 ease-in-out transform hover:scale-110' onClick={handleLogout}>Logout <LogoutIcon sx={{fontSize: '20px'}}/></p>
      </div>
    </div>
  )
}

export default NavigationBar