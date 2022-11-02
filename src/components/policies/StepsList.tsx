import { Button, List } from 'antd';
import { useThemedClassName } from 'src/hooks/useThemedClassName';
import { Step } from 'src/models/types';
import '../../styles/policies/editTopic.scss';
import '../../styles/common/common.scss';
import StepsMoreButton from './StepsMoreButton';

type StepsListProps = {
  steps: Step[];
  updateSteps: (steps: Step[]) => void;
  selectedStep: Step | null;
  updateSelectedStep: (step: Step) => void;
};

const StepsList = ({
  steps,
  updateSteps,
  selectedStep,
  updateSelectedStep
}: StepsListProps) => {
  const selectedStepsListItemClassName = useThemedClassName('steps-list-item');

  return (
    <List style={{ marginBottom: '32px' }}>
      {steps.map((step, index) => (
        <List.Item
          key={step.id}
          className={
            step.id === selectedStep?.id
              ? selectedStepsListItemClassName
              : 'steps-list-item'
          }
        >
          <Button type='link' onClick={() => updateSelectedStep(step)}>
            {step.title}
          </Button>
          <StepsMoreButton
            index={index}
            steps={steps}
            updateSteps={updateSteps}
          />
        </List.Item>
      ))}
    </List>
  );
};

export default StepsList;
