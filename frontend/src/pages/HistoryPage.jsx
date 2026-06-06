import ConversionHistory from "../components/ConversionHistory"
import { useOutletContext } from "react-router-dom"

export default function HistoryPage() {
  const { dark } = useOutletContext()
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">History</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Your recent conversions</p>
      </div>
      <ConversionHistory refresh={0} dark={dark} />
    </div>
  )
}