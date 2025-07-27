'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { api, Post } from '@/lib/api';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="nav">
          <div className="container">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                CodexCMS
              </Link>
              <div className="flex items-center gap-4">
                <Link href="/blog" className="nav-link">← Back to Blog</Link>
              </div>
            </div>
          </div>
        </nav>
        
        <div className="container section">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">The blog post you&apos;re looking for doesn&apos;t exist.</p>
                          <Link href="/blog" className="btn-primary">
                Back to Blog
              </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const authorName = `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() || post.author.username;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="nav">
        <div className="container">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              CodexCMS
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/blog" className="nav-link">← Back to Blog</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Blog Post */}
      <article className="section">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">{post.category?.name || 'General'}</span>
                <span className="text-sm text-gray-500">5 min read</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              
              {post.excerpt && (
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  {post.excerpt}
                </p>
              )}
              
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{authorName}</span>
                </div>
                <div>{formatDate(post.publishedAt || post.createdAt)}</div>
                {post.category && <div>{post.category.name}</div>}
              </div>
            </header>

            {/* Featured Image */}
            {post.featuredImageUrl && (
              <div className="mb-12">
                <Image 
                  src={post.featuredImageUrl} 
                  alt={post.title}
                  width={800}
                  height={400}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-700 leading-relaxed space-y-6 whitespace-pre-wrap"
                style={{
                  fontSize: '1.125rem',
                  lineHeight: '1.75'
                }}
              >
                {post.content || 'No content available.'}
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag.id}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      style={tag.color ? { backgroundColor: tag.color, color: 'white' } : {}}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <footer className="mt-16 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-gray-600">
                    Written by <span className="font-medium text-gray-900">{authorName}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Published on {formatDate(post.publishedAt || post.createdAt)}
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <Link href="/blog" className="btn-secondary">
                    More Posts
                  </Link>
                  <button 
                    onClick={() => router.back()} 
                    className="btn-ghost"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </div>
  );
} 