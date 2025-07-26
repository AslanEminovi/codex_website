'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { api } from '@/lib/api'

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  imageUrl?: string
  featuredImageUrl?: string
  date?: string
  createdAt?: string
  publishedAt?: string
  author: string
  category: string
}

export default function BlogPost() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    const slug = params?.slug as string
    loadPost(slug)
  }, [params])

  const loadPost = async (slug: string) => {
    try {
      // Try to get post from API first
      const posts = await api.getPosts()
      if (posts && Array.isArray(posts)) {
        setAllPosts(posts)
        const foundPost = posts.find(p => p.slug === slug)
        if (foundPost) {
          setPost(foundPost)
          return
        }
      }
    } catch (error) {
      console.error('Failed to load posts from API:', error)
    }
    
    // If no post found, set to null
    setPost(null)
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="nav">
          <div className="container">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                CodexCMS
              </Link>
              <Link href="/blog" className="btn btn-secondary">
                ← Back to Blog
              </Link>
            </div>
          </div>
        </nav>
        
        <div className="container py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blog" className="btn btn-primary">
            View All Posts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="nav">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              CodexCMS
            </Link>
            <Link href="/blog" className="btn btn-secondary">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Image */}
      <div className="w-full h-96 overflow-hidden">
        <Image
          src={post.imageUrl || post.featuredImageUrl || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80'}
          alt={post.title}
          width={1200}
          height={400}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article */}
      <article className="container py-16 max-w-4xl">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge badge-gray">{post.category}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">{post.date}</span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {post.excerpt}
          </p>
          
          <div className="flex items-center text-gray-500">
            <span>By {post.author}</span>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {post.content.split('\n').map((line, index) => {
            if (line.startsWith('# ')) {
              return <h1 key={index} className="text-4xl font-bold text-gray-900 mt-12 mb-6">{line.substring(2)}</h1>
            } else if (line.startsWith('## ')) {
              return <h2 key={index} className="text-3xl font-bold text-gray-900 mt-10 mb-4">{line.substring(3)}</h2>
            } else if (line.startsWith('### ')) {
              return <h3 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-3">{line.substring(4)}</h3>
            } else if (line.startsWith('- **') && line.includes('**:')) {
              const parts = line.substring(2).split('**:')
              const title = parts[0].replace('**', '')
              const description = parts[1]
              return (
                <div key={index} className="mb-2">
                  <strong className="text-gray-900">{title}:</strong>
                  <span className="text-gray-700">{description}</span>
                </div>
              )
            } else if (line.startsWith('- ')) {
              return <li key={index} className="text-gray-700 mb-1">{line.substring(2)}</li>
            } else if (line.match(/^\d+\./)) {
              return <li key={index} className="text-gray-700 mb-1">{line.substring(line.indexOf('.') + 2)}</li>
            } else if (line.trim() === '') {
              return <div key={index} className="mb-4"></div>
            } else {
              return <p key={index} className="text-gray-700 mb-4 leading-relaxed">{line}</p>
            }
          })}
        </div>
      </article>

      {/* Related Posts */}
      <section className="bg-gray-50 py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            More Posts
          </h2>
          <div className="grid md-grid-cols-2 gap-8 max-w-4xl mx-auto">
            {allPosts
              .filter(p => p.slug !== post.slug)
              .slice(0, 2)
              .map((relatedPost) => (
                <article key={relatedPost.id} className="card">
                  <Image
                    src={relatedPost.imageUrl || relatedPost.featuredImageUrl || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80'}
                    alt={relatedPost.title}
                    width={400}
                    height={240}
                    className="w-full h-48 object-cover"
                  />
                  <div className="card-content">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="badge badge-gray">{relatedPost.category}</span>
                      <span className="text-sm text-gray-500">{relatedPost.date}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      <Link href={`/blog/${relatedPost.slug}`} className="hover:text-gray-700">
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4">{relatedPost.excerpt}</p>
                    <Link href={`/blog/${relatedPost.slug}`} className="text-sm font-medium text-gray-900 hover:text-gray-700">
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
} 