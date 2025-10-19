import { useMemo } from 'react';
import { X } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';

interface HabitHistoryProps {
  habitId: string;
  onClose: () => void;
}

function HabitHistory({ habitId, onClose }: HabitHistoryProps) {
  const { habits } = useHabits();
  const habit = habits.find((h) => h.id === habitId);

  const calendarDays = useMemo(() => {
    const days = [];
    const today = new Date();
    
    // Generate last 90 days
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      days.push(date);
    }
    
    return days;
  }, []);

  const getCompletionStatus = (date: Date) => {
    if (!habit) return false;
    const dateString = date.toDateString();
    return habit.completedDates.includes(dateString);
  };

  const getMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getStats = () => {
    if (!habit) return { total: 0, percentage: 0, currentStreak: 0 };
    
    const total = habit.completedDates.length;
    const percentage = Math.round((total / 90) * 100);
    
    // Calculate current streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 90; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toDateString();
      
      if (habit.completedDates.includes(dateString)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return { total, percentage, currentStreak: streak };
  };

  if (!habit) return null;

  const stats = getStats();
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{habit.name}</h2>
            <p className="text-gray-600 mt-1">Last 90 days</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-blue-800">Days completed</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{stats.percentage}%</div>
            <div className="text-sm text-green-800">Completion rate</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.currentStreak}</div>
            <div className="text-sm text-orange-800">Current streak</div>
          </div>
        </div>

        <div className="space-y-4">
          {weeks.map((week, weekIndex) => {
            const monthYear = getMonthYear(week[0]);
            const prevMonth = weekIndex > 0 ? getMonthYear(weeks[weekIndex - 1][0]) : null;
            
            return (
              <div key={weekIndex}>
                {monthYear !== prevMonth && (
                  <h3 className="text-sm font-medium text-gray-700 mb-2">{monthYear}</h3>
                )}
                <div className="grid grid-cols-7 gap-2">
                  {week.map((day) => {
                    const isCompleted = getCompletionStatus(day);
                    const isToday = day.toDateString() === new Date().toDateString();
                    
                    return (
                      <div
                        key={day.toISOString()}
                        className="text-center"
                      >
                        <div
                          className={`w-10 h-10 rounded-md flex items-center justify-center text-xs font-medium transition-colors ${
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-100 text-gray-400'
                          } ${
                            isToday ? 'ring-2 ring-blue-500' : ''
                          }`}
                        >
                          {day.getDate()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {day.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <span>Missed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded ring-2 ring-blue-500"></div>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HabitHistory
