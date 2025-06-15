import React, {useEffect, useState} from 'react'
import './managePolicy.css'
import EditPolicy from '../../../modals/EditPolicy'
import {useParams} from 'react-router-dom'
import API from '../../../util/Api'
// import HashLoader from "react-spinners/HashLoader"

const policyFields = [
  { key: 'usb', label: 'USB Storage Access' },
  { key: 'mtp', label: 'Media Transfer Protocol (MTP)' },
  { key: 'printing', label: 'Printer Access' },
  { key: 'browserUpload', label: 'File Upload via Browser' },
  { key: 'bluetooth', label: 'Bluetooth Connectivity' },
];

const ManagePolicy = () => {
  let [openModal, setOpenModal] = useState(false);
  let {groupID} = useParams();
  let [policy, setPolicy] = useState([]);
  // const [loading, setLoading] = useState(false);

  const fetchPolicyDetails = async () => {
    try {
      let response = await API.get(`/policy/fetch-policy/${groupID}`);
      setPolicy(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    try {
      fetchPolicyDetails();
    } catch (error) {
      console.log(error);
    }
  }, [groupID]);

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
      <div className='policy-header'>
        <h4 className='groupID-heading'>MANAGE CONFIG- GroupID: {groupID}</h4>
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