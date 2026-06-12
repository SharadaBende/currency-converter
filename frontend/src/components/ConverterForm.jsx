import { useState } from "react"
import axios from "axios"
import { getFlagUrl } from "../utils/flags"
import { currencies } from "../utils/currencies"
import CurrencyDropdown from "./CurrencyDropdown"

const API_URL = import.meta.env.VITE_API_URL

export default function ConverterForm({ onConversion, dark }) {
  const [form, setForm] = useState({ from_currency: "USD", to_currency: "INR", amount: "" })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleSwap = () => {
    setForm({ ...form, from_currency: form.to_currency, to_currency: form.from_currency })
    setResult(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      const res = await axios.post(
        `${API_URL}/api/convert`,
        { ...form, amount: parseFloat(form.amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setResult(res.data)
      onConversion(form.from_currency, form.to_currency)
    } catch (err) {
      setError("Conversion failed. Please check your inputs.")
    } finally {
      setLoading(false)
    }
  }

  const fromCurrency = currencies.find(c => c.code === form.from_currency)
  const toCurrency = currencies.find(c => c.code === form.to_currency)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8 w-full">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Convert Currency</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            placeholder="0.00"
            required
            className="w-full border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-2xl px-4 py-3 text-2xl font-bold focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* From / Swap / To */}
        <div>
          <div className="flex gap-2 mb-1.5">
            <label className="flex-1 text-sm font-medium text-gray-500 dark:text-gray-400">From</label>
            <div className="w-10" />
            <label className="flex-1 text-sm font-medium text-gray-500 dark:text-gray-400">To</label>
          </div>
          <div className="flex gap-2 items-center">
            <CurrencyDropdown
              value={form.from_currency}
              onChange={(code) => setForm({ ...form, from_currency: code })}
            />

            <button
              type="button"
              onClick={handleSwap}
              className="flex-shrink-0 w-10 h-10 bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400 rounded-xl transition text-lg font-bold flex items-center justify-center"
            >
              ⇄
            </button>

            <CurrencyDropdown
              value={form.to_currency}
              onChange={(code) => setForm({ ...form, to_currency: code })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-3.5 rounded-2xl font-bold text-lg transition disabled:opacity-50 shadow-lg shadow-blue-200 dark:shadow-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Converting...
            </span>
          ) : "Convert →"}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
          <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-blue-100 text-xs font-medium uppercase tracking-widest">Result</p>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(result.converted_amount.toFixed(2))
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition"
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold">{result.converted_amount.toFixed(2)}</p>
              <p className="text-blue-200 text-sm mt-1">{toCurrency?.name}</p>
            </div>
            <img
              src={getFlagUrl(toCurrency?.country)}
              className="w-14 h-10 rounded-lg object-cover shadow-lg"
            />
          </div>
          <div className="mt-4 pt-4 border-t border-blue-400/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={getFlagUrl(fromCurrency?.country)}
                className="w-6 h-4 rounded-sm object-cover"
              />
              <span className="text-blue-100 text-sm">{form.amount} {result.from_currency}</span>
            </div>
            <span className="text-blue-200 text-sm">1 {result.from_currency} = {result.rate.toFixed(4)} {result.to_currency}</span>
          </div>
        </div>
      )}
    </div>
  )
}