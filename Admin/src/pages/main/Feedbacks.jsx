import React, { useState, useEffect } from 'react'
import NavigationBar from '../../components/NavigationBar'
import API from '../../utils/API'
import {FadeLoader} from 'react-spinners'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'

const Feedbacks = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalData, setTotalData] = useState(1);

  const fetchFeedbacks = async () => {
    let loaderTimeout;

    try {
      loaderTimeout = setTimeout(() => setLoading(true), 1000)
      const response = await API.get(`/support/get-feedback?page=${currentPage}&limit=${itemsPerPage}`);
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
        <table className='w-full'>
          <thead>
            <tr className='bg-[#f5f3ff] border-b border-[#434343]'>
              <th className='table-heading'>User ID</th>
              <th className='table-heading'>Ticket ID</th>
              <th className='table-heading'>Device Name</th>
              <th className='table-heading'>Issue Type</th>
              <th className='table-heading'>Description</th>
              <th className='table-heading'>Screenshot</th>
              <th className='table-heading'>Urgency</th>
            </tr>
          </thead>
          <tbody>
            {feedbackData.length > 0 ? 
              feedbackData.map((data) => (
                <tr key={data.ticketId} className='hover:bg-[#f8f7ff] border-b border-[#848484]'>
                  <td className='p-2'>{data.userId}</td>
                  <td className='p-2'>{data.ticketId}</td>
                  <td className='p-2'>{data.deviceName}</td>
                  <td className='p-2'>{data.issueType}</td>
                  <td className='p-2'>{data.description}</td>
                  <td className='p-2'><img src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${data.screenshot}`} alt="Screenshot" className="max-w-[100px] max-h-[100px] object-cover rounded border" onError={(e) => e.target.style.display = 'none'}/></td>
                  <td className='p-2'>{data.urgency}</td>
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
    </div>
  )
}

export default Feedbacks