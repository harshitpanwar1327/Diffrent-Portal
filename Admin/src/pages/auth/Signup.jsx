import React, {useState} from 'react'
import {toast, Bounce} from 'react-toastify'
import {FadeLoader} from 'react-spinners'
import API from '../../utils/API'
import {useNavigate, NavLink} from 'react-router-dom'
import {motion} from 'motion/react'

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if(password !== confirmPassword) {
      toast.error('Password and confirm password not match!', {
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
      return;
    }

    try {
      setLoading(true);

      const response = await API.post('/admin/register', {
        name,
        email,
        password
      });

      navigate('/login');

      toast.success('Registered successfully', {
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
      toast.error(error.response.data.message || 'User not registered!', {
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
      setLoading(false);
    }
  }

  return (
    <div className='auth-bg w-full h-full flex justify-center items-center'>
      {loading && (
        <div className="overlay">
          <FadeLoader color='rgba(255, 32, 86)'/>
        </div>
      )}
      <motion.form className='bg-white rounded-md py-6 px-12' onSubmit={handleRegister}
        initial={{opacity: 0, scale: 0}}
        animate={{opacity: 1, scale: 1}}
        transition={{type: 'spring', stiffness: 100, damping: 12, delay: 0.2}}
      >
        <h2 className='font-bold text-2xl mb-4 text-center'>Create Your Account</h2>
        <div className='flex flex-col mb-4'>
          <label htmlFor="name">Name</label>
          <input type="text" name='name' id='name' placeholder='Enter your name' className='rounded-lg border border-gray-300 py-2 px-4' value={name} onChange={(e)=>setName(e.target.value)}/>
        </div>
        <div className='flex flex-col mb-4'>
          <label htmlFor="email">Email</label>
          <input type="email" name='email' id='email' placeholder='Enter your email' className='rounded-lg border border-gray-300 py-2 px-4' value={email} onChange={(e)=>setEmail(e.target.value)} required/>
        </div>
        <div className='flex flex-col mb-4'>
          <label htmlFor="password">Password</label>
          <input type="password" name='password' id='password' placeholder='Enter your password' className='rounded-lg border border-gray-300 py-2 px-4' value={password} onChange={(e)=>setPassword(e.target.value)} required/>
        </div>
        <div className='flex flex-col mb-4'>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input type="password" name='confirm-password' id='confirm-password' placeholder='Confirm password' className='rounded-lg border border-gray-300 py-2 px-4' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required/>
        </div>
        <button className='text-white bg-rose-500 w-full'>Register</button>
        <p>Already have an account? <NavLink to='/login'>Sign in</NavLink></p>
      </motion.form>
    </div>
  )
}

export default Signup