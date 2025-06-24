import React, { useEffect, useState } from 'react'
import './manageDevices.css'
import API from '../util/Api'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import HashLoader from "react-spinners/HashLoader"
import {toast, Bounce} from 'react-toastify'

const ManageDevices = ({setOpenModal, groupId, groupName}) => {
  let [search, setSearch] = useState('');
  let [devicesData, setDevicesData] = useState([]);
  let [currentPage, setCurrentPage] = useState(1);
  let itemsPerPage = 10;
  let [totalData, setTotalData] = useState(1);
  let [loading, setLoading] = useState(false);

  const fetchDevices = async () => {
    let loaderTimeout;

    try {
      loaderTimeout = setTimeout(() => setLoading(true), 1000);

      let response = await API.post(`/devices/manage-group/`, {
        page: currentPage,
        limit: itemsPerPage,
        search,
        groupId
      });
      setDevicesData(response.data.data);
      setTotalData(response.data.total);
    } catch (error) {
      console.log(error.response.data.message || error);
    } finally {
      clearTimeout(loaderTimeout);
      setLoading(false);
    }
  }

  useEffect(()=>{
    try {
      fetchDevices(currentPage, itemsPerPage, search, groupId);
    } catch (error) {
      console.log(error);
    }
  }, [currentPage, itemsPerPage, search, groupId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    fetchDevices(currentPage, itemsPerPage, search);
  }, [currentPage, search])

  const handleGroupAllocation = async (data) => {
    let loaderTimeout;

    try {
      loaderTimeout = setTimeout(() => setLoading(true), 1000);

      let groupInfo = {
        macAddress: data.macAddress,
        groupId: data.groupId ? null : groupId,
        groupName: data.groupName ? null : groupName
      }
      
      let response = await API.put(`/devices/update-group/`, groupInfo);

      fetchDevices();

      toast.success('Device status updated', {
        position: "top-center",
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || 'Group not allocated!', {
        position: "top-center",
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
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
    <div className='overlay' onClick={() => setOpenModal(false)}>
      {loading && <div className="loader">
        <HashLoader color="#6F5FE7"/>
      </div>}
      <div className="manage-devices-popup" onClick={(e) => e.stopPropagation()}>
        <i className="fa-solid fa-xmark" onClick={()=>setOpenModal(false)}></i>
        <div className='main-page-header'>
          <h4 className='groupId-heading'>MANAGE DEVICE- GroupID: {groupId}</h4>
          <input type="text" name='search' id='search' placeholder='&#128269; Search here' className='search-input' value={search} onChange={(e)=>setSearch(e.target.value)}/>
        </div>
        <div className="manage-devices-table">
          <table className='group-table'>
            <thead>
              <tr>
                <th className='group-table-heading'>Device Name</th>
                <th className='group-table-heading'>MAC Address</th>
                <th className='group-table-heading'>IP Address</th>
                <th className='group-table-heading'>Allocate</th>
              </tr>
            </thead>
            <tbody>
              {devicesData.length > 0 ? (
                devicesData.map((data, index)=>(
                  <tr key={index}>
                    <td className='group-table-data'>{data.deviceName}</td>
                    <td className='group-table-data'>{data.macAddress}</td>
                    <td className='group-table-data'>{data.ipAddress}</td>
                    <td className='group-table-data'><input type="checkbox" name="groupDevice" id="groupDevice" checked={data.groupId ? true: false} onChange={() => handleGroupAllocation(data)}/></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className='empty-data-table'>No devices available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Stack spacing={2}>
          <Pagination count={Math.ceil(totalData/itemsPerPage)} page={currentPage} onChange={handlePageChange} color="primary" />
        </Stack>
      </div>
    </div>
  )
}

export default ManageDevices