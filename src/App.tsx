/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, NavLink } from "react-router";
import { Trees, NotebookPen, BarChart3, Users, Sprout, Trophy, Store as StoreIcon } from "lucide-react";
import { cn } from "./lib/utils";
import { HabitProvider, useHabits } from "./context/HabitContext";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BADGES } from "./constants";

// Placeholders for components
import Home from "./pages/Home";
import Forest from "./pages/Forest";
import Stats from "./pages/Stats";
import Social from "./pages/Social";
import Store from "./pages/Store";
import Profile from "./pages/Profile";

function AchievementToast() {
  const { recentUnlock, clearRecentUnlock } = useHabits();

  useEffect(() => {
    if (recentUnlock) {
      const timer = setTimeout(() => {
        clearRecentUnlock();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [recentUnlock, clearRecentUnlock]);

  const badge = BADGES.find(b => b.key === recentUnlock);

  return (
    <AnimatePresence>
      {recentUnlock && badge && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="absolute top-20 left-1/2 -translate-x-1/2 z-[100] px-4 w-full max-w-sm pointer-events-none"
        >
          <div className="bg-white/95 backdrop-blur-md shadow-2xl border border-[#FDE68A] rounded-2xl p-3 flex items-center justify-start gap-4 mx-auto w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#FEF08A] to-[#F59E0B] rounded-xl flex items-center justify-center text-3xl shrink-0 shadow-inner rotate-12">
              {badge.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#D97706] uppercase tracking-widest flex items-center gap-1">
                <Trophy size={10} /> 新成就解锁！
              </p>
              <h4 className="text-[#92400E] font-black">{badge.name}</h4>
              <p className="text-xs text-[#B45309]">{badge.desc}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { profile } = useHabits();
  const navItems = [
    { label: "习惯", path: "/", icon: NotebookPen },
    { label: "森林", path: "/forest", icon: Trees },
    { label: "统计", path: "/stats", icon: BarChart3 },
    { label: "好友", path: "/social", icon: Users },
    { label: "商店", path: "/store", icon: StoreIcon },
  ];

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 sm:p-4 overflow-hidden">
      <div className="w-full h-full sm:w-[390px] sm:h-[844px] sm:max-h-[95vh] bg-[#E8F5E9] text-[#2E7D32] font-sans selection:bg-[#A5D6A7] selection:text-[#1B5E20] relative flex flex-col sm:rounded-[3rem] sm:border-[8px] sm:border-gray-900 sm:shadow-2xl overflow-hidden shrink-0">
        {/* Decorative blurred circles from Immersive UI */}
        <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-[#C8E6C9] rounded-full blur-3xl opacity-50 pointer-events-none z-0"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-[#FFF9C4] rounded-full blur-3xl opacity-50 pointer-events-none z-0"></div>

        {/* Top Header */}
        <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#4CAF50] rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <Sprout className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2E7D32] tracking-tight">习惯森林</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#FFFBEB] px-3 py-1 rounded-full border border-[#FDE68A] flex items-center gap-1 shadow-sm">
              <span className="text-sm">🌰</span>
              <span className="font-black text-[#D97706]">{profile.pinecones}</span>
            </div>
            <button 
              onClick={() => setShowClearConfirm(true)}
              title="清空所有记录"
              className="w-10 h-10 rounded-full bg-[#FFCDD2] border-2 border-[#EF9A9A] flex items-center justify-center shadow-sm font-bold text-sm text-[#C62828] shrink-0"
            >
              清空
            </button>
            <NavLink to="/profile" className={({isActive}) => `w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm font-bold text-xl shrink-0 transition-colors ${isActive ? 'bg-[#15803D] text-white border-[#15803D]' : 'bg-[#F0FDF4] border-[#A5D6A7] text-[#15803D] hover:bg-[#DCFCE7]'}`}>
              {profile.avatar}
            </NavLink>
          </div>
        </header>

        {/* Clear Confirmation Modal */}
        <AnimatePresence>
          {showClearConfirm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowClearConfirm(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-6 shadow-2xl relative z-10 w-full max-w-sm"
              >
                <h3 className="text-xl font-bold text-[#C62828] mb-2">清空所有记录？</h3>
                <p className="text-sm text-gray-600 mb-6 font-medium">包括打卡记录、成就收集。此操作不可恢复！</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => {
                      import("./lib/api").then(({ api }) => {
                        api.clearAll().then(() => window.location.reload());
                      });
                    }}
                    className="flex-1 py-3 bg-[#EF5350] hover:bg-[#D32F2F] text-white font-bold rounded-2xl shadow-lg transition-colors"
                  >
                    确认清空
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Achievement Toast */}
        <AchievementToast />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full p-4 pb-24 relative z-10">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-[#C8E6C9] z-50 rounded-t-[2rem]">
          <div className="flex justify-around items-center p-2 pb-safe-offset-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center p-3 w-16 transition-all duration-300 rounded-2xl relative",
                    isActive
                      ? "text-[#2E7D32]"
                      : "text-[#81C784] hover:text-[#4CAF50]"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute inset-0 bg-[#E8F5E9] rounded-2xl -z-10 animate-in zoom-in duration-300" />
                    )}
                    <item.icon size={24} className={cn("transition-transform duration-300", isActive && "scale-110 -translate-y-1")} />
                    <span className={cn("text-[10px] font-bold mt-1 transition-opacity", isActive ? "opacity-100" : "opacity-0")}>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HabitProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/forest" element={<Forest />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/social" element={<Social />} />
            <Route path="/store" element={<Store />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </HabitProvider>
  );
}
