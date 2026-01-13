import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { User, Activity, Submission, Message, CalendarEvent } from './types';
import { INITIAL_USERS, MOCK_ACTIVITIES } from './constants';
import { Login } from './pages/Login';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { ActivityPage } from './pages/ActivityPage';
import { SubmissionDetail } from './pages/SubmissionDetail';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('activities');
    return saved ? JSON.parse(saved) : MOCK_ACTIVITIES;
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem('submissions');
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('events');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentPage, setCurrentPage] = useState<{name: string, params?: any}>({ name: 'home' });
  
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: Evento beforeinstallprompt disparado!');
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('PWA: Prompt ainda não disponível.');
      return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA: Escolha do usuário: ${outcome}`);
    setDeferredPrompt(null);
  };

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogin = (u: User) => {
    setUser(u);
    setCurrentPage({ name: 'home' });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage({ name: 'login' });
  };

  const handleSendMessage = (text: string, receiverId: string) => {
    if (!user) return;
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      receiverId,
      text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleAddSubmission = (sub: Submission) => {
    setSubmissions(prev => [...prev, sub]);
    setCurrentPage({ name: 'home' });
  };

  const handleAddActivity = (act: Activity) => {
    setActivities(prev => [...prev, act]);
  };

  const handleAddEvent = (evt: CalendarEvent) => {
    setEvents(prev => [...prev, evt]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const renderPage = () => {
    if (!user) return <Login onLogin={handleLogin} />;

    switch (currentPage.name) {
      case 'home':
        return user.role === 'teacher' ? (
          <TeacherDashboard 
            currentUser={user}
            activities={activities} 
            submissions={submissions} 
            messages={messages}
            events={events}
            onAddActivity={handleAddActivity}
            onViewSubmission={(s) => setCurrentPage({ name: 'submission_detail', params: s })}
            onSendMessage={handleSendMessage}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
            onUpdateProfile={handleUpdateProfile}
          />
        ) : (
          <StudentDashboard 
            currentUser={user}
            activities={activities.filter(a => a.assignedTo.includes(user.id))}
            submissions={submissions.filter(s => s.studentId === user.id)}
            messages={messages}
            events={events}
            onStartActivity={(a) => setCurrentPage({ name: 'activity', params: a })}
            onViewSubmission={(s) => setCurrentPage({ name: 'submission_detail', params: s })}
            onSendMessage={handleSendMessage}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case 'activity':
        return (
          <ActivityPage 
            activity={currentPage.params} 
            userId={user.id} 
            onSubmit={handleAddSubmission}
            onCancel={() => setCurrentPage({ name: 'home' })}
          />
        );
      case 'submission_detail':
        const submission = currentPage.params as Submission;
        const activity = activities.find(a => a.id === submission.activityId);
        return (
          <SubmissionDetail 
            submission={submission} 
            activity={activity!}
            student={INITIAL_USERS.find(u => u.id === submission.studentId)!}
            onBack={() => setCurrentPage({ name: 'home' })} 
          />
        );
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      darkMode={darkMode} 
      toggleTheme={toggleTheme}
      canInstall={!!deferredPrompt}
      onInstall={handleInstallClick}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;