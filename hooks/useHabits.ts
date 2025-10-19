import { useState, useEffect } from 'react';
import { Habit } from '@/lib/types';
import { getHabitsFromStorage, saveHabitsToStorage, generateId } from '@/lib/habits';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    setHabits(getHabitsFromStorage());
  }, []);

  useEffect(() => {
    saveHabitsToStorage(habits);
  }, [habits]);

  const addHabit = (habitData: Omit<Habit, 'id' | 'completedDates'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: generateId(),
      completedDates: [],
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const updateHabit = (updatedHabit: Habit) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === updatedHabit.id ? updatedHabit : habit
      )
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
  };

  return {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
  };
}