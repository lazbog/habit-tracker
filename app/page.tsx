import { useState } from 'react';
import { Plus } from 'lucide-react';
import { HabitItem } from '@/components/HabitItem';
import { AddHabitForm } from '@/components/AddHabitForm';
import { HabitHistory } from '@/components/HabitHistory';
import { useHabits } from '@/hooks/useHabits';

export default function HomePage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const { habits, addHabit, updateHabit, deleteHabit } = useHabits();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Habit Tracker</h1>
          <p className="text-gray-600">{today}</p>
        </header>

        <main className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Today's Habits ({habits.length})
            </h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Habit
            </button>
          </div>

          {habits.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500 mb-4">No habits yet. Start building your routine!</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Create your first habit
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {habits.map((habit) => (
                <HabitItem
                  key={habit.id}
                  habit={habit}
                  onUpdate={updateHabit}
                  onDelete={deleteHabit}
                  onViewHistory={() => setSelectedHabitId(habit.id)}
                />
              ))}
            </div>
          )}
        </main>

        {showAddForm && (
          <AddHabitForm
            onClose={() => setShowAddForm(false)}
            onSubmit={addHabit}
          />
        )}

        {selectedHabitId && (
          <HabitHistory
            habitId={selectedHabitId}
            onClose={() => setSelectedHabitId(null)}
          />
        )}
      </div>
    </div>
  );
}