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
  id?: number;
  subjectOrder: number;
  title: string;
  status: ContentStatus;
  subjectId: number;
  steps: Step[];
}

export interface Subject {
  id: number;
  title: string;
  description: string;
  type: SubjectType;
  isPublished: boolean;
  completionRate: number;
  quizzes: Quiz[];
  topics: Topic[];
  usersAssigned: User[];
  createdAt: Date;
  createdBy: User;
  lastUpdatedAt: Date;
  lastUpdatedBy: User;
}

export interface Quiz {
  id?: number;
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

export enum SubjectType {
  COMPANY = 'COMPANY',
  POLICY = 'POLICY',
  PROCESS = 'PROCESS'
}
