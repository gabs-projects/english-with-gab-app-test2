
import React, { useState } from 'react';
import { User } from '../types';

interface ProfilePageProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState<User>({ ...user });
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-300 font-sans">
      <div className="bg-white dark:bg-gab-indigo rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="h-32 bg-gab-gradient"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6 flex justify-between items-end">
            <div className="relative group">
              <img 
                src={formData.avatar} 
                className="w-32 h-32 rounded-3xl border-4 border-white dark:border-gab-indigo object-cover shadow-lg"
              />
              {isEditing && (
                <button 
                  className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    const url = prompt("Cole a URL da nova foto de perfil:");
                    if (url) setFormData({...formData, avatar: url});
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}
            </div>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-slate-50 dark:bg-gab-deep/40 px-6 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm hover:border-gab-blue transition-all dark:text-white"
              >
                Editar Perfil
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 text-slate-400 dark:text-white/60 font-bold text-sm"
                >
                  Descartar
                </button>
                <button 
                  onClick={handleSubmit}
                  className="bg-gab-blue text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md"
                >
                  Salvar
                </button>
              </div>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold dark:text-white">{user.name}</h2>
                <p className="text-slate-500 dark:text-white/70 capitalize">{user.role === 'teacher' ? 'Professora' : 'Estudante de Inglês'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-gab-deep/30 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest mb-1">Email</p>
                  <p className="font-medium dark:text-white">{user.email}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-gab-deep/30 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest mb-1">Telefone</p>
                  <p className="font-medium dark:text-white">{user.phone || 'Não informado'}</p>
                </div>
              </div>

              {user.bio && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-gab-deep/30 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest mb-1">Bio</p>
                  <p className="text-slate-600 dark:text-white">{user.bio}</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 dark:text-white/60 uppercase">Nome Completo</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:bg-gab-deep dark:border-slate-800 dark:text-white focus:ring-2 focus:ring-gab-blue outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 dark:text-white/60 uppercase">Email</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:bg-gab-deep dark:border-slate-800 dark:text-white focus:ring-2 focus:ring-gab-blue outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 dark:text-white/60 uppercase">Telefone</label>
                  <input 
                    type="text" 
                    value={formData.phone || ''}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="+55 (00) 00000-0000"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:bg-gab-deep dark:border-slate-800 dark:text-white focus:ring-2 focus:ring-gab-blue outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 dark:text-white/60 uppercase">Cargo</label>
                  <input 
                    type="text" 
                    value={formData.role}
                    disabled
                    className="w-full p-3 rounded-xl border border-slate-200 dark:bg-gab-deep dark:border-slate-800 dark:text-white/40 opacity-50 cursor-not-allowed" 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 dark:text-white/60 uppercase">Bio</label>
                <textarea 
                  value={formData.bio || ''}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:bg-gab-deep dark:border-slate-800 dark:text-white focus:ring-2 focus:ring-gab-blue outline-none min-h-[100px]" 
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
