import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { HintModal } from '../components/HintModal';
import { ExplanationModal } from '../components/ExplanationModal';
import { 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ExternalLink, 
  CircleDot
} from 'lucide-react';

export const CompanySheets = () => {
  const companies = [
    { key: 'google', name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg', color: 'border-blue-500 bg-blue-500/5 text-blue-500' },
    { key: 'amazon', name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg', color: 'border-orange-500 bg-orange-500/5 text-orange-500' },
    { key: 'microsoft', name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Microsoft_icon.svg', color: 'border-teal-500 bg-teal-500/5 text-teal-500' },
    { key: 'cisco', name: 'Cisco', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Cisco_logo.svg', color: 'border-cyan-500 bg-cyan-500/5 text-cyan-550' },
    { key: 'adobe', name: 'Adobe', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Adobe_Creative_Cloud_rainbow_icon.svg', color: 'border-rose-500 bg-rose-500/5 text-rose-500' },
    { key: 'uber', name: 'Uber', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png', color: 'border-slate-400 bg-slate-500/5 text-slate-400' }
  ];

  const [activeCompany, setActiveCompany] = useState('google');
  const [sheetData, setSheetData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeHintProblem, setActiveHintProblem] = useState(null);
  const [activeExplainProblem, setActiveExplainProblem] = useState(null);

  const { addToast } = useToast();
  const { refreshUser } = useAuth();

  const fetchSheet = async (companyKey) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/sheets/${companyKey}`);
      if (res.data.success) {
        setSheetData(res.data);
      }
    } catch (err) {
      console.error(err);
      addToast(`Failed to load ${companyKey} sheet data.`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheet(activeCompany);
  }, [activeCompany]);

  const handleStatusToggle = async (problemId, currentStatus) => {
    let nextStatus = 'Todo';
    if (currentStatus === 'Todo') nextStatus = 'Attempted';
    else if (currentStatus === 'Attempted') nextStatus = 'Solved';
    else nextStatus = 'Todo';

    try {
      const res = await axios.put(`/api/problems/${problemId}`, { status: nextStatus });
      if (res.data.success) {
        addToast(`Problem marked as ${nextStatus}`, 'success');
        
        setSheetData(prev => {
          if (!prev) return null;
          const updatedProblems = prev.problems.map(p => 
            p._id === problemId ? { ...p, status: nextStatus } : p
          );
          
          const total = updatedProblems.length;
          const solved = updatedProblems.filter(p => p.status === 'Solved').length;
          const attempted = updatedProblems.filter(p => p.status === 'Attempted').length;
          const todo = updatedProblems.filter(p => p.status === 'Todo').length;

          return {
            ...prev,
            progress: {
              total,
              solved,
              attempted,
              todo,
              percentSolved: Math.round((solved / total) * 100)
            },
            problems: updatedProblems
          };
        });

        refreshUser();
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to update problem status.', 'error');
    }
  };

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
      
      <div>
        <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">Curated Company Sheets</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Frequently asked interview questions for top tech firms.</p>
      </div>

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

      {loading ? (
        <div className="space-y-6">
          <div className="h-40 bg-slate-250 dark:bg-slate-850 rounded-2xl animate-pulse" />
          <SkeletonLoader type="table" count={4} />
        </div>
      ) : sheetData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 glass-panel shadow-sm overflow-hidden h-fit">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 shrink-0">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                {sheetData.company} Prep Questions
              </h3>
              <span className="text-xs text-slate-400 font-medium">Click status to cycle through Todo ➜ Attempted ➜ Solved</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 pb-2.5 text-slate-400 text-xs font-bold uppercase">
                    <th className="pb-3 pr-4">Problem</th>
                    <th className="pb-3 px-4">Difficulty</th>
                    <th className="pb-3 px-4">Topic</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 pl-4 text-right">Helpers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm font-semibold">
                  {sheetData.problems.map((problem) => (
                    <tr key={problem._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white leading-tight">{problem.title}</span>
                          {problem.link && (
                            <a href={problem.link} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors">
                              <ExternalLink size={13} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                          problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                          'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-500 dark:text-slate-400">{problem.topic}</td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleStatusToggle(problem._id, problem.status)}
                          className={`text-xs px-2.5 py-1 rounded-xl font-bold select-none border transition-colors ${
                            problem.status === 'Solved' 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25' 
                              : problem.status === 'Attempted'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25'
                              : 'bg-slate-500/5 text-slate-500 dark:text-slate-400 border-slate-700/10 dark:border-slate-800'
                          }`}
                        >
                          {problem.status}
                        </button>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActiveHintProblem(problem)}
                            className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                            title="Get AI Hint"
                          >
                            <HelpCircle size={15} />
                          </button>
                          <button
                            onClick={() => setActiveExplainProblem(problem)}
                            className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                            title="Get AI Explanation"
                          >
                            <Sparkles size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          <div className="space-y-6">
            
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 glass-panel shadow-sm text-center">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">Your Completion Stats</h3>
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-indigo-500/5 mb-3 border border-indigo-500/10">
                <CheckCircle2 size={24} className="text-indigo-500" />
              </div>
              <div className="mt-2">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  {sheetData.progress.percentSolved}%
                </span>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Solved Percentage</p>
              </div>

              <div className="mt-6 space-y-3.5 text-left text-xs font-semibold">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/40 pb-2 text-slate-650 dark:text-slate-400">
                  <span>Solved Problems</span>
                  <span className="text-emerald-500 font-bold">{sheetData.progress.solved} / {sheetData.progress.total}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/40 pb-2 text-slate-650 dark:text-slate-400">
                  <span>Attempting</span>
                  <span className="text-amber-500 font-bold">{sheetData.progress.attempted}</span>
                </div>
                <div className="flex items-center justify-between text-slate-650 dark:text-slate-400">
                  <span>Todo List</span>
                  <span className="text-slate-500 font-bold">{sheetData.progress.todo}</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 glass-panel shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-850 dark:text-slate-200">Topic Distribution</h3>
                <CircleDot className="text-indigo-500" size={18} />
              </div>
              <div className="space-y-3.5">
                {sheetData.topicDistribution.map(dist => (
                  <div key={dist.topic} className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-650 dark:text-slate-350">{dist.topic}</span>
                    <span className="text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold">
                      {dist.count} {dist.count === 1 ? 'problem' : 'problems'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : null}

      <HintModal 
        isOpen={!!activeHintProblem} 
        onClose={() => setActiveHintProblem(null)} 
        problem={activeHintProblem} 
      />

      <ExplanationModal
        isOpen={!!activeExplainProblem}
        onClose={() => setActiveExplainProblem(null)}
        problem={activeExplainProblem}
      />

    </div>
  );
};

export default CompanySheets;
