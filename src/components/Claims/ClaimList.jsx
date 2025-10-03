import React, { useState, useEffect, useContext } from 'react'
import { Link, useSearchParams, useNavigate} from 'react-router-dom'
import api from '../../api/api.jsx'
import { AuthContext } from '../../context/AuthContext.jsx'

const ClaimList = () => {
    const { token, logout } = useContext(AuthContext)
    const [searchParams] = useSearchParams()
    const batchId = searchParams.get('batch_id')
    const [claims, setClaims] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (batchId) {
            fetchClaims(batchId)
        }
    }, [batchId])

    const fetchClaims = async (batch_id) => {
        setLoading(true)
        setError(null)
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await api.get(`/claims/batch/${batch_id}`, config)
            setClaims(response.data)
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to fetch claims')
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status) => {
        return status === 'Validated' ? 'text-green-600' : 'text-red-600'
    }

    const getErrorTypeBadge = (errorType) => {
        const colors = {
            'None': 'bg-green-100 text-green-800',
            'Technical': 'bg-yellow-100 text-yellow-800',
            'Medical': 'bg-orange-100 text-orange-800',
            'Both': 'bg-red-100 text-red-800'
        }
        return colors[errorType] || 'bg-gray-100 text-gray-800'
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(`/?batch_id=${batchId || ''}`)}
                        className="px-3 py-2 rounded border hover:bg-gray-100"
                    >
                        ← Back
                    </button>
                    <h2 className="text-2xl font-bold">Claims List</h2>
                </div>
                <div className="space-x-4">
                    <Link to="/upload" className="bg-blue-600 text-white px-4 py-2 rounded">
                        Upload New Batch
                    </Link>
                    <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded">
                        Logout
                    </button>
                </div>
            </div>

            {!batchId && (
                <div className="bg-yellow-100 p-4 rounded mb-4">
                    No batch ID provided. Please upload a file or select a batch from the dashboard.
                </div>
            )}

            {loading && <div className="text-center py-8">Loading claims...</div>}
            {error && <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{error}</div>}

            {claims.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">Claim ID</th>
                                <th className="border p-2">Service Code</th>
                                <th className="border p-2">Encounter Type</th>
                                <th className="border p-2">Amount (AED)</th>
                                <th className="border p-2">Status</th>
                                <th className="border p-2">Error Type</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {claims.map((claim) => (
                                <tr key={claim.id} className="hover:bg-gray-50">
                                    <td className="border p-2">{claim.claim_id}</td>
                                    <td className="border p-2">{claim.service_code}</td>
                                    <td className="border p-2">{claim.encounter_type}</td>
                                    <td className="border p-2 text-right">{claim.paid_amount_aed?.toFixed(2)}</td>
                                    <td className={`border p-2 font-semibold ${getStatusColor(claim.status)}`}>
                                        {claim.status}
                                    </td>
                                    <td className="border p-2">
                                        <span className={`px-2 py-1 rounded text-xs ${getErrorTypeBadge(claim.error_type)}`}>
                                            {claim.error_type}
                                        </span>
                                    </td>
                                    <td className="border p-2">
                                        <Link
                                            to={`/claims/${claim.claim_id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && !error && claims.length === 0 && batchId && (
                <div className="text-center py-8 text-gray-500">
                    No claims found for this batch.
                </div>
            )}
        </div>
    )
}

export default ClaimList
