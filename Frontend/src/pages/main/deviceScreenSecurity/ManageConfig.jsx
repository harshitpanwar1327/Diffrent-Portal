import { React, useEffect, useState } from 'react'
import './manageConfig.css'
import EditConfig from '../../../modals/EditConfig'
import API from '../../../util/Api'
import {useParams} from 'react-router-dom'
import HashLoader from "react-spinners/HashLoader"

const ManageConfig = () => {
  let [openModal, setOpenModal] = useState(false);
  let {groupId} = useParams();
  let [configData, setConfigData] = useState([]);
  let [loading, setLoading] = useState(false);

  const fetchConfigData = async () => {
    try {
      let response = await API.get(`/config/get-config/${groupId}/`);
      setConfigData(response.data.data);
    } catch (error) {
      console.log(error.response.data.message || error);
    }
  }

  useEffect(()=>{
    try {
      setLoading(true);
      fetchConfigData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

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
    <div className='main-page'>
      {loading && <div className="loader">
        <HashLoader color="#6F5FE7"/>
      </div>}
      <div className='policy-header'>
        <h4 className='groupId-heading'>MANAGE CONFIG- GroupID: {groupId}</h4>
        <button onClick={() => setOpenModal(true)} className='create-group-button'>Edit Config</button>
        {openModal && <EditConfig setOpenModal={setOpenModal} setConfigData={setConfigData}/>}
      </div>

      <div className="config-body">
        <div className="stamp-details">
          <table className="group-table">
            <thead>
              <tr>
                <td colSpan={2} className="group-table-heading">Stamp Info</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="group-table-data">Organization :</td>
                <td className="group-table-data"><b>{configData[0]?.organization}</b></td>
              </tr>
              <tr>
                <td className="group-table-data">MAC Address :</td>
                <td className={`group-table-data ${configData[0]?.macAddress ? 'active' : 'expired'}`}>{interpretConfig(configData[0]?.macAddress)}</td>
              </tr>
              <tr>
                <td className="group-table-data">IP Address :</td>
                <td className={`group-table-data ${configData[0]?.ipAddress ? 'active' : 'expired'}`}>{interpretConfig(configData[0]?.ipAddress)}</td>
              </tr>
              <tr>
                <td className="group-table-data">Date :</td>
                <td className={`group-table-data ${configData[0]?.date_enabled ? 'active' : 'expired'}`}>{interpretConfig(configData[0]?.date_enabled)}</td>
              </tr>
              <tr>
                <td className="group-table-data">Tagline :</td>
                <td className={`group-table-data ${configData[0]?.tagline_enabled ? 'active' : 'expired'}`}>{interpretConfig(configData[0]?.tagline_enabled)}</td>
              </tr>
              <tr>
                <td className="group-table-data">Layout :</td>
                <td className="group-table-data"><b>{configData[0]?.layout}</b></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="qr-visibility">
          <table className="group-table">
            <thead>
              <tr>
                <td colSpan={2} className="group-table-heading">QR Position</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="group-table-data">QR Top-Left :</td>
                <td className={`group-table-data ${configData[0]?.qr_top_left ? 'active' : 'expired'}`}>{interpretConfig(configData[0]?.qr_top_left)}</td>
              </tr>
              <tr>
                <td className="group-table-data">QR Top-Right :</td>
                <td className={`group-table-data ${configData[0]?.qr_top_right ? 'active' : 'expired'}`}>{interpretConfig(configData[0]?.qr_top_right)}</td>
              </tr>
              <tr>
                <td className="group-table-data">QR Bottom-Left :</td>
                <td className={`group-table-data ${configData[0]?.qr_bottom_left ? 'active' : 'expired'}`}>{interpretConfig(configData[0]?.qr_bottom_left)}</td>
              </tr>
              <tr>
                <td className="group-table-data">QR Bottom-Right :</td>
                <td className={`group-table-data ${configData[0]?.qr_bottom_right ? 'active' : 'expired'}`}>{interpretConfig(configData[0]?.qr_bottom_right)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="whitelisting-application">
          <table className="group-table">
            <thead>
              <tr>
                <td colSpan={2} className="group-table-heading">Whitelisted Applications</td>
              </tr>
            </thead>
            <tbody>
              {configData.length > 0 && configData[0].whitelist_processes ? (
                configData[0].whitelist_processes.split(',').map((data, index) => (
                  <tr key={index}>
                    <td className="group-table-data application-name">{data}</td>
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

export default ManageConfig