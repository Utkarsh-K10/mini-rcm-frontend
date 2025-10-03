import React, { useContext, useState } from 'react'
import api from '../../api/api'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const UploadClaimFile = () => {
    const { token } = useContext(AuthContext)
    const [file, setFile] = useState(null)
    // const [technicalRules, setTechnicalRules] = useState(null)
    // const [medicalRules, setMedicalRules] = useState(null)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
        setMessage('') // Clear previous messages
    }

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file')
            return
        }

        setLoading(true)
        setMessage('')

        const formData = new FormData()
        formData.append('claims_file', file)
        // if (technicalRules) {
        //     formData.append('technical_rules', technicalRules)
        // }

        // if (medicalRules) {
        //     formData.append('medical_rules', medicalRules)
        // }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            }
            const response = await api.post('/upload/claims', formData, config)
            setMessage('File uploaded and processing started successfully')
            // Redirect to dashboard with batch_id
            navigate(`/?batch_id=${response.data.batch_id}`)
        } catch (err) {
            setMessage(err.response?.data?.detail || 'Upload failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 border rounded-lg shadow-lg bg-white">
            <h2 className="text-2xl font-bold mb-6">Upload Claims File</h2>
            <div className="space-y-4">

                <div className="mb-6">
                    <label className="block mb-2 font-semibold text-gray-700">
                        Select Claims File (Excel or CSV)
                    </label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".xlsx,.csv"
                        className="w-full p-2 border rounded"
                        disabled={loading}
                    />
                </div>
                {/* <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                        Technical Rules PDF (Optional)
                    </label>
                    <input
                        type="file"
                        onChange={e => setTechnicalRules(e.target.files[0])}
                        accept=".pdf"
                        className="w-full p-2 border rounded"
                        disabled={loading}
                    />
                </div>
                <div className="mt-4">
                    <label className="block mb-2 font-semibold text-gray-700">
                        Medical Rules PDF (Optional)
                    </label>
                    <input
                        type="file"
                        onChange={e => setMedicalRules(e.target.files[0])}
                        accept=".pdf"
                        className="w-full p-2 border rounded"
                        disabled={loading}
                    />
                </div> */}
            </div>

            <button
                onClick={handleUpload}
                disabled={loading || !file}
                className={`w-full p-3 rounded font-semibold text-white ${loading || !file
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                    }`}
            >
                {loading ? 'Uploading...' : 'Upload and Process'}
            </button>

            {message && (
                <div className={`mt-4 p-3 rounded ${message.includes('failed') || message.includes('error')
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                    }`}>
                    {message}
                </div>
            )}

            <div className="mt-6 text-sm text-gray-600">
                <p className="font-semibold mb-2">Required columns:</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>claim_id or claimid</li>
                    <li>encounter_type</li>
                    <li>service_date</li>
                    <li>national_id</li>
                    <li>member_id</li>
                    <li>facility_id</li>
                    <li>unique_id</li>
                    <li>diagnosis_codes</li>
                    <li>service_code</li>
                    <li>paid_amount_aed</li>
                </ul>
            </div>
        </div>
    )
}

export default UploadClaimFile
