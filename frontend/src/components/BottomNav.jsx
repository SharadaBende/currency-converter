import { NavLink } from "react-router-dom"

const tabs = [
  { path: "/dashboard", icon: "📊", label: "Dashboard" },
  { path: "/converter", icon: "💱", label: "Convert" },
  { path: "/multi", icon: "🌍", label: "Multi" },
  { path: "/favorites", icon: "⭐", label: "Favorites" },
  { path: "/history", icon: "🕐", label: "History" },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-2 py-2 flex justify-around">
      {tabs.map(tab => (
        <NavLink key={tab.path} to={tab.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition ${
              isActive
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-600"
            }`
          }>
          <span className="text-xl">{tab.icon}</span>
          <span className="text-xs font-medium">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}