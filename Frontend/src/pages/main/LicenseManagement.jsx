import React, { useEffect, useState } from 'react'
import './licenseManagement.css'
import API from '../../util/Api'
import {toast, Bounce} from 'react-toastify'
import {getCurrentDate} from '../../util/DateUtil'
import {decodeLicenseCodeWithToken} from '../../util/DecodeLicense'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
// import HashLoader from "react-spinners/HashLoader"

const LicenseManagement = () => {
  let [licenseNo, setLicenseNo] = useState('');
  let [licenseData, setLicenseData] = useState([]);
  let [currentPage, setCurrentPage] = useState(1);
  let itemsPerPage = 10;
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    let getLicenseData = async () => {
      try {
        let getData = await API.get('/license/get-license/');
        let licenseKey = getData.data.data;
        let decodedData = licenseKey.map(decodeLicenseCodeWithToken);
        setLicenseData(decodedData);
      } catch (error) {
        console.log(error);
      }
    }

    getLicenseData();
  }, []);

  let paginatedData = licenseData.slice(
    (currentPage - 1) * itemsPerPage, currentPage * itemsPerPage
  );

  const handleAdd = async () => {
    let addLicense = {
      licenseKey: licenseNo
    }

    try {
      // setLoading(true);
      let response = await API.post('/license/validate/', addLicense);

      let license = {
        licenseKey: addLicense.licenseKey
      }
      
      let saveResponse = await API.post('/license/active-license/', license);

      setLicenseData([...licenseData, decodeLicenseCodeWithToken(license)]);
      setLicenseNo('');

      toast.success('License Added Successfully!', {
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
      toast.error('Something went Wrong! Please try again...', {
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
      // setLoading(false);
    }
  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  }

  return (
    <div className='mainPages'>
      {/* {loading && <div className="loader">
        <HashLoader color="#6F5FE7"/>
      </div>} */}
      <div className='licence-header'>
        <input type="text" placeholder='Enter your licence key' className='addLicenceInput' value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)}/>
        <button className='add-licence-button' onClick={handleAdd}>Activate License</button>
      </div>

      <div className="groupTableContainer">
        <table className='groupTable'>
          <thead>
            <tr>
              <th className='groupTable-heading'>Organisation Name</th>
              <th className='groupTable-heading'>Total Devices</th>
              <th className='groupTable-heading'>Purchase Date</th>
              <th className='groupTable-heading'>Expiry Date</th>
              <th className='groupTable-heading'>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((data, index) => (
                  <tr key={index}>
                    <td className='groupTable-data'>{data.organization}</td>
                    <td className='groupTable-data'>{data.totalDevices}</td>
                    <td className='groupTable-data'>{data.purchaseDate.split('T')[0]}</td>
                    <td className='groupTable-data'>{data.expiryDate.split('T')[0]}</td>
                    <td className={`groupTable-data ${new Date(data.expiryDate) > new Date(getCurrentDate()) ? 'active' : 'expired'}`}>
                      <li>{new Date(data.expiryDate) > new Date(getCurrentDate()) ? 'Active' : 'Expired'}</li>
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
          <Pagination count={Math.ceil(licenseData.length / itemsPerPage)} page={currentPage} onChange={handlePageChange} color="primary" />
        </Stack>
      </div>
    </div>
  )
}

export default LicenseManagement