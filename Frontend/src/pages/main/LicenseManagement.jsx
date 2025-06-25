import React, { useEffect, useState } from 'react'
import './licenseManagement.css'
import API from '../../util/Api'
import {toast, Bounce} from 'react-toastify'
import {getCurrentDate} from '../../util/DateUtil'
import {decodeLicenseCodeWithToken} from '../../util/DecodeLicense'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import HashLoader from "react-spinners/HashLoader"

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
      let response = await API.get(`/license/get-license?page=${currentPage}&limit=${itemsPerPage}&userId=${userId}`);
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

      toast.success('License Added Successfully', {
        position: "top-center",
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce
      });
    } catch (error) {
      toast.error(error.response.data.message || 'License not activated!', {
        position: "top-center",
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce
      });
    } finally {
      clearTimeout(loaderTimeout);
      setLoading(false);
    }
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
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan={5} className='empty-data-table'>No license found.</td>
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