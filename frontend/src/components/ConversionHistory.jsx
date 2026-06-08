import { useEffect, useState } from "react"
import axios from "axios"
import { getFlagUrl } from "../utils/flags"
import { currencies } from "../utils/currencies"

const API_URL = import.meta.env.VITE_API_URL

export default function ConversionHistory({ refresh, dark }) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    axios.get(`${API_URL}/api/history`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setHistory(res.data))
      .catch(err => console.error(err))
  }, [refresh])

  if (history.length === 0) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8 w-full">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Recent Conversions</h2>
      <ul className="space-y-3">
        {history.map((item) => (
          <li key={item.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <img src={getFlagUrl(currencies.find(c => c.code === item.from_currency)?.country)}
                  className="w-6 h-4 rounded-sm object-cover" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{item.from_currency}</span>
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center gap-1">
                <img src={getFlagUrl(currencies.find(c => c.code === item.to_currency)?.country)}
                  className="w-6 h-4 rounded-sm object-cover" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{item.to_currency}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {item.converted_amount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(item.timestamp).toLocaleDateString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}