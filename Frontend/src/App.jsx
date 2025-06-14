import './App.css'
import NavigationBar from './components/NavigationBar'
import Login from './pages/authentication/Login.jsx'
import HealthStatus from './pages/main/HealthStatus.jsx'
import LicenseManagement from './pages/main/LicenseManagement.jsx'
import ConfigPM from './pages/main/ConfigPM.jsx'
import PolicyDbs from './pages/main/PolicyDbs.jsx'
import Support from './pages/main/Support.jsx'
import Dashboard from './pages/main/Dashboard.jsx'
import AddPolicy from './pages/main/policyDBS/AddPolicy.jsx'
import AddConfig from './pages/main/configPM/AddConfig.jsx'
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
          <Route path='/config-pm' element={<ConfigPM />} />
          <Route path='/policy-dbs' element={<PolicyDbs />} />
          <Route path='/support' element={<Support />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/devices' element={<DeviceManagement />} />
          <Route path='/add-policy/:groupID' element={<AddPolicy />} />
          <Route path='/add-config/:groupID' element={<AddConfig />} />
        </Route>

        {/* Catch-all Route */}
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;