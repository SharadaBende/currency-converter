import { createContext, useContext, useState } from "react"
import axios from "axios"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token") || null)

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  }

  const login = async (username, password) => {
    const formData = new FormData()
    formData.append("username", username)
    formData.append("password", password)

    const res = await axios.post("http://localhost:8000/api/auth/login", formData)
    const accessToken = res.data.access_token
    setToken(accessToken)
    localStorage.setItem("token", accessToken)
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`
    setUser(username)
  }

  const signup = async (username, email, password) => {
    await axios.post("http://localhost:8000/api/auth/signup", {
      username,
      email,
      password
    })
    await login(username, password)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
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