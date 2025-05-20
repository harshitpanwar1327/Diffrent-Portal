import {React , useEffect, useState}from 'react'
import './editGroup.css'
import API from '../util/Api'
import {toast, Bounce} from 'react-toastify'
// import HashLoader from "react-spinners/HashLoader"

const EditGroup = ({setOpenModal, groupID, setGroupData}) => {
    let [groupName , setGroupName] = useState('');
    // const [loading, setLoading] = useState(false);

    useEffect(()=>{
        let fetchGroupDetails = async () => {
            try {
              let fetchData = await API.get(`/policy/fetch-by-groupID/${groupID}`);
              setGroupName(fetchData.data[0].groupName);
            } catch (error) {
              console.log(error);
            }
        }
      
        fetchGroupDetails();
    }, []);

    const handleEditGroup = async (e)=>{
        e.preventDefault();

        let groupData = {
            groupID: groupID,
            groupName: groupName
        }

        try {
            // setLoading(true);
            let response = await API.put("/policy/update-group/", groupData);
            
            setGroupData(prev => {
                let rem = prev.filter(data => data.groupID!==groupData.groupID);
                return [...rem, groupData];
            });

            toast.success('Group Saved Successfully!', {
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
        <div className="overlay" onClick={() => setOpenModal(false)}>
        {/* {loading && <div className="loader">
            <HashLoader color="#6F5FE7"/>
        </div>} */}
        <div className='createGroupPopup' onClick={(e) => e.stopPropagation()}>
            <i onClick={()=>{setOpenModal(false)}} className="fa-solid fa-xmark"></i>
            <form onSubmit={handleEditGroup}>
                <h3>Let's create a Group</h3>
                <input type="text" name="groupName" id="groupName" placeholder='Group name' className='groupInput' value={groupName} onChange={(e)=> setGroupName(e.target.value)} required/>
                <button className='createGroupButton'>Edit Group</button>
            </form>
        </div>
        </div>
    )
}

export default EditGroup