# Habit Tracker

A simple and effective habit tracking application built with Next.js, TypeScript, and Tailwind CSS. Track your daily habits, monitor your progress, and build consistency in your routine.

## Features

- **Daily Habit Tracking**: Mark habits as complete for each day
- **Streak Counter**: Keep track of consecutive days completed
- **Habit History**: View a 90-day calendar of your habit completion history
- **Statistics**: Monitor completion rates and overall progress
- **Color Coding**: Assign colors to different habits for easy identification
- **Local Storage**: All data is stored locally in your browser
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

## Project Structure

- `app/` - Next.js 14 App Router pages and API routes
- `components/` - Reusable React components
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and type definitions
- `public/` - Static assets

## How to Use

1. **Add a Habit**: Click the "Add Habit" button to create a new habit with a name, description, and color
2. **Track Daily**: Check the box next to each habit to mark it as complete for the current day
3. **View History**: Click the calendar icon to see your completion history for the last 90 days
4. **Monitor Progress**: Keep an eye on your streak counter and completion rate
5. **Delete Habits**: Remove habits you no longer want to track

## Data Persistence

All habit data is stored in your browser's local storage. This means:
- Your data persists between sessions
- No server or database is required
- Data is only available on the device and browser where it was created