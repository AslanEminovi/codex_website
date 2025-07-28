'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import { Navigation } from '@/components/navigation'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import Link from 'next/link'

export default function CreatePostPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(false)

  // Redirect if not logged in
  if (!user) {
    router.push('/login')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      alert('Please fill in the title and content')
      return
    }

    setLoading(true)
    
    try {
      const postData = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        category: category.trim() || undefined
      }

      const response = await api.createPost(postData)
      
      if (response && response.slug) {
        router.push(`/blog/${response.slug}`)
      } else {
        alert('Post created successfully!')
        router.push('/blog')
      }
    } catch (error) {
      alert('Failed to create post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = () => {
    setPreview(!preview)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Header */}
      <div className="py-6 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <Link 
                href="/blog" 
                className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePreview}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>{preview ? 'Edit' : 'Preview'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Post</h1>

            {preview ? (
              /* Preview Mode */
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="mb-6">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {category || 'General'}
                  </span>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {title || 'Your Post Title'}
                </h2>
                
                {excerpt && (
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    {excerpt}
                  </p>
                )}
                
                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {content || 'Your post content will appear here...'}
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>By {user?.firstName || user?.username || 'You'}</span>
                    <span>•</span>
                    <span>Just now</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your post title..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Technology, Lifestyle, Tutorial..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="A brief summary of your post..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Content */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your post content here..."
                    rows={20}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono"
                    required
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    {content.length} characters
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Link
                      href="/blog"
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={loading || !title.trim() || !content.trim()}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'Publishing...' : 'Publish Post'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

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