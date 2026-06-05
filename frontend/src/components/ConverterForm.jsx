import { useState } from "react"
import axios from "axios"

const currencies = ["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD", "CHF", "CNY", "SGD"]

export default function ConverterForm({ onConversion }) {
  const [form, setForm] = useState({ from_currency: "USD", to_currency: "INR", amount: "" })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
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
      onConversion()
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        
        <div className="flex gap-4 items-end">
  <div className="flex-1">
    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
    <select name="from_currency" value={form.from_currency} onChange={handleChange}
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
      {currencies.map(c => <option key={c}>{c}</option>)}
    </select>
  </div>

  <button type="button" onClick={() => setForm({ ...form, from_currency: form.to_currency, to_currency: form.from_currency })}
    className="mb-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition text-xl">
    ⇄
  </button>

  <div className="flex-1">
    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
    <select name="to_currency" value={form.to_currency} onChange={handleChange}
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
      {currencies.map(c => <option key={c}>{c}</option>)}
    </select>
  </div>
</div>

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
          {loading ? "Converting..." : "Convert"}
        </button>
      </form>

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

      {result && (
        <div className="mt-6 bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-gray-500 text-sm">Result</p>
          <p className="text-3xl font-bold text-blue-700 mt-1">
            {result.converted_amount.toFixed(2)} {result.to_currency}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            1 {result.from_currency} = {result.rate.toFixed(4)} {result.to_currency}
          </p>
        </div>
      )}
    </div>
  )
}