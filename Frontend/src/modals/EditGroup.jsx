import {React , useEffect, useState}from 'react'
import './editGroup.css'
import API from '../util/Api'
import {toast, Bounce} from 'react-toastify'
import HashLoader from "react-spinners/HashLoader"

const EditGroup = ({setOpenModal, groupId, setGroupData}) => {
    let [groupName , setGroupName] = useState('');
    let [loading, setLoading] = useState(false);

    let fetchGroupDetails = async () => {
        let loaderTimeout;

        try {
            loaderTimeout = setTimeout(() => setLoading(true), 1000);
            let response = await API.get(`/group/get-group/${groupId}`);
            setGroupName(response.data[0].groupName);
        } catch (error) {
            console.log(error.response.data.message || error);
        } finally {
            clearTimeout(loaderTimeout);
            setLoading(false);
        }
    }

    useEffect(()=>{
        try {
            fetchGroupDetails();
        } catch (error) {
            console.log(error);
        }
    }, []);

    const handleEditGroup = async (e)=>{
        e.preventDefault();

        let loaderTimeout;

        try {
            loaderTimeout = setTimeout(() => setLoading(true), 1000);

            let groupData = {
                groupId,
                groupName
            };

            let response = await API.put("/group/update-group/", groupData);
            
            setGroupData(prev => {
                let rem = prev.filter(data => data.groupId!==groupData.groupId);
                return [...rem, groupData];
            });

            toast.success('Group Edited Successfully', {
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
            toast.error(error.response.data.message || 'Group not edited!', {
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
            clearTimeout(loaderTimeout);
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
            <form onSubmit={handleEditGroup}>
                <h3>Let's create a Group</h3>
                <input type="text" name="groupName" id="groupName" placeholder='Group name' className='group-input' value={groupName} onChange={(e)=> setGroupName(e.target.value)} required/>
                <button className='create-group-button'>Edit Group</button>
            </form>
        </div>
        </div>
    )
}

export default EditGroup