import React, { useState, useEffect, useRef } from 'react'
import NavigationBar from '../../components/NavigationBar'
import API from '../../utils/API'
import {FadeLoader} from 'react-spinners'

const Feedbacks = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(false);
  let loaderTimeout = useRef(null);

  const fetchFeedbacks = async () => {
    try {
      loaderTimeout.current = setTimeout(() => setLoading(true), 1000)
      const response = await API.get('/support/get-feedback');
      setFeedbackData(response.data.data);
    } catch (error) {
      console.log(error.response.data.message || error);
    } finally {
      clearTimeout(loaderTimeout.current);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFeedbacks();
  }, []);

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
                  <td className='p-2'></td>
                  <td className='p-2'>{data.urgency}</td>
                </tr>
              )) : 
              <tr className='hover:bg-[#f8f7ff] border-b border-[#848484]'>
                <td className='p-2' colSpan={6}>No feedback available</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Feedbacks