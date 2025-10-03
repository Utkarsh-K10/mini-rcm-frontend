import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext.jsx'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
    const { token } = useContext(AuthContext)
    return token ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoute
