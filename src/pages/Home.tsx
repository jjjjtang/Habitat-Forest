import React, { useState } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import { useHabits } from "../context/HabitContext";
import { TREE_TYPES, QUOTES } from "../constants";
import { Check, Plus, Trash2, Edit3, X, CloudRain, Droplets } from "lucide-react";

export default function Home() {
  const { habits, checkinHabit, removeHabit, loading } = useHabits();
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<any>(null);

  const pendingHabits = habits.filter(h => !h.logs?.includes(todayStr));
  const completedHabits = habits.filter(h => h.logs?.includes(todayStr));

  return (
    <div className="animate-in fade-in duration-500 bg-white rounded-[32px] p-5 shadow-xl border-4 border-[#C8E6C9] flex flex-col min-h-full">
      <div className="flex items-center justify-between mb-4 mt-2">
        <h3 className="text-sm font-bold text-[#2E7D32] flex items-center gap-2">
          <span className="w-2 h-2 bg-[#FF7043] rounded-full"></span> 今日习惯
        </h3>
        <button 
          onClick={() => { setEditingHabit(null); setIsModalOpen(true); }}
          className="w-10 h-10 bg-[#FF7043] text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform active:scale-95"
          title="添加习惯"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="bg-[#F1F8E9] rounded-2xl p-4 shadow-sm border border-[#E8F5E9] mb-4 relative overflow-hidden group">
        <CloudRain className="absolute top-2 right-2 text-[#4CAF50] opacity-20 w-16 h-16 transform rotate-12 transition-transform duration-700 group-hover:scale-110" />
        <p className="text-sm font-medium italic text-[#388E3C] relative z-10 font-serif">"{quote}"</p>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-[#F1F8E9] rounded-2xl" />)}
        </div>
      ) : pendingHabits.length === 0 && completedHabits.length === 0 ? (
        <div className="bg-[#F1F8E9] rounded-2xl p-8 flex flex-col items-center justify-center border border-dashed border-[#A5D6A7] text-center mb-4">
          <div className="text-5xl mb-4 animate-bounce">🎉</div>
          <p className="font-bold text-[#388E3C]">太棒啦！去种下你的第一棵树吧</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          <AnimatePresence>
            {pendingHabits.map((habit) => (
              <motion.div 
                key={habit.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-3 bg-[#F1F8E9] rounded-2xl flex items-center justify-between group border border-transparent transition-colors hover:border-[#A5D6A7]"
              >
                <div className="flex gap-3 items-center">
                  <div className="text-2xl shrink-0 select-none drop-shadow-sm group-hover:scale-110 transition-transform">
                    {TREE_TYPES.find(t => t.id === habit.tree_type)?.emoji || '🌱'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#388E3C]">{habit.title}</h4>
                    <p className="text-[10px] text-[#81C784] font-medium mt-0.5">连续 {getStreak(habit.logs)} 天</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <button 
                    onClick={() => { setEditingHabit(habit); setIsModalOpen(true); }}
                    className="p-2 text-[#4CAF50] opacity-0 md:opacity-100 group-hover:opacity-100 transition-opacity bg-white/50 hover:bg-white rounded-lg"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => removeHabit(habit.id)}
                    className="p-2 text-[#FF7043] opacity-0 md:opacity-100 group-hover:opacity-100 transition-opacity bg-white/50 hover:bg-white rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button 
                    onClick={() => checkinHabit(habit.id)}
                    className="w-10 h-10 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-xl shadow-inner flex items-center justify-center transition-all hover:scale-105 active:scale-95 ml-1"
                  >
                    <Check strokeWidth={3} size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {completedHabits.map((habit) => (
             <div key={habit.id} className="p-3 bg-white border border-[#E8F5E9] rounded-2xl flex items-center justify-between opacity-60 transition-opacity hover:opacity-80">
               <div className="flex gap-3 items-center">
                 <div className="text-2xl shrink-0 select-none grayscale opacity-60">
                   {TREE_TYPES.find(t => t.id === habit.tree_type)?.emoji || '🌲'}
                 </div>
                 <div className="line-through decoration-[#4CAF50] opacity-80">
                   <h4 className="text-sm font-bold text-[#333]">{habit.title}</h4>
                   <p className="text-[10px] text-[#999] font-medium mt-0.5">已打卡</p>
                 </div>
               </div>
               <div className="w-10 h-10 bg-[#E8F5E9] text-[#81C784] rounded-xl flex items-center justify-center">
                 <Check strokeWidth={3} size={20} />
               </div>
             </div>
          ))}
        </div>
      )}

      {/* Progress Bar overall */}
      {(habits.length > 0) && (
        <div className="mt-auto pt-4 border-t border-[#E8F5E9]">
          <div className="text-xs text-center text-[#81C784] font-medium">今日已完成 {completedHabits.length} / {habits.length}</div>
          <div className="w-full bg-[#E8F5E9] h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#4CAF50] h-full rounded-full transition-all duration-500 delay-100 ease-out" style={{ width: (habits.length ? (completedHabits.length / habits.length) * 100 : 0) + "%" }}></div>
          </div>
        </div>
      )}

      <AddHabitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} habit={editingHabit} />
    </div>
  );
}

function getStreak(logs: string[] | undefined) {
  if (!logs || logs.length === 0) return 0;
  // Simple streak logic assuming logs are sorted
  const sorted = [...logs].sort().reverse();
  let streak = 0;
  let current = new Date();
  
  for (const log of sorted) {
    const d = new Date(log);
    // If log is today or yesterday
    const diff = Math.floor((current.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 1) {
      streak++;
      current = d;
    } else {
      break;
    }
  }
  return Math.max(0, streak);
}

function AddHabitModal({ isOpen, onClose, habit }: { isOpen: boolean, onClose: () => void, habit: any }) {
  const { addHabit, editHabit } = useHabits();
  const [title, setTitle] = useState(habit?.title || '');
  const [treeType, setTreeType] = useState(habit?.tree_type || 'pine');
  const [testDays, setTestDays] = useState<string>('');

  // Reset state when habit changes
  if (habit && title === '' && habit.title !== '') {
    setTitle(habit.title);
    setTreeType(habit.tree_type);
    setTestDays(habit.logs?.length?.toString() || '0');
  } else if (!habit && title === '' && testDays !== '') {
    setTestDays('');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let updatedLogs = habit?.logs || [];
    if (testDays && !isNaN(Number(testDays))) {
        const days = Number(testDays);
        if (days >= 0 && habit) {
            updatedLogs = [];
            const now = new Date();
            for (let i = 0; i < days; i++) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                updatedLogs.push(d.toISOString().split('T')[0]);
            }
        }
    }

    if (habit) await editHabit(habit.id, { title, tree_type: treeType, logs: updatedLogs });
    else await addHabit({ title, tree_type: treeType, frequency_type: 'daily', frequency_count: 1, reminder_time: null });
    
    setTitle('');
    setTestDays('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden border border-[#DCFCE7]"
          >
            <div className="bg-[#F0FDF4] p-5 border-b border-[#DCFCE7] flex justify-between items-center">
              <h3 className="font-black tracking-tight text-xl text-[#064E3B]">{habit ? '编辑习惯' : '种植新习惯'}</h3>
              <button 
                type="button"
                onClick={onClose} 
                className="p-1 rounded-full hover:bg-[#DCFCE7] text-[#166534] transition-colors"
               >
                <X size={20} />
               </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#166534]/70 mb-2">习惯名称</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  autoFocus
                  className="w-full bg-[#f9fafb] border-2 border-[#E5E7EB] rounded-2xl px-4 py-3 font-medium focus:border-[#4ADE80] focus:ring-4 focus:ring-[#DCFCE7] outline-none transition-all"
                  placeholder="例如：喝八杯水 💧" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#166534]/70 mb-2">选择植物形态</label>
                <div className="grid grid-cols-3 gap-2">
                  {TREE_TYPES.map(t => {
                    const isSelected = treeType === t.id;
                    return (
                      <button 
                        key={t.id} 
                        type="button"
                        onClick={() => setTreeType(t.id)}
                        className={"p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all " + (isSelected ? "border-[#22C55E] bg-[#F0FDF4] shadow-sm" : "border-[#E5E7EB] hover:border-[#86EFAC] bg-white")}
                      >
                        <span className="text-2xl">{t.emoji}</span>
                        <span className="text-[10px] font-bold text-[#166534]">{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {habit && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#F59E0B] mb-2 flex items-center gap-1">
                    <span>⚡ 测试功能：手动修正打卡天数</span>
                  </label>
                  <input 
                    type="number" 
                    value={testDays} 
                    onChange={e => setTestDays(e.target.value)}
                    min="0"
                    max="1000"
                    className="w-full bg-[#FFFBEB] border-2 border-[#FDE68A] rounded-2xl px-4 py-3 font-medium focus:border-[#F59E0B] outline-none transition-all placeholder:text-[#FBBF24]"
                    placeholder="输入要设定的连续打卡天数" 
                  />
                  <p className="text-[10px] text-[#D97706] mt-1 italic">提示：强制修改天数会覆盖当前习惯的打卡历史。</p>
                </div>
              )}
              <button 
                type="submit" 
                className="w-full py-4 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-black text-lg shadow-lg shadow-green-900/20 active:scale-95 transition-all"
              >
                {habit ? '保存' : '播下种子 🌰'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
