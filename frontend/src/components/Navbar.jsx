import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, Flame, Menu } from 'lucide-react';

export const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/50 dark:border-slate-800/50 px-4 md:px-8 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 lg:hidden"
        >
          <Menu size={22} />
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚒️</span>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent brand-font">
            InterviewForge
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {user && (
          <div className="flex items-center gap-4 mr-2 md:mr-4">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-semibold" title="Daily streak">
              <Flame size={15} fill="currentColor" />
              <span>{user.streak} Days</span>
            </div>

            <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-300">
              Hi, <span className="text-blue-600 dark:text-blue-400">{user.name}</span>
            </span>
          </div>
        )}

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {user && (
          <button
            onClick={logout}
            className="flex items-center gap-2 p-2 px-3 rounded-xl border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 transition-colors text-sm font-semibold"
            title="Log Out"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Logout</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
