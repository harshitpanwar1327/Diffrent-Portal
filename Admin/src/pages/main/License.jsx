import React, { useState } from 'react'
import NavigationBar from '../../components/NavigationBar'
import {toast, Bounce} from 'react-toastify'
import API from '../../utils/API'
import {FadeLoader} from 'react-spinners'

const License = () => {
  const [organization, setOrganization] = useState('');
  const [totalDevices, setTotalDevices] = useState(0);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [licenseCode, setLicenseCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateLicense = async (e) => {
    e.preventDefault();

    let loaderTimeout;

    try {
      loaderTimeout = setTimeout(() => setLoading(true), 1000);

      const licenseData = {
        organization,
        totalDevices,
        purchaseDate,
        expiryDate
      }

      const response = await API.post(`/license/generate`, licenseData);
      setLicenseCode(response.data.licenseCode);

      setOrganization('');
      setTotalDevices(0);
      setPurchaseDate('');
      setExpiryDate('');

      toast.success('License generated successfully', {
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
      toast.error('License not generated!', {
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

  const handleCopyToClipboard = () => {
    if (!licenseCode) return;

    navigator.clipboard.writeText(licenseCode)
      .then(() => {
        toast.success('License code copied to clipboard!', {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          theme: "colored",
          transition: Bounce,
        });
      })
      .catch(err => {
        console.error('Copy failed', err);
        toast.error('Failed to copy license code', {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          theme: "colored",
          transition: Bounce,
        });
      });
  };

  return (
    <div className='flex flex-col w-full h-full'>
      {loading && (
        <div className="overlay">
          <FadeLoader color='rgba(255, 32, 86)'/>
        </div>
      )}
      <NavigationBar heading='Generate License' />
      <div className='grow p-2 grid grid-cols-1 lg:grid-cols-3 grid-rows-2 lg:grid-rows-1 gap-8'>
        <form className='col-span-1 border border-gray-300 rounded-md flex flex-col justify-center gap-5 p-4' onSubmit={handleGenerateLicense}>
          <h2 className='text-xl font-semibold text-center'>License Details</h2>
          <div className='flex flex-col'>
            <label htmlFor="organization" className='text-sm'>Organization Name</label>
            <input type="text" name='organization' id='organization' placeholder='Enter organization name' value={organization} onChange={(e)=>setOrganization(e.target.value)} className='border border-gray-300 rounded-xl p-2' required/>
          </div>
          <div className='flex flex-col'>
            <label htmlFor="totalDevices" className='text-sm'>Device Count</label>
            <input type="number" name='totalDevices' id='totalDevices' placeholder='Enter device count' value={totalDevices} onChange={(e)=>setTotalDevices(e.target.value)} className='border border-gray-300 rounded-xl p-2' required/>
          </div>
          <div className='flex flex-col'>
            <label htmlFor="purchaseDate" className='text-sm'>Purchase Date</label>
            <input type="date" name="purchaseDate" id="purchaseDate" value={purchaseDate} onChange={(e)=>setPurchaseDate(e.target.value)} className='border border-gray-300 rounded-xl p-2' required/>
          </div>
          <div className='flex flex-col'>
            <label htmlFor="expiryDate" className='text-sm'>Expiry Date</label>
            <input type="date" name="expiryDate" id="expiryDate" value={expiryDate} onChange={(e)=>setExpiryDate(e.target.value)} className='border border-gray-300 rounded-xl p-2' required/>
          </div>
          <button className='bg-blue-500 hover:bg-blue-600 text-white'>Generate</button>
        </form>

        <div className='col-span-1 lg:col-span-2 flex justify-center items-start lg:items-center'>
          <div className='bg-gray-400 text-white rounded p-4 w-full md:w-2/3'>
            <p className='font-semibold text-xl mb-4'>License Code</p>
            <p className='border border-dashed p-2 overflow-auto no-scrollbar'>{licenseCode || 'Click Generate to get a license key'}</p>
            <button className='!border-white !p-2 mt-4' onClick={handleCopyToClipboard}>Copy to clipboard</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default License