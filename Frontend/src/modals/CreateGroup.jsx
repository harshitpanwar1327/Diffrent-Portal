import {React , useState}from 'react'
import './createGroup.css'
import API from '../util/Api'
import {toast, Bounce} from 'react-toastify'
import {v4 as uuidv4} from 'uuid'
import HashLoader from "react-spinners/HashLoader"

const CreateGroup = ({setOpenModal , setGroupData}) => {
  let [groupName , setGroupName] = useState('');
  let [loading, setLoading] = useState(false);

  const handleCreate = async (e)=>{
    e.preventDefault();

    let groupData = {
      groupID: uuidv4().slice(0,4),
      groupName: groupName
    }

    try {
      setLoading(true);
      let response = await API.post("/policy/add-group/", groupData);
      setGroupData((prev) => [...prev, groupData]);

      toast.success('Group Saved Successfully', {
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
      toast.error(error.response.data.message || 'Group not saved!', {
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
    <div className="overlay" onClick={() => setOpenModal(false)}>
      {loading && <div className="loader">
        <HashLoader color="#6F5FE7"/>
      </div>}
      <div className='create-group-popup' onClick={(e) => e.stopPropagation()}>
        <i onClick={()=>{setOpenModal(false)}} className="fa-solid fa-xmark"></i>
          <form onSubmit={handleCreate}>
            <h3>Let's create a Group</h3>
            <input type="text" name="groupName" id="groupName" placeholder='Group name' className='group-input' value={groupName} onChange={(e)=> setGroupName(e.target.value)} required/>
            <button className='create-group-button'>Create Group</button>
          </form>
      </div>
    </div>
  )
}

export default CreateGroup