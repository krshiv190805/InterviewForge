import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { 
  CalendarRange, 
  Sparkles, 
  CheckCircle,
  Plus,
  Loader2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Target,
  AlertTriangle,
  GraduationCap,
  Briefcase,
  PlayCircle,
  Video,
  Clock,
  BookOpen,
  ExternalLink
} from 'lucide-react';

export const StudyPlanner = () => {
  const [weeksLeft, setWeeksLeft] = useState(4);
  const [motive, setMotive] = useState('placement'); // 'internship' or 'placement'
  const [targetCompanies, setTargetCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [expandedWeek, setExpandedWeek] = useState(1);
  const [expandedCategory, setExpandedCategory] = useState(null); // Accordion state for resource library

  const { addToast } = useToast();

  const availableCompanies = ['Google', 'Amazon', 'Microsoft', 'Cisco', 'Adobe', 'Uber'];

  const resourcesData = [
    {
      category: 'Data Structures & Algorithms (DSA)',
      description: 'Master patterns like Blind 75, Top 150 LeetCode, and comprehensive topic trees.',
      icon: <BookOpen className="w-4 h-4 text-orange-500" />,
      items: [
        {
          name: 'Striver A-Z DSA (TakeUForward)',
          description: 'Industry-standard structured roadmap & video playlists.',
          url: 'https://youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz&si=3a1z14pkKQeQ_kg6',
          badge: 'Striver',
          image: 'https://i.ytimg.com/vi/rHn9af16O_E/maxresdefault.jpg',
          color: 'from-orange-500/10 to-red-500/10 text-orange-700 dark:text-orange-400 border-orange-500/25'
        },
        {
          name: 'Apna College DSA',
          description: 'Topic-wise sheets and code explanations for beginners.',
          url: 'https://youtube.com/playlist?list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt&si=Ix8J0uoa_lwoaWSx',
          badge: 'Apna College',
          image: 'https://i.ytimg.com/vi/VTLCoHnyACE/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAtycquQEdiduXlVKi3RORLwYomEg',
          color: 'from-blue-500/10 to-indigo-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25'
        },
        {
          name: 'Love Babbar DSA',
          description: 'Popular 450 DSA placement cracking series and video tips.',
          url: 'https://youtube.com/playlist?list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA&si=bLmFoeMIoEOVyr5_',
          badge: 'Love Babbar',
          image: 'https://i.ytimg.com/vi/9kQ1JUDleWg/maxresdefault.jpg',
          color: 'from-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25'
        }
      ]
    },
    {
      category: 'System Design',
      description: 'Prepare for High Level (HLD) & Low Level (LLD) architectural interview rounds.',
      icon: <Target className="w-4 h-4 text-purple-500" />,
      items: [
        {
          name: 'Gaurav Sen System Design',
          description: 'Master fundamentals, caching, sharding, and distributed apps.',
          url: 'https://youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX&si=Quljy8SjtvUkIkfx',
          badge: 'Gaurav Sen',
          image: 'https://miro.medium.com/v2/resize:fit:1400/1*374oZcO5YW9gUbFBahmjHw.jpeg',
          color: 'from-purple-500/10 to-indigo-500/10 text-purple-700 dark:text-purple-400 border-purple-500/25'
        },
        {
          name: 'Coder Army System Design',
          description: 'Core distributed services structure and design patterns.',
          url: 'https://youtube.com/playlist?list=PLQEaRBV9gAFvzp6XhcNFpk1WdOcyVo9qT&si=sMId2AcIXbNgOTe2',
          badge: 'Coder Army',
          image: 'https://coderamry-strike-courses-assets.s3.ap-south-1.amazonaws.com/coderarmy/system_design.png',
          color: 'from-cyan-500/10 to-blue-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/25'
        }
      ]
    },
    {
      category: 'CS Fundamentals',
      description: 'Revise Operating Systems, Database Systems, Networks, and OOPs concepts.',
      icon: <GraduationCap className="w-4 h-4 text-teal-500" />,
      items: [
        {
          name: 'Gate Smashers - Operating Systems',
          description: 'OS process sync, CPU scheduling, deadlocks, and memory management.',
          url: 'https://youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p&si=DU9_rPuLKtUBrUPa',
          badge: 'OS',
          image: 'https://i.ytimg.com/vi/WJ-UaAaumNA/maxresdefault.jpg',
          color: 'from-teal-500/10 to-emerald-500/10 text-teal-700 dark:text-teal-400 border-teal-500/25'
        },
        {
          name: 'Gate Smashers - Computer Networks',
          description: 'ISO OSI Model, TCP/IP, IP routing, subnetting, and application protocols.',
          url: 'https://youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_&si=bbOwMS0KjGZvdFdy',
          badge: 'CN',
          image: 'https://i.ytimg.com/vi/4D55Cmj2t-A/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAw19526dQ4NC637W3OBaaybWye6g',
          color: 'from-teal-500/10 to-cyan-500/10 text-teal-750 dark:text-teal-400 border-teal-500/25'
        },
        {
          name: 'Gate Smashers - OOPs',
          description: 'Encapsulation, inheritance, polymorphism, abstraction, and OOP design.',
          url: 'https://youtube.com/playlist?list=PLxCzCOWd7aiF6yRNI5OHQsnUJQfl7Geqj&si=VuRpS9TWnAgNtzFF',
          badge: 'OOPs',
          image: 'https://i.ytimg.com/vi/05LLyH15ZWU/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCSyVCriSHJMqHNEF8k6KT4xBEgGQ',
          color: 'from-blue-500/10 to-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/25'
        },
        {
          name: 'Gate Smashers - DBMS',
          description: 'SQL queries, joins, relational model, transactions, ACID, and normal forms.',
          url: 'https://youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y&si=VB2r_DujVO-ncACH',
          badge: 'DBMS',
          image: 'https://i.ytimg.com/vi/kBdlM6hNDAE/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLAMEvEDM-5W3F3v328khgHPYt9cmg',
          color: 'from-indigo-500/10 to-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/25'
        }
      ]
    },
    {
      category: 'Web Dev & Project Discussion',
      icon: <Video className="w-4 h-4 text-pink-500" />,
      description: 'Prepare frontend/backend engineering project stack walkthroughs.',
      items: [
        {
          name: 'Chai aur Code',
          description: 'Hitesh Choudhary\'s deep dives into JS, React, Node, and real apps.',
          url: 'https://youtube.com/playlist?list=PLu71SKxNbfoBuX3f4EOACle2y-tRC5Q37&si=3MADXx3QPcYwVay2',
          badge: 'Chai aur Code',
          image: 'https://i.ytimg.com/vi/Hr5iLG7sUa0/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDZBasenaTKZZj8jCiZs9E9DTx5gw',
          color: 'from-amber-500/10 to-yellow-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25'
        },
        {
          name: 'Code with Harry',
          description: 'Comprehensive language bootcamps and web project walk-throughs.',
          url: 'https://youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w&si=3pFrsbxFBC9ajULv',
          badge: 'Code with Harry',
          image: 'https://i.ytimg.com/vi/tVzUXW6siu0/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDf-xrqgUw55JSfKsoykKVhngkzRA',
          color: 'from-red-500/10 to-pink-500/10 text-red-700 dark:text-red-400 border-red-500/25'
        },
        {
          name: 'Apna College Web Dev',
          description: 'Full stack development bootcamps and styling tutorials.',
          url: 'https://youtube.com/playlist?list=PLfqMhTWNBTe0PY9xunOzsP5kmYIz2Hu7i&si=02mJ77SjsoszcseA',
          badge: 'Apna College',
          image: 'https://i.ytimg.com/vi/HcOc7P5BMi4/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCXIVD7nKmTmF48h8u_feib2Y4CQA',
          color: 'from-blue-500/10 to-cyan-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25'
        }
      ]
    }
  ];

  const getResourceLink = (taskText) => {
    const lower = taskText.toLowerCase();
    if (lower.includes('striver') || lower.includes('takeuforward')) {
      return { name: 'Striver A-Z', url: 'https://youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz&si=3a1z14pkKQeQ_kg6' };
    }
    if (lower.includes('love babbar')) {
      return { name: 'Love Babbar DSA', url: 'https://youtube.com/playlist?list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA&si=bLmFoeMIoEOVyr5_' };
    }
    if (lower.includes('apna college dsa')) {
      return { name: 'Apna College', url: 'https://youtube.com/playlist?list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt&si=Ix8J0uoa_lwoaWSx' };
    }
    if (lower.includes('gaurav sen')) {
      return { name: 'Gaurav Sen Design', url: 'https://youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX&si=Quljy8SjtvUkIkfx' };
    }
    if (lower.includes('coder army')) {
      return { name: 'Coder Army Design', url: 'https://youtube.com/playlist?list=PLQEaRBV9gAFvzp6XhcNFpk1WdOcyVo9qT&si=sMId2AcIXbNgOTe2' };
    }
    
    // Gate Smashers split topics routing
    if (lower.includes('gate smashers') || lower.includes('operating system') || lower.includes('os')) {
      if (lower.includes('dbms') || lower.includes('database')) {
        return { name: 'Gate Smashers DBMS', url: 'https://youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y&si=VB2r_DujVO-ncACH' };
      }
      if (lower.includes('network') || lower.includes('tcp') || lower.includes('ip') || lower.includes('http')) {
        return { name: 'Gate Smashers Networks', url: 'https://youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_&si=bbOwMS0KjGZvdFdy' };
      }
      if (lower.includes('oops') || lower.includes('object oriented') || lower.includes('oop')) {
        return { name: 'Gate Smashers OOPs', url: 'https://youtube.com/playlist?list=PLxCzCOWd7aiF6yRNI5OHQsnUJQfl7Geqj&si=VuRpS9TWnAgNtzFF' };
      }
      return { name: 'Gate Smashers OS', url: 'https://youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p&si=DU9_rPuLKtUBrUPa' };
    }
    
    if (lower.includes('dbms') || lower.includes('database')) {
      return { name: 'Gate Smashers DBMS', url: 'https://youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y&si=VB2r_DujVO-ncACH' };
    }
    if (lower.includes('network') || lower.includes('tcp') || lower.includes('ip') || lower.includes('http')) {
      return { name: 'Gate Smashers Networks', url: 'https://youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_&si=bbOwMS0KjGZvdFdy' };
    }
    if (lower.includes('oops') || lower.includes('object oriented') || lower.includes('oop')) {
      return { name: 'Gate Smashers OOPs', url: 'https://youtube.com/playlist?list=PLxCzCOWd7aiF6yRNI5OHQsnUJQfl7Geqj&si=VuRpS9TWnAgNtzFF' };
    }
    
    if (lower.includes('chai aur code')) {
      return { name: 'Chai aur Code', url: 'https://youtube.com/playlist?list=PLu71SKxNbfoBuX3f4EOACle2y-tRC5Q37&si=3MADXx3QPcYwVay2' };
    }
    if (lower.includes('code with harry')) {
      return { name: 'Code with Harry', url: 'https://youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w&si=3pFrsbxFBC9ajULv' };
    }
    if (lower.includes('apna college web')) {
      return { name: 'Apna College Web', url: 'https://youtube.com/playlist?list=PLfqMhTWNBTe0PY9xunOzsP5kmYIz2Hu7i&si=02mJ77SjsoszcseA' };
    }
    return null;
  };

  const fetchPlans = async () => {
    try {
      const res = await axios.get('/api/ai/study-plans');
      if (res.data.success) {
        setPlans(res.data.plans);
        if (res.data.plans.length > 0 && !activePlan) {
          setActivePlan(res.data.plans[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCompanyToggle = (c) => {
    setTargetCompanies(prev => prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]);
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/ai/study-plan', {
        weeksLeft,
        motive,
        targetCompanies
      });
      if (res.data.success) {
        addToast('Drive study roadmap forged successfully!', 'success');
        setActivePlan(res.data.plan);
        fetchPlans();
        setExpandedWeek(1);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to generate study plan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = async (weekNum, taskText, isChecked) => {
    if (!activePlan) return;

    const targetWeek = activePlan.schedule.find(w => w.week === weekNum);
    if (!targetWeek) return;

    let updatedCompleted = [...targetWeek.completedTasks];
    if (isChecked) {
      updatedCompleted.push(taskText);
    } else {
      updatedCompleted = updatedCompleted.filter(t => t !== taskText);
    }

    try {
      const res = await axios.put(`/api/ai/study-plan/${activePlan._id}/week/${weekNum}`, {
        completedTasks: updatedCompleted
      });
      if (res.data.success) {
        setActivePlan(res.data.plan);
        setPlans(prev => prev.map(p => p._id === activePlan._id ? res.data.plan : p));
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to update task progress.', 'error');
    }
  };

  const handleCategoryToggle = (index) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-6xl mx-auto">
      
      {/* Drive Announcement Alert Banner */}
      <div className="p-4 md:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex gap-3">
          <span className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl mt-0.5 md:mt-0 flex-shrink-0">
            <AlertTriangle size={20} />
          </span>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 brand-font">College Recruitment Drive Shock Alert!</h3>
            <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5">Configure your timeline and motive below to prepare efficiently for coding rounds, discussions, and concepts.</p>
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white flex items-center gap-3">
          <span className="p-2 bg-blue-600/10 text-blue-600 rounded-2xl">
            <CalendarRange size={24} />
          </span>
          <span>Drive Preparation & Roadmaps</span>
        </h1>
        <p className="text-sm text-slate-550 dark:text-slate-400 mt-2">Generate target-company study timelines, reference playlists, and manage sprint revision tasks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form & Playlists Accordion */}
        <div className="space-y-6 lg:col-span-1">
          
          <form onSubmit={handleCreatePlan} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 glass-panel shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-500" />
              <span>Configure Drive Sprint</span>
            </h3>

            {/* Motive Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">Drive Motive</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMotive('internship')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    motive === 'internship'
                      ? 'border-blue-500 bg-blue-500/5 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-850 hover:bg-slate-50 text-slate-650'
                  }`}
                >
                  <Briefcase size={20} className="mb-1" />
                  <span className="text-xs">Internship</span>
                  <span className="text-[9px] font-normal text-slate-450 mt-0.5">DSA & Projects</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMotive('placement')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    motive === 'placement'
                      ? 'border-indigo-500 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-850 hover:bg-slate-50 text-slate-650'
                  }`}
                >
                  <GraduationCap size={20} className="mb-1" />
                  <span className="text-xs">Placement</span>
                  <span className="text-[9px] font-normal text-slate-450 mt-0.5">System Design + Full Core</span>
                </button>
              </div>
            </div>

            {/* Weeks Left Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Time Left Before Drive</label>
                <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-600/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <Clock size={12} />
                  {weeksLeft} Weeks
                </span>
              </div>
              <input
                type="range"
                min={4}
                max={18}
                value={weeksLeft}
                onChange={(e) => setWeeksLeft(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>4 Weeks (Sprint)</span>
                <span>18 Weeks (Deep Prep)</span>
              </div>
            </div>

            {/* Target Companies */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Target Companies</label>
              <div className="flex flex-wrap gap-1.5">
                {availableCompanies.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleCompanyToggle(c)}
                    className={`text-xs px-2.5 py-1.5 rounded-xl border transition-colors ${
                      targetCompanies.includes(c)
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25 font-bold'
                        : 'border-slate-200 dark:border-slate-850 text-slate-650 hover:bg-slate-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-55 rounded-xl shadow-lg shadow-blue-500/10 btn-transition"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate Roadmap</span>
                </>
              )}
            </button>
          </form>

          {/* Structured Resources Accordion Library */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 glass-panel shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-350 uppercase tracking-wider flex items-center gap-2">
                <PlayCircle size={16} className="text-blue-600" />
                <span>Reference Course Channels</span>
              </h3>
              <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5">Quickly access top video resources for core categories.</p>
            </div>
            
            <div className="space-y-2">
              {resourcesData.map((category, index) => {
                const isExpanded = expandedCategory === index;
                return (
                  <div key={index} className="border border-slate-100 dark:border-slate-855 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleCategoryToggle(index)}
                      className="w-full flex items-center justify-between p-3 text-left font-bold text-xs text-slate-800 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-850/30 focus:outline-none"
                    >
                      <div className="flex items-center gap-2">
                        {category.icon}
                        <span>{category.category}</span>
                      </div>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {isExpanded && (
                      <div className="p-3 bg-white dark:bg-slate-900/40 space-y-2.5">
                        <p className="text-[9px] text-slate-400 leading-normal">{category.description}</p>
                        <div className="space-y-1.5">
                          {category.items.map((item, itemIdx) => (
                            <a
                              key={itemIdx}
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-3 p-2 rounded-lg border bg-gradient-to-r ${item.color} hover:opacity-85 transition-opacity text-xs font-semibold`}
                            >
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-8 h-8 object-cover rounded-md border border-slate-200/50 dark:border-slate-700/50 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-slate-200/30 dark:bg-slate-700/30 rounded-md flex items-center justify-center flex-shrink-0 font-bold text-[9px] text-slate-400 dark:text-slate-500 border border-dashed border-slate-300 dark:border-slate-750">
                                  {item.badge.split(' ').map(n => n[0]).join('')}
                                </div>
                              )}
                              <div className="flex-1 min-w-0 pr-1">
                                <span className="block font-bold text-[11px] text-slate-850 dark:text-slate-200 truncate">{item.name}</span>
                                <span className="block text-[9px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5 truncate">{item.description}</span>
                              </div>
                              <ExternalLink size={12} className="flex-shrink-0 text-slate-400" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active study plan lists */}
          {plans.length > 0 && (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 glass-panel shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-350 uppercase tracking-wider">Generated Tracks</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {plans.map(p => (
                  <button
                    key={p._id}
                    onClick={() => { setActivePlan(p); setExpandedWeek(1); }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-colors flex items-center justify-between font-semibold ${
                      activePlan?._id === p._id
                        ? 'border-blue-500/60 bg-blue-500/5 text-blue-600 dark:text-blue-400 font-bold'
                        : 'border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-450 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 max-w-[75%]">
                      <Target size={14} className="flex-shrink-0" />
                      <span className="truncate">{p.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">{p.duration}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Roadmap Display */}
        <div className="lg:col-span-2">
          {activePlan ? (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 glass-panel shadow-sm space-y-6">
              
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    activePlan.motive === 'internship'
                      ? 'bg-blue-600/10 text-blue-600 border border-blue-500/20'
                      : 'bg-indigo-600/10 text-indigo-600 border border-indigo-500/20'
                  }`}>
                    {activePlan.motive === 'internship' ? 'Internship Track' : 'Placement Track'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-950 dark:text-white leading-tight mt-2">{activePlan.title}</h2>
                <div className="flex items-center gap-4 mt-2.5 text-xs font-semibold text-slate-505">
                  <span>Duration: <span className="text-slate-800 dark:text-slate-350">{activePlan.duration}</span></span>
                  <span>Generated: <span className="text-slate-800 dark:text-slate-350">{new Date(activePlan.createdAt).toLocaleDateString()}</span></span>
                </div>
              </div>

              <div className="space-y-4">
                {activePlan.schedule.map((item) => {
                  const isExpanded = expandedWeek === item.week;
                  const totalTasks = item.tasks.length;
                  const completedCount = item.completedTasks.length;
                  const isWeekCompleted = totalTasks > 0 && completedCount === totalTasks;

                  return (
                    <div 
                      key={item._id || item.week} 
                      className={`rounded-2xl border overflow-hidden transition-colors ${
                        isWeekCompleted
                          ? 'border-emerald-500/20 bg-emerald-500/5'
                          : isExpanded
                          ? 'border-blue-500/20 bg-slate-50 dark:bg-slate-900/40'
                          : 'border-slate-200 dark:border-slate-850'
                      }`}
                    >
                      <button
                        onClick={() => setExpandedWeek(isExpanded ? null : item.week)}
                        className="w-full flex items-center justify-between p-4 px-5 text-left font-bold text-sm text-slate-850 dark:text-white focus:outline-none"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${isWeekCompleted ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
                          <div>
                            <span>Week {item.week}: {item.focus}</span>
                            <p className="text-[10px] text-slate-505 dark:text-slate-400 font-medium mt-0.5">
                              {completedCount} of {totalTasks} tasks completed
                            </p>
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>

                      {isExpanded && (
                        <div className="p-5 px-6 border-t border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900/40 space-y-3.5">
                          {item.tasks.map((taskText, tIndex) => {
                            const isChecked = item.completedTasks.includes(taskText);
                            const refResource = getResourceLink(taskText);

                            return (
                              <div 
                                key={tIndex}
                                className={`flex flex-col gap-2 p-3.5 rounded-xl border transition-colors ${
                                  isChecked 
                                    ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-450 line-through' 
                                    : 'border-slate-100 dark:border-slate-850 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <label className="flex items-start gap-3 cursor-pointer text-xs font-semibold">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => handleTaskToggle(item.week, taskText, e.target.checked)}
                                    className="mt-0.5 accent-emerald-500 rounded cursor-pointer flex-shrink-0"
                                  />
                                  <span>{taskText}</span>
                                </label>

                                {refResource && (
                                  <div className="pl-6 flex">
                                    <a
                                      href={refResource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/10 rounded-lg hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500/20 transition-all shadow-2xs"
                                    >
                                      <PlayCircle size={10} />
                                      <span>Watch on {refResource.name}</span>
                                      <ExternalLink size={8} />
                                    </a>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            <div className="h-[380px] p-16 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
                <CheckCircle size={22} />
              </div>
              <h3 className="font-bold text-slate-850 dark:text-slate-250">No Active Study Track</h3>
              <p className="text-xs text-slate-550 dark:text-slate-400 mt-1 max-w-sm">
                Configure your motive and remaining timeline in weeks on the left, then click Generate to create a custom study path.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default StudyPlanner;
