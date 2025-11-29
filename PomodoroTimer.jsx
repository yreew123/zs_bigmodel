import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Plus, Trash2, Check, Settings, X, 
  Coffee, Brain, Armchair, Calendar, User, LogOut, 
  ChevronLeft, ChevronRight, Lock, Mail, ArrowRight, BarChart3, TrendingUp, Clock,
  Trophy, Award, Star, Target, Tag, Flag, Timer, Zap
} from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// --- Helper Functions ---
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const isSameDay = (d1, d2) => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

// --- Components ---

// 1. Auth Component (Simplified Demo)
const AuthView = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin({ email, uid: 'demo-user' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 border border-white/50">
        {/* Toggle Header */}
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${isLogin ? 'text-red-500 bg-white' : 'text-gray-400 bg-gray-50 hover:bg-gray-100'}`}
          >
            登录
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${!isLogin ? 'text-red-500 bg-white' : 'text-gray-400 bg-gray-50 hover:bg-gray-100'}`}
          >
            注册
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-4 shadow-sm">
              <Brain size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isLogin ? '欢迎回来' : '开始专注之旅'}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {isLogin ? '登录以同步您的数据' : '创建一个账号来记录您的进步'}
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 ml-1">电子邮箱</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-red-500 transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:bg-white transition-all text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 ml-1">密码</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-red-500 transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:bg-white transition-all text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLogin ? '立即登录' : '创建账号'}
              <ArrowRight size={18} />
            </button>
          </div>
          
          <div className="mt-6 text-center text-xs text-gray-400">
            演示版 - 输入任意邮箱密码即可体验
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Statistics Component
const StatisticsView = ({ sessions }) => {
  const [timeRange, setTimeRange] = useState('week'); // week, month, all

  // Calculate statistics
  const getFilteredSessions = () => {
    const now = new Date();
    if (timeRange === 'all') return sessions;
    
    const days = timeRange === 'week' ? 7 : 30;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return sessions.filter(s => new Date(s.date) >= cutoff);
  };

  const filteredSessions = getFilteredSessions();
  
  // Total stats
  const totalSessions = filteredSessions.length;
  const totalMinutes = filteredSessions.reduce((sum, s) => sum + s.duration, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  // Daily average
  const daysCount = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : Math.max(1, Math.ceil((Date.now() - new Date(sessions[sessions.length - 1]?.date || Date.now()).getTime()) / (24 * 60 * 60 * 1000)));
  const avgPerDay = (totalMinutes / daysCount).toFixed(1);

  // Line chart data - last 7/30 days
  const getLineChartData = () => {
    const days = timeRange === 'week' ? 7 : 30;
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStr = `${date.getMonth() + 1}/${date.getDate()}`;
      const daySessions = sessions.filter(s => isSameDay(new Date(s.date), date));
      const minutes = daySessions.reduce((sum, s) => sum + s.duration, 0);
      
      data.push({
        date: dayStr,
        minutes: minutes,
        sessions: daySessions.length
      });
    }
    return data;
  };

  // Pie chart data - time distribution by hour
  const getPieChartData = () => {
    const hourCounts = {};
    filteredSessions.forEach(s => {
      const hour = new Date(s.date).getHours();
      const period = hour < 6 ? '凌晨 (0-6时)' : 
                     hour < 12 ? '上午 (6-12时)' : 
                     hour < 18 ? '下午 (12-18时)' : '晚上 (18-24时)';
      hourCounts[period] = (hourCounts[period] || 0) + s.duration;
    });
    
    return Object.entries(hourCounts).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / totalMinutes) * 100).toFixed(1)
    }));
  };

  // Bar chart data - sessions per day of week
  const getBarChartData = () => {
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const dayCounts = weekDays.map(() => 0);
    
    filteredSessions.forEach(s => {
      const day = new Date(s.date).getDay();
      dayCounts[day]++;
    });
    
    return weekDays.map((name, idx) => ({
      name,
      sessions: dayCounts[idx]
    }));
  };

  const lineData = getLineChartData();
  const pieData = getPieChartData();
  const barData = getBarChartData();

  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981'];

  return (
    <div className="w-full max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Time Range Selector */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="flex justify-center gap-2">
          {[
            { key: 'week', label: '最近7天' },
            { key: 'month', label: '最近30天' },
            { key: 'all', label: '全部' }
          ].map(range => (
            <button
              key={range.key}
              onClick={() => setTimeRange(range.key)}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                timeRange === range.key
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Clock size={24} className="opacity-80" />
            <TrendingUp size={20} className="opacity-60" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {totalHours}h {remainingMinutes}m
          </div>
          <div className="text-red-100 text-sm">总专注时长</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 size={24} className="opacity-80" />
            <Check size={20} className="opacity-60" />
          </div>
          <div className="text-3xl font-bold mb-1">{totalSessions}</div>
          <div className="text-orange-100 text-sm">完成次数</div>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Brain size={24} className="opacity-80" />
            <ArrowRight size={20} className="opacity-60" />
          </div>
          <div className="text-3xl font-bold mb-1">{avgPerDay}m</div>
          <div className="text-teal-100 text-sm">日均专注</div>
        </div>
      </div>

      {/* Line Chart - Daily Trend */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-red-500" />
          专注趋势
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#999" style={{ fontSize: '12px' }} />
            <YAxis stroke="#999" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value) => [`${value}分钟`, '专注时长']}
            />
            <Line 
              type="monotone" 
              dataKey="minutes" 
              stroke="#ef4444" 
              strokeWidth={3}
              dot={{ fill: '#ef4444', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart - Time Distribution */}
        {pieData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-red-500" />
              时段分布
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}分钟`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Bar Chart - Weekly Pattern */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-red-500" />
            每周规律
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#999" style={{ fontSize: '12px' }} />
              <YAxis stroke="#999" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value) => [`${value}次`, '专注次数']}
              />
              <Bar dataKey="sessions" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sessions List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">最近记录</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredSessions.slice(0, 10).map((session, idx) => (
            <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-800">
                    {session.taskText || '专注时段'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(session.date).toLocaleString('zh-CN', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              <div className="text-red-500 font-bold">{session.duration}分钟</div>
            </div>
          ))}
          {filteredSessions.length === 0 && (
            <div className="text-center py-8 text-gray-400">暂无数据</div>
          )}
        </div>
      </div>
    </div>
  );
};

// 3. Calendar Component
const CalendarView = ({ sessions, user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getSessionCount = (date) => {
    if (!date) return 0;
    return sessions.filter(s => isSameDay(new Date(s.date), date)).length;
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">{year}年 {month + 1}月</h2>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><ChevronLeft size={20} /></button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['日', '一', '二', '三', '四', '五', '六'].map(d => (
          <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((date, idx) => {
          if (!date) return <div key={idx} className="aspect-square" />;
          const count = getSessionCount(date);
          const isToday = isSameDay(date, new Date());
          const hasActivity = count > 0;
          return (
            <div key={idx} className="relative aspect-square flex flex-col items-center justify-center rounded-xl transition-all hover:bg-gray-50 group">
              <span className={`text-sm ${isToday ? 'font-bold text-red-500' : 'text-gray-700'} z-10`}>{date.getDate()}</span>
              {hasActivity && <div className={`absolute inset-0 m-1 rounded-lg opacity-20 ${count >= 4 ? 'bg-red-600' : count >= 2 ? 'bg-red-400' : 'bg-red-300'}`}></div>}
              {hasActivity && <div className="absolute bottom-1 w-1 h-1 bg-red-500 rounded-full"></div>}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 flex items-center justify-center space-x-4 text-xs text-gray-400">
        <div className="flex items-center"><div className="w-3 h-3 bg-red-300 rounded mr-1 opacity-50"></div><span>1-2次</span></div>
        <div className="flex items-center"><div className="w-3 h-3 bg-red-600 rounded mr-1 opacity-50"></div><span>4次+</span></div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-100 text-center">
        <p className="text-gray-500 text-sm">本月累计专注 <span className="font-bold text-red-500 text-lg mx-1">{sessions.filter(s => new Date(s.date).getMonth() === month && new Date(s.date).getFullYear() === year).length}</span> 次</p>
      </div>
    </div>
  );
};

// 3.5. Achievements Component
const AchievementsView = ({ sessions, achievements, onAchievementClick }) => {
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
  const totalSessions = sessions.length;
  
  // 计算连续专注天数
  const getConsecutiveDays = () => {
    if (sessions.length === 0) return 0;
    const sortedSessions = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));
    const dates = [...new Set(sortedSessions.map(s => new Date(s.date).toDateString()))];
    
    let consecutive = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      date.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
      if (diffDays === i) {
        consecutive++;
      } else {
        break;
      }
    }
    return consecutive;
  };

  const consecutiveDays = getConsecutiveDays();

  // 成就定义
  const achievementDefinitions = [
    {
      id: 'first_session',
      name: '初出茅庐',
      description: '完成第一次专注',
      icon: <Star size={24} />,
      color: 'from-yellow-400 to-yellow-600',
      progress: totalSessions > 0 ? 100 : 0,
      target: 1,
      current: totalSessions,
      unlocked: achievements.includes('first_session')
    },
    {
      id: 'ten_sessions',
      name: '小有成就',
      description: '完成10次专注',
      icon: <Trophy size={24} />,
      color: 'from-orange-400 to-orange-600',
      progress: Math.min(100, (totalSessions / 10) * 100),
      target: 10,
      current: totalSessions,
      unlocked: achievements.includes('ten_sessions')
    },
    {
      id: 'fifty_sessions',
      name: '专注达人',
      description: '完成50次专注',
      icon: <Award size={24} />,
      color: 'from-red-400 to-red-600',
      progress: Math.min(100, (totalSessions / 50) * 100),
      target: 50,
      current: totalSessions,
      unlocked: achievements.includes('fifty_sessions')
    },
    {
      id: 'hundred_sessions',
      name: '专注大师',
      description: '完成100次专注',
      icon: <Trophy size={24} />,
      color: 'from-purple-400 to-purple-600',
      progress: Math.min(100, (totalSessions / 100) * 100),
      target: 100,
      current: totalSessions,
      unlocked: achievements.includes('hundred_sessions')
    },
    {
      id: 'one_hour',
      name: '时间积累',
      description: '累计专注1小时',
      icon: <Clock size={24} />,
      color: 'from-blue-400 to-blue-600',
      progress: Math.min(100, (totalMinutes / 60) * 100),
      target: 60,
      current: totalMinutes,
      unlocked: achievements.includes('one_hour')
    },
    {
      id: 'ten_hours',
      name: '时间大师',
      description: '累计专注10小时',
      icon: <Target size={24} />,
      color: 'from-green-400 to-green-600',
      progress: Math.min(100, (totalMinutes / 600) * 100),
      target: 600,
      current: totalMinutes,
      unlocked: achievements.includes('ten_hours')
    },
    {
      id: 'consecutive_3',
      name: '坚持三天',
      description: '连续专注3天',
      icon: <Zap size={24} />,
      color: 'from-pink-400 to-pink-600',
      progress: Math.min(100, (consecutiveDays / 3) * 100),
      target: 3,
      current: consecutiveDays,
      unlocked: achievements.includes('consecutive_3')
    },
    {
      id: 'consecutive_7',
      name: '一周坚持',
      description: '连续专注7天',
      icon: <Star size={24} />,
      color: 'from-indigo-400 to-indigo-600',
      progress: Math.min(100, (consecutiveDays / 7) * 100),
      target: 7,
      current: consecutiveDays,
      unlocked: achievements.includes('consecutive_7')
    },
    {
      id: 'consecutive_30',
      name: '月度坚持',
      description: '连续专注30天',
      icon: <Trophy size={24} />,
      color: 'from-amber-400 to-amber-600',
      progress: Math.min(100, (consecutiveDays / 30) * 100),
      target: 30,
      current: consecutiveDays,
      unlocked: achievements.includes('consecutive_30')
    }
  ];

  const unlockedCount = achievementDefinitions.filter(a => a.unlocked).length;

  return (
    <div className="w-full max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 成就概览 */}
      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Trophy size={32} />
              成就系统
            </h2>
            <p className="text-yellow-100">解锁你的专注潜力</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{unlockedCount}/{achievementDefinitions.length}</div>
            <div className="text-yellow-100 text-sm">已解锁</div>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3 mt-4">
          <div 
            className="bg-white rounded-full h-3 transition-all duration-500"
            style={{ width: `${(unlockedCount / achievementDefinitions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 成就列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievementDefinitions.map((achievement) => (
          <div
            key={achievement.id}
            onClick={() => onAchievementClick && onAchievementClick(achievement)}
            className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
              achievement.unlocked ? 'ring-2 ring-yellow-400' : 'opacity-75'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${achievement.color} text-white ${
                achievement.unlocked ? '' : 'grayscale opacity-50'
              }`}>
                {achievement.icon}
              </div>
              {achievement.unlocked && (
                <div className="text-yellow-500">
                  <Check size={24} />
                </div>
              )}
            </div>
            <h3 className={`text-lg font-bold mb-1 ${achievement.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
              {achievement.name}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{achievement.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>进度</span>
                <span>{achievement.current}/{achievement.target}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${achievement.color}`}
                  style={{ width: `${achievement.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. Main App Component
const PomodoroApp = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('timer'); // timer, calendar, stats, achievements
  const [sessions, setSessions] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [newUnlockedAchievements, setNewUnlockedAchievements] = useState([]); // 新解锁的成就（用于弹窗显示）
  
  // 获取成就详细信息
  const getAchievementInfo = (achievementId) => {
    const achievementMap = {
      'first_session': { name: '初出茅庐', description: '完成第一次专注', icon: Star, color: 'from-yellow-400 to-yellow-600' },
      'ten_sessions': { name: '小有成就', description: '完成10次专注', icon: Trophy, color: 'from-orange-400 to-orange-600' },
      'fifty_sessions': { name: '专注达人', description: '完成50次专注', icon: Award, color: 'from-red-400 to-red-600' },
      'hundred_sessions': { name: '专注大师', description: '完成100次专注', icon: Trophy, color: 'from-purple-400 to-purple-600' },
      'one_hour': { name: '时间积累', description: '累计专注1小时', icon: Clock, color: 'from-blue-400 to-blue-600' },
      'ten_hours': { name: '时间大师', description: '累计专注10小时', icon: Target, color: 'from-green-400 to-green-600' },
      'consecutive_3': { name: '坚持三天', description: '连续专注3天', icon: Zap, color: 'from-pink-400 to-pink-600' },
      'consecutive_7': { name: '一周坚持', description: '连续专注7天', icon: Star, color: 'from-indigo-400 to-indigo-600' },
      'consecutive_30': { name: '月度坚持', description: '连续专注30天', icon: Trophy, color: 'from-amber-400 to-amber-600' }
    };
    return achievementMap[achievementId] || { name: '未知成就', description: '', icon: Trophy, color: 'from-gray-400 to-gray-600' };
  };

  // 自动关闭成就弹窗
  useEffect(() => {
    if (newUnlockedAchievements.length > 0) {
      const timer = setTimeout(() => {
        setNewUnlockedAchievements([]);
      }, 5000); // 5秒后自动关闭
      return () => clearTimeout(timer);
    }
  }, [newUnlockedAchievements]);

  // Timer Settings & State
  const defaultSettings = { focus: 25, shortBreak: 5, longBreak: 15 };
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(defaultSettings.focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const [showSettings, setShowSettings] = useState(false);
  const timerRef = useRef(null);
  const [editingPart, setEditingPart] = useState(null); // 'minutes' or 'seconds' or null
  const timeDisplayRef = useRef(null);
  const dragStateRef = useRef(null); // 存储拖拽状态

  // Task State
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [taskForm, setTaskForm] = useState({
    text: '',
    priority: 'medium', // high, medium, low
    category: '',
    estimatedPomodoros: 1
  });

  // --- Audio Function (Web Audio API) ---
  const playAudio = (freq, duration, volume = 0.5) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return; 

      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + (duration / 1000) - 0.05);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + (duration / 1000));
    } catch (e) {
      console.warn("Audio playback issue:", e);
    }
  };

  // 检查并更新成就
  const checkAchievements = (newSessions, currentAchievements) => {
    if (newSessions.length === 0) return [];
    
    const totalSessions = newSessions.length;
    const totalMinutes = newSessions.reduce((sum, s) => sum + s.duration, 0);
    
    // 计算连续天数
    const sortedSessions = [...newSessions].sort((a, b) => new Date(b.date) - new Date(a.date));
    const dates = [...new Set(sortedSessions.map(s => new Date(s.date).toDateString()))];
    let consecutiveDays = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      date.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
      if (diffDays === i) {
        consecutiveDays++;
      } else {
        break;
      }
    }

    const newAchievements = [];
    
    // 检查各种成就
    if (totalSessions >= 1 && !currentAchievements.includes('first_session')) {
      newAchievements.push('first_session');
    }
    if (totalSessions >= 10 && !currentAchievements.includes('ten_sessions')) {
      newAchievements.push('ten_sessions');
    }
    if (totalSessions >= 50 && !currentAchievements.includes('fifty_sessions')) {
      newAchievements.push('fifty_sessions');
    }
    if (totalSessions >= 100 && !currentAchievements.includes('hundred_sessions')) {
      newAchievements.push('hundred_sessions');
    }
    if (totalMinutes >= 60 && !currentAchievements.includes('one_hour')) {
      newAchievements.push('one_hour');
    }
    if (totalMinutes >= 600 && !currentAchievements.includes('ten_hours')) {
      newAchievements.push('ten_hours');
    }
    if (consecutiveDays >= 3 && !currentAchievements.includes('consecutive_3')) {
      newAchievements.push('consecutive_3');
    }
    if (consecutiveDays >= 7 && !currentAchievements.includes('consecutive_7')) {
      newAchievements.push('consecutive_7');
    }
    if (consecutiveDays >= 30 && !currentAchievements.includes('consecutive_30')) {
      newAchievements.push('consecutive_30');
    }

    return newAchievements;
  };

  const saveSession = () => {
    if (mode !== 'focus') return;
    const newSession = {
      id: Date.now(),
      date: new Date().toISOString(),
      duration: settings.focus,
      mode: 'focus',
      taskId: activeTaskId || null,
      taskText: activeTaskId ? tasks.find(t => t.id === activeTaskId)?.text : null
    };
    setSessions(prev => {
      const updated = [newSession, ...prev];
      // 检查成就（使用函数式更新确保获取最新的achievements）
      setAchievements(prevAchievements => {
        const newAchievements = checkAchievements(updated, prevAchievements);
        if (newAchievements.length > 0) {
          // 获取成就详细信息并显示弹窗
          const achievementInfos = newAchievements.map(id => ({
            id,
            ...getAchievementInfo(id)
          }));
          setNewUnlockedAchievements(achievementInfos);
          
          // 播放成就解锁音效
          newAchievements.forEach((_, index) => {
            setTimeout(() => {
              playAudio(660, 300, 0.6);
              setTimeout(() => playAudio(880, 300, 0.6), 150);
            }, index * 200);
          });
          return [...prevAchievements, ...newAchievements];
        }
        return prevAchievements;
      });
      return updated;
    });
    
    // 更新任务的完成番茄数
    if (activeTaskId) {
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === activeTaskId 
          ? { ...task, completedPomodoros: (task.completedPomodoros || 0) + 1 }
          : task
      ));
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => { setTimeLeft((prev) => prev - 1); }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (isRunning) {
        playAudio(880, 500, 0.7);
        if (mode === 'focus') saveSession();
      }
    }
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const label = mode === 'focus' ? '专注' : mode === 'shortBreak' ? '短休' : '长休';
    document.title = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} - ${label}`;
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft, mode]);

  // 快捷键支持
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 忽略在输入框中按下的快捷键
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // 空格键：开始/暂停
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isRunning && timeLeft > 0) {
          setIsRunning(true);
          playAudio(440, 150);
        } else if (isRunning) {
          setIsRunning(false);
        }
      }
      
      // R键：重置
      if (e.code === 'KeyR' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsRunning(false);
        setTimeLeft(settings[mode] * 60);
      }
      
      // 数字键：切换模式
      if (e.code === 'Digit1' || e.code === 'Numpad1') {
        e.preventDefault();
        switchMode('focus');
      } else if (e.code === 'Digit2' || e.code === 'Numpad2') {
        e.preventDefault();
        switchMode('shortBreak');
      } else if (e.code === 'Digit3' || e.code === 'Numpad3') {
        e.preventDefault();
        switchMode('longBreak');
      }
      
      // Esc键：关闭设置面板
      if (e.code === 'Escape') {
        if (showSettings) {
          setShowSettings(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, timeLeft, mode, settings, showSettings]);

  const modes = {
    focus: { label: '专注模式', icon: <Brain size={20} />, color: 'text-red-500', bg: 'bg-red-50', button: 'bg-red-500 hover:bg-red-600', ring: 'stroke-red-500', theme: 'red' },
    shortBreak: { label: '短休息', icon: <Coffee size={20} />, color: 'text-teal-500', bg: 'bg-teal-50', button: 'bg-teal-500 hover:bg-teal-600', ring: 'stroke-teal-500', theme: 'teal' },
    longBreak: { label: '长休息', icon: <Armchair size={20} />, color: 'text-blue-500', bg: 'bg-blue-50', button: 'bg-blue-500 hover:bg-blue-600', ring: 'stroke-blue-500', theme: 'blue' },
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(settings[newMode] * 60);
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // 调整时间的函数
  const adjustTime = (part, delta) => {
    if (isRunning) return; // 运行时不允许调整
    
    const currentMinutes = Math.floor(timeLeft / 60);
    const currentSeconds = timeLeft % 60;
    let newMinutes = currentMinutes;
    let newSeconds = currentSeconds;
    
    if (part === 'minutes') {
      newMinutes = Math.max(0, Math.min(99, currentMinutes + delta));
    } else if (part === 'seconds') {
      newSeconds = Math.max(0, Math.min(59, currentSeconds + delta));
      // 如果秒数调整，确保分钟数也相应调整
      if (newSeconds < 0) {
        newMinutes = Math.max(0, newMinutes - 1);
        newSeconds = 59;
      } else if (newSeconds > 59) {
        newMinutes = Math.min(99, newMinutes + 1);
        newSeconds = 0;
      }
    }
    
    const newTimeLeft = newMinutes * 60 + newSeconds;
    setTimeLeft(newTimeLeft);
    // 同时更新设置
    setSettings({...settings, [mode]: newMinutes});
  };

  // 处理鼠标滚轮事件
  const handleWheel = (e, part) => {
    if (isRunning) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -1 : 1;
    adjustTime(part, delta);
  };

  // 处理鼠标按下事件（用于拖拽）
  const handleMouseDown = (e, part) => {
    if (isRunning) return;
    e.preventDefault();
    e.stopPropagation();
    setEditingPart(part);
    
    // 使用 useRef 存储拖拽状态，避免闭包问题
    dragStateRef.current = {
      startY: e.clientY,
      part: part,
      startMinutes: Math.floor(timeLeft / 60),
      startSeconds: timeLeft % 60,
      lastDelta: 0,
      currentMode: mode
    };
    
    const handleMouseMove = (moveEvent) => {
      if (!dragStateRef.current) return;
      
      moveEvent.preventDefault();
      moveEvent.stopPropagation();
      
      const { startY, part, startMinutes, startSeconds } = dragStateRef.current;
      const deltaY = startY - moveEvent.clientY;
      const sensitivity = 5; // 每5像素调整1个单位，提高灵敏度
      const currentDelta = Math.round(deltaY / sensitivity);
      
      // 只在值改变时更新，避免频繁渲染
      if (currentDelta !== dragStateRef.current.lastDelta) {
        dragStateRef.current.lastDelta = currentDelta;
        
        let newMinutes = startMinutes;
        let newSeconds = startSeconds;
        
        if (part === 'minutes') {
          newMinutes = Math.max(0, Math.min(99, startMinutes + currentDelta));
          // 秒数保持不变
        } else if (part === 'seconds') {
          newSeconds = startSeconds + currentDelta;
          
          // 处理秒数溢出
          if (newSeconds < 0) {
            const overflow = Math.ceil(Math.abs(newSeconds) / 60);
            newMinutes = Math.max(0, startMinutes - overflow);
            newSeconds = (60 + (newSeconds % 60)) % 60;
          } else if (newSeconds >= 60) {
            const overflow = Math.floor(newSeconds / 60);
            newMinutes = Math.min(99, startMinutes + overflow);
            newSeconds = newSeconds % 60;
          } else {
            newSeconds = Math.max(0, Math.min(59, newSeconds));
          }
        }
        
        const newTimeLeft = newMinutes * 60 + newSeconds;
        
        // 直接更新状态
        setTimeLeft(newTimeLeft);
        
        // 如果分钟数改变了，更新设置
        if (newMinutes !== startMinutes) {
          setSettings((prevSettings) => ({
            ...prevSettings,
            [dragStateRef.current.currentMode]: newMinutes
          }));
        }
      }
    };
    
    const handleMouseUp = (upEvent) => {
      upEvent?.preventDefault();
      setEditingPart(null);
      dragStateRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    };
    
    // 添加事件监听器
    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp);
    // 防止鼠标移出窗口时事件监听器无法清理
    document.addEventListener('mouseleave', handleMouseUp);
  };

  const totalTime = settings[mode] * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const [showTaskForm, setShowTaskForm] = useState(false);

  const addTask = () => {
    if (!taskForm.text.trim()) return;
    const newTaskObj = { 
      id: Date.now(), 
      text: taskForm.text, 
      completed: false,
      priority: taskForm.priority,
      category: taskForm.category,
      estimatedPomodoros: taskForm.estimatedPomodoros || 1,
      completedPomodoros: 0,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    setTasks([...tasks, newTaskObj]);
    setTaskForm({ text: '', priority: 'medium', category: '', estimatedPomodoros: 1 });
    setShowTaskForm(false);
    if (!activeTaskId) setActiveTaskId(newTaskObj.id);
  };
  
  const toggleTask = (id) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const completed = !t.completed;
        return { 
          ...t, 
          completed,
          completedAt: completed ? new Date().toISOString() : null
        };
      }
      return t;
    }));
  };
  
  const deleteTask = (id) => { 
    setTasks(tasks.filter(t => t.id !== id)); 
    if (activeTaskId === id) setActiveTaskId(null); 
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPriorityLabel = (priority) => {
    switch(priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '中';
    }
  };

  if (!user) return <AuthView onLogin={setUser} />;

  return (
    <div className={`min-h-screen transition-colors duration-500 ease-in-out ${view === 'calendar' || view === 'stats' ? 'bg-gray-100' : modes[mode].bg} font-sans flex flex-col items-center py-6 px-4`}>
      <header className="w-full max-w-4xl flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('timer')}>
          <div className={`p-2 rounded-lg ${view === 'timer' ? modes[mode].button : 'bg-gray-800'} text-white transition-colors`}>
            <Check size={20} />
          </div>
          <h1 className={`text-xl font-bold ${view === 'timer' ? modes[mode].color : 'text-gray-800'} transition-colors`}>番茄专注</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setView('achievements')} 
            className={`p-2 rounded-full transition-colors ${view === 'achievements' ? 'bg-yellow-100 text-yellow-600' : 'hover:bg-black/5 text-gray-600'}`}
            title="成就系统"
          >
            <Trophy size={20} />
          </button>
          <button 
            onClick={() => setView('stats')} 
            className={`p-2 rounded-full transition-colors ${view === 'stats' ? 'bg-red-100 text-red-500' : 'hover:bg-black/5 text-gray-600'}`}
            title="数据统计"
          >
            <BarChart3 size={20} />
          </button>
          <button 
            onClick={() => setView(view === 'timer' ? 'calendar' : 'timer')} 
            className={`p-2 rounded-full transition-colors ${view === 'calendar' ? 'bg-red-100 text-red-500' : 'hover:bg-black/5 text-gray-600'}`}
            title={view === 'timer' ? "查看日历" : "返回计时"}
          >
            {view === 'timer' ? <Calendar size={20} /> : <Brain size={20} />}
          </button>
          <div className="relative group">
            <button className="p-2 rounded-full hover:bg-black/5 text-gray-600 transition-colors"><User size={20} /></button>
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl overflow-hidden hidden group-hover:block border border-gray-100 z-50">
              <div className="px-4 py-3 text-xs text-gray-500 border-b border-gray-50 truncate">{user.email}</div>
              <button onClick={() => setUser(null)} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"><LogOut size={14} /> 退出登录</button>
            </div>
          </div>
        </div>
      </header>

      {view === 'achievements' ? (
        <AchievementsView 
          sessions={sessions} 
          achievements={achievements}
          onAchievementClick={(achievement) => {
            if (achievement.unlocked) {
              playAudio(880, 200, 0.5);
            }
          }}
        />
      ) : view === 'stats' ? (
        <StatisticsView sessions={sessions} />
      ) : view === 'calendar' ? (
        <CalendarView sessions={sessions} user={user} />
      ) : (
        <>
          <div className="bg-white/50 backdrop-blur-md p-1 rounded-full flex space-x-1 mb-8 shadow-sm max-w-md w-full">
            {Object.keys(modes).map((m) => (
              <button key={m} onClick={() => switchMode(m)} className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${mode === m ? `bg-white shadow-md ${modes[m].color}` : 'text-gray-500 hover:bg-white/30'}`}>
                {modes[m].icon}<span className="hidden sm:inline">{modes[m].label}</span>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 w-full max-w-md flex flex-col items-center relative overflow-hidden">
            <button onClick={() => setShowSettings(true)} className="absolute top-4 right-4 text-gray-300 hover:text-gray-600 transition-colors"><Settings size={20} /></button>
            <div className="relative mb-8 mt-2">
              <svg className="transform -rotate-90 w-72 h-72">
                <circle cx="144" cy="144" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                <circle cx="144" cy="144" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className={`transition-all duration-1000 ease-linear ${modes[mode].ring}`} />
              </svg>
              <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 text-6xl font-bold tracking-tight text-gray-800 tabular-nums">
                  <span
                    ref={timeDisplayRef}
                    draggable={false}
                    onWheel={(e) => handleWheel(e, 'minutes')}
                    onMouseDown={(e) => handleMouseDown(e, 'minutes')}
                    onDragStart={(e) => e.preventDefault()}
                    className={`select-none transition-all duration-200 ${
                      isRunning 
                        ? 'cursor-default' 
                        : 'cursor-grab active:cursor-grabbing'
                    } ${
                      editingPart === 'minutes' 
                        ? 'scale-110 text-red-500' 
                        : !isRunning 
                          ? 'hover:scale-105 hover:text-red-400' 
                          : ''
                    }`}
                    title={!isRunning ? "点击并拖拽或滚动调整分钟" : "计时器运行中，无法调整"}
                  >
                    {String(Math.floor(timeLeft / 60)).padStart(2, '0')}
                  </span>
                  <span className="opacity-50">:</span>
                  <span
                    draggable={false}
                    onWheel={(e) => handleWheel(e, 'seconds')}
                    onMouseDown={(e) => handleMouseDown(e, 'seconds')}
                    onDragStart={(e) => e.preventDefault()}
                    className={`select-none transition-all duration-200 ${
                      isRunning 
                        ? 'cursor-default' 
                        : 'cursor-grab active:cursor-grabbing'
                    } ${
                      editingPart === 'seconds' 
                        ? 'scale-110 text-red-500' 
                        : !isRunning 
                          ? 'hover:scale-105 hover:text-red-400' 
                          : ''
                    }`}
                    title={!isRunning ? "点击并拖拽或滚动调整秒数" : "计时器运行中，无法调整"}
                  >
                    {String(timeLeft % 60).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-gray-400 mt-2 font-medium tracking-wide">
                  {isRunning ? '专注中...' : editingPart ? '拖拽或滚动调整时间' : '准备就绪'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-6 z-10">
              <button onClick={() => { 
                const newState = !isRunning;
                setIsRunning(newState); 
                if (newState) playAudio(440, 150);
              }} className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg transform transition-all active:scale-95 ${modes[mode].button}`}>
                {isRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1"/>}
              </button>
              <button onClick={() => { setIsRunning(false); setTimeLeft(settings[mode] * 60); }} className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"><RotateCcw size={24} /></button>
            </div>
          </div>

          <div className="w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center">
              今日任务 
              {activeTaskId && <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">进行中</span>}
            </h2>
            
            {!showTaskForm ? (
              <button 
                onClick={() => setShowTaskForm(true)}
                className="w-full bg-white p-3 rounded-xl shadow-sm mb-4 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50 transition-colors text-gray-600 hover:text-red-500"
              >
                <Plus size={20} />
                <span>添加任务</span>
              </button>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-4 mb-4 border-2 border-gray-200">
                <div className="space-y-3">
                  <input 
                    type="text" 
                    value={taskForm.text} 
                    onChange={(e) => setTaskForm({...taskForm, text: e.target.value})} 
                    placeholder="任务名称..." 
                    className="w-full bg-gray-50 px-4 py-2 rounded-lg outline-none border border-gray-200 focus:border-red-400 focus:ring-1 focus:ring-red-200" 
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">优先级</label>
                      <select 
                        value={taskForm.priority}
                        onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                        className="w-full bg-gray-50 px-3 py-2 rounded-lg outline-none border border-gray-200 text-sm"
                      >
                        <option value="high">高</option>
                        <option value="medium">中</option>
                        <option value="low">低</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">预估番茄数</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="20"
                        value={taskForm.estimatedPomodoros}
                        onChange={(e) => setTaskForm({...taskForm, estimatedPomodoros: parseInt(e.target.value) || 1})}
                        className="w-full bg-gray-50 px-3 py-2 rounded-lg outline-none border border-gray-200 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">分类/标签</label>
                    <input 
                      type="text" 
                      value={taskForm.category}
                      onChange={(e) => setTaskForm({...taskForm, category: e.target.value})}
                      placeholder="例如：工作、学习、运动..."
                      className="w-full bg-gray-50 px-4 py-2 rounded-lg outline-none border border-gray-200 focus:border-red-400 focus:ring-1 focus:ring-red-200 text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={addTask} 
                      disabled={!taskForm.text.trim()} 
                      className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                        taskForm.text.trim() 
                          ? modes[mode].button + ' text-white' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      添加
                    </button>
                    <button 
                      onClick={() => {
                        setShowTaskForm(false);
                        setTaskForm({ text: '', priority: 'medium', category: '', estimatedPomodoros: 1 });
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {tasks.map(task => {
                const progress = task.estimatedPomodoros > 0 
                  ? Math.min(100, (task.completedPomodoros / task.estimatedPomodoros) * 100)
                  : 0;
                return (
                  <div 
                    key={task.id} 
                    onClick={() => !task.completed && setActiveTaskId(task.id)} 
                    className={`group bg-white p-4 rounded-xl shadow-sm cursor-pointer border-l-4 transition-all hover:shadow-md ${
                      activeTaskId === task.id && !task.completed
                        ? `border-red-500 ring-2 ring-red-100` 
                        : task.completed 
                          ? 'border-gray-300 opacity-60' 
                          : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3 flex-1 overflow-hidden">
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }} 
                          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-0.5 ${
                            task.completed 
                              ? 'bg-gray-400 border-gray-400' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {task.completed && <Check size={14} color="white" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-gray-700 font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                              {task.text}
                            </span>
                            {task.priority && (
                              <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                                {getPriorityLabel(task.priority)}
                              </span>
                            )}
                            {task.category && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
                                <Tag size={12} />
                                {task.category}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                            <div className="flex items-center gap-1">
                              <Timer size={12} />
                              <span>{task.completedPomodoros || 0}/{task.estimatedPomodoros || 1} 番茄</span>
                            </div>
                            {task.completedAt && (
                              <span>
                                完成于 {new Date(task.completedAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                          {task.estimatedPomodoros > 0 && (
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full transition-all ${
                                  progress >= 100 ? 'bg-green-500' : 'bg-red-400'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} 
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-2 flex-shrink-0"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
              {tasks.length === 0 && <div className="text-center py-6 text-gray-400 text-sm">暂无任务</div>}
            </div>
          </div>
        </>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">计时设置</h3>
              <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X size={20} /></button>
            </div>
            <div className="space-y-6">
              {[{ k: 'focus', l: '专注时长' }, { k: 'shortBreak', l: '短休息' }, { k: 'longBreak', l: '长休息' }].map(i => (
                <div key={i.k}>
                  <div className="flex justify-between text-gray-600 mb-2 font-medium"><span>{i.l}</span><span>{settings[i.k]} 分钟</span></div>
                  <input type="range" min="1" max="60" value={settings[i.k]} onChange={(e) => setSettings({...settings, [i.k]: parseInt(e.target.value)})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500" />
                </div>
              ))}
            </div>
            <button onClick={() => { if (!isRunning) setTimeLeft(settings[mode] * 60); setShowSettings(false); }} className={`w-full mt-8 py-3 rounded-xl text-white font-bold shadow-lg active:scale-95 transition-transform ${modes[mode].button}`}>保存设置</button>
          </div>
        </div>
      )}

      {/* 成就解锁弹窗 */}
      {newUnlockedAchievements.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setNewUnlockedAchievements([])}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 成功背景装饰 */}
            <div className={`bg-gradient-to-br ${newUnlockedAchievements[0].color} p-8 text-white relative overflow-hidden`}>
              <div className="absolute top-[-50%] right-[-50%] w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-[-30%] left-[-30%] w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mb-4 animate-bounce">
                  {React.createElement(newUnlockedAchievements[0].icon, { size: 48 })}
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy size={28} className="text-yellow-300" />
                  <h3 className="text-3xl font-bold">成就解锁！</h3>
                  <Trophy size={28} className="text-yellow-300" />
                </div>
                <p className="text-white/90 text-lg">{newUnlockedAchievements[0].name}</p>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 text-center mb-6">{newUnlockedAchievements[0].description}</p>
              
              {/* 如果同时解锁多个成就，显示其他成就 */}
              {newUnlockedAchievements.length > 1 && (
                <div className="mb-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-3 text-center">同时解锁了 {newUnlockedAchievements.length} 个成就：</p>
                  <div className="space-y-2">
                    {newUnlockedAchievements.slice(1).map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${achievement.color} text-white`}>
                          {React.createElement(achievement.icon, { size: 24 })}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{achievement.name}</p>
                          <p className="text-xs text-gray-500">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setNewUnlockedAchievements([]);
                    setView('achievements');
                  }}
                  className="flex-1 py-3 rounded-xl text-white font-bold shadow-lg active:scale-95 transition-transform bg-gray-600 hover:bg-gray-700"
                >
                  查看成就
                </button>
                <button
                  onClick={() => setNewUnlockedAchievements([])}
                  className={`flex-1 py-3 rounded-xl text-white font-bold shadow-lg active:scale-95 transition-transform bg-gradient-to-r ${newUnlockedAchievements[0].color}`}
                >
                  太棒了！
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-3">5秒后自动关闭</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroApp;