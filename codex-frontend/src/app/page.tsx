'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Shield, Users, TrendingUp, Edit3, Eye, Calendar, User } from 'lucide-react'

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
  viewCount?: number
}

export default function HomePage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const response = await api.getPosts()
      if (response && Array.isArray(response)) {
        const convertedPosts: Post[] = response.map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content || '',
          author: post.author,
          category: post.category,
          createdAt: post.createdAt,
          viewCount: post.viewCount || 0
        }))
        setPosts(convertedPosts.slice(0, 6))
      }
    } catch {
      // Silently handle error - posts will remain empty array
    } finally {
      setLoading(false)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="nav relative z-50">
        <div className="container">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">CodexCMS</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="nav-link active">Home</Link>
              <Link href="/blog" className="nav-link">Blog</Link>
              {user && <Link href="/admin" className="nav-link">Dashboard</Link>}
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-lg border">
                    <div className="w-8 h-8 bg-gradient-brand rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-dark-700">
                      {user.firstName || user.username}
                    </span>
                  </div>
                  <Link href="/create-post" className="btn-primary btn-sm">
                    <Edit3 className="w-4 h-4" />
                    Create
                  </Link>
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
      <section className="section-lg relative z-10">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 mb-8">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <span className="text-sm font-medium text-dark-600">Modern Content Management</span>
              </div>
              
              <h1 className="text-hero mb-6">
                Create Amazing Content
                <br />
                <span className="text-accent-500">Effortlessly</span>
              </h1>
              
              <p className="text-subtitle max-w-2xl mx-auto mb-10">
                The most beautiful and intuitive content management system. 
                Create, publish, and manage your content with style and simplicity.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Link href={user ? "/create-post" : "/register"} className="btn-primary btn-lg">
                  {user ? "Start Writing" : "Get Started Free"}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/blog" className="btn-secondary btn-lg">
                  <Eye className="w-5 h-5" />
                  Explore Content
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section relative z-10">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-display mb-4">Why Choose CodexCMS?</h2>
            <p className="text-subtitle max-w-2xl mx-auto">
              Everything you need to create, manage, and publish amazing content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card group slide-in">
              <div className="card-content text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-title mb-3">Lightning Fast</h3>
                <p className="text-body">
                  Built with modern technologies for blazing fast performance and seamless user experience.
                </p>
              </div>
            </div>

            <div className="card group slide-in delay-100">
              <div className="card-content text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-title mb-3">Secure & Reliable</h3>
                <p className="text-body">
                  Enterprise-grade security with robust authentication and data protection measures.
                </p>
              </div>
            </div>

            <div className="card group slide-in delay-200">
              <div className="card-content text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-title mb-3">Collaborative</h3>
                <p className="text-body">
                  Work together with your team, manage permissions, and create content collaboratively.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="section relative z-10">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-display mb-2">Latest Posts</h2>
              <p className="text-body">Discover the newest content from our community</p>
            </div>
            <Link href="/blog" className="btn-secondary">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card">
                  <div className="card-content">
                    <div className="skeleton h-6 w-20 rounded mb-4"></div>
                    <div className="skeleton h-8 w-full rounded mb-3"></div>
                    <div className="skeleton h-20 w-full rounded mb-4"></div>
                    <div className="flex items-center gap-3">
                      <div className="skeleton h-8 w-8 rounded-full"></div>
                      <div className="skeleton h-4 w-24 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <div className="card h-full">
                    <div className="card-content">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-gradient-brand text-white text-xs font-medium rounded-full">
                          {post.category?.name || 'General'}
                        </span>
                        <div className="flex items-center gap-1 text-dark-400">
                          <Eye className="w-3 h-3" />
                          <span className="text-xs">{post.viewCount}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-title mb-3 group-hover:text-brand-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-body mb-6 line-clamp-3">
                        {post.excerpt || post.content.substring(0, 150) + '...'}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-brand rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-dark-700">
                              {getAuthorName(post.author)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-dark-400">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs">{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-brand rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
                <Edit3 className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-title mb-3">No Posts Yet</h3>
              <p className="text-body mb-6">Be the first to create amazing content!</p>
              {user && (
                <Link href="/create-post" className="btn-primary">
                  Create Your First Post
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="section bg-gradient-hero relative z-10">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-display mb-6">Ready to Start Creating?</h2>
              <p className="text-subtitle mb-8 opacity-90">
                Join thousands of creators who trust CodexCMS for their content management needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register" className="btn-secondary btn-lg">
                  <Users className="w-5 h-5" />
                  Get Started Free
                </Link>
                <Link href="/blog" className="btn-ghost btn-lg border-white/20 text-white hover:bg-white/10">
                  <TrendingUp className="w-5 h-5" />
                  Explore Content
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="section-sm bg-dark-800 text-dark-200 relative z-10">
        <div className="container">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">CodexCMS</span>
            </div>
            <p className="text-dark-400 mb-6">
              Beautiful content management made simple.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
