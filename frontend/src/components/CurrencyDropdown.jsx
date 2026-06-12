import { useState, useRef, useEffect } from "react"
import { getFlagUrl } from "../utils/flags"
import { currencies } from "../utils/currencies"

export default function CurrencyDropdown({ value, onChange, label }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef(null)

  const selected = currencies.find(c => c.code === value)
  const filtered = currencies.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
        setSearch("")
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleSelect = (code) => {
    onChange(code)
    setOpen(false)
    setSearch("")
  }

  return (
    <div className="relative flex-1 min-w-0" ref={ref}>
      {label && (
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      )}

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 dark:bg-gray-700 hover:border-blue-400 transition text-left"
      >
        <img
          src={getFlagUrl(selected?.country)}
          className="w-6 h-4 rounded-sm object-cover flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">{selected?.code}</p>
          <p className="hidden sm:block text-xs text-gray-400 dark:text-gray-500 truncate">{selected?.name}</p>
        </div>
        <span className="text-gray-400 text-xs flex-shrink-0">{open ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl shadow-xl z-50 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-100 dark:border-gray-700">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search currency..."
              autoFocus
              className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* List */}
          <ul className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400 text-center">No results</li>
            ) : (
              filtered.map(c => (
                <li
                  key={c.code}
                  onClick={() => handleSelect(c.code)}
                  className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition ${
                    c.code === value ? "bg-blue-50 dark:bg-gray-700" : ""
                  }`}
                >
                  <img src={getFlagUrl(c.country)} className="w-6 h-4 rounded-sm object-cover flex-shrink-0" />
                  <span className="font-semibold text-gray-800 dark:text-white text-sm">{c.code}</span>
                  <span className="text-xs text-gray-400 truncate">{c.name}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}