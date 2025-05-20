import { React, useEffect, useState } from 'react'
import './addConfig.css'
import MakeConfig from '../../../modals/MakeConfig'
import API from '../../../util/Api'
import {useParams} from 'react-router-dom'

const AddConfig = () => {
  let [openModal, setOpenModal] = useState(false);
  let {groupID} = useParams();
  let [configData, setConfigData] = useState([]);

  useEffect(()=>{
    const fetchConfigData = async () => {
      try {
        let response = await API.get(`/config/get-config/${groupID}/`);
        setConfigData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchConfigData();
  }, [groupID]);

  let interpretConfig = (value) => {
    if(value === true || value === 1) {
      return "Active";
    } else if (value === false || value === 0) {
      return "Inactive";
    } else {
      return "N/A"
    }
  }

  return (
    <div className='mainPages'>
      <div className='policy-header'>
        <button onClick={() => setOpenModal(true)} className='createGroup-button'>Edit Config</button>
        <h4 className='groupID-heading'>MANAGE CONFIG- GroupID: {groupID}</h4>
        {openModal && <MakeConfig setOpenModal={setOpenModal} setConfigData={setConfigData}/>}
      </div>

      <div className="config-body">
        <div className="stamp-details">
          <table className="groupTable">
            <thead>
              <tr>
                <td colSpan={2} className="groupTable-heading">Stamp Info</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="groupTable-data">Organization :</td>
                <td className="groupTable-data"><b>{configData[0]?.organization}</b></td>
              </tr>
              <tr>
                <td className="groupTable-data">MAC Address :</td>
                <td className={`groupTable-data ${configData[0]?.macAddress ? 'active' : 'expired'}`}>{interpretConfig(configData[0]?.macAddress)}</td>
              </tr>
              <tr>
                <td className="groupTable-data">IP Address :</td>
                <td className={`groupTable-data ${configData[0]?.ipAddress ? 'active' : 'expired'}`}>{interpretConfig(configData[0]?.ipAddress)}</td>
              </tr>
              <tr>
                <td className="groupTable-data">Date :</td>
                <td className={`groupTable-data ${configData[0]?.date_enabled ? 'active' : 'expired'}`}>{interpretConfig(configData[0]?.date_enabled)}</td>
              </tr>
              <tr>
                <td className="groupTable-data">Tagline :</td>
                <td className={`groupTable-data ${configData[0]?.tagline_enabled ? 'active' : 'expired'}`}>{interpretConfig(configData[0]?.tagline_enabled)}</td>
              </tr>
              <tr>
                <td className="groupTable-data">Layout :</td>
                <td className="groupTable-data"><b>{configData[0]?.layout}</b></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="qr-visibility">
          <table className="groupTable">
            <thead>
              <tr>
                <td colSpan={2} className="groupTable-heading">QR Position</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="groupTable-data">QR Top-Left :</td>
                <td className={`groupTable-data ${configData[0]?.qr_top_left ? 'active' : 'expired'}`}>{interpretConfig(configData[0]?.qr_top_left)}</td>
              </tr>
              <tr>
                <td className="groupTable-data">QR Top-Right :</td>
                <td className={`groupTable-data ${configData[0]?.qr_top_right ? 'active' : 'expired'}`}>{interpretConfig(configData[0]?.qr_top_right)}</td>
              </tr>
              <tr>
                <td className="groupTable-data">QR Bottom-Left :</td>
                <td className={`groupTable-data ${configData[0]?.qr_bottom_left ? 'active' : 'expired'}`}>{interpretConfig(configData[0]?.qr_bottom_left)}</td>
              </tr>
              <tr>
                <td className="groupTable-data">QR Bottom-Right :</td>
                <td className={`groupTable-data ${configData[0]?.qr_bottom_right ? 'active' : 'expired'}`}>{interpretConfig(configData[0]?.qr_bottom_right)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="whitelisting-application">
          <table className="groupTable">
            <thead>
              <tr>
                <td colSpan={2} className="groupTable-heading">Whitelisted Applications</td>
              </tr>
            </thead>
            <tbody>
              {configData.length > 0 && configData[0].whitelist_processes ? (
                configData[0].whitelist_processes.split(',').map((data, index) => (
                  <tr key={index}>
                    <td className="groupTable-data application-name">{data}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className='empty-data-table'>No application found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AddConfig