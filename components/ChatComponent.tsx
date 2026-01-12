
import React, { useState, useRef, useEffect } from 'react';
import { User, Message } from '../types';

interface ChatComponentProps {
  currentUser: User;
  users: User[];
  messages: Message[];
  onSendMessage: (text: string, receiverId: string) => void;
}

export const ChatComponent: React.FC<ChatComponentProps> = ({ currentUser, users, messages, onSendMessage }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(
    users.find(u => u.id !== currentUser.id) || null
  );
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredMessages = messages.filter(m => 
    (m.senderId === currentUser.id && m.receiverId === selectedUser?.id) ||
    (m.senderId === selectedUser?.id && m.receiverId === currentUser.id)
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filteredMessages]);

  const handleSend = () => {
    if (!inputText.trim() || !selectedUser) return;
    onSendMessage(inputText, selectedUser.id);
    setInputText('');
  };

  return (
    <div className="flex h-[600px] bg-white dark:bg-gab-indigo rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl font-sans">
      {/* Sidebar - User List */}
      <div className="w-1/3 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-gab-deep/50">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-white/60">Conversas</h3>
        </div>
        {users.filter(u => u.id !== currentUser.id).map(user => (
          <button
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`w-full flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-gab-deep/30 transition-colors ${selectedUser?.id === user.id ? 'bg-gab-blue/10 dark:bg-gab-blue/20 border-r-4 border-gab-blue' : ''}`}
          >
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
            <div className="text-left">
              <p className="font-semibold text-sm dark:text-white">{user.name}</p>
              <p className="text-xs text-slate-400 dark:text-white/40 capitalize">{user.role}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-gab-indigo z-10">
              <img src={selectedUser.avatar} className="w-8 h-8 rounded-full" />
              <p className="font-bold dark:text-white">{selectedUser.name}</p>
            </div>
            
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-gab-deep/20">
              {filteredMessages.map(m => {
                const isMe = m.senderId === currentUser.id;
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${isMe ? 'bg-gab-blue text-white rounded-tr-none' : 'bg-white dark:bg-gab-indigo border border-slate-200 dark:border-slate-800 dark:text-white rounded-tl-none'}`}>
                      <p className="text-sm">{m.text}</p>
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-white/70' : 'text-slate-400 dark:text-white/40'}`}>
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              {filteredMessages.length === 0 && (
                <div className="h-full flex items-center justify-center text-slate-400 dark:text-white/40 text-sm italic">
                  Inicie uma conversa com {selectedUser.name}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Digite sua dúvida..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-gab-deep dark:text-white focus:ring-2 focus:ring-gab-blue outline-none"
              />
              <button 
                onClick={handleSend}
                className="bg-gab-blue text-white p-3 rounded-xl hover:bg-gab-purple transition-colors shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 dark:text-white/40">
            Selecione um contato para começar
          </div>
        )}
      </div>
    </div>
  );
};
