import { supabase } from '../lib/supabase';
import { formatDate } from './dateUtils';

export interface UserStats {
  todayProgress: {
    completed: number;
    total: number;
    percentage: number;
  };
  streak: {
    current: number;
    longest: number;
    thisMonth: number;
  };
}

export async function getUserStats(userId: string, selectedDate?: Date): Promise<UserStats> {
  const today = new Date();
  const targetDate = selectedDate || today;
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  // Get tasks for the selected date
  const { data: dateTasks } = await supabase
    .from('work_logs')
    .select(`
      id,
      tasks (
        status
      )
    `)
    .eq('user_id', userId)
    .eq('date', formatDate(targetDate))
    .single();

  // Calculate progress for the selected date
  const tasks = dateTasks?.tasks || [];
  const total = tasks.length;
  const completed = tasks.filter((task: any) => task.status === 'Finished').length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  // Get streak data
  const { data: workLogs } = await supabase
    .from('work_logs')
    .select('date, tasks(status)')
    .eq('user_id', userId)
    .gte('date', firstDayOfMonth.toISOString().split('T')[0])
    .order('date', { ascending: false });

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let thisMonthStreak = 0;
  let tempStreak = 0;
  
  const sortedLogs = (workLogs || []).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate streaks
  sortedLogs.forEach((log, index) => {
    const hasCompletedTasks = log.tasks.some((task: any) => task.status === 'Finished');
    const currentDate = new Date(log.date);
    const prevDate = index > 0 ? new Date(sortedLogs[index - 1].date) : null;

    if (hasCompletedTasks) {
      if (index === 0 || 
          (prevDate && Math.abs(currentDate.getTime() - prevDate.getTime()) === 86400000)) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    } else {
      tempStreak = 0;
    }

    // Update streaks
    if (index === 0) {
      currentStreak = tempStreak;
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    if (currentDate.getMonth() === today.getMonth()) {
      thisMonthStreak++;
    }
  });

  return {
    todayProgress: {
      completed,
      total,
      percentage
    },
    streak: {
      current: currentStreak,
      longest: longestStreak,
      thisMonth: thisMonthStreak
    }
  };
}