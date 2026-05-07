/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logoUrl from './logo.png';
import { 
  Users, 
  Info, 
  MessageSquare, 
  PlayCircle, 
  ShieldCheck, 
  BarChart3, 
  ChevronDown,
  Menu,
  X,
  Send,
  Heart,
  Zap,
  BookOpen,
  Quote
} from 'lucide-react';

// --- Components ---

const Logo = ({ className = "" }: { className?: string }) => (
  <img 
    src={logoUrl} 
    alt="The Co-exist Pitch Logo" 
    className={`${className} object-contain`}
  />
);

const Navbar = ({ activeSection, setActiveSection }: { activeSection: string, setActiveSection: (s: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'hub', label: 'Hub' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'awareness', label: 'Awareness' },
    { id: 'about', label: 'About' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveSection('home')}>
          <Logo className="w-12 h-12" />
          <span className="font-bold text-xl tracking-tight text-emerald-900 hidden sm:inline">Co-exist Pitch</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`text-sm font-medium transition-colors ${
                activeSection === item.id ? 'text-emerald-600' : 'text-zinc-500 hover:text-emerald-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b border-zinc-200 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsOpen(false);
                  }}
                  className={`text-left text-lg font-medium ${
                    activeSection === item.id ? 'text-emerald-600' : 'text-zinc-500'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionContainer = ({ id, children, className = "" }: { id: string, children: React.ReactNode, className?: string }) => (
  <section id={id} className={`py-24 px-6 ${className}`}>
    <div className="max-w-5xl mx-auto">
      {children}
    </div>
  </section>
);

export default function App() {
  const [activeSection, setActiveSection] = useState('home');

  const interviews = [
    {
      name: "Ricky Xu",
      role: "Year 10 Student",
      quote: "I used to stay on the sidelines because I felt I wasn't 'good enough'. This pitch changed that vibe."
    },
    {
      name: "Sarah L.",
      role: "Year 11 Student",
      quote: "The 'performance pressure' is real. Having a space where it's okay to just 'be a beginner' is so refreshing and inclusive."
    },
    {
      name: "Alex T.",
      role: "Year 9 Student",
      quote: "I love soccer, but sometimes high-intensity matches feel more like a battle. Co-exist Pitch lets us focus on the joy of the game."
    },
    {
      name: "Leo K.",
      role: "Year 12 Student",
      quote: "Respecting the 'No-Contact' rule has actually made me a better technical player. It's about skill, not just strength."
    },
    {
      name: "Mia Z.",
      role: "Year 10 Student",
      quote: "It's about belonging. I don't have to apologize for missing a pass here. We're all here to learn and co-exist."
    },
    {
      name: "Jason D.",
      role: "Year 11 Student",
      quote: "Changing the culture of the pitch starts with small rules. 'No-contact' opens the game up to so many more people."
    }
  ];

  // Scroll to section when activeSection changes (if triggered by nav)
  useEffect(() => {
    if (activeSection !== 'interviews') {
      const el = document.getElementById(activeSection);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeSection]);

  if (activeSection === 'interviews') {
    return (
      <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden pt-16">
        <Navbar activeSection="hub" setActiveSection={setActiveSection} />
        
        <SectionContainer id="interviews-gallery" className="min-h-screen">
          <div className="mb-16">
            <button 
              onClick={() => setActiveSection('hub')}
              className="group flex items-center gap-2 text-zinc-400 hover:text-emerald-600 transition-colors mb-8 text-sm font-medium"
            >
              <Zap className="w-4 h-4 rotate-180" /> Back to Hub
            </button>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">Student Stories</h1>
            <p className="text-xl text-zinc-500 max-w-2xl">Voices from the pitch — hearing from those who are helping redefine our sports culture.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {interviews.map((item, idx) => (
              <motion.div 
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-10 bg-white border border-emerald-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-500"
              >
                <Quote className="w-10 h-10 text-emerald-400 mb-6" />
                <p className="text-xl text-zinc-800 mb-10 font-medium leading-relaxed italic">"{item.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-100 rounded-full flex-none" />
                  <div>
                    <p className="font-bold text-lg text-zinc-900">{item.name}</p>
                    <p className="text-sm text-zinc-400">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionContainer>

        {/* Footer for Interview Page */}
        <div className="bg-zinc-900 py-24 px-6 text-white rounded-t-[4rem]">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Logo className="w-12 h-12" />
              <span className="font-bold tracking-tight text-lg">THE CO-EXIST PITCH</span>
            </div>
            <button 
              onClick={() => setActiveSection('home')}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-full font-bold transition-all"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* --- HOME PAGE --- */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-emerald-950">
        <video 
          className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
          autoPlay muted loop playsInline
          src="https://videos.pexels.com/video-files/3268841/3268841-hd_1920_1080_25fps.mp4"
        />
        <div className="absolute inset-0 bg-linear-to-b from-emerald-950/50 via-transparent to-zinc-50" />
        
        <div className="relative z-10 text-center px-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold tracking-widest uppercase rounded-full mb-6 backdrop-blur-sm border border-emerald-500/20"
          >
            A Student-Led Initiative
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-7xl md:text-9xl font-bold text-white mb-8 tracking-tighter"
          >
            A Pitch for Everyone
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-emerald-100/80 font-light max-w-2xl mx-auto leading-relaxed"
          >
            Every goal deserves to be celebrated.<br/>
            We are committed to creating a mixed-gender pitch without "performance pressure".
          </motion.p>
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => setActiveSection('hub')}
            className="mt-12 group flex items-center gap-2 mx-auto text-emerald-400 font-medium hover:text-emerald-300 transition-colors"
          >
            Explore the movement <ChevronDown className="group-hover:translate-y-1 transition-transform" />
          </motion.button>
        </div>
      </section>

      {/* Mission Statement */}
      <SectionContainer id="mission" className="bg-white border-y border-zinc-200 text-center">
        <div className="max-w-3xl mx-auto">
          <Heart className="w-10 h-10 text-rose-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-2xl text-zinc-600 font-light italic leading-relaxed">
            "Every goal deserves to be celebrated. We are committed to creating a mixed-gender pitch without 'performance pressure', allowing everyone to find the joy of sports here."
          </p>
        </div>
      </SectionContainer>

      {/* --- COMMUNITY HUB --- */}
      <SectionContainer id="hub">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-emerald-600 font-mono text-sm tracking-widest uppercase mb-2 block">Community Hub</span>
            <h2 className="text-5xl font-bold tracking-tight">Stories & Tips</h2>
          </div>
          <p className="text-zinc-500 max-w-sm">
            "It's not just about soccer, it's about stories. Bravely taking the first step is cooler than scoring a goal."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Quote 1 */}
          <div className="p-8 bg-white border border-zinc-200 rounded-3xl hover:border-emerald-200 transition-colors">
            <Quote className="w-8 h-8 text-emerald-300 mb-4" />
            <p className="text-lg text-zinc-700 mb-6 font-medium">"I used to stay on the sidelines because I felt I wasn't 'good enough'. This pitch changed that vibe."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-200 rounded-full" />
              <div>
                <p className="font-bold text-sm text-zinc-900">Ricky Xu</p>
                <p className="text-xs text-zinc-400">Year 10 Student</p>
              </div>
            </div>
          </div>
          
          {/* Beginner Corner */}
          <div className="lg:col-span-2 p-8 bg-emerald-900 text-white rounded-3xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-6 text-emerald-400">
                <Zap className="w-5 h-5 fill-emerald-400" />
                <span className="text-sm font-bold tracking-widest uppercase">Beginner's Corner</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">Football Beginners: Confidence Tips</h3>
              <p className="text-emerald-100/70 mb-8 max-w-md">"You don't need to be a pro, you just need a desire to run. Let rules no longer be an obstacle."</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-auto">
                <div className="flex gap-4">
                  <div className="w-8 h-8 flex-none bg-emerald-700 rounded-lg flex items-center justify-center font-bold">1</div>
                  <p className="text-sm">Don't worry about the score; focus on the flow of the game.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 flex-none bg-emerald-700 rounded-lg flex items-center justify-center font-bold">2</div>
                  <p className="text-sm">Low-intensity means fewer accidents and more space to learn.</p>
                </div>
              </div>
            </div>
            <BookOpen className="absolute -bottom-10 -right-10 w-64 h-64 text-emerald-800 opacity-20 pointer-events-none" />
          </div>

          {/* More stories link */}
          <div className="p-8 bg-zinc-100 rounded-[2.5rem] flex items-center justify-center text-center border-2 border-dashed border-zinc-200">
            <div>
              <p className="text-zinc-400 text-sm mb-4">10+ more student stories</p>
              <button 
                onClick={() => setActiveSection('interviews')}
                className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors text-lg"
              >
                Read full interviews
              </button>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* --- FEEDBACK BOX --- */}
      <section id="feedback" className="bg-emerald-50 py-24 px-6 overflow-hidden relative">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-12 text-center mb-8">
            <h2 className="text-5xl font-bold mb-4">Anonymous Feedback Box</h2>
            <p className="text-emerald-700/70 text-lg max-w-2xl mx-auto">
              "Your voice makes this place better. Whether it's a suggestion for the venue or thoughts on the rules, share anonymously and let's improve together."
            </p>
          </div>

          <div className="lg:col-start-3 lg:col-span-8 bg-white p-10 rounded-[3rem] shadow-xl shadow-emerald-200/50">
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-bold text-zinc-500 uppercase tracking-widest mb-3">
                  How do you feel about the current field atmosphere?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Intimidating', 'Neutral', 'Welcoming'].map(v => (
                    <button key={v} type="button" className="py-3 px-4 rounded-2xl border border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-sm font-medium">
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-500 uppercase tracking-widest mb-3">
                  What would make you feel more "welcome"?
                </label>
                <textarea 
                  className="w-full h-32 p-4 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-hidden resize-none"
                  placeholder="Share your thoughts here..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-500 uppercase tracking-widest mb-3">
                  Report any issues
                </label>
                <input 
                  type="text" 
                  className="w-full p-4 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  placeholder="Optional..."
                />
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
                <div className="flex items-center gap-2 text-zinc-400 text-xs italic">
                  <ShieldCheck className="w-4 h-4" />
                  Note: Names are never collected. Your response is 100% anonymous.
                </div>
                <button className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors">
                  <Send className="w-4 h-4" /> Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* --- AWARENESS & EDUCATION --- */}
      <SectionContainer id="awareness">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <span className="text-emerald-600 font-mono text-sm tracking-widest uppercase mb-2 block">Awareness & Education</span>
            <h2 className="text-5xl font-bold mb-8 leading-tight">Fairness Starts with Understanding.</h2>
            
            <div className="space-y-6">
              <div className="p-6 bg-white border border-zinc-200 rounded-2xl">
                <h3 className="flex items-center gap-2 font-bold mb-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" /> "No-Contact" Explained
                </h3>
                <p className="text-sm text-zinc-500">
                  Low-intensity play focuses on spacing and skill rather than physical dominance. No sliding tackles or aggressive shoulder-barging.
                </p>
              </div>
              <div className="p-6 bg-white border border-zinc-200 rounded-2xl">
                <h3 className="flex items-center gap-2 font-bold mb-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600" /> Utilization Info
                </h3>
                <div className="h-4 w-full bg-zinc-100 rounded-full mt-4 overflow-hidden flex">
                  <div className="bg-emerald-500 w-[20%]" />
                  <div className="bg-zinc-300 w-[80%]" />
                </div>
                <p className="text-xs text-zinc-400 mt-2">Current pitch usage: 20% Female vs 80% Male (Observation Study)</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="aspect-video bg-zinc-900 rounded-[2rem] overflow-hidden relative shadow-2xl shadow-emerald-900/20">
              <img 
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover" 
                alt="Educational Gallery"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-zinc-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-white font-bold text-2xl uppercase tracking-widest mb-1">Educational Gallery</p>
                <p className="text-white/70 text-lg">Promoting gender fairness in campus sports.</p>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* --- ABOUT --- */}
      <SectionContainer id="about" className="bg-zinc-900 text-white rounded-t-[4rem]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 py-12">
          <div className="lg:col-span-7">
            <h2 className="text-4xl font-bold mb-8">Why "Co-exist Pitch"?</h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              On our school soccer pitch, there is a clear gender imbalance in resource utilization. 
              Observations, independently confirmed by ten of my fellow students, show that while the center is dominated by high-intensity male matches, female students are often relegated to the sidelines.
            </p>
            <p className="text-zinc-400 text-lg leading-relaxed">
              This is not just about space; it is about social comfort. Many girls feel shy or self-conscious about accidental physical contact and the "performance pressure" of playing with experienced boys. 
              This issue limits girls' opportunities to stay active and reinforces the stereotype that competitive sports are a male domain.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="p-8 bg-zinc-800 rounded-3xl border border-zinc-700">
              <h3 className="font-bold text-emerald-400 mb-6 uppercase tracking-widest text-xs">The Team Credits</h3>
              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <p className="text-white font-bold">Joshua</p>
                  <p className="text-zinc-500 text-xs">Build & Navigation</p>
                </div>
                <div>
                  <p className="text-white font-bold">Jack</p>
                  <p className="text-zinc-500 text-xs">Content Specialist</p>
                </div>
                <div>
                  <p className="text-white font-bold">Kye</p>
                  <p className="text-zinc-500 text-xs">UI Copywriting</p>
                </div>
                <div>
                  <p className="text-white font-bold">Oliver</p>
                  <p className="text-zinc-500 text-xs">Design & Logo</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-12 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo className="w-16 h-16" />
            <span className="font-bold tracking-tight text-lg text-white">THE CO-EXIST PITCH</span>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
