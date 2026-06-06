import Signup from "../components/Signup"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">💱 CurrencyX</h1>
        <p className="text-gray-500 dark:text-gray-400">Create your account</p>
      </div>
      <Signup />
    </div>
  )
}