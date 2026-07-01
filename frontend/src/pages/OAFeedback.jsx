import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { 
  MessageSquare,
  Plus,
  Lock,
  Tag,
  X,
  Award,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';

export const OAFeedback = () => {
  const companies = [
    { key: 'google', name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg', color: 'border-blue-500 bg-blue-500/5 text-blue-500' },
    { key: 'amazon', name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg', color: 'border-orange-500 bg-orange-500/5 text-orange-500' },
    { key: 'microsoft', name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Microsoft_icon.svg', color: 'border-teal-500 bg-teal-500/5 text-teal-500' },
    { key: 'cisco', name: 'Cisco', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Cisco_logo.svg', color: 'border-cyan-500 bg-cyan-500/5 text-cyan-550' },
    { key: 'adobe', name: 'Adobe', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Adobe_Creative_Cloud_rainbow_icon.svg', color: 'border-rose-500 bg-rose-500/5 text-rose-500' },
    { key: 'uber', name: 'Uber', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png', color: 'border-slate-400 bg-slate-500/5 text-slate-400' }
  ];

  const [activeCompany, setActiveCompany] = useState('google');
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [typeFilter, setTypeFilter] = useState('All');
  const [diffFilter, setDiffFilter] = useState('All');

  const [roleInput, setRoleInput] = useState('');
  const [termInput, setTermInput] = useState('');
  const [typeInput, setTypeInput] = useState('OA');
  const [diffInput, setDiffInput] = useState('Medium');
  const [topicsInput, setTopicsInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [anonInput, setAnonInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  const fetchFeedbacks = async (companyKey) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/feedback/${companyKey}`);
      if (res.data.success) {
        setFeedbacks(res.data.feedbacks);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load assessment experiences.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks(activeCompany);
  }, [activeCompany]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!roleInput || !termInput || !contentInput) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const topicsArray = topicsInput
        .split(',')
        .map(t => t.trim())
        .filter(t => t !== '');

      const res = await axios.post('/api/feedback', {
        company: activeCompany,
        role: roleInput,
        term: termInput,
        feedbackType: typeInput,
        difficulty: diffInput,
        topics: topicsArray,
        content: contentInput,
        isAnonymous: anonInput
      });

      if (res.data.success) {
        addToast('Hiring experience shared successfully! Thank you for contributing.', 'success');
        setFeedbacks(prev => [res.data.feedback, ...prev]);
        setIsModalOpen(false);
        
        
        setRoleInput('');
        setTermInput('');
        setTypeInput('OA');
        setDiffInput('Medium');
        setTopicsInput('');
        setContentInput('');
        setAnonInput(false);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to share experience feedback.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getRandomGradient = (name) => {
    const charCode = name.charCodeAt(0) || 0;
    const gradients = [
      'from-blue-600 to-indigo-600',
      'from-purple-600 to-pink-600',
      'from-emerald-600 to-teal-600',
      'from-rose-600 to-orange-600',
      'from-cyan-600 to-blue-600'
    ];
    return gradients[charCode % gradients.length];
  };

  const filteredFeedbacks = feedbacks.filter(fb => {
    const matchType = typeFilter === 'All' || fb.feedbackType === typeFilter;
    const matchDiff = diffFilter === 'All' || fb.difficulty === diffFilter;
    return matchType && matchDiff;
  });

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">OA & Interview Experiences</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real feedback and assessment questions shared by seniors and peers.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 w-fit shrink-0"
        >
          <Plus size={15} />
          Share Your Experience
        </button>
      </div>

      {}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {companies.map(comp => (
          <button
            key={comp.key}
            onClick={() => setActiveCompany(comp.key)}
            className={`p-4 rounded-2xl border text-center transition-all duration-300 ${
              activeCompany === comp.key
                ? `${comp.color} ring-2 ring-indigo-500/20 scale-105 font-bold shadow-md`
                : 'border-slate-200 hover:border-slate-350 bg-white text-slate-600 dark:border-slate-800 dark:hover:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400 font-semibold'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center bg-white rounded-lg p-1 shadow-xs border border-slate-200/40">
                <img 
                  src={comp.logo} 
                  alt={`${comp.name} logo`} 
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-xs tracking-wide uppercase font-bold">{comp.name}</span>
            </div>
          </button>
        ))}
      </div>

      {}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-850">
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
          
          {}
          <div className="flex items-center gap-1 bg-slate-105 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-slate-400 mr-1.5 flex items-center gap-1"><Filter size={12} /> Stage:</span>
            {['All', 'OA', 'Interview'].map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  typeFilter === type
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {type === 'OA' ? 'OA' : type === 'Interview' ? 'Interview' : 'All'}
              </button>
            ))}
          </div>

          {}
          <div className="flex items-center gap-1 bg-slate-105 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-slate-400 mr-1.5 flex items-center gap-1"><Filter size={12} /> Level:</span>
            {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
              <button
                key={diff}
                onClick={() => setDiffFilter(diff)}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  diffFilter === diff
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

        </div>
        <span className="text-xs text-slate-400 font-semibold">
          Showing {filteredFeedbacks.length} experiences
        </span>
      </div>

      {}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-slate-100 dark:bg-slate-800/40 rounded-2xl animate-pulse" />
          <div className="h-48 bg-slate-100 dark:bg-slate-800/40 rounded-2xl animate-pulse" />
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="text-center py-20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 glass-panel">
          <div className="inline-flex items-center justify-center p-3.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-4">
            <MessageSquare size={26} />
          </div>
          <h4 className="text-base font-bold text-slate-850 dark:text-slate-200">No Match Found</h4>
          <p className="text-xs text-slate-450 dark:text-slate-500 max-w-sm mx-auto mt-1">
            No experiences match your active filters, or none have been shared yet for {activeCompany}. Be the first to add yours!
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-5 px-4 py-2 text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-500/15 transition-all"
          >
            Post Feedback
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-305">
          {filteredFeedbacks.map((fb) => (
            <div 
              key={fb._id} 
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 glass-panel shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                {}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm bg-gradient-to-tr ${
                      fb.isAnonymous 
                        ? 'from-slate-600 to-slate-800' 
                        : getRandomGradient(fb.user?.name || 'C')
                    }`}>
                      {fb.isAnonymous ? <Lock size={14} /> : (fb.user?.name ? fb.user.name.charAt(0) : 'U')}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                          {fb.isAnonymous ? 'Anonymous Candidate' : fb.user?.name || 'Unknown Candidate'}
                        </span>
                        {!fb.isAnonymous && (
                          <Award size={13} className="text-yellow-500 shrink-0" title="Verified Contributor" />
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {fb.term}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest ${
                    fb.feedbackType === 'OA' 
                      ? 'bg-rose-500/10 text-rose-500' 
                      : fb.feedbackType === 'Interview'
                      ? 'bg-cyan-500/10 text-cyan-500'
                      : 'bg-slate-500/10 text-slate-400'
                  }`}>
                    {fb.feedbackType}
                  </span>
                </div>

                {}
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="text-slate-900 dark:text-slate-200 font-bold bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded-md">
                    {fb.role}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-[10px]">Difficulty:</span>
                    <span className={`font-extrabold ${
                      fb.difficulty === 'Easy' ? 'text-emerald-500' :
                      fb.difficulty === 'Medium' ? 'text-amber-500' :
                      'text-rose-500'
                    }`}>
                      {fb.difficulty}
                    </span>
                  </div>
                </div>

                {}
                <p className="text-slate-600 dark:text-slate-350 text-xs leading-relaxed whitespace-pre-wrap">
                  {fb.content}
                </p>
              </div>

              {}
              {fb.topics && fb.topics.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/40 flex flex-wrap gap-1.5">
                  {fb.topics.map((tag, i) => (
                    <span 
                      key={i} 
                      className="flex items-center gap-1 text-[10px] bg-indigo-500/5 text-indigo-500 border border-indigo-500/10 px-2 py-0.5 rounded-md font-bold"
                    >
                      <Tag size={8} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-xl p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="absolute top-0 right-0 p-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white capitalize">
                Share hiring experience for {activeCompany}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Help other members of your college prepare by sharing actual topics or questions.
              </p>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Target Role *</label>
                  <input
                    type="text"
                    required
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    placeholder="e.g. SDE Intern, SDE-1"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Term / Year *</label>
                  <input
                    type="text"
                    required
                    value={termInput}
                    onChange={(e) => setTermInput(e.target.value)}
                    placeholder="e.g. Summer 2026, On-Campus 2025"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Process Stage *</label>
                  <select
                    value={typeInput}
                    onChange={(e) => setTypeInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-350"
                  >
                    <option value="OA">Online Assessment (OA)</option>
                    <option value="Interview">Technical Interview</option>
                    <option value="General">General Hiring Process</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Difficulty *</label>
                  <select
                    value={diffInput}
                    onChange={(e) => setDiffInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-350"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Topics Asked (Comma-separated)</label>
                <input
                  type="text"
                  value={topicsInput}
                  onChange={(e) => setTopicsInput(e.target.value)}
                  placeholder="e.g. Dynamic Programming, Graphs, DFS"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Details & Questions Asked *</label>
                <textarea
                  required
                  rows={4}
                  value={contentInput}
                  onChange={(e) => setContentInput(e.target.value)}
                  placeholder="Describe the rounds. Specify what topics/questions were asked, any coding constraints, and tips for preparation."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 resize-none text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="anonymous-checkbox"
                  checked={anonInput}
                  onChange={(e) => setAnonInput(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-350 dark:border-slate-805 text-indigo-650 focus:ring-indigo-500"
                />
                <label htmlFor="anonymous-checkbox" className="text-xs font-semibold text-slate-600 dark:text-slate-300 select-none cursor-pointer flex items-center gap-1.5">
                  <Lock size={12} className="text-slate-400" />
                  Post Anonymously (Hides your real name)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-755 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? 'Posting...' : 'Share Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
