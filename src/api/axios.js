import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach auth token from localStorage if present
apiClient.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user')
    if (user) {
      const parsed = JSON.parse(user)
      // json-server doesn't require auth headers, but we attach the user id
      // for potential future middleware / custom server use
      config.headers['X-User-Id'] = parsed.id
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor — unified error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      console.warn('Accès non autorisé — redirection vers /login')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default apiClient
