export interface Habit {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  completedDates: string[];
}

export interface HabitFormData {
  name: string;
  description: string;
  color: string;
}