'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import { Navigation } from '@/components/navigation'
import { Search, Filter, Eye, Calendar, User, BookOpen, Tag, TrendingUp, Clock, ArrowRight } from 'lucide-react'

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

export default function BlogPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const response = await api.getPosts()
      if (response && Array.isArray(response)) {
        const convertedPosts: Post[] = response.map(post => ({
          ...post,
          content: post.content || ''
        }))
        setPosts(convertedPosts)
      }
    } catch {
      // Silently handle error
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || post.category?.slug === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(
    new Set(posts.map(post => post.category?.name).filter((name): name is string => Boolean(name)))
  )

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

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(' ').length
    const readTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readTime} min read`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Navigation />
        <div className="container py-16">
          {/* Header Skeleton */}
          <div className="text-center mb-16">
            <div className="skeleton h-12 w-64 mx-auto rounded mb-4"></div>
            <div className="skeleton h-6 w-96 mx-auto rounded mb-8"></div>
            <div className="skeleton h-12 w-80 mx-auto rounded"></div>
          </div>
          
          {/* Posts Grid Skeleton */}
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

      {/* Hero Section */}
      <section className="section relative z-10">
        <div className="container">
          <div className="text-center mb-16 fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <BookOpen className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-medium text-dark-600">Discover Amazing Content</span>
            </div>
            
            <h1 className="text-hero mb-6">
              Explore Our
              <br />
              <span className="text-accent-500">Blog Posts</span>
            </h1>
            
            <p className="text-subtitle max-w-2xl mx-auto mb-12">
              Discover insights, tutorials, and stories from our community of creators
            </p>

            {/* Search and Filter */}
            <div className="max-w-4xl mx-auto">
              <div className="glass rounded-2xl p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/80 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="pl-12 pr-8 py-3 bg-white/80 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all appearance-none min-w-[180px]"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Category Pills */}
              {categories.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      !selectedCategory 
                        ? 'bg-gradient-brand text-white shadow-lg' 
                        : 'bg-white/60 text-dark-600 hover:bg-white/80'
                    }`}
                  >
                    All Posts
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category.toLowerCase().replace(/\s+/g, '-'))}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === category.toLowerCase().replace(/\s+/g, '-')
                          ? 'bg-gradient-brand text-white shadow-lg'
                          : 'bg-white/60 text-dark-600 hover:bg-white/80'
                      }`}
                    >
                      <Tag className="w-3 h-3 inline mr-1" />
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="section-sm relative z-10">
        <div className="container">
          {filteredPosts.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-title text-dark-900">
                    {searchTerm || selectedCategory ? 'Search Results' : 'Latest Posts'}
                  </h2>
                  <p className="text-body text-dark-600">
                    {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
                  </p>
                </div>
                
                {!searchTerm && !selectedCategory && (
                  <div className="flex items-center gap-2 text-dark-500">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Trending</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                    <article className="card h-full slide-in">
                      <div className="card-content">
                        {/* Category Badge */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 bg-gradient-brand text-white text-xs font-medium rounded-full">
                            {post.category?.name || 'General'}
                          </span>
                          <div className="flex items-center gap-1 text-dark-400">
                            <Eye className="w-3 h-3" />
                            <span className="text-xs">{post.viewCount || 0}</span>
                          </div>
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-title mb-3 group-hover:text-brand-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        
                        {/* Excerpt */}
                        <p className="text-body mb-6 line-clamp-3">
                          {post.excerpt || post.content.substring(0, 150) + '...'}
                        </p>
                        
                        {/* Meta */}
                        <div className="flex items-center justify-between pt-4 border-t border-dark-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-brand rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-dark-700">
                                {getAuthorName(post.author)}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-dark-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{formatDate(post.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{getReadTime(post.content)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <ArrowRight className="w-4 h-4 text-dark-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Load More Button */}
              <div className="text-center mt-16">
                <button className="btn-secondary btn-lg">
                  Load More Posts
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-brand rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-title mb-3">No Posts Found</h3>
              <p className="text-body mb-6">
                {searchTerm || selectedCategory 
                  ? "Try adjusting your search or filter criteria"
                  : "No posts have been published yet. Be the first to create content!"
                }
              </p>
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
              <h2 className="text-display mb-6">Ready to Share Your Story?</h2>
              <p className="text-subtitle mb-8 opacity-90">
                Join our community of creators and start publishing your own amazing content.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register" className="btn-secondary btn-lg">
                  <User className="w-5 h-5" />
                  Get Started Free
                </Link>
                <Link href="/login" className="btn-ghost btn-lg border-white/20 text-white hover:bg-white/10">
                  <ArrowRight className="w-5 h-5" />
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
} 