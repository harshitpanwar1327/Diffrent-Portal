import React, {useEffect, useRef, useState} from 'react'
import './managePolicy.css'
import EditPolicy from '../../../modals/EditPolicy'
import {useParams} from 'react-router-dom'
import API from '../../../util/Api'
import HashLoader from "react-spinners/HashLoader"

const policyFields = [
  { key: 'usb', label: 'USB Storage Access' },
  { key: 'mtp', label: 'Media Transfer Protocol (MTP)' },
  { key: 'printing', label: 'Printer Access' },
  { key: 'browserUpload', label: 'File Upload via Browser' },
  { key: 'bluetooth', label: 'Bluetooth Connectivity' },
];

const ManagePolicy = () => {
  let [openModal, setOpenModal] = useState(false);
  let {groupId} = useParams();
  let [policy, setPolicy] = useState([]);
  let [loading, setLoading] = useState(false);
  let loaderTimeout = useRef(null);

  const fetchPolicyDetails = async () => {
    try {
      loaderTimeout.current = setTimeout(() => setLoading(true), 1000);
      let response = await API.get(`/policy/get-policy/${groupId}`);
      setPolicy(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      clearTimeout(loaderTimeout.current);
      setLoading(false);
    }
  }

  useEffect(() => {
    try {
      fetchPolicyDetails();
    } catch (error) {
      console.log(error);
    }
  }, [groupId]);

  let interpretPolicy = (value) => {
    if(value === true || value === 1) {
      return "Active";
    } else if (value === false || value === 0) {
      return "Inactive";
    } else {
      return "N/A"
    }
  }

  return (
    <div className='main-page'>
      {loading && <div className="loader">
        <HashLoader color="#6F5FE7"/>
      </div>}
      <div className='policy-header'>
        <h4 className='groupId-heading'>MANAGE CONFIG- GroupID: {groupId}</h4>
        <button onClick={() => setOpenModal(true)} className='create-group-button'>Edit Policy</button>
        {openModal && <EditPolicy setOpenModal={setOpenModal} setPolicy={setPolicy}/>}
      </div>

      <div className="group-table-container">
        <table className="group-table">
          <thead>
            <tr>
              <td colSpan={2} className="group-table-heading">Restricted System Features</td>
            </tr>
          </thead>
          <tbody>
            {policyFields.map(({key, label}, index) => (
              <tr key={index}>
                <td className="group-table-data">{label} :</td>
                <td className={`group-table-data ${policy[0]?.[key] ? 'active' : 'expired'}`}>{interpretPolicy(policy[0]?.[key])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManagePolicy