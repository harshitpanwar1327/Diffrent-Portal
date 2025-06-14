import './App.css'
import NavigationBar from './components/NavigationBar'
import Login from './pages/authentication/Login.jsx'
import HealthStatus from './pages/main/HealthStatus.jsx'
import LicenseManagement from './pages/main/LicenseManagement.jsx'
import DeviceScreenSecurity from './pages/main/DeviceScreenSecurity.jsx'
import Support from './pages/main/Support.jsx'
import Dashboard from './pages/main/Dashboard.jsx'
import ManagePolicy from './pages/main/deviceScreenSecurity/ManagePolicy.jsx'
import ManageConfig from './pages/main/deviceScreenSecurity/ManageConfig.jsx'
import DeviceManagement from './pages/main/Devices.jsx'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoutes.jsx'

function App() {
  const location = useLocation();
  const hideNavigationBar = ['/', '/login'];

  let isAuthenticated = sessionStorage.getItem('isAuthenticated');

  return (
    <>
      {!hideNavigationBar.includes(location.pathname) && <NavigationBar />}

      <Routes>
        {/* Public Routes */}
        <Route path='/' element={isAuthenticated === "true" ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path='/login' element={isAuthenticated === "true" ? <Navigate to="/dashboard" /> : <Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path='/health-status' element={<HealthStatus />} />
          <Route path='/license-management' element={<LicenseManagement />} />
          <Route path='/device-screen-security' element={<DeviceScreenSecurity />} />
          <Route path='/support' element={<Support />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/devices' element={<DeviceManagement />} />
          <Route path='/manage-policy/:groupID' element={<ManagePolicy />} />
          <Route path='/manage-config/:groupID' element={<ManageConfig />} />
        </Route>

        {/* Catch-all Route */}
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;