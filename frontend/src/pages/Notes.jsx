import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { 
  FileText, 
  Pin, 
  Trash2, 
  Edit3, 
  Search, 
  Plus, 
  X, 
  FolderLock,
  Tag
} from 'lucide-react';

export const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const { addToast } = useToast();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 450);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = {
        search: debouncedSearch,
        tag: selectedTag
      };
      const res = await axios.get('/api/notes', { params });
      if (res.data.success) {
        setNotes(res.data.notes);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load notes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [debouncedSearch, selectedTag]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setTagsInput('');
    setIsPinned(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setTagsInput(note.tags.join(', '));
    setIsPinned(note.isPinned);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      addToast('Please enter title and content', 'error');
      return;
    }

    const payload = {
      title,
      content,
      tags: tagsInput.split(',').map(t => t.trim()).filter(t => t !== ''),
      isPinned
    };

    try {
      if (editingId) {
        const res = await axios.put(`/api/notes/${editingId}`, payload);
        if (res.data.success) {
          addToast('Note updated successfully', 'success');
        }
      } else {
        const res = await axios.post('/api/notes', payload);
        if (res.data.success) {
          addToast('Note created successfully', 'success');
        }
      }
      setIsFormOpen(false);
      fetchNotes();
    } catch (err) {
      console.error(err);
      addToast('Failed to save note.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      const res = await axios.delete(`/api/notes/${id}`);
      if (res.data.success) {
        addToast('Note deleted', 'success');
        fetchNotes();
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to delete note.', 'error');
    }
  };

  const handleTogglePin = async (id) => {
    try {
      const res = await axios.put(`/api/notes/${id}/pin`);
      if (res.data.success) {
        fetchNotes();
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to pin note.', 'error');
    }
  };

  const allTags = Array.from(
    new Set(notes.flatMap(n => n.tags))
  );

  return (
    <div className="space-y-6 p-6 md:p-8 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white flex items-center gap-3">
            <span className="p-2 bg-blue-600/10 text-blue-600 rounded-2xl">
              <FileText size={24} />
            </span>
            <span>Developer Notes</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Document design patterns, notes, and pseudocodes.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 p-3 px-5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-500/10 btn-transition animate-pulse-soft"
        >
          <Plus size={16} />
          <span>Add Custom Note</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes content..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center justify-start w-full md:w-auto">
            <span className="text-xs text-slate-450 font-bold uppercase tracking-wider mr-1">Tags:</span>
            <button
              onClick={() => setSelectedTag('')}
              className={`text-xs px-3 py-1 rounded-full border font-semibold ${
                selectedTag === ''
                  ? 'bg-blue-500/10 text-blue-600 border-blue-500/25 font-bold shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 dark:text-slate-400'
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-xs px-3 py-1 rounded-full border font-semibold ${
                  selectedTag === tag
                    ? 'bg-blue-500/10 text-blue-600 border-blue-500/25 font-bold shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-650 hover:bg-slate-50 dark:text-slate-450'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

      </div>

      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map(note => (
            <div 
              key={note._id} 
              className={`p-6 rounded-2xl border bg-white dark:bg-slate-900/60 glass-panel shadow-sm flex flex-col justify-between gap-4 hover:border-slate-350 dark:hover:border-slate-700 transition-colors relative group overflow-hidden ${
                note.isPinned ? 'border-indigo-500/35 bg-indigo-500/5' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <button
                onClick={() => handleTogglePin(note._id)}
                className={`absolute top-4 right-4 p-1.5 rounded-lg border transition-all ${
                  note.isPinned 
                    ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/25' 
                    : 'bg-slate-500/5 text-slate-400 border-transparent opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={note.isPinned ? 'Unpin note' : 'Pin note'}
              >
                <Pin size={14} className={note.isPinned ? 'fill-indigo-500' : ''} />
              </button>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-950 dark:text-white pr-6 leading-tight">{note.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap max-h-32 overflow-hidden text-ellipsis">
                  {note.content}
                </p>
              </div>

              <div className="space-y-3 shrink-0">
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((t, i) => (
                      <span key={i} className="text-[9px] font-bold bg-indigo-500/5 text-indigo-500 border border-indigo-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Tag size={8} />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/40 pt-3">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Updated: {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(note)}
                      className="p-1.5 text-slate-450 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                      title="Edit note"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="p-1.5 text-slate-450 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                      title="Delete note"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
            <FileText size={22} />
          </div>
          <h3 className="font-bold text-slate-850 dark:text-slate-250">No notes found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            Create a note using the creator panel on the top-right to track patterns and algorithms solutions.
          </p>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form onSubmit={handleFormSubmit} className="w-full max-w-lg glass-panel bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-2xl overflow-hidden animate-pulse-soft flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                {editingId ? 'Edit Developer Note' : 'Create Custom Note'}
              </h3>
              <button 
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-650"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Note Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Kadanes Algorithm concept, Graph DFS template"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Note Content *</label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Document core logic, pseudocode, dry run steps or hints..."
                  rows={6}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. Arrays, Graph, Sorting"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <label className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 cursor-pointer font-bold text-xs">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="accent-indigo-650 cursor-pointer"
                />
                <span>Pin this note to the top of dashboard listings</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 p-4 px-6 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold rounded-xl text-slate-700 hover:bg-slate-200 dark:text-slate-350 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 btn-transition"
              >
                {editingId ? 'Save Changes' : 'Create Note'}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};

export default Notes;
