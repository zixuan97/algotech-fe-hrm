import { Button, Input, Select, Space, Spin, Typography } from 'antd';
import React from 'react';
import TextEditor from '../../components/common/TextEditor';
import '../../styles/common/common.scss';
import '../../styles/subjects/topic.scss';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { ContentStatus, Step, Topic } from 'src/models/types';
import { isEqual, startCase } from 'lodash';
import StepsList from 'src/components/subjects/topic/StepsList';
import { stripHtml } from 'src/utils/formatUtils';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  createStep,
  deleteTopic,
  getTopicById,
  updateStep,
  updateTopic
} from 'src/services/topicService';
import breadcrumbContext from 'src/context/breadcrumbs/breadcrumbContext';
import {
  EDIT_SUBJECT_URL,
  EDIT_TOPIC_URL,
  SUBJECTS_URL,
  VIEW_TOPIC_URL
} from 'src/components/routes/routes';
import ViewEditTitleHeader from 'src/components/common/ViewEditTitleHeader';
import { getNewStep } from 'src/components/subjects/topic/topicHelper';
import { useDebounceCallback } from 'src/hooks/useDebounce';

const { Title, Text } = Typography;
const { Option } = Select;

const EditTopic = () => {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();
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
      setSelectedStep(
        topic.steps.sort((a, b) => a.topicOrder - b.topicOrder)[0]
      );
    }
  }, [topic?.steps, selectedStep]);

  const currStepIdx = topic?.steps.findIndex(
    (step) => step.id === selectedStep?.id
  );

  const moveToNextStep = () => {
    if (
      currStepIdx !== undefined &&
      topic?.steps &&
      currStepIdx < topic.steps.length - 1
    ) {
      setSelectedStep(topic.steps[currStepIdx + 1]);
    }
  };

  const moveToPreviousStep = () => {
    if (currStepIdx !== undefined && topic?.steps && currStepIdx > 0) {
      setSelectedStep(topic.steps[currStepIdx - 1]);
    }
  };

  const updateNamedField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updatedTopic = editTopic && {
      ...editTopic,
      [e.target.name]: e.target.value
    };
    if (updatedTopic) {
      setEditTopic(updatedTopic);
      debouncedUpdateTopicApiCall(updatedTopic);
    }
  };

  const addStep = () => {
    if (editTopic) {
      setAddStepLoading(true);
      asyncFetchCallback(
        createStep(
          getNewStep(
            editTopic.id,
            editTopic.steps.length + 1,
            `Step ${editTopic.steps.length + 1}`
          )
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
    if (editTopic && !isEqual(editTopic, topic)) {
      setUpdateTopicLoading(true);
      asyncFetchCallback(
        updateTopic(editTopic),
        (res) => {
          fetchTopicById(editTopic.id);
        },
        (err) => console.log(err),
        { updateLoading: setUpdateTopicLoading }
      );
    }
  };

  const updateStepApiCall = (step: Step | null, refresh: boolean = true) => {
    if (step && topicId) {
      setUpdateTopicLoading(true);
      asyncFetchCallback(
        updateStep(step),
        (res) => {
          if (refresh) {
            setSelectedStep(res);
            fetchTopicById(topicId);
          }
        },
        () => void 0,
        { updateLoading: setUpdateTopicLoading }
      );
    }
  };

  const debouncedUpdateTopicApiCall = useDebounceCallback(updateTopicApiCall);
  const debouncedUpdateStepApiCall = useDebounceCallback(updateStepApiCall);
  const debouncedUpdateStepContent = useDebounceCallback(
    updateStepApiCall,
    1000
  );

  const updateContent = React.useCallback(
    (content: string) => {
      // // if (content !== selectedStep?.content) {
      // const updatedStep = selectedStep
      //   ? {
      //       ...selectedStep,
      //       content: content
      //     }
      //   : null;
      // console.log('rte', selectedStep?.title, updatedStep);
      // if (updatedStep) {
      //   // setSelectedStep(updatedStep);
      //   debouncedUpdateStepContent(updatedStep);
      // }
      // // }
      setSelectedStep((prev) => {
        if (prev && prev.content !== content) {
          const updatedStep = { ...prev, content };
          debouncedUpdateStepContent(updatedStep);
          return updatedStep;
        }
        return prev;
      });
    },
    [debouncedUpdateStepContent]
  );

  return (
    <Spin size='large' spinning={getTopicLoading}>
      <div className='container-left-full'>
        <ViewEditTitleHeader
          title='Edit Topic'
          inEditMode
          updateLoading={updateTopicLoading}
          editFunctions={{
            deleteModalProps: {
              title: 'Confirm Delete Topic',
              body: `Are you sure you want to delete ${editTopic?.title}?`,
              deleteSuccessContent: (
                <Space>
                  <Text>
                    {`Topic successfully deleted! Redirecting you back to ${editTopic?.subject.title} subject page...`}
                  </Text>
                  <LoadingOutlined />
                </Space>
              ),
              deleteRedirectUrl: generatePath(EDIT_SUBJECT_URL, { subjectId })
            },
            onView: () =>
              navigate(generatePath(VIEW_TOPIC_URL, { subjectId, topicId })),
            onDelete: async () => {
              editTopic && deleteTopic(editTopic.id);
            }
          }}
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
              onChange={updateNamedField}
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
        <div className='steps-container'>
          <div className='steps-sidebar'>
            <Title level={4}>Steps</Title>
            {!!editTopic?.steps.length ? (
              <StepsList
                steps={
                  editTopic?.steps.sort(
                    (a, b) => a.topicOrder - b.topicOrder
                  ) ?? []
                }
                selectedStep={selectedStep}
                updateSelectedStep={setSelectedStep}
                refreshTopic={() => {
                  editTopic && fetchTopicById(editTopic.id);
                }}
              />
            ) : (
              <Text>No steps in this topic.</Text>
            )}
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
            {selectedStep ? (
              <>
                <Input
                  size='large'
                  placeholder='Step Title'
                  value={selectedStep?.title}
                  onChange={(e) => {
                    const updatedStep = selectedStep && {
                      ...selectedStep,
                      title: e.target.value
                    };
                    if (updatedStep) {
                      setSelectedStep(updatedStep);
                      debouncedUpdateStepApiCall(updatedStep);
                    }
                  }}
                />
                <TextEditor
                  content={selectedStep?.content}
                  updateContent={updateContent}
                  // onBlur={() => updateStepApiCall(selectedStep)}
                  style={{ flex: 0.8 }}
                />
                {/* strip html tags and count length of actual text including space */}
                <Text>{`Characters: ${
                  stripHtml(selectedStep?.content).length
                }`}</Text>
                <Space style={{ alignSelf: 'flex-end' }}>
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
                    disabled={
                      topic?.steps && currStepIdx === topic.steps.length - 1
                    }
                  >
                    Next Step
                  </Button>
                </Space>
              </>
            ) : (
              <div>
                <Title level={4}>Step Content</Title>
                <Text>No step selected.</Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default EditTopic;
