import React, { useEffect, useRef, useState } from 'react'
import './deviceScreenSecurity.css'
import CreateGroup from '../../modals/CreateGroup'
import EditGroup from '../../modals/EditGroup'
import ManageDevices from '../../modals/ManageDevices'
import { NavLink } from 'react-router-dom'
import Swal from 'sweetalert2'
import API from '../../util/Api'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import {toast, Bounce} from 'react-toastify'
import HashLoader from "react-spinners/HashLoader"

const DeviceScreenSecurity = () => {
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [openEditGroupModal, setOpenEditGroupModal] = useState(false);
  const [openDevicesModal, setOpenDevicesModal] = useState(false);
  const [search, setSearch] = useState('');
  const [groupData, setGroupData] = useState([]);
  const [selectedGroupID, setSelectedGroupID] = useState('');
  const [selectedGroupName, setSelectedGroupName] = useState('');
  let [currentPage, setCurrentPage] = useState(1);
  let itemsPerPage = 10;
  let [totalData, setTotalPages] = useState(1);
  let [loading, setLoading] = useState(false);
  let loaderTimeout = useRef(null);

  const getGroupData = async (currentPage, itemsPerPage, search) => {
    try {
      loaderTimeout.current = setTimeout(() => setLoading(true), 1000);
      const response = await API.get(`/policy/get-group?page=${currentPage}&limit=${itemsPerPage}&search=${search}`);
      setGroupData(response.data.data);
      setTotalPages(response.data.total);
    } catch (error) {
      console.log(error.response.data.message || error);
    } finally {
      clearTimeout(loaderTimeout.current);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    setCurrentPage(1);
    
    try {
      getGroupData(currentPage, itemsPerPage, search);
    } catch (error) {
      console.log(error);
    }
  }, [search]);

  useEffect(() => {
    getGroupData(currentPage, itemsPerPage, search);
  }, [currentPage, search])

  const handleManageDevice = (data) => {
    setOpenDevicesModal(true);
    setSelectedGroupID(data.groupId);
    setSelectedGroupName(data.groupName);
  }

  const handleEditGroup = (groupId) => {
    setOpenEditGroupModal(true);
    setSelectedGroupID(groupId);
  }

  const handleDeleteGroup = (groupId) => {
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
          loaderTimeout.current = setTimeout(() => setLoading(true), 1000);
          let response = await API.delete(`/policy/delete-group/${groupId}`);
          setGroupData(groupData.filter((prev) => prev.groupId !== groupId));
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.message || 'Group not deleted!', {
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
          clearTimeout(loaderTimeout.current);
          setLoading(false);
        }
        Swal.fire({
          title: "Deleted!",
          text: "Your group has been deleted.",
          icon: "success"
        });
      }
    });
  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    getGroupData(value, itemsPerPage, search);
  }

  return (
    <div className="main-page">
      {loading && <div className="loader">
        <HashLoader color="#6F5FE7"/>
      </div>}
      <div className="main-page-header">
        <input type="text" name="search" id="search" placeholder="&#128269; Search here" className="search-input" value={search} onChange={(e) => setSearch(e.target.value)}/>
        <button onClick={() => setOpenGroupModal(true)} className="create-group-button">+ Create Group</button>
        {openGroupModal && <CreateGroup setOpenModal={setOpenGroupModal} setGroupData={setGroupData} getGroupData={getGroupData}/>}
      </div>

      <div className="group-table-container">
        <table className="group-table">
          <thead>
            <tr>
              <th className="group-table-heading">Group ID</th>
              <th className="group-table-heading">Group Name</th>
              <th className="group-table-heading">Devices</th>
              <th className='group-table-heading'>Policy</th>
              <th className="group-table-heading">Config</th>
              <th className="group-table-heading">Edit</th>
              <th className="group-table-heading">Delete</th>
            </tr>
          </thead>
          <tbody>
            {groupData.length > 0 ? (
              groupData.map((data, index) => (
                <tr key={index}>
                  <td className="group-table-data">{data.groupId}</td>
                  <td className="group-table-data">{data.groupName}</td>
                  <td className="group-table-data">
                    <button className="table-button device-btn" onClick={() => handleManageDevice(data)}>Manage Devices</button>
                  </td>
                  <td className='group-table-data'>
                    <NavLink to={`/manage-policy/${data.groupId}`}><button className='table-button policy-btn'>Manage Policy</button></NavLink>
                  </td>
                  <td className="group-table-data">
                    <NavLink to={`/manage-config/${data.groupId}`}>
                      <button className="table-button policy-btn">Manage Config</button>
                    </NavLink>
                  </td>
                  <td className="group-table-data"><i className="fa-solid fa-pen-to-square" onClick={()=>handleEditGroup(data.groupId)}></i></td>
                  <td className="group-table-data"><i className="fa-solid fa-trash" onClick={()=>handleDeleteGroup(data.groupId)}></i></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className='empty-data-table'>No groups found.</td>
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
      {openEditGroupModal && <EditGroup setOpenModal={setOpenEditGroupModal} groupId={selectedGroupID} setGroupData={setGroupData}/>}
      {openDevicesModal && <ManageDevices setOpenModal={setOpenDevicesModal} groupId={selectedGroupID} groupName={selectedGroupName}/>}
    </div>
  );
};

export default DeviceScreenSecurity;