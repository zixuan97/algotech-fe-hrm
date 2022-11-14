import { isEqual, omit } from 'lodash';
import { ContentStatus, Quiz } from 'src/models/types';
import { EMPTYSTR } from 'src/utils/constants';

const EMPTY_QUIZ: Partial<Quiz> = {
  subjectOrder: 0,
  title: EMPTYSTR,
  description: EMPTYSTR,
  status: ContentStatus.DRAFT,
  passingScore: 0,
  completionRate: 0,
  subjectId: 0,
  questions: [],
  completedRecords: []
};

export const getNewQuiz = (
  subjectId: number,
  subjectOrder: number,
  title: string
): Partial<Quiz> => {
  return { ...EMPTY_QUIZ, subjectId, subjectOrder, title };
};

export const isQuizEmpty = (quiz: Quiz): boolean => {
  return isEqual(
    omit(quiz, ['id', 'subjectId', 'subjectOrder']),
    omit(EMPTY_QUIZ, ['subjectId', 'subjectOrder'])
  );
};

export const instanceOfQuiz = (obj: any): boolean => {
  return 'subjectOrder' in obj && 'subjectId' in obj && 'questions' in obj;
};
