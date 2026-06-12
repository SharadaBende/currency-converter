import { NavLink } from "react-router-dom"

const tabs = [
  { path: "/dashboard", icon: "📊", label: "Home" },
  { path: "/converter", icon: "💱", label: "Convert" },
  { path: "/multi", icon: "🌍", label: "Multi" },
  { path: "/favorites", icon: "⭐", label: "Saved" },
  { path: "/history", icon: "🕐", label: "History" },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center h-16 px-1">
      {tabs.map(tab => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 flex-1 h-full rounded-xl transition-all ${
              isActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-400 dark:text-gray-500"
            }`
          }>
          <span className="text-2xl leading-none">{tab.icon}</span>
          <span className="text-[10px] font-medium leading-none">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}