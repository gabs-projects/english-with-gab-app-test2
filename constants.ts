
import { Activity, User } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'teacher-1',
    name: 'Gabriele',
    email: 'gab@englishwithgab.com',
    role: 'teacher',
    avatar: 'https://picsum.photos/seed/gab/200',
    phone: '+55 (11) 99999-9999',
    bio: 'English Teacher specialized in Business English.'
  },
  {
    id: 'student-1',
    name: 'João Silva',
    email: 'joao@email.com',
    role: 'student',
    avatar: 'https://picsum.photos/seed/joao/200',
    phone: '+55 (11) 88888-8888'
  },
  {
    id: 'student-2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    role: 'student',
    avatar: 'https://picsum.photos/seed/maria/200',
    phone: '+55 (11) 77777-7777'
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    title: 'Present Simple vs Continuous',
    description: 'A deep dive into basic tense structures.',
    type: 'homework',
    assignedTo: ['student-1', 'student-2'],
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        prompt: 'Which sentence is correct?',
        options: ['I am eating now.', 'I eating now.', 'I am eat now.'],
        correctAnswer: 'I am eating now.'
      },
      {
        id: 'q2',
        type: 'text',
        prompt: 'Transform to negative: "She likes coffee."',
        correctAnswer: 'She does not like coffee.'
      }
    ]
  },
  {
    id: 'act-2',
    title: 'Business Idioms',
    description: 'Common expressions used in the corporate world.',
    type: 'extra',
    assignedTo: ['student-1'],
    questions: [
      {
        id: 'q3',
        type: 'text',
        prompt: 'What does "to cut corners" mean?',
        correctAnswer: 'To do something in the easiest or cheapest way.'
      }
    ]
  }
];
