import React, { useEffect } from 'react'
import NavigationBar from '../../components/NavigationBar'
import API from '../../utils/API'

const Feedbacks = () => {
  const fetchFeedbacks = async () => {
    try {
      const response = await API.get('/support/get-feedback');
      console.log(response);
    } catch (error) {
      console.log(error.response.data.message || error);
    }
  }

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className='flex flex-col w-full h-full'>
      <NavigationBar heading='Feedbacks' />
      <div className='grow p-2'>

      </div>
    </div>
  )
}

export default Feedbacks