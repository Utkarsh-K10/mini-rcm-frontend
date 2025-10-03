import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/api.jsx'
import { AuthContext } from '../../context/AuthContext.jsx'

const ClaimDetails = () => {
    const { claimId } = useParams()
    const { token } = useContext(AuthContext)
    const navigate = useNavigate()
    const [claim, setClaim] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchClaimDetails()
    }, [claimId])

    const fetchClaimDetails = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await api.get(`/claims/${claimId}`, config)
            setClaim(response.data)
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to fetch claim details')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="text-center py-8">Loading claim details...</div>
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>
    if (!claim) return <div className="text-center py-8">Claim not found</div>

    return (
        <div className="max-w-4xl mx-auto p-6">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-600 hover:underline"
            >
                ← Back to Claims
            </button>

            <div className="bg-white border rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Claim Details</h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="font-semibold text-gray-600">Claim ID:</label>
                        <p className="text-lg">{claim.claim_id}</p>
                    </div>
                    <div>
                        <label className="font-semibold text-gray-600">Batch ID:</label>
                        <p className="text-lg">{claim.batch_id}</p>
                    </div>
                    <div>
                        <label className="font-semibold text-gray-600">Status:</label>
                        <p className={`text-lg font-semibold ${claim.status === 'Validated' ? 'text-green-600' : 'text-red-600'}`}>
                            {claim.status}
                        </p>
                    </div>
                    <div>
                        <label className="font-semibold text-gray-600">Error Type:</label>
                        <p className="text-lg">{claim.error_type}</p>
                    </div>
                </div>

                <div className="border-t pt-4 mb-6">
                    <h3 className="text-xl font-semibold mb-3">Patient Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-gray-600">National ID:</label>
                            <p>{claim.national_id}</p>
                        </div>
                        <div>
                            <label className="text-gray-600">Member ID:</label>
                            <p>{claim.member_id}</p>
                        </div>
                        <div>
                            <label className="text-gray-600">Unique ID:</label>
                            <p>{claim.unique_id}</p>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-4 mb-6">
                    <h3 className="text-xl font-semibold mb-3">Service Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-gray-600">Encounter Type:</label>
                            <p>{claim.encounter_type}</p>
                        </div>
                        <div>
                            <label className="text-gray-600">Service Date:</label>
                            <p>{claim.service_date}</p>
                        </div>
                        <div>
                            <label className="text-gray-600">Service Code:</label>
                            <p>{claim.service_code}</p>
                        </div>
                        <div>
                            <label className="text-gray-600">Facility ID:</label>
                            <p>{claim.facility_id}</p>
                        </div>
                        <div>
                            <label className="text-gray-600">Diagnosis Codes:</label>
                            <p>{claim.diagnosis_codes}</p>
                        </div>
                        <div>
                            <label className="text-gray-600">Paid Amount (AED):</label>
                            <p className="font-semibold">{claim.paid_amount_aed?.toFixed(2)}</p>
                        </div>
                        <div>
                            <label className="text-gray-600">Approval Number:</label>
                            <p>{claim.approval_number || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {claim.error_explanation && (
                    <div className="border-t pt-4 mb-6">
                        <h3 className="text-xl font-semibold mb-3 text-red-600">Error Explanation</h3>
                        <div className="bg-red-50 p-4 rounded">
                            <p>{claim.error_explanation}</p>
                        </div>
                    </div>
                )}

                {claim.recommended_action && (
                    <div className="border-t pt-4">
                        <h3 className="text-xl font-semibold mb-3 text-blue-600">Recommended Action</h3>
                        <div className="bg-blue-50 p-4 rounded">
                            <p>{claim.recommended_action}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ClaimDetails
