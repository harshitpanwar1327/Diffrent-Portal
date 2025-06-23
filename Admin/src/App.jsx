import './App.css'
import {Routes, Route, Navigate, useLocation} from 'react-router-dom'
import ProtectedRoutes from './components/ProtectedRoutes'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Users from './pages/main/Users'
import License from './pages/main/License'
import Feedbacks from './pages/main/Feedbacks'

function App() {
  const location = useLocation();
  
  let isAuthenticated = sessionStorage.getItem('isAuthenticated');

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={isAuthenticated === "true" ? <Navigate to='/users' /> : <Login />}/>
        <Route path='/login' element={isAuthenticated === "true" ? <Navigate to='/users' /> : <Login />}/>
        <Route path='/signup' element={isAuthenticated === "true" ? <Navigate to='/users' /> : <Signup />}/>

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path='/users' element={<Users />}/>
          <Route path='/license' element={<License />}/>
          <Route path='/feedbacks' element={<Feedbacks />}/>
        </Route>

        <Route path='*' element={<Navigate to='/' />}/>
      </Routes>
    </>
  )
}

export default App
