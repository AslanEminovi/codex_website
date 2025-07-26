'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Edit } from 'lucide-react';
import { BentoCardProps } from './MagicBento';

interface BlogManagerProps {
  blogs: BentoCardProps[];
  onBlogsChange: (blogs: BentoCardProps[]) => void;
}

const categories = [
  "Technology",
  "AI",
  "Backend",
  "Frontend",
  "Database",
  "DevOps",
  "Architecture",
  "Cloud",
  "Security",
  "Mobile",
  "Design",
  "Business"
];

export function BlogManager({ blogs, onBlogsChange }: BlogManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<BentoCardProps>>({
    title: '',
    description: '',
    label: '',
    category: '',
    readTime: '5 min read'
  });

  const addBlog = () => {
    if (!formData.title || !formData.description || !formData.label) {
      alert('Please fill in all required fields');
      return;
    }

    const newBlog: BentoCardProps = {
      color: "#060010",
      title: formData.title,
      description: formData.description,
      label: formData.label,
      author: "Aslan Eminovi",
      date: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      readTime: formData.readTime || '5 min read',
      category: formData.category || 'Technology'
    };

    onBlogsChange([newBlog, ...blogs]);
    setFormData({
      title: '',
      description: '',
      label: '',
      category: '',
      readTime: '5 min read'
    });
    setIsAdding(false);
  };

  const updateBlog = () => {
    if (!formData.title || !formData.description || !formData.label || editingIndex === null) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedBlogs = [...blogs];
    updatedBlogs[editingIndex] = {
      ...updatedBlogs[editingIndex],
      title: formData.title,
      description: formData.description,
      label: formData.label,
      category: formData.category || 'Technology',
      readTime: formData.readTime || '5 min read'
    };

    onBlogsChange(updatedBlogs);
    setFormData({
      title: '',
      description: '',
      label: '',
      category: '',
      readTime: '5 min read'
    });
    setEditingIndex(null);
  };

  const removeBlog = (index: number) => {
    const updatedBlogs = blogs.filter((_, i) => i !== index);
    onBlogsChange(updatedBlogs);
  };

  const startEditing = (index: number) => {
    const blog = blogs[index];
    setFormData({
      title: blog.title,
      description: blog.description,
      label: blog.label,
      category: blog.category,
      readTime: blog.readTime
    });
    setEditingIndex(index);
  };

  const cancelEdit = () => {
    setFormData({
      title: '',
      description: '',
      label: '',
      category: '',
      readTime: '5 min read'
    });
    setEditingIndex(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Blog Management</h2>
        <Button 
          onClick={() => setIsAdding(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Blog
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingIndex !== null) && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              {editingIndex !== null ? 'Edit Blog' : 'Add New Blog'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-white">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Blog title"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="label" className="text-white">Label *</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Category label"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-white">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Blog description"
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-white">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="text-white">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="readTime" className="text-white">Read Time</Label>
                <Input
                  id="readTime"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  placeholder="5 min read"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={editingIndex !== null ? updateBlog : addBlog}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {editingIndex !== null ? 'Update Blog' : 'Add Blog'}
              </Button>
              <Button 
                variant="outline" 
                onClick={cancelEdit}
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blog List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Current Blogs ({blogs.length})</h3>
        <div className="grid gap-4">
          {blogs.map((blog, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-purple-400 bg-purple-900/20 px-2 py-1 rounded">
                        {blog.label}
                      </span>
                      <span className="text-xs text-gray-400">{blog.readTime}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">{blog.title}</h4>
                    <p className="text-gray-300 text-sm mb-2">{blog.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>By {blog.author}</span>
                      <span>{blog.date}</span>
                      {blog.category && <span>• {blog.category}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditing(index)}
                      className="border-gray-600 text-white hover:bg-gray-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeBlog(index)}
                      className="border-red-600 text-red-400 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 