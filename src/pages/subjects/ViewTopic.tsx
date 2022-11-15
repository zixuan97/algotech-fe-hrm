import React from 'react';
import { Button, Card, Space, Spin, Typography } from 'antd';
import '../../styles/common/common.scss';
import '../../styles/subjects/topic.scss';
import { Step, Topic } from 'src/models/types';
import breadcrumbContext from 'src/context/breadcrumbs/breadcrumbContext';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getTopicById } from 'src/services/topicService';
import {
  EDIT_TOPIC_URL,
  SUBJECTS_URL,
  VIEW_SUBJECT_URL,
  VIEW_TOPIC_URL
} from 'src/components/routes/routes';
import ViewEditTitleHeader from 'src/components/common/ViewEditTitleHeader';
import { BookOutlined } from '@ant-design/icons';
import { startCase } from 'lodash';
import StepsList from 'src/components/subjects/topic/StepsList';
import RichTextDisplay from 'src/components/common/RichTextDisplay';

const { Title, Text } = Typography;

const ViewTopic = () => {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();
  const { updateBreadcrumbItems } = React.useContext(breadcrumbContext);

  const [topic, setTopic] = React.useState<Topic | null>(null);
  const [selectedStep, setSelectedStep] = React.useState<Step | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const { title, status, steps } = topic || {};

  const currStepIdx = steps?.findIndex((step) => step.id === selectedStep?.id);

  const moveToNextStep = () => {
    if (currStepIdx !== undefined && steps && currStepIdx < steps.length - 1) {
      setSelectedStep(steps[currStepIdx + 1]);
    }
  };

  const moveToPreviousStep = () => {
    if (currStepIdx !== undefined && steps && currStepIdx > 0) {
      setSelectedStep(steps[currStepIdx - 1]);
    }
  };

  React.useEffect(() => {
    updateBreadcrumbItems([
      {
        label: 'Subjects',
        to: SUBJECTS_URL
      },
      ...(topic
        ? [
            {
              label: topic.subject?.title ?? 'Subject',
              to: generatePath(VIEW_SUBJECT_URL, { subjectId })
            },
            {
              label: topic.title,
              to: generatePath(VIEW_TOPIC_URL, { subjectId, topicId })
            }
          ]
        : [])
    ]);
  }, [updateBreadcrumbItems, topic, subjectId, topicId]);

  React.useEffect(() => {
    if (topicId) {
      setLoading(true);
      asyncFetchCallback(
        getTopicById(topicId),
        (res) => setTopic(res),
        () => void 0,
        { updateLoading: setLoading }
      );
    }
  }, [topicId]);

  React.useEffect(() => {
    if (steps?.length && !selectedStep) {
      setSelectedStep(steps.sort((a, b) => a.topicOrder - b.topicOrder)[0]);
    }
  }, [steps, selectedStep]);

  return (
    <Spin size='large' spinning={loading}>
      <div className='container-left-full'>
        <ViewEditTitleHeader
          title='View Topic'
          inEditMode={false}
          viewFunctions={{
            onEdit: () =>
              navigate(generatePath(EDIT_TOPIC_URL, { subjectId, topicId }))
          }}
        />
        <Card style={{ margin: '12px 0 24px' }}>
          <div className='container-spaced-out'>
            <Space align='center' size='middle'>
              <BookOutlined />
              <Title level={4} style={{ margin: 0 }}>
                {title}
              </Title>
            </Space>
            {status && (
              <Space>
                <span className={`status-dot-${status.toLowerCase()}`} />
                <Text>{startCase(status.toLowerCase())}</Text>
              </Space>
            )}
          </div>
        </Card>

        <div className='steps-container'>
          <div className='steps-sidebar'>
            <Title level={4} style={{ marginBottom: '16px' }}>
              Steps
            </Title>
            <StepsList
              steps={steps?.sort((a, b) => a.topicOrder - b.topicOrder) ?? []}
              selectedStep={selectedStep}
              updateSelectedStep={setSelectedStep}
            />
          </div>
          <div className='steps-editor'>
            <Title level={4} style={{ marginBottom: '0' }}>
              {selectedStep?.title ?? 'Step Title'}
            </Title>
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
                onClick={() => moveToNextStep()}
                disabled={steps && currStepIdx === steps.length - 1}
              >
                Next Step
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default ViewTopic;
