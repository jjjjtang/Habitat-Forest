export type Habit = {
  id: number;
  title: string;
  frequency_type: 'daily' | 'weekly';
  frequency_count: number;
  reminder_time: string | null;
  tree_type: string;
  created_at: string;
  logs: string[]; // YYYY-MM-DD
}

export type HabitLog = {
  id: number;
  habit_id: number;
  check_date: string;
  created_at: string;
}

export const TREE_TYPES = [
  { id: 'pine', name: '松树', emoji: '🌲', stages: ['🌱', '🌿', '🌲', '🌲'] },
  { id: 'cherry', name: '樱花', emoji: '🌸', stages: ['🌱', '🌿', '🌳', '🌸'] },
  { id: 'maple', name: '枫树', emoji: '🍁', stages: ['🌱', '🌿', '🌳', '🍁'] },
  { id: 'palm', name: '椰树', emoji: '🌴', stages: ['🌱', '🌿', '🌴', '🌴'] },
  { id: 'apple', name: '苹果树', emoji: '🍎', stages: ['🌱', '🌿', '🌳', '🍎'] },
  { id: 'lemon', name: '柠檬树', emoji: '🍋', stages: ['🌱', '🌿', '🌳', '🍋'] },
];

export const BADGES = [
  { key: 'first_blood', name: '崭新开始', desc: '第一次打卡任意习惯', icon: '🌟' },
  { key: 'week_star', name: '一周之星', desc: '单个习惯打卡满7天', icon: '👑' },
  { key: 'month_warrior', name: '月度战士', desc: '单个习惯打卡满30天', icon: '🗡️' },
  { key: 'year_legend', name: '年度传说', desc: '单个习惯打卡满100天', icon: '🔥' },
  { key: 'five_habits', name: '兴趣广泛', desc: '成功涉及体验5种不同习惯', icon: '🌈' },
  { key: 'ten_habits', name: '习惯大师', desc: '成功体验全部10种不同习惯', icon: '🏆' },
  { key: 'forest_guard', name: '森林守护者', desc: '累计打卡达到50次', icon: '🛡️' },
  { key: 'botanist', name: '植物学家', desc: '种植3种以上不同类型的树', icon: '🌿' },
  { key: 'first_pinecone', name: '第一桶金', desc: '赚取第一颗小松果', icon: '🌰' },
  { key: 'rich_kid', name: '松果大亨', desc: '累计赚取超过500颗松果', icon: '💰' },
  { key: 'first_purchase', name: '初入商海', desc: '在松果商店完成第一次兑换', icon: '🛒' },
  { key: 'social_butterfly', name: '热心肠', desc: '累计为好友浇水5次', icon: '🦋' },
];

export const STORE_ITEMS = [
  { id: 'codex_token', name: 'Codex Token 10000', desc: '畅享代码大模型智慧，加速你的开发进程', price: 50, icon: 'cpu', max: null },
  { id: 'consulting', name: '技术咨询服务', desc: '1对1解答技术难题，带你走出瓶颈期', price: 200, icon: 'lightbulb', max: 1 },
  { id: 'web_dev', name: '个人网站定制', desc: '从零打造属于你的酷炫个人网页', price: 800, icon: 'globe', max: 1 },
  { id: 'app_dev', name: '个人APP定制', desc: '高级全栈定制服务，实现你的造物构想', price: 2000, icon: 'smartphone', max: 1 },
];

export const QUOTES = [
  "每一个不曾起舞的日子，都是对生命的辜负。",
  "种一棵树最好的时间是十年前，其次是现在。",
  "九层之台，起于垒土；千里之行，始于足下。",
  "慢慢来，比较快。",
  "所有的伟大，都源于一个勇敢的开始。",
  "不要低估习惯的力量，它是水滴石穿的奇迹。",
  "放弃很容易，但坚持更酷。",
];

export const MOCK_FRIENDS = [
  { id: 1, name: "小星", avatar: "⭐", trees: 12, streak: 45, signature: "坚持就是胜利！" },
  { id: 2, name: "阿云", avatar: "☁️", trees: 8, streak: 12, signature: "早起鸟儿有虫吃。" },
  { id: 3, name: "胖胡", avatar: "🦊", trees: 24, streak: 120, signature: "每天进步一点点。" },
  { id: 4, name: "阳光", avatar: "🌻", trees: 5, streak: 5, signature: "向着光亮那方。" },
  { id: 5, name: "夜猫", avatar: "🦉", trees: 30, streak: 80, signature: "专注每一个深夜。" },
];
