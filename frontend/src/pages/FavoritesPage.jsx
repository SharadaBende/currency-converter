import { useState, useEffect } from "react"
import axios from "axios"
import { getFlagUrl } from "../utils/flags"
import { currencies } from "../utils/currencies"

const API_URL = import.meta.env.VITE_API_URL

export default function FavoritePairs({ onSelect, dark }) {
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favoritePairs") || "[]")
  )
  const [from, setFrom] = useState("USD")
  const [to, setTo] = useState("EUR")
  const [rates, setRates] = useState({})

  useEffect(() => {
    if (favorites.length === 0) return
    const fetchRates = async () => {
      try {
        const token = localStorage.getItem("token")
        const uniqueBases = [...new Set(favorites.map(f => f.from))]
        const results = await Promise.all(
          uniqueBases.map(base =>
            axios.post(
              `${API_URL}/api/convert-multi`,
              { from_currency: base, to_currency: base, amount: 1 },
              { headers: { Authorization: `Bearer ${token}` } }
            ).then(res => ({ base, rates: res.data.rates }))
          )
        )
        const rateMap = {}
        results.forEach(r => { rateMap[r.base] = r.rates })
        setRates(rateMap)
      } catch (err) {
        console.error(err)
      }
    }
    fetchRates()
  }, [favorites])

  const addFavorite = () => {
    if (favorites.find(f => f.from === from && f.to === to)) return
    const newFavs = [...favorites, { from, to }]
    setFavorites(newFavs)
    localStorage.setItem("favoritePairs", JSON.stringify(newFavs))
  }

  const removeFavorite = (index) => {
    const newFavs = favorites.filter((_, i) => i !== index)
    setFavorites(newFavs)
    localStorage.setItem("favoritePairs", JSON.stringify(newFavs))
  }

  const getFlag = (code) => {
    const currency = currencies.find(c => c.code === code)
    return currency ? getFlagUrl(currency.country) : ""
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-4 sm:p-8 w-full overflow-hidden">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">⭐ Favorite Pairs</h2>

      {/* Add pair row */}
      <div className="mb-4">
        <div className="flex gap-2 items-center w-full">

          {/* From select */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex items-center gap-1.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-2 py-2 dark:bg-gray-700 overflow-hidden">
              <img src={getFlag(from)} className="w-5 h-3.5 rounded-sm object-cover flex-shrink-0" />
              <select
                value={from}
                onChange={e => setFrom(e.target.value)}
                className="w-full min-w-0 max-w-full bg-transparent dark:text-white focus:outline-none font-medium text-sm cursor-pointer overflow-hidden"
              >
                {currencies.map(c => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
            </div>
          </div>

          <span className="text-gray-400 font-bold flex-shrink-0">→</span>

          {/* To select */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex items-center gap-1.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-2 py-2 dark:bg-gray-700 overflow-hidden">
              <img src={getFlag(to)} className="w-5 h-3.5 rounded-sm object-cover flex-shrink-0" />
              <select
                value={to}
                onChange={e => setTo(e.target.value)}
                className="w-full min-w-0 max-w-full bg-transparent dark:text-white focus:outline-none font-medium text-sm cursor-pointer overflow-hidden"
              >
                {currencies.map(c => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Add button */}
          <button
            onClick={addFavorite}
            className="flex-shrink-0 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded-xl font-bold text-sm transition"
          >
            ⭐
          </button>
        </div>
      </div>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-4">
          No favorite pairs yet. Add one above!
        </p>
      ) : (
        <ul className="space-y-3">
          {favorites.map((pair, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-2xl px-3 py-3 cursor-pointer hover:shadow-md transition"
              onClick={() => onSelect(pair.from, pair.to)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex items-center gap-1 flex-shrink-0">
                  <img src={getFlag(pair.from)} className="w-5 h-3.5 rounded-sm object-cover" />
                  <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm">{pair.from}</span>
                </div>
                <span className="text-gray-400 flex-shrink-0">→</span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <img src={getFlag(pair.to)} className="w-5 h-3.5 rounded-sm object-cover" />
                  <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm">{pair.to}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {rates[pair.from] ? rates[pair.from][pair.to]?.toFixed(4) : "..."}
                </span>
                <button
                  onClick={e => { e.stopPropagation(); removeFavorite(index) }}
                  className="text-red-400 hover:text-red-600 transition text-base"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}