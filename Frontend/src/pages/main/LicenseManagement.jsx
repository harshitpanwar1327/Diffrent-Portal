import React, { useEffect, useState } from 'react'
import './licenseManagement.css'
import API from '../../util/Api'
import {toast} from 'react-toastify'
import {getCurrentDate} from '../../util/DateUtil'
import {decodeLicenseCodeWithToken} from '../../util/DecodeLicense'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import HashLoader from "react-spinners/HashLoader"
import Swal from 'sweetalert2'

const LicenseManagement = () => {
  let [licenseKey, setLicenseKey] = useState('');
  let [licenseData, setLicenseData] = useState([]);
  let [currentPage, setCurrentPage] = useState(1);
  let itemsPerPage = 10;
  let [totalData, setTotalPages] = useState(1);
  let userId = sessionStorage.getItem('userId');
  let [loading, setLoading] = useState(false);

  let getLicenseData = async (currentPage, itemsPerPage) => {
    let loaderTimeout;
    
    try {
      loaderTimeout = setTimeout(() => setLoading(true), 1000);
      let response = await API.get(`/license/get-licenses?page=${currentPage}&limit=${itemsPerPage}&userId=${userId}`);
      setTotalPages(response.data.total);
      let licenseKey = response.data.data;
      let decodedData = licenseKey.map(decodeLicenseCodeWithToken);
      setLicenseData(decodedData);
    } catch (error) {
      console.log(error.response.data.message || error);
    } finally {
      clearTimeout(loaderTimeout);
      setLoading(false);
    }
  }

  useEffect(() => {
    try {
      getLicenseData(currentPage, itemsPerPage);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleActivate = async () => {
    let loaderTimeout;

    try {
      loaderTimeout = setTimeout(() => setLoading(true), 1000);

      let response = await API.post('/license/validate/', {
        licenseKey
      });

      let license = {
        userId,
        licenseKey
      }
      
      let saveResponse = await API.post('/license/activate-license/', license);

      setLicenseData([...licenseData, decodeLicenseCodeWithToken(license)]);
      setLicenseKey('');

      toast.success('License Added Successfully');
    } catch (error) {
      toast.error(error.response.data.message || 'License not activated!');
    } finally {
      clearTimeout(loaderTimeout);
      setLoading(false);
    }
  }

  const handleDeleteLicense = async (id) => {
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
          toast.error(error.response.data.message || 'License not deleted!');
        } finally {
          clearTimeout(loaderTimeout);
          setLoading(false);
        }
        Swal.fire({
          title: "Deleted!",
          text: "License has been deleted.",
          icon: "success"
        });
      }
    });
  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  }

  return (
    <div className='main-page'>
      {loading && <div className="loader">
        <HashLoader color="#6F5FE7"/>
      </div>}
      <div className='licence-header'>
        <input type="text" placeholder='Enter your licence key' className='add-licence-input' value={licenseKey} onChange={(e) => setLicenseKey(e.target.value)}/>
        <button className='create-group-button' onClick={handleActivate}>Activate License</button>
      </div>

      <div className="group-table-container">
        <table className='group-table'>
          <thead>
            <tr>
              <th className='group-table-heading'>Organisation Name</th>
              <th className='group-table-heading'>Total Devices</th>
              <th className='group-table-heading'>Purchase Date</th>
              <th className='group-table-heading'>Expiry Date</th>
              <th className='group-table-heading'>Status</th>
              <th className='group-table-heading'>Delete</th>
            </tr>
          </thead>
          <tbody>
            {licenseData.length > 0 ? (
              licenseData.map((data, index) => (
                  <tr key={index}>
                    <td className='group-table-data'>{data.organization}</td>
                    <td className='group-table-data'>{data.totalDevices}</td>
                    <td className='group-table-data'>{data.purchaseDate.split('T')[0]}</td>
                    <td className='group-table-data'>{data.expiryDate.split('T')[0]}</td>
                    <td className={`group-table-data ${new Date(data.expiryDate) > new Date(getCurrentDate()) ? 'active' : 'expired'}`}>
                      {new Date(data.expiryDate) > new Date(getCurrentDate()) ? 'Active' : 'Expired'}
                    </td>
                    <td className='group-table-data'><i className="fa-solid fa-trash" onClick={() => handleDeleteLicense(data.licenseId)}></i></td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan={6} className='empty-data-table'>No license found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <Stack spacing={2}>
          <Pagination count={Math.ceil(totalData/itemsPerPage)} page={currentPage} onChange={handlePageChange} color="primary" />
        </Stack>
      </div>
    </div>
  )
}

export default LicenseManagement