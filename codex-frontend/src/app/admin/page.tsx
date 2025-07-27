'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { api, Post as ApiPost } from '@/lib/api'
import { Navigation } from '@/components/navigation'

interface Post {
  id: number
  title: string
  status: string
  author: string
  date: string
  views: number
}

interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  createdAt: string
  lastLoginAt?: string
}

interface DashboardStats {
  totalPosts: number
  totalUsers: number
  totalViews: number
  publishedPosts: number
}

export default function AdminDashboard() {
  const { isAdmin } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalUsers: 0,
    totalViews: 0,
    publishedPosts: 0
  })
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'users'>('overview')

  useEffect(() => {
    // Check if user is admin using the auth system
    if (!isAdmin) {
      // Redirect non-admin users
      window.location.href = '/'
      return
    }
    
    // Load real data from API
    loadPosts()
    loadUsers()
  }, [isAdmin])

  const loadPosts = async () => {
    try {
      const response = await api.getPosts()
      if (response && Array.isArray(response)) {
        // Map API Post to admin Post interface
        const mappedPosts: Post[] = response.map((apiPost: ApiPost) => ({
          id: apiPost.id,
          title: apiPost.title,
          status: apiPost.status,
          author: `${apiPost.author.firstName || ''} ${apiPost.author.lastName || ''}`.trim() || apiPost.author.username,
          date: new Date(apiPost.publishedAt || apiPost.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          views: apiPost.viewCount || 0
        }))
        setPosts(mappedPosts)
        
        // Calculate stats
        setStats(prev => ({
          ...prev,
          totalPosts: mappedPosts.length,
          publishedPosts: mappedPosts.filter(p => p.status === 'Published').length,
          totalViews: mappedPosts.reduce((sum, p) => sum + p.views, 0)
        }))
      }
    } catch (error) {
      // Silently handle error - posts will remain empty array
      // Show empty if API fails
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const response = await fetch('https://codexcms-production.up.railway.app/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const userData = await response.json()
        setUsers(userData)
        setStats(prev => ({
          ...prev,
          totalUsers: userData.length
        }))
      }
    } catch (error) {
      // Silently handle error - users will remain empty array
    }
  }

  const makeUserAdmin = async (userId: number) => {
    try {
      const response = await fetch(`https://codexcms-production.up.railway.app/admin/users/${userId}/make-admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        loadUsers() // Refresh users list
      }
    } catch (error) {
      // Silently handle error
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-error-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-title-lg text-gray-900 mb-2">Access Denied</h2>
          <p className="text-body text-gray-600 mb-6">You need admin privileges to access this page.</p>
          <Link href="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container py-8">
          <div className="animate-pulse space-y-8">
            <div className="skeleton h-8 w-1/3 rounded"></div>
            <div className="grid grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card">
                  <div className="card-content">
                    <div className="skeleton h-12 w-12 rounded-full mb-4"></div>
                    <div className="skeleton h-6 w-16 mb-2 rounded"></div>
                    <div className="skeleton h-4 w-20 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="skeleton h-64 w-full rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container">
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-hero text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-body-lg text-gray-600">
                  Manage your content, users, and monitor site performance.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/create-post" className="btn-primary btn-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  New Post
                </Link>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-8">
              <div className="flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview', icon: '📊' },
                  { id: 'posts', label: 'Posts', icon: '📝' },
                  { id: 'users', label: 'Users', icon: '👥' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <div className="card-content">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-caption text-gray-500">Total Posts</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-caption text-gray-500">Published</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.publishedPosts}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-caption text-gray-500">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-caption text-gray-500">Total Views</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-title text-gray-900">Recent Posts</h3>
                </div>
                <div className="card-content space-y-4">
                  {posts.slice(0, 5).map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{post.title}</h4>
                        <p className="text-caption text-gray-500">by {post.author} • {post.date}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.status === 'Published' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No posts yet</p>
                  )}
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="text-title text-gray-900">Recent Users</h3>
                </div>
                <div className="card-content space-y-4">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {user.firstName?.[0] || user.username?.[0] || 'U'}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{user.firstName} {user.lastName}</h4>
                          <p className="text-caption text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No users yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-title text-gray-900">All Posts</h3>
                <Link href="/create-post" className="btn-primary btn-sm">
                  New Post
                </Link>
              </div>
            </div>
            <div className="card-content">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Title</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Author</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Views</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{post.title}</div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{post.author}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.status === 'Published' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'
                          }`}>
                            {post.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{post.date}</td>
                        <td className="py-3 px-4 text-gray-600">{post.views}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/edit-post/${post.id}`} className="text-primary-600 hover:text-primary-700 text-sm">
                              Edit
                            </Link>
                            <button className="text-red-600 hover:text-red-700 text-sm">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {posts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No posts found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-title text-gray-900">User Management</h3>
            </div>
            <div className="card-content">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Joined</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {user.firstName?.[0] || user.username?.[0] || 'U'}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                              <div className="text-caption text-gray-500">@{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.isActive ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {user.role !== 'Admin' && (
                              <button 
                                onClick={() => makeUserAdmin(user.id)}
                                className="text-primary-600 hover:text-primary-700 text-sm"
                              >
                                Make Admin
                              </button>
                            )}
                            <button className="text-red-600 hover:text-red-700 text-sm">
                              Deactivate
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No users found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 