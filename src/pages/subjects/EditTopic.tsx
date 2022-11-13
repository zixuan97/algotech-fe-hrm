import { Button, Input, Select, Space, Spin, Typography } from 'antd';
import React from 'react';
import TextEditor from '../TextEditor';
import '../../styles/common/common.scss';
import '../../styles/subjects/editTopic.scss';
import { PlusOutlined } from '@ant-design/icons';
import { ContentStatus, Step, Topic } from 'src/models/types';
import { startCase } from 'lodash';
import StepsList from 'src/components/subjects/topic/StepsList';
import { stripHtml } from 'src/utils/formatUtils';
import { generatePath, useParams } from 'react-router-dom';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  createStep,
  getTopicById,
  updateStep,
  updateTopic
} from 'src/services/subjectService';
import breadcrumbContext from 'src/context/breadcrumbs/breadcrumbContext';
import {
  EDIT_SUBJECT_URL,
  EDIT_TOPIC_URL,
  SUBJECTS_URL
} from 'src/components/routes/routes';
import ViewEditTitleHeader from 'src/components/common/ViewEditTitleHeader';
import { getNewStep } from 'src/components/subjects/topic/topicHelper';

const { Title, Text } = Typography;
const { Option } = Select;

const EditTopic = () => {
  const { subjectId, topicId } = useParams();
  const { updateBreadcrumbItems } = React.useContext(breadcrumbContext);

  const [selectedStep, setSelectedStep] = React.useState<Step | null>(null);

  const [topic, setTopic] = React.useState<Topic | null>(null);
  const [editTopic, setEditTopic] = React.useState<Topic | null>(topic);
  const [getTopicLoading, setGetTopicLoading] = React.useState<boolean>(false);
  const [addStepLoading, setAddStepLoading] = React.useState<boolean>(false);
  const [updateTopicLoading, setUpdateTopicLoading] =
    React.useState<boolean>(false);

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
              to: generatePath(EDIT_SUBJECT_URL, { subjectId })
            },
            {
              label: topic.title,
              to: generatePath(EDIT_TOPIC_URL, { subjectId, topicId })
            }
          ]
        : [])
    ]);
  }, [updateBreadcrumbItems, topic, subjectId, topicId]);

  const fetchTopicById = (topicId: string | number) => {
    setGetTopicLoading(true);
    asyncFetchCallback(
      getTopicById(topicId),
      (res) => {
        setGetTopicLoading(false);
        setTopic(res);
      },
      () => setGetTopicLoading(false)
    );
  };

  React.useEffect(() => {
    if (topicId) {
      fetchTopicById(topicId);
    }
  }, [topicId]);

  React.useEffect(() => {
    if (topic) {
      setEditTopic(topic);
    }
  }, [topic]);

  React.useEffect(() => {
    if (topic?.steps.length && !selectedStep) {
      setSelectedStep(topic.steps[0]);
    }
  }, [topic?.steps, selectedStep]);

  const editNamedField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) =>
    setEditTopic(
      (prev) => prev && { ...prev, [e.target.name]: e.target.value }
    );

  const addStep = () => {
    if (editTopic) {
      setAddStepLoading(true);
      asyncFetchCallback(
        createStep(
          getNewStep(`Step ${editTopic.steps.length + 1}`, editTopic.id!)
        ),
        (res) => {
          fetchTopicById(editTopic.id);
          setSelectedStep(res);
        },
        () => void 0,
        { updateLoading: setAddStepLoading }
      );
    }
  };

  const updateTopicApiCall = (editTopic: Topic | null) => {
    if (editTopic) {
      setUpdateTopicLoading(true);
      asyncFetchCallback(
        updateTopic(editTopic),
        (res) => {
          fetchTopicById(editTopic.id);
        },
        () => void 0,
        { updateLoading: setUpdateTopicLoading }
      );
    }
  };

  const updateStepApiCall = (step: Step | null) => {
    if (step && topicId) {
      setUpdateTopicLoading(true);
      asyncFetchCallback(
        updateStep(step),
        (res) => {
          setSelectedStep(res);
          fetchTopicById(topicId);
        },
        () => void 0,
        { updateLoading: setUpdateTopicLoading }
      );
    }
  };

  return (
    <Spin size='large' spinning={getTopicLoading}>
      <div className='container-left-full'>
        <ViewEditTitleHeader
          title='Edit Topic'
          inEditMode={true}
          updateLoading={updateTopicLoading}
          lastUpdatedInfo={
            topic
              ? {
                  lastUpdatedAt: topic.subject.lastUpdatedAt,
                  lastUpdatedBy: topic.subject.lastUpdatedBy
                }
              : undefined
          }
        />
        <div
          className='container-spaced-out'
          style={{ width: '100%', margin: '12px 0px 24px' }}
        >
          <Space
            direction='vertical'
            style={{ width: '100%', flex: '0 0 80%' }}
          >
            <Text>Topic Name</Text>
            <Input
              name='title'
              size='large'
              placeholder='Topic Name'
              value={editTopic?.title}
              onChange={editNamedField}
              onBlur={() => updateTopicApiCall(editTopic)}
            />
          </Space>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>Status</Text>
            <Select
              size='large'
              style={{ width: '100%' }}
              value={editTopic?.status}
              onChange={(value) =>
                editTopic && updateTopicApiCall({ ...editTopic, status: value })
              }
            >
              {Object.values(ContentStatus).map((status) => (
                <Option key={status} value={status}>
                  <Space align='center'>
                    <span className={`status-dot-${status.toLowerCase()}`} />
                    <Text>{startCase(status.toLowerCase())}</Text>
                  </Space>
                </Option>
              ))}
            </Select>
          </Space>
        </div>
        <Title level={4}>Steps</Title>
        <div className='steps-container'>
          <div className='steps-sidebar'>
            <StepsList
              steps={editTopic?.steps ?? []}
              updateSteps={() => {}}
              selectedStep={selectedStep}
              updateSelectedStep={setSelectedStep}
            />
            <Button
              style={{ marginTop: '16px' }}
              block
              type='dashed'
              icon={<PlusOutlined />}
              onClick={() => addStep()}
              loading={addStepLoading}
            >
              Add Step
            </Button>
          </div>
          <div className='steps-editor'>
            <Input
              size='large'
              placeholder='Step Title'
              value={selectedStep?.title}
              onChange={(e) =>
                setSelectedStep(
                  (prev) => prev && { ...prev, title: e.target.value }
                )
              }
              onBlur={() => updateStepApiCall(selectedStep)}
            />
            <TextEditor
              content={selectedStep?.content}
              updateContent={(content: string) =>
                setSelectedStep((prev) =>
                  prev ? { ...prev, content: content } : null
                )
              }
              onBlur={() => updateStepApiCall(selectedStep)}
              style={{ flex: 0.8 }}
            />
            {/* strip html tags and count length of actual text including space */}
            <Text>{`Characters: ${
              stripHtml(selectedStep?.content).length
            }`}</Text>
            <Space style={{ alignSelf: 'flex-end' }}>
              <Button style={{ width: '10em' }}>Previous Step</Button>
              <Button style={{ width: '10em' }} type='primary'>
                Next Step
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default EditTopic;
