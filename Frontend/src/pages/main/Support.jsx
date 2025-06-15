import React, {useEffect, useState, useRef} from "react"
import "./support.css"
import API from '../../util/Api'
import {toast, Bounce} from 'react-toastify'
import {v4 as uuidv4} from 'uuid'
// import HashLoader from "react-spinners/HashLoader"

const Support = () => {
  const issuesList = ["Application crashes on launch",
    "Unhandled exception thrown",
    "High CPU usage",
    "Memory leak detected",
    "File read/write permission denied",
    "Missing or corrupted dependencies",
    "Incompatible .NET framework version",
    "UI not responsive (freezing)",
    "Incorrect output or logic error",
    "Network request failed",
    "Configuration file not found",
    "Access to registry denied",
    "Third-party DLL not loaded",
    "Infinite loop causing freeze",
    "Database connection failed",
    "Missing administrator privileges",
    "Antivirus blocks the application",
    "Application stuck in background process",
    "Resource file not found (images, icons)",
    "Timers or threads not working as expected",
    "Incorrect date/time handling",
    "Application settings not saving",
    "Update mechanism fails",
    "Unexpected behavior on specific OS versions",
    "Keyboard or mouse events not registered",
    "Crash on window resize or resolution change",
    "Unhandled file format",
    "Multithreading race conditions",
    "Localization/encoding issues",
    "Installer missing prerequisites"];
  let [groupData, setGroupData] = useState([]);
  let [deviceData, setDeviceData] = useState([]);

  const [groupID, setGroupID] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [screenshot, setScreenshot] = useState({});
  const [urgency, setUrgency] = useState("");

  let fileInputRef = useRef();
  // const [loading, setLoading] = useState(false);

  let fetchGroupName = async () => {
    try {
      let fetchGroup = await API.get('/policy/fetch-group/');
      setGroupData(fetchGroup.data);
    } catch (error) {
      console.log(error.response.data.message || error);
    }
  }

  useEffect(() => {
    try {
      fetchGroupName();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleGroupChange = async (e) => {
    let selectedGroupID = e.target.value;
    setGroupID(selectedGroupID);

    try {
      let response = await API.get(`/devices/fetch-by-group/${selectedGroupID}`);
      setDeviceData(response.data.data);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || 'Group not selected!', {
        position: "top-center",
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    let ticketID = uuidv4();

    formData.append("ticketID", ticketID);
    formData.append("groupID", groupID);
    formData.append("deviceName", deviceName);
    formData.append("issueType", issueType);
    formData.append("description", description);
    formData.append("screenshot", screenshot);
    formData.append("urgency", urgency);

    try {
      // setLoading(true);
      let response = await API.post("/support/raise-ticket/", formData, {
        "Content-type": "multipart/form-data"
      });

      setGroupID('');
      setDeviceName('');
      setIssueType('');
      setDescription('');
      setScreenshot({});
      setUrgency('');
      fileInputRef.current.value = "";

      toast.success(`Ticket raised with ticketID ${ticketID}.`, {
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
      toast.error(error.response.data.message || 'Ticket not raised!', {
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
    }
  }

  return (
    <form className="support-form" onSubmit={handleSubmit}>
      {/* {loading && <div className="loader">
        <HashLoader color="#6F5FE7"/>
      </div>} */}
      <h2 className="support-heading">Technical Support Request</h2>
      <div className="support-row">
        <label htmlFor="groupName" className="support-label">Group Name: </label>
        <select name="groupName" id="groupName" className="support-select" value={groupID} onChange={handleGroupChange} required>
          <option value="">Select</option>
          {groupData.map((data, index) => (
            <option key={index} value={data.groupID}>{data.groupName}</option>
          ))}
        </select>
      </div>

      <div className="support-row">
        <label htmlFor="deviceName" className="support-label">Device Name: </label>
        <select name="deviceName" id="deviceName" value={deviceName} className="support-select" onChange={(e) => setDeviceName(e.target.value)} required>
          <option value="">Select</option>
          {deviceData.map((data, index) => (
            <option key={index} value={data.deviceID}>{data.deviceName}</option>
          ))}
        </select>
      </div>

      <div className="support-row">
        <label htmlFor="issueType" className="support-label">Select Issue: </label>
        <select name="issueType" id="issueType" value={issueType} className="support-select-long" onChange={(e) => setIssueType(e.target.value)} required>
          <option value="">Select</option>
          {issuesList.map((item, idx) => (
            <option value={item} key={idx}>{item}</option>
          ))}
        </select>
      </div>

      <div className="support-row">
        <label htmlFor="description" className="support-label">Description: </label>
        <textarea name="description" id="description" placeholder="Describe your issue.." className="support-textarea" rows={5} value={description} onChange={(e)=>setDescription(e.target.value)} required></textarea>
      </div>

      <div className="support-row">
        <label className="support-label">Upload File: </label>
        <input type="file" accept="image/*" className="screenshot-input" onChange={(e)=>setScreenshot(e.target.files[0])} ref={fileInputRef} required/>
      </div>

      <div className="support-row">
        <label htmlFor="urgency" className="support-label">Urgency: </label>
        <select name="urgency" id="urgency" className="support-select" value={urgency} onChange={(e) => setUrgency(e.target.value)} required>
          <option value="">Select</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>            
        </select>
      </div>
      <button className="create-group-button">Submit Support Request</button>
    </form>
  );
};

export default Support;