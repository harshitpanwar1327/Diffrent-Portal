import React, { useEffect, useState } from 'react'
import NavigationBar from '../../components/NavigationBar'
import API from '../../utils/API'
import {FadeLoader} from 'react-spinners'
import Swal from 'sweetalert2'
import {toast} from 'react-toastify'
import DeleteIcon from '@mui/icons-material/Delete'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import {decodeLicenseCodeWithToken} from '../../utils/DecodeLicense'

const Licenses = () => {
  const [search, setSearch] = useState('');
  const [licenseData, setLicenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalData, setTotalData] = useState(1);

  const filteredData = licenseData.filter(data => data.organization?.toLowerCase().includes(search.toLowerCase()) || data.totalDevices?.includes(search) || data.purchaseDate?.includes(search) || data.expiryDate?.includes(search));

  const fetchLicenses = async () => {
    let loaderTimeout;

    try {
      loaderTimeout = setTimeout(() => setLoading(true), 1000);
      const response = await API.get(`/license/get-licenses?page=${currentPage}&limit=${itemsPerPage}`);
      const licenseKey = response.data.data;
      const decode = licenseKey.map(decodeLicenseCodeWithToken);
      setLicenseData(decode);
      setTotalData(response.data.total);
    } catch (error) {
      console.log(error.response.data.message || error);
    } finally {
      clearTimeout(loaderTimeout);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLicenses();
  }, [currentPage]);

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
          fetchLicenses();
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.message || 'License not deleted!');
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

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
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
        <input type="text" name='search' id='search' placeholder='&#128269; Search here...' value={search} onChange={(e) => {setSearch(e.target.value); setCurrentPage(1)}} className='p-2 border border-gray-300 rounded-full mb-2'/>
        <table className='w-full'>
          <thead>
            <tr className='bg-[#f5f3ff] border-b border-[#434343]'>
              <th className='table-heading'>Organization</th>
              <th className='table-heading'>Total Devices</th>
              <th className='table-heading'>Purchase Date</th>
              <th className='table-heading'>Expiry Date</th>
              <th className='table-heading'>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ?
              filteredData.map((data) => (
                <tr className='hover:bg-[#f8f7ff] border-b border-[#848484]' key={data.licenseId}>
                  <td className='p-2'>{data.organization}</td>
                  <td className='p-2'>{data.totalDevices}</td>
                  <td className='p-2'>{data.purchaseDate}</td>
                  <td className='p-2'>{data.expiryDate}</td>
                  <td className='p-2'><DeleteIcon className='text-red-500 hover:text-red-700 cursor-pointer' onClick={() => handleDelete(data.licenseId)}/></td>
                </tr>
              )) : (
                <tr className='bg-[#f8f7ff] border-b border-[#848484]'>
                  <td className='p-2 text-center' colSpan={5}>No data available</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
      <Stack spacing={2} className='my-2'>
        <Pagination count={Math.ceil(totalData/itemsPerPage)} page={currentPage} onChange={handlePageChange} color="primary"/>
      </Stack>
    </div>
  )
}

export default Licenses