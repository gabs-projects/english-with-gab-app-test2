
import React from 'react';
import { User } from '../types';
import { INITIAL_USERS } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="max-w-md mx-auto mt-20 font-sans">
      <div className="bg-white dark:bg-gab-indigo p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="text-center mb-8">
          <div className="w-16 h-16 brand-logo-bg rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
            G
          </div>
          <h2 className="text-2xl font-bold text-gab-indigo dark:text-gab-gold mb-2">Bem-vindo(a) de volta</h2>
          <p className="text-slate-500 dark:text-slate-400">Escolha um perfil para entrar no portal</p>
        </div>

        <div className="space-y-4">
          {INITIAL_USERS.map((u) => (
            <button
              key={u.id}
              onClick={() => onLogin(u)}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-gab-deep/50 hover:border-gab-blue transition-all group"
            >
              <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full border-2 border-transparent group-hover:border-gab-blue transition-colors" />
              <div className="text-left">
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{u.role === 'teacher' ? 'Professora' : 'Aluno'}</p>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gab-blue" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
