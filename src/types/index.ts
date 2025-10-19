export type ID = string;
export type Timestamp = number;

export type HabitFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type HabitStatus = 'active' | 'paused' | 'archived' | 'deleted';

export type HabitPriority = 'low' | 'medium' | 'high' | 'critical';

export type HabitCategory = 'health' | 'fitness' | 'productivity' | 'learning' | 'mindfulness' | 'social' | 'finance' | 'creative' | 'other';

export interface Habit {
  id: ID;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  frequencyData: FrequencyData;
  status: HabitStatus;
  priority: HabitPriority;
  category: HabitCategory;
  color?: string;
  icon?: string;
  targetValue?: number;
  unit?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId?: ID;
}

export interface FrequencyData {
  daily?: null;
  weekly?: {
    days: DayOfWeek[];
    occurrencesPerWeek: number;
  };
  monthly?: {
    daysOfMonth: number[];
    occurrencesPerMonth: number;
  };
  custom?: {
    pattern: string;
    occurrences: number;
  };
}

export interface HabitCompletion {
  id: ID;
  habitId: ID;
  completedAt: Timestamp;
  value?: number;
  notes?: string;
  userId?: ID;
}

export interface HabitStreak {
  current: number;
  longest: number;
  history: number[];
}

export interface HabitProgress {
  habitId: ID;
  period: 'day' | 'week' | 'month' | 'year';
  startDate: Timestamp;
  endDate: Timestamp;
  totalCompletions: number;
  targetCompletions: number;
  completionRate: number;
  streak: HabitStreak;
}

export interface User {
  id: ID;
  email: string;
  name?: string;
  timezone: string;
  preferences: UserPreferences;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationSettings;
  defaultHabitTime: string;
  weekStartsOn: DayOfWeek;
}

export interface NotificationSettings {
  enabled: boolean;
  reminderTime: string;
  reminderDays: DayOfWeek[];
  streakReminders: boolean;
  achievementNotifications: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: PaginationMeta;
    timestamp: Timestamp;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CreateHabitInput {
  name: string;
  description?: string;
  frequency: HabitFrequency;
  frequencyData: FrequencyData;
  priority: HabitPriority;
  category: HabitCategory;
  color?: string;
  icon?: string;
  targetValue?: number;
  unit?: string;
}

export interface UpdateHabitInput {
  name?: string;
  description?: string;
  frequency?: HabitFrequency;
  frequencyData?: FrequencyData;
  status?: HabitStatus;
  priority?: HabitPriority;
  category?: HabitCategory;
  color?: string;
  icon?: string;
  targetValue?: number;
  unit?: string;
}

export interface HabitFilters {
  status?: HabitStatus[];
  categories?: HabitCategory[];
  priorities?: HabitPriority[];
  dateRange?: {
    start: Timestamp;
    end: Timestamp;
  };
  search?: string;
}

export interface DashboardStats {
  totalHabits: number;
  activeHabits: number;
  completedToday: number;
  currentStreaks: number;
  weeklyCompletionRate: number;
  monthlyCompletionRate: number;
  mostConsistentHabit?: Habit;
  leastConsistentHabit?: Habit;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export interface Achievement {
  id: ID;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Timestamp;
  userId: ID;
}

export interface AnalyticsData {
  period: 'week' | 'month' | 'year';
  completionTrend: ChartData;
  categoryBreakdown: ChartData;
  streakHistory: number[];
  bestDay: DayOfWeek;
  worstDay: DayOfWeek;
  averageCompletionsPerDay: number;
}

export interface ExportData {
  habits: Habit[];
  completions: HabitCompletion[];
  exportedAt: Timestamp;
  format: 'json' | 'csv';
}

export type SortOrder = 'asc' | 'desc';

export type SortField = 'name' | 'createdAt' | 'updatedAt' | 'priority' | 'category' | 'streak';

export interface SortOptions {
  field: SortField;
  order: SortOrder;
}

export interface QueryOptions {
  filters?: HabitFilters;
  sort?: SortOptions;
  pagination?: {
    page: number;
    limit: number;
  };
}

export type FormFieldError = {
  message: string;
};

export type FormErrors<T extends Record<string, any>> = {
  [K in keyof T]?: FormFieldError;
};

export interface LoadingState {
  isLoading: boolean;
  isSubmitting: boolean;
  error?: string;
}

export interface ToastMessage {
  id: ID;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
}