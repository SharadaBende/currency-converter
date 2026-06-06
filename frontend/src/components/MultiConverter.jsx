import { useState } from "react"
import axios from "axios"
import { getFlagUrl } from "../utils/flags"

const currencies = [
  { code: "USD", country: "US" },
  { code: "EUR", country: "EU" },
  { code: "GBP", country: "GB" },
  { code: "INR", country: "IN" },
  { code: "JPY", country: "JP" },
  { code: "AUD", country: "AU" },
  { code: "CAD", country: "CA" },
  { code: "CHF", country: "CH" },
  { code: "CNY", country: "CN" },
  { code: "SGD", country: "SG" },
]

export default function MultiConverter({ dark }) {
  const [amount, setAmount] = useState("")
  const [from, setFrom] = useState("USD")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleConvert = async () => {
    if (!amount) return
    setLoading(true)
    setError("")
    try {
      const res = await axios.post("http://localhost:8000/api/convert-multi", {
        from_currency: from,
        to_currency: from,
        amount: parseFloat(amount)
      })
      const rates = res.data.rates
      const targets = currencies.filter(c => c.code !== from)
      setResults(targets.map(c => ({
        to_currency: c.code,
        converted_amount: parseFloat(amount) * rates[c.code],
        rate: rates[c.code]
      })))
    } catch (err) {
      setError("Conversion failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md mt-6">
      <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4">Multi-Currency Converter</h2>

      <div className="flex gap-3 mb-4">
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select value={from} onChange={e => setFrom(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          {currencies.map(c => (
            <option key={c.code} value={c.code}>{c.code}</option>
          ))}
        </select>
      </div>

      <button onClick={handleConvert} disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 mb-4">
        {loading ? "Converting..." : "Convert to All"}
      </button>

      {error && <p className="text-red-500 text-center text-sm">{error}</p>}

      {results.length > 0 && (
        <ul className="space-y-3">
          {results.map(r => (
            <li key={r.to_currency} className="flex items-center justify-between border-b dark:border-gray-600 pb-2">
              <div className="flex items-center gap-2">
                <img src={getFlagUrl(currencies.find(c => c.code === r.to_currency)?.country)}
                  className="w-6 h-4 rounded-sm object-cover" />
                <span className="font-medium text-gray-700 dark:text-gray-200">{r.to_currency}</span>
              </div>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {r.converted_amount.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}