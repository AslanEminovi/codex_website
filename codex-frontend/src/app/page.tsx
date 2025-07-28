'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Shield, Users, TrendingUp, Edit3, Eye, User, Star, Code, Palette, Rocket, BookOpen, Heart, CheckCircle, Plus, ArrowUpRight, Play, Pause } from 'lucide-react'
import { Navigation } from '@/components/navigation'

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

export default function HomePage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const response = await api.getPosts()
      if (response && Array.isArray(response)) {
        const convertedPosts: Post[] = response.map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content || '',
          author: post.author,
          category: post.category,
          createdAt: post.createdAt,
          viewCount: post.viewCount || 0
        }))
        setPosts(convertedPosts.slice(0, 6))
      }
    } catch {
      // Silently handle error - posts will remain empty array
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Enhanced Modern Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.03),transparent_30%),radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.03),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(120,200,255,0.03),transparent_30%)]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-cyan-200/15 to-blue-200/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Navigation />

      {/* Enhanced Hero Section */}
      <section className="relative z-10 pt-24 pb-40">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              {/* Enhanced Badge */}
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-full mb-10 hover:shadow-lg transition-all duration-300 group">
                <Star className="w-4 h-4 text-blue-600 group-hover:rotate-12 transition-transform" />
                <span className="text-sm font-semibold text-blue-900">Trusted by 10,000+ creators</span>
                <ArrowUpRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              
              {/* Enhanced Typography */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-10 leading-none">
                <span className="block text-slate-900">Create</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">Amazing</span>
                <span className="block text-slate-900">Content</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-16 leading-relaxed">
                The most intuitive content management system designed for modern creators. 
                Build, publish, and scale your content with unprecedented ease.
              </p>
              
              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
                <Link 
                  href={user ? "/create-post" : "/register"} 
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-2">
                    {user ? "Start Creating" : "Get Started Free"}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link 
                  href="/blog" 
                  className="group px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-2xl hover:border-slate-300 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Explore Content
                  </span>
                </Link>
              </div>

              {/* Enhanced Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
                {[
                  { number: "10K+", label: "Active Users", icon: Users, color: "from-blue-500 to-cyan-500" },
                  { number: "50K+", label: "Posts Created", icon: Edit3, color: "from-green-500 to-emerald-500" },
                  { number: "99.9%", label: "Uptime", icon: Shield, color: "from-purple-500 to-pink-500" },
                  { number: "24/7", label: "Support", icon: Heart, color: "from-orange-500 to-red-500" },
                ].map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="group text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{stat.number}</div>
                      <div className="text-slate-600 font-medium">{stat.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="relative z-10 py-40 bg-gradient-to-br from-white to-slate-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8">
                Why Choose
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CodexCMS?</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Everything you need to create, manage, and publish world-class content
              </p>
            </div>

            {/* Enhanced Primary Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
              {[
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description: "Built with cutting-edge technology for blazing fast performance and seamless user experience.",
                  gradient: "from-yellow-400 to-orange-500",
                  features: ["Instant publishing", "Real-time updates", "Optimized performance"]
                },
                {
                  icon: Shield,
                  title: "Enterprise Security",
                  description: "Bank-level security with advanced encryption, secure authentication, and data protection.",
                  gradient: "from-green-400 to-blue-500",
                  features: ["SSL encryption", "Two-factor auth", "Regular backups"]
                },
                {
                  icon: Palette,
                  title: "Beautiful Design",
                  description: "Stunning, customizable themes and layouts that make your content shine and engage readers.",
                  gradient: "from-pink-400 to-purple-500",
                  features: ["Custom themes", "Responsive design", "Rich typography"]
                }
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="group">
                    <div className="relative p-10 bg-white rounded-3xl border border-slate-200 hover:border-slate-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">{feature.title}</h3>
                        <p className="text-slate-600 leading-relaxed mb-6">{feature.description}</p>
                        <ul className="space-y-2">
                          {feature.features.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Enhanced Secondary Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Code, title: "Clean Code", description: "Well-structured, maintainable codebase", color: "text-blue-600" },
                { icon: Rocket, title: "Fast Deployment", description: "Deploy your content in minutes, not hours", color: "text-purple-600" },
                { icon: Users, title: "Team Collaboration", description: "Work together seamlessly with your team", color: "text-green-600" },
                { icon: TrendingUp, title: "Analytics", description: "Deep insights into your content performance", color: "text-orange-600" },
                { icon: CheckCircle, title: "SEO Optimized", description: "Built-in SEO best practices for better rankings", color: "text-pink-600" },
                { icon: Heart, title: "Community", description: "Join thousands of happy content creators", color: "text-red-600" },
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="group p-8 bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <Icon className={`w-8 h-8 ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`} />
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">{feature.title}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Latest Posts Section */}
      <section className="relative z-10 py-40">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-20">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Latest Stories</h2>
                <p className="text-xl text-slate-600">Discover amazing content from our community</p>
              </div>
              <Link 
                href="/blog" 
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-slate-800 transition-colors group"
              >
                View All Posts
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-slate-200 rounded-3xl h-80"></div>
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                    <article className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:border-slate-300 transition-all duration-500 hover:-translate-y-2 h-full relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10 p-10">
                        <div className="flex items-center gap-3 mb-6">
                          <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-900 text-sm font-semibold rounded-full">
                            {post.category?.name || 'General'}
                          </span>
                          <div className="flex items-center gap-1 text-slate-500">
                            <Eye className="w-3 h-3" />
                            <span className="text-sm">{post.viewCount}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-slate-600 mb-8 line-clamp-3 leading-relaxed">
                          {post.excerpt || post.content.substring(0, 120) + '...'}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {getAuthorName(post.author)}
                              </p>
                              <p className="text-xs text-slate-500">{formatDate(post.createdAt)}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-10">
                  <Edit3 className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">No Posts Yet</h3>
                <p className="text-slate-600 mb-10 max-w-md mx-auto">
                  Be the first to create amazing content and start your journey with CodexCMS!
                </p>
                {user && (
                  <Link 
                    href="/create-post" 
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1"
                  >
                    Create Your First Post
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}

            <div className="text-center mt-16 md:hidden">
              <Link 
                href="/blog" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-slate-800 transition-colors"
              >
                View All Posts
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      {!user && (
        <section className="relative z-10 py-40 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_30%),radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.1),transparent_30%)]"></div>
          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Ready to Start Your
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Content Journey?</span>
              </h2>
              <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                Join thousands of creators who trust CodexCMS for their content management needs. 
                Start building something amazing today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link 
                  href="/register" 
                  className="group px-8 py-4 bg-white text-slate-900 font-semibold rounded-2xl hover:bg-slate-100 transition-colors relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Get Started Free
                  </span>
                </Link>
                <Link 
                  href="/blog" 
                  className="group px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Explore Content
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Footer */}
      <footer className="relative z-10 py-20 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-slate-900">CodexCMS</span>
              </Link>
              <p className="text-slate-600 mb-10">Beautiful content management made simple.</p>
              <div className="flex items-center justify-center gap-8 text-slate-600">
                <Link href="/blog" className="hover:text-slate-900 transition-colors">Blog</Link>
                <Link href="/about" className="hover:text-slate-900 transition-colors">About</Link>
                <Link href="/contact" className="hover:text-slate-900 transition-colors">Contact</Link>
                <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      {user && (
        <Link 
          href="/create-post"
          className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1 group"
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </Link>
      )}
    </div>
  )
}
