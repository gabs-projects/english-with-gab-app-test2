
import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { User } from '../types';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
  darkMode: boolean;
  toggleTheme: () => void;
  canInstall?: boolean;
  onInstall?: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ 
  user, 
  onLogout, 
  darkMode, 
  toggleTheme, 
  canInstall, 
  onInstall, 
  children 
}) => {
  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gab-deep/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 brand-logo-bg rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                G
              </div>
              <h1 className="text-xl font-serif font-bold tracking-tight text-gab-indigo dark:text-white hidden xs:block">
                English With Gab
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Botão de Instalar App - Visível apenas se instalável */}
              {canInstall && (
                <button
                  onClick={onInstall}
                  className="flex items-center gap-2 bg-gab-blue hover:bg-gab-purple text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20 animate-bounce"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="hidden sm:inline">Instalar App</span>
                </button>
              )}

              <ThemeToggle darkMode={darkMode} toggle={toggleTheme} />
              
              {user && (
                <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-200 dark:border-slate-800">
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium dark:text-white">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-white/70 capitalize">{user.role}</p>
                  </div>
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-gab-blue object-cover" />
                  <button 
                    onClick={onLogout}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Sair"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white dark:bg-gab-indigo/20 border-t border-slate-200 dark:border-slate-800 py-8 text-center text-sm text-slate-500 dark:text-white/50">
        <p>© {new Date().getFullYear()} English With Gab. All rights reserved.</p>
      </footer>
    </div>
  );
};
