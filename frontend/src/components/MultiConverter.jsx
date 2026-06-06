import { useState } from "react"
import axios from "axios"
import { getFlagUrl } from "../utils/flags"
import { currencies } from "../utils/currencies"

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
      const token = localStorage.getItem("token")
      const res = await axios.post(
        "http://localhost:8000/api/convert-multi",
        { from_currency: from, to_currency: from, amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const rates = res.data.rates
      const targets = currencies.filter(c => c.code !== from)
      setResults(targets.map(c => ({
        to_currency: c.code,
        country: c.country,
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
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8 w-full">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Multi-Currency Converter</h2>

      <div className="flex gap-3 mb-4">
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="0.00"
          className="flex-1 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-lg font-semibold focus:outline-none focus:border-blue-500 transition"
        />
        <div className="flex items-center gap-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-3 dark:bg-gray-700">
          <img src={getFlagUrl(currencies.find(c => c.code === from)?.country)}
            className="w-6 h-4 rounded-sm object-cover" />
          <select value={from} onChange={e => setFrom(e.target.value)}
            className="bg-transparent dark:text-white focus:outline-none font-medium py-3">
            {currencies.map(c => (
              <option key={c.code} value={c.code}>{c.code}</option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={handleConvert} disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-lg transition disabled:opacity-50 shadow-lg shadow-blue-200 dark:shadow-none mb-5">
        {loading ? "Converting..." : "Convert to All →"}
      </button>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4">
          <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {results.map(r => (
            <div key={r.to_currency} className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-3 flex flex-col items-center gap-1">
              <img src={getFlagUrl(r.country)} className="w-8 h-5 rounded-sm object-cover" />
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{r.to_currency}</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{r.converted_amount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}