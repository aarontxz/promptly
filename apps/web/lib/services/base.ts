import { User } from '../types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiService {
  private baseUrl: string
  private token: string | null = null

  constructor() {
    this.baseUrl = API_BASE_URL
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token')
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
    }
  }

  async request<T>(
    endpoint: string, 
    options: RequestInit = {},
    useProxy: boolean = true
  ): Promise<T> {
    // Use the Next.js API proxy for authenticated requests
    const url = useProxy 
      ? `/api/backend${endpoint}`
      : `${this.baseUrl}${endpoint}`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    // Only add Authorization header for direct backend calls
    if (!useProxy && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API Error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  async syncUserWithBackend(data: {
    email: string
    name: string
    google_id: string
  }) {
    return this.request<{ user: User }>('/auth/sync-user', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

export const apiService = new ApiService()
