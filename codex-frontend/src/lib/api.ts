const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export interface Post {
  id: number
  title: string
  slug: string
  content?: string
  excerpt?: string
  featuredImageUrl?: string
  status: string
  publishedAt?: string
  viewCount: number
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  author: {
    id: number
    username: string
    firstName?: string
    lastName?: string
  }
  category?: {
    id: number
    name: string
    slug: string
  }
  tags?: Array<{
    id: number
    name: string
    slug: string
    color?: string
  }>
}

export interface ApiResponse<T> {
  data: T
  pagination?: {
    currentPage: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

export interface AuthResponse {
  success: boolean
  token?: string
  user?: {
    id: number
    username: string
    email: string
    role: string
    firstName?: string
    lastName?: string
  }
  message?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  imageUrl?: string
  parentCategoryId?: number
  isActive: boolean
  displayOrder: number
  postCount?: number
  createdAt: string
  updatedAt: string
}

export interface Tag {
  id: number
  name: string
  slug: string
  description?: string
  color?: string
  isActive: boolean
  createdAt: string
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Auth methods
  async login(usernameOrEmail: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail, password }),
    })
  }

  async register(userData: {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async getCurrentUser() {
    return this.request('/auth/me')
  }

  // Posts methods
  async getPosts(params?: {
    page?: number
    pageSize?: number
    search?: string
    categoryId?: number
    status?: string
  }): Promise<ApiResponse<Post[]>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.pageSize) searchParams.set('pageSize', params.pageSize.toString())
    if (params?.search) searchParams.set('search', params.search)
    if (params?.categoryId) searchParams.set('categoryId', params.categoryId.toString())
    if (params?.status) searchParams.set('status', params.status)

    const query = searchParams.toString()
    return this.request<ApiResponse<Post[]>>(`/posts${query ? `?${query}` : ''}`)
  }

  async getPost(id: number): Promise<Post> {
    return this.request<Post>(`/posts/${id}`)
  }

  async getPostBySlug(slug: string): Promise<Post> {
    return this.request<Post>(`/posts/slug/${slug}`)
  }

  async getFeaturedPosts(limit = 5): Promise<ApiResponse<Post[]>> {
    return this.request<ApiResponse<Post[]>>(`/posts/featured?limit=${limit}`)
  }

  async createPost(postData: Partial<Post>): Promise<{ success: boolean; data: { id: number; slug: string } }> {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    })
  }

  async updatePost(id: number, postData: Partial<Post>): Promise<{ success: boolean; data: { id: number; slug: string } }> {
    return this.request(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    })
  }

  async deletePost(id: number): Promise<{ success: boolean; message: string }> {
    return this.request(`/posts/${id}`, {
      method: 'DELETE',
    })
  }

  // Categories methods
  async getCategories(): Promise<Category[]> {
    return this.request('/categories')
  }

  // Tags methods
  async getTags(): Promise<Tag[]> {
    return this.request('/tags')
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/health')
  }
}

export const api = new ApiClient(API_BASE_URL)
export default api 