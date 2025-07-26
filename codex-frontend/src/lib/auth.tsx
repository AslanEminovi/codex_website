'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'

interface User {
  id: number
  username: string
  email: string
  role: string
  firstName?: string
  lastName?: string
}

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

  const isAdmin = user?.role === 'Admin' || user?.email === 'eminoviaslan@gmail.com'

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token')
    const userEmail = localStorage.getItem('userEmail')
    
    if (token && userEmail) {
      api.setToken(token)
      // Create user from stored data for now
      const storedUser: User = {
        id: 1,
        username: userEmail.split('@')[0],
        email: userEmail,
        role: userEmail === 'eminoviaslan@gmail.com' ? 'Admin' : 'User',
        firstName: 'User',
        lastName: 'Name'
      }
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  const login = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    try {
      // TODO: Replace with real API call when backend is connected
      console.log('Login attempt:', usernameOrEmail, password)
      
      // For now, simulate successful login
      const mockUser: User = {
        id: 1,
        username: usernameOrEmail.includes('@') ? usernameOrEmail.split('@')[0] : usernameOrEmail,
        email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@example.com`,
        role: usernameOrEmail === 'eminoviaslan@gmail.com' ? 'Admin' : 'User',
        firstName: 'User',
        lastName: 'Name'
      }
      
      // Store in localStorage
      localStorage.setItem('token', 'mock-token')
      localStorage.setItem('userEmail', mockUser.email)
      
      setUser(mockUser)
      return true
    } catch {
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
      // TODO: Replace with real API call when backend is connected
      console.log('Registration attempt:', userData)
      
      // For now, simulate successful registration
      const newUser: User = {
        id: Date.now(),
        username: userData.username,
        email: userData.email,
        role: userData.email === 'eminoviaslan@gmail.com' ? 'Admin' : 'User',
        firstName: userData.firstName,
        lastName: userData.lastName
      }
      
      // Store in localStorage
      localStorage.setItem('token', 'mock-token')
      localStorage.setItem('userEmail', newUser.email)
      
      setUser(newUser)
      return true
    } catch {
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
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