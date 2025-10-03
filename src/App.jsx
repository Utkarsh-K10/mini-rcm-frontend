import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Auth/Login.jsx'
import Register from './components/Auth/Register.jsx'
import ClaimList from './components/Claims/ClaimList.jsx'
import ClaimDetails from './components/Claims/ClaimDetails.jsx'
import UploadClaimFile from './components/Claims/UploadClaimFile.jsx'
import Dashboard from './components/Analytics/Dashboard.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'  // Changed import
import ProtectedRoute from './components/Common/ProtectedRoute.jsx'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadClaimFile />} />
            <Route path="/claims" element={<ClaimList />} />
            <Route path="/claims/:claimId" element={<ClaimDetails />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
