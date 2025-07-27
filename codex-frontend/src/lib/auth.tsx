'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { api, User } from '@/lib/api'

interface AuthContextType {
  user: User | null
  login: (usernameOrEmail: string, password: string) => Promise<boolean>
  register: (userData: {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
  }) => Promise<boolean>
  logout: () => void
  loading: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = user?.role === 'Admin' || user?.role === 'admin'

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token')
    
    if (token) {
      api.setToken(token)
      // Try to get current user from API
      getCurrentUser()
    } else {
      setLoading(false)
    }
  }, [])

  const getCurrentUser = async () => {
    try {
      const currentUser = await api.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Failed to get current user:', error)
      // If token is invalid, clear it
      localStorage.removeItem('token')
      api.setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    try {
      const response = await api.login(usernameOrEmail, password)
      
      if (response.success && response.token && response.user) {
        // Store token and set user
        localStorage.setItem('token', response.token)
        api.setToken(response.token)
        setUser(response.user)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const register = async (userData: {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<boolean> => {
    try {
      const response = await api.register(userData)
      
      if (response.success) {
        // Registration successful - don't auto-login with fake token
        if (response.token && response.token !== "fake-token-login-separately") {
          // Real token - auto-login
          localStorage.setItem('token', response.token)
          api.setToken(response.token)
          setUser(response.user)
        }
        // For fake token or no token, just return success without logging in
        return true
      }
      
      return false
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    api.setToken(null)
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 