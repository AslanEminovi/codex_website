'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Calendar, Eye, User, ArrowRight } from 'lucide-react'

// Mock data - replace with actual API calls
const mockPosts = [
  {
    id: 1,
    title: "Welcome to CodexCMS",
    slug: "welcome-to-codexcms",
    excerpt: "Discover the power of modern content management with our beautiful, intuitive platform designed for creators.",
    featuredImageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
    publishedAt: "2024-01-15",
    author: { firstName: "John", lastName: "Doe" },
    category: { name: "Technology", slug: "technology" },
    viewCount: 1250,
    readTime: 5
  },
  {
    id: 2,
    title: "Building Modern Web Applications",
    slug: "building-modern-web-applications",
    excerpt: "Learn how to create stunning web experiences with the latest technologies, frameworks, and best practices.",
    featuredImageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
    publishedAt: "2024-01-12",
    author: { firstName: "Jane", lastName: "Smith" },
    category: { name: "Development", slug: "development" },
    viewCount: 890,
    readTime: 8
  },
  {
    id: 3,
    title: "The Future of Content Creation",
    slug: "future-of-content-creation",
    excerpt: "Explore how AI and automation are revolutionizing the way we create, manage, and distribute content.",
    featuredImageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    publishedAt: "2024-01-10",
    author: { firstName: "Alex", lastName: "Johnson" },
    category: { name: "Innovation", slug: "innovation" },
    viewCount: 2100,
    readTime: 6
  },
  {
    id: 4,
    title: "Design Systems That Scale",
    slug: "design-systems-that-scale",
    excerpt: "Creating consistent, maintainable design systems for large-scale applications and design teams.",
    featuredImageUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80",
    publishedAt: "2024-01-08",
    author: { firstName: "Sarah", lastName: "Wilson" },
    category: { name: "Design", slug: "design" },
    viewCount: 756,
    readTime: 7
  },
  {
    id: 5,
    title: "Performance Optimization Techniques",
    slug: "performance-optimization-techniques",
    excerpt: "Advanced strategies for improving web application performance and user experience.",
    featuredImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    publishedAt: "2024-01-05",
    author: { firstName: "Mike", lastName: "Chen" },
    category: { name: "Development", slug: "development" },
    viewCount: 1876,
    readTime: 10
  }
]

const categories = [
  { name: "All", slug: "", count: mockPosts.length },
  { name: "Technology", slug: "technology", count: 1 },
  { name: "Development", slug: "development", count: 2 },
  { name: "Design", slug: "design", count: 1 },
  { name: "Innovation", slug: "innovation", count: 1 }
]

export default function BlogPage() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [filteredPosts, setFilteredPosts] = useState(mockPosts)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let filtered = mockPosts

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category.slug === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredPosts(filtered)
  }, [searchQuery, selectedCategory])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Blog</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover insights, tutorials, and stories from our team of creators and developers.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.slug}
                variant={selectedCategory === category.slug ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.slug)}
                className="h-12"
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-8">
          <p className="text-muted-foreground">
            {filteredPosts.length === 0 ? (
              "No articles found."
            ) : (
              `Showing ${filteredPosts.length} of ${mockPosts.length} articles`
            )}
          </p>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria.
                </p>
                <Button onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('')
                }}>
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                <div className="relative overflow-hidden">
                  <Image
                    src={post.featuredImageUrl}
                    alt={post.title}
                    width={400}
                    height={240}
                    className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-black/20 backdrop-blur-sm text-white border-0">
                      {post.category.name}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-0">
                      {post.readTime} min read
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{post.author.firstName} {post.author.lastName}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.viewCount}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <Button variant="ghost" className="w-full group/btn" asChild>
                    <Link href={`/blog/${post.slug}`}>
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More Button (if needed) */}
        {filteredPosts.length > 0 && filteredPosts.length >= 9 && (
          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              Load More Articles
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 