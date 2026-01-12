
import React from 'react';
import { Submission, Activity, User } from '../types';

interface SubmissionDetailProps {
  submission: Submission;
  activity: Activity;
  student: User;
  onBack: () => void;
}

export const SubmissionDetail: React.FC<SubmissionDetailProps> = ({ submission, activity, student, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto font-sans">
      <button onClick={onBack} className="text-slate-500 hover:text-gab-blue flex items-center gap-2 transition-colors mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Voltar para o Dashboard
      </button>

      <div className="bg-white dark:bg-gab-indigo rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl mb-8">
        <div className="bg-gab-gradient p-10 text-white text-center">
          <h2 className="text-4xl font-bold mb-2">Resultado Final</h2>
          <div className="flex flex-col items-center justify-center mt-6">
            <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border-4 border-white/20 mb-4">
              <span className="text-5xl font-bold">{submission.score}%</span>
            </div>
            <p className="text-xl font-medium text-gab-gold">Parabéns, {student.name}!</p>
          </div>
        </div>
        
        <div className="p-8">
          <div className="bg-slate-50 dark:bg-gab-deep/40 p-6 rounded-2xl mb-10 border border-slate-100 dark:border-slate-800 italic text-slate-600 dark:text-slate-300">
            "{submission.feedback}"
          </div>

          <h3 className="text-xl font-bold mb-6">Detalhamento por questão</h3>
          <div className="space-y-6">
            {activity.questions.map((q, idx) => {
              const result = submission.detailedResults.find(r => r.questionId === q.id);
              return (
                <div key={q.id} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-gab-deep/20">
                  <div className="flex items-start gap-4">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${result?.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {result?.isCorrect ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold mb-3">{q.prompt}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-white dark:bg-gab-deep border border-slate-100 dark:border-slate-800">
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Sua Resposta</p>
                          <p className={`text-sm ${result?.isCorrect ? 'text-green-600' : 'text-red-500'}`}>{submission.answers[q.id] || '(Em branco)'}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white dark:bg-gab-deep border border-slate-100 dark:border-slate-800">
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Resposta Correta</p>
                          <p className="text-sm text-gab-blue">{q.correctAnswer}</p>
                        </div>
                      </div>

                      <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {result?.feedback}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-center pb-20">
        <button 
          onClick={onBack}
          className="px-10 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-gab-indigo transition-colors"
        >
          Fechar Visualização
        </button>
      </div>
    </div>
  );
};
