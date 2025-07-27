'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'

interface UpdatePostData {
  title: string
  content: string
  excerpt: string
  featuredImageUrl: string
  status: string
  tags: string[]
}

export default function EditPostPage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImageUrl: '',
    status: 'Draft',
    categoryId: '',
    tags: ''
  })
  const [loading, setLoading] = useState(false)
  const [loadingPost, setLoadingPost] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (params?.id && user) {
      loadPost()
    }
  }, [params?.id, user]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadPost = async () => {
    try {
      const post = await api.getPostById(Number(params?.id))
      if (post) {
        setFormData({
          title: post.title || '',
          content: post.content || '',
          excerpt: post.excerpt || '',
          featuredImageUrl: post.featuredImageUrl || '',
          status: post.status || 'Draft',
          categoryId: post.category?.id?.toString() || '',
          tags: post.tags?.map(tag => tag.name).join(', ') || ''
        })
      }
    } catch (error) {
      console.error('Failed to load post:', error)
      setError('Failed to load post.')
    } finally {
      setLoadingPost(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.title.trim()) {
      setError('Title is required')
      setLoading(false)
      return
    }

    if (!formData.content.trim()) {
      setError('Content is required')
      setLoading(false)
      return
    }

    try {
      const postData: UpdatePostData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || formData.content.substring(0, 200) + '...',
        featuredImageUrl: formData.featuredImageUrl || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
        status: formData.status,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }

              await api.updatePost(Number(params?.id), {
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt,
          categoryId: postData.categoryId
        })
      setSuccess(true)
      
      setTimeout(() => {
        router.push('/blog')
      }, 2000)
      
    } catch (error) {
      console.error('Failed to update post:', error)
      setError('Failed to update post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (authLoading || loadingPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="nav">
          <div className="container">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                CodexCMS
              </Link>
              <Link href="/login" className="btn-primary">Login</Link>
            </div>
          </div>
        </nav>
        
        <div className="container py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Login Required</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to edit posts.</p>
          <Link href="/login" className="btn btn-primary">
            Login to Continue
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="card">
            <div className="card-content text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Post Updated!</h2>
              <p className="text-gray-600 mb-4">Your blog post has been successfully updated.</p>
              <p className="text-sm text-gray-500">Redirecting to blog...</p>
            </div>
          </div>
        </div>
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
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/blog" className="nav-link">Blog</Link>
              <Link href="/create-post" className="nav-link">Create Post</Link>
                              <button onClick={() => {}} className="btn-secondary">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Edit Post Form */}
      <section className="section">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Edit Post</h1>
              <p className="text-lg text-gray-600">Update your blog post</p>
            </div>

            <div className="card">
              <div className="card-content">
                {error && (
                  <div className="alert alert-error">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter your post title"
                      required
                      className="input"
                    />
                  </div>

                  <div>
                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt
                    </label>
                    <input
                      id="excerpt"
                      name="excerpt"
                      type="text"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      placeholder="Brief description of your post (optional)"
                      className="input"
                    />
                  </div>

                  <div>
                    <label htmlFor="featuredImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                      Featured Image URL
                    </label>
                    <input
                      id="featuredImageUrl"
                      name="featuredImageUrl"
                      type="url"
                      value={formData.featuredImageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg (optional)"
                      className="input"
                    />
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Write your post content here..."
                      required
                      rows={12}
                      className="input resize-y"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="input"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <input
                        id="tags"
                        name="tags"
                        type="text"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="tag1, tag2, tag3"
                        className="input"
                      />
                      <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="submit" 
                      className="btn-primary w-full" 
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Post'}
                    </button>
                    
                    <Link href="/blog" className="btn-secondary">
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 