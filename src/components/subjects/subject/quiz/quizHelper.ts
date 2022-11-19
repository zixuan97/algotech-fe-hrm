import { isEqual, omit } from 'lodash';
import {
  AnswerType,
  ContentStatus,
  Quiz,
  QuizQuestion
} from 'src/models/types';
import {
  EMPTYSTR,
  STARTCASE_BOOLEAN_FALSE,
  STARTCASE_BOOLEAN_TRUE
} from 'src/utils/constants';

export interface QuizQuestionAnswer {
  questionId: number;
  userAnswer: number;
}

const EMPTY_QUIZ: Partial<Quiz> = {
  subjectOrder: 0,
  title: EMPTYSTR,
  description: EMPTYSTR,
  status: ContentStatus.DRAFT,
  passingScore: 0,
  completionRate: 0,
  subjectId: 0,
  questions: [],
  records: []
};

const EMPTY_QUESTION: Partial<QuizQuestion> = {
  question: EMPTYSTR,
  type: AnswerType.MCQ,
  options: [],
  correctAnswer: 0
};

const DEFAULT_OPTION = 'Answer';

export const TRUE_FALSE_OPTIONS = [
  STARTCASE_BOOLEAN_TRUE,
  STARTCASE_BOOLEAN_FALSE
];

export const getNewQuiz = (
  subjectId: number,
  subjectOrder: number,
  title: string
): Partial<Quiz> => {
  return { ...EMPTY_QUIZ, subjectId, subjectOrder, title };
};

export const getNewQuizQuestion = (quizId: number, quizOrder: number) => {
  return { ...EMPTY_QUESTION, quizId, quizOrder };
};

export const getDefaultOption = (index: number) => `${DEFAULT_OPTION} ${index}`;

export const isOptionUnique = (
  optionToCheck: string,
  options: string[]
): boolean => {
  let count = 0;
  options.forEach((opt) => {
    if (opt === optionToCheck) count++;
  });
  return count <= 1;
};

export const containsOption = (optionToCheck: string, options: string[]) =>
  options.includes(optionToCheck);

export const isQuizEmpty = (quiz: Quiz): boolean => {
  return isEqual(
    omit(quiz, ['id', 'subjectId', 'subjectOrder']),
    omit(EMPTY_QUIZ, ['subjectId', 'subjectOrder'])
  );
};

export const instanceOfQuiz = (obj: any): boolean => {
  return 'subjectOrder' in obj && 'subjectId' in obj && 'questions' in obj;
};

export const reorderQuestionsArr = (
  questions: QuizQuestion[],
  sort: boolean = true
): QuizQuestion[] => {
  const reorderedQuestions = [...questions];
  if (sort) {
    reorderedQuestions.sort((a, b) => (a.quizOrder = b.quizOrder));
  }
  for (let i = 0; i < reorderedQuestions.length; i++) {
    reorderedQuestions[i] = { ...reorderedQuestions[i], quizOrder: i + 1 };
  }
  return reorderedQuestions;
};

export const swapQuestionsInQuestionsArr = (
  idxA: number,
  idxB: number,
  questions: QuizQuestion[]
): QuizQuestion[] => {
  const newQuestions = [...questions];
  const temp = newQuestions[idxA];
  newQuestions[idxA] = newQuestions[idxB];
  newQuestions[idxB] = temp;
  return reorderQuestionsArr(newQuestions, false);
};

export const convertMapToQuizQuestionAnswers = (
  map: Map<number, number>
): QuizQuestionAnswer[] =>
  [...map.entries()].map((entry) => ({
    questionId: entry[0],
    userAnswer: entry[1]
  }));
