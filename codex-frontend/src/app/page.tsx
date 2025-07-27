'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import MagicBento from '@/components/MagicBento'

interface Post {
  id: number
  title: string
  slug: string
  excerpt?: string
  content: string
  author: {
    username: string
    firstName?: string
    lastName?: string
  }
  category?: {
    name: string
    slug: string
  }
  createdAt: string
  publishedAt?: string
}

export default function HomePage() {
  const { user, isAdmin } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const response = await api.getPosts()
      if (response && Array.isArray(response)) {
        // Convert API response to our Post interface
        const convertedPosts: Post[] = response.map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content || '',
          author: post.author,
          category: post.category,
          createdAt: post.createdAt,
          publishedAt: post.publishedAt
        }))
        setPosts(convertedPosts.slice(0, 6)) // Show only 6 posts
      }
    } catch (error) {
      // Silently handle error - posts will remain empty array
    } finally {
      setLoading(false)
    }
  }

  const handleBlogClick = (blog: { slug?: string }) => {
    if (blog.slug) {
      window.location.href = `/blog/${blog.slug}`
    }
  }

  // Convert posts to MagicBento format
  const convertedBlogs = posts.map(post => ({
    color: "#ffffff",
    title: post.title,
    description: post.excerpt || "Click to read more about this topic",
    label: post.category?.name || "General",
    author: `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() || post.author.username,
    date: new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    readTime: "5 min read",
    category: post.category?.name || "General",
    slug: post.slug
  }))

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Navigation */}
      <nav className="nav">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              CodexCMS
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="nav-link active">Home</Link>
              <Link href="/blog" className="nav-link">Blog</Link>
              {user && (
                <Link href="/create-post" className="nav-link">Create Post</Link>
              )}
              {user ? (
                <div className="flex items-center gap-4">
                  {isAdmin && (
                    <Link href="/admin" className="btn-primary btn-sm">Admin</Link>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user.firstName?.[0] || user.username?.[0] || 'U'}
                    </div>
                    <span className="text-caption">Hi, {user.firstName || user.username}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login" className="btn-ghost btn-sm">Sign In</Link>
                  <Link href="/register" className="btn-primary btn-sm">Get Started</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-lg bg-gradient-to-br from-gray-50 to-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-hero text-gray-900 mb-6">
              Beautiful Content
              <span className="block text-primary-600">Made Simple</span>
            </h1>
            <p className="text-body-lg max-w-2xl mx-auto mb-8">
              Create, manage, and publish your content with our modern CMS platform. 
              Designed for creators who value simplicity and elegance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <>
                  <Link href="/create-post" className="btn-primary btn-lg">
                    Create Your First Post
                  </Link>
                  <Link href="/blog" className="btn-secondary btn-lg">
                    Browse Content
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/register" className="btn-primary btn-lg">
                    Start Creating
                  </Link>
                  <Link href="/blog" className="btn-secondary btn-lg">
                    Explore Posts
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-title-lg text-gray-900 mb-4">
              Everything you need to create
            </h2>
            <p className="text-body-lg">
              From writing to publishing, our platform handles it all with elegance and simplicity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card text-center">
              <div className="card-content">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-title mb-2">Rich Editor</h3>
                <p className="text-body">Write with a beautiful, distraction-free editor that adapts to your style.</p>
              </div>
            </div>
            
            <div className="card text-center">
              <div className="card-content">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-title mb-2">Media Management</h3>
                <p className="text-body">Upload, organize, and manage your images and files with ease.</p>
              </div>
            </div>
            
            <div className="card text-center">
              <div className="card-content">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-title mb-2">Fast Publishing</h3>
                <p className="text-body">Publish instantly or schedule your content for the perfect timing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      {posts.length > 0 && (
        <section className="section bg-gray-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-title-lg text-gray-900 mb-4">
                Latest from our blog
              </h2>
              <p className="text-body-lg">
                Discover insights, tutorials, and stories from our community of creators.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card">
                    <div className="card-content">
                      <div className="skeleton h-4 w-3/4 mb-3 rounded"></div>
                      <div className="skeleton h-3 w-full mb-2 rounded"></div>
                      <div className="skeleton h-3 w-2/3 mb-4 rounded"></div>
                      <div className="skeleton h-3 w-1/2 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <MagicBento
                blogs={convertedBlogs}
                onCardClick={handleBlogClick}
                glowColor="var(--primary-500)"
              />
            )}

            <div className="text-center mt-12">
              <Link href="/blog" className="btn-primary">
                View All Posts
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!user && (
        <section className="section">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white text-center">
                <div className="card-content">
                  <h2 className="text-title-lg mb-4">
                    Ready to start creating?
                  </h2>
                  <p className="text-body-lg text-primary-50 mb-8">
                    Join thousands of creators who trust CodexCMS for their content needs.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/register" className="btn-secondary">
                      Create Account
                    </Link>
                    <Link href="/login" className="btn-ghost text-white hover:bg-primary-400">
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container">
          <div className="section-sm">
            <div className="text-center">
              <h3 className="text-title text-white mb-4">CodexCMS</h3>
              <p className="text-body text-gray-400 mb-6">
                Beautiful content management made simple.
              </p>
              <div className="flex justify-center items-center gap-6">
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
                <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                  Login
                </Link>
                {user && isAdmin && (
                  <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                    Admin
                  </Link>
                )}
              </div>
              <div className="border-t border-gray-800 mt-8 pt-6">
                <p className="text-caption text-gray-500">
                  © 2024 CodexCMS. Made with ❤️ for creators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
