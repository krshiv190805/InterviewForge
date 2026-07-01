import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { HelpCircle, X, Loader2 } from 'lucide-react';

export const HintModal = ({ isOpen, onClose, problem }) => {
  const [loading, setLoading] = useState(false);
  const [hints, setHints] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen && problem) {
      const fetchHint = async () => {
        setLoading(true);
        try {
          const res = await axios.post('/api/ai/hint', {
            title: problem.title,
            topic: problem.topic,
            difficulty: problem.difficulty
          });
          if (res.data.success) {
            setHints(res.data.hints);
          }
        } catch (err) {
          console.error(err);
          addToast('Failed to generate hints. Please try again.', 'error');
          onClose();
        } finally {
          setLoading(false);
        }
      };

      fetchHint();
    }
  }, [isOpen, problem, onClose, addToast]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg glass-panel bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-2xl overflow-hidden animate-pulse-soft">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400">
            <HelpCircle size={22} />
            <h3 className="text-lg font-bold">AI Hint Generator</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-4">
            PROBLEM: <span className="text-slate-800 dark:text-slate-200 font-bold">{problem?.title}</span>
          </p>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="text-sm text-slate-500 dark:text-slate-400">Forging conceptual hints...</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              <div className="whitespace-pre-line text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                {hints}
              </div>
              <p className="text-[10px] text-center text-slate-400">
                💡 Try solving the problem on your own before looking at the optimal code solution.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 px-6 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-850"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default HintModal;
