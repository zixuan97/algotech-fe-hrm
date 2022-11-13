import { isEqual, omit } from 'lodash';
import {
  ContentStatus,
  Quiz,
  Subject,
  SubjectType,
  Topic
} from 'src/models/types';
import { EMPTYSTR } from 'src/utils/constants';

export enum SubjectSectionType {
  TOPIC = 'TOPIC',
  QUIZ = 'QUIZ'
}

const EMPTY_TOPIC: Partial<Topic> = {
  subjectOrder: 0,
  title: EMPTYSTR,
  status: ContentStatus.DRAFT,
  subjectId: 0,
  steps: []
};

const EMPTY_QUIZ: Quiz = {
  subjectOrder: 0,
  title: EMPTYSTR,
  description: EMPTYSTR,
  status: ContentStatus.DRAFT,
  passingScore: 0,
  completionRate: 0,
  subjectId: 0,
  questions: []
};

const EMPTY_SUBJECT: Partial<Subject> = {
  title: EMPTYSTR,
  description: EMPTYSTR,
  type: SubjectType.COMPANY,
  isPublished: false,
  completionRate: 0,
  quizzes: [],
  topics: [],
  usersAssigned: []
};

export const getNewTopic = (
  subjectId: number,
  subjectOrder: number,
  title: string
): Partial<Topic> => {
  return { ...EMPTY_TOPIC, subjectId, subjectOrder, title };
};

export const getNewQuiz = (
  subjectId: number,
  subjectOrder: number,
  title: string
): Quiz => {
  return { ...EMPTY_QUIZ, subjectId, subjectOrder, title };
};

export const getNewSubject = (
  type: SubjectType,
  title: string,
  description?: string
): Partial<Subject> => {
  return { ...EMPTY_SUBJECT, title, ...(description && { description }) };
};

export const isTopicEmpty = (topic: Topic): boolean => {
  return isEqual(
    omit(topic, ['id', 'subjectId', 'subjectOrder']),
    omit(EMPTY_TOPIC, ['subjectId', 'subjectOrder'])
  );
};

export const isQuizEmpty = (quiz: Quiz): boolean => {
  return isEqual(
    omit(quiz, ['id', 'subjectId', 'subjectOrder']),
    omit(EMPTY_QUIZ, ['subjectId', 'subjectOrder'])
  );
};

// TODO: test if this function works
export const orderTopicsAndQuizzes = (
  topics: Topic[],
  quizzes: Quiz[]
): (Topic | Quiz)[] => {
  const topicsAndQuizzesArr = [...topics, ...quizzes];
  topicsAndQuizzesArr.sort((a, b) => {
    if (a.subjectOrder === b.subjectOrder) {
      return instanceOfTopic(a) && instanceOfQuiz(b)
        ? -1
        : a.title.localeCompare(b.title);
    }
    return a.subjectOrder - b.subjectOrder;
  });

  return topicsAndQuizzesArr;
};

export const instanceOfTopic = (obj: any): boolean => {
  return 'subjectOrder' in obj && 'subjectId' in obj && 'steps' in obj;
};

export const instanceOfQuiz = (obj: any): boolean => {
  return 'subjectOrder' in obj && 'subjectId' in obj && 'questions' in obj;
};
