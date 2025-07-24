import {React, useState, useEffect} from 'react'
import './editPolicy.css'
import API from '../util/Api'
import {toast} from 'react-toastify'
import {useParams} from 'react-router-dom'
import HashLoader from "react-spinners/HashLoader"
import CancelIcon from '@mui/icons-material/Cancel'

const EditPolicy = ({setOpenModal, setPolicy}) => {
  let [usbmtp, setUsbMtp] = useState(false);
  let [printing, setPrinting] = useState(false);
  let [browserUpload, setBrowserUpload] = useState(false);
  let [bluetooth, setBluetooth] = useState(false);
  let [clipboard, setClipboard] = useState(false);
  let [snipping, setSnipping] = useState(false);
  let [blockedApp, setBlockedApp] = useState('');
  let [blockedAppsData, setBlockedAppsData] = useState([]);
  let [clipboardApp, setClipboardApp] = useState('');
  let [clipboardWhiteLists, setClipboardWhiteLists] = useState([]);
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
    setUsbMtp(prevData[0]?.usbmtp  || false);
    setPrinting(prevData[0]?.printing  || false);
    setBrowserUpload(prevData[0]?.browserUpload  || false);
    setBluetooth(prevData[0]?.bluetooth || false);
    setClipboard(prevData[0]?.clipboard || false);
    setSnipping(prevData[0]?.snipping || false);
    if(prevData[0]?.blockedApps?.length > 0){
      setBlockedAppsData(prevData[0]?.blockedApps?.split(',') || []);
    }
    if(prevData[0]?.clipboardWhiteLists?.length > 0){
      setClipboardWhiteLists(prevData[0]?.clipboardWhiteLists?.split(',') || []);
    }
  }

  useEffect(() => {
    try {
      fetchPrevData();
    } catch (error) {
      console.log(error);
    }
  }, [prevData]);

  const handleBlockButton = () => {
    const name = blockedApp.trim();
    if (name && !blockedAppsData.includes(name)) {
      setBlockedAppsData([...blockedAppsData, name]);
      setBlockedApp('');
    } else {
      toast.warning('App already blocked');
    }
  };

  const handleWhitelistButton = () => {
    const name = clipboardApp.trim();
    if (name && !clipboardWhiteLists.includes(name)) {
      setClipboardWhiteLists([...clipboardWhiteLists, name]);
      setClipboardApp('');
    } else {
      toast.warning('App already whitelisted');
    }
  }

  const handleCancelButton = (index, type) => {
    if (type==='block') {
      const removed = blockedAppsData[index];
      setBlockedAppsData(blockedAppsData.filter((_, i) => i !== index));
      toast.info(`${removed} removed from blocked list`);
    } else if (type==='whitelist') {
      const removed = clipboardWhiteLists[index];
      setClipboardWhiteLists(clipboardWhiteLists.filter((_, i) => i !== index));
      toast.info(`${removed} removed from blocked list`);
    } else {
      console.log("Invalid cancel button type.");
    }
  };

  const handlePolicy = async (e) => {
    e.preventDefault();

    let loaderTimeout;

    try {
      loaderTimeout = setTimeout(() => setLoading(true), 1000);

      const policy = {
        groupId,
        usbmtp,
        printing,
        browserUpload,
        bluetooth,
        clipboard,
        snipping,
        blockedApps: blockedAppsData.join(','),
        clipboardWhiteLists: clipboardWhiteLists.join(',')
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
              <input type="checkbox" name="usbmtp" id="usbmtp" checked={usbmtp} onChange={(e)=>setUsbMtp(!usbmtp)} />
              <label htmlFor="usbmtp">USB & MTP Service</label>
            </div>
            <div className="policy-checkbox">
              <input type="checkbox" name="printing" id="printing" checked={printing} onChange={(e)=>setPrinting(!printing)} />
              <label htmlFor="printing">Printer</label>
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
            <div className="policy-checkbox">
              <input type="checkbox" name="snipping" id="snipping" checked={snipping} onChange={(e)=>setSnipping(!snipping)}/>
              <label htmlFor="snipping">Snipping Tool</label>
            </div>
          </div>

          <div className="blockedApps">
            <div className="addApps">
              <input type="text" placeholder='Block application' className='addApps-input' value={blockedApp} onChange={(e)=>setBlockedApp(e.target.value)}/>
              <button className='addApps-button' type='button' onClick={handleBlockButton} disabled={!blockedApp.trim()}>Block</button>
            </div>
            <ul className='blockedApps-list'>
              {blockedAppsData.length > 0 ? (
                blockedAppsData.map((data, index) => (
                  <li key={index}>
                    {data}
                    <CancelIcon className='removeApp-button' onClick={()=>handleCancelButton(index, 'block')}/>
                  </li>
                ))
              ) : (
                <div className='no-data-message'>
                  <p>No blocked app</p>
                </div>
              )}
            </ul>
          </div>

          <div className="clipboardWhiteLists">
            <div className="addApps">
              <input type="text" placeholder='Clipboard whitelist application' className='addApps-input' value={clipboardApp} onChange={(e)=>setClipboardApp(e.target.value)}/>
              <button className='addApps-button' type='button' onClick={handleWhitelistButton} disabled={!clipboardApp.trim()}>WhiteList</button>
            </div>
            <ul className='blockedApps-list'>
              {clipboardWhiteLists.length > 0 ? (
                clipboardWhiteLists.map((data, index) => (
                  <li key={index}>
                    {data}
                    <CancelIcon className='removeApp-button' onClick={()=>handleCancelButton(index, 'whitelist')}/>
                  </li>
                ))
              ) : (
                <div className='no-data-message'>
                  <p>No whitelisted app</p>
                </div>
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