
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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md">
      <h1 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">Currency Converter</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            required
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4 items-end">
  <div className="flex-1">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From</label>
    <div className="flex items-center gap-2">
      <img src={getFlagUrl(currencies.find(c => c.code === form.from_currency)?.country)} className="w-6 h-4 rounded-sm object-cover" />
      <select name="from_currency" value={form.from_currency} onChange={handleChange}
        className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
        {currencies.map(c => (
          <option key={c.code} value={c.code}>{c.code}</option>
        ))}
      </select>
    </div>
  </div>

  <button type="button" onClick={handleSwap}
    className="mb-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-white rounded-full p-2 transition text-xl">
    ⇄
  </button>

  <div className="flex-1">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
    <div className="flex items-center gap-2">
      <img src={getFlagUrl(currencies.find(c => c.code === form.to_currency)?.country)} className="w-6 h-4 rounded-sm object-cover" />
      <select name="to_currency" value={form.to_currency} onChange={handleChange}
        className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
        {currencies.map(c => (
          <option key={c.code} value={c.code}>{c.code}</option>
        ))}
      </select>
    </div>
  </div>
</div>

          

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
          {loading ? "Converting..." : "Convert"}
        </button>
      </form>

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

      {result && (
        <div className="mt-6 bg-blue-50 dark:bg-gray-700 rounded-xl p-4 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Result</p>
          <p className="text-3xl font-bold text-blue-700 dark:text-blue-400 mt-1">
            {getFlagEmoji(currencies.find(c => c.code === result.to_currency)?.country)} {result.converted_amount.toFixed(2)} {result.to_currency}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            1 {result.from_currency} = {result.rate.toFixed(4)} {result.to_currency}
          </p>
        </div>
      )}
    </div>
  )
}