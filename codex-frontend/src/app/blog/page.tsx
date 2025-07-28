'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import { Navigation } from '@/components/navigation'
import { Search, Calendar, User, Eye, Clock } from 'lucide-react'

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
    return matchesSearch
  })

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
      <div className="min-h-screen bg-white">
        <Navigation />
        
        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="bg-gray-200 h-8 w-48 rounded mb-8"></div>
                <div className="bg-gray-200 h-12 w-full rounded mb-8"></div>
                <div className="space-y-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-200 h-32 rounded"></div>
                  ))}
                </div>
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

      {/* Header */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Posts</h1>
            <p className="text-gray-600 mb-8">
              Discover interesting stories and insights from our community.
            </p>
            
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {filteredPosts.length > 0 ? (
              <div className="space-y-8">
                {filteredPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                    <article className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {post.category?.name || 'General'}
                        </span>
                      </div>
                      
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h2>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {post.excerpt || post.content.substring(0, 200) + '...'}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{getAuthorName(post.author)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{getReadTime(post.content)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.viewCount || 0} views</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {searchTerm ? 'No posts found' : 'No posts yet'}
                </h3>
                <p className="text-gray-600 mb-8">
                  {searchTerm 
                    ? 'Try adjusting your search terms.'
                    : 'Be the first to create a post and start sharing your thoughts!'
                  }
                </p>
                {user && !searchTerm && (
                  <Link 
                    href="/create-post" 
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Your First Post
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Our Blog</h3>
            <p className="text-gray-400 mb-8">
              A simple blog platform for sharing stories and ideas.
            </p>
            <div className="flex items-center justify-center gap-8 text-gray-400">
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