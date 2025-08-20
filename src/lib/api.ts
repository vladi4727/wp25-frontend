import axios from 'axios'
import router from '@/router'

// Axios instance configured with API base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
})

// Attach JWT token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redirect to login on unauthorized responses
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      router.push('/')
    }
    return Promise.reject(err)
  },
)

export default api
