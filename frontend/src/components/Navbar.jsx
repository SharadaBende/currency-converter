import { useAuth } from "../context/AuthContext"

export default function Navbar({ dark, setDark }) {
  const { user, logout } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl">💱</span>
        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">CurrencyX</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Dark mode toggle — icon only on mobile, text on desktop */}
        <button
          onClick={() => setDark(!dark)}
          className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 rounded-full text-sm font-medium hover:shadow transition flex items-center justify-center gap-1">
          <span>{dark ? "☀️" : "🌙"}</span>
          <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
        </button>

        {user && (
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-300 font-medium">
              👋 {user}
            </span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-medium transition">
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">👋</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}