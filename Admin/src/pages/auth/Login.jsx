import React, {useState} from 'react'
import {toast, Bounce} from 'react-toastify'
import {FadeLoader} from 'react-spinners'
import API from '../../utils/API'
import {useNavigate} from 'react-router-dom'

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

      toast.success('Login successfull', {
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
      toast.error(error.response.data.message || 'User not logged in!', {
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
      <form className='bg-white rounded-md py-4 px-8' onSubmit={handleSignIn}>
        <h2 className='font-bold text-2xl mb-4 text-center'>Welcome Back!</h2>
        <div className='flex flex-col mb-4'>
          <label htmlFor="email">Email</label>
          <input type="email" name='email' id='email' placeholder='Enter your email' className='rounded-lg border border-gray-300 py-2 px-4' value={email} onChange={(e)=>setEmail(e.target.value)} required/>
        </div>
        <div className='flex flex-col mb-4'>
          <label htmlFor="password">Password</label>
          <input type="password" name='password' id='password' placeholder='Enter your password' className='rounded-lg border border-gray-300 py-2 px-4' value={password} onChange={(e)=>setPassword(e.target.value)} required/>
        </div>
        <button className='text-white !bg-rose-500 w-full'>Sign in</button>
      </form>
    </div>
  )
}

export default Login