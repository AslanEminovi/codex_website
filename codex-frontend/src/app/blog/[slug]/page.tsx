'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { api, Post } from '@/lib/api';
import { Navigation } from '@/components/navigation';
import { ArrowLeft, Calendar, Clock, Eye, User, Share2, Bookmark, Heart, MessageCircle, Sparkles, ThumbsUp, Twitter, Facebook, Linkedin, Copy, Check } from 'lucide-react';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const slug = params.slug as string;
    loadPost(slug);
  }, [params.slug]);

  const loadPost = async (slug: string) => {
    try {
      const fetchedPost = await api.getPostBySlug(slug);
      setPost(fetchedPost);
    } catch {
      setError('Post not found');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  const authorName = post ? `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() || post.author.username : '';

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = post?.title || 'Check out this amazing post!';
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Modern Background Pattern */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.03),transparent_30%),radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.03),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(120,200,255,0.03),transparent_30%)]"></div>
        </div>

        <Navigation />
        
        <div className="relative z-10 pt-24 pb-40">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="skeleton h-6 w-32 rounded-full mb-10"></div>
                <div className="skeleton h-20 w-full rounded-xl mb-8"></div>
                <div className="skeleton h-6 w-96 rounded-lg mb-10"></div>
                <div className="skeleton h-64 w-full rounded-2xl mb-10"></div>
                <div className="space-y-6">
                  <div className="skeleton h-4 w-full rounded"></div>
                  <div className="skeleton h-4 w-full rounded"></div>
                  <div className="skeleton h-4 w-3/4 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Modern Background Pattern */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.03),transparent_30%),radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.03),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(120,200,255,0.03),transparent_30%)]"></div>
        </div>

        <Navigation />
        
        <div className="relative z-10 pt-24 pb-40">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-10">
                <Sparkles className="w-12 h-12 text-blue-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">Story Not Found</h1>
              <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                The story you&apos;re looking for doesn&apos;t exist or may have been moved.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link 
                  href="/blog" 
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Blog
                  </span>
                </Link>
                <button
                  onClick={() => router.back()}
                  className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-2xl hover:border-slate-300 hover:shadow-lg transition-all duration-300"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Enhanced Modern Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.03),transparent_30%),radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.03),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(120,200,255,0.03),transparent_30%)]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/10 to-purple-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-cyan-200/15 to-blue-200/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Navigation />

      {/* Enhanced Back Button */}
      <div className="relative z-10 pt-24 pb-10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl hover:shadow-md transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Stories
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Article */}
      <article className="relative z-10 pb-40">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Enhanced Header */}
            <header className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-10">
                <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-900 text-sm font-semibold rounded-full">
                  {post.category?.name || 'General'}
                </span>
                <div className="flex items-center gap-4 text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{getReadTime(post.content || '')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{post.viewCount || 0} views</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-10 leading-tight">
                {post.title}
              </h1>
              
              {post.excerpt && (
                <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                  {post.excerpt}
                </p>
              )}
              
              {/* Enhanced Author Info */}
              <div className="flex items-center justify-center gap-6 mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-semibold text-slate-900">{authorName}</p>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{formatDate(post.publishedAt || post.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex items-center justify-center gap-4 mb-16">
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 group ${
                    liked 
                      ? 'bg-red-500 text-white shadow-lg' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:shadow-md'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''} group-hover:scale-110 transition-transform`} />
                  <span className="text-sm">{liked ? 'Liked' : 'Like'}</span>
                </button>
                <button 
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 group ${
                    bookmarked 
                      ? 'bg-yellow-500 text-white shadow-lg' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:shadow-md'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''} group-hover:scale-110 transition-transform`} />
                  <span className="text-sm">{bookmarked ? 'Saved' : 'Save'}</span>
                </button>
                <button 
                  onClick={() => handleShare('copy')}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl hover:shadow-md transition-all duration-300 group"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  )}
                  <span className="text-sm">{copied ? 'Copied!' : 'Share'}</span>
                </button>
              </div>
            </header>

            {/* Enhanced Featured Image */}
            {post.featuredImageUrl && (
              <div className="mb-20">
                <Image 
                  src={post.featuredImageUrl} 
                  alt={post.title}
                  width={1200}
                  height={600}
                  className="w-full h-96 object-cover rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
                />
              </div>
            )}

            {/* Enhanced Content */}
            <div className="prose prose-xl max-w-none">
              <div 
                className="text-slate-700 leading-relaxed space-y-8 whitespace-pre-wrap"
                style={{
                  fontSize: '1.125rem',
                  lineHeight: '1.8',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }}
              >
                {post.content || 'No content available.'}
              </div>
            </div>

            {/* Enhanced Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-20 pt-10 border-t border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-8">Tags</h3>
                <div className="flex flex-wrap gap-4">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag.id}
                      className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 text-blue-900 text-sm font-semibold rounded-full hover:shadow-md transition-all duration-300 hover:scale-105"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Author Bio Section */}
            <div className="mt-20 pt-10 border-t border-slate-200">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-3xl p-10 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start gap-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-slate-900 mb-4">Written by {authorName}</h4>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      Passionate content creator sharing insights and stories with the CodexCMS community.
                    </p>
                    <div className="flex items-center gap-6">
                      <span className="text-sm text-slate-500">Published on {formatDate(post.publishedAt || post.createdAt)}</span>
                      <span className="text-sm text-slate-500">•</span>
                      <span className="text-sm text-slate-500">{getReadTime(post.content || '')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Comments Section */}
            <div className="mt-20 pt-10 border-t border-slate-200">
              <div className="flex items-center gap-3 mb-10">
                <MessageCircle className="w-6 h-6 text-slate-600" />
                <h3 className="text-2xl font-semibold text-slate-900">Comments</h3>
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl p-10 hover:shadow-lg transition-shadow duration-300">
                <p className="text-slate-600 text-center">
                  Comments feature coming soon! Share your thoughts on social media for now.
                </p>
              </div>
            </div>

            {/* Enhanced Footer Actions */}
            <footer className="mt-20 pt-10 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="text-center sm:text-left">
                  <p className="text-slate-600 mb-4">
                    Enjoyed this story? Share it with others!
                  </p>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 group ${
                        liked 
                          ? 'bg-red-500 text-white shadow-lg' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-current' : ''} group-hover:scale-110 transition-transform`} />
                      <span className="text-sm">{liked ? 'Liked' : 'Like'}</span>
                    </button>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleShare('twitter')}
                        className="p-3 bg-blue-400 text-white rounded-xl hover:bg-blue-500 transition-colors group"
                      >
                        <Twitter className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                      <button 
                        onClick={() => handleShare('facebook')}
                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors group"
                      >
                        <Facebook className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                      <button 
                        onClick={() => handleShare('linkedin')}
                        className="p-3 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-colors group"
                      >
                        <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Link 
                    href="/blog" 
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1"
                  >
                    More Stories
                  </Link>
                  <button 
                    onClick={() => router.back()} 
                    className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-2xl hover:border-slate-300 hover:shadow-lg transition-all duration-300"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </article>

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
    </div>
  );
} 