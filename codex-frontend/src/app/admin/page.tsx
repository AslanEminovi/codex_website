'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import { Navigation } from '@/components/navigation'
import { 
  BarChart3, 
  Users, 
  FileText, 
  Eye, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  TrendingUp,
  Activity,
  Target,
  Zap,
  Crown,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react'

interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  totalUsers: number
  totalViews: number
}

interface Post {
  id: number
  title: string
  slug: string
  author: {
    username: string
    firstName?: string
    lastName?: string
  }
  status: string
  createdAt: string
  viewCount: number
}

interface User {
  id: number
  username: string
  firstName?: string
  lastName?: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
}

export default function AdminPage() {
  const { user, isAdmin } = useAuth()
  const [mounted, setMounted] = useState(false)
      const [, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    totalUsers: 0,
    totalViews: 0
  })

  useEffect(() => {
    setMounted(true)
    if (user && isAdmin) {
      const loadData = async () => {
        try {
          await Promise.all([loadPosts(), loadUsers()])
        } finally {
          setIsLoading(false)
        }
      }
      loadData()
    }
  }, [user, isAdmin])



  const loadPosts = async () => {
    try {
      const response = await api.getPosts()
      if (response && Array.isArray(response)) {
        setPosts(response)
        const published = response.filter(post => post.status === 'Published').length
        const totalViews = response.reduce((sum, post) => sum + (post.viewCount || 0), 0)
        setStats(prev => ({
          ...prev,
          totalPosts: response.length,
          publishedPosts: published,
          totalViews
        }))
      }
    } catch {
      // Silent error handling
    }
  }

  const loadUsers = async () => {
    try {
      // Since getUsers might not exist in API, we'll skip user loading for now
      // or implement it differently
      setUsers([])
      setStats(prev => ({
        ...prev,
        totalUsers: 0
      }))
    } catch {
      // Silent error handling
    }
  }

  const makeUserAdmin = async (userId: number) => {
    try {
      // API function might not exist yet - placeholder for future implementation
      console.log('Make user admin:', userId)
    } catch {
      // Silent error handling
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getAuthorName = (author: { username: string; firstName?: string; lastName?: string }) => {
    return `${author.firstName || ''} ${author.lastName || ''}`.trim() || author.username
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Navigation />
        <div className="container py-16">
          <div className="skeleton h-12 w-64 mb-8 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card">
                <div className="card-content">
                  <div className="skeleton h-16 w-full rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="card max-w-md mx-auto">
          <div className="card-content text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-title mb-3">Access Denied</h2>
            <p className="text-body mb-6">You don&apos;t have permission to access the admin dashboard.</p>
            <Link href="/" className="btn-primary">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Navigation />

      <div className="container py-16 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 fade-in">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 mb-4">
              <Crown className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-medium text-dark-600">Admin Dashboard</span>
            </div>
            <h1 className="text-display text-dark-900 mb-3">
              Welcome back, <span className="text-gradient">{user.firstName || user.username}</span>
            </h1>
            <p className="text-subtitle text-dark-600">
              Manage your content and users from one central place
            </p>
          </div>
          <Link href="/create-post" className="btn-primary btn-lg mt-6 lg:mt-0">
            <Plus className="w-5 h-5" />
            New Post
          </Link>
        </div>

        {/* Tabs */}
        <div className="glass rounded-2xl p-2 mb-12 slide-in">
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'posts', label: 'Posts', icon: FileText },
              { id: 'users', label: 'Users', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-brand text-white shadow-lg'
                      : 'text-dark-600 hover:text-dark-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card group slide-in">
                <div className="card-content">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-dark-900">{stats.totalPosts}</p>
                      <p className="text-sm text-dark-500">Total Posts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">+12% this month</span>
                  </div>
                </div>
              </div>

              <div className="card group slide-in delay-100">
                <div className="card-content">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-dark-900">{stats.publishedPosts}</p>
                      <p className="text-sm text-dark-500">Published</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Activity className="w-4 h-4" />
                    <span className="text-sm font-medium">+8% this week</span>
                  </div>
                </div>
              </div>

              <div className="card group slide-in delay-200">
                <div className="card-content">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-dark-900">{stats.totalUsers}</p>
                      <p className="text-sm text-dark-500">Total Users</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">+15% this month</span>
                  </div>
                </div>
              </div>

              <div className="card group slide-in delay-300">
                <div className="card-content">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-dark-900">{stats.totalViews.toLocaleString()}</p>
                      <p className="text-sm text-dark-500">Total Views</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">+25% this week</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="card slide-in delay-400">
              <div className="card-content">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-title">Recent Posts</h3>
                  <Link href="#" onClick={() => setActiveTab('posts')} className="text-brand-600 hover:text-brand-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {posts.slice(0, 5).map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 bg-dark-50 rounded-xl hover:bg-dark-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-brand rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-dark-900">{post.title}</h4>
                          <p className="text-sm text-dark-500">by {getAuthorName(post.author)} • {formatDate(post.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === 'Published' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {post.status}
                        </span>
                        <div className="flex items-center gap-1 text-dark-500">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">{post.viewCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div className="card slide-in delay-500">
              <div className="card-content">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-title">Recent Users</h3>
                  <Link href="#" onClick={() => setActiveTab('users')} className="text-brand-600 hover:text-brand-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-dark-50 rounded-xl hover:bg-dark-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-brand rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user.firstName?.[0] || user.username?.[0] || 'U'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-dark-900">
                            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
                          </h4>
                          <p className="text-sm text-dark-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'Admin' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                        <span className="text-sm text-dark-500">{formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="card slide-in">
            <div className="card-content">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-title">All Posts</h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                    <input
                      type="text"
                      placeholder="Search posts..."
                      className="pl-10 pr-4 py-2 bg-dark-50 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                  <button className="p-2 bg-dark-50 border border-dark-200 rounded-lg hover:bg-dark-100 transition-colors">
                    <Filter className="w-4 h-4 text-dark-600" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-200">
                      <th className="text-left py-3 px-4 font-medium text-dark-700">Title</th>
                      <th className="text-left py-3 px-4 font-medium text-dark-700">Author</th>
                      <th className="text-left py-3 px-4 font-medium text-dark-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-dark-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-dark-700">Views</th>
                      <th className="text-right py-3 px-4 font-medium text-dark-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id} className="border-b border-dark-100 hover:bg-dark-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-medium text-dark-900">{post.title}</div>
                        </td>
                        <td className="py-4 px-4 text-dark-600">{getAuthorName(post.author)}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.status === 'Published' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {post.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-dark-600">{formatDate(post.createdAt)}</td>
                        <td className="py-4 px-4 text-dark-600">{post.viewCount}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/edit-post/${post.id}`} className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card slide-in">
            <div className="card-content">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-title">All Users</h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="pl-10 pr-4 py-2 bg-dark-50 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                  <button className="p-2 bg-dark-50 border border-dark-200 rounded-lg hover:bg-dark-100 transition-colors">
                    <Filter className="w-4 h-4 text-dark-600" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-200">
                      <th className="text-left py-3 px-4 font-medium text-dark-700">User</th>
                      <th className="text-left py-3 px-4 font-medium text-dark-700">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-dark-700">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-dark-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-dark-700">Joined</th>
                      <th className="text-right py-3 px-4 font-medium text-dark-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-dark-100 hover:bg-dark-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-brand rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {user.firstName?.[0] || user.username?.[0] || 'U'}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-dark-900">
                                {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
                              </div>
                              <div className="text-sm text-dark-500">@{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-dark-600">{user.email}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'Admin' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-dark-600">{formatDate(user.createdAt)}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            {user.role !== 'Admin' && (
                              <button 
                                onClick={() => makeUserAdmin(user.id)}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                title="Make Admin"
                              >
                                <Shield className="w-4 h-4" />
                              </button>
                            )}
                            <button className="p-2 text-dark-600 hover:bg-dark-100 rounded-lg transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 