import { useState } from "react"
import ConverterForm from "./components/ConverterForm"
import ConversionHistory from "./components/ConversionHistory"

export default function App() {
  const [refresh, setRefresh] = useState(0)

  const handleConversion = () => {
    setRefresh(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center justify-center px-4 py-10">
      <ConverterForm onConversion={handleConversion} />
      <ConversionHistory refresh={refresh} />
    </div>
  )
}