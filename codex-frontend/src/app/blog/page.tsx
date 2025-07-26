'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import MagicBento, { BentoCardProps } from '@/components/MagicBento';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BentoCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const posts = await api.getPosts();
      const convertedBlogs: BentoCardProps[] = posts.map(post => ({
        color: "#ffffff",
        title: post.title,
        description: post.excerpt || "Click to read more about this topic",
        label: post.category?.name || "General",
        author: `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() || post.author.username,
        date: new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        readTime: "5 min read", // Default since API doesn't provide this
        category: post.category?.name || "General",
        slug: post.slug
      }));
      setBlogs(convertedBlogs);
    } catch (error) {
      console.error('Failed to load posts:', error);
      // If API fails, show empty state
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogClick = (blog: BentoCardProps) => {
    if (blog.slug) {
      router.push(`/blog/${blog.slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Blog
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Discover insights, tutorials, and stories about modern web development and technology.
          </p>
          {!loading && (
            <div className="text-gray-500 text-sm">
              {blogs.length} {blogs.length === 1 ? 'article' : 'articles'} available
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading posts...</div>
          </div>
        ) : blogs.length > 0 ? (
          <>
            <div className="flex justify-center">
              <MagicBento 
                textAutoHide={true}
                enableStars={true}
                enableSpotlight={true}
                enableBorderGlow={true}
                enableTilt={true}
                enableMagnetism={true}
                clickEffect={true}
                spotlightRadius={300}
                particleCount={12}
                glowColor="17, 24, 39"
                blogs={blogs}
                onCardClick={handleBlogClick}
              />
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm">
                Click on any blog card to read the full article. Each post includes detailed insights and practical examples.
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts available</h3>
            <p className="text-gray-600 mb-8">
              No posts have been published yet. Check back later for new content!
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 