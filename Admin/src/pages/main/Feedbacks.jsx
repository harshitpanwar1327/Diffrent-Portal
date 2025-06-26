import React, { useState, useEffect } from 'react'
import NavigationBar from '../../components/NavigationBar'
import API from '../../utils/API'
import {FadeLoader} from 'react-spinners'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import ViewScreenshot from '../../modals/ViewScreenshot'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import {toast, Bounce} from 'react-toastify'

const Feedbacks = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [fullDesc, setFullDesc] = useState(false);
  const [screenshot, setScreenshot] = useState('');
  const [openImage, setOpenImage] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalData, setTotalData] = useState(1);

  const fetchFeedbacks = async () => {
    let loaderTimeout;

    try {
      loaderTimeout = setTimeout(() => setLoading(true), 1000)
      const response = await API.get(`/support/get-feedback?page=${currentPage}&limit=${itemsPerPage}&search=${search}`);
      setFeedbackData(response.data.data);
      setTotalData(response.data.total);
    } catch (error) {
      console.log(error.response.data.message || error);
    } finally {
      clearTimeout(loaderTimeout);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFeedbacks();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    fetchFeedbacks();
  }, [search]);

  const toggleDesc = () => {
    setFullDesc(!fullDesc);
  }

  const handleImageClick = (imageName) => {
    setOpenImage(true);
    setScreenshot(imageName);
  }

  const handleResolveButton = async (status, ticketId) => {
    let loaderTimeout;

    try {
      loaderTimeout = setTimeout(() => setLoading(true), 1000);

      let response = await API.put('/support/status', {
        status: status==="resolved"? "pending": "resolved",
        ticketId
      });

      fetchFeedbacks();

      toast.success('Status updated successfully', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || 'Status not updated!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } finally {
      clearTimeout(loaderTimeout);
      setLoading(false);
    }
  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  }

  return (
    <div className='flex flex-col w-full h-full'>
      {loading && (
        <div className="overlay">
          <FadeLoader color='rgba(255, 32, 86)'/>
        </div>
      )}
      <NavigationBar heading='Feedbacks' />
      <div className='grow p-2 overflow-auto'>
        <input type="text" name='search' id='search' placeholder='&#128269; Search here...' value={search} onChange={(e) => {setSearch(e.target.value); setCurrentPage(1)}} className='p-2 border border-gray-300 rounded-full mb-2'/>
        <table className='w-full'>
          <thead>
            <tr className='bg-[#f5f3ff] border-b border-[#434343]'>
              <th className='table-heading'>User ID</th>
              <th className='table-heading'>Ticket ID</th>
              <th className='table-heading'>Device ID</th>
              <th className='table-heading'>Issue Type</th>
              <th className='table-heading'>Description</th>
              <th className='table-heading'>Screenshot</th>
              <th className='table-heading'>Urgency</th>
              <th className='table-heading'>Status</th>
            </tr>
          </thead>
          <tbody>
            {feedbackData.length > 0 ? 
              feedbackData.map((data) => (
                <tr key={data.ticketId} className='hover:bg-[#f8f7ff] border-b border-[#848484]'>
                  <td className='p-2'>{data.userId}</td>
                  <td className='p-2'>{data.ticketId}</td>
                  <td className='p-2'>{data.deviceId}</td>
                  <td className='p-2'>{data.issueType}</td>
                  <td className='p-2'>{data.description.length > 75 ? (
                    <>
                      {fullDesc ? data.description: data.description.slice(0, 75)}
                      <button className='text-blue-500 ml-2 !p-0' onClick={toggleDesc}>
                        {fullDesc ? "...Show Less": "...Read More"}
                      </button>
                    </>
                    ) : (
                      data.description
                    )}
                  </td>
                  <td className='p-2'><img src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${data.screenshot}`} alt="Screenshot" className="max-w-[100px] max-h-[100px] object-cover rounded border cursor-pointer" onError={(e) => e.target.style.display = 'none'} onClick={()=>handleImageClick(data.screenshot)}/></td>
                  <td className={`p-2 ${data.urgency==='high'? 'text-red-500': data.urgency==='medium'? 'text-yellow-500': 'text-green-500'}`}>{data.urgency}</td>
                  <td className={'p-2'}>
                    <button className={data.status==="resolved"? 'w-full bg-green-600 text-white': '!border-green-600 text-green-600'} onClick={()=>handleResolveButton(data.status, data.ticketId)}>{data.status==="resolved"? <CheckCircleRoundedIcon/>: 'Resolved'}</button>
                  </td>
                </tr>
              )) : 
              <tr className='hover:bg-[#f8f7ff] border-b border-[#848484]'>
                <td className='p-2 text-center' colSpan={7}>No feedback available</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <Stack spacing={2} className='my-2'>
        <Pagination count={Math.ceil(totalData/itemsPerPage)} page={currentPage} onChange={handlePageChange} color="primary"/>
      </Stack>
      {openImage && <ViewScreenshot setOpenImage={setOpenImage} screenshot={screenshot}/>}
    </div>
  )
}

export default Feedbacks