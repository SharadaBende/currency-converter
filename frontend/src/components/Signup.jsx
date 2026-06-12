import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    setLoading(true)
    setError("")
    try {
      await signup(form.username, form.email, form.password)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8 w-full max-w-md">
      <h1 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">Sign Up</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Username</label>
          <input type="text" value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            placeholder="Enter username" required
            className="w-full border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email</label>
          <input type="email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="Enter email" required
            className="w-full border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Min 6 characters" required
              className="w-full border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-blue-500 transition" />
            <button type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Re-enter password" required
              className="w-full border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-blue-500 transition" />
            <button type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">
              {showConfirm ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-lg transition disabled:opacity-50">
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          Login
        </Link>
      </p>
    </div>
  )
}