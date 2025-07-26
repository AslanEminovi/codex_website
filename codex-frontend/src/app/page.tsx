'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [posts, setPosts] = useState<any[]>([])
  const { user, isAdmin, loading, logout } = useAuth()

  useEffect(() => {
    setMounted(true)
    loadPosts()
  }, [])

  const loadPosts = async () => {
          try {
        const response = await api.getPosts()
        if (response && Array.isArray(response)) {
          setPosts(response.slice(0, 3)) // Only show first 3 posts
        }
      } catch (error) {
        console.error('Failed to load posts from API:', error)
        // Show empty if API fails
        setPosts([])
      }
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="nav">
        <div className="container">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              CodexCMS
            </Link>
            <div className="hidden md-flex items-center gap-8">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/blog" className="nav-link">Blog</Link>
              {user && (
                <Link href="/create-post" className="nav-link">Create Post</Link>
              )}
              {user ? (
                <>
                  {isAdmin && (
                    <Link href="/admin" className="btn btn-primary">Admin Panel</Link>
                  )}
                  <button onClick={logout} className="btn btn-secondary">Logout</button>
                </>
              ) : (
                <Link href="/login" className="btn btn-primary">Login</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Modern Content Management
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Create, manage, and publish your content with our clean and simple CMS platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <Link href="/blog" className="btn btn-primary">
                Read Our Blog
              </Link>
              {isAdmin && (
                <Link href="/admin" className="btn btn-secondary">
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="section bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Latest Posts
          </h2>
                      <div className="grid md-grid-cols-3 gap-8 lg:gap-12">
              {posts.map((post) => (
              <article key={post.id} className="card">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={400}
                  height={240}
                  className="w-full h-48 object-cover"
                />
                <div className="card-content">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge badge-gray">{post.category}</span>
                    <span className="text-sm text-gray-500">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-gray-700">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">By {post.author}</span>
                    <Link href={`/blog/${post.slug}`} className="text-sm font-medium text-gray-900 hover:text-gray-700">
                      Read more →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/blog" className="btn btn-secondary">
              View All Posts
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
