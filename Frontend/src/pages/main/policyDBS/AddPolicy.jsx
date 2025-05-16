import React, {useEffect, useState} from 'react'
import './addPolicy.css'
import MakePolicy from '../../../modals/MakePolicy'
import {useParams} from 'react-router-dom'
import API from '../../../util/Api'
// import HashLoader from "react-spinners/HashLoader"

const policyFields = [
  { key: 'usb', label: 'USB Data Transfer' },
  { key: 'mtp', label: 'Media Transfer Protocol' },
  { key: 'printing', label: 'Printing' },
  { key: 'browserUpload', label: 'Browser Upload' },
  { key: 'bluetooth', label: 'Bluetooth' },
];

const AddPolicy = () => {
  let [openModal, setOpenModal] = useState(false);
  let {groupID} = useParams();
  let [policy, setPolicy] = useState([]);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPolicyDetails = async () => {
      try {
        let response = await API.get(`/policy/fetch-policy/${groupID}`);
        setPolicy(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchPolicyDetails();
  }, [groupID]);

  let interpretPolicy = (value) => {
    if(value === true || value === 1) {
      return "Blocked";
    } else if (value === false || value === 0) {
      return "Allowed";
    } else {
      return "N/A"
    }
  }

  return (
    <div className='mainPages'>
        <div className='policy-header'>
            <button onClick={() => setOpenModal(true)} className='createGroup-button'>Edit Policy</button>
            {openModal && <MakePolicy setOpenModal={setOpenModal} setPolicy={setPolicy}/>}
        </div>

        <div className="policy-body">
            <div className="data-block-div">
              <h3 className='policy-body-heading'>What is Blocked?</h3>
              {policyFields.map(({key, label}, index) => (
                <p key={index} className='policy-body-para'><b>{label}: </b>{interpretPolicy(policy[0]?.[key])}</p>
              ))}
            </div>
            <div className="video-monitoring-div">
              <h3 className='policy-body-heading'>Video Monitoring</h3>
              <p className='policy-body-para'><b>Source Directory: </b>{policy[0]?.source || "N/A"}</p>
            </div>
            <div className="application-name-div">
              <h3 className='policy-body-heading'>Application Validation</h3>
              <p>{policy[0]?.applications || "No application configured."}</p>
            </div>
        </div>
    </div>
  )
}

export default AddPolicy