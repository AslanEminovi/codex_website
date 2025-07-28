'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import { Navigation } from '@/components/navigation'
import { Search, Filter, Eye, Calendar, User, BookOpen, Tag, TrendingUp, Clock, ArrowRight, Sparkles, Edit3, Heart, Share2, Bookmark, Star } from 'lucide-react'

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
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'oldest'>('latest')
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())

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

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.viewCount || 0) - (a.viewCount || 0)
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
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

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Modern Background Pattern */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.03),transparent_30%),radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.03),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(120,200,255,0.03),transparent_30%)]"></div>
        </div>

        <Navigation />
        
        <div className="relative z-10 pt-24 pb-40">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Header Skeleton */}
              <div className="text-center mb-24">
                <div className="skeleton h-6 w-48 mx-auto rounded-full mb-8"></div>
                <div className="skeleton h-16 w-96 mx-auto rounded-xl mb-6"></div>
                <div className="skeleton h-6 w-128 mx-auto rounded-lg mb-16"></div>
                <div className="skeleton h-16 w-full max-w-4xl mx-auto rounded-2xl"></div>
              </div>
              
              {/* Posts Grid Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-slate-200 rounded-3xl h-80"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Enhanced Modern Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.03),transparent_30%),radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.03),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(120,200,255,0.03),transparent_30%)]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-cyan-200/15 to-blue-200/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Navigation />

      {/* Enhanced Hero Section */}
      <section className="relative z-10 pt-24 pb-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-full mb-10 hover:shadow-lg transition-all duration-300 group">
                <BookOpen className="w-4 h-4 text-blue-600 group-hover:rotate-12 transition-transform" />
                <span className="text-sm font-semibold text-blue-900">Discover Amazing Stories</span>
                <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-10 leading-none">
                <span className="block text-slate-900">Explore Our</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">Blog Posts</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-16 leading-relaxed">
                Discover insights, tutorials, and stories from our community of passionate creators and thought leaders.
              </p>

              {/* Enhanced Search and Filter */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/80 backdrop-blur-lg border border-slate-200 rounded-3xl p-10 mb-12 shadow-xl">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Search Input */}
                    <div className="relative flex-1">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search for amazing content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800 placeholder-slate-500"
                      />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                      <Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="pl-14 pr-10 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none min-w-[200px] text-slate-800"
                      >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                          <option key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                      <TrendingUp className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular' | 'oldest')}
                        className="pl-14 pr-10 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none min-w-[180px] text-slate-800"
                      >
                        <option value="latest">Latest</option>
                        <option value="popular">Most Popular</option>
                        <option value="oldest">Oldest</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Enhanced Category Pills */}
                {categories.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-4 mb-16">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 group ${
                        !selectedCategory 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl' 
                          : 'bg-white/60 text-slate-700 hover:bg-white/80 hover:shadow-md'
                      }`}
                    >
                      <span className="group-hover:scale-105 transition-transform">All Posts</span>
                    </button>
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category.toLowerCase().replace(/\s+/g, '-'))}
                        className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 group ${
                          selectedCategory === category.toLowerCase().replace(/\s+/g, '-')
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                            : 'bg-white/60 text-slate-700 hover:bg-white/80 hover:shadow-md'
                        }`}
                      >
                        <Tag className="w-3 h-3 inline mr-2 group-hover:scale-110 transition-transform" />
                        <span className="group-hover:scale-105 transition-transform">{category}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Posts Grid Section */}
      <section className="relative z-10 pb-40">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {sortedPosts.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-20">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                      {searchTerm || selectedCategory ? 'Search Results' : 'Latest Stories'}
                    </h2>
                    <p className="text-lg text-slate-600">
                      {sortedPosts.length} {sortedPosts.length === 1 ? 'story' : 'stories'} found
                    </p>
                  </div>
                  
                  {!searchTerm && !selectedCategory && (
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-900">Trending Now</span>
                    </div>
                  )}
                </div>

                {/* Enhanced Featured Post (First Post) */}
                {sortedPosts.length > 0 && !searchTerm && !selectedCategory && (
                  <div className="mb-20">
                    <Link href={`/blog/${sortedPosts[0].slug}`} className="group block">
                      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:border-slate-300 transition-all duration-500 hover:-translate-y-1 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10 p-12">
                          <div className="flex items-center gap-3 mb-8">
                            <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full">
                              Featured
                            </span>
                            <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-900 text-sm font-semibold rounded-full">
                              {sortedPosts[0].category?.name || 'General'}
                            </span>
                          </div>
                          
                          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 group-hover:text-blue-600 transition-colors">
                            {sortedPosts[0].title}
                          </h3>
                          
                          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                            {sortedPosts[0].excerpt || sortedPosts[0].content.substring(0, 200) + '...'}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-slate-900">
                                  {getAuthorName(sortedPosts[0].author)}
                                </p>
                                <div className="flex items-center gap-4 text-slate-500">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(sortedPosts[0].createdAt)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{getReadTime(sortedPosts[0].content)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    <span>{sortedPosts[0].viewCount}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Enhanced Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {(sortedPosts.slice(searchTerm || selectedCategory ? 0 : 1)).map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                      <article className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:border-slate-300 transition-all duration-500 hover:-translate-y-2 h-full relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10 p-10">
                          {/* Category and Views */}
                          <div className="flex items-center gap-3 mb-6">
                            <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-900 text-sm font-semibold rounded-full">
                              {post.category?.name || 'General'}
                            </span>
                            <div className="flex items-center gap-1 text-slate-500">
                              <Eye className="w-3 h-3" />
                              <span className="text-sm">{post.viewCount || 0}</span>
                            </div>
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          
                          {/* Excerpt */}
                          <p className="text-slate-600 mb-8 line-clamp-3 leading-relaxed">
                            {post.excerpt || post.content.substring(0, 120) + '...'}
                          </p>
                          
                          {/* Meta */}
                          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  {getAuthorName(post.author)}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-slate-500">
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
                            
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>

                {/* Enhanced Load More Button */}
                <div className="text-center mt-20">
                  <button className="group px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-2xl hover:border-slate-300 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center gap-2">
                      Load More Stories
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-24">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-10">
                  <BookOpen className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">No Stories Found</h3>
                <p className="text-slate-600 mb-10 max-w-md mx-auto">
                  {searchTerm || selectedCategory 
                    ? "Try adjusting your search criteria or explore different categories to discover amazing content."
                    : "No stories have been published yet. Be the first to share your amazing content!"
                  }
                </p>
                {user && (
                  <Link 
                    href="/create-post" 
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1"
                  >
                    <Edit3 className="w-5 h-5" />
                    Create Your First Story
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      {!user && (
        <section className="relative z-10 py-40 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_30%),radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.1),transparent_30%)]"></div>
          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Ready to Share Your
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Amazing Story?</span>
              </h2>
              <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                Join our community of passionate writers and start sharing your unique perspective with the world.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link 
                  href="/register" 
                  className="group px-8 py-4 bg-white text-slate-900 font-semibold rounded-2xl hover:bg-slate-100 transition-colors relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Get Started Free
                  </span>
                </Link>
                <Link 
                  href="/login" 
                  className="group px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-2">
                    <ArrowRight className="w-5 h-5" />
                    Sign In
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Footer */}
      <footer className="relative z-10 py-20 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-slate-900">CodexCMS</span>
              </Link>
              <p className="text-slate-600 mb-10">Beautiful content management made simple.</p>
              <div className="flex items-center justify-center gap-8 text-slate-600">
                <Link href="/blog" className="hover:text-slate-900 transition-colors">Blog</Link>
                <Link href="/about" className="hover:text-slate-900 transition-colors">About</Link>
                <Link href="/contact" className="hover:text-slate-900 transition-colors">Contact</Link>
                <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 