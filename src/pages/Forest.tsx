import { useHabits } from "../context/HabitContext";
import { TREE_TYPES } from "../constants";
import { motion } from "motion/react";
import { Cloud, Sun } from "lucide-react";
import { useMemo } from "react";

export default function Forest() {
  const { habits } = useHabits();

  // Create a memoized layout so trees don't jump around on re-renders, 
  // but they get positions
  const forestItems = useMemo(() => {
    return habits.map((habit, index) => {
      const logsCount = habit.logs?.length || 0;
      let stageIndex = 0;
      if (logsCount >= 15) stageIndex = 3;
      else if (logsCount >= 7) stageIndex = 2;
      else if (logsCount >= 3) stageIndex = 1;

      const treeConfig = TREE_TYPES.find(t => t.id === habit.tree_type) || TREE_TYPES[0];
      const emoji = treeConfig.stages[stageIndex];
      
      // Pseudo-random position for variety but stable based on ID
      const seed = habit.id;
      const xOffset = (seed * 13) % 40 - 20; // -20 to 20
      const yOffset = (seed * 17) % 30 - 15; // -15 to 15
      
      return {
        ...habit,
        emoji,
        stageIndex,
        xOffset,
        yOffset
      };
    });
  }, [habits]);

  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] bg-[#A5D6A7] rounded-[48px] border-8 border-white/50 shadow-inner overflow-hidden isolate">
      <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(#81C784 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Clouds / optional atmospheric elements */}
      <motion.div 
        animate={{ x: ["-10%", "150%"] }} 
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        className="absolute top-12 left-0 text-white/50"
      >
        <Cloud size={60} fill="currentColor" />
      </motion.div>
      <motion.div 
        animate={{ x: ["-50%", "200%"] }} 
        transition={{ repeat: Infinity, duration: 25, ease: "linear", delay: 5 }}
        className="absolute top-24 left-10 text-white/30"
      >
        <Cloud size={40} fill="currentColor" />
      </motion.div>

      {/* The Trees */}
      <div className="absolute z-20 flex flex-wrap justify-center items-end inset-x-0 bottom-4 px-4 gap-4 overflow-y-auto content-end h-full pt-20">
        {forestItems.length === 0 && (
          <div className="w-full h-full flex flex-col items-center justify-center pb-20 text-[#2E7D32] font-bold">
            <p className="text-xl">森林还是空空的呢</p>
            <p className="text-sm opacity-70">去打卡种下第一棵树吧！</p>
          </div>
        )}
        
        {forestItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", delay: i * 0.1, bounce: 0.5 }}
            className="flex flex-col items-center justify-end relative group cursor-pointer"
            style={{ 
              transform: "translate(" + item.xOffset + "px, " + item.yOffset + "px)",
              width: item.stageIndex > 1 ? '80px' : '60px',
              height: item.stageIndex > 1 ? '100px' : '80px'
            }}
          >
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur text-[#2E7D32] text-xs font-bold px-3 py-2 rounded-xl shadow-lg whitespace-nowrap pointer-events-none z-50">
              <p>{item.title}</p>
              <p className="text-[10px] font-medium opacity-70">打卡: {item.logs?.length || 0}次</p>
              <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 border-t-8 border-t-white/90 border-x-8 border-x-transparent border-b-0" />
            </div>

            {/* Tree Emoji */}
            <span className="text-5xl md:text-6xl absolute bottom-4 filter drop-shadow-md origin-bottom group-hover:scale-110 transition-transform">
              {item.emoji}
            </span>
            
            {/* Soil patch */}
            <div className="w-10 h-3 bg-[#4CAF50]/30 rounded-[100%] absolute bottom-2 filter blur-[1px]"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
