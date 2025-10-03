import React, { useState, useEffect, useContext } from 'react'
import api from '../../api/api'
import { AuthContext } from '../../context/AuthContext'

const ProcessingSteps = ({ batchId }) => {
    const { token } = useContext(AuthContext)
    const [steps, setSteps] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (batchId) {
            fetchSteps()
            const interval = setInterval(fetchSteps, 3000) // Poll every 3 seconds
            return () => clearInterval(interval)
        }
    }, [batchId])

    const fetchSteps = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await api.get(`/status/batch/${batchId}`, config)
            setSteps(response.data)
            setLoading(false)
        } catch (err) {
            console.error('Failed to fetch steps:', err)
            setLoading(false)
        }
    }

    const getStepIcon = (status) => {
        switch (status) {
            case 'completed':
                return '✓'
            case 'in_progress':
                return '⟳'
            case 'failed':
                return '✗'
            case 'skipped':
                return '−'
            default:
                return '○'
        }
    }

    const getStepColor = (status) => {
        switch (status) {
            case 'completed':
                return 'text-green-600 bg-green-50'
            case 'in_progress':
                return 'text-blue-600 bg-blue-50'
            case 'failed':
                return 'text-red-600 bg-red-50'
            case 'skipped':
                return 'text-gray-400 bg-gray-50'
            default:
                return 'text-gray-400 bg-gray-50'
        }
    }

    if (loading) return null

    return (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-xl font-semibold mb-4">Processing Steps</h3>
            <div className="space-y-3">
                {steps.map((step, index) => (
                    <div key={index} className={`flex items-center p-3 rounded ${getStepColor(step.status)}`}>
                        <span className="text-2xl mr-3">{getStepIcon(step.status)}</span>
                        <div className="flex-1">
                            <div className="font-semibold">{step.step_name}</div>
                            <div className="text-sm">{step.message}</div>
                        </div>
                        <span className="text-xs uppercase font-semibold">{step.status}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProcessingSteps
