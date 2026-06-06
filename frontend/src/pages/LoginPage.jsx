import Login from "../components/Login"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">💱 CurrencyX</h1>
        <p className="text-gray-500 dark:text-gray-400">Fast, accurate currency conversions</p>
      </div>
      <Login />
    </div>
  )
}