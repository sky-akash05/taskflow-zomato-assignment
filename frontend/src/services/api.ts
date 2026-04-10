import axios, { AxiosError } from 'axios';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  Project,
  ProjectWithTasks,
  ProjectsResponse,
  CreateProjectInput,
  UpdateProjectInput,
  Task,
  TasksResponse,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
  ApiError,
  User,
} from '@/types';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Clear auth state on 401
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', credentials);
    return data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },
};

// Projects API
export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const { data } = await api.get<ProjectsResponse>('/projects');
    return data.projects || data as any; // Handle both {projects: []} and []
  },

  getById: async (id: string): Promise<ProjectWithTasks> => {
    const { data } = await api.get<ProjectWithTasks>(`/projects/${id}`);
    return data;
  },

  create: async (input: CreateProjectInput): Promise<Project> => {
    const { data } = await api.post<Project>('/projects', input);
    return data;
  },

  update: async (id: string, input: UpdateProjectInput): Promise<Project> => {
    const { data } = await api.patch<Project>(`/projects/${id}`, input);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

// Tasks API
export const tasksApi = {
  getByProject: async (projectId: string, filters?: TaskFilters): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.assignee) params.append('assignee', filters.assignee);

    const { data } = await api.get<TasksResponse>(
      `/projects/${projectId}/tasks${params.toString() ? `?${params.toString()}` : ''}`
    );
    return data.tasks || data as any; // Handle both {tasks: []} and []
  },

  create: async (projectId: string, input: CreateTaskInput): Promise<Task> => {
    const { data } = await api.post<Task>(`/projects/${projectId}/tasks`, input);
    return data;
  },

  update: async (id: string, input: UpdateTaskInput): Promise<Task> => {
    const { data } = await api.patch<Task>(`/tasks/${id}`, input);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};

// Users API (for assignee dropdown)
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const { data } = await api.get<User[]>('/users');
    return Array.isArray(data) ? data : [];
  },
};

export default api;
