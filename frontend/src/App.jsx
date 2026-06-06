import { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import BottomNav from "./components/BottomNav"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import DashboardPage from "./pages/DashboardPage"
import ConverterPage from "./pages/ConverterPage"
import MultiPage from "./pages/MultiPage"
import FavoritesPage from "./pages/FavoritesPage"
import HistoryPage from "./pages/HistoryPage"

function ProtectedLayout() {
  const [dark, setDark] = useState(false)
  const { token } = useAuth()

  if (!token) return <Navigate to="/login" />

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <Navbar dark={dark} setDark={setDark} />
        <div className="pt-20 pb-24 px-4 sm:px-6 max-w-2xl mx-auto">
          <Outlet context={{ dark }} />
        </div>
        <BottomNav />
      </div>
    </div>
  )
}

function AuthLayout() {
  const { token } = useAuth()
  if (token) return <Navigate to="/dashboard" />
  return <Outlet />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/converter" element={<ConverterPage />} />
            <Route path="/multi" element={<MultiPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}