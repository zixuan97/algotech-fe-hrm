import { isEqual, omit } from 'lodash';
import { ContentStatus, Step, Topic } from 'src/models/types';
import { EMPTYSTR } from 'src/utils/constants';

const EMPTY_STEP: Partial<Step> = {
  id: -1,
  topicOrder: 0,
  title: EMPTYSTR,
  content: EMPTYSTR
};

const EMPTY_TOPIC: Partial<Topic> = {
  subjectOrder: 0,
  title: EMPTYSTR,
  status: ContentStatus.DRAFT,
  subjectId: 0,
  steps: [],
  records: []
};

export const getNewTopic = (
  subjectId: number,
  subjectOrder: number,
  title: string
): Partial<Topic> => {
  return { ...EMPTY_TOPIC, subjectId, subjectOrder, title };
};

export const isTopicEmpty = (topic: Topic): boolean => {
  return isEqual(
    omit(topic, ['id', 'subjectId', 'subjectOrder']),
    omit(EMPTY_TOPIC, ['subjectId', 'subjectOrder'])
  );
};

export const instanceOfTopic = (obj: any): boolean => {
  return 'subjectOrder' in obj && 'subjectId' in obj && 'steps' in obj;
};

export const getNewStep = (
  topicId: number,
  topicOrder: number,
  title: string
) => {
  return {
    ...EMPTY_STEP,
    topicId,
    topicOrder,
    title
  };
};

export const reorderStepsArr = (
  steps: Step[],
  sort: boolean = true
): Step[] => {
  const reorderedSteps = [...steps];
  if (sort) {
    reorderedSteps.sort((a, b) => a.topicOrder - b.topicOrder);
  }
  for (let i = 0; i < reorderedSteps.length; i++) {
    reorderedSteps[i] = { ...reorderedSteps[i], topicOrder: i + 1 };
  }
  return reorderedSteps;
};

export const duplicateStepInStepsArr = (
  step: Step,
  insertIdx: number,
  steps: Step[]
): Step[] => {
  const newSteps = [...steps];
  newSteps.splice(insertIdx, 0, step);
  for (let i = insertIdx; i < newSteps.length; i++) {
    newSteps[i] = { ...newSteps[i], topicOrder: i + 1 };
  }
  return newSteps;
};

export const swapStepsinStepsArr = (
  idxA: number,
  idxB: number,
  steps: Step[]
): Step[] => {
  const newSteps = [...steps];
  const temp = newSteps[idxA];
  newSteps[idxA] = newSteps[idxB];
  newSteps[idxB] = temp;
  return reorderStepsArr(newSteps, false);
};
