import {React, useState, useEffect} from 'react'
import './makePolicy.css'
import Switch from '@mui/material/Switch'
import API from '../util/Api'
import {toast, Bounce} from 'react-toastify'
import {useParams} from 'react-router-dom'
// import HashLoader from "react-spinners/HashLoader"

const MakePolicy = ({setOpenModal, setPolicy}) => {
  const label = { inputProps: { 'aria-label': 'Switch demo' } };
  let [usb, setUsb] = useState(false);
  let [mtp, setMtp] = useState(false);
  let [printing, setPrinting] = useState(false);
  let [browserUpload, setBrowserUpload] = useState(false);
  let [bluetooth, setBluetooth] = useState(false);
  let [monitoring, setMonitoring] = useState(true);
  let [source, setSource] = useState('');
  let {groupID} = useParams();

  let [chrome, setChrome] = useState(false);
  let [edge, setEdge] = useState(false);
  let [outlook, setOutlook] = useState(false);
  let [microsoft, setMicrosoft] = useState(false);
  let [teams, setTeams] = useState(false);
  let [zoom, setZoom] = useState(false);

  let [prevData, setPrevData] = useState([]);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPolicyDetails = async () => {
      try {
        let response = await API.get(`/policy/fetch-policy/${groupID}`);
        setPrevData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchPolicyDetails();
  }, [groupID]);

  useEffect(() => {
    const fetchPrevData = () => {
      setUsb(prevData[0]?.usb || false);
      setMtp(prevData[0]?.mtp  || false);
      setPrinting(prevData[0]?.printing  || false);
      setBrowserUpload(prevData[0]?.browserUpload  || false);
      setBluetooth(prevData[0]?.bluetooth || false);
      setMonitoring(prevData[0]?.monitoring || false);
      setSource(prevData[0]?.source || '');

      let process = prevData[0]?.applications ? prevData[0]?.applications.split(',') : [];
      setChrome(process.includes('chrome'));
      setEdge(process.includes('edge'));
      setOutlook(process.includes('outlook'));
      setMicrosoft(process.includes('msoffice'));
      setTeams(process.includes('teams'));
      setZoom(process.includes('zoom'));
    }

    fetchPrevData();
  }, [prevData]);

  // Select folder code
  const [folderName, setFolderName] = useState('');
  const [fileList, setFileList] = useState([]);

  const handlePickFolder = async () => {
    try {
      // Open folder picker
      const folderHandle = await window.showDirectoryPicker();
      setFolderName(folderHandle.name);

      const files = [];
      for await (const entry of folderHandle.values()) {
        if (entry.kind === 'file') {
          files.push(entry.name);
        }
      }
      setFileList(files);
    } catch (error) {
      console.error('Folder selection failed or was cancelled', error);
    }
  };

  let applicationsArray = [];
  if(chrome) applicationsArray.push('chrome');
  if(edge) applicationsArray.push('edge');
  if(outlook) applicationsArray.push('outlook');
  if(microsoft) applicationsArray.push('msoffice');
  if(teams) applicationsArray.push('teams');
  if(zoom) applicationsArray.push('zoom');

  let applicationsString = applicationsArray.join(',');

  const handlePolicy = async (e) => {
    e.preventDefault();

    const policy = {
      groupID: groupID,
      usb: usb,
      mtp: mtp,
      printing: printing,
      browserUpload: browserUpload,
      bluetooth: bluetooth,
      monitoring: monitoring,
      source: source,
      applications: applicationsString
    }

    try {
      // setLoading(true);
      let response = await API.post("/policy/update-policy/", policy);

      setPolicy([policy]);

      toast.success('Policy Saved Successfully!', {
        position: "top-center",
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce
      });
    } catch (error) {
      toast.error('Something went Wrong! Please try again...', {
        position: "top-center",
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce
      });
    } finally {
      // setLoading(false);
      setOpenModal(false);
    }
  }

  return (
    <div className='overlay' onClick={()=>setOpenModal(false)}>
      {/* {loading && <div className="loader">
        <HashLoader color="#6F5FE7"/>
      </div>} */}
      <div className='addPolicyPopup' onClick={(e)=>e.stopPropagation()}>
        <i className="fa-solid fa-xmark" onClick={()=>setOpenModal(false)}></i>
        <h3 className='importDeviceHeading'>Policy Validation</h3>
        <form className="policyForm" onSubmit={handlePolicy}>
          <div className="policyValidation">
            <h4 className='policy-heading'>Select What to Block</h4>
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
          </div>

          <div className="policyVideoMonitoring">
              <h4 className='policy-heading'>Video Monitoring</h4>
              <Switch {...label} checked={monitoring} onChange={() => setMonitoring(!monitoring)}/>
              <div className="sourceDirectory">
                <p className="sourceDirectory-para">Source Directory: </p>
                <div className="p-4">
                  <button
                    onClick={handlePickFolder}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Select Folder
                  </button>

                  {folderName && (
                    <div className="mt-4">
                      <h2 className="text-xl font-semibold">Selected Folder: {folderName}</h2>
                      {fileList.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {fileList.map((file, index) => (
                            <li key={index}>{file}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>No files inside this folder.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
          </div>

          <div className="applicationValidation">
            <h4 className='policy-heading'>Application Validation</h4>
            <h4 className='policy-heading'>Browser</h4>
            <div className="applicationOptions">
              <div className="applicationValidationCheckbox">
                <input type="checkbox" name="chrome" id="chrome" checked={chrome} onChange={(e)=>setChrome(e.target.checked)}/>
                <label htmlFor="chrome">Chrome</label>
              </div>              
              <div className="applicationValidationCheckbox">
                <input type="checkbox" name="edge" id="edge" checked={edge} onChange={(e)=>setEdge(e.target.checked)}/>
                <label htmlFor="edge">Edge</label>
              </div>
            </div>
            <h4 className='policy-heading'>Email Client</h4>
            <div className="applicationOptions">
              <div className="applicationValidationCheckbox">
                <input type="checkbox" name="outlook" id="outlook" checked={outlook} onChange={(e)=>setOutlook(e.target.checked)}/>
                <label htmlFor="outlook">Outlook</label>
              </div>
            </div>
            <h4 className='policy-heading'>Office Suite</h4>
            <div className='applicationOptions'>
              <div className="applicationValidationCheckbox">
                <input type="checkbox" name="word-excel-powerpoint" id="word-excel-powerpoint" checked={microsoft} onChange={(e)=>setMicrosoft(e.target.checked)}/>
                <label htmlFor="word-excel-powerpoint">Microsoft Office (Word, Excel, PowerPoint)</label>
              </div>
            </div>
            <h4 className='policy-heading'>Communication</h4>
            <div className="applicationOptions">
              <div className="applicationValidationCheckbox">
                <input type="checkbox" name="microsoft-teams" id="microsoft-teams" checked={teams} onChange={(e)=>setTeams(e.target.checked)}/>
                <label htmlFor="microsoft-teams">Microsoft Teams</label>
              </div>              
              <div className="applicationValidationCheckbox">
                <input type="checkbox" name="zoom" id="zoom" checked={zoom} onChange={(e)=>setZoom(e.target.checked)}/>
                <label htmlFor="zoom">Zoom</label>
              </div>
            </div>
          </div>
          <button className="createGroupButton" type="submit">Save</button>
        </form>
      </div>
    </div>
  )
}

export default MakePolicy