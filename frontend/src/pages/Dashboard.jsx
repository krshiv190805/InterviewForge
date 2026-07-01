import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { 
  Flame, 
  Award, 
  CheckCircle, 
  Clock, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  Target
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('/api/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
        addToast('Failed to load dashboard statistics.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
    refreshUser(); // Sync top navbar user details
  }, [addToast]);

  if (loading) {
    return (
      <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-48 animate-pulse"></div>
        <SkeletonLoader type="dashboard" count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalProblems: 0,
    solvedProblemsCount: 0,
    attemptedCount: 0,
    todoCount: 0,
    streak: 0,
    readinessScore: 0,
    weeklyGoal: 5,
    solvedThisWeek: 0,
    revisionDueToday: 0
  };

  const difficultyDistribution = data?.difficultyDistribution || [
    { name: 'Easy', solved: 0, total: 0 },
    { name: 'Medium', solved: 0, total: 0 },
    { name: 'Hard', solved: 0, total: 0 }
  ];

  const COLORS = ['#10b981', '#f59e0b', '#f43f5e'];

  const chartData = difficultyDistribution.map(d => ({
    name: d.name,
    value: d.solved
  })).filter(item => item.value > 0);

  const totalSolved = metrics.solvedProblemsCount;
  const weeklyPercent = Math.min(100, Math.round((metrics.solvedThisWeek / metrics.weeklyGoal) * 100));

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome back, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">{user?.name}</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Here is your coding progress and interview readiness dashboard.</p>
        </div>
        <Link 
          to="/problems" 
          className="inline-flex items-center gap-2 p-3 px-5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-500/20 transition-all btn-transition"
        >
          <span>Track New Problem</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 glass-panel shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Solved Problems</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-950 dark:text-white">{totalSolved}</span>
            <span className="text-xs text-slate-500">tracked</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-500" />
            <span>{metrics.attemptedCount} attempted, {metrics.todoCount} todo</span>
          </div>
        </div>


        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 glass-panel shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Coding Streak</span>
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Flame size={20} fill="currentColor" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-950 dark:text-white">{metrics.streak}</span>
            <span className="text-xs text-slate-500">Days</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Solve problems daily to protect your streak.
          </div>
        </div>

        <div 
          onClick={() => navigate('/revision')}
          className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 glass-panel shadow-sm cursor-pointer hover:border-blue-500/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Revision Due Today</span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-950 dark:text-white">{metrics.revisionDueToday}</span>
            <span className="text-xs text-slate-500">problems</span>
          </div>
          <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-semibold group-hover:underline flex items-center gap-1">
            <span>Review now</span>
            <ArrowRight size={12} />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 glass-panel">
          <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-4">Difficulty Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            
            <div className="h-60">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => {
                        const originalIndex = difficultyDistribution.findIndex(d => d.name === entry.name);
                        return <Cell key={`cell-${index}`} fill={COLORS[originalIndex === -1 ? 0 : originalIndex]} />;
                      })}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <p className="text-sm font-medium">No solved problems yet.</p>
                  <p className="text-xs mt-1">Start tracking to generate metrics.</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {difficultyDistribution.map((diff, index) => (
                <div key={diff.name} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/35 border border-slate-200/50 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{diff.name}</span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {diff.solved} / {diff.total} Solved
                    </span>
                  </div>
                  <div className="mt-2.5 w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all" 
                      style={{ 
                        backgroundColor: COLORS[index],
                        width: `${diff.total > 0 ? (diff.solved / diff.total) * 100 : 0}%` 
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        <div className="space-y-8">
          
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 glass-panel">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">Weekly Goals</h3>
              <Target className="text-indigo-500" size={20} />
            </div>
            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-center">
              <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {metrics.solvedThisWeek} <span className="text-sm text-slate-500 font-medium">/ {metrics.weeklyGoal}</span>
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Solved in the last 7 days</p>
              
              <div className="mt-4 w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 dark:bg-indigo-450 h-full transition-all duration-300" style={{ width: `${weeklyPercent}%` }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-semibold">
                {weeklyPercent}% completed
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 glass-panel">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">Upcoming Contests</h3>
              <Calendar className="text-blue-500" size={20} />
            </div>
            <div className="space-y-3">
              {data?.upcomingContests?.map(contest => (
                <div key={contest.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">{contest.platform}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{contest.date}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{contest.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
