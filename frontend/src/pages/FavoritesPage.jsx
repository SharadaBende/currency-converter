import FavoritePairs from "../components/FavoritePairs"
import { useOutletContext } from "react-router-dom"
import { useNavigate } from "react-router-dom"

export default function FavoritesPage() {
  const { dark } = useOutletContext()
  const navigate = useNavigate()

  const handleSelect = (from, to) => {
    navigate("/converter", { state: { from, to } })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Favorites</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Your saved currency pairs</p>
      </div>
      <FavoritePairs onSelect={handleSelect} dark={dark} />
    </div>
  )
}