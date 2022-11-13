import { Step } from 'src/models/types';
import { EMPTYSTR } from 'src/utils/constants';

const EMPTY_STEP: Partial<Step> = {
  topicOrder: 0,
  title: EMPTYSTR,
  content: EMPTYSTR
};

const DEFAULT_STEP_CONTENT = 'Enter step content here!';

export const getNewStep = (title: string, topicId: number) => {
  return { ...EMPTY_STEP, topicId, title, content: DEFAULT_STEP_CONTENT };
};
