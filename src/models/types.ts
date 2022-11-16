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
  tier: string;
  managerId?: number;
  manager?: User;
  jobRoles?: JobRole[];
  subordinates?: User[];
}

export interface JobRole {
  id: number;
  jobRole: string;
  description: string;
  usersInJobRole: User[];
}

export interface Step {
  id: number;
  title: string;
  content: string;
  topicId: number;
  topicOrder: number;
}

export interface Topic {
  id: number;
  subjectOrder: number;
  title: string;
  status: ContentStatus;
  subjectId: number;
  subject: Subject;
  steps: Step[];
  completedRecords: EmployeeSubjectRecord[];
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
  usersAssigned: EmployeeSubjectRecord[];
  createdAt: Date;
  createdBy: User;
  lastUpdatedAt: Date;
  lastUpdatedBy: User;
}

export interface EmployeeSubjectRecord {
  id: number;
  subjectId: number;
  userId: number;
  completionRate: number;
  completedQuizzes: Quiz[];
  completedTopics: Topic[];
  subject: Subject;
  user: User;
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
  completedRecords: EmployeeSubjectRecord[];
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
  quizOrder: number;
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

export interface EmployeeLeaveQuota {
  id: number;
  tier: string;
  employee: User;
  annualQuota: number;
  childcareQuota: number;
  compassionateQuota: number;
  parentalQuota: number;
  sickQuota: number;
  unpaidQuota: number;
}

export interface LeaveApplication {
  id: number;
  applicationDate: Date;
  startDate: Date;
  endDate: Date;
  leaveType: LeaveType;
  status: LeaveStatus;
  description: string;
  vettedBy?: User;
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

export interface TreeNode {
  id: number;
  subordinates: TreeNode[];
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
