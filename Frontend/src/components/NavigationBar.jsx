import { React } from 'react'
import './navigationBar.css'
import {NavLink, useNavigate} from 'react-router-dom'

const NavigationBar = () => {
  let navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  }

  return (
    <div className='navigationSideBar'>
      <h2 className='portal-heading'>DIFꟻERENT</h2>
      <ul className= 'navigationList'>
        <NavLink to={'/dashboard'} className='navigationItem'><li><i className="fa-solid fa-house"></i> Data Security Posture</li></NavLink>
        <NavLink to={'/policy-dbs'}  className='navigationItem'><li><i className="fa-solid fa-shield-halved"></i> Device Security</li></NavLink>
        <NavLink to={'/config-pm'}  className='navigationItem'><li><i className="fa-solid fa-shield"></i> Screen Security</li></NavLink>
        <NavLink to={'/devices'}  className='navigationItem'><li><i className="fa-solid fa-laptop"></i> Devices</li></NavLink>
        <NavLink to={'/health-status'} className='navigationItem'><li><i className="fa-solid fa-notes-medical"></i> Health Report</li></NavLink>
        <NavLink to={'/license-management'} className='navigationItem'><li><i className="fa-solid fa-receipt"></i> License Management</li></NavLink>
        <NavLink to={'/support'} className='navigationItem'><li><i className="fa-solid fa-headset"></i> Support</li></NavLink>
      </ul>
      <div className="sidebar-footer">
        <p onClick={handleLogout} className="logoutButton"><i className="fa-solid fa-right-from-bracket"></i>Logout</p>
      </div>
    </div>
  )
}

export default NavigationBar