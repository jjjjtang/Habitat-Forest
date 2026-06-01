import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { motion } from 'motion/react';
import { Edit3, Check, Trophy, Store as StoreIcon, Settings, User } from 'lucide-react';
import { BADGES } from '../constants';

export default function Profile() {
  const { profile, habits, achievements, updateProfile } = useHabits();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editSignature, setEditSignature] = useState(profile.signature);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);
  
  const totalCheckins = habits.reduce((acc, h) => acc + (h.logs?.length || 0), 0);
  const totalTrees = habits.length;

  const handleSave = async () => {
    await updateProfile({ name: editName, signature: editSignature, avatar: editAvatar });
    setIsEditing(false);
  };

  const AVATAR_OPTIONS = ['🌱', '🌲', '🦊', '🦉', '🐻', '🐰', '🐯', '🌟'];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <User size={150} />
        </div>
        
        {isEditing ? (
          <div className="relative z-10 space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">编辑主页</h2>
            <div>
              <p className="text-sm font-bold text-gray-500 mb-2">选择头像</p>
              <div className="flex gap-2 flex-wrap">
                {AVATAR_OPTIONS.map(emoji => (
                  <button 
                    key={emoji}
                    onClick={() => setEditAvatar(emoji)}
                    className={`w-12 h-12 rounded-full text-2xl flex items-center justify-center transition-all ${
                      editAvatar === emoji ? 'bg-[#15803D] ring-4 ring-[#DCFCE7] shadow-md' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-bold text-gray-500 mb-2">昵称</p>
              <input 
                type="text" 
                value={editName}
                onChange={e => setEditName(e.target.value)}
                maxLength={10}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-[#15803D] transition-colors"
              />
            </div>
            
            <div>
              <p className="text-sm font-bold text-gray-500 mb-2">个性签名</p>
              <input 
                type="text" 
                value={editSignature}
                onChange={e => setEditSignature(e.target.value)}
                maxLength={20}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-[#15803D] transition-colors"
              />
            </div>
            
            <div className="flex justify-end pt-2">
              <button 
                onClick={handleSave}
                className="bg-[#15803D] text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 active:scale-95 transition-transform"
              >
                <Check size={18} /> 保存
              </button>
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center text-center">
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute top-0 right-0 p-2 text-gray-400 hover:text-[#15803D] bg-gray-50 hover:bg-[#F0FDF4] rounded-full transition-colors"
            >
              <Edit3 size={18} />
            </button>
            
            <div className="w-24 h-24 bg-[#F0FDF4] rounded-full border-4 border-white shadow-md flex items-center justify-center text-5xl mb-4">
              {profile.avatar}
            </div>
            <h2 className="text-2xl font-black text-[#166534]">{profile.name}</h2>
            <p className="text-[#166534]/70 font-medium mt-1">"{profile.signature}"</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#FFFBEB] rounded-[2rem] p-5 shadow-sm border border-[#FEF3C7]">
          <p className="text-[#B45309] font-bold text-xs uppercase tracking-wider mb-1">我的财产</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌰</span>
            <span className="text-2xl font-black text-[#D97706]">{profile.pinecones}</span>
          </div>
        </div>
        <div className="bg-[#F0FDF4] rounded-[2rem] p-5 shadow-sm border border-[#DCFCE7]">
          <p className="text-[#166534] font-bold text-xs uppercase tracking-wider mb-1">累计打卡</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#15803D]">{totalCheckins}</span>
            <span className="text-xs font-bold text-[#166534]/50">次</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Trophy className="text-[#F59E0B]" size={20} /> 
            荣誉室
          </h3>
          <span className="text-sm font-bold text-gray-400">{achievements.length} / {BADGES.length}</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BADGES.map((badge) => {
            const unlocked = achievements.includes(badge.key);
            return (
              <div 
                key={badge.key}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                  unlocked ? 'bg-[#FFFBEB] border-[#FDE68A]' : 'bg-gray-50 border-transparent grayscale opacity-50'
                }`}
              >
                <span className="text-3xl mb-2">{badge.icon}</span>
                <span className={`text-xs font-bold ${unlocked ? 'text-[#B45309]' : 'text-gray-500'}`}>{badge.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
