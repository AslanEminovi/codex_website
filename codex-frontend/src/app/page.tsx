'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpenIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'

// Mock data - replace with actual API calls
const featuredPosts = [
  {
    id: 1,
    title: "Welcome to CodexCMS",
    excerpt: "Discover the power of modern content management with our beautiful, intuitive platform.",
    featuredImageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
    publishedAt: "2024-01-15",
    author: { firstName: "John", lastName: "Doe" },
    category: { name: "Technology", slug: "technology" }
  },
  {
    id: 2,
    title: "Building Modern Web Applications",
    excerpt: "Learn how to create stunning web experiences with the latest technologies and best practices.",
    featuredImageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
    publishedAt: "2024-01-12",
    author: { firstName: "Jane", lastName: "Smith" },
    category: { name: "Development", slug: "development" }
  },
  {
    id: 3,
    title: "The Future of Content Creation",
    excerpt: "Explore how AI and automation are revolutionizing the way we create and manage content.",
    featuredImageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    publishedAt: "2024-01-10",
    author: { firstName: "Alex", lastName: "Johnson" },
    category: { name: "Innovation", slug: "innovation" }
  }
]

const categories = [
  { id: 1, name: "Technology", slug: "technology", postCount: 12 },
  { id: 2, name: "Development", slug: "development", postCount: 8 },
  { id: 3, name: "Design", slug: "design", postCount: 6 },
  { id: 4, name: "Innovation", slug: "innovation", postCount: 4 }
]

const stats = [
  { label: "Featured Posts", value: "10+", icon: BookOpenIcon },
  { label: "Categories", value: "8", icon: ChartBarIcon },
  { label: "Active Users", value: "150+", icon: UserGroupIcon },
  { label: "Page Views", value: "5K+", icon: GlobeAltIcon }
]

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="container-glass">
          <div className="flex items-center justify-between h-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/" className="text-3xl font-black text-gradient">
                CodexCMS
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hidden md:flex items-center space-x-8"
            >
              <Link href="/" className="text-white/80 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/blog" className="text-white/80 hover:text-white transition-colors">
                Blog
              </Link>
              <Link href="/categories" className="text-white/80 hover:text-white transition-colors">
                Categories
              </Link>
              <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/admin" className="glass-button-primary">
                Admin Panel
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-glass">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <h1 className="hero-title">
              Welcome to{' '}
              <span className="text-gradient">CodexCMS</span>
            </h1>
            <p className="hero-subtitle">
              A modern content management system for creating and managing your content with ease.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/blog" className="glass-button-primary">
                View Blog
              </Link>
              <Link href="/admin" className="glass-button-secondary">
                Admin Panel
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container-glass">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="stats-card group"
              >
                <stat.icon className="w-12 h-12 text-accent-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <div className="stats-number">{stat.value}</div>
                <div className="text-white/80 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="section-padding">
        <div className="container-glass">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Featured <span className="text-gradient">Posts</span>
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Discover our latest articles and insights
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="post-card group"
              >
                <div className="overflow-hidden rounded-t-[30px]">
                  <Image
                    src={post.featuredImageUrl}
                    alt={post.title}
                    width={800}
                    height={250}
                    className="post-image"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="tag">
                      {post.category.name}
                    </span>
                    <span className="text-white/60 text-sm">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-white/80 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-white/60 text-sm">
                      By {post.author.firstName} {post.author.lastName}
                    </div>
                    <Link
                      href={`/blog/${post.id}`}
                      className="text-accent-400 hover:text-accent-300 font-semibold transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link href="/blog" className="glass-button-primary">
              View All Posts
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container-glass">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Explore <span className="text-gradient">Categories</span>
            </h2>
            <p className="text-xl text-white/80">
              Find content that interests you
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-8 text-center group cursor-pointer"
              >
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-accent-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-white/60">
                  {category.postCount} posts
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10">
        <div className="container-glass">
          <div className="text-center">
            <div className="text-3xl font-black text-gradient mb-4">
              CodexCMS
            </div>
            <p className="text-white/60 mb-8">
              Built with Next.js, TypeScript, and C# ASP.NET Core
            </p>
            <div className="flex justify-center space-x-8 text-white/60">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
