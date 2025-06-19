import {React, useState, useEffect} from 'react'
import './editPolicy.css'
import API from '../util/Api'
import {toast, Bounce} from 'react-toastify'
import {useParams} from 'react-router-dom'
import HashLoader from "react-spinners/HashLoader"

const EditPolicy = ({setOpenModal, setPolicy}) => {
  let [usb, setUsb] = useState(false);
  let [mtp, setMtp] = useState(false);
  let [printing, setPrinting] = useState(false);
  let [browserUpload, setBrowserUpload] = useState(false);
  let [bluetooth, setBluetooth] = useState(false);
  let {groupId} = useParams();

  let [prevData, setPrevData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPolicyDetails = async () => {
    try {
      setLoading(true);
      let response = await API.get(`/policy/get-policy/${groupId}`);
      setPrevData(response.data.data);
    } catch (error) {
      console.log(error.response.data.message || error);
    } finally {
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
  }

  useEffect(() => {
    try {
      fetchPrevData();
    } catch (error) {
      console.log(error);
    }
  }, [prevData]);

  const handlePolicy = async (e) => {
    e.preventDefault();

    const policy = {
      groupId: groupId,
      usb: usb,
      mtp: mtp,
      printing: printing,
      browserUpload: browserUpload,
      bluetooth: bluetooth
    }

    try {
      setLoading(true);
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
      toast.error(error.response.data.message || 'Policy not saved!', {
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
        <form className="policy-form" onSubmit={handlePolicy}>
          <h3 className='policy-heading'>Restrict System Features</h3>
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
          <button className="create-group-button" type="submit">Save</button>
        </form>
      </div>
    </div>
  )
}

export default EditPolicy