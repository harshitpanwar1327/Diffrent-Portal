import { React, useState } from 'react'
import './navigationBar.css'
import {NavLink, useNavigate} from 'react-router-dom'
import Swal from 'sweetalert2'
import MenuIcon from '@mui/icons-material/Menu'

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  let navigate = useNavigate();

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
    <>
      <MenuIcon className={`hamburger ${isOpen? 'show': 'hide'}`} onClick={() => setIsOpen(!isOpen)}/>

      <div className={`navbar ${isOpen? 'show': 'hide'}`}>
        <h2 className='portal-heading'>DIFꟻRENT</h2>
        <ul className= 'nav-list'>
          <NavLink to={'/dashboard'} className='nav-item'><li><i className="fa-solid fa-house"></i> Data Security Posture</li></NavLink>
          <NavLink to={'/policy-dbs'}  className='nav-item'><li><i className="fa-solid fa-shield-halved"></i> Device Security</li></NavLink>
          <NavLink to={'/config-pm'}  className='nav-item'><li><i className="fa-solid fa-shield"></i> Screen Security</li></NavLink>
          <NavLink to={'/devices'}  className='nav-item'><li><i className="fa-solid fa-laptop"></i> Devices</li></NavLink>
          <NavLink to={'/health-status'} className='nav-item'><li><i className="fa-solid fa-notes-medical"></i> Health Report</li></NavLink>
          <NavLink to={'/license-management'} className='nav-item'><li><i className="fa-solid fa-receipt"></i> License Management</li></NavLink>
          <NavLink to={'/support'} className='nav-item'><li><i className="fa-solid fa-headset"></i> Support</li></NavLink>
        </ul>
        <div className="sidebar-footer">
          <p onClick={handleLogout} className="logout-button"><i className="fa-solid fa-right-from-bracket"></i>Logout</p>
        </div>
      </div>
    </>
  )
}

export default NavigationBar