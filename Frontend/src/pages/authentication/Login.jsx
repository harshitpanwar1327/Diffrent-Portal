import React ,{ useState }from 'react'
import './login.css'
import { useNavigate } from 'react-router-dom'
import { Bounce, toast } from 'react-toastify'
import HashLoader from "react-spinners/HashLoader"
import API from '../../util/Api.js'

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
      let token = response.data.data;
      sessionStorage.setItem("AuthToken", token);
      sessionStorage.setItem("isAuthenticated", true);

      toast.success('Login Successfully', {
        position: "top-center",
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce
      });
      navigate("/dashboard");
    }catch(err){
      console.log(err);
      toast.error('Something went wrong! Please try again.', {
        position: "top-center",
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        });
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className='authenticationPage'>
      {loading && <div className="loader">
        <HashLoader color="#6F5FE7"/>
      </div>}
      <div className="auth-formSection">
        <form className='authenticationForm' onSubmit={handleLogin}>
          <h2 className='authenticationHeading'>Login</h2>
          <input type="email" name="email" id="email" placeholder='Email' className='authenticationInput' value={email} onChange={(e)=> setEmail(e.target.value)} required/>
          <input type="password" name="password" id="password" placeholder='Password' className='authenticationInput' value={password} onChange={(e)=> setPassword(e.target.value)} required/>
          <button className='authButton'>Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login