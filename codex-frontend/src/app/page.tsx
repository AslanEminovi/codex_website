'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import MagicBento, { BentoCardProps } from '@/components/MagicBento'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [blogs, setBlogs] = useState<BentoCardProps[]>([])
  const [loading, setLoading] = useState(true)
  const { user, isAdmin, loading: authLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const posts = await api.getPosts({ pageSize: 6 })
      const convertedBlogs: BentoCardProps[] = posts.map(post => ({
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
        readTime: "5 min read", // Default since API doesn't provide this
        category: post.category?.name || "General",
        slug: post.slug
      }))
      setBlogs(convertedBlogs)
    } catch (error) {
      console.error('Failed to load posts:', error)
      // If API fails, show empty state instead of mock data
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  const handleBlogClick = (blog: BentoCardProps) => {
    if (blog.slug) {
      router.push(`/blog/${blog.slug}`)
    }
  }

  if (!mounted || authLoading) {
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
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight mx-auto">
                Modern Content Management
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
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
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Latest Posts
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover insights, tutorials, and stories about modern web development and technology.
              </p>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="text-gray-500">Loading posts...</div>
              </div>
            ) : blogs.length > 0 ? (
              <>
                <div className="flex justify-center">
                  <MagicBento 
                    textAutoHide={true}
                    enableStars={true}
                    enableSpotlight={true}
                    enableBorderGlow={true}
                    enableTilt={true}
                    enableMagnetism={true}
                    clickEffect={true}
                    spotlightRadius={300}
                    particleCount={8}
                    glowColor="17, 24, 39"
                    blogs={blogs}
                    onCardClick={handleBlogClick}
                  />
                </div>
                
                <div className="text-center mt-12">
                  <Link href="/blog" className="btn btn-secondary">
                    View All Posts
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts available</h3>
                <p className="text-gray-600 mb-8">
                  No posts have been published yet. {user && "Create some posts to get started!"}
                </p>
                {user && (
                  <Link href="/create-post" className="btn btn-primary">
                    Create Your First Post
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
