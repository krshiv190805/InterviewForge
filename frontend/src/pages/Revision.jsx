import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { 
  Clock, 
  Sparkles, 
  ExternalLink,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const Revision = () => {
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDueToday, setFilterDueToday] = useState(true);
  
  const [activeRateRecord, setActiveRateRecord] = useState(null);
  const [qualityScore, setQualityScore] = useState(4);

  const { addToast } = useToast();
  const { refreshUser } = useAuth();

  const fetchRevisions = async () => {
    setLoading(true);
    try {
      const params = {
        due: filterDueToday ? 'true' : 'false'
      };
      const res = await axios.get('/api/revisions', { params });
      if (res.data.success) {
        setRevisions(res.data.revisions);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load revision deck.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevisions();
  }, [filterDueToday]);

  const handleRateSubmit = async (e) => {
    e.preventDefault();
    if (!activeRateRecord) return;

    try {
      const res = await axios.post('/api/revisions', {
        problemId: activeRateRecord.problem._id,
        quality: qualityScore
      });
      if (res.data.success) {
        addToast(`Revision rated! Next session scheduled in ${res.data.revision.interval} days.`, 'success');
        fetchRevisions();
        refreshUser();
        setActiveRateRecord(null);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to submit revision quality rating.', 'error');
    }
  };

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-6xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white flex items-center gap-3">
            <span className="p-2 bg-blue-600/10 text-blue-600 rounded-2xl">
              <Clock size={24} />
            </span>
            <span>Revision Planner (SM-2)</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Spaced repetition schedules designed to reinforce algorithmic problem patterns.</p>
        </div>

        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start sm:self-center">
          <button
            onClick={() => setFilterDueToday(true)}
            className={`text-xs px-4 py-2 rounded-lg font-bold transition-all ${
              filterDueToday
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200'
            }`}
          >
            Due Today
          </button>
          <button
            onClick={() => setFilterDueToday(false)}
            className={`text-xs px-4 py-2 rounded-lg font-bold transition-all ${
              !filterDueToday
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200'
            }`}
          >
            All Scheduled
          </button>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 glass-panel shadow-sm overflow-hidden">
        {loading ? (
          <SkeletonLoader type="table" count={4} />
        ) : revisions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 pb-3 text-slate-450 text-xs font-bold uppercase tracking-wider">
                  <th className="pb-3 pr-4">Problem Name</th>
                  <th className="pb-3 px-4">Next Session</th>
                  <th className="pb-3 px-4">Interval</th>
                  <th className="pb-3 px-4">Repetitions</th>
                  <th className="pb-3 px-4">Ease Factor</th>
                  <th className="pb-3 pl-4 text-right">Rating Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm font-semibold">
                {revisions.map((rev) => {
                  const isDue = new Date(rev.nextRevisionDate) <= new Date();
                  return (
                    <tr key={rev._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white leading-tight">{rev.problem?.title}</span>
                          {rev.problem?.link && (
                            <a href={rev.problem.link} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors shrink-0">
                              <ExternalLink size={13} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`flex items-center gap-1.5 text-xs font-bold ${
                          isDue ? 'text-rose-500' : 'text-slate-550 dark:text-slate-400'
                        }`}>
                          <Calendar size={13} />
                          <span>{new Date(rev.nextRevisionDate).toLocaleDateString()}</span>
                          {isDue && <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 uppercase tracking-wide">Due</span>}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-500 dark:text-slate-450">{rev.interval} {rev.interval === 1 ? 'day' : 'days'}</td>
                      <td className="py-4 px-4">
                        <span className="flex items-center gap-1.5">
                          <Layers size={13} className="text-slate-400" />
                          <span>{rev.repetitions}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-500 dark:text-slate-450">{Number(rev.easeFactor).toFixed(2)}</td>
                      <td className="py-4 pl-4 text-right">
                        <button
                          onClick={() => { setActiveRateRecord(rev); setQualityScore(4); }}
                          className={`text-xs px-3 py-1.5 rounded-xl font-bold bg-indigo-650/10 text-indigo-500 hover:bg-indigo-650 hover:text-white transition-colors border border-indigo-500/20 shadow-sm`}
                        >
                          Rate Recall
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center text-slate-450 mb-4 border border-slate-200 dark:border-slate-800">
              <Clock size={20} />
            </div>
            <h3 className="font-bold text-slate-850 dark:text-slate-200">No revisions found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              {filterDueToday 
                ? 'Great work! You have no outstanding revisions due today.' 
                : 'No problems have been scheduled in the spaced repetition planner yet. Go to your Tracker and rate a solved problem.'}
            </p>
          </div>
        )}
      </div>

      {activeRateRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md glass-panel bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-2xl p-6 overflow-hidden">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
              <Sparkles size={20} className="text-indigo-500" />
              <span>Submit Recall Rating</span>
            </h3>
            <p className="text-xs text-slate-550 dark:text-slate-405 mt-2 leading-relaxed">
              Submit your recall rating for **{activeRateRecord.problem?.title}** to update its next schedule date:
            </p>

            <div className="my-6 space-y-3">
              {[
                { score: 5, desc: 'Perfect: Instant solution with absolute clarity.' },
                { score: 4, desc: 'Good: Solved with minor hesitation/effort.' },
                { score: 3, desc: 'Fair: Solved with significant recall effort.' },
                { score: 2, desc: 'Hard: Solved after viewing partial hints.' },
                { score: 1, desc: 'Failed: Could not recall code logic at all.' }
              ].map(opt => (
                <label 
                  key={opt.score} 
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors ${
                    qualityScore === opt.score 
                      ? 'border-indigo-500/60 bg-indigo-500/5 text-indigo-700 dark:text-indigo-455' 
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="quality"
                    value={opt.score}
                    checked={qualityScore === opt.score}
                    onChange={() => setQualityScore(opt.score)}
                    className="mt-1 accent-indigo-650"
                  />
                  <div>
                    <span className="text-xs font-bold">Quality {opt.score}</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button
                onClick={() => setActiveRateRecord(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRateSubmit}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/10 btn-transition"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Revision;
