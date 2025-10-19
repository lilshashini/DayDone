import { useEffect, useState } from 'react';
import { getUserStats, type UserStats } from '../utils/statsUtils';
import { formatDate } from '../utils/dateUtils';

interface StatsCardsProps {
  userId: string | null;
  selectedDate: Date;
  refreshKey?: number;
}

export default function StatsCards({ userId, selectedDate, refreshKey = 0 }: StatsCardsProps) {
  const [stats, setStats] = useState<UserStats>({
    todayProgress: {
      completed: 0,
      total: 0,
      percentage: 0
    },
    streak: {
      current: 0,
      longest: 0,
      thisMonth: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    
    const fetchStats = async () => {
      setLoading(true);
      try {
        const userStats = await getUserStats(userId, selectedDate);
        setStats(userStats);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId, selectedDate, refreshKey]);

  if (loading) {
    return (
      <>
        {/* Quick Stats Card Loading State */}
        <div className="relative bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/40 dark:to-fuchsia-900/40 rounded-2xl shadow-lg animate-pulse min-h-[200px]" />
        
        {/* Streak Card Loading State */}
        <div className="relative bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-2xl shadow-lg animate-pulse min-h-[200px]" />
      </>
    );
  }

  return (
    <>
      {/* Quick Stats Card */}
      <div className="relative bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/40 dark:to-fuchsia-900/40 rounded-2xl shadow-lg shadow-purple-200/50 dark:shadow-purple-900/50 border border-purple-200 dark:border-purple-700 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden min-h-[200px]">
        <img 
          src="/DaDo_working.svg" 
          alt="DaDo Working"
          className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-contain select-none"
        />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-purple-700 dark:text-purple-300 text-sm font-semibold mb-1">
                {selectedDate.toDateString() === new Date().toDateString() 
                  ? "Today's Progress"
                  : formatDate(selectedDate) + "'s Progress"}
              </p>
              <h3 className="text-4xl font-bold text-slate-800 dark:text-slate-100">{stats.todayProgress.percentage}%</h3>
            </div>
            <div className="bg-purple-200 dark:bg-purple-800/50 p-3 rounded-xl">
              <svg className="w-6 h-6 text-purple-700 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 bg-purple-200 dark:bg-purple-800/30 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 h-2.5 rounded-full" 
                style={{ width: `${stats.todayProgress.percentage}%` }}
              />
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {stats.todayProgress.completed}/{stats.todayProgress.total}
            </span>
          </div>
          <p className="text-purple-700 dark:text-purple-300 text-sm font-medium">
            {stats.todayProgress.percentage >= 80 ? '🎯 Almost there! Finish strong!' :
             stats.todayProgress.percentage >= 50 ? '🔥 Keep going! You\'re on fire today!' :
             stats.todayProgress.percentage > 0 ? '💪 Great start! Keep up the momentum!' :
             '🎯 Ready to start your productive day?'}
          </p>
        </div>
      </div>

      {/* Streak Card */}
      <div className="relative bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-2xl shadow-lg shadow-amber-200/50 dark:shadow-amber-900/50 border border-amber-200 dark:border-amber-700 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden min-h-[200px]">
        <img 
          src="/DaDo_hurey.svg" 
          alt="DaDo Celebrating"
          className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-contain select-none"
        />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-amber-700 dark:text-amber-300 text-sm font-semibold mb-1">Current Streak</p>
              <h3 className="text-4xl font-bold text-slate-800 dark:text-slate-100">
                {stats.streak.current} {stats.streak.current === 1 ? 'Day' : 'Days'}
              </h3>
            </div>
            <div className="bg-amber-200 dark:bg-amber-800/50 p-3 rounded-xl">
              <span className="text-2xl">🔥</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-amber-700 dark:text-amber-300 font-medium">Longest Streak:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {stats.streak.longest} days
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-amber-700 dark:text-amber-300 font-medium">This Month:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {stats.streak.thisMonth} days
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}