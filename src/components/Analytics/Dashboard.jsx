import React, { useState, useEffect, useContext } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../../api/api'
import { AuthContext } from '../../context/AuthContext'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    BarElement,
    ArcElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js'

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend)

const Dashboard = () => {
    const { token, logout } = useContext(AuthContext)
    const [searchParams] = useSearchParams()
    const [metrics, setMetrics] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Get batch_id from URL query params
    const batchId = searchParams.get('batch_id')

    useEffect(() => {
        if (batchId) {
            fetchMetrics(batchId)
        }
    }, [batchId])

    const fetchMetrics = async (batch_id) => {
        setLoading(true)
        setError(null)
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            }
            const response = await api.get(`/metrics/batch/${batch_id}`, config)
            setMetrics(response.data)
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to fetch metrics')
            console.error('Failed to fetch metrics:', err)
        } finally {
            setLoading(false)
        }
    }
    const errorLabels = metrics ? Object.keys(metrics.error_breakdown || {}) : []
    const errorCounts = metrics ? Object.values(metrics.error_breakdown || {}) : []
    const amountLabels = metrics ? Object.keys(metrics.amount_breakdown || {}) : []
    const amountValues = metrics ? Object.values(metrics.amount_breakdown || {}) : []
    const countData = {
        labels: errorLabels,
        datasets: [
            {
                label: 'Error Count',
                data: errorCounts,
                backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#06b6d4'],
                borderWidth: 0,
            },
        ],
    }
    const amountData = {
        labels: amountLabels,
        datasets: [
            {
                label: 'Error Amount (AED)',
                data: amountValues,
                backgroundColor: ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#06b6d4'],
                borderWidth: 0,
            },
        ],
    }

    const barOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y}` } },
        },
        scales: {
            x: { ticks: { color: '#374151' } },
            y: { ticks: { color: '#374151' }, beginAtZero: true },
        },
    }

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' },
            tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed} AED` } },
        },
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">RCM Validation Dashboard</h1>
                <div className="space-x-4">
                    <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                        Logout
                    </button>
                </div>
            </div>

            {!batchId && !loading && (
                <div className="bg-blue-50 p-6 rounded mb-6">
                    <h2 className="text-xl font-semibold mb-2">Welcome to RCM Validation Engine</h2>
                    <p className="text-gray-700 mb-4">
                        Upload a claims file to begin validation and view analytics.
                    </p>
                    <Link to="/upload" className="bg-blue-600 text-white px-6 py-3 rounded inline-block hover:bg-blue-700">
                        Get Started - Upload Claims
                    </Link>
                </div>
            )}

            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading metrics...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-100 text-red-800 p-4 rounded mb-6">
                    {error}
                </div>
            )}

            {metrics && !loading && (
                <>
                    <div className="mb-4 text-sm text-gray-600">
                        Batch ID: <span className="font-mono font-semibold">{batchId}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-gray-600 text-sm">Total Claims</h3>
                            <p className="text-3xl font-bold">{metrics.total_claims}</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg shadow">
                            <h3 className="text-gray-600 text-sm">Validated</h3>
                            <p className="text-3xl font-bold text-green-600">{metrics.validated_claims}</p>
                        </div>
                        <div className="bg-red-50 p-6 rounded-lg shadow">
                            <h3 className="text-gray-600 text-sm">Errors</h3>
                            <p className="text-3xl font-bold text-red-600">{metrics.error_claims}</p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-lg shadow">
                            <h3 className="text-gray-600 text-sm">Total Amount</h3>
                            <p className="text-3xl font-bold text-blue-600">
                                {metrics.total_amount?.toFixed(2)} AED
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold mb-4">Error Breakdown (Claim Count By Error)</h3>
                            {errorLabels.length ? (
                                <Bar data={countData} options={barOptions} />
                            ) : (
                                <div className="text-gray-500">No error data</div>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold mb-4">Error Breakdown (Paid Amount by Category)</h3>
                            {amountLabels.length ? (
                                <Doughnut data={amountData} options={doughnutOptions} />
                            ) : (
                                <div className="text-gray-500">No amount data</div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow flex space-x-4">
                        <Link
                            to={`/claims?batch_id=${batchId}`}
                            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                        >
                            View All Claims
                        </Link>
                        <Link
                            to="/upload"
                            className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700"
                        >
                            Upload New Batch
                        </Link>
                    </div>
                </>
            )}
        </div>
    )
}

export default Dashboard
