import { useHabits } from "../context/HabitContext";
import { BADGES } from "../constants";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";
import { format, subDays } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Trophy, Flame, Target } from "lucide-react";
import { motion } from "motion/react";

export default function Stats() {
  const { habits, achievements } = useHabits();

  // Calculate Last 7 Days Completion
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dateStr = format(d, 'yyyy-MM-dd');
    const displayDay = format(d, 'EEE', { locale: zhCN });
    
    // Total habits created before or on this day
    const activeHabits = habits.length; // Simplified: just total habits for now
    
    // Checked habits on this day
    const checkedHabits = habits.filter(h => h.logs?.includes(dateStr)).length;
    
    const rate = activeHabits > 0 ? Math.round((checkedHabits / activeHabits) * 100) : 0;
    
    return { name: displayDay, rate, fullDate: dateStr, checked: checkedHabits, total: activeHabits };
  });

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayChecked = habits.filter(h => h.logs?.includes(todayStr)).length;
  const totalHabits = habits.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="grid grid-cols-2 gap-4">
        {/* Today's Overview */}
        <div className="bg-[#15803D] text-white p-6 rounded-[2rem] shadow-lg shadow-green-900/10 relative overflow-hidden">
          <div className="absolute top-[-20px] right-[-20px] opacity-10">
            <Target size={120} />
          </div>
          <h3 className="font-bold text-green-100 mb-2">今日概况</h3>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-black">{todayChecked}</span>
            <span className="text-xl font-bold text-green-200 mb-1">/ {totalHabits}</span>
          </div>
          <p className="text-sm mt-2 font-medium text-green-100">已完成习惯</p>
        </div>

        {/* Longest Global Streak */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#DCFCE7] relative overflow-hidden group">
          <div className="absolute top-[-20px] right-[-20px] opacity-5 text-[#F59E0B] group-hover:scale-110 transition-transform duration-500">
            <Flame size={120} />
          </div>
          <h3 className="font-bold text-[#166534]/70 mb-2">最高连击</h3>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-black text-[#F59E0B]">
              {Math.max(0, ...habits.map(h => h.logs?.length || 0))}
            </span>
            <span className="text-xl font-bold text-[#166534]/40 mb-1">天</span>
          </div>
          <p className="text-sm mt-2 font-medium text-[#166534]/70">全部习惯历史</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#DCFCE7]">
        <h3 className="font-bold text-[#166534] text-lg mb-6">近7日打卡率</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#166534', fontSize: 12, fontWeight: 600 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#166534', opacity: 0.5, fontSize: 12 }} />
              <RechartsTooltip 
                cursor={{ fill: '#F0FDF4' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white/90 backdrop-blur border border-[#DCFCE7] p-3 rounded-2xl shadow-xl">
                        <p className="font-bold text-[#166534] mb-1">{data.fullDate}</p>
                        <p className="text-sm text-[#15803D]">完成率: {data.rate}%</p>
                        <p className="text-xs text-[#166534]/60 mt-1">完成: {data.checked} / {data.total}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="rate" radius={[8, 8, 8, 8]}>
                {last7Days.map((entry, index) => (
                  <Cell key={"cell-" + index} fill={entry.rate === 100 ? '#22C55E' : '#86EFAC'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Achievements Section */}
      <div>
        <h3 className="font-bold text-[#166534] text-lg mb-4 flex items-center gap-2">
          <Trophy className="text-[#F59E0B]" /> 成就墙
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {BADGES.map((badge, i) => {
            const isUnlocked = achievements.includes(badge.key);
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                key={badge.key} 
                className={"p-4 rounded-[2rem] flex flex-col items-center justify-center text-center transition-all duration-500 " + (isUnlocked ? "bg-gradient-to-br from-yellow-50 to-amber-100 border border-yellow-200 shadow-md shadow-yellow-900/5" : "bg-white border border-[#E5E7EB] opacity-60 grayscale")}
              >
                <div className={"text-4xl mb-2 " + (isUnlocked ? "animate-bounce drop-shadow-sm" : "")}>
                  {badge.icon}
                </div>
                <h4 className="font-bold text-[#451A03] text-sm mb-1">{badge.name}</h4>
                <p className="text-[10px] font-medium text-[#78350F]/70 leading-tight">{badge.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
