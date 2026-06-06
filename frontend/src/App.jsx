import { useState } from "react"
import ConverterForm from "./components/ConverterForm"
import ConversionHistory from "./components/ConversionHistory"
import RateChart from "./components/RateChart"
import MultiConverter from "./components/MultiConverter"

export default function App() {
  const [refresh, setRefresh] = useState(0)
  const [dark, setDark] = useState(false)
  const [currencies, setCurrencies] = useState({ from: "USD", to: "INR" })

  const handleConversion = (from, to) => {
    setRefresh(prev => prev + 1)
    setCurrencies({ from, to })
  }

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4 py-10 transition-colors duration-300">

        <button onClick={() => setDark(!dark)}
          className="absolute top-4 right-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-full shadow hover:shadow-md transition text-sm font-medium">
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>

        <ConverterForm onConversion={handleConversion} dark={dark} />
        <MultiConverter dark={dark} />
        <RateChart from_currency={currencies.from} to_currency={currencies.to} dark={dark} />
        <ConversionHistory refresh={refresh} dark={dark} />
      </div>
    </div>
  )
}