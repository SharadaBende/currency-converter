import { useState } from "react"
import { AuthProvider, useAuth } from "./context/AuthContext"
import ConverterForm from "./components/ConverterForm"
import ConversionHistory from "./components/ConversionHistory"
import RateChart from "./components/RateChart"
import MultiConverter from "./components/MultiConverter"
import Login from "./components/Login"
import Signup from "./components/Signup"

function MainApp() {
  const { user, token, logout } = useAuth()
  const [refresh, setRefresh] = useState(0)
  const [dark, setDark] = useState(false)
  const [currencies, setCurrencies] = useState({ from: "USD", to: "INR" })
  const [showSignup, setShowSignup] = useState(false)

  const handleConversion = (from, to) => {
    setRefresh(prev => prev + 1)
    setCurrencies({ from, to })
  }

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4 py-10 transition-colors duration-300">

        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => setDark(!dark)}
            className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-full shadow hover:shadow-md transition text-sm font-medium">
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
          {token && (
            <button onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-full shadow hover:shadow-md transition text-sm font-medium">
              Logout
            </button>
          )}
        </div>

        {token ? (
          <>
            <p className="text-gray-600 dark:text-gray-300 mb-4 font-medium">
              Welcome, <span className="text-blue-600 dark:text-blue-400">{user}</span> 👋
            </p>
            <ConverterForm onConversion={handleConversion} dark={dark} />
            <RateChart from_currency={currencies.from} to_currency={currencies.to} dark={dark} />
            <MultiConverter dark={dark} />
            <ConversionHistory refresh={refresh} dark={dark} />
          </>
        ) : (
          <>
            {showSignup ? (
              <Signup onSwitch={() => setShowSignup(false)} />
            ) : (
              <Login onSwitch={() => setShowSignup(true)} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}