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

export default function ConverterForm({ onConversion, dark }) {
  const [form, setForm] = useState({ from_currency: "USD", to_currency: "INR", amount: "" })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSwap = () => {
    setForm({ ...form, from_currency: form.to_currency, to_currency: form.from_currency })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await axios.post("http://localhost:8000/api/convert", {
        ...form,
        amount: parseFloat(form.amount)
      })
      setResult(res.data)
      onConversion(form.from_currency, form.to_currency)
    } catch (err) {
      setError("Conversion failed. Please check your inputs.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8 w-full">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Convert Currency</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            required
            className="w-full border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-lg font-semibold focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">From</label>
            <div className="flex items-center gap-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 dark:bg-gray-700">
              <img src={getFlagUrl(currencies.find(c => c.code === form.from_currency)?.country)}
                className="w-6 h-4 rounded-sm object-cover" />
              <select name="from_currency" value={form.from_currency} onChange={handleChange}
                className="flex-1 bg-transparent dark:text-white focus:outline-none font-medium">
                {currencies.map(c => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="button" onClick={handleSwap}
            className="mb-0.5 bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400 rounded-xl p-3 transition text-lg font-bold">
            ⇄
          </button>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">To</label>
            <div className="flex items-center gap-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 dark:bg-gray-700">
              <img src={getFlagUrl(currencies.find(c => c.code === form.to_currency)?.country)}
                className="w-6 h-4 rounded-sm object-cover" />
              <select name="to_currency" value={form.to_currency} onChange={handleChange}
                className="flex-1 bg-transparent dark:text-white focus:outline-none font-medium">
                {currencies.map(c => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-lg transition disabled:opacity-50 shadow-lg shadow-blue-200 dark:shadow-none">
          {loading ? "Converting..." : "Convert →"}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
          <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white text-center">
          <p className="text-blue-100 text-sm mb-1">Result</p>
          <div className="flex items-center justify-center gap-2 mb-1">
            <img src={getFlagUrl(currencies.find(c => c.code === result.to_currency)?.country)}
              className="w-8 h-5 rounded-sm object-cover" />
            <p className="text-4xl font-bold">{result.converted_amount.toFixed(2)}</p>
            <p className="text-xl font-semibold">{result.to_currency}</p>
          </div>
          <p className="text-blue-200 text-sm">
            1 {result.from_currency} = {result.rate.toFixed(4)} {result.to_currency}
          </p>
        </div>
      )}
    </div>
  )
}