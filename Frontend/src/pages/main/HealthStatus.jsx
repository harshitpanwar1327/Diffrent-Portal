import React, { useState, useEffect } from 'react'
import './healthStatus.css'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import API from '../../util/Api'
import Swal from 'sweetalert2'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import HashLoader from "react-spinners/HashLoader"
import {toast} from 'react-toastify'

const HealthStatus = () => {
  let [groupData, setGroupData] = useState([]);
  let [groupId, setGroupId] = useState('');
  let [healthy, setHealthy] = useState([]);
  let [unknown, setUnknown] = useState([]);
  let [retired, setRetired] = useState([]);
  let [currentTab, setCurrentTab] = useState(0);
  let [currentPage, setCurrentPage] = useState(1);
  let itemsPerPage = 10;
  let [totalHealthy, setTotalHealthy] = useState(1);
  let [totalUnknown, setTotalUnknown] = useState(1);
  let [totalRetired, setTotalRetired] = useState(1);
  let [loading, setLoading] = useState(false);
  let userId = sessionStorage.getItem('userId');

  const fetchGroupName = async () => {
    try {
      let response = await API.get(`/group/all-group/${userId}`);
      setGroupData(response.data.data);
    } catch (error) {
      console.log(error.response?.data?.message || error);
    }
  }

  const fetchAllDevices = async () => {
    try {
      let response = await API.get(`/health/devices?page=${currentPage}&limit=${itemsPerPage}`);
      setHealthy(response.data.data.healthy || []);
      setUnknown(response.data.data.unknown || []);
      setRetired(response.data.data.retired || []);

      setTotalHealthy(response.data.total.totalHealthy);
      setTotalUnknown(response.data.total.totalUnknown);
      setTotalRetired(response.data.total.totalRetired);
    } catch (error) {
      console.log(error.response?.data?.message || error);
    }
  }

  const fetchGroupDevices = async () => {
    try {
      let response = await API.post(`/health/devices`, {
        page: currentPage,
        limit: itemsPerPage,
        id: groupId
      });
      
      setHealthy(response.data.data.healthy || []);
      setUnknown(response.data.data.unknown || []);
      setRetired(response.data.data.retired || []);

      setTotalHealthy(response.data.total.totalHealthy);
      setTotalUnknown(response.data.total.totalUnknown);
      setTotalRetired(response.data.total.totalRetired);
    } catch (error) {
      console.log(error.response?.data?.message || error);
    }
  }

  useEffect(() => {
    const fetchHealthData = async () => {
      let loaderTimeout;

      try {
        loaderTimeout = setTimeout(() => setLoading(true), 1000);
        await fetchGroupName();
        if(!groupId) {
          await fetchAllDevices();
        } else {
          await fetchGroupDevices();
        }
      } catch (error) {
        console.log(error);
      } finally {
        clearTimeout(loaderTimeout);
        setLoading(false);
      }
    }

    fetchHealthData();
  }, [currentPage, currentTab, groupId]);

  const handleGroupChange = async (e) => {
    setGroupId(e.target.value);
    setCurrentPage(1);
  }

  const handleDelete = (macAddress) => {
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
          let response = await API.delete(`/devices/delete-device/${macAddress}`);
          setRetired(retired.filter(prev => prev.macAddress!==macAddress));
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.message || 'Device not deleted!');
        } finally {
          clearTimeout(loaderTimeout);
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

  const handleTabChange = (index) => {
    setCurrentTab(index);
    setCurrentPage(1);
  }

  let totalItems = [totalHealthy, totalUnknown, totalRetired][currentTab];
  let pageCount = Math.ceil(totalItems / itemsPerPage);
  
  return (
    <div className='main-page'>
      {loading && <div className="loader">
        <HashLoader color="#6F5FE7"/>
      </div>}
      <div className="main-page-header">
        <select name="group" id="group" className='select-dropdown' value={groupId} onChange={handleGroupChange} required>
          <option value="">Select Group</option>
          {groupData?.map((data, index) => (
            <option key={index} value={data.groupId}>{data.groupName}</option>
          ))}
        </select>
      </div>

      <div className="health-status-table">
        <Tabs selectedIndex={currentTab} onSelect={handleTabChange}>
          <TabList>
            <Tab>Healthy</Tab>
            <Tab>Unknown</Tab>
            <Tab>Retired</Tab>
          </TabList>
          <TabPanel>
            <div className="group-table-health-container">
              <table className='group-table'>
                <thead>
                  <tr>
                    <th className='group-table-heading'>MAC Address</th>
                    <th className='group-table-heading'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {healthy.length > 0 ? (
                    healthy.map((data, index) => (
                      <tr key={index}>
                        <td className='group-table-data'>{data.macAddress}</td>
                        <td className='group-table-data'><i className="fa-solid fa-battery-full"></i></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className='empty-data-table'>No healthy device found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabPanel>
          <TabPanel>
          <div className="group-table-health-container">
              <table className='group-table'>
                <thead>
                  <tr>
                    <th className='group-table-heading'>MAC Address</th>
                    <th className='group-table-heading'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {unknown.length > 0 ? (
                    unknown.map((data, index) => (
                      <tr key={index}>
                        <td className='group-table-data'>{data.macAddress}</td>
                        <td className='group-table-data'><i className="fa-solid fa-battery-half"></i></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className='empty-data-table'>No unknown devices found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabPanel>
          <TabPanel>
          <div className="group-table-health-container">
              <table className='group-table'>
                <thead>
                  <tr>
                    <th className='group-table-heading'>MAC Address</th>
                    <th className='group-table-heading'>Status</th>
                    <th  className='group-table-heading'>De-allocate</th>
                  </tr>
                </thead>
                <tbody>
                  {retired.length > 0 ? (
                    retired.map((data, index) => (
                      <tr key={index}>
                        <td className='group-table-data'>{data.macAddress}</td>
                        <td className='group-table-data'><i className="fa-solid fa-battery-empty"></i></td>
                        <td className='group-table-data'><i className="fa-solid fa-trash" onClick={()=> handleDelete(data.macAddress)}></i></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className='empty-data-table'>No retired devices found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabPanel>
        </Tabs>
      </div>

      <div className="pagination">
        <Stack spacing={2}>
          <Pagination count={pageCount} page={currentPage} onChange={handlePageChange} color="primary" />
        </Stack>
      </div>
    </div>
  )
}

export default HealthStatus