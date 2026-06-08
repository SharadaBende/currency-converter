import { useEffect, useState } from "react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export default function AIInsights({ dark }) {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
  const cached = sessionStorage.getItem("insights")
  if (cached) {
    setInsights(JSON.parse(cached))
    setLoading(false)
    return
  }

  const fetchInsights = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(`${API_URL}/api/insights`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setInsights(res.data.insights)
      sessionStorage.setItem("insights", JSON.stringify(res.data.insights))
    } catch (err) {
      setError("Could not load insights.")
    } finally {
      setLoading(false)
    }
  }
  fetchInsights() 
}, [])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 w-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🤖</span>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">AI Market Insights</h2>
      </div>

      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      {!loading && !error && (
        <div className="flex flex-col gap-3">
          {insights.map((insight, i) => (
            <div key={i} className="flex gap-3 items-start bg-blue-50 dark:bg-gray-700 rounded-2xl p-4">
              <span className="text-blue-500 font-bold text-lg mt-0.5">💡</span>
              <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
        Powered by Gemini AI · Updates on each visit
      </p>
    </div>
  )
}