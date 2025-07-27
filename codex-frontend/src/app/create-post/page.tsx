'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import Link from 'next/link'
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  FileText, 
  Tag, 
  Type, 
  AlignLeft,
  Bold,
  Italic,
  List,
  Link2,
  Image,
  Code,
  Sparkles,
  Check,
  Home
} from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
}

export default function CreatePostPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    categoryId: ''
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !authLoading) {
      if (!user) {
        router.push('/login')
        return
      }
      loadCategories()
    }
  }, [mounted, authLoading, user, router])

  const loadCategories = async () => {
    try {
      // For now, set default categories - can be implemented when API is ready
      setCategories([
        { id: 1, name: 'General', slug: 'general' },
        { id: 2, name: 'Technology', slug: 'technology' },
        { id: 3, name: 'Design', slug: 'design' }
      ])
    } catch {
      // Silent error handling
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'categoryId' ? value : value
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    try {
      await api.createPost({
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim(),
        categoryId: formData.categoryId ? Number(formData.categoryId) : undefined
      })
      setSuccess(true)
    } catch {
      setError('Failed to create post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const insertMarkdown = (syntax: string, placeholder: string = '') => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const replacement = selectedText || placeholder

    let newText = ''
    if (syntax === 'bold') {
      newText = `**${replacement}**`
    } else if (syntax === 'italic') {
      newText = `*${replacement}*`
    } else if (syntax === 'list') {
      newText = `\n- ${replacement}`
    } else if (syntax === 'link') {
      newText = `[${replacement}](url)`
    } else if (syntax === 'image') {
      newText = `![${replacement}](image-url)`
    } else if (syntax === 'code') {
      newText = `\`${replacement}\``
    }

    const newValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end)
    setFormData(prev => ({ ...prev, content: newValue }))

    // Focus back to textarea
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + newText.length, start + newText.length)
    }, 0)
  }

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl">
          <div className="mb-8">
            <div className="skeleton h-12 w-48 rounded mb-4"></div>
            <div className="skeleton h-6 w-96 rounded"></div>
          </div>
          <div className="card">
            <div className="card-content p-6 sm:p-8 lg:p-12">
              <div className="space-y-6">
                <div className="skeleton h-12 w-full rounded-lg"></div>
                <div className="skeleton h-32 w-full rounded-lg"></div>
                <div className="skeleton h-64 w-full rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-lg">
            <div className="card text-center fade-in">
              <div className="card-content">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-display text-dark-900 mb-4">Post Created!</h2>
                <p className="text-body text-dark-600 mb-8">
                  Your post has been successfully created and published. Start sharing your amazing content with the world!
                </p>
                <div className="space-y-4">
                  <Link href="/blog" className="btn-primary w-full btn-lg">
                    <Eye className="w-5 h-5" />
                    View All Posts
                  </Link>
                  <button 
                    onClick={() => {
                      setSuccess(false)
                      setFormData({ title: '', content: '', excerpt: '', categoryId: '' })
                    }}
                    className="btn-secondary w-full"
                  >
                    <FileText className="w-5 h-5" />
                    Create Another Post
                  </button>
                  <Link href="/" className="btn-ghost w-full">
                    <Home className="w-5 h-5" />
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
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

      <div className="relative z-10 w-full min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 fade-in">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/blog" className="p-2 bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/80 transition-all group">
                <ArrowLeft className="w-5 h-5 text-dark-600 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 mb-2">
                  <Sparkles className="w-4 h-4 text-brand-500" />
                  <span className="text-sm font-medium text-dark-600">Create New Post</span>
                </div>
                <h1 className="text-display text-dark-900">Share Your Story</h1>
                <p className="text-subtitle text-dark-600">Create amazing content that inspires and informs your audience</p>
              </div>
            </div>
          </div>

          {/* Editor Card */}
          <div className="card slide-in">
            <div className="card-content p-6 sm:p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Error Message */}
                {error && (
                  <div className="alert-error fade-in">
                    {error}
                  </div>
                )}

                {/* Title & Meta */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <label htmlFor="title" className="form-label flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      Post Title *
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter an engaging title for your post..."
                      required
                      className="form-input text-lg font-medium"
                    />
                  </div>
                  <div>
                    <label htmlFor="categoryId" className="form-label flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Category
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label htmlFor="excerpt" className="form-label flex items-center gap-2">
                    <AlignLeft className="w-4 h-4" />
                    Excerpt
                  </label>
                  <input
                    id="excerpt"
                    name="excerpt"
                    type="text"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    placeholder="Brief description of your post (optional)"
                    className="form-input"
                  />
                  <p className="text-xs text-dark-500 mt-1">A short summary that appears in post previews</p>
                </div>

                {/* Content Editor */}
                <div>
                  <label htmlFor="content" className="form-label flex items-center gap-2 mb-4">
                    <FileText className="w-4 h-4" />
                    Content *
                  </label>

                  {/* Toolbar */}
                  <div className="glass rounded-xl p-3 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-dark-600 mr-3">Format:</span>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('bold', 'bold text')}
                        className="p-2 hover:bg-white/60 rounded-lg transition-colors group"
                        title="Bold"
                      >
                        <Bold className="w-4 h-4 text-dark-600 group-hover:text-dark-900" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('italic', 'italic text')}
                        className="p-2 hover:bg-white/60 rounded-lg transition-colors group"
                        title="Italic"
                      >
                        <Italic className="w-4 h-4 text-dark-600 group-hover:text-dark-900" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('list', 'list item')}
                        className="p-2 hover:bg-white/60 rounded-lg transition-colors group"
                        title="List"
                      >
                        <List className="w-4 h-4 text-dark-600 group-hover:text-dark-900" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('link', 'link text')}
                        className="p-2 hover:bg-white/60 rounded-lg transition-colors group"
                        title="Link"
                      >
                        <Link2 className="w-4 h-4 text-dark-600 group-hover:text-dark-900" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('image', 'alt text')}
                        className="p-2 hover:bg-white/60 rounded-lg transition-colors group"
                        title="Image"
                      >
                        <Image className="w-4 h-4 text-dark-600 group-hover:text-dark-900" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('code', 'code')}
                        className="p-2 hover:bg-white/60 rounded-lg transition-colors group"
                        title="Code"
                      >
                        <Code className="w-4 h-4 text-dark-600 group-hover:text-dark-900" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Start writing your amazing content here..."
                    required
                    rows={20}
                    className="form-textarea text-base leading-relaxed"
                    style={{ minHeight: '400px' }}
                  />

                  {/* Markdown Tips */}
                  <div className="mt-4 p-4 bg-brand-50 rounded-xl border border-brand-200">
                    <h4 className="text-sm font-semibold text-brand-800 mb-2">💡 Markdown Tips:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-brand-700">
                      <div><code>**bold**</code> for <strong>bold text</strong></div>
                      <div><code>*italic*</code> for <em>italic text</em></div>
                      <div><code>- item</code> for bullet lists</div>
                      <div><code>[text](url)</code> for links</div>
                      <div><code>`code`</code> for inline code</div>
                                             <div><code>![alt](url)</code> for images</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-dark-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary btn-lg w-full sm:w-auto relative overflow-hidden group"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>Publishing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Save className="w-5 h-5" />
                        <span>Publish Post</span>
                      </div>
                    )}
                  </button>
                  
                  <Link href="/blog" className="btn-secondary w-full sm:w-auto">
                    Cancel
                  </Link>

                  <div className="flex-1" />

                  <div className="text-sm text-dark-500">
                    Auto-saved • {new Date().toLocaleTimeString()}
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