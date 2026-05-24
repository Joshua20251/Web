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
  Quote,
  Lock,
  LogOut,
  Trash2
} from 'lucide-react';
import fieldImg from './field.JPG';
import field2Img from './field2.png';
import humanImg from './human.png';
import { submitFeedback, submitSurvey, auth, signIn, subscribeToFeedbacks, subscribeToSurveys } from './services/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

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
    { id: 'why', label: 'Why' },
    { id: 'mission', label: 'Mission' },
    { id: 'solutions', label: 'Solutions' },
    { id: 'insights', label: 'Insights' },
    { id: 'hub', label: 'Hub' },
    { id: 'feedback', label: 'Feedback' },
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
  const [user, setUser] = useState<User | null>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Survey Form States
  const [gender, setGender] = useState('');
  const [grade, setGrade] = useState('');
  const [playFrequency, setPlayFrequency] = useState('');
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [neutralRating, setNeutralRating] = useState<number | null>(null);
  const [barriers, setBarriers] = useState<string[]>([]);
  const [additionalFeedback, setAdditionalFeedback] = useState('');

  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      await signIn();
    } catch (error: any) {
      console.error(error);
      setAuthError(error.message || 'Failed to sign in');
    }
  };

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user) {
      const unsubFeedbacks = subscribeToFeedbacks((data) => {
        setFeedbacks(data);
      });
      const unsubSurveys = subscribeToSurveys((data) => {
        setSurveys(data);
      });
      return () => {
        unsubFeedbacks();
        unsubSurveys();
      };
    }
  }, [user]);

  const handleToggleTimeSlot = (slot: string) => {
    if (timeSlots.includes(slot)) {
      setTimeSlots(timeSlots.filter(s => s !== slot));
    } else {
      setTimeSlots([...timeSlots, slot]);
    }
  };

  const handleToggleBarrier = (barrier: string) => {
    if (barriers.includes(barrier)) {
      setBarriers(barriers.filter(b => b !== barrier));
    } else {
      setBarriers([...barriers, barrier]);
    }
  };

  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gender || !grade || !playFrequency || neutralRating === null) {
      alert("Please core all required fields (Gender, Grade, Frequency, and Inclusivity rating).");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitSurvey({
        gender,
        grade,
        playFrequency,
        timeSlots,
        neutralRating,
        barriers,
        additionalFeedback
      });
      
      alert("Thank you for your feedback!");
      
      setFeedbackSuccess(true);
      
      // Reset Form State
      setGender('');
      setGrade('');
      setPlayFrequency('');
      setTimeSlots([]);
      setNeutralRating(null);
      setBarriers([]);
      setAdditionalFeedback('');
      setTimeout(() => setFeedbackSuccess(false), 5000);
    } catch (error) {
      console.error(error);
      alert("Submission failed. Make sure Firebase is set up.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const interviews = [
    {
      name: "Ricky Xu",
      role: "Year 10 Student",
      quote: "I used to stay on the sidelines because I felt I wasn't 'good enough'. This pitch changed that vibe."
    },
    {
      name: "Oscar R.",
      role: "Year 10 Student",
      quote: "The 'performance pressure' is real. Having a space where it's okay to just 'be a beginner' is so refreshing and inclusive."
    },
    {
      name: "Oliver C.",
      role: "Year 10 Student",
      quote: "I love soccer, but sometimes high-intensity matches feel more like a battle. Co-exist Pitch lets us focus on the joy of the game."
    },
    {
      name: " Joshua Z.",
      role: "Year 10 Student",
      quote: "Respecting the 'No-Contact' rule has actually made me a better technical player. It's about skill, not just strength."
    },
    {
      name: "Leo R.",
      role: "Year 10 Student",
      quote: "It's about belonging. I don't have to apologize for missing a pass here. We're all here to learn and co-exist."
    },
    {
      name: "Kevin G.",
      role: "Year 10 Student",
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
                   <img 
                    src={humanImg} 
                    alt="Avatar"
                    className="w-12 h-12 rounded-full flex-none object-cover"
                    referrerPolicy="no-referrer"
                  />
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

      {/* Why Section */}
      <SectionContainer id="why" className="bg-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
                The Motivation
              </span>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
                Why <span className="text-zinc-900 font-serif italic">"Co-exist Pitch"</span>?
              </h2>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-6 text-xl text-zinc-600 leading-relaxed font-light"
            >
              <p>
                On our school soccer pitch, there is a clear <span className="text-emerald-600 font-bold">gender imbalance</span> in resource utilization. 
                Observations, independently confirmed by <span className="text-zinc-900 font-bold">ten of my fellow students</span>, show that while the center is dominated by high-intensity male matches, female students are often relegated to the sidelines.
              </p>
              <p>
                This is not just about space; it is about <span className="text-emerald-600 font-bold italic">social comfort</span>. Many girls feel shy or self-conscious about accidental physical contact and the "performance pressure" of playing with experienced boys.
              </p>
              <p className="text-zinc-400 text-lg border-l-2 border-emerald-100 pl-6 italic">
                This issue limits girls' opportunities to stay active and reinforces the stereotype that competitive sports are a male domain.
              </p>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
             {/* Decorative blob */}
             <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-50" />
             
             <div className="relative group flex flex-col gap-4">
                {/* Main Large Image */}
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-200 group-hover:scale-[1.02] transition-transform duration-700">
                  <img 
                    src={fieldImg} 
                    alt="The School Pitch Main View" 
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-emerald-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Staggered Second Image */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="relative rounded-3xl overflow-hidden shadow-xl border border-zinc-200 group-hover:translate-x-2 transition-transform duration-700">
                      <img 
                        src={field2Img} 
                        alt="The School Pitch Alternative View" 
                        className="w-full aspect-square object-cover"
                      />
                   </div>
                   
                   {/* Stats badge integrated into the layout */}
                   <motion.div 
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-6 rounded-[2rem] shadow-xl shadow-emerald-900/10 border border-emerald-50 border-t-emerald-200 flex flex-col justify-center items-center text-center gap-3 transition-transform duration-700 group-hover:-translate-x-2"
                  >
                    <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white rotate-3">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black text-emerald-600 tracking-widest mb-0.5">Community Report</p>
                        <p className="text-xl font-black text-zinc-900 tracking-tighter">10+ Witnesses</p>
                    </div>
                  </motion.div>
                </div>
             </div>
          </motion.div>
        </div>
      </SectionContainer>

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

      {/* --- THE CO-EXIST SOLUTION (Measures) --- */}
      <SectionContainer id="solutions" className="bg-emerald-950 text-white rounded-[4rem] my-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-900/20 skew-x-12 translate-x-32" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <Zap className="w-6 h-6 text-emerald-400 fill-emerald-400" />
            <span className="text-emerald-400 font-black uppercase tracking-widest text-sm">Key Measures</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-16 leading-[1.1]">
            Our <span className="text-emerald-400 font-serif italic">Solution</span> for<br />
            a Better Pitch.
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rule 1: No-Contact */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-emerald-900/40 backdrop-blur-sm border border-emerald-500/20 rounded-[2.5rem] group hover:bg-emerald-800/50 transition-colors"
            >
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-6 transition-transform">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">"No-Contact" Play</h3>
              <p className="text-emerald-100/60 leading-relaxed">
                By removing high-intensity physical contact, we shift the focus to <strong>technical skill and spacing</strong>. This eliminates the intimidation factor for students of all genders and sizes.
              </p>
            </motion.div>

            {/* Rule 2: Beginner Friendly */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 bg-emerald-900/40 backdrop-blur-sm border border-emerald-500/20 rounded-[2.5rem] group hover:bg-emerald-800/50 transition-colors"
            >
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-8 -rotate-3 group-hover:rotate-0 transition-transform">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Confidence First</h3>
              <p className="text-emerald-100/60 leading-relaxed mb-6">
                We've established a "Beginner's Corner" to provide confidence tips, ensuring that <strong>the pitch is a place for learning</strong>, not just for elite performance.
              </p>
              <div className="space-y-3">
                <div className="flex gap-3 items-center text-sm bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/10">
                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold">1</div>
                  Focus on the flow, not the score.
                </div>
                <div className="flex gap-3 items-center text-sm bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/10">
                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold">2</div>
                  Lower intensity means more space.
                </div>
              </div>
            </motion.div>

            {/* Rule 3: Visual Equity */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 bg-white text-zinc-900 rounded-[2.5rem] shadow-2xl"
            >
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-8">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Equitable Access</h3>
              <p className="text-zinc-500 leading-relaxed mb-8">
                Our goal is to rebalance the <strong>80/20 occupancy ratio</strong>. By creating a regulated mixed-gender space, we ensure every student gets a fair turn at the center.
              </p>
              
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-4">Current Participation</p>
                <div className="h-3 w-full bg-zinc-200 rounded-full flex overflow-hidden">
                  <div className="bg-emerald-500 w-[20%]" />
                  <div className="border-l-2 border-white w-[1px]" />
                  <div className="bg-zinc-300 w-[80%]" />
                </div>
                <div className="flex justify-between mt-3">
                  <span className="text-xs font-bold text-emerald-600">Female (20%)</span>
                  <span className="text-xs font-bold text-zinc-400">Male (80%)</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to Action for Solution */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-16 p-10 bg-linear-to-r from-emerald-500 to-emerald-600 rounded-[3rem] text-center"
          >
            <h4 className="text-3xl font-bold">"Respecting the 'No-Contact' rule has actually made me a better technical player."</h4>
          </motion.div>
        </div>
      </SectionContainer>

      {/* --- IMPACT & DATA DASHBOARD --- */}
      <section id="insights" className="py-24 px-6 bg-white border-y border-zinc-200">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-[#1b4332] text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4">
              Impact & Observations
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight mb-4">
              Our Community Insights
            </h2>
            <p className="text-zinc-505 text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#718096' }}>
              Empirical data collected from our school pitch and preliminary peer feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            {/* Left Column: Gender Gap Visualization */}
            <div className="lg:col-span-7 bg-zinc-50/80 rounded-[2.5rem] border border-zinc-100 p-8 sm:p-10 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300">
              <div className="space-y-8">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">The Reality Check</span>
                  <h3 className="text-2xl font-bold text-zinc-900 mt-1 mb-6">Field Participation Gender Gap</h3>
                </div>

                <div className="space-y-6">
                  {/* Lunch Break Card */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end text-sm">
                      <span className="font-bold text-zinc-805" style={{ color: '#2d3748' }}>Lunch Break Participation</span>
                      <span className="font-black text-emerald-700">28.6%</span>
                    </div>
                    {/* Visual Bar */}
                    <div className="h-6 w-full bg-zinc-200/70 rounded-full overflow-hidden p-1 border border-zinc-100">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '28.6%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="h-full rounded-full min-w-[20px] transition-all duration-300 relative"
                        style={{ backgroundColor: '#1b4332' }}
                      />
                    </div>
                    <p className="text-xs text-zinc-500 font-medium pl-1">
                      Average 2 Females out of 7 Total Players
                    </p>
                  </div>

                  {/* After-School Card */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end text-sm">
                      <span className="font-bold text-zinc-805" style={{ color: '#2d3748' }}>After-School Participation</span>
                      <span className="font-black text-emerald-700">10.0%</span>
                    </div>
                    {/* Visual Bar */}
                    <div className="h-6 w-full bg-zinc-200/70 rounded-full overflow-hidden p-1 border border-zinc-100">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '10%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                        className="h-full rounded-full min-w-[20px] transition-all duration-300 relative"
                        style={{ backgroundColor: '#1b4332' }}
                      />
                    </div>
                    <p className="text-xs text-zinc-400 font-medium pl-1">
                      Average 1 Female out of 10 Total Players
                    </p>
                  </div>
                </div>
              </div>

              {/* Analytical Insight Paragraph */}
              <div className="mt-8 pt-6 border-t border-zinc-202">
                <p className="text-sm text-zinc-650 leading-relaxed font-light" style={{ color: '#2d3748' }}>
                  <strong className="font-bold" style={{ color: '#1b4332' }}>Conclusion:</strong> As competitiveness and group density intensify after school, the implicit psychological exclusion barrier for female students sharply increases.
                </p>
              </div>
            </div>

            {/* Right Column: Stat Boxes & Testimonial */}
            <div className="lg:col-span-5 flex flex-col gap-8 justify-between">
              {/* Grid of 3 Stat Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                {/* Stat 1 */}
                <motion.div 
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white border border-zinc-200 rounded-[2rem] p-6 text-center shadow-xs hover:border-[#1e4620]/40 hover:shadow-lg hover:shadow-emerald-950/5 transition-all duration-300 flex flex-col justify-center items-center"
                >
                  <p className="text-4xl font-black mb-1 font-sans" style={{ color: '#1b4332' }}>1</p>
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-tight leading-tight">Week of Active Field Sampling</p>
                </motion.div>

                {/* Stat 2 */}
                <motion.div 
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white border border-zinc-200 rounded-[2rem] p-6 text-center shadow-xs hover:border-[#1e4620]/40 hover:shadow-lg hover:shadow-emerald-950/5 transition-all duration-300 flex flex-col justify-center items-center"
                >
                  <p className="text-4xl font-black mb-1 font-sans" style={{ color: '#1b4332' }}>3+</p>
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-tight leading-tight">Real Peer Stories Published</p>
                </motion.div>

                {/* Stat 3 */}
                <motion.div 
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white border border-zinc-200 rounded-[2rem] p-6 text-center shadow-xs hover:border-[#1e4620]/40 hover:shadow-lg hover:shadow-emerald-950/5 transition-all duration-300 flex flex-col justify-center items-center"
                >
                  <p className="text-4xl font-black mb-1 font-sans" style={{ color: '#1b4332' }}>100%</p>
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-tight leading-tight">Anonymous Feedback Privacy</p>
                </motion.div>
              </div>

              {/* Pitch Equity Action Plan Card */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="text-white rounded-[2.5rem] p-8 relative overflow-hidden flex-1 flex flex-col justify-between hover:shadow-xl hover:shadow-[#1b4332]/10 transition-all duration-300 border border-emerald-900/40"
                style={{ backgroundColor: '#1b4332' }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800/30 rounded-full blur-2xl pointer-events-none" />
                
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-800/40 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black tracking-tight text-white">Pitch Equity Action Plan</h4>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest font-mono">Our Next Actionable Steps</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 my-6">
                    {/* Item 1 */}
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </div>
                      <p className="text-xs text-emerald-100 leading-relaxed">
                        <strong className="font-bold text-white block">Mixed-Gender Hours:</strong> Introducing structured weekly co-ed matches to reduce high-competitive intimidation.
                      </p>
                    </div>

                    {/* Item 2 */}
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </div>
                      <p className="text-xs text-emerald-100 leading-relaxed">
                        <strong className="font-bold text-white block">Transparent Booking Slots:</strong> Moving away from "first-come, first-dominated" to fair scheduling allocations.
                      </p>
                    </div>

                    {/* Item 3 */}
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </div>
                      <p className="text-xs text-emerald-100 leading-relaxed">
                        <strong className="font-bold text-white block">Active Ally Playbook:</strong> Training student leaders to vocalize inclusion rules and welcome newcomers onto the pitch.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-emerald-800/40 pt-4 flex items-center justify-between text-[11px] text-emerald-300">
                  <span className="font-semibold">Goal: 40% Female Pitch Ratio</span>
                  <span className="font-mono text-emerald-400">By Next Term</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

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
              <img 
                src={humanImg} 
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
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
              <p className="text-zinc-400 text-sm mb-4">5+ more student stories</p>
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

      {/* --- INCLUSIVITY SURVEY --- */}
      <section id="feedback" className="bg-emerald-50 py-24 px-6 overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-200/50 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-200/50 rounded-full blur-2xl" />

        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-emerald-100 text-emerald-800 border border-emerald-200/50 mb-4 shadow-xs">
              <Zap className="w-3.5 h-3.5 fill-emerald-600" /> EQUITY CAMPAIGN
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 mb-4">
              School Soccer Pitch Inclusivity Survey
            </h2>
            <p className="text-emerald-800/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Help us bridge the gender gap and create a warm, welcoming sport environment for everyone. Share your opinions and suggestions anonymously.
            </p>
          </div>

          <div className="w-full bg-white p-6 sm:p-12 rounded-[2.5rem] shadow-2xl shadow-emerald-950/5 border border-zinc-100">
            {feedbackSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-emerald-100/55">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">Survey Submitted Successfully!</h3>
                <p className="text-zinc-500 max-w-md mx-auto leading-relaxed">
                  Thank you! Your response is 100% anonymous and has been saved to the database. We appreciate your valuable voice.
                </p>
                <button 
                  onClick={() => setFeedbackSuccess(false)}
                  className="mt-8 px-6 py-3 bg-zinc-100 font-bold text-zinc-700 rounded-2xl hover:bg-emerald-50 hover:text-emerald-700 transition-all border border-zinc-200 cursor-pointer"
                >
                  Submit Another Feedback
                </button>
              </motion.div>
            ) : (
              <form className="space-y-10" onSubmit={handleSurveySubmit}>
                
                {/* Q1: Gender */}
                <div className="space-y-4">
                  <label className="text-base font-bold text-zinc-800 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center justify-center">1</span>
                    Gender
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'Male', label: 'Male' },
                      { key: 'Female', label: 'Female' },
                      { key: 'Prefer not to say', label: 'Prefer not to say' }
                    ].map(opt => (
                      <button 
                        key={opt.key} 
                        type="button" 
                        onClick={() => setGender(opt.key)}
                        className={`p-4 rounded-2xl border text-sm font-semibold transition-all text-left flex items-center gap-3 cursor-pointer ${
                          gender === opt.key 
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm shadow-emerald-500/10' 
                            : 'border-zinc-200 hover:border-emerald-300 bg-white text-zinc-600 hover:bg-zinc-50/50'
                        }`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${
                          gender === opt.key ? 'border-emerald-600 bg-emerald-600' : 'border-zinc-300 bg-white'
                        }`}>
                          {gender === opt.key && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q2: Grade */}
                <div className="space-y-4">
                  <label className="text-base font-bold text-zinc-805 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center justify-center">2</span>
                    Grade
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'Grade 10', label: 'Grade 10' },
                      { key: 'Grade 11', label: 'Grade 11' },
                      { key: 'Grade 12', label: 'Grade 12' }
                    ].map(opt => (
                      <button 
                        key={opt.key} 
                        type="button" 
                        onClick={() => setGrade(opt.key)}
                        className={`p-4 rounded-2xl border text-sm font-semibold transition-all text-left flex items-center gap-3 cursor-pointer ${
                          grade === opt.key 
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm shadow-emerald-500/10' 
                            : 'border-zinc-200 hover:border-emerald-300 bg-white text-zinc-600 hover:bg-zinc-50/50'
                        }`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${
                          grade === opt.key ? 'border-emerald-600 bg-emerald-600' : 'border-zinc-300 bg-white'
                        }`}>
                          {grade === opt.key && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q3: Play Frequency */}
                <div className="space-y-4">
                  <label className="text-base font-bold text-zinc-800 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center justify-center">3</span>
                    How often do you play sports on the school soccer pitch?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'Daily', label: 'Daily' },
                      { key: '2-3 times a week', label: '2-3 times a week' },
                      { key: 'Rarely', label: 'Rarely' },
                      { key: 'Never', label: 'Never' }
                    ].map(opt => (
                      <button 
                        key={opt.key} 
                        type="button" 
                        onClick={() => setPlayFrequency(opt.key)}
                        className={`p-4 rounded-2xl border text-sm font-semibold transition-all text-left flex items-center gap-3 cursor-pointer ${
                          playFrequency === opt.key 
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm shadow-emerald-500/10' 
                            : 'border-zinc-200 hover:border-emerald-300 bg-white text-zinc-600 hover:bg-zinc-50/50'
                        }`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${
                          playFrequency === opt.key ? 'border-emerald-600 bg-emerald-600' : 'border-zinc-300 bg-white'
                        }`}>
                          {playFrequency === opt.key && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q4: Use Time slots */}
                <div className="space-y-4">
                  <label className="text-base font-bold text-zinc-800 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center justify-center">4</span>
                    During which time slots do you usually use the pitch? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'Lunch break', label: 'Lunch break' },
                      { key: 'After-school hours', label: 'After-school hours' },
                      { key: 'PE classes', label: 'PE classes' },
                      { key: 'Never', label: 'Never use the pitch' }
                    ].map(opt => {
                      const isChecked = timeSlots.includes(opt.key);
                      return (
                        <button 
                          key={opt.key} 
                          type="button" 
                          onClick={() => handleToggleTimeSlot(opt.key)}
                          className={`p-4 rounded-2xl border text-sm font-semibold transition-all text-left flex items-center gap-3 cursor-pointer ${
                            isChecked 
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm shadow-emerald-500/10' 
                              : 'border-zinc-200 hover:border-emerald-300 bg-white text-zinc-600 hover:bg-zinc-50/50'
                          }`}
                        >
                          <div className={`w-4.5 h-4.5 rounded-md border-2 flex items-center justify-center ${
                            isChecked ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-zinc-300 bg-white'
                          }`}>
                            {isChecked && (
                              <svg className="w-3 h-3 fill-none stroke-current stroke-[3]" viewBox="0 0 24 24">
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            )}
                          </div>
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Q5: Scale Rating */}
                <div className="space-y-4">
                  <label className="text-base font-bold text-zinc-800 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center justify-center">5</span>
                    "Our school soccer pitch is a welcoming and gender-neutral environment."
                  </label>
                  <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-200/60">
                    <div className="flex gap-2 sm:gap-4 justify-between">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setNeutralRating(num)}
                          className={`flex-1 aspect-square rounded-2xl border font-bold text-base sm:text-lg transition-all flex flex-col justify-center items-center cursor-pointer ${
                            neutralRating === num
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/20 scale-[1.03]'
                              : 'bg-white border-zinc-200 hover:border-emerald-400 text-zinc-700 hover:bg-emerald-50/20'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider mt-4">
                      <span>1 - Strongly Disagree</span>
                      <span>5 - Strongly Agree</span>
                    </div>
                  </div>
                </div>

                {/* Q6: Barriers */}
                <div className="space-y-4">
                  <label className="text-base font-bold text-zinc-800 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center justify-center">6</span>
                    What is the main barrier preventing you from playing after school? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'Lack of interest', label: 'Lack of interest' },
                      { key: 'Pitch dominated by male groups', label: 'Pitch dominated by male groups' },
                      { key: 'Feeling judged/self-conscious', label: 'Feeling judged / self-conscious' },
                      { key: 'Lack of co-ed activities', label: 'Lack of co-ed activities' }
                    ].map(opt => {
                      const isChecked = barriers.includes(opt.key);
                      return (
                        <button 
                          key={opt.key} 
                          type="button" 
                          onClick={() => handleToggleBarrier(opt.key)}
                          className={`p-4 rounded-2xl border text-sm font-semibold transition-all text-left flex items-center gap-3 cursor-pointer ${
                            isChecked 
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm shadow-emerald-500/10' 
                              : 'border-zinc-200 hover:border-emerald-300 bg-white text-zinc-600 hover:bg-zinc-50/50'
                          }`}
                        >
                          <div className={`w-4.5 h-4.5 rounded-md border-2 flex items-center justify-center ${
                            isChecked ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-zinc-300 bg-white'
                          }`}>
                            {isChecked && (
                              <svg className="w-3 h-3 fill-none stroke-current stroke-[3]" viewBox="0 0 24 24">
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            )}
                          </div>
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Suggestions open text block */}
                <div className="space-y-4">
                  <label className="text-base font-bold text-zinc-800 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center justify-center">7</span>
                    Do you have any suggestions to make the pitch more inclusive?
                  </label>
                  <textarea 
                    value={additionalFeedback}
                    onChange={(e) => setAdditionalFeedback(e.target.value)}
                    className="w-full h-32 p-4 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none text-zinc-700 text-sm leading-relaxed"
                    placeholder="What changes would spark bigger steps for you? Share here anonymously..."
                  ></textarea>
                </div>

                {/* Submit button container */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-t border-zinc-100">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs italic font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Note: Names are never collected. Your response is 100% anonymous & secure.
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-emerald-600 text-white px-8 py-4.5 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-md shadow-emerald-500/15 cursor-pointer md:w-auto w-full"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Submit Survey
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* --- ABOUT --- */}
      <SectionContainer id="about" className="bg-zinc-900 text-white rounded-t-[4rem]">
        <div className="py-12">
          <h2 className="text-4xl font-bold mb-12 text-center">About the Project</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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

            <div className="p-8 bg-zinc-800/50 rounded-3xl border border-zinc-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-zinc-400 uppercase tracking-widest text-xs">Admin Access</h3>
                {user ? (
                  <button onClick={() => signOut(auth!)} className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1">
                    <LogOut className="w-3 h-3" /> Logout
                  </button>
                ) : (
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={handleSignIn} className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Owner Login
                    </button>
                    {authError && (
                      <p className="text-[10px] text-rose-400 text-right max-w-[200px] leading-tight">
                        {authError}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              {user ? (() => {
                const totalCount = surveys.length;
                const ratingSum = surveys.reduce((acc, curr) => acc + (curr.neutralRating || 0), 0);
                const avgRating = totalCount > 0 ? (ratingSum / totalCount).toFixed(1) : '0';
                
                const maleCount = surveys.filter(s => s.gender === 'Male').length;
                const femaleCount = surveys.filter(s => s.gender === 'Female').length;
                const otherCount = surveys.filter(s => s.gender === 'Prefer not to say').length;

                return (
                  <div className="space-y-6 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                    {/* Live campaign stats */}
                    <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-700/60 space-y-3">
                      <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider font-mono">Campaign Metrics</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-zinc-850 rounded-xl border border-zinc-700/50">
                          <p className="text-[10px] text-zinc-500 font-medium">Total Replies</p>
                          <p className="text-2xl font-black text-white">{totalCount}</p>
                        </div>
                        <div className="p-3 bg-zinc-850 rounded-xl border border-zinc-700/50">
                          <p className="text-[10px] text-zinc-500 font-medium">Avg Inclusivity</p>
                          <p className="text-2xl font-black text-emerald-450" style={{ color: '#34d399' }}>{avgRating} <span className="text-xs text-zinc-400">/ 5</span></p>
                        </div>
                      </div>

                      {totalCount > 0 && (
                        <div className="space-y-2 pt-2 border-t border-zinc-800">
                          <p className="text-[10px] text-zinc-500 font-medium">Gender Distribution</p>
                          <div className="flex justify-between text-[9px] text-zinc-450 font-bold" style={{ color: '#a1a1aa' }}>
                            <span>Male: {maleCount}</span>
                            <span>Female: {femaleCount}</span>
                            <span>Other: {otherCount}</span>
                          </div>
                          <div className="h-2 w-full bg-zinc-800 rounded-full flex overflow-hidden">
                            <div className="h-full" style={{ width: `${(maleCount / totalCount) * 100}%`, backgroundColor: '#38bdf8' }} />
                            <div className="h-full" style={{ width: `${(femaleCount / totalCount) * 100}%`, backgroundColor: '#34d399' }} />
                            <div className="h-full" style={{ width: `${(otherCount / totalCount) * 100}%`, backgroundColor: '#fbbf24' }} />
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-zinc-450 font-bold">Raw Survey Submissions ({totalCount}):</p>
                    {totalCount === 0 ? (
                      <p className="text-xs text-zinc-500 italic">No survey responses yet.</p>
                    ) : (
                      surveys.map((s, i) => (
                        <div key={s.id || i} className="p-4 bg-zinc-900 rounded-2xl border border-zinc-700/80 space-y-2">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-extrabold text-emerald-400">{s.gender} • {s.grade}</span>
                            <span className="text-zinc-500">
                              {s.createdAt?.toDate ? s.createdAt.toDate().toLocaleDateString() : 'Just now'}
                            </span>
                          </div>
                          
                          <div className="text-xs text-zinc-400 space-y-1">
                            <p>⚽ <strong className="text-zinc-300 font-semibold">Play Frequency:</strong> {s.playFrequency}</p>
                            {s.timeSlots && s.timeSlots.length > 0 && (
                              <p>🕒 <strong className="text-zinc-300 font-semibold">Slots:</strong> {s.timeSlots.join(', ')}</p>
                            )}
                            <p>⭐ <strong className="text-zinc-300 font-semibold">Neutral Rating:</strong> {s.neutralRating} / 5</p>
                            {s.barriers && s.barriers.length > 0 && (
                              <p>⚠️ <strong className="text-zinc-300 font-semibold">Barriers:</strong> {s.barriers.join(', ')}</p>
                            )}
                          </div>

                          {s.additionalFeedback && (
                            <div className="mt-2 pt-2 border-t border-zinc-800/80">
                              <p className="text-xs text-zinc-300 italic leading-relaxed">
                                "{s.additionalFeedback}"
                              </p>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                );
              })() : (
                <p className="text-sm text-zinc-600">Login with Google to view anonymous survey submissions & metrics.</p>
              )}
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
