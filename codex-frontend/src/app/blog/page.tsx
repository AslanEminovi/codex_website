'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { api } from '@/lib/api'

// Mock data as fallback
const mockPosts = [
  {
    id: 1,
    title: "Welcome to CodexCMS",
    slug: "welcome-to-codexcms",
    excerpt: "Discover the power of modern content management with our beautiful, intuitive platform designed for creators.",
    featuredImageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
    publishedAt: "2024-01-15",
    author: { firstName: "John", lastName: "Doe" },
    category: { name: "Technology", slug: "technology" },
    viewCount: 1250,
    readTime: 5
  },
  {
    id: 2,
    title: "Building Modern Web Applications",
    slug: "building-modern-web-applications",
    excerpt: "Learn how to create stunning web experiences with the latest technologies, frameworks, and best practices.",
    featuredImageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
    publishedAt: "2024-01-12",
    author: { firstName: "Jane", lastName: "Smith" },
    category: { name: "Development", slug: "development" },
    viewCount: 890,
    readTime: 8
  },
  {
    id: 3,
    title: "The Future of Content Creation",
    slug: "future-of-content-creation",
    excerpt: "Explore how AI and automation are revolutionizing the way we create, manage, and distribute content.",
    featuredImageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    publishedAt: "2024-01-10",
    author: { firstName: "Alex", lastName: "Johnson" },
    category: { name: "Innovation", slug: "innovation" },
    viewCount: 675,
    readTime: 6
  }
]

export default function BlogPage() {
  const [posts, setPosts] = useState(mockPosts)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const response = await api.getPosts()
      if (response && Array.isArray(response)) {
        setPosts(response)
      }
    } catch (error) {
      console.error('Failed to load posts from API:', error)
      // Keep mock data if API fails
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
              <Link href="/login" className="btn btn-primary">Login</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Our Blog
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover insights, tutorials, and stories about modern web development and content management.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto mb-12">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-12"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="section bg-gray-50">
        <div className="container">
          {loading ? (
            <div className="text-center">
              <div className="text-gray-500">Loading posts...</div>
            </div>
          ) : (
            <>
              <div className="grid md-grid-cols-2 lg-grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <article key={post.id} className="card">
                    <Image
                      src={post.featuredImageUrl || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80'}
                      alt={post.title}
                      width={400}
                      height={240}
                      className="w-full h-48 object-cover"
                    />
                    <div className="card-content">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="badge badge-gray">
                          {post.category?.name || 'General'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                      </div>
                      
                      <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        <Link href={`/blog/${post.slug}`} className="hover:text-gray-700">
                          {post.title}
                        </Link>
                      </h2>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <span>
                            By {post.author?.firstName || 'CodexCMS'} {post.author?.lastName || 'Team'}
                          </span>
                        </div>
                        
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="text-sm font-medium text-gray-900 hover:text-gray-700 flex items-center"
                        >
                          Read more
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredPosts.length === 0 && !loading && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
                  <p className="text-gray-600">Try adjusting your search terms.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
} 