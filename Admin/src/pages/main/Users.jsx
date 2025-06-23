import React, { useState, useEffect } from 'react'
import NavigationBar from '../../components/NavigationBar'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import API from '../../utils/API'
import {toast, Bounce} from 'react-toastify'
import Swal from 'sweetalert2'

const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const fetchUsersData = async () => {
    try {
      const response = await API.get('/users/get-users');
      setUsersData(response.data.data);
    } catch (error) {
      console.log(error.response.data.message || error);
    }
  }

  useEffect(() => {
    fetchUsersData();
  }, []);

  const handleCreateUser = async (e) => {
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
      const userData = {
        email,
        password,
        organization
      }

      const response = await API.post("/users/register", userData);

      setOrganization('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      fetchUsersData();
      
      toast.success('User registered successfully', {
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
      toast.error(error.response.data.message || 'User not registered!', {
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

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = API.delete(`/users/delete-user/${id}`);
          setUsersData(usersData.filter(data => data.id !== id));
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.message || 'Unable to delete user!', {
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
        Swal.fire({
          title: "Deleted!",
          text: "User has been deleted.",
          icon: "success"
        });
      }
    });
  }

  return (
    <div className='flex flex-col w-full h-full'>
      <NavigationBar heading='Add Users' />
      <div className='grow p-2 grid grid-cols-3 gap-8'>
        <form className='col-span-1 border border-gray-300 rounded-md flex flex-col justify-center items-center gap-5' onSubmit={handleCreateUser}>
          <h2 className='text-xl font-semibold'>Create New User</h2>
          <div className='flex flex-col'>
            <label htmlFor="organization" className='text-sm'>Organization</label>
            <input type="text" name='organization' id='organization' placeholder="Enter user organization" className='px-4 py-2 border border-gray-500 rounded-lg' value={organization} onChange={(e) => setOrganization(e.target.value)}/>
          </div>
          <div className='flex flex-col'>
            <label htmlFor="email" className='text-sm'>Email</label>
            <input type="email" name='email' id='email' placeholder="Enter user email" className='px-4 py-2 border border-gray-500 rounded-lg' value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>
          <div className='flex flex-col'>
            <label htmlFor="password" className='text-sm'>Password</label>
            <input type="password" name='password' id='password' placeholder="Create user password" className='px-4 py-2 border border-gray-500 rounded-lg' value={password} onChange={(e) => setPassword(e.target.value)} required/>
          </div>
          <div className='flex flex-col'>
            <label htmlFor="confirmPassword" className='text-sm'>Confirm Password</label>
            <input type="password" name='confirmPassword' id='confirmPassword' placeholder="Confirm Password" className='px-4 py-2 border border-gray-500 rounded-lg' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
          </div>
          <button className='text-white bg-blue-500 hover:bg-blue-600'>Create User</button>
        </form>

        <div className='col-span-2 overflow-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-[#f5f3ff] border-b border-[#434343]'>
                <th className='table-heading'>Organization</th>
                <th className='table-heading'>Email</th>
                <th className='table-heading'>Created_at</th>
                <th className='table-heading'>Edit</th>
                <th className='table-heading'>Delete</th>
              </tr>
            </thead>
            <tbody>
              {usersData.length > 0 && 
                usersData.map((data) => (
                  <tr key={data.id} className='hover:bg-[#f8f7ff] border-b border-[#848484]'>
                    <td className='table-data'>{data.organization}</td>
                    <td className='table-data'>{data.email}</td>
                    <td className='table-data'>{data.created_At.split("T")[0]} {data.created_At.split("T")[1].split(".")[0]}</td>
                    <td className='table-data'><EditIcon className='text-blue-500 hover:text-blue-700 cursor-pointer'/></td>
                    <td className='table-data'><DeleteIcon className='text-red-500 hover:text-red-700 cursor-pointer' onClick={() => handleDelete(data.id)}/></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Users