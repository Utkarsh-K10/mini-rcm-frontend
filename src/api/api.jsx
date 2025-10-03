// import axios from "axios";

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL,
// });

// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem("access_token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// export async function login(credentials) {
//     return api.post("/auth/login", credentials);
// }

// export async function register(user) {
//     return api.post("/auth/register", user);
// }

// export async function logout() {
//     return api.post("/auth/logout");
// }

// export async function uploadClaims(formData) {
//     return api.post("/upload/claims", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//     });
// }

// export async function getBatchClaims(batchId, params) {
//     return api.get(`/claims/batch/${batchId}`, { params });
// }

// export async function getClaimDetails(claimId) {
//     return api.get(`/claims/${claimId}`);
// }

// export async function getBatchMetrics(batchId) {
//     return api.get(`/metrics/batch/${batchId}`);
// }

// export async function getJobStatus(batchId) {
//     return api.get(`/upload/status/${batchId}`);
// }

import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
    baseURL: API_BASE,
})

export const setToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
}

export const clearToken = () => {
    delete api.defaults.headers.common['Authorization']
}

export default api
