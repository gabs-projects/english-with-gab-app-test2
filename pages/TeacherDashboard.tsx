
import React, { useState } from 'react';
import { Activity, Submission, User, Message, CalendarEvent } from '../types';
import { INITIAL_USERS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChatComponent } from '../components/ChatComponent';
import { CalendarView } from '../components/CalendarView';
import { ProfilePage } from './ProfilePage';

interface TeacherDashboardProps {
  currentUser: User;
  activities: Activity[];
  submissions: Submission[];
  messages: Message[];
  events: CalendarEvent[];
  onAddActivity: (act: Activity) => void;
  onViewSubmission: (sub: Submission) => void;
  onSendMessage: (text: string, receiverId: string) => void;
  onAddEvent: (evt: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
  onUpdateProfile: (u: User) => void;
}

type Tab = 'overview' | 'grades' | 'create' | 'chat' | 'calendar' | 'profile';

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
  currentUser,
  activities, 
  submissions, 
  messages,
  events,
  onAddActivity, 
  onViewSubmission,
  onSendMessage,
  onAddEvent,
  onDeleteEvent,
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const students = INITIAL_USERS.filter(u => u.role === 'student');
  const performanceData = students.map(student => {
    const studentSubmissions = submissions.filter(s => s.studentId === student.id);
    const avgScore = studentSubmissions.length > 0 
      ? Math.round(studentSubmissions.reduce((acc, s) => acc + s.score, 0) / studentSubmissions.length)
      : 0;
    return { name: student.name, avgScore };
  });

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-gab-indigo p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-bold mb-6 dark:text-white">Média de Desempenho dos Alunos</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{fontSize: 12, fill: '#888888'}} />
                      <YAxis domain={[0, 100]} tick={{fontSize: 12, fill: '#888888'}} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: '#1e1b4b', color: '#ffffff' }} />
                      <Bar dataKey="avgScore" radius={[8, 8, 0, 0]}>
                        {performanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.avgScore > 70 ? '#3b82f6' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gab-blue/10 dark:bg-gab-blue/20 p-6 rounded-2xl border border-gab-blue/20">
                  <p className="text-slate-500 dark:text-white text-sm font-medium">Atividades Ativas</p>
                  <p className="text-4xl font-bold text-gab-blue dark:text-white">{activities.length}</p>
                </div>
                <div className="bg-gab-purple/10 dark:bg-gab-purple/20 p-6 rounded-2xl border border-gab-purple/20">
                  <p className="text-slate-500 dark:text-white text-sm font-medium">Total de Entregas</p>
                  <p className="text-4xl font-bold text-gab-purple dark:text-white">{submissions.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gab-indigo p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
               <h3 className="font-bold mb-4 dark:text-white">Acesso Rápido</h3>
               <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setActiveTab('grades')} className="p-4 rounded-xl bg-slate-50 dark:bg-gab-deep/40 hover:bg-gab-blue/5 transition-colors text-left border border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-sm dark:text-white">Ver Notas</p>
                    <p className="text-xs text-slate-400 dark:text-white/60">Lista detalhada de notas</p>
                  </button>
                  <button onClick={() => setActiveTab('calendar')} className="p-4 rounded-xl bg-slate-50 dark:bg-gab-deep/40 hover:bg-gab-blue/5 transition-colors text-left border border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-sm dark:text-white">Calendário</p>
                    <p className="text-xs text-slate-400 dark:text-white/60">Marcar aulas e provas</p>
                  </button>
               </div>
            </div>
          </div>
        );
      case 'grades':
        return (
          <div className="bg-white dark:bg-gab-indigo p-6 rounded-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold mb-6 dark:text-white">Notas dos Alunos</h3>
            <div className="space-y-4">
              {submissions.slice().reverse().map(sub => {
                const student = INITIAL_USERS.find(u => u.id === sub.studentId);
                const activity = activities.find(a => a.id === sub.activityId);
                return (
                  <div key={sub.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-gab-deep/40 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <img src={student?.avatar} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-semibold text-sm dark:text-white">{student?.name}</p>
                        <p className="text-xs text-slate-500 dark:text-white/60">{activity?.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${sub.score >= 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {sub.score}%
                      </span>
                      <button onClick={() => onViewSubmission(sub)} className="text-gab-blue dark:text-white font-bold text-sm hover:underline transition-all">Detalhes</button>
                    </div>
                  </div>
                );
              })}
              {submissions.length === 0 && <p className="text-center text-slate-500 dark:text-white/60 py-12">Nenhuma nota registrada ainda.</p>}
            </div>
          </div>
        );
      case 'create':
        return (
          <div className="bg-white dark:bg-gab-indigo p-8 rounded-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-right-2 duration-300">
            <h3 className="text-2xl font-bold mb-6 dark:text-white">Espaço de Criação</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-500 dark:text-white/70 mb-2 uppercase tracking-wider">Título da Atividade</label>
                <input type="text" placeholder="Ex: Verb to Be Practice" className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-gab-deep dark:text-white outline-none focus:ring-2 focus:ring-gab-blue" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 dark:text-white/70 mb-2 uppercase tracking-wider">Tipo</label>
                <div className="flex gap-4">
                   <button className="flex-1 p-4 rounded-xl border-2 border-gab-blue bg-gab-blue/5 text-gab-blue dark:text-white font-bold">Homework</button>
                   <button className="flex-1 p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-white/40">Extra Activity</button>
                </div>
              </div>
              <button 
                onClick={() => {
                  onAddActivity({
                    id: `act-${Date.now()}`,
                    title: 'Aula de Verbos Irregulares',
                    description: 'Atividade criada no Espaço de Criação',
                    type: 'homework',
                    assignedTo: ['student-1', 'student-2'],
                    questions: [{ id: 'q-new-1', type: 'text', prompt: 'List 3 irregular verbs.', correctAnswer: 'Go, Eat, See' }]
                  });
                  setActiveTab('overview');
                }}
                className="w-full py-4 bg-gab-blue text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-gab-purple transition-all"
              >
                Publicar Atividade
              </button>
            </div>
          </div>
        );
      case 'chat':
        return (
          <div className="animate-in fade-in duration-300">
            <ChatComponent 
              currentUser={currentUser} 
              users={INITIAL_USERS} 
              messages={messages} 
              onSendMessage={onSendMessage} 
            />
          </div>
        );
      case 'calendar':
        return (
          <div className="animate-in fade-in duration-300">
            <CalendarView 
              events={events} 
              role="teacher" 
              onAddEvent={onAddEvent} 
              onDeleteEvent={onDeleteEvent} 
            />
          </div>
        );
      case 'profile':
        return (
          <ProfilePage user={currentUser} onUpdate={onUpdateProfile} />
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 space-y-2">
        <h2 className="text-xs font-bold text-slate-400 dark:text-white/60 uppercase tracking-widest px-4 mb-4">Menu da Professora</h2>
        <button 
          onClick={() => setActiveTab('overview')} 
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-gab-blue text-white shadow-lg shadow-blue-500/20' : 'text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-gab-indigo/50'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
          Média Geral
        </button>
        <button 
          onClick={() => setActiveTab('grades')} 
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'grades' ? 'bg-gab-blue text-white shadow-lg shadow-blue-500/20' : 'text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-gab-indigo/50'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
          Notas dos Alunos
        </button>
        <button 
          onClick={() => setActiveTab('create')} 
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'create' ? 'bg-gab-blue text-white shadow-lg shadow-blue-500/20' : 'text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-gab-indigo/50'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
          Espaço de Criação
        </button>
        <button 
          onClick={() => setActiveTab('chat')} 
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'chat' ? 'bg-gab-blue text-white shadow-lg shadow-blue-500/20' : 'text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-gab-indigo/50'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg>
          Chat de Dúvidas
        </button>
        <button 
          onClick={() => setActiveTab('calendar')} 
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'calendar' ? 'bg-gab-blue text-white shadow-lg shadow-blue-500/20' : 'text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-gab-indigo/50'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
          Calendário
        </button>
        <button 
          onClick={() => setActiveTab('profile')} 
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-gab-blue text-white shadow-lg shadow-blue-500/20' : 'text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-gab-indigo/50'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
          Meu Perfil
        </button>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="mb-8">
           <h1 className="text-3xl font-bold text-gab-indigo dark:text-white capitalize">
             {activeTab === 'overview' ? 'Média Geral' : 
              activeTab === 'grades' ? 'Notas Detalhadas' : 
              activeTab === 'create' ? 'Criar Atividades' : 
              activeTab === 'chat' ? 'Comunicação' : 
              activeTab === 'calendar' ? 'Agenda Acadêmica' : 'Meu Perfil'}
           </h1>
           <p className="text-slate-500 dark:text-white/60 italic">Portal English With Gab • {currentUser.name}</p>
        </header>
        {renderContent()}
      </div>
    </div>
  );
};
