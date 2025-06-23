import React from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import Swal from 'sweetalert2'
import LogoutIcon from '@mui/icons-material/Logout'

const NavigationBar = ({heading}) => {
  const navigate = useNavigate();
  
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
      <div className='flex items-center gap-10'>
        <NavLink to='/users' className="!text-white transition duration-300 ease-in-out transform hover:scale-110">Users</NavLink>
        <NavLink to='/license' className="!text-white transition duration-300 ease-in-out transform hover:scale-110">License</NavLink>
        <NavLink to='/feedbacks' className="!text-white transition duration-300 ease-in-out transform hover:scale-110">Feedbacks</NavLink>
        <p className='text-white hover:text-red-500 flex items-center gap-2 font-semibold cursor-pointer transition duration-300 ease-in-out transform hover:scale-110' onClick={handleLogout}>Logout <LogoutIcon sx={{fontSize: '20px'}}/></p>
      </div>
    </div>
  )
}

export default NavigationBar