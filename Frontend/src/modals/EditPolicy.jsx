import {React, useState, useEffect} from 'react'
import './editPolicy.css'
import API from '../util/Api'
import {toast} from 'react-toastify'
import {useParams} from 'react-router-dom'
import HashLoader from "react-spinners/HashLoader"
import CancelIcon from '@mui/icons-material/Cancel'

const EditPolicy = ({setOpenModal, setPolicy}) => {
  let [usb, setUsb] = useState(false);
  let [mtp, setMtp] = useState(false);
  let [printing, setPrinting] = useState(false);
  let [browserUpload, setBrowserUpload] = useState(false);
  let [bluetooth, setBluetooth] = useState(false);
  let [clipboard, setClipboard] = useState(false);
  let [appName, setAppName] = useState('');
  let [blockedApps, setBlockedApps] = useState([]);
  let {groupId} = useParams();

  let [prevData, setPrevData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPolicyDetails = async () => {
    let loaderTimeout;

    try {
      loaderTimeout = setTimeout(() => setLoading(true), 1000);
      let response = await API.get(`/policy/get-policy/${groupId}`);
      setPrevData(response.data.data);
    } catch (error) {
      console.log(error.response.data.message || error);
    } finally {
      clearTimeout(loaderTimeout);
      setLoading(false)
    }
  }

  useEffect(() => {
    try {
      fetchPolicyDetails();
    } catch (error) {
      console.log(error);
    }
  }, [groupId]);

  const fetchPrevData = () => {
    setUsb(prevData[0]?.usb || false);
    setMtp(prevData[0]?.mtp  || false);
    setPrinting(prevData[0]?.printing  || false);
    setBrowserUpload(prevData[0]?.browserUpload  || false);
    setBluetooth(prevData[0]?.bluetooth || false);
    setClipboard(prevData[0]?.clipboard || false);
    setBlockedApps(prevData[0]?.blockedApps.split(',') || []);
  }

  useEffect(() => {
    try {
      fetchPrevData();
    } catch (error) {
      console.log(error);
    }
  }, [prevData]);

  const handleBlockButton = () => {
    const name = appName.trim();
    if (name && !blockedApps.includes(name)) {
      setBlockedApps([...blockedApps, name]);
      setAppName('');
    } else if (blockedApps.includes(name)) {
      toast.warning('App already blocked');
    }
  };

  const handleCancelButton = (index) => {
    const removed = blockedApps[index];
    setBlockedApps(blockedApps.filter((_, i) => i !== index));
    toast.info(`${removed} removed from blocked list`);
  };

  const handlePolicy = async (e) => {
    e.preventDefault();

    let loaderTimeout;

    try {
      loaderTimeout = setTimeout(() => setLoading(true), 1000);

      const policy = {
        groupId,
        usb,
        mtp,
        printing,
        browserUpload,
        bluetooth,
        clipboard,
        blockedApps: blockedApps.join(',')
      }

      let response = await API.post("/policy/update-policy/", policy);
      setPolicy([policy]);

      toast.success('Policy Saved Successfully!');
    } catch (error) {
      toast.error(error.response.data.message || 'Policy not saved!');
    } finally {
      clearTimeout(loaderTimeout);
      setLoading(false);
      setOpenModal(false);
    }
  }

  return (
    <div className='overlay' onClick={()=>setOpenModal(false)}>
      {loading && <div className="loader">
        <HashLoader color="#6F5FE7"/>
      </div>}
      <div className='add-policy-popup' onClick={(e)=>e.stopPropagation()}>
        <i className="fa-solid fa-xmark" onClick={()=>setOpenModal(false)}></i>
        <h3 className='policy-heading'>Restrict System Features</h3>
        <form className="policy-form" onSubmit={handlePolicy}>
          <div className="core-policy">
            <div className="policy-checkbox">
              <input type="checkbox" name="usb" id="usb" checked={usb} onChange={(e)=>setUsb(!usb)} />
              <label htmlFor="usb">USB Data Transfer</label>
            </div>
            <div className="policy-checkbox">
              <input type="checkbox" name="mtp" id="mtp" checked={mtp} onChange={(e)=>setMtp(!mtp)} />
              <label htmlFor="mtp">MTP Service</label>
            </div>
            <div className="policy-checkbox">
              <input type="checkbox" name="printing" id="printing" checked={printing} onChange={(e)=>setPrinting(!printing)} />
              <label htmlFor="printing">Printing</label>
            </div>
            <div className="policy-checkbox">
              <input type="checkbox" name="browserUpload" id="browserUpload" checked={browserUpload} onChange={()=>setBrowserUpload(!browserUpload)}/>
              <label htmlFor="browserUpload">Browser Upload</label>
            </div>
            <div className="policy-checkbox">
              <input type="checkbox" name="bluetooth" id="bluetooth" checked={bluetooth} onChange={(e)=>setBluetooth(!bluetooth)}/>
              <label htmlFor="bluetooth">Bluetooth Data Transfer</label>
            </div>
            <div className="policy-checkbox">
              <input type="checkbox" name="clipboard" id="clipboard" checked={clipboard} onChange={(e)=>setClipboard(!clipboard)}/>
              <label htmlFor="clipboard">Clipboard</label>
            </div>
          </div>

          <div className="blockedApps">
            <div className="addApps">
              <input type="text" placeholder='Application name' className='addApps-input' value={appName} onChange={(e)=>setAppName(e.target.value)}/>
              <button className='create-group-button' type='button' onClick={handleBlockButton} disabled={!appName.trim()}>Block</button>
            </div>
            <ul className='blockedApps-list'>
              {blockedApps.length > 0 ? (
                blockedApps.map((data, index) => (
                  <li key={index}>
                    {data}
                    <CancelIcon className='removeApp-button' onClick={()=>handleCancelButton(index)}/>
                  </li>
                ))
              ) : (
                <p style={{textAlign: 'center', margin: '0'}}>No application blocked</p>
              )}
            </ul>
          </div>
          <button className="create-group-button" type="submit">Save</button>
        </form>
      </div>
    </div>
  )
}

export default EditPolicy