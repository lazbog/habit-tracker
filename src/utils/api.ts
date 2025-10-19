import { Habit, HabitEntry, User, ApiResponse, PaginatedResponse } from '@/types';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Default request headers
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// API client class for centralized request handling
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string, defaultHeaders: Record<string, string>) {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
  }

  // Generic request method with proper error handling
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get auth token from localStorage if available (client-side only)
    let authHeaders = {};
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        authHeaders = { Authorization: `Bearer ${token}` };
      }
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...authHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Invalid response format from server');
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle API error responses
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      // Consistent error format
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        data: null as T,
      };
    }
  }

  // HTTP method helpers
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<T>(`${endpoint}${queryString}`, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL, DEFAULT_HEADERS);

// Authentication API functions
export const authApi = {
  // User login
  login: async (email: string, password: string) => {
    return apiClient.post<{ user: User; token: string }>('/auth/login', { email, password });
  },

  // User registration
  register: async (userData: {
    email: string;
    password: string;
    name: string;
  }) => {
    return apiClient.post<{ user: User; token: string }>('/auth/register', userData);
  },

  // Refresh authentication token
  refreshToken: async () => {
    return apiClient.post<{ token: string }>('/auth/refresh');
  },

  // User logout
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    // Clear token from localStorage on successful logout
    if (response.success && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    return response;
  },

  // Get current user profile
  getProfile: async () => {
    return apiClient.get<User>('/auth/profile');
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>) => {
    return apiClient.put<User>('/auth/profile', userData);
  },
};

// Habits API functions
export const habitsApi = {
  // Get all habits for the authenticated user
  getHabits: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    active?: boolean;
  }) => {
    return apiClient.get<PaginatedResponse<Habit>>('/habits', params);
  },

  // Get a specific habit by ID
  getHabit: async (id: string) => {
    return apiClient.get<Habit>(`/habits/${id}`);
  },

  // Create a new habit
  createHabit: async (habitData: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    return apiClient.post<Habit>('/habits', habitData);
  },

  // Update an existing habit
  updateHabit: async (id: string, habitData: Partial<Habit>) => {
    return apiClient.put<Habit>(`/habits/${id}`, habitData);
  },

  // Delete a habit
  deleteHabit: async (id: string) => {
    return apiClient.delete(`/habits/${id}`);
  },

  // Toggle habit active status
  toggleHabit: async (id: string) => {
    return apiClient.patch<Habit>(`/habits/${id}/toggle`);
  },
};

// Habit entries API functions
export const habitEntriesApi = {
  // Get entries for a specific habit
  getEntries: async (
    habitId: string,
    params?: {
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    }
  ) => {
    return apiClient.get<PaginatedResponse<HabitEntry>>(`/habits/${habitId}/entries`, params);
  },

  // Add a new entry for a habit
  addEntry: async (habitId: string, entryData: {
    date: string;
    value?: number;
    notes?: string;
  }) => {
    return apiClient.post<HabitEntry>(`/habits/${habitId}/entries`, entryData);
  },

  // Update an existing entry
  updateEntry: async (habitId: string, entryId: string, entryData: Partial<HabitEntry>) => {
    return apiClient.put<HabitEntry>(`/habits/${habitId}/entries/${entryId}`, entryData);
  },

  // Delete an entry
  deleteEntry: async (habitId: string, entryId: string) => {
    return apiClient.delete(`/habits/${habitId}/entries/${entryId}`);
  },

  // Get statistics for a habit
  getStats: async (habitId: string, params?: {
    period?: 'week' | 'month' | 'year';
    startDate?: string;
    endDate?: string;
  }) => {
    return apiClient.get<{
      totalEntries: number;
      completionRate: number;
      streak: number;
      bestStreak: number;
      averageValue?: number;
    }>(`/habits/${habitId}/stats`, params);
  },
};

// Dashboard API functions
export const dashboardApi = {
  // Get dashboard overview data
  getOverview: async () => {
    return apiClient.get<{
      totalHabits: number;
      activeHabits: number;
      completedToday: number;
      currentStreaks: Array<{ habitId: string; habitName: string; streak: number }>;
      recentEntries: