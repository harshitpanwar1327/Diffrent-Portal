import React, {useState} from 'react'
import {toast} from 'react-toastify'
import {FadeLoader} from 'react-spinners'
import API from '../../utils/API'
import {useNavigate, NavLink} from 'react-router-dom'
import {motion} from 'motion/react'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await API.post('/admin/login', {
        email,
        password
      });

      const token = response.data.token;

      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('isAuthenticated', true);

      navigate('/users');

      toast.success('Logged in successfully');
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || 'User not logged in!');
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
      <motion.form className='bg-white rounded-md py-6 px-12' onSubmit={handleSignIn}
        initial={{opacity: 0, scale: 0}}
        animate={{opacity: 1, scale: 1}}
        transition={{type: 'spring', stiffness: 100, damping: 12, delay: 0.2}}
      >
        <h2 className='font-bold text-2xl mb-4 text-center'>Welcome Back!</h2>
        <div className='flex flex-col mb-4'>
          <label htmlFor="email">Email</label>
          <input type="email" name='email' id='email' placeholder='Enter your email' className='rounded-lg border border-gray-300 py-2 px-4' value={email} onChange={(e)=>setEmail(e.target.value)} required/>
        </div>
        <div className='flex flex-col mb-4'>
          <label htmlFor="password">Password</label>
          <input type="password" name='password' id='password' placeholder='Enter your password' className='rounded-lg border border-gray-300 py-2 px-4' value={password} onChange={(e)=>setPassword(e.target.value)} required/>
        </div>
        <button className='text-white bg-rose-500 w-full'>Sign in</button>
        <p>Don't have an account? <NavLink to='/signup'>Sign up</NavLink></p>
      </motion.form>
    </div>
  )
}

export default Login