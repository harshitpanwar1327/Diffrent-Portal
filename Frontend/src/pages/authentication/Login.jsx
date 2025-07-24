import React ,{ useState }from 'react'
import './login.css'
import { useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'
import HashLoader from "react-spinners/HashLoader"
import API from '../../util/Api.js'
import AuthImage from '../../assets/AuthImage.png'
import Eye from '../../assets/Eye.png'
import {motion} from 'motion/react'

const Login = () => {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  const handleLogin = async (e)=>{
    e.preventDefault();

    let userData = {
      email: email,
      password: password
    }

    try{
      setLoading(true);
      let response = await API.post("/users/login", userData);
      let token = response.data.token;
      let userId = response.data.userId;
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("AuthToken", token);
      sessionStorage.setItem("isAuthenticated", true);

      toast.success('Login Successfully');
      navigate("/dashboard");
    }catch(error){
      console.log(error);
      toast.error(error.response?.data?.message || 'Unable to login!');
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className='auth-page'>
      {loading && <div className="loader">
        <HashLoader color="#6F5FE7"/>
      </div>}
      <div className="auth-form-section">
        <motion.div className='product-branding'
          initial={{opacity: 0, x: -100}}
          animate={{opacity: 1, x: 0}}
          transition={{type: 'spring', stiffness: 100, damping: 10, delay: 0.2}}
        >
          <img src={Eye} alt="Eye Icon" height={50}/>
          <h2>DIFꟻRENT</h2>
        </motion.div>
        <form className='auth-form' onSubmit={handleLogin}>
          <motion.h2 className='auth-heading'
            initial={{opacity: 0, y: 100}}
            animate={{opacity: 1, y: 0}}
            transition={{type: 'spring', stiffness: 100, damping: 12, delay: 0.4}}
          >
            Welocme Back!
          </motion.h2>
          <motion.p className='auth-subheading'
            initial={{opacity: 0, y: 100}}
            animate={{opacity: 1, y: 0}}
            transition={{type: 'spring', stiffness: 100, damping: 10, delay: 0.6}}
          >
            Please enter login details below
          </motion.p>
          <motion.input type="email" name="email" id="email" placeholder='Email' className='auth-input' value={email} onChange={(e)=> setEmail(e.target.value)} required
            initial={{opacity: 0, y: 100}}
            animate={{opacity: 1, y: 0}}
            transition={{type: 'spring', stiffness: 100, damping: 12, delay: 0.8}}
          />
          <motion.input type="password" name="password" id="password" placeholder='Password' className='auth-input' value={password} onChange={(e)=> setPassword(e.target.value)} required
            initial={{opacity: 0, y: 100}}
            animate={{opacity: 1, y: 0}}
            transition={{type: 'spring', stiffness: 100, damping: 12, delay: 1}}
          />
          <motion.button className='auth-button'
            initial={{opacity: 0, y: 100}}
            animate={{opacity: 1, y: 0}}
            transition={{type: 'spring', stiffness: 100, damping: 12, delay: 1.2}}
          >
            Login
          </motion.button>
        </form>
      </div>
      
      <motion.div className='auth-image'
        initial={{opacity: 0, x: 200}}
        animate={{opacity: 1, x: 0}}
        transition={{type: 'spring', stiffness: 100, damping: 10, delay: 0.4}}
      >
        <img src={AuthImage} alt="Auth Image" height={350}/>
        <h2>Welcome to Your Secure Workspace</h2>
        <p className='auth-image-subheading'>Access Protection Mark and DBS — your all-in-one tools for security and control.</p>
      </motion.div>
    </div>
  )
}

export default Login