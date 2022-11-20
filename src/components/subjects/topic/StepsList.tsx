import { List, Typography } from 'antd';
import { useThemedClassName } from 'src/hooks/useThemedClassName';
import { Step } from 'src/models/types';
import '../../../styles/subjects/topic.scss';
import '../../../styles/common/common.scss';
import StepsMoreButton from './StepsMoreButton';
import React from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Text, Link } = Typography;

type StepsListProps = {
  steps: Step[];
  selectedStep: Step | null;
  updateSelectedStep: React.Dispatch<React.SetStateAction<Step | null>>;
  completedIds?: number[];
  refreshTopic?: () => void;
};

const StepsList = ({
  steps,
  selectedStep,
  updateSelectedStep,
  completedIds,
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
          {completedIds ? (
            <Text
              style={{ padding: '8px 16px', maxWidth: '70%' }}
            >{`${step.topicOrder}. ${step.title}`}</Text>
          ) : (
            <Link
              style={{ padding: '8px 16px', maxWidth: '70%' }}
              onClick={() => {
                updateSelectedStep(step);
              }}
            >
              {`${step.topicOrder}. ${step.title}`}
            </Link>
          )}
          {completedIds && completedIds.includes(step.id) && (
            <CheckCircleOutlined
              style={{ marginRight: '16px', color: '#52c41a' }}
            />
          )}
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
