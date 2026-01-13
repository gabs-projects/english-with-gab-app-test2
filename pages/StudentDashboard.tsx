
import React, { useState } from 'react';
import { Activity, Submission, User, Message, CalendarEvent } from '../types';
import { INITIAL_USERS } from '../constants';
import { ChatComponent } from '../components/ChatComponent';
import { CalendarView } from '../components/CalendarView';
import { ProfilePage } from './ProfilePage';

interface StudentDashboardProps {
  currentUser: User;
  activities: Activity[];
  submissions: Submission[];
  messages: Message[];
  events: CalendarEvent[];
  onStartActivity: (act: Activity) => void;
  onViewSubmission: (sub: Submission) => void;
  onSendMessage: (text: string, receiverId: string) => void;
  onUpdateProfile: (u: User) => void;
}

type Tab = 'tasks' | 'chat' | 'calendar' | 'profile';

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  currentUser,
  activities, 
  submissions, 
  messages,
  events,
  onStartActivity, 
  onViewSubmission,
  onSendMessage,
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('tasks');

  const pendingActivities = activities.filter(act => !submissions.some(s => s.activityId === act.id));
  const completedActivities = submissions.map(sub => ({
    submission: sub,
    activity: activities.find(a => a.id === sub.activityId)
  })).filter(item => item.activity);

  const avgScore = submissions.length > 0 
    ? Math.round(submissions.reduce((acc, s) => acc + s.score, 0) / submissions.length)
    : 0;

  const renderContent = () => {
    switch(activeTab) {
      case 'tasks':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white dark:bg-gab-indigo p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                 <p className="text-xs font-bold text-slate-400 dark:text-white/60 uppercase tracking-widest mb-1">Média de Notas</p>
                 <p className={`text-4xl font-bold ${avgScore >= 70 ? 'text-green-500' : 'text-amber-500'} dark:text-white`}>{avgScore}%</p>
              </div>
              <div className="bg-white dark:bg-gab-indigo p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                 <p className="text-xs font-bold text-slate-400 dark:text-white/60 uppercase tracking-widest mb-1">Concluídas</p>
                 <p className="text-4xl font-bold text-gab-blue dark:text-white">{submissions.length}</p>
              </div>
              <div className="bg-white dark:bg-gab-indigo p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                 <p className="text-xs font-bold text-slate-400 dark:text-white/60 uppercase tracking-widest mb-1">Total Pendente</p>
                 <p className="text-4xl font-bold text-gab-purple dark:text-white">{pendingActivities.length}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  Pendentes
                </h3>
                <div className="space-y-4">
                  {pendingActivities.map(act => (
                    <div key={act.id} className="bg-white dark:bg-gab-indigo p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-gab-blue transition-all group">
                      <span className="text-[10px] font-black uppercase text-gab-blue bg-gab-blue/5 px-2 py-1 rounded mb-3 inline-block dark:bg-white/10 dark:text-white">{act.type}</span>
                      <h4 className="text-lg font-bold mb-4 dark:text-white">{act.title}</h4>
                      <button 
                        onClick={() => onStartActivity(act)}
                        className="w-full py-3 rounded-xl bg-slate-900 dark:bg-gab-blue text-white font-bold hover:shadow-xl hover:shadow-blue-500/20 transition-all"
                      >
                        Iniciar
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-6 dark:text-white">Histórico</h3>
                <div className="space-y-3">
                  {completedActivities.slice().reverse().map(item => (
                    <div key={item.submission.id} className="bg-slate-50 dark:bg-gab-indigo/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm dark:text-white">{item.activity?.title}</h4>
                        <p className="text-[10px] text-slate-400 dark:text-white/60 uppercase">{new Date(item.submission.submittedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold ${item.submission.score >= 70 ? 'text-green-500' : 'text-amber-500'} dark:text-white`}>{item.submission.score}%</span>
                        <button onClick={() => onViewSubmission(item.submission)} className="p-2 bg-white dark:bg-gab-deep rounded-lg text-slate-400 dark:text-white hover:text-gab-blue transition-colors border border-slate-100 dark:border-slate-800 shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        );
      case 'chat':
        return <ChatComponent currentUser={currentUser} users={INITIAL_USERS} messages={messages} onSendMessage={onSendMessage} />;
      case 'calendar':
        return <CalendarView events={events} role="student" onAddEvent={() => {}} onDeleteEvent={() => {}} />;
      case 'profile':
        return <ProfilePage user={currentUser} onUpdate={onUpdateProfile} />;
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gab-indigo dark:text-white">welcome back, {currentUser.name}!</h2>
          <p className="text-slate-500 dark:text-white/60 italic">"English opens doors."</p>
        </div>
        
        <div className="flex bg-white dark:bg-gab-indigo p-1 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex-wrap">
           <button 
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'tasks' ? 'bg-gab-blue text-white shadow-md' : 'text-slate-500 dark:text-white/60'}`}
           >
             Tarefas
           </button>
           <button 
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'chat' ? 'bg-gab-blue text-white shadow-md' : 'text-slate-500 dark:text-white/60'}`}
           >
             Chat
           </button>
           <button 
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'calendar' ? 'bg-gab-blue text-white shadow-md' : 'text-slate-500 dark:text-white/60'}`}
           >
             Agenda
           </button>
           <button 
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-gab-blue text-white shadow-md' : 'text-slate-500 dark:text-white/60'}`}
           >
             Perfil
           </button>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};
