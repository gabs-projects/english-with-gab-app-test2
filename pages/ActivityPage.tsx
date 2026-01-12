
import React, { useState } from 'react';
import { Activity, Submission } from '../types';
import { correctActivity } from '../services/geminiService';

interface ActivityPageProps {
  activity: Activity;
  userId: string;
  onSubmit: (sub: Submission) => void;
  onCancel: () => void;
}

export const ActivityPage: React.FC<ActivityPageProps> = ({ activity, userId, onSubmit, onCancel }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (qId: string, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await correctActivity(activity.title, activity.questions, answers);
      
      const submission: Submission = {
        id: `sub-${Date.now()}`,
        activityId: activity.id,
        studentId: userId,
        answers,
        score: result.score,
        feedback: result.feedback,
        detailedResults: result.detailedResults,
        submittedAt: new Date().toISOString()
      };
      
      onSubmit(submission);
    } catch (e) {
      alert("Erro ao enviar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto font-sans">
      <div className="mb-8">
        <button onClick={onCancel} className="text-slate-500 hover:text-gab-blue flex items-center gap-2 transition-colors mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Sair da atividade
        </button>
        <h2 className="text-3xl font-bold mb-2">{activity.title}</h2>
        <p className="text-slate-500 dark:text-slate-400">{activity.description}</p>
      </div>

      <div className="space-y-8">
        {activity.questions.map((q, idx) => (
          <div key={q.id} className="bg-white dark:bg-gab-indigo p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex gap-4 mb-6">
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gab-blue/10 dark:bg-gab-blue/20 text-gab-blue font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              <p className="text-lg font-medium pt-0.5">{q.prompt}</p>
            </div>

            {q.type === 'multiple_choice' ? (
              <div className="grid grid-cols-1 gap-3 pl-12">
                {q.options?.map(opt => (
                  <label 
                    key={opt} 
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      answers[q.id] === opt 
                      ? 'border-gab-blue bg-gab-blue/5' 
                      : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name={q.id} 
                      value={opt} 
                      checked={answers[q.id] === opt}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="hidden" 
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[q.id] === opt ? 'border-gab-blue' : 'border-slate-300'}`}>
                      {answers[q.id] === opt && <div className="w-2.5 h-2.5 rounded-full bg-gab-blue" />}
                    </div>
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="pl-12">
                <textarea 
                  placeholder="Sua resposta aqui..."
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-gab-deep focus:ring-2 focus:ring-gab-blue focus:border-transparent outline-none min-h-[100px]"
                />
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end pt-8 pb-20">
          <button 
            disabled={isSubmitting || Object.keys(answers).length < activity.questions.length}
            onClick={handleSubmit}
            className="px-12 py-4 bg-gab-blue hover:bg-gab-purple text-white font-bold rounded-2xl shadow-xl shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Corrigindo...
              </>
            ) : 'Enviar Atividade'}
          </button>
        </div>
      </div>
    </div>
  );
};
