import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { 
  Mic, 
  Sparkles, 
  Send, 
  RefreshCw, 
  CheckCircle,
  HelpCircle,
  FileText,
  Loader2
} from 'lucide-react';

export const MockInterview = () => {
  const [targetRole, setTargetRole] = useState('Software Engineer Intern');
  const [difficulty, setDifficulty] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [interviewSet, setInterviewSet] = useState('');
  
  const [userAnswers, setUserAnswers] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState('');

  const { addToast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    setEvaluationFeedback('');
    setUserAnswers('');
    try {
      const res = await axios.post('/api/ai/mock-interview', { targetRole, difficulty });
      if (res.data.success) {
        setInterviewSet(res.data.interviewSet);
        addToast('Mock interview generated!', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to generate mock interview questions.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!userAnswers.trim()) {
      addToast('Please type some answers to evaluate.', 'error');
      return;
    }

    setEvaluating(true);
    try {
      const res = await axios.post('/api/ai/evaluate-interview', {
        interviewSet,
        userAnswers
      });
      if (res.data.success) {
        setEvaluationFeedback(res.data.feedback);
        addToast('Evaluation report compiled successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Evaluation failed.', 'error');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-5xl mx-auto">
      
      <div>
        <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white flex items-center gap-3">
          <span className="p-2 bg-blue-600/10 text-blue-600 rounded-2xl">
            <Mic size={24} />
          </span>
          <span>AI Mock Interview Generator</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Simulate real technical and behavioral interview sessions tailored to your goals.</p>
      </div>

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 glass-panel shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div>
          <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">Target Role</label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-300 font-semibold"
          >
            <option value="Software Engineer Intern">Software Engineer Intern</option>
            <option value="Associate Software Engineer">Associate Software Engineer</option>
            <option value="Frontend Engineer">Frontend Engineer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Full Stack Architect">Full Stack Architect</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-300 font-semibold"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-55 rounded-xl shadow-lg shadow-blue-500/10 btn-transition"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              <Sparkles size={16} />
              <span>Forge Mock Interview</span>
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="h-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col items-center justify-center gap-3 animate-pulse">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <p className="text-sm text-slate-500 dark:text-slate-450 font-medium">Forging interview questionnaire set...</p>
        </div>
      ) : interviewSet ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 glass-panel shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <FileText size={18} className="text-indigo-500" />
              <span>Interview Questions Set</span>
            </h3>
            <div className="whitespace-pre-wrap text-sm text-slate-755 dark:text-slate-300 leading-relaxed font-sans bg-slate-50 dark:bg-slate-800/40 p-5 rounded-xl border border-slate-100 dark:border-slate-800 max-h-[500px] overflow-y-auto pr-1">
              {interviewSet}
            </div>
          </div>

          <div className="space-y-6">
            
            <form onSubmit={handleEvaluate} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 glass-panel shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
                <Send size={18} className="text-indigo-500" />
                <span>Submit Your Answers</span>
              </h3>
              <textarea
                value={userAnswers}
                onChange={(e) => setUserAnswers(e.target.value)}
                placeholder="Type your coding intuitions, fundamental concepts explanations and behavioral STAR responses here..."
                rows={8}
                required
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={evaluating}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-55 rounded-xl shadow-lg shadow-indigo-500/10 btn-transition"
              >
                {evaluating ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <CheckCircle size={16} />
                    <span>Evaluate My Answers</span>
                  </>
                )}
              </button>
            </form>

            {evaluationFeedback && (
              <div className="p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 glass-panel shadow-sm space-y-3 animate-pulse-soft">
                <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">AI Evaluation Report</h3>
                <div className="whitespace-pre-wrap text-sm text-slate-750 dark:text-slate-300 leading-relaxed font-sans pr-1">
                  {evaluationFeedback}
                </div>
              </div>
            )}

          </div>

        </div>
      ) : (
        <div className="p-16 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
            <HelpCircle size={22} />
          </div>
          <h3 className="font-bold text-slate-850 dark:text-slate-250">No Active Interview session</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            Select your role target and difficulty configuration to forge a simulated mock technical interview.
          </p>
        </div>
      )}

    </div>
  );
};

export default MockInterview;
