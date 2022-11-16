import { Button, List } from 'antd';
import { useThemedClassName } from 'src/hooks/useThemedClassName';
import { Step } from 'src/models/types';
import '../../../styles/subjects/topic.scss';
import '../../../styles/common/common.scss';
import StepsMoreButton from './StepsMoreButton';
import React from 'react';

type StepsListProps = {
  steps: Step[];
  selectedStep: Step | null;
  updateSelectedStep: React.Dispatch<React.SetStateAction<Step | null>>;
  refreshTopic?: () => void;
};

const StepsList = ({
  steps,
  selectedStep,
  updateSelectedStep,
  refreshTopic
}: StepsListProps) => {
  const selectedStepsListItemClassName = useThemedClassName('steps-list-item');

  return (
    <List>
      {steps.map((step) => (
        <List.Item
          key={step.id}
          className={
            step.id === selectedStep?.id
              ? selectedStepsListItemClassName
              : 'steps-list-item'
          }
        >
          <Button type='link' onClick={() => updateSelectedStep(step)}>
            {`${step.topicOrder}. ${step.title}`}
          </Button>
          {refreshTopic && (
            <StepsMoreButton
              currStep={step}
              steps={steps}
              updateSelectedStep={updateSelectedStep}
              refreshTopic={refreshTopic}
            />
          )}
        </List.Item>
      ))}
    </List>
  );
};

export default StepsList;
