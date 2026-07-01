import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { HintModal } from '../components/HintModal';
import { ExplanationModal } from '../components/ExplanationModal';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Sparkles, 
  HelpCircle, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  RefreshCw,
  FolderDot
} from 'lucide-react';

export const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProblems, setTotalProblems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [status, setStatus] = useState('');
  const [topic, setTopic] = useState('');
  const [company, setCompany] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [titleInput, setTitleInput] = useState('');
  const [difficultyInput, setDifficultyInput] = useState('Medium');
  const [topicInput, setTopicInput] = useState('');
  const [statusInput, setStatusInput] = useState('Todo');
  const [companiesInput, setCompaniesInput] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [codeSolutionInput, setCodeSolutionInput] = useState('');

  const [activeHintProblem, setActiveHintProblem] = useState(null);
  const [activeExplainProblem, setActiveExplainProblem] = useState(null);

  const [activeRevisionProblem, setActiveRevisionProblem] = useState(null);
  const [qualityScore, setQualityScore] = useState(4);

  const { addToast } = useToast();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // reset to page 1 on search change
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        search: debouncedSearch,
        difficulty,
        status,
        topic,
        company
      };
      
      const res = await axios.get('/api/problems', { params });
      if (res.data.success) {
        setProblems(res.data.problems);
        setTotalProblems(res.data.totalProblems);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to fetch problems.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [currentPage, debouncedSearch, difficulty, status, topic, company]);

  const resetForm = () => {
    setEditingId(null);
    setTitleInput('');
    setDifficultyInput('Medium');
    setTopicInput('');
    setStatusInput('Todo');
    setCompaniesInput('');
    setLinkInput('');
    setNotesInput('');
    setCodeSolutionInput('');
  };

  const handleStatusToggle = async (problemId, currentStatus) => {
    let nextStatus = 'Todo';
    if (currentStatus === 'Todo') nextStatus = 'Attempted';
    else if (currentStatus === 'Attempted') nextStatus = 'Solved';
    else nextStatus = 'Todo';

    try {
      const res = await axios.put(`/api/problems/${problemId}`, { status: nextStatus });
      if (res.data.success) {
        addToast(`Problem marked as ${nextStatus}`, 'success');
        setProblems(prev => prev.map(p => p._id === problemId ? { ...p, status: nextStatus } : p));
        refreshUser();
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to update problem status.', 'error');
    }
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (problem) => {
    setEditingId(problem._id);
    setTitleInput(problem.title);
    setDifficultyInput(problem.difficulty);
    setTopicInput(problem.topic);
    setStatusInput(problem.status);
    setCompaniesInput(problem.companies.join(', '));
    setLinkInput(problem.link || '');
    setNotesInput(problem.notes || '');
    setCodeSolutionInput(problem.codeSolution || '');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!titleInput || !difficultyInput || !topicInput) {
      addToast('Please fill in title, difficulty, and topic', 'error');
      return;
    }

    const payload = {
      title: titleInput,
      difficulty: difficultyInput,
      topic: topicInput,
      status: statusInput,
      companies: companiesInput.split(',').map(c => c.trim()).filter(c => c !== ''),
      link: linkInput,
      notes: notesInput,
      codeSolution: codeSolutionInput
    };

    try {
      if (editingId) {
        const res = await axios.put(`/api/problems/${editingId}`, payload);
        if (res.data.success) {
          addToast('Problem updated successfully', 'success');
          if (statusInput === 'Solved' && res.data.problem.status !== problems.find(p => p._id === editingId)?.status) {
            setActiveRevisionProblem(res.data.problem);
          }
        }
      } else {
        const res = await axios.post('/api/problems', payload);
        if (res.data.success) {
          addToast('Problem added successfully', 'success');
          if (statusInput === 'Solved') {
            setActiveRevisionProblem(res.data.problem);
          }
        }
      }
      setIsFormOpen(false);
      resetForm();
      fetchProblems();
      refreshUser();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to save problem.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this problem?')) return;

    try {
      const res = await axios.delete(`/api/problems/${id}`);
      if (res.data.success) {
        addToast('Problem removed from tracker', 'success');
        fetchProblems();
        refreshUser();
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to delete problem.', 'error');
    }
  };

  const handleScheduleRevision = async () => {
    if (!activeRevisionProblem) return;

    try {
      const res = await axios.post('/api/revisions', {
        problemId: activeRevisionProblem._id,
        quality: qualityScore
      });
      if (res.data.success) {
        addToast(`Problem scheduled for revision in ${res.data.revision.interval} days.`, 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to schedule revision.', 'error');
    } finally {
      setActiveRevisionProblem(null);
    }
  };

  return (
    <div className="space-y-6 p-6 md:p-8 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">DSA Problem Tracker</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and track your algorithmic challenge completions.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 p-3 px-5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-500/10 btn-transition"
        >
          <Plus size={16} />
          <span>Add Custom Problem</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 glass-panel shadow-sm">
        
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems by title..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <select
          value={difficulty}
          onChange={(e) => { setDifficulty(e.target.value); setCurrentPage(1); }}
          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-300"
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setCurrentPage(1); }}
          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-300"
        >
          <option value="">All Statuses</option>
          <option value="Todo">Todo</option>
          <option value="Attempted">Attempted</option>
          <option value="Solved">Solved</option>
        </select>

      </div>

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 glass-panel shadow-sm overflow-hidden">
        {loading ? (
          <SkeletonLoader type="table" count={5} />
        ) : problems.length > 0 ? (
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 pb-3 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-3 pr-4">Title</th>
                    <th className="pb-3 px-4">Difficulty</th>
                    <th className="pb-3 px-4">Topic</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4">Companies</th>
                    <th className="pb-3 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm font-semibold">
                  {problems.map((problem) => (
                    <tr key={problem._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-950 dark:text-white leading-tight">{problem.title}</span>
                          {problem.link && (
                            <a href={problem.link} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors shrink-0">
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                          problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                          'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-400">{problem.topic}</td>
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
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {problem.companies.slice(0, 2).map((c, i) => (
                            <span key={i} className="text-[10px] bg-indigo-500/5 text-indigo-500 border border-indigo-500/10 px-1.5 py-0.5 rounded">
                              {c}
                            </span>
                          ))}
                          {problem.companies.length > 2 && (
                            <span className="text-[10px] text-slate-400 font-medium px-1">
                              +{problem.companies.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActiveHintProblem(problem)}
                            className="p-2 text-slate-500 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                            title="Get AI Hints"
                          >
                            <HelpCircle size={17} />
                          </button>

                          <button
                            onClick={() => setActiveExplainProblem(problem)}
                            className="p-2 text-slate-500 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                            title="Get AI Explanation"
                          >
                            <Sparkles size={17} />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(problem)}
                            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                            title="Edit problem"
                          >
                            <Edit3 size={17} />
                          </button>

                          <button
                            onClick={() => handleDelete(problem._id)}
                            className="p-2 text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                            title="Delete problem"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-6 pt-4 shrink-0">
                <span className="text-xs text-slate-400">
                  Showing page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span> ({totalProblems} problems total)
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-150 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400 disabled:opacity-30"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-150 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400 disabled:opacity-30"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-600 mb-4 border border-slate-200/50 dark:border-slate-800">
              <FolderDot size={22} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-250">No problems found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">There are no tracked problems matching these filters. Try adding a new custom problem.</p>
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form onSubmit={handleFormSubmit} className="w-full max-w-lg glass-panel bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-2xl overflow-hidden animate-pulse-soft flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                {editingId ? 'Edit Tracked Problem' : 'Track New DSA Problem'}
              </h3>
              <button 
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Problem Title *</label>
                <input
                  type="text"
                  required
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="e.g. 3Sum, Reverse Tree, LRU Cache"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Difficulty *</label>
                  <select
                    value={difficultyInput}
                    onChange={(e) => setDifficultyInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-350"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Progress Status</label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-350"
                  >
                    <option value="Todo">Todo</option>
                    <option value="Attempted">Attempted</option>
                    <option value="Solved">Solved</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Topic / Category *</label>
                  <input
                    type="text"
                    required
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="e.g. Binary Search, DP, Tree"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Companies (Comma separated)</label>
                  <input
                    type="text"
                    value={companiesInput}
                    onChange={(e) => setCompaniesInput(e.target.value)}
                    placeholder="e.g. Google, Amazon, Cisco"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">External Link URL</label>
                <input
                  type="url"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="e.g. https://leetcode.com/problems/..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Key Intuition & Notes</label>
                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Write code strategies, dry run steps or complexities..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Your Code Solution</label>
                <textarea
                  value={codeSolutionInput}
                  onChange={(e) => setCodeSolutionInput(e.target.value)}
                  placeholder="Paste your clean C++/Java/Python/JS code solution here..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-slate-950 text-slate-100 font-mono rounded-xl text-xs focus:outline-none focus:border-blue-500 border border-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 px-6 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold rounded-xl text-slate-700 hover:bg-slate-200 dark:text-slate-355 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 btn-transition"
              >
                {editingId ? 'Save Changes' : 'Track Problem'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeRevisionProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md glass-panel bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-2xl p-6 overflow-hidden">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
              <Sparkles size={20} className="text-indigo-500" />
              <span>Schedule Spaced Repetition</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              You marked **{activeRevisionProblem.title}** as Solved! Schedule the next revision interval by rating your retrieval ease quality:
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
                      ? 'border-indigo-500/60 bg-indigo-500/5 text-indigo-700 dark:text-indigo-400' 
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
                onClick={() => setActiveRevisionProblem(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                Skip Schedule
              </button>
              <button
                onClick={handleScheduleRevision}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/10 btn-transition"
              >
                Schedule Revision
              </button>
            </div>
          </div>
        </div>
      )}

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

export default Problems;
