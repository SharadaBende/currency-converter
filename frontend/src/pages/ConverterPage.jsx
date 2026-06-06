import { useState } from "react"
import ConverterForm from "../components/ConverterForm"
import RateChart from "../components/RateChart"
import { useOutletContext } from "react-router-dom"

export default function ConverterPage() {
  const { dark } = useOutletContext()
  const [currencies, setCurrencies] = useState({ from: "USD", to: "INR" })

  const handleConversion = (from, to) => {
    setCurrencies({ from, to })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Converter</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Convert between 150+ currencies</p>
      </div>
      <ConverterForm onConversion={handleConversion} dark={dark} />
      <RateChart from_currency={currencies.from} to_currency={currencies.to} dark={dark} />
    </div>
  )
}