import type { Moment } from 'moment';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  INTERN = 'INTERN',
  PARTTIME = 'PARTTIME',
  FULLTIME = 'FULLTIME',
  CUSTOMER = 'CUSTOMER',
  B2B = 'B2B'
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
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

export interface LeaveQuota {
  id: number | undefined;
  tier: string;
  annual: number;
  childcare: number;
  compassionate: number;
  parental: number;
  sick: number;
  unpaid: number;
}

export interface LeaveApplication {
  id: number;
  applicationDate: Date;
  startDate: Date;
  endDate: Date;
  leaveType: LeaveType;
  status: LeaveStatus;
  description: string;
  vettedBy?: string;
  commentsByVetter?: string;
  lastUpdated: Date;
  employeeId: number;
  employee: User;
}

export interface CalendarObject {
  id: number;
  calDate: Moment;
  startDate: string;
  endDate: string;
  employeeId: number;
  employeeName: string;
  color: string;
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

export enum LeaveType {
  ANNUAL = 'ANNUAL',
  CHILDCARE = 'CHILDCARE',
  COMPASSIONATE = 'COMPASSIONATE',
  PARENTAL = 'PARENTAL',
  SICK = 'SICK',
  UNPAID = 'UNPAID'
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}
