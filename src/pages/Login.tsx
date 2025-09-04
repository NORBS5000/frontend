import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Mail, Lock, Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await signIn(email, password)
      if (error) throw error
      navigate('/')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-teal-50 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 opacity-30">
        <div className="w-[600px] h-[600px] bg-gradient-to-br from-blue-400 via-purple-400 to-teal-400 rounded-full blur-3xl animate-float"></div>
      </div>
      <div className="absolute bottom-0 left-0 -z-10 opacity-30">
        <div className="w-[500px] h-[500px] bg-gradient-to-tr from-teal-400 via-blue-400 to-purple-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-lg w-full glass rounded-3xl shadow-2xl border border-white/30 p-10 animate-scale-in">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl animate-glow">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gradient-primary mb-3">
            Welcome Back
          </h2>
          <p className="text-gray-700 text-lg font-medium">Sign in to access your MediLoan account</p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl text-red-700 text-sm animate-slide-down shadow-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="group">
            <label className="form-label text-base">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-all duration-300" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input pl-12 py-4 text-lg"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="group">
            <label className="form-label text-base">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-all duration-300" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input pl-12 pr-14 py-4 text-lg"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110"
              >
                {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group w-full bg-gradient-to-r from-blue-500 via-purple-500 to-teal-600 text-white py-4 px-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-400 disabled:transform-none disabled:hover:shadow-xl flex items-center justify-center relative overflow-hidden"
          >
            {loading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                <span className="loading-dots">Signing In</span>
              </span>
            ) : (
              <span className="relative z-10 flex items-center">
                🚀 Sign In
                <svg className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-700 text-lg font-medium">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-teal-600 font-bold transition-all duration-200 hover:underline hover:scale-105 inline-block"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login