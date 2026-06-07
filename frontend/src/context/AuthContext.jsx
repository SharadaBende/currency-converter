import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token") || null)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      const savedUser = localStorage.getItem("username")
      if (savedUser) setUser(savedUser)
    } else {
      delete axios.defaults.headers.common["Authorization"]
    }
  }, [token])

  // Intercept 401s and silently refresh the access token
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          const refreshToken = localStorage.getItem("refresh_token")
          if (refreshToken) {
            try {
              const res = await axios.post("http://localhost:8000/api/auth/refresh", {
                refresh_token: refreshToken
              })
              const newToken = res.data.access_token
              setToken(newToken)
              localStorage.setItem("token", newToken)
              axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`
              return axios(originalRequest)
            } catch {
              // Refresh token also expired — log out
              logout()
            }
          } else {
            logout()
          }
        }
        return Promise.reject(error)
      }
    )
    return () => axios.interceptors.response.eject(interceptor)
  }, [])

  const login = async (username, password) => {
    const formData = new FormData()
    formData.append("username", username)
    formData.append("password", password)

    const res = await axios.post("http://localhost:8000/api/auth/login", formData)
    const { access_token, refresh_token } = res.data
    setToken(access_token)
    setUser(username)
    localStorage.setItem("token", access_token)
    localStorage.setItem("refresh_token", refresh_token)
    localStorage.setItem("username", username)
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`
  }

  const signup = async (username, email, password) => {
    await axios.post("http://localhost:8000/api/auth/signup", { username, email, password })
    await login(username, password)
  }

  const logout = () => {
    const refreshToken = localStorage.getItem("refresh_token")
    if (refreshToken) {
      axios.post("http://localhost:8000/api/auth/logout", { refresh_token: refreshToken }).catch(() => {})
    }
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("username")
    delete axios.defaults.headers.common["Authorization"]
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}