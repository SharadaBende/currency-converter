import { useEffect } from "react"
import { useAuth } from "../context/AuthContext"

export default function SessionExpiredToast() {
  const { sessionExpired, setSessionExpired } = useAuth()

  useEffect(() => {
    if (sessionExpired) {
      const timer = setTimeout(() => setSessionExpired(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [sessionExpired])

  if (!sessionExpired) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-gray-900 dark:bg-gray-800 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium flex items-center gap-2 border border-gray-700">
        <span>⚠️</span>
        <span>Session expired. Please log in again.</span>
      </div>
    </div>
  )
}