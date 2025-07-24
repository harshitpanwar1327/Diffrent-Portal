import React, {useEffect, useState} from 'react'
import './managePolicy.css'
import EditPolicy from '../../../modals/EditPolicy'
import {useParams} from 'react-router-dom'
import API from '../../../util/Api'
import HashLoader from "react-spinners/HashLoader"
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {useNavigate} from 'react-router-dom'

const policyFields = [
  { key: 'usbmtp', label: 'USB Storage and MTP Access' },
  { key: 'printing', label: 'Printer Access' },
  { key: 'browserUpload', label: 'File Upload via Browser' },
  { key: 'bluetooth', label: 'Bluetooth Connectivity' },
  { key: 'clipboard', label: 'Clipboard' },
  { key: 'snipping', label: 'Snipping Tool'}
];

const ManagePolicy = () => {
  let [openModal, setOpenModal] = useState(false);
  let {groupId} = useParams();
  let [policy, setPolicy] = useState([]);
  let [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  const fetchPolicyDetails = async () => {
    let loaderTimeout;

    try {
      loaderTimeout = setTimeout(() => setLoading(true), 1000);
      let response = await API.get(`/policy/get-policy/${groupId}`);
      setPolicy(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      clearTimeout(loaderTimeout);
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
        <p className='back-button' onClick={()=>navigate('/device-screen-security')}><ArrowBackIcon/></p>
        <h4 className='groupId-heading'>MANAGE CONFIG- GroupID: {groupId}</h4>
        <button onClick={() => setOpenModal(true)} className='create-group-button'>Edit Policy</button>
        {openModal && <EditPolicy setOpenModal={setOpenModal} setPolicy={setPolicy}/>}
      </div>

      <div className="policy-body">
        <div className="policy-details">
          <table className="group-table">
            <thead>
              <tr>
                <th colSpan={2} className="group-table-heading">Restricted System Features</th>
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

        <div className="blacklisted-applications">
          <table className="group-table">
            <thead>
              <tr>
                <th className="group-table-heading">Blacklisted Applications</th>
              </tr>
            </thead>
            <tbody>
              {policy.length > 0 && policy[0].blockedApps ? (
                policy[0].blockedApps.split(',').map((data, index) => (
                  <tr key={index}>
                    <td className="group-table-data application-name">{data}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className='empty-data-table'>No application found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="clipboard-whitelists">
          <table className="group-table">
            <thead>
              <tr>
                <th className="group-table-heading">Clipboard WhiteLists</th>
              </tr>
            </thead>
            <tbody>
              {policy.length > 0 && policy[0].clipboardWhiteLists ? (
                policy[0].clipboardWhiteLists.split(',').map((data, index) => (
                  <tr key={index}>
                    <td className="group-table-data application-name">{data}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className='empty-data-table'>No application found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManagePolicy