/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Award, 
  BookOpen, 
  Briefcase, 
  Heart, 
  Mail, 
  Github, 
  Twitter, 
  ChevronRight,
  Quote,
  Star
} from 'lucide-react';

// --- Types ---
interface Achievement {
  year: string;
  title: string;
  description: string;
}

interface CharacterData {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  quote: string;
  image: string;
  stats: { label: string; value: string }[];
  achievements: Achievement[];
  skills: string[];
  interests: string[];
}

// --- Mock Data ---
const CHARACTER: CharacterData = {
  name: "高凯",
  title: "跨界艺术家 & 探险家",
  subtitle: "在光影与文字间寻找生命的边界",
  bio: "高凯是一位活跃于国际舞台的视觉艺术家与纪实摄影师。她出生于江南，成长于多元文化的交汇点。她的作品往往聚焦于人类情感的细微波动与自然景观的宏大叙事。在过去的十年里，她曾独自穿越撒哈拉沙漠，也曾在北极圈内记录消失的冰川。她的艺术理念是：'所有的创作都是为了在无常的世界中留下确定的温柔。'",
  quote: "艺术不是对现实的模仿，而是对灵魂的唤醒。",
  image: "https://picsum.photos/seed/artist/1200/1600",
  stats: [
    { label: "创作年限", value: "12+" },
    { label: "举办展览", value: "24" },
    { label: "足迹国家", value: "45" },
    { label: "出版著作", value: "3" },
  ],
  achievements: [
    { year: "2023", title: "国际纪实摄影金奖", description: "凭借《消失的地平线》系列作品获得年度最高荣誉。" },
    { year: "2021", title: "首本个人摄影集出版", description: "《瞬息》在全球范围内发行，探讨时间与记忆的关系。" },
    { year: "2018", title: "联合国环境署特约摄影师", description: "参与全球气候变化记录计划，深入极地拍摄。" },
  ],
  skills: ["纪实摄影", "视觉叙事", "古典油画", "创意写作", "策展设计"],
  interests: ["高海拔攀登", "古籍修复", "黑胶唱片收藏", "观星"],
};

// --- Components ---

const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode; icon: any }) => (
  <div className="flex items-center gap-3 mb-8">
    <div className="p-2 bg-emerald-50 rounded-lg">
      <Icon className="w-6 h-6 text-emerald-600" />
    </div>
    <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{children}</h2>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<'bio' | 'achievements'>('bio');

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-800 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Hero Section */}
      <header className="relative h-[80vh] overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={CHARACTER.image} 
          alt={CHARACTER.name}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="inline-block px-3 py-1 bg-emerald-500 text-white text-xs font-bold tracking-widest uppercase rounded-full mb-4">
                Featured Profile
              </span>
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tighter">
                {CHARACTER.name}
              </h1>
              <p className="text-xl md:text-2xl text-zinc-300 font-light max-w-2xl">
                {CHARACTER.subtitle}
              </p>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Main Content */}
          <div className="lg:col-span-8 space-y-20">
            
            {/* Stats Grid */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {CHARACTER.stats.map((stat, idx) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl font-bold text-emerald-600 mb-1">{stat.value}</div>
                  <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </section>

            {/* Bio & Achievements Tabs */}
            <section>
              <div className="flex gap-8 border-b border-zinc-200 mb-10">
                {(['bio', 'achievements'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-lg font-semibold transition-all relative ${
                      activeTab === tab ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'
                    }`}
                  >
                    {tab === 'bio' ? '个人简介' : '主要成就'}
                    {activeTab === tab && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'bio' ? (
                  <motion.div
                    key="bio"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <p className="text-xl leading-relaxed text-zinc-600 italic">
                      <Quote className="inline-block w-6 h-6 mr-2 text-emerald-300 -mt-2" />
                      {CHARACTER.bio}
                    </p>
                    <div className="p-8 bg-emerald-900 rounded-3xl text-white relative overflow-hidden group">
                      <div className="relative z-10">
                        <p className="text-2xl font-serif italic mb-4">"{CHARACTER.quote}"</p>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                          <span className="text-sm font-bold tracking-widest uppercase text-emerald-400">Artist Philosophy</span>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800/50 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-emerald-700/50 transition-colors" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="achievements"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8"
                  >
                    {CHARACTER.achievements.map((item, idx) => (
                      <div key={idx} className="flex gap-6 group">
                        <div className="flex-none w-20 text-emerald-600 font-bold text-xl pt-1">
                          {item.year}
                        </div>
                        <div className="flex-grow pb-8 border-b border-zinc-100 group-last:border-0">
                          <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-emerald-600 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-zinc-600 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Gallery Preview */}
            <section>
              <SectionTitle icon={BookOpen}>作品掠影</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="aspect-square rounded-2xl overflow-hidden bg-zinc-200"
                  >
                    <img 
                      src={`https://picsum.photos/seed/work-${i}/600/600`} 
                      alt={`Work ${i}`}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            
            {/* Skills & Interests */}
            <div className="p-8 bg-white rounded-3xl border border-zinc-200 shadow-sm sticky top-8">
              <div className="space-y-10">
                <div>
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> 专业技能
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {CHARACTER.skills.map(skill => (
                      <span key={skill} className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-full text-sm font-medium hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Heart className="w-4 h-4" /> 个人兴趣
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {CHARACTER.interests.map(interest => (
                      <span key={interest} className="px-4 py-2 border border-zinc-200 text-zinc-600 rounded-full text-sm font-medium hover:border-emerald-200 hover:text-emerald-700 transition-colors cursor-default">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-zinc-100">
                  <h3 className="text-sm font-bold text-zinc-900 mb-6">建立联系</h3>
                  <div className="flex gap-4">
                    <button className="p-3 bg-zinc-900 text-white rounded-xl hover:bg-emerald-600 transition-colors">
                      <Mail className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-zinc-100 text-zinc-600 rounded-xl hover:bg-zinc-200 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-zinc-100 text-zinc-600 rounded-xl hover:bg-zinc-200 transition-colors">
                      <Github className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
              L
            </div>
            <span className="font-bold text-zinc-900 tracking-tight">LIN HAIYIN</span>
          </div>
          <p className="text-zinc-400 text-sm">
            © 2026 {CHARACTER.name} 视觉艺术工作室. 保留所有权利.
          </p>
          <div className="flex gap-8 text-sm font-medium text-zinc-500">
            <a href="#" className="hover:text-emerald-600 transition-colors">隐私政策</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">服务条款</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
