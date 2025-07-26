'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// Same blog posts data
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

export default function BlogPost() {
  const params = useParams()
  const [post, setPost] = useState<typeof blogPosts[0] | null>(null)

  useEffect(() => {
    const slug = params?.slug as string
    const foundPost = blogPosts.find(p => p.slug === slug)
    setPost(foundPost || null)
  }, [params])

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
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
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
          src={post.imageUrl}
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
            {blogPosts
              .filter(p => p.slug !== post.slug)
              .slice(0, 2)
              .map((relatedPost) => (
                <article key={relatedPost.id} className="card">
                  <Image
                    src={relatedPost.imageUrl}
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