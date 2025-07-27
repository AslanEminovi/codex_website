'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'

export default function CreatePostPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    categoryId: 1
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.title || !formData.content) {
      setError('Please fill in title and content')
      setLoading(false)
      return
    }

    try {
      const response = await api.createPost({
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || undefined,
        category: formData.categoryId ? { id: formData.categoryId, name: '', slug: '' } : undefined
      })
      
      if (response) {
        setSuccess(true)
      } else {
        setError('Failed to create post. Please try again.')
      }
    } catch (error: unknown) {
      console.error('Post creation error:', error)
      setError(error instanceof Error ? error.message : 'Failed to create post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'categoryId' ? parseInt(value) : value
    }))
    setError('')
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-4xl p-4">
          <div className="card">
            <div className="card-content">
              <div className="animate-pulse space-y-6">
                <div className="skeleton h-6 w-1/3 rounded"></div>
                <div className="skeleton h-12 w-full rounded"></div>
                <div className="skeleton h-32 w-full rounded"></div>
                <div className="skeleton h-64 w-full rounded"></div>
                <div className="skeleton h-12 w-32 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="card text-center">
            <div className="card-content">
              <div className="w-16 h-16 bg-success-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-title-lg text-gray-900 mb-4">Post Published!</h2>
              <p className="text-body text-gray-600 mb-6">
                Your post has been successfully published and is now live.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/blog" className="btn-primary">
                  View All Posts
                </Link>
                <Link href="/create-post" className="btn-secondary">
                  Create Another Post
                </Link>
              </div>
              <div className="mt-6">
                <Link href="/" className="text-caption text-gray-500 hover:text-gray-700">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold text-gray-900">
                CodexCMS
              </Link>
              <div className="hidden md-block w-px h-6 bg-gray-300"></div>
              <h1 className="hidden md-block text-gray-600">Create New Post</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/blog" className="btn-ghost btn-sm">
                My Posts
              </Link>
              <Link href="/" className="btn-secondary btn-sm">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="card">
            <div className="card-content">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Error Message */}
                {error && (
                  <div className="alert alert-error">
                    {error}
                  </div>
                )}

                {/* Title Section */}
                <div className="space-y-2">
                  <label htmlFor="title" className="form-label">
                    Post Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter an engaging title for your post..."
                    required
                    className="form-input text-xl font-semibold"
                    style={{ fontSize: '1.25rem', padding: '1rem 1.5rem' }}
                  />
                </div>

                {/* Excerpt Section */}
                <div className="space-y-2">
                  <label htmlFor="excerpt" className="form-label">
                    Excerpt (Optional)
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    placeholder="Write a brief summary of your post..."
                    rows={3}
                    className="form-textarea"
                  />
                  <p className="text-caption">
                    A short description that will appear in post previews and search results.
                  </p>
                </div>

                {/* Category Section */}
                <div className="space-y-2">
                  <label htmlFor="categoryId" className="form-label">
                    Category
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value={1}>General</option>
                    <option value={2}>Technology</option>
                  </select>
                </div>

                {/* Content Section */}
                <div className="space-y-2">
                  <label htmlFor="content" className="form-label">
                    Content
                  </label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Toolbar */}
                    <div className="bg-gray-50 border-b border-gray-200 p-3">
                      <div className="flex items-center gap-2 text-caption text-gray-600">
                        <span>💡 Tip:</span>
                        <span>Use Markdown syntax for formatting</span>
                        <div className="ml-auto flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <strong>**bold**</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <em>*italic*</em>
                          </span>
                          <span className="flex items-center gap-1">
                            # Heading
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Editor */}
                    <textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Start writing your post here...

You can use Markdown formatting:

# This is a heading
## This is a subheading

**This text is bold**
*This text is italic*

- Bullet point 1
- Bullet point 2

[Link text](https://example.com)

> This is a quote

```
Code block
```"
                      required
                      className="w-full border-0 focus:ring-0 p-6 min-h-96 resize-none font-mono text-gray-800"
                      style={{ 
                        outline: 'none',
                        boxShadow: 'none',
                        minHeight: '400px',
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                      }}
                    />
                  </div>
                  <p className="text-caption">
                    Write your content using Markdown for rich formatting. The editor supports headings, links, lists, code blocks, and more.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                      <span className="text-caption text-gray-600">Auto-saved as draft</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Link href="/" className="btn-ghost">
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Publishing...
                        </div>
                      ) : (
                        'Publish Post'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 