import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import {toast, Bounce} from 'react-toastify'
import API from '../utils/API'

const EditUser = ({setOpenModal, data, fetchUsersData}) => {
  const id = data.id;
  const [organization, setOrganization] = useState(data.organization);
  const [email, setEmail] = useState(data.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();

    if(password !== confirmPassword) {
      toast.error('Password and confirm password not matched!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    try {
      const updatedData = {
        organization,
        email,
        password
      }

      const response = await API.put(`/users/update-user/${id}`, updatedData);
      fetchUsersData();

      setOpenModal(false);

      toast.success('User updated successfully', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || 'User not updated!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  }
  
  return (
    <div className='fixed top-0 left-0 z-100 flex justify-center items-center bg-[#0000003a] w-screen h-screen' onClick={() => setOpenModal(false)}>
      <form className='bg-white p-4 flex flex-col gap-5' onClick={(e) => e.stopPropagation()} onSubmit={handleUpdate}>
        <CloseIcon className='cursor-pointer hover:text-red-500' onClick={() => setOpenModal(false)}/>
        <h2 className='text-2xl font-semibold text-center'>Edit Profile</h2>
        <div className='flex flex-col'>
          <label htmlFor="organization" className='text-sm'>Organization</label>
          <input type="text" name='organization' id='organization' placeholder='Organization Name' value={organization} onChange={(e)=>setOrganization(e.target.value)} className='border border-gray-300 rounded-md p-2'/>
        </div>
        <div className='flex flex-col'>
          <label htmlFor="email" className='text-sm'>Email</label>
          <input type="email" name='email' id='email' placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} className='border border-gray-300 rounded-md p-2' required/>
        </div>
        <div className='flex flex-col'>
          <label htmlFor="password" className='text-sm'>Password</label>
          <input type="password" name='password' id='password' placeholder='New Password' value={password} onChange={(e)=>setPassword(e.target.value)} className='border border-gray-300 rounded-md p-2' required/>
        </div>
        <div className='flex flex-col'>
          <label htmlFor="confirmPassword" className='text-sm'>Confirm Password</label>
          <input type="password" name='confirmPassword' id='confirmPassword' placeholder='Confirm New Password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className='border border-gray-300 rounded-md p-2' required/>
        </div>
        <button className='bg-blue-500 hover:bg-blue-600 text-white'>Update</button>
      </form>
    </div>
  )
}

export default EditUser