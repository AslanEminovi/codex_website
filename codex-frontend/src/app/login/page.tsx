'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
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
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="card">
            <div className="card-content">
              <div className="animate-pulse space-y-4">
                <div className="skeleton h-4 w-3/4 rounded"></div>
                <div className="skeleton h-12 w-full rounded"></div>
                <div className="skeleton h-4 w-1/2 rounded"></div>
                <div className="skeleton h-12 w-full rounded"></div>
                <div className="skeleton h-12 w-full rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">CodexCMS</h1>
          </Link>
          <h2 className="text-title text-gray-900 mb-2">Welcome back</h2>
          <p className="text-body text-gray-600">
            Sign in to your account to continue creating
          </p>
        </div>

        {/* Login Card */}
        <div className="card">
          <div className="card-content">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="alert alert-error">
                  {error}
                </div>
              )}

              {/* Username/Email Field */}
              <div className="form-group">
                <label htmlFor="usernameOrEmail" className="form-label">
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
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  className="form-input"
                  autoComplete="current-password"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-caption">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-caption text-primary-600 hover:text-primary-700">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-body text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-semibold text-primary-600 hover:text-primary-700">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-caption text-gray-500 hover:text-gray-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
} 