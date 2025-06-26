import React from 'react'

const ViewScreenshot = ({setOpenImage, screenshot}) => {
  return (
    <div className='fixed top-0 left-0 w-screen h-screen bg-[#0000003a] z-100 flex justify-center items-center' onClick={()=>setOpenImage(false)}>
        <img src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${screenshot}`} alt="screenshot" className='max-w-2/3 max-h-2/3 object-cover rounded border' onClick={(e)=>e.stopPropagation()}/>
    </div>
  )
}

export default ViewScreenshot