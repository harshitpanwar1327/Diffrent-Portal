import React, { useEffect, useState } from 'react'
import './manageDevices.css'
import API from '../util/Api'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'

const ManageDevices = ({setOpenModal, groupID}) => {
  let [search, setSearch] = useState('');
  let [devicesData, setDevicesData] = useState([]);
  let [currentPage, setCurrentPage] = useState(1);
  let itemsPerPage = 10;

  let filteredData = devicesData.filter(data => data?.deviceName?.toLowerCase().includes(search.toLowerCase()) || data?.macAddress?.toLowerCase().includes(search.toLowerCase()) || data?.ipAddress?.toLowerCase().includes(search.toLowerCase()));

  let paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage, currentPage * itemsPerPage
  )

  const fetchDevices = async () => {
    try {
      let response = await API.get(`/devices/manage-device-group/${groupID}`);
      setDevicesData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    fetchDevices();
  }, [groupID]);

  const handleGroupAllocation = async (data) => {
    let groupInfo = {
      macAddress: data.macAddress,
      groupID: data.groupID ? null : groupID
    }

    try {
      let response = await API.put(`/devices/update-group/`, groupInfo);
      fetchDevices();
    } catch (error) {
      console.log(error);
    }
  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  }

  return (
    <div className='overlay' onClick={() => setOpenModal(false)}>
      <div className="manageDevices-popup" onClick={(e) => e.stopPropagation()}>
        <i className="fa-solid fa-xmark" onClick={()=>setOpenModal(false)}></i>
        <div className='mainPages-header'>
          <h4 className='groupID-heading'>MANAGE DEVICE- GroupID: {groupID}</h4>
          <input type="text" name='search' id='search' placeholder='&#128269; Search here' className='searchInput' value={search} onChange={(e)=>setSearch(e.target.value)}/>
        </div>
        <div className="manage-devices-table">
          <table className='groupTable'>
            <thead>
              <tr>
                <th className='groupTable-heading'>Device Name</th>
                <th className='groupTable-heading'>MAC Address</th>
                <th className='groupTable-heading'>IP Address</th>
                <th className='groupTable-heading'>Allocate</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((data, index)=>(
                  <tr key={index}>
                    <td className='groupTable-data'>{data.deviceName}</td>
                    <td className='groupTable-data'>{data.macAddress}</td>
                    <td className='groupTable-data'>{data.ipAddress}</td>
                    <td className='groupTable-data'><input type="checkbox" name="groupDevice" id="groupDevice" checked={data.groupID ? true: false} onChange={() => handleGroupAllocation(data)}/></td>
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
          <Pagination count={Math.ceil(filteredData.length / itemsPerPage)} page={currentPage} onChange={handlePageChange} color="primary" />
        </Stack>
      </div>
    </div>
  )
}

export default ManageDevices