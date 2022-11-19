import { BookOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Button, Card, Progress, Space, Typography } from 'antd';
import React from 'react';
import RichTextDisplay from 'src/components/common/RichTextDisplay';
import useHasChanged from 'src/hooks/useHasChanged';
import { Step, Topic } from 'src/models/types';
import { completeTopic } from 'src/services/topicService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import '../../../styles/common/common.scss';
import '../../../styles/subjects/topic.scss';
import StepsList from '../topic/StepsList';

const { Title, Text } = Typography;

type AssignedTopicProps = {
  attempt: boolean;
  topic: Topic;
  isComplete: boolean;
  refreshRecord: () => void;
  moveToNext: () => void;
};

const AssignedTopic = ({
  attempt,
  topic,
  isComplete,
  refreshRecord,
  moveToNext
}: AssignedTopicProps) => {
  const { steps } = topic;
  const [completedStepIds, setCompletedStepIds] = React.useState<Set<number>>(
    isComplete ? new Set(steps.map((step) => step.id)) : new Set()
  );
  const [selectedStep, setSelectedStep] = React.useState<Step | null>(
    steps.length ? steps[0] : null
  );
  const [finishLoading, setFinishLoading] = React.useState<boolean>(false);

  const currStepIdx = steps?.findIndex((step) => step.id === selectedStep?.id);

  const moveToNextStep = () => {
    if (currStepIdx !== undefined && steps && currStepIdx < steps.length - 1) {
      setSelectedStep(steps[currStepIdx + 1]);
      setCompletedStepIds((prev) => new Set([...prev, steps[currStepIdx].id]));
    }
  };

  const moveToPreviousStep = () => {
    if (currStepIdx !== undefined && steps && currStepIdx > 0) {
      setSelectedStep(steps[currStepIdx - 1]);
    }
  };

  const finishTopic = () => {
    if (!isComplete) {
      setCompletedStepIds((prev) => new Set([...prev, steps[currStepIdx].id]));
      setFinishLoading(true);
      asyncFetchCallback(
        completeTopic(topic.id),
        () => {
          refreshRecord();
          moveToNext();
        },
        () => void 0,
        { updateLoading: setFinishLoading }
      );
    } else {
      moveToNext();
    }
  };

  const hasTopicChanged = useHasChanged(topic);

  React.useEffect(() => {
    if (hasTopicChanged) {
      setSelectedStep(steps.length ? steps[0] : null);
    }
  }, [hasTopicChanged, steps]);

  //   React.useEffect(() => {
  //     if (selectedStep) {
  //       setCompletedStepIds((prev) => new Set([...prev, selectedStep.id]));
  //     }
  //   }, [selectedStep]);

  //   React.useEffect(() => {
  //     if (attempt) {
  //     }
  //   }, [attempt]);

  return (
    <div className='container-left-full' style={{ paddingRight: '16px' }}>
      <Card style={{ marginBottom: '12px' }}>
        <div className='container-spaced-out'>
          <Space align='center' size='middle'>
            <BookOutlined />
            <Title level={4} style={{ margin: 0 }}>
              {`${topic.subjectOrder}. ${topic.title}`}
            </Title>
          </Space>
          <Text>Topic</Text>
        </div>
      </Card>
      {attempt && (
        <Space direction='vertical'>
          <Text>Topic Progress</Text>
          <Progress
            format={(percent) => `${percent?.toFixed(0)}%`}
            percent={
              isComplete ? 100 : (completedStepIds.size / steps.length) * 100
            }
          />
        </Space>
      )}
      <div className='steps-container' style={{ marginTop: '12px' }}>
        <div className='steps-sidebar'>
          <Title level={4} style={{ marginBottom: '16px' }}>
            Steps
          </Title>
          {steps.length ? (
            <StepsList
              completedIds={attempt ? [...completedStepIds] : undefined}
              steps={steps.sort((a, b) => a.topicOrder - b.topicOrder) ?? []}
              selectedStep={selectedStep}
              updateSelectedStep={setSelectedStep}
            />
          ) : (
            <Text>No steps in this topic.</Text>
          )}
        </div>
        <div className='steps-editor'>
          <Title level={4} style={{ marginBottom: '0' }}>
            {selectedStep?.title ?? 'Step Content'}
          </Title>
          {selectedStep ? (
            <>
              <Card>
                <RichTextDisplay
                  content={selectedStep?.content}
                  updateContent={(content: string) =>
                    setSelectedStep((prev) =>
                      prev ? { ...prev, content: content } : null
                    )
                  }
                  onBlur={() => {}}
                  style={{ flex: 0.8 }}
                />
              </Card>
              <Space style={{ alignSelf: 'flex-end', marginTop: '24px' }}>
                <Button
                  style={{ width: '10em' }}
                  onClick={() => moveToPreviousStep()}
                  disabled={currStepIdx === 0}
                >
                  Previous Step
                </Button>
                <Button
                  style={{ width: '10em' }}
                  type='primary'
                  onClick={() => {
                    currStepIdx === steps.length - 1
                      ? finishTopic()
                      : moveToNextStep();
                  }}
                  icon={
                    attempt &&
                    currStepIdx === steps.length - 1 && <CheckCircleOutlined />
                  }
                  loading={finishLoading}
                  disabled={
                    (!attempt && currStepIdx === steps.length - 1) ||
                    (isComplete && currStepIdx === steps.length - 1)
                  }
                >
                  {attempt && currStepIdx === steps.length - 1
                    ? 'Finish Topic'
                    : 'Next Step'}
                </Button>
              </Space>
            </>
          ) : (
            <Text>No step selected.</Text>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignedTopic;
