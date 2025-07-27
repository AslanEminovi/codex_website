'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import { Navigation } from '@/components/navigation'

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
  viewCount?: number
}

export default function BlogPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

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
          publishedAt: post.publishedAt,
          viewCount: post.viewCount || 0
        }))
        setPosts(convertedPosts)
      }
    } catch {
      // Silently handle error - posts will remain empty array
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category?.slug === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(posts.map(post => post.category?.slug).filter((slug): slug is string => Boolean(slug))))]

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="skeleton h-8 w-1/3 rounded"></div>
              <div className="skeleton h-12 w-full rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card">
                    <div className="card-content">
                      <div className="skeleton h-6 w-3/4 mb-3 rounded"></div>
                      <div className="skeleton h-4 w-full mb-2 rounded"></div>
                      <div className="skeleton h-4 w-2/3 mb-4 rounded"></div>
                      <div className="skeleton h-4 w-1/2 rounded"></div>
                    </div>
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
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="section bg-gradient-to-br from-gray-50 to-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-hero text-gray-900 mb-6">
              Our Blog
            </h1>
            <p className="text-body-lg max-w-2xl mx-auto mb-8">
              Discover insights, tutorials, and stories from our community of creators and developers.
            </p>
            
            {/* Search and Filter */}
            <div className="max-w-xl mx-auto space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-12"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'All Posts' : category?.charAt(0).toUpperCase() + category?.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="section">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-title text-gray-900 mb-2">No posts found</h3>
                <p className="text-body text-gray-600 mb-6">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'No blog posts have been published yet.'}
                </p>
                {user && (
                  <Link href="/create-post" className="btn-primary">
                    Create First Post
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-title-lg text-gray-900">
                    {searchTerm ? `Search results for "${searchTerm}"` : 'Latest Posts'}
                    <span className="text-body text-gray-500 ml-2">
                      ({filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'})
                    </span>
                  </h2>
                  
                  {user && (
                    <Link href="/create-post" className="btn-primary btn-sm flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      New Post
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredPosts.map((post) => (
                    <article key={post.id} className="card group">
                      <div className="card-content">
                        {/* Category Badge */}
                        {post.category && (
                          <div className="mb-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                              {post.category.name}
                            </span>
                          </div>
                        )}

                        {/* Title */}
                        <h3 className="text-title text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                          <Link href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h3>

                        {/* Excerpt */}
                        <p className="text-body text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt || post.content.substring(0, 150) + '...'}
                        </p>

                        {/* Meta Information */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {post.author.firstName?.[0] || post.author.username?.[0] || 'A'}
                            </div>
                            <div>
                              <p className="text-caption text-gray-900 font-medium">
                                {`${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() || post.author.username}
                              </p>
                              <p className="text-caption text-gray-500">
                                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-caption text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {post.viewCount || 0}
                            </span>
                            <span>5 min read</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Load More Button (if needed) */}
                {filteredPosts.length >= 10 && (
                  <div className="text-center mt-12">
                    <button className="btn-secondary">
                      Load More Posts
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="section bg-gray-50">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white text-center">
                <div className="card-content">
                  <h2 className="text-title-lg mb-4">
                    Ready to start writing?
                  </h2>
                  <p className="text-body-lg text-primary-50 mb-8">
                    Join our community and share your knowledge with the world.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/register" className="btn-secondary">
                      Get Started
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
    </div>
  )
} 