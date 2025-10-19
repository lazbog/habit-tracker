import { useState } from 'react';
import { Check, X, Calendar, Trash2 } from 'lucide-react';
import { Habit } from '@/lib/types';

interface HabitItemProps {
  habit: Habit;
  onUpdate: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onViewHistory: () => void;
}

function HabitItem({ habit, onUpdate, onDelete, onViewHistory }: HabitItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const today = new Date().toDateString();
  const isCompletedToday = habit.completedDates.includes(today);

  const handleToggle = () => {
    const updatedCompletedDates = isCompletedToday
      ? habit.completedDates.filter(date => date !== today)
      : [...habit.completedDates, today];

    onUpdate({
      ...habit,
      completedDates: updatedCompletedDates,
    });
  };

  const handleDelete = () => {
    onDelete(habit.id);
    setShowDeleteConfirm(false);
  };

  const calculateStreak = () => {
    if (habit.completedDates.length === 0) return 0;
    
    const sortedDates = [...habit.completedDates]
      .map(date => new Date(date))
      .sort((a, b) => b.getTime() - a.getTime());
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      currentDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);
      
      if (currentDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const streak = calculateStreak();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={handleToggle}
            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
              isCompletedToday
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {isCompletedToday && <Check className="w-4 h-4" />}
          </button>
          
          <div className="flex-1">
            <h3 className={`font-medium ${
              isCompletedToday ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}>
              {habit.name}
            </h3>
            {habit.description && (
              <p className="text-sm text-gray-500 mt-1">{habit.description}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{streak}</div>
              <div className="text-xs text-gray-500">day streak</div>
            </div>

            <button
              onClick={onViewHistory}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="View history"
            >
              <Calendar className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete habit"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="mt-4 p-3 bg-red-50 rounded-md border border-red-200">
          <p className="text-sm text-red-800 mb-2">
            Are you sure you want to delete this habit?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              Yes, delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HabitItem
