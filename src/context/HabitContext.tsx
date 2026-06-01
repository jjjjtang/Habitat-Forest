import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Habit, TREE_TYPES, BADGES } from '../constants';
import { api } from '../lib/api';
import { format } from 'date-fns';

type Profile = {
  pinecones: number;
  totalPinecones: number;
  purchases: { [key: string]: number };
  waterCount: number;
  name: string;
  avatar: string;
  signature: string;
};

type HabitContextType = {
  habits: Habit[];
  achievements: string[];
  loading: boolean;
  recentUnlock: string | null;
  profile: Profile;
  clearRecentUnlock: () => void;
  refresh: () => Promise<void>;
  checkinHabit: (id: number) => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'created_at' | 'logs'>) => Promise<void>;
  removeHabit: (id: number) => Promise<void>;
  editHabit: (id: number, habit: Partial<Habit>) => Promise<void>;
  waterAll: () => Promise<void>;
  buyStoreItem: (id: string, price: number) => Promise<void>;
  updateProfile: (info: { name?: string, avatar?: string, signature?: string }) => Promise<void>;
};

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentUnlock, setRecentUnlock] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>({ pinecones: 0, totalPinecones: 0, purchases: {}, waterCount: 0, name: '默认昵称', avatar: '🌱', signature: '我的森林，我的世界。' });

  const clearRecentUnlock = () => setRecentUnlock(null);

  const checkAchievements = async (currentHabits: Habit[], currentAchievements = achievements, currentProfile = profile) => {
    let changed = false;
    let newlyUnlocked: string[] = [];
    let extraPineconesFromAchievements = 0;

    const unlock = async (key: string) => {
      if (!currentAchievements.includes(key) && !newlyUnlocked.includes(key)) {
        await api.unlockAchievement(key);
        newlyUnlocked.push(key);
        extraPineconesFromAchievements += 50; // reward
        changed = true;
      }
    };

    // first_blood
    const totalCheckins = currentHabits.reduce((acc, h) => acc + (h.logs?.length || 0), 0);
    if (totalCheckins >= 1) await unlock('first_blood');

    // total distinct active habits
    const activeHabits = currentHabits.filter(h => h.logs && h.logs.length > 0);
    const activeCount = activeHabits.length;
    if (activeCount >= 5) await unlock('five_habits');
    if (activeCount >= 10) await unlock('ten_habits');

    // 50 checkins
    if (totalCheckins >= 50) await unlock('forest_guard');

    // streaks (days per habit)
    let maxLogs = 0;
    for (const h of currentHabits) {
      if (h.logs && h.logs.length > maxLogs) {
        maxLogs = h.logs.length;
      }
    }
    if (maxLogs >= 7) await unlock('week_star');
    if (maxLogs >= 30) await unlock('month_warrior');
    if (maxLogs >= 100) await unlock('year_legend');

    // botanist
    const treeTypes = new Set(activeHabits.map(h => h.tree_type));
    if (treeTypes.size >= 3) await unlock('botanist');

    // economy and social
    if (currentProfile.totalPinecones >= 1) await unlock('first_pinecone');
    if (currentProfile.totalPinecones >= 500) await unlock('rich_kid');
    if (Object.keys(currentProfile.purchases).length > 0) await unlock('first_purchase');
    if (currentProfile.waterCount >= 5) await unlock('social_butterfly');

    if (changed) {
      setAchievements((prev) => Array.from(new Set([...prev, ...newlyUnlocked])));
      setRecentUnlock(newlyUnlocked[0]); // pop up the first unlocked
      
      if (extraPineconesFromAchievements > 0) {
        const p = await api.addPinecones(extraPineconesFromAchievements);
        const newProf = { ...currentProfile, pinecones: p.pinecones, totalPinecones: p.totalPinecones };
        setProfile(newProf);
        
        if (p.totalPinecones >= 500 && !currentAchievements.includes('rich_kid') && !newlyUnlocked.includes('rich_kid')) {
           checkAchievements(currentHabits, [...currentAchievements, ...newlyUnlocked], newProf);
        }
      }
    }
  };

  const refresh = async () => {
    try {
      const hd = await api.getHabits();
      setHabits(hd);
      const ach = await api.getAchievements();
      const achKeys = ach.map(a => a.badge_key);
      setAchievements(achKeys);
      const prof = await api.getProfile();
      setProfile(prof);

      await checkAchievements(hd, achKeys, prof);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const checkinHabit = async (id: number) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    let updatedHabits: Habit[] = [];
    
    setHabits(prev => {
      updatedHabits = prev.map(h => {
        if (h.id === id) {
          if (!h.logs?.includes(todayStr)) {
            return { ...h, logs: [...(h.logs || []), todayStr] };
          }
        }
        return h;
      });
      return updatedHabits;
    });

    try {
      await api.checkin(id, todayStr);
      const p = await api.addPinecones(5); // 5 pinecones for everyday checkin!
      const newProf = { ...profile, pinecones: p.pinecones, totalPinecones: p.totalPinecones };
      setProfile(newProf);
      await checkAchievements(updatedHabits, achievements, newProf);
    } catch (e) {
      console.error(e);
    }
  };

  const waterAll = async () => {
    try {
      const wCount = await api.waterFriend();
      const p = await api.addPinecones(2); // 2 pinecones for watering friend
      const newProf = { ...profile, waterCount: wCount, pinecones: p.pinecones, totalPinecones: p.totalPinecones };
      setProfile(newProf);
      await checkAchievements(habits, achievements, newProf);
    } catch (e) {
      console.error(e);
    }
  };

  const buyStoreItem = async (id: string, price: number) => {
    try {
      const p = await api.buyItem(id, price);
      const newProf = { ...profile, pinecones: p.pinecones, purchases: p.purchases };
      setProfile(newProf);
      await checkAchievements(habits, achievements, newProf);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const addHabit = async (habit: any) => {
    await api.createHabit(habit);
    await refresh();
  };

  const removeHabit = async (id: number) => {
    await api.deleteHabit(id);
    await refresh();
  };
  
  const editHabit = async (id: number, habit: Partial<Habit>) => {
    await api.updateHabit(id, habit);
    await refresh();
  };

  const updateProfile = async (info: { name?: string, avatar?: string, signature?: string }) => {
    const updated = await api.updateUserInfo(info);
    setProfile(prev => ({ ...prev, name: updated.name || prev.name, avatar: updated.avatar || prev.avatar, signature: updated.signature || prev.signature }));
  };

  return (
    <HabitContext.Provider value={{ habits, achievements, loading, recentUnlock, profile, clearRecentUnlock, refresh, checkinHabit, addHabit, removeHabit, editHabit, waterAll, buyStoreItem, updateProfile }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error("useHabits must be used within HabitProvider");
  return ctx;
}
