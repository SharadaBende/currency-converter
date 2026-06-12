import { useEffect, useState } from "react"
import axios from "axios"
import { getFlagUrl } from "../utils/flags"
import CurrencyDropdown from "./CurrencyDropdown"

const API_URL = import.meta.env.VITE_API_URL

const topCurrencies = [
  { code: "EUR", country: "EU", name: "Euro" },
  { code: "GBP", country: "GB", name: "British Pound" },
  { code: "JPY", country: "JP", name: "Japanese Yen" },
  { code: "AUD", country: "AU", name: "Australian Dollar" },
  { code: "CAD", country: "CA", name: "Canadian Dollar" },
  { code: "CHF", country: "CH", name: "Swiss Franc" },
  { code: "CNY", country: "CN", name: "Chinese Yuan" },
  { code: "INR", country: "IN", name: "Indian Rupee" },
  { code: "SGD", country: "SG", name: "Singapore Dollar" },
  { code: "AED", country: "AE", name: "UAE Dirham" },
  { code: "MXN", country: "MX", name: "Mexican Peso" },
  { code: "BRL", country: "BR", name: "Brazilian Real" },
]

export default function Dashboard({ dark }) {
  const [rates, setRates] = useState({})
  const [loading, setLoading] = useState(true)
  const [base, setBase] = useState("USD")

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        const res = await axios.post(
          `${API_URL}/api/convert-multi`,
          { from_currency: base, to_currency: base, amount: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setRates(res.data.rates)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchRates()
  }, [base])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8 w-full">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Live Rates</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Based on 1 {base}</p>
        </div>
        <div className="w-36 flex-shrink-0">
          <CurrencyDropdown value={base} onChange={setBase} />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4 animate-pulse h-20" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {topCurrencies.map(c => (
            <div key={c.code} className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition">
              <img src={getFlagUrl(c.country)} className="w-8 h-5 rounded-sm object-cover flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{c.code}</p>
                <p className="text-sm font-bold text-gray-800 dark:text-white">
                  {rates[c.code] ? rates[c.code].toFixed(4) : "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}