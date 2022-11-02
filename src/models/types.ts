export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED'
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  status: UserStatus;
  isVerified: boolean;
  company?: string;
  contactNo?: string;
}

export interface Step {
  id?: number;
  title: string;
  content: string;
  topicId: number;
}

export interface Topic {
  id: number;
  subjectOrder: number;
  name: string;
  status: ContentStatus;
  subjectId: number;
  steps: Step[];
}

export interface Subject {
  id: number;
  description: string;
  isPublished: boolean;
  completionRate: number;
  quizzes: Quiz[];
  topics: Topic[];
  usersAssigned: User[];
}

export interface Quiz {
  id: number;
  subjectOrder: number;
  title: string;
  description: string;
  passingScore: number;
  completionRate: number;
  status: ContentStatus;
  subjectId: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  type: AnswerType;
  options: String[];
  writtenAnswer?: String;
  minWordCount?: number;
  correctAnswer: string;
  quizId: number;
}

export enum ContentStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  FINISHED = 'FINISHED'
}

export enum AnswerType {
  MCQ = 'MCQ',
  WRITTEN = 'WRITTEN'
}
