import MultiConverter from "../components/MultiConverter"
import { useOutletContext } from "react-router-dom"

export default function MultiPage() {
  const { dark } = useOutletContext()
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Multi Converter</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Convert to all currencies at once</p>
      </div>
      <MultiConverter dark={dark} />
    </div>
  )
}