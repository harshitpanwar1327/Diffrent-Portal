import React, { useState, useEffect } from 'react'
import './healthStatus.css'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import API from '../../util/Api'
import Swal from 'sweetalert2'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import HashLoader from "react-spinners/HashLoader"

const HealthStatus = () => {
  let [groupData, setGroupData] = useState([]);
  let [groupID, setGroupID] = useState('');
  let [healthy, setHealthy] = useState([]);
  let [unknown, setUnknown] = useState([]);
  let [retired, setRetired] = useState([]);
  let [currentTab, setCurrentTab] = useState(0);
  let [currentPage, setCurrentPage] = useState(1);
  let itemsPerPage = 10;
  let [loading, setLoading] = useState(false);
  let userId = sessionStorage.getItem('userId');

  const fetchGroupName = async () => {
    try {
      let response = await API.get(`/group/all-group/${userId}`);
      setGroupData(response.data.data);
    } catch (error) {
      console.log(error.response.data.message || error);
    }
  }

  const fetchAllDevices = async () => {
    try {
      let response = await API.get("/health/devices");
      setHealthy(response.data.data.healthy);
      setUnknown(response.data.data.unknown);
      setRetired(response.data.data.retired);
    } catch (error) {
      console.log(error.response.data.message || error);
    }
  }

  useEffect(() => {
    const fetchHealthData = async () => {
      let loaderTimeout;

      try {
        loaderTimeout = setTimeout(() => setLoading(true), 1000);
        await fetchGroupName();
        await fetchAllDevices();
      } catch (error) {
        console.log(error);
      } finally {
        clearTimeout(loaderTimeout);
        setLoading(false);
      }
    }

    fetchHealthData();
  }, []);

  const handleGroupChange = async (e) => {
    setGroupID(e.target.value);

    let loaderTimeout;
    
    try {
      loaderTimeout = setTimeout(() => setLoading(true), 1000);
      let response = await API.get(`/devices/get-devices/${e.target.value}`);
      let healthData = response.data.data;
      
      setCurrentPage(1);

      const now = new Date();
      
      setHealthy(
        healthData.filter((data) => {
          if (!data.lastActive) return false;
          const lastActive = new Date(data.lastActive);
          const hoursDiff = (now - lastActive) / (1000 * 60 * 60);
          return hoursDiff <= 72;
        })
      );
  
      setUnknown(
        healthData.filter((data) => {
          if (!data.lastActive) return false;
          const lastActive = new Date(data.lastActive);
          const hoursDiff = (now - lastActive) / (1000 * 60 * 60);
          return hoursDiff > 72 && hoursDiff <= 720;
        })
      );
  
      setRetired(
        healthData.filter((data) => {
          if (!data.lastActive) return false;
          const lastActive = new Date(data.lastActive);
          const hoursDiff = (now - lastActive) / (1000 * 60 * 60);
          return hoursDiff > 720;
        })
      );
    } catch(error) {
      console.log(error);
      toast.error(error.response.data.message || 'Group not selected!');
    } finally {
      clearTimeout(loaderTimeout);
      setLoading(false);
    }
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

  const getPaginatedData = (data) => {
    return data.slice(
      (currentPage - 1) * itemsPerPage, currentPage * itemsPerPage
    );
  }

  let tabData = [healthy, unknown, retired];
  let currentPageData = tabData[currentTab];
  let pageCount = Math.ceil(currentPageData.length / itemsPerPage);
  
  return (
    <div className='main-page'>
      {loading && <div className="loader">
        <HashLoader color="#6F5FE7"/>
      </div>}
      <div className="main-page-header">
        <select name="group" id="group" className='select-dropdown' value={groupID} onChange={handleGroupChange} required>
          <option value="">Select Group</option>
          {groupData?.map((data, index) => (
            <option key={index} value={data.groupID}>{data.groupName}</option>
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
                  {getPaginatedData(healthy).length > 0 ? (
                    getPaginatedData(healthy).map((data, index) => (
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
                  {getPaginatedData(unknown).length > 0 ? (
                    getPaginatedData(unknown).map((data, index) => (
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
                  {getPaginatedData(retired).length > 0 ? (
                    getPaginatedData(retired).map((data, index) => (
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