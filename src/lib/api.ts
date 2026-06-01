import type { Habit, HabitLog } from "../constants";

const STORAGE_KEY = 'habit_forest_data';

interface AppData {
  habits: Habit[];
  achievements: string[];
  lastId: number;
  pinecones: number;
  totalPinecones: number;
  purchases: { [key: string]: number };
  waterCount: number;
  name?: string;
  avatar?: string;
  signature?: string;
}

const getStorage = (): AppData => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    const parsed = JSON.parse(data);
    return {
      habits: parsed.habits || [],
      achievements: parsed.achievements || [],
      lastId: parsed.lastId || 0,
      pinecones: parsed.pinecones || 0,
      totalPinecones: parsed.totalPinecones || parsed.pinecones || 0,
      purchases: parsed.purchases || {},
      waterCount: parsed.waterCount || 0,
      name: parsed.name || '默认昵称',
      avatar: parsed.avatar || '🌱',
      signature: parsed.signature || '我的森林，我的世界。',
    };
  }
  return { 
    habits: [], achievements: [], lastId: 0, pinecones: 0, totalPinecones: 0, purchases: {}, waterCount: 0,
    name: '默认昵称', avatar: '🌱', signature: '我的森林，我的世界。'
  };
};

const saveStorage = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const api = {
  getProfile: async () => {
    const d = getStorage();
    return { 
      pinecones: d.pinecones, 
      totalPinecones: d.totalPinecones, 
      purchases: d.purchases, 
      waterCount: d.waterCount,
      name: d.name || '默认昵称',
      avatar: d.avatar || '🌱',
      signature: d.signature || '我的森林，我的世界。'
    };
  },
  updateUserInfo: async (info: { name?: string, avatar?: string, signature?: string }) => {
    const d = getStorage();
    if (info.name !== undefined) d.name = info.name;
    if (info.avatar !== undefined) d.avatar = info.avatar;
    if (info.signature !== undefined) d.signature = info.signature;
    saveStorage(d);
    return { name: d.name, avatar: d.avatar, signature: d.signature };
  },
  addPinecones: async (amount: number) => {
    const d = getStorage();
    d.pinecones += amount;
    if (amount > 0) d.totalPinecones += amount;
    saveStorage(d);
    return { pinecones: d.pinecones, totalPinecones: d.totalPinecones };
  },
  waterFriend: async () => {
    const d = getStorage();
    d.waterCount += 1;
    saveStorage(d);
    return d.waterCount;
  },
  buyItem: async (itemId: string, price: number) => {
    const d = getStorage();
    if (d.pinecones >= price) {
      d.pinecones -= price;
      d.purchases[itemId] = (d.purchases[itemId] || 0) + 1;
      saveStorage(d);
      return { pinecones: d.pinecones, purchases: d.purchases };
    }
    throw new Error('Not enough pinecones');
  },
  getHabits: async (): Promise<Habit[]> => {
    return getStorage().habits;
  },
  createHabit: async (habit: Partial<Habit>): Promise<Habit> => {
    const data = getStorage();
    const newHabit: Habit = {
      id: data.lastId + 1,
      title: habit.title || '无标题',
      frequency_type: habit.frequency_type || 'daily',
      frequency_count: habit.frequency_count || 1,
      reminder_time: habit.reminder_time || null,
      tree_type: habit.tree_type || 'pine',
      created_at: new Date().toISOString(),
      logs: []
    };
    data.habits.push(newHabit);
    data.lastId = newHabit.id;
    saveStorage(data);
    return newHabit;
  },
  updateHabit: async (id: number, habit: Partial<Habit>): Promise<void> => {
    const data = getStorage();
    const index = data.habits.findIndex(h => h.id === id);
    if (index !== -1) {
      data.habits[index] = { ...data.habits[index], ...habit };
      saveStorage(data);
    }
  },
  deleteHabit: async (id: number): Promise<void> => {
    const data = getStorage();
    data.habits = data.habits.filter(h => h.id !== id);
    saveStorage(data);
  },
  checkin: async (habitId: number, date: string): Promise<void> => {
    const data = getStorage();
    const habit = data.habits.find(h => h.id === habitId);
    if (habit) {
      if (!habit.logs) habit.logs = [];
      if (!habit.logs.includes(date)) {
        habit.logs.push(date);
        saveStorage(data);
      } else {
        throw new Error('Already checked in today');
      }
    }
  },
  mockCheckin: async (habitId: number, days: number): Promise<void> => {
    const data = getStorage();
    const habit = data.habits.find(h => h.id === habitId);
    if (habit) {
      if (!habit.logs) habit.logs = [];
      const now = new Date();
      for (let i = 0; i < days; i++) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        if (!habit.logs.includes(dateStr)) {
          habit.logs.push(dateStr);
        }
      }
      saveStorage(data);
    }
  },
  getAchievements: async (): Promise<{ badge_key: string }[]> => {
    return getStorage().achievements.map(key => ({ badge_key: key }));
  },
  unlockAchievement: async (badge_key: string): Promise<void> => {
    const data = getStorage();
    if (!data.achievements.includes(badge_key)) {
      data.achievements.push(badge_key);
      saveStorage(data);
    }
  },
  clearAll: async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
