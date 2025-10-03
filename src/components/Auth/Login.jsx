import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { setToken } from '../../api/api.jsx'
import { AuthContext } from '../../context/AuthContext.jsx'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const { setToken: setAuthToken } = useContext(AuthContext)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await api.post('/auth/login', { username, password })
            setToken(res.data.access_token)
            setAuthToken(res.data.access_token)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed')
        }
    }

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Login</h2>
            {error && <div className="mb-4 text-red-600">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="w-full border p-2"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required />
                <input
                    className="w-full border p-2"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required />
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login
