import React, { useEffect, useState } from 'react'
import './policyDbs.css'
import CreateGroup from '../../modals/CreateGroup'
import EditGroup from '../../modals/EditGroup'
import ManageDevices from '../../modals/ManageDevices'
import {NavLink} from 'react-router-dom'
import API from '../../util/Api'
import Swal from 'sweetalert2'
// import HashLoader from "react-spinners/HashLoader"

const PolicyDbs = () => {
  let [openGroupModal, setOpenGroupModal] = useState(false);
  let [openEditGroupModal, setOpenEditGroupModal] = useState(false);
  const [openDevicesModal, setOpenDevicesModal] = useState(false);
  let [search, setSearch] = useState('');
  let [groupData, setGroupData] = useState([]);
  let [selectedGroupID, setSelectedGroupID] = useState('');
  // const [loading, setLoading] = useState(false);

  let filteredData = groupData.filter(data => data.groupName.toLowerCase().includes(search.toLowerCase()) || data.groupID.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    let fetchGroupDetails = async () => {
      try {
        let fetchData = await API.get(`/policy/fetch-group/`);
        setGroupData(fetchData.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchGroupDetails();
  }, []);

  const handleManageDevice = (groupID) => {
    setOpenDevicesModal(true);
    setSelectedGroupID(groupID);
  }

  const handleEditGroup = (groupID) => {
    setOpenEditGroupModal(true);
    setSelectedGroupID(groupID);
  }

  const handleDeleteGroup = async (groupID) => {
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
          // setLoading(true);
          let response = await API.delete(`/policy/delete-group/${groupID}`);
          setGroupData(groupData.filter((prev) => prev.groupID !== groupID));
        } catch (error) {
          console.log(error);
        } finally {
          // setLoading(false);
        }
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  }

  return (
    <div className='mainPages'>
      {/* {loading && <div className="loader">
        <HashLoader color="#6F5FE7"/>
      </div>} */}
      <div className='mainPages-header'>
        <input type="text" name='search' id='search' placeholder='&#128269; Search here' className='searchInput' value={search} onChange={(e)=>setSearch(e.target.value)}/>
        <button onClick={() => setOpenGroupModal(true)} className='createGroup-button'>+ Create Group</button>
        {openGroupModal && <CreateGroup setOpenModal={setOpenGroupModal} setGroupData={setGroupData}/>}
      </div>
      <div className="groupTableContainer">
        <table className='groupTable'>
          <thead>
            <tr>
              <th className='groupTable-heading'>Group ID</th>
              <th className='groupTable-heading'>Group Name</th>
              <th className='groupTable-heading'>Devices</th>
              <th className='groupTable-heading'>Policy</th>
              <th className='groupTable-heading'>Edit</th>
              <th className='groupTable-heading'>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((data, index) => (
                <tr key={index}>
                  <td className='groupTable-data'>{data.groupID}</td>
                  <td className='groupTable-data'>{data.groupName}</td>
                  <td className='groupTable-data'>
                    <button className="tableButton deviceBtn" onClick={() => handleManageDevice(data.groupID)}>Manage Devices</button>
                  </td>
                  <td className='groupTable-data'>
                    <NavLink to={`/add-policy/${data.groupID}`}><button className='tableButton policyBtn'>Manage Policy</button></NavLink>
                  </td>
                  <td className='groupTable-data'><i className="fa-solid fa-pen-to-square" onClick={()=>handleEditGroup(data.groupID)}></i></td>
                  <td className='groupTable-data'><i className="fa-solid fa-trash" onClick={()=>handleDeleteGroup(data.groupID)}></i></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className='empty-data-table'>No groups found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {openEditGroupModal && <EditGroup setOpenModal={setOpenEditGroupModal} groupID={selectedGroupID} setGroupData={setGroupData}/>}
      {openDevicesModal && <ManageDevices setOpenModal={setOpenDevicesModal} groupID={selectedGroupID}/>}
    </div>
  )
}

export default PolicyDbs