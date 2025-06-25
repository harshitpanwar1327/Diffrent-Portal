import React, { useEffect, useState } from 'react'
import NavigationBar from '../../components/NavigationBar'
import API from '../../utils/API'
import {FadeLoader} from 'react-spinners'
import Swal from 'sweetalert2'
import {toast, Bounce} from 'react-toastify'
import DeleteIcon from '@mui/icons-material/Delete'

const Licenses = () => {
  const [licenseData, setLicenseData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLicenses = async () => {
    let loaderTimeout;

    try {
      loaderTimeout = setTimeout(() => setLoading(true), 1000);
      const response = await API.get(`/license/get-licenses`);
      setLicenseData(response.data.data);
    } catch (error) {
      console.log(error.response.data.message || error);
    } finally {
      clearTimeout(loaderTimeout);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLicenses();
  }, []);

  const handleDelete = async (id) => {
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
        let loaderTimeout;
        try {
          loaderTimeout = setTimeout(() => setLoading(true), 1000);
          let response = await API.delete(`/license/delete-license/${id}`);
          setLicenseData(licenseData.filter(prev => prev.licenseId !== id));
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.message || 'License not deleted!', {
            position: "top-center",
            autoClose: 1800,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        } finally {
          clearTimeout(loaderTimeout);
          setLoading(false);
        }
        Swal.fire({
          title: "Deleted!",
          text: "Your license has been deleted.",
          icon: "success"
        });
      }
    });
  }

  return (
    <div className='flex flex-col w-full h-full'>
      {loading && (
        <div className="overlay">
          <FadeLoader color='rgba(255, 32, 86)'/>
        </div>
      )}
      <NavigationBar heading='Licenses' />
      <div className='grow p-2 overflow-auto'>
        <table className='w-full'>
          <thead>
            <tr className='bg-[#f5f3ff] border-b border-[#434343]'>
              <th className='table-heading'>User ID</th>
              <th className='table-heading'>License Key</th>
              <th className='table-heading'>Delete</th>
            </tr>
          </thead>
          <tbody>
            {licenseData.length > 0 ?
              licenseData.map((data) => (
                <tr className='hover:bg-[#f8f7ff] border-b border-[#848484]' key={data.licenseId}>
                  <td className='p-2'>{data.userId}</td>
                  <td className='p-2'>{data.licenseKey}</td>
                  <td className='p-2'><DeleteIcon className='text-red-500 hover:text-red-700 cursor-pointer' onClick={() => handleDelete(data.licenseId)}/></td>
                </tr>
              )) : (
                <tr className='bg-[#f8f7ff] border-b border-[#848484]'>
                  <td className='p-2' colSpan={3}>No data available</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Licenses