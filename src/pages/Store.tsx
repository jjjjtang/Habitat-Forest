import { STORE_ITEMS } from "../constants";
import { useHabits } from "../context/HabitContext";
import { Store as StoreIcon, Award, CheckCircle2, Cpu, Lightbulb, Globe, Smartphone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const ICON_MAP: Record<string, any> = {
  cpu: Cpu,
  lightbulb: Lightbulb,
  globe: Globe,
  smartphone: Smartphone,
};

export default function Store() {
  const { profile, buyStoreItem } = useHabits();
  const [buyingId, setBuyingId] = useState<string | null>(null);

  const handleBuy = async (id: string, price: number) => {
    if (profile.pinecones < price) {
      alert("松果不足！快去打卡或给好友浇水赚取松果吧！");
      return;
    }
    
    setBuyingId(id);
    try {
      await buyStoreItem(id, price);
      // alert animation handling or just simple success message
      setTimeout(() => setBuyingId(null), 500);
    } catch(e) {
      setBuyingId(null);
      alert("兑换失败");
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-[#D97706] to-[#B45309] text-white p-6 sm:p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 pointer-events-none">
          <StoreIcon size={150} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black mb-2 relative z-10 flex items-center gap-2">
          <span>松果商店</span>
        </h2>
        <p className="text-[#FEF3C7] font-medium relative z-10 opacity-90 max-w-[85%] text-sm sm:text-base">
          用你辛勤积攒的松果，兑换稀有服务和特权吧！
        </p>
      </div>

      <div className="bg-[#FFFBEB] rounded-[2rem] p-6 shadow-sm border border-[#FEF3C7] flex items-center justify-between">
        <div>
          <p className="text-[#B45309] font-bold text-sm">当前资产</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl">🌰</span>
            <span className="text-3xl font-black text-[#D97706]">{profile.pinecones}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[#B45309] font-bold text-sm">累计获得</p>
          <p className="text-xl font-black text-[#D97706] opacity-70">{profile.totalPinecones}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {STORE_ITEMS.map((item) => {
          const purchasedCount = profile.purchases[item.id] || 0;
          const isMaxed = item.max !== null && purchasedCount >= item.max;
          const IconComp = ICON_MAP[item.icon];

          return (
            <motion.div 
              key={item.id}
              whileHover={{ scale: 0.98 }}
              className={`bg-white rounded-3xl p-5 border-2 shadow-sm transition-colors relative flex flex-col justify-between overflow-hidden ${isMaxed ? 'border-gray-200' : 'border-transparent hover:border-[#FDE68A]'}`}
            >
              <div className="flex gap-3 sm:gap-4">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 ${isMaxed ? 'bg-gray-100 text-gray-400' : 'bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7]'}`}>
                  {IconComp && <IconComp size={28} strokeWidth={1.5} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-base sm:text-lg truncate ${isMaxed ? 'text-gray-500' : 'text-[#92400E]'}`}>{item.name}</h3>
                  <p className={`text-xs mt-1 font-medium leading-relaxed line-clamp-2 sm:line-clamp-none ${isMaxed ? 'text-gray-400' : 'text-[#B45309]/70'}`}>{item.desc}</p>
                </div>
              </div>
              
              <div className="mt-5 flex items-center justify-between shrink-0">
                <div className="flex flex-col">
                  {item.max !== null && (
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">限购 {purchasedCount}/{item.max}</span>
                  )}
                  <span className={`font-black flex items-center gap-1 ${isMaxed ? 'text-gray-400' : 'text-[#D97706]'}`}>
                    <span className="text-sm">🌰</span> {item.price}
                  </span>
                </div>
                
                {isMaxed ? (
                  <button disabled className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-400 font-bold rounded-xl text-sm flex items-center gap-1 shrink-0">
                    <CheckCircle2 size={16} /> 已兑换
                  </button>
                ) : (
                  <button 
                    onClick={() => handleBuy(item.id, item.price)}
                    disabled={buyingId === item.id || profile.pinecones < item.price}
                    className={`px-4 py-2 font-bold rounded-xl text-sm shadow-sm transition-all active:scale-95 shrink-0 ${
                      profile.pinecones < item.price 
                        ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed' 
                        : 'bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-[#D97706]/20'
                    }`}
                  >
                    {buyingId === item.id ? '兑换中' : '立即兑换'}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
