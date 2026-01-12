
export type Role = 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  phone?: string;
  bio?: string;
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'text';
  prompt: string;
  options?: string[];
  correctAnswer: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: 'homework' | 'extra';
  questions: Question[];
  assignedTo: string[]; // User IDs
}

export interface Submission {
  id: string;
  activityId: string;
  studentId: string;
  answers: Record<string, string>;
  score: number;
  feedback: string;
  detailedResults: Array<{
    questionId: string;
    isCorrect: boolean;
    studentAnswer: string;
    feedback: string;
  }>;
  submittedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO string
  type: 'class' | 'exam' | 'event';
  description?: string;
}
