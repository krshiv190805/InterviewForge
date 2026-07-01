import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListTodo, 
  Building2, 
  CalendarRange, 
  Mic, 
  Clock, 
  FileText, 
  X,
  MessageSquare
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'DSA Tracker', path: '/problems', icon: ListTodo },
    { name: 'Company Sheets', path: '/sheets', icon: Building2 },
    { name: 'OA Feedback', path: '/oa-feedback', icon: MessageSquare },
    { name: 'AI Study Planner', path: '/study-planner', icon: CalendarRange },
    { name: 'AI Mock Interview', path: '/mock-interview', icon: Mic },
    { name: 'Revision Planner', path: '/revision', icon: Clock },
    { name: 'Notes Module', path: '/notes', icon: FileText },
  ];

  return (
    <>
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 glass-panel border-r border-slate-200/50 dark:border-slate-800/50 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:h-[calc(100vh-65px)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-slate-200/50 dark:border-slate-800/50">
          <span className="font-bold text-slate-800 dark:text-slate-200">Navigation</span>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/10'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/10 text-center">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Ready to Forge?</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Keep solving to hit your daily goal!</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
