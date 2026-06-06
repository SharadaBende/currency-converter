import { useState } from "react"
import { AuthProvider, useAuth } from "./context/AuthContext"
import ConverterForm from "./components/ConverterForm"
import ConversionHistory from "./components/ConversionHistory"
import RateChart from "./components/RateChart"
import MultiConverter from "./components/MultiConverter"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Navbar from "./components/Navbar"

function MainApp() {
  const { user, token } = useAuth()
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <Navbar dark={dark} setDark={setDark} />

        <div className="pt-24 pb-12 px-4 sm:px-6 max-w-6xl mx-auto">
          {token ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-6">
                  <ConverterForm onConversion={handleConversion} dark={dark} />
                  <RateChart from_currency={currencies.from} to_currency={currencies.to} dark={dark} />
                </div>
                <div className="flex flex-col gap-6">
                  <MultiConverter dark={dark} />
                  <ConversionHistory refresh={refresh} dark={dark} />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[80vh]">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">💱 CurrencyX</h1>
                <p className="text-gray-500 dark:text-gray-400">Fast, accurate currency conversions</p>
              </div>
              {showSignup ? (
                <Signup onSwitch={() => setShowSignup(false)} />
              ) : (
                <Login onSwitch={() => setShowSignup(true)} />
              )}
            </div>
          )}
        </div>
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