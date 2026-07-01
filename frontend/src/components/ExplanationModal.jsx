import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { Sparkles, X, Loader2, ArrowUpRight } from 'lucide-react';

export const ExplanationModal = ({ isOpen, onClose, problem }) => {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen && problem) {
      const fetchExplanation = async () => {
        setLoading(true);
        try {
          const res = await axios.post('/api/ai/explanation', {
            title: problem.title,
            topic: problem.topic,
            difficulty: problem.difficulty
          });
          if (res.data.success) {
            setExplanation(res.data.explanation);
          }
        } catch (err) {
          console.error(err);
          addToast('Failed to generate explanation. Please try again.', 'error');
          onClose();
        } finally {
          setLoading(false);
        }
      };

      fetchExplanation();
    }
  }, [isOpen, problem, onClose, addToast]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl glass-panel bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-2xl overflow-hidden animate-pulse-soft flex flex-col max-h-[85vh]">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400">
            <Sparkles size={22} />
            <h3 className="text-lg font-bold">AI Explanation Generator</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-4 mb-4">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">DSA Problem</p>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">{problem?.title}</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                problem?.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                problem?.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}>{problem?.difficulty}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">{problem?.topic}</span>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin text-indigo-600" size={32} />
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Forging deep conceptual insights & complexities...</p>
            </div>
          ) : (
            <div className="space-y-4 pr-1">
              <div className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans bg-slate-50 dark:bg-slate-800/40 p-5 rounded-xl border border-slate-100 dark:border-slate-800">
                {explanation}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-4 px-6 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 shrink-0">
          {problem?.link ? (
            <a
              href={problem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold"
            >
              <span>Solve on Leetcode</span>
              <ArrowUpRight size={14} />
            </a>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/10 btn-transition"
          >
            Got it, thanks!
          </button>
        </div>

      </div>
    </div>
  );
};

export default ExplanationModal;
