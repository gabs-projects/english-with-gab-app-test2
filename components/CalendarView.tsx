
import React, { useState } from 'react';
import { CalendarEvent, Role } from '../types';

interface CalendarViewProps {
  events: CalendarEvent[];
  role: Role;
  onAddEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, role, onAddEvent, onDeleteEvent }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({ type: 'class' });

  const handleAdd = () => {
    if (!newEvent.title || !newEvent.date) return;
    onAddEvent({
      id: `evt-${Date.now()}`,
      title: newEvent.title,
      date: newEvent.date,
      type: newEvent.type as any,
      description: newEvent.description
    });
    setNewEvent({ type: 'class' });
    setShowAdd(false);
  };

  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Calendário Acadêmico</h3>
        {role === 'teacher' && (
          <button 
            onClick={() => setShowAdd(true)}
            className="bg-gab-blue text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-gab-purple transition-colors"
          >
            + Marcar Evento
          </button>
        )}
      </div>

      {showAdd && (
        <div className="p-6 bg-white dark:bg-gab-indigo rounded-2xl border border-gab-blue shadow-lg space-y-4 animate-in fade-in zoom-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Título do Evento" 
              className="p-3 rounded-xl border border-slate-200 dark:bg-gab-deep dark:border-slate-800 outline-none focus:ring-2 focus:ring-gab-blue"
              value={newEvent.title || ''}
              onChange={e => setNewEvent({...newEvent, title: e.target.value})}
            />
            <input 
              type="date" 
              className="p-3 rounded-xl border border-slate-200 dark:bg-gab-deep dark:border-slate-800 outline-none focus:ring-2 focus:ring-gab-blue"
              value={newEvent.date || ''}
              onChange={e => setNewEvent({...newEvent, date: e.target.value})}
            />
            <select 
              className="p-3 rounded-xl border border-slate-200 dark:bg-gab-deep dark:border-slate-800 outline-none focus:ring-2 focus:ring-gab-blue"
              value={newEvent.type}
              onChange={e => setNewEvent({...newEvent, type: e.target.value as any})}
            >
              <option value="class">Aula</option>
              <option value="exam">Prova</option>
              <option value="event">Evento Extra</option>
            </select>
            <input 
              type="text" 
              placeholder="Breve descrição" 
              className="p-3 rounded-xl border border-slate-200 dark:bg-gab-deep dark:border-slate-800 outline-none focus:ring-2 focus:ring-gab-blue"
              value={newEvent.description || ''}
              onChange={e => setNewEvent({...newEvent, description: e.target.value})}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-slate-500 font-bold">Cancelar</button>
            <button onClick={handleAdd} className="px-6 py-2 bg-gab-blue text-white rounded-xl font-bold">Salvar Evento</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {sortedEvents.length === 0 && <p className="text-center text-slate-500 py-12">Nenhum evento agendado.</p>}
        {sortedEvents.map(event => (
          <div key={event.id} className="bg-white dark:bg-gab-indigo p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between group">
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold ${
                event.type === 'exam' ? 'bg-red-100 text-red-600' : 
                event.type === 'class' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
              }`}>
                <span className="text-xs uppercase tracking-tighter">{new Date(event.date).toLocaleDateString('pt-BR', { month: 'short' })}</span>
                <span className="text-xl">{new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit' })}</span>
              </div>
              <div>
                <h4 className="font-bold text-lg">{event.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{event.type === 'exam' ? 'Prova' : event.type === 'class' ? 'Aula Regular' : 'Evento Especial'} • {event.description}</p>
              </div>
            </div>
            {role === 'teacher' && (
              <button 
                onClick={() => onDeleteEvent(event.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
