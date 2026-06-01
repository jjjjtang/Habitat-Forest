import React, { useState, useEffect } from "react";
import { MOCK_FRIENDS } from "../constants";
import { Trees, Flame, Search, Loader2, QrCode, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { useHabits } from "../context/HabitContext";

export default function Social() {
  const { waterAll } = useHabits();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(MOCK_FRIENDS);
  const [selectedFriend, setSelectedFriend] = useState<typeof MOCK_FRIENDS[0] | null>(null);

  const [watered, setWatered] = useState(false);
  const [showWaterToast, setShowWaterToast] = useState(false);
  const [particles, setParticles] = useState<{ id: number, x: number, y: number }[]>([]);

  useEffect(() => {
    if (selectedFriend) {
      setWatered(false);
      setShowWaterToast(false);
      setParticles([]);
    }
  }, [selectedFriend]);

  const handleWater = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (watered) return;
    
    setWatered(true);
    setShowWaterToast(true);
    setTimeout(() => setShowWaterToast(false), 3000);

    // Call waterAll
    await waterAll();

    // Generate random water particles
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 160, 
      y: -Math.random() * 80 - 20,
    }));
    setParticles(newParticles);
    
    setTimeout(() => setParticles([]), 1000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(MOCK_FRIENDS);
      return;
    }
    
    setIsSearching(true);
    // Simulate network delay for search animation
    setTimeout(() => {
      const results = MOCK_FRIENDS.filter((f) => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-[#15803D] to-[#047857] text-white p-6 sm:p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 pointer-events-none">
          <Trees size={150} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black mb-2 relative z-10">社区森林</h2>
        <p className="text-green-100 font-medium relative z-10 opacity-90 max-w-[85%] text-sm sm:text-base">
          寻找志同道合的伙伴，互相监督，一起培育属于你们的参天大树吧！
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative z-10">
        <div className="flex items-center bg-white rounded-2xl shadow-sm border-2 border-transparent focus-within:border-[#A5D6A7] transition-colors p-2">
          <Search className="text-[#81C784] ml-2 shrink-0" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索邻居的名字..."
            className="w-full bg-transparent border-none outline-none px-3 py-2 text-[#2E7D32] placeholder:text-[#A5D6A7] font-medium"
          />
          <button 
            type="submit"
            className="bg-[#15803D] hover:bg-[#166534] text-white px-4 py-2 rounded-xl font-bold transition-all active:scale-95 shrink-0"
          >
            搜索
          </button>
        </div>
      </form>

      <div className="grid gap-4 relative min-h-[200px]">
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-[#4CAF50]"
            >
              <Loader2 className="animate-spin mb-2" size={32} />
              <p className="text-sm font-bold animate-pulse">正在穿梭森林寻找中...</p>
            </motion.div>
          ) : searchResults.length > 0 ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-4 grid-cols-1"
            >
              {searchResults.map((friend, index) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedFriend(friend)}
                  key={friend.id} 
                  className="bg-white rounded-3xl p-5 flex items-center justify-between shadow-sm border-2 border-transparent hover:border-[#86EFAC] transition-all cursor-pointer group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-[#F0FDF4] border-4 border-white shadow-md flex items-center justify-center text-2xl sm:text-3xl group-hover:rotate-12 transition-transform">
                      {friend.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-[#166534] text-base sm:text-lg truncate">{friend.name}</h3>
                      <p className="text-xs text-[#166534]/60 font-medium mt-0.5 truncate">
                        "{friend.signature}"
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 sm:gap-4 shrink-0 ml-2">
                    <div className="flex flex-col items-center">
                      <span className="text-base sm:text-lg font-black text-[#15803D]">{friend.trees}</span>
                      <span className="text-[9px] sm:text-[10px] font-bold text-[#166534]/50 uppercase tracking-wider">树木</span>
                    </div>
                    <div className="w-px bg-[#DCFCE7] my-1" />
                    <div className="flex flex-col items-center">
                      <span className="text-base sm:text-lg font-black text-[#F59E0B] flex items-center gap-0.5">
                        <Flame size={12} className="mb-0.5" />
                        {friend.streak}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-bold text-[#166534]/50 uppercase tracking-wider">连击</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm opacity-50 grayscale">
                <Trees size={32} className="text-gray-400" />
              </div>
              <p className="text-[#166534] font-bold">没有找到对应的邻居</p>
              <p className="text-[#166534]/60 text-sm mt-1">试试其他名字吧？</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-[#F0FDF4] border-2 border-dashed border-[#86EFAC] rounded-3xl p-6 text-center mt-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:24px_24px] pointer-events-none"></div>
        <QrCode className="mx-auto mb-3 text-[#15803D] opacity-80" size={40} />
        <p className="font-bold text-[#15803D] text-lg mb-1">邀请更多好友</p>
        <p className="text-sm text-[#166534]/70 mb-4 max-w-[200px] mx-auto">让好友扫描你的个人专属结缘码，一起建立森林羁绊。</p>
        
        <div className="bg-white w-32 h-32 mx-auto rounded-xl shadow-sm border border-[#DCFCE7] p-2 flex items-center justify-center mb-4 relative group cursor-pointer hover:border-[#81C784] transition-colors">
          <div className="w-full h-full border-4 border-[#15803D] border-dashed rounded-lg flex items-center justify-center bg-[#F0FDF4]">
             <QrCode className="text-[#15803D]" size={64} />
          </div>
          <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-xs">点击保存</span>
          </div>
        </div>
        
        <div className="bg-white inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black text-[#15803D] shadow-sm tracking-widest border border-[#DCFCE7] select-all cursor-pointer hover:bg-gray-50">
          CODE: LF-9982-A
        </div>
      </div>

      {/* Friend Forest Modal */}
      <AnimatePresence>
        {selectedFriend && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFriend(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] w-full max-w-sm relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              <AnimatePresence>
                {showWaterToast && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border-2 border-[#81C784] text-[#15803D] px-5 py-2.5 rounded-full font-bold shadow-xl text-sm whitespace-nowrap z-[110] flex items-center gap-2"
                  >
                    <span className="text-lg">💦</span> 
                    <span>已为TA浇水，动力增加！</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative h-32 bg-gradient-to-b from-[#A5D6A7] to-[#E8F5E9] p-6 shrink-0">
                <button 
                  onClick={() => setSelectedFriend(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/50 hover:bg-white rounded-full flex items-center justify-center text-[#166534] backdrop-blur-md transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="absolute -bottom-10 left-6 flex items-end gap-4">
                  <div className="w-20 h-20 bg-white rounded-full p-1 shadow-lg">
                    <div className="w-full h-full bg-[#F0FDF4] rounded-full flex items-center justify-center text-4xl">
                      {selectedFriend.avatar}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-12 px-6 pb-6 overflow-y-auto">
                <h2 className="text-2xl font-black text-[#166534]">{selectedFriend.name}</h2>
                <p className="text-[#166534]/70 font-medium italic mt-1 text-sm text-balance">"{selectedFriend.signature}"</p>
                
                <div className="flex gap-2 mt-4 mb-6">
                  <div className="flex-1 bg-[#F0FDF4] rounded-2xl p-3 border border-[#DCFCE7] flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#BBF7D0] rounded-xl flex items-center justify-center text-xl shrink-0">🌲</div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#166534]/50">总树木</p>
                      <p className="text-lg font-black text-[#15803D]">{selectedFriend.trees}</p>
                    </div>
                  </div>
                  <div className="flex-1 bg-[#FFFBEB] rounded-2xl p-3 border border-[#FEF3C7] flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FDE68A] rounded-xl flex items-center justify-center text-xl shrink-0">🔥</div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#B45309]/50">最高连击</p>
                      <p className="text-lg font-black text-[#D97706]">{selectedFriend.streak}</p>
                    </div>
                  </div>
                </div>

                <div className={`rounded-3xl p-5 border relative h-48 overflow-hidden flex items-center justify-center group cursor-pointer transition-colors duration-700 ${watered ? 'bg-[#E8F5E9] border-[#A5D6A7]' : 'bg-[#F8FAFC] border-slate-100'}`}>
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-300 via-transparent to-transparent"></div>
                  
                  {/* Simulated Friend Forest Area */}
                  <div className="relative w-full h-full flex flex-wrap content-end justify-center gap-2 pb-4">
                    {Array.from({ length: Math.min(selectedFriend.trees, 20) }).map((_, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0, y: 20 }}
                        animate={watered ? { opacity: 1, scale: [1, 1.25, 1], y: [0, -8, 0] } : { opacity: 1, scale: 1, y: 0 }}
                        transition={watered ? { duration: 0.5, delay: i * 0.04 } : { delay: i * 0.05 + 0.2 }}
                        className="text-2xl sm:text-3xl drop-shadow-md origin-bottom"
                      >
                        {['🌲', '🌳', '🌴', '🌸', '🍁'][i % 5]}
                      </motion.div>
                    ))}
                  </div>

                  {/* Water Particles */}
                  {particles.map(p => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 1, scale: 0.5, x: 0, y: 30 }}
                      animate={{ opacity: 0, scale: 1.5, x: p.x, y: p.y }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="absolute bottom-10 left-1/2 -ml-3 text-blue-400 text-2xl pointer-events-none z-10 drop-shadow-sm"
                    >
                      💧
                    </motion.div>
                  ))}

                  <div className={`absolute inset-0 bg-white/40 backdrop-blur-[2px] transition-opacity flex items-center justify-center ${watered ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'}`}>
                    <button onClick={handleWater} className="bg-[#15803D] text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-green-900/20 active:scale-95 transition-transform text-sm">
                      为TA浇水 💧
                    </button>
                  </div>
                </div>
                <p className="text-center text-xs text-gray-400 font-medium mt-3">TA的森林一角</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
