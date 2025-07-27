'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Eye, EyeOff, Sparkles, ArrowRight, Mail, Lock, Home } from 'lucide-react'

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const router = useRouter()
  const { login } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('') // Clear error when user types
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Basic validation
    if (!formData.usernameOrEmail || !formData.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      const success = await login(formData.usernameOrEmail, formData.password)
      
      if (success) {
        router.push('/')
      } else {
        setError('Invalid username/email or password')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-brand rounded-xl flex items-center justify-center">
                  <div className="skeleton w-6 h-6 rounded"></div>
                </div>
                <div className="skeleton h-6 w-32 rounded"></div>
              </div>
            </Link>
            <div className="skeleton h-8 w-48 mx-auto rounded mb-2"></div>
            <div className="skeleton h-5 w-64 mx-auto rounded"></div>
          </div>
          <div className="card">
            <div className="card-content">
              <div className="space-y-6">
                <div className="skeleton h-12 w-full rounded-lg"></div>
                <div className="skeleton h-12 w-full rounded-lg"></div>
                <div className="skeleton h-12 w-full rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8 fade-in">
            <Link href="/" className="inline-block group">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-brand rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gradient">CodexCMS</span>
              </div>
            </Link>
            <h1 className="text-display text-dark-900 mb-3">Welcome Back</h1>
            <p className="text-body text-dark-600">
              Sign in to your account to continue creating amazing content
            </p>
          </div>

          {/* Login Card */}
          <div className="card slide-in">
            <div className="card-content">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="alert-error fade-in">
                    {error}
                  </div>
                )}

                {/* Email/Username Field */}
                <div className="form-group">
                  <label htmlFor="usernameOrEmail" className="form-label">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Username or Email
                  </label>
                  <input
                    id="usernameOrEmail"
                    name="usernameOrEmail"
                    type="text"
                    value={formData.usernameOrEmail}
                    onChange={handleInputChange}
                    placeholder="Enter your username or email"
                    required
                    className="form-input"
                    autoComplete="username"
                  />
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      required
                      className="form-input pr-12"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-brand-600 bg-white border-dark-300 rounded focus:ring-brand-500 focus:ring-2"
                    />
                    <span className="text-sm text-dark-600">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full btn-lg relative overflow-hidden group"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-dark-500">New to CodexCMS?</span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-body text-dark-600 mb-4">
                  Create an account to start publishing amazing content
                </p>
                <Link href="/register" className="btn-secondary w-full">
                  Create Account
                </Link>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8 slide-in delay-200">
            <Link href="/" className="inline-flex items-center gap-2 text-dark-500 hover:text-dark-700 transition-colors group">
              <Home className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 