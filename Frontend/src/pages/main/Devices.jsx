import React, {useState, useEffect} from 'react'
import './devices.css'
import API from '../../util/Api'
import {decodeLicenseCodeWithToken} from '../../util/DecodeLicense'
import Swal from 'sweetalert2'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import {toast, Bounce} from 'react-toastify'
import HashLoader from "react-spinners/HashLoader"

const Devices = () => {
  const label = { inputProps: { 'aria-label': 'Switch demo' } };
  let [search, setSearch] = useState('');
  let [devicesData, setDevicesData] = useState([]);
  let [license, setLicense] = useState([]);
  let [currentPage, setCurrentPage] = useState(1);
  let itemsPerPage = 10;
  let [totalData, setTotalPages] = useState(1);
  let [loading, setLoading] = useState(false);

  const getDevices = async (currentPage, itemsPerPage, search) => {
    try {
      let response = await API.get(`/devices/get-devices?page=${currentPage}&limit=${itemsPerPage}&search=${search}`);
      setDevicesData(response.data.data);
      setTotalPages(response.data.total);
    } catch (error) {
      console.log(error.response.data.message || error);
    }
  }

  const getLicense = async () => {
    try {
      let response = await API.get("/license/get-license/");
      setLicense(response.data.data);
    } catch (error) {
      console.log(error.response.data.message || error);
    }
  }

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        setLoading(true);
        await getDevices(currentPage, itemsPerPage, search);
        await getLicense();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    setCurrentPage(1);
    fetchDeviceData();
  }, [search]);

  useEffect(() => {
    getDevices(currentPage, itemsPerPage, search);
  }, [currentPage, search])

  const deviceCount = (licenseKey) => {
    let licenseData = license.find(data => data.licenseKey === licenseKey);
    if(!licenseData) return 0;
    let decodeKey = decodeLicenseCodeWithToken({licenseKey: licenseData.licenseKey});
    return decodeKey.totalDevices;
  }

  const handleLicenseAllocation = async (licenseKey, macAddress) => {
    if(!licenseKey) {
      let response = API.put(`/devices/deallocate-license/${macAddress}`);

      setDevicesData(prev => prev.map((device) => (
        device.macAddress === macAddress ? (
          {...device, licenseKey: licenseKey}
        ) : (
          device
        )
      )))

      toast.success('License deallocated successfully.', {
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

      return;
    }

    let updateLicenseData = {
      licenseKey: licenseKey,
      macAddress: macAddress,
      deviceCount: deviceCount(licenseKey)
    }

    try {
      setLoading(true);
      let response = await API.put('/devices/update-license/', updateLicenseData);

      setDevicesData(prev => prev.map((device) => (
        device.macAddress === macAddress ? (
          {...device, licenseKey: licenseKey}
        ) : (
          device
        )
      )))

      toast.success('License Allocated Successfully!', {
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
      console.log(error);
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
      setLoading(false);
    }
  }

  const handleDeleteDevice = async (macAddress) => {
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
          setLoading(true);
          let response = await API.delete(`/devices/delete-device/${macAddress}`);
          setDevicesData(devicesData.filter(prev => prev.macAddress!==macAddress));
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.message || 'Device not deleted!', {
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
          setLoading(false);
        }
        Swal.fire({
          title: "Deleted!",
          text: "Your device has been deleted.",
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
      <div className='main-page-header'>
        <input type="text" name='search' id='search' placeholder='&#128269; Search here' className='search-input' value={search} onChange={(e)=>setSearch(e.target.value)}/>
      </div>
      <div className="group-table-container">
        <table className='group-table'>
          <thead>
            <tr>
              <th className='group-table-heading'>Device Name</th>
              <th className='group-table-heading'>MAC Address</th>
              <th className='group-table-heading'>IP Address</th>
              <th className='group-table-heading'>Allocate License</th>
              <th className='group-table-heading'>Delete</th>
            </tr>
          </thead>
          <tbody>
            {devicesData.length > 0 ? (
              devicesData.map((data, index) => (
                <tr key={index}>
                  <td className='group-table-data'>{data.deviceName}</td>
                  <td className='group-table-data'>{data.macAddress}</td>
                  <td className='group-table-data'>{data.ipAddress}</td>
                  <td className='group-table-data'>
                    <select name="license" id="license" className='license-select' value={data.licenseKey || ""} onChange={(e) => handleLicenseAllocation(e.target.value, data.macAddress)}>
                      <option value="">Select License</option>
                      {license.map((data) => (
                        <option key={data.licenseKey} value={data.licenseKey}>{data.licenseKey}</option>
                      ))}
                    </select>
                  </td>
                  <td className='group-table-data'><i className="fa-solid fa-trash" onClick={() => handleDeleteDevice(data.macAddress)}></i></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className='empty-data-table'>No devices found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="pagination">
        <Stack spacing={2}>
          <Pagination count={Math.ceil(totalData / itemsPerPage)} page={currentPage} onChange={handlePageChange} color="primary" />
        </Stack>
      </div>
    </div>
  )
}

export default Devices