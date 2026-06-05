import { useEffect, useState } from "react"
import axios from "axios"

export default function ConversionHistory({ refresh }) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    axios.get("http://localhost:8000/api/history")
      .then(res => setHistory(res.data))
      .catch(err => console.error(err))
  }, [refresh])

  if (history.length === 0) return null

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mt-6">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Recent Conversions</h2>
      <ul className="space-y-3">
        {history.map((item) => (
          <li key={item.id} className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="font-semibold text-gray-800">
                {item.amount} {item.from_currency} → {item.converted_amount.toFixed(2)} {item.to_currency}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
            <span className="text-sm text-blue-500 font-medium">
              {item.rate.toFixed(4)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}