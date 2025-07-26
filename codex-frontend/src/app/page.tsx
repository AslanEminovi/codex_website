'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth'

// Real blog posts
const blogPosts = [
  {
    id: 1,
    title: "Welcome to CodexCMS",
    slug: "welcome-to-codexcms",
    excerpt: "A modern content management system built with simplicity in mind. Learn how to get started with creating and managing your content effectively.",
    content: `# Welcome to CodexCMS

CodexCMS is a modern, clean, and simple content management system built with the latest technologies. Our platform focuses on simplicity and ease of use while providing powerful features for content creators.

## Key Features

- **Clean Interface**: A minimal, distraction-free writing environment
- **Fast Performance**: Built with Next.js and C# .NET for optimal speed
- **User Management**: Role-based access control with admin capabilities
- **Responsive Design**: Works perfectly on all devices

## Getting Started

1. Create your account
2. Start writing your first post
3. Publish and share your content

We believe that content creation should be simple, fast, and enjoyable. That's why we built CodexCMS with a focus on the writing experience.`,
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
    date: "Jan 15, 2024",
    author: "CodexCMS Team",
    category: "Technology"
  },
  {
    id: 2,
    title: "Building Modern Web Apps",
    slug: "building-modern-web-apps",
    excerpt: "Learn how to create beautiful, fast web applications with modern tools and best practices for today's web development landscape.",
    content: `# Building Modern Web Applications

The web development landscape has evolved dramatically over the past few years. Modern web applications require a different approach than traditional websites.

## Modern Stack

Our recommended stack includes:

- **Frontend**: Next.js with TypeScript
- **Backend**: C# .NET Core API
- **Database**: SQL Server or PostgreSQL
- **Deployment**: Vercel and Railway

## Best Practices

### Performance
- Code splitting and lazy loading
- Image optimization
- Efficient caching strategies

### User Experience
- Progressive enhancement
- Responsive design
- Accessibility first

### Development
- TypeScript for type safety
- Clean code architecture
- Comprehensive testing

## Conclusion

Building modern web applications requires careful consideration of performance, user experience, and maintainability. With the right tools and practices, you can create applications that are both powerful and user-friendly.`,
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
    date: "Jan 12, 2024",
    author: "CodexCMS Team",
    category: "Development"
  },
  {
    id: 3,
    title: "The Future of Content",
    slug: "future-of-content",
    excerpt: "Exploring how content creation is evolving in the digital age and what this means for creators and platforms.",
    content: `# The Future of Content Creation

Content creation is undergoing a fundamental transformation. As technology advances and user expectations evolve, content creators and platforms must adapt to stay relevant.

## Emerging Trends

### AI-Assisted Writing
- Grammar and style suggestions
- Content optimization
- Automated translations

### Interactive Content
- Embedded media
- Real-time collaboration
- Dynamic content updates

### Personalization
- Customized reading experiences
- Adaptive content delivery
- User preference learning

## Challenges Ahead

The content creation industry faces several challenges:

1. **Information Overload**: Standing out in a crowded digital space
2. **Platform Dependencies**: Reducing reliance on third-party platforms
3. **Monetization**: Sustainable revenue models for creators

## Our Vision

At CodexCMS, we believe the future of content creation lies in:

- **Simplicity**: Focus on writing, not technical complexity
- **Ownership**: Creators should own their content and audience
- **Quality**: Tools that enhance rather than complicate the creative process

The future is bright for content creators who embrace these principles while staying true to their unique voice and vision.`,
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    date: "Jan 10, 2024",
    author: "CodexCMS Team",
    category: "Innovation"
  }
]

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const { user, isAdmin, loading, logout } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
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
            <div className="hidden md-flex items-center gap-8">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/blog" className="nav-link">Blog</Link>
              {user ? (
                <>
                  {isAdmin && (
                    <Link href="/admin" className="btn btn-primary">Admin Panel</Link>
                  )}
                  <button onClick={logout} className="btn btn-secondary">Logout</button>
                </>
              ) : (
                <Link href="/login" className="btn btn-primary">Login</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Modern Content Management
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Create, manage, and publish your content with our clean and simple CMS platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <Link href="/blog" className="btn btn-primary">
                Read Our Blog
              </Link>
              {isAdmin && (
                <Link href="/admin" className="btn btn-secondary">
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="section bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Latest Posts
          </h2>
          <div className="grid md-grid-cols-3 gap-8 lg:gap-12">
            {blogPosts.map((post) => (
              <article key={post.id} className="card">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={400}
                  height={240}
                  className="w-full h-48 object-cover"
                />
                <div className="card-content">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge badge-gray">{post.category}</span>
                    <span className="text-sm text-gray-500">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-gray-700">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">By {post.author}</span>
                    <Link href={`/blog/${post.slug}`} className="text-sm font-medium text-gray-900 hover:text-gray-700">
                      Read more →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/blog" className="btn btn-secondary">
              View All Posts
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
