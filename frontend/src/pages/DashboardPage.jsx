import Dashboard from "../components/Dashboard"
import AIInsights from "../components/AIInsights"
import { useOutletContext } from "react-router-dom"

export default function DashboardPage() {
  const { dark } = useOutletContext()
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Good day! 👋</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Here are today's live rates</p>
      </div>
      <AIInsights dark={dark} />
      <Dashboard dark={dark} />
    </div>
  )
}