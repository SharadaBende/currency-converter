import { useAuth } from "../context/AuthContext"

export default function Navbar({ dark, setDark }) {
  const { user, logout } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl">💱</span>
        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">CurrencyX</span>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => setDark(!dark)}
          className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-1.5 rounded-full text-sm font-medium hover:shadow transition">
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>

        {user && (
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-300 font-medium">
              👋 {user}
            </span>
            <button onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-medium transition">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}