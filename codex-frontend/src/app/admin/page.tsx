'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api, Post as ApiPost } from '@/lib/api'

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
  role: string
  status: string
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is admin
    const userEmail = localStorage.getItem('userEmail')
    const adminAccess = userEmail === 'eminoviaslan@gmail.com'
    setIsAdmin(adminAccess)
    
    if (!adminAccess) {
      // Redirect non-admin users
      window.location.href = '/'
      return
    }
    
    // Load real data from API
    loadPosts()
    loadUsers()
  }, [])

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
      }
    } catch (error) {
      console.error('Failed to load posts:', error)
      // Show empty if API fails
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      // TODO: Implement getUsers API call when backend supports it
      console.log('Loading users from API...')
    } catch (error) {
      console.error('Failed to load users:', error)
    }
  }

  const handleDeletePost = async (postId: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await api.deletePost(postId)
        // Remove from local state after successful API call
        setPosts(posts.filter(post => post.id !== postId))
        console.log('Post deleted successfully')
      } catch (error) {
        console.error('Failed to delete post:', error)
        alert('Failed to delete post. Please try again.')
      }
    }
  }

  const handleDeleteUser = (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'badge-green'
      case 'draft':
        return 'badge-gray'
      default:
        return 'badge-gray'
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'badge-red'
      case 'editor':
        return 'badge-blue'
      case 'author':
        return 'badge-green'
      default:
        return 'badge-gray'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don&apos;t have permission to access this page.</p>
          <Link href="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="nav">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              CodexCMS
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, Admin</span>
              <Link href="/" className="btn btn-secondary">
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage your content and users from here.
          </p>
        </div>

        {/* Stats */}
                 <div className="grid grid-cols-2 md-grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="card-content">
              <div className="text-3xl font-bold text-gray-900 mb-2">{posts.length}</div>
              <div className="text-gray-600">Total Posts</div>
            </div>
          </div>
          <div className="card">
            <div className="card-content">
              <div className="text-3xl font-bold text-gray-900 mb-2">{users.length}</div>
              <div className="text-gray-600">Total Users</div>
            </div>
          </div>
          <div className="card">
            <div className="card-content">
              <div className="text-3xl font-bold text-gray-900 mb-2">12.5K</div>
              <div className="text-gray-600">Page Views</div>
            </div>
          </div>
          <div className="card">
            <div className="card-content">
              <div className="text-3xl font-bold text-gray-900 mb-2">{posts.filter(p => p.status.toLowerCase() === 'published').length}</div>
              <div className="text-gray-600">Published</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Posts Management */}
          <div className="card">
            <div className="card-content">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Posts</h2>
                <Link href="/create-post" className="btn btn-primary">New Post</Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Author</th>
                      <th>Views</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id}>
                        <td>
                          <div>
                            <div className="font-medium text-gray-900">{post.title}</div>
                            <div className="text-sm text-gray-500">{post.date}</div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadge(post.status)}`}>
                            {post.status}
                          </span>
                        </td>
                        <td className="text-gray-700">{post.author}</td>
                        <td className="text-gray-700">{post.views}</td>
                        <td>
                          <div className="flex gap-2">
                            <Link href={`/edit-post/${post.id}`} className="btn-ghost text-sm">Edit</Link>
                            <button 
                              className="btn-ghost text-sm text-red-600"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              Delete
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

          {/* Users Management */}
          <div className="card">
            <div className="card-content">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                <button className="btn btn-secondary">Add User</button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div>
                            <div className="font-medium text-gray-900">@{user.username}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${getRoleBadge(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="text-green-600 font-medium">{user.status}</td>
                        <td>
                          <div className="flex gap-2">
                            <button className="btn-ghost text-sm">Edit</button>
                            {user.role !== 'Admin' && (
                              <button 
                                className="btn-ghost text-sm text-red-600"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 