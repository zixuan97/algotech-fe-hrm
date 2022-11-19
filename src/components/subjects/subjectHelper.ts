import { Quiz, Subject, SubjectType, Topic } from 'src/models/types';
import { updateQuizzesOrder } from 'src/services/quizService';
import { updateTopicsOrder } from 'src/services/topicService';
import { EMPTYSTR } from 'src/utils/constants';
import { instanceOfQuiz } from './subject/quiz/quizHelper';
import { instanceOfTopic } from './topic/topicHelper';

export enum SubjectSectionType {
  TOPIC = 'TOPIC',
  QUIZ = 'QUIZ'
}

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

export const getNewSubject = (
  type: SubjectType,
  title: string,
  description?: string
): Partial<Subject> => {
  return { ...EMPTY_SUBJECT, title, type, ...(description && { description }) };
};

export const sortTopicsAndQuizzesArr = (
  topicsAndQuizzesArr: (Topic | Quiz)[]
): (Topic | Quiz)[] => {
  return topicsAndQuizzesArr.sort((a, b) => {
    if (a.subjectOrder === b.subjectOrder) {
      return instanceOfTopic(a) && instanceOfQuiz(b)
        ? -1
        : a.title.localeCompare(b.title);
    }
    return a.subjectOrder - b.subjectOrder;
  });
};

const zipTopicsAndQuizzesArr = (
  topics: Topic[],
  quizzes: Quiz[]
): (Topic | Quiz)[] => [...topics, ...quizzes];

const unzipTopicsAndQuizzesArr = (
  topicsAndQuizzesArr: (Topic | Quiz)[]
): {
  topics: Topic[];
  quizzes: Quiz[];
} => {
  const topics: Topic[] = [];
  const quizzes: Quiz[] = [];

  topicsAndQuizzesArr.forEach((topicOrQuiz) => {
    if (instanceOfQuiz(topicOrQuiz)) {
      quizzes.push(topicOrQuiz as Quiz);
    } else {
      topics.push(topicOrQuiz as Topic);
    }
  });

  return {
    topics,
    quizzes
  };
};

export const reorderTopicsAndQuizzes = (
  topics: Topic[],
  quizzes: Quiz[],
  sort: boolean = true
): (Topic | Quiz)[] => {
  const topicsAndQuizzesArr = zipTopicsAndQuizzesArr(topics, quizzes);
  if (sort) {
    sortTopicsAndQuizzesArr(topicsAndQuizzesArr);
  }
  for (let i = 0; i < topicsAndQuizzesArr.length; i++) {
    topicsAndQuizzesArr[i] = { ...topicsAndQuizzesArr[i], subjectOrder: i + 1 };
  }
  return topicsAndQuizzesArr;
};

export const reorderTopicsAndQuizzesArr = (
  topicsAndQuizzesArr: (Topic | Quiz)[]
) => {
  const orderedTopicsAndQuizzesArr = [...topicsAndQuizzesArr];
  for (let i = 0; i < orderedTopicsAndQuizzesArr.length; i++) {
    orderedTopicsAndQuizzesArr[i] = {
      ...orderedTopicsAndQuizzesArr[i],
      subjectOrder: i + 1
    };
  }
  console.log(orderedTopicsAndQuizzesArr);
  return orderedTopicsAndQuizzesArr;
};

export const updateTopicsAndQuizzesOrderApiCall = (
  newTopicsAndQuizzesArr: (Topic | Quiz)[],
  callback?: () => void
) => {
  const { topics, quizzes } = unzipTopicsAndQuizzesArr(newTopicsAndQuizzesArr);
  Promise.allSettled([
    updateTopicsOrder(topics),
    updateQuizzesOrder(quizzes)
  ]).then(() => callback?.());
};

export const swapQuizOrTopicInArr = (
  idxA: number,
  idxB: number,
  quizzesAndTopics: (Quiz | Topic)[]
) => {
  const newQuizzesAndTopics = [...quizzesAndTopics];
  const temp = newQuizzesAndTopics[idxA];
  newQuizzesAndTopics[idxA] = newQuizzesAndTopics[idxB];
  newQuizzesAndTopics[idxB] = temp;
  return reorderTopicsAndQuizzesArr(newQuizzesAndTopics);
};

export const isQuizOrTopicCompleted = (
  quizOrTopic: Quiz | Topic,
  completedQuizzes: Quiz[] = [],
  completedTopics: Topic[] = []
): boolean => {
  if (instanceOfTopic(quizOrTopic)) {
    return !!completedTopics.find((toFind) => toFind.id === quizOrTopic.id);
  } else {
    return !!completedQuizzes.find((toFind) => toFind.id === quizOrTopic.id);
  }
};
