import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await login(form.username, form.password)
      navigate("/dashboard")
    } catch (err) {
      setError("Invalid username or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8 w-full max-w-md">
      <h1 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">Login</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Username</label>
          <input type="text" value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            placeholder="Enter username" required
            className="w-full border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Password</label>
            <button type="button"
              className="text-xs text-blue-500 hover:underline"
              onClick={() => alert("Password reset coming soon!")}>
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Enter password" required
              className="w-full border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-blue-500 transition" />
            <button type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-lg transition disabled:opacity-50">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}