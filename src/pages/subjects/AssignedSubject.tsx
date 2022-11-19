import { EyeOutlined, PlayCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Layout,
  Progress,
  Result,
  Space,
  Spin,
  Typography
} from 'antd';
import { startCase } from 'lodash';
import React from 'react';
import {
  generatePath,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom';
import {
  ASSIGNED_SUBJECT_URL,
  MY_SUBJECTS_URL
} from 'src/components/routes/routes';
import AssignedQuiz from 'src/components/subjects/assigned/AssignedQuiz';
import AssignedTopic from 'src/components/subjects/assigned/AssignedTopic';
import QuizTopicSidebar from 'src/components/subjects/assigned/QuizTopicSidebar';
import {
  isQuizOrTopicCompleted,
  reorderTopicsAndQuizzes
} from 'src/components/subjects/subjectHelper';
import { instanceOfTopic } from 'src/components/subjects/topic/topicHelper';
import authContext from 'src/context/auth/authContext';
import breadcrumbContext from 'src/context/breadcrumbs/breadcrumbContext';
import {
  ContentStatus,
  EmployeeSubjectRecord,
  Quiz,
  Topic,
  User
} from 'src/models/types';
import { getSubjectRecordById } from 'src/services/subjectRecordService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  convertBooleanToString,
  convertStringToBoolean
} from 'src/utils/formatUtils';
import '../../styles/common/common.scss';
import '../../styles/subjects/assignedSubject.scss';
import { getSubjectTypeIcon } from './AllSubjects';

const { Title, Text } = Typography;
const { Content } = Layout;

const AssignedSubject = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const attempt = convertStringToBoolean(searchParams.get('attempt'));
  const { user } = React.useContext(authContext);
  const { updateBreadcrumbItems } = React.useContext(breadcrumbContext);

  const [record, setRecord] = React.useState<EmployeeSubjectRecord | null>(
    null
  );
  const [selectedQuizOrTopic, setSelectedQuizOrTopic] = React.useState<
    Quiz | Topic | null
  >(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const { subject, completedTopics, completedQuizzes } = record || {};

  const quizzesAndTopics = React.useMemo(
    () =>
      (attempt
        ? reorderTopicsAndQuizzes(subject?.topics ?? [], subject?.quizzes ?? [])
        : subject?.topics ?? []
      ).filter((quizOrTopic) => quizOrTopic.status === ContentStatus.FINISHED),
    [subject, attempt]
  );

  React.useEffect(() => {
    updateBreadcrumbItems([
      { label: 'My Subjects', to: MY_SUBJECTS_URL },
      ...(record
        ? [
            {
              label: record.subject.title,
              to: generatePath(ASSIGNED_SUBJECT_URL, { subjectId })
            }
          ]
        : [])
    ]);
  }, [updateBreadcrumbItems, record, subjectId]);

  const fetchSubjectRecordById = (subjectId: string | number, user: User) => {
    setLoading(true);
    asyncFetchCallback(
      getSubjectRecordById(subjectId, user.id),
      setRecord,
      () => void 0,
      { updateLoading: setLoading }
    );
  };

  React.useEffect(() => {
    if (subjectId && user) {
      fetchSubjectRecordById(subjectId, user);
    }
  }, [subjectId, user]);

  React.useEffect(() => {
    if (!quizzesAndTopics.length) return;
    if (attempt && record?.completionRate === 100) {
      setTimeout(() => setSelectedQuizOrTopic(null), 500);
    }
    if (attempt) {
      let currIdx = 0;
      while (
        currIdx < quizzesAndTopics.length &&
        isQuizOrTopicCompleted(
          quizzesAndTopics[currIdx],
          completedQuizzes,
          completedTopics
        )
      ) {
        currIdx++;
      }

      if (currIdx === quizzesAndTopics.length) {
      } else {
        setSelectedQuizOrTopic(quizzesAndTopics[currIdx]);
      }
    } else {
      setSelectedQuizOrTopic(quizzesAndTopics[0]);
    }
  }, [
    quizzesAndTopics,
    attempt,
    completedQuizzes,
    completedTopics,
    record?.completionRate
  ]);

  return (
    <Spin size='large' spinning={loading}>
      <div className='container-left-full' id='subject-container'>
        <div className='container-spaced-out' style={{ marginBottom: '12px' }}>
          <Title level={2}>Subject</Title>
          <Space size='large'>
            {attempt && <Text>You're attempting this subject now.</Text>}
            <Button
              style={{ minWidth: '100px' }}
              size='large'
              onClick={() => {
                attempt
                  ? searchParams.delete('attempt')
                  : searchParams.set(
                      'attempt',
                      convertBooleanToString(!attempt)
                    );
                setSearchParams(searchParams);
              }}
              icon={attempt ? <EyeOutlined /> : <PlayCircleOutlined />}
              type={attempt ? 'default' : 'primary'}
            >
              {attempt ? 'View' : 'Attempt'}
            </Button>
          </Space>
        </div>
        <Space direction='vertical' size='middle'>
          <Card>
            {subject && (
              <div
                className='container-spaced-out'
                style={{ alignItems: 'center' }}
              >
                <div
                  className='assigned-subject-header'
                  //  style={{ width: '40%' }}
                >
                  <Title level={2} style={{ margin: 0 }}>
                    {subject.title}
                  </Title>
                  {attempt && (
                    <div style={{ width: '60%' }}>
                      <Text>My progress</Text>
                      <Progress percent={record?.completionRate} />
                    </div>
                  )}
                </div>
                <Card
                  style={{ width: 'fit-content' }}
                  bodyStyle={{ padding: '12px 32px 12px 24px' }}
                >
                  <Space align='center' size='middle'>
                    {getSubjectTypeIcon(subject.type)}
                    <Text>{`${startCase(
                      subject.type.toLowerCase()
                    )} Subject`}</Text>
                  </Space>
                </Card>
              </div>
            )}
          </Card>
          <Layout>
            <Layout>
              <Content>
                {selectedQuizOrTopic ? (
                  instanceOfTopic(selectedQuizOrTopic) ? (
                    <AssignedTopic
                      attempt={attempt}
                      topic={selectedQuizOrTopic as Topic}
                      isComplete={isQuizOrTopicCompleted(
                        selectedQuizOrTopic,
                        completedQuizzes,
                        completedTopics
                      )}
                      refreshRecord={() =>
                        subjectId &&
                        user &&
                        fetchSubjectRecordById(subjectId, user)
                      }
                      moveToNext={() => {
                        const currIdx = quizzesAndTopics.findIndex(
                          (toFind) => toFind.id === selectedQuizOrTopic.id
                        );
                        if (currIdx < quizzesAndTopics.length - 1) {
                          setSelectedQuizOrTopic(quizzesAndTopics[currIdx + 1]);
                        } else if (currIdx === quizzesAndTopics.length - 1) {
                          console.log('finished');
                        }
                      }}
                    />
                  ) : (
                    <AssignedQuiz
                      quiz={selectedQuizOrTopic as Quiz}
                      isComplete={isQuizOrTopicCompleted(
                        selectedQuizOrTopic,
                        completedQuizzes,
                        completedTopics
                      )}
                      refreshRecord={() =>
                        subjectId &&
                        user &&
                        fetchSubjectRecordById(subjectId, user)
                      }
                      moveToNext={() => {
                        const currIdx = quizzesAndTopics.findIndex(
                          (toFind) => toFind.id === selectedQuizOrTopic.id
                        );
                        if (currIdx < quizzesAndTopics.length - 1) {
                          setSelectedQuizOrTopic(quizzesAndTopics[currIdx + 1]);
                        } else if (currIdx === quizzesAndTopics.length - 1) {
                          console.log('finished');
                        }
                      }}
                    />
                  )
                ) : record?.completionRate === 100 && !loading ? (
                  <Result
                    status='success'
                    title='Successfully completed subject!'
                    subTitle={`You've successfully completed all assigned topics and quizzes in ${subject?.title}!`}
                    extra={
                      <Space style={{ marginTop: '12px' }}>
                        <Button
                          size='large'
                          style={{ width: '12em' }}
                          icon={<EyeOutlined />}
                          onClick={() => {
                            searchParams.delete('attempt');
                            setSearchParams(searchParams);
                          }}
                        >
                          View Subject
                        </Button>
                        <Button
                          size='large'
                          style={{ width: '12em' }}
                          type='primary'
                          onClick={() => navigate(MY_SUBJECTS_URL)}
                        >
                          Go to My Subjects
                        </Button>
                      </Space>
                    }
                  />
                ) : (
                  <Text>No topic {attempt && 'or quiz '} selected yet.</Text>
                )}
              </Content>
            </Layout>
            <QuizTopicSidebar
              quizzesAndTopics={quizzesAndTopics}
              selectedQuizOrTopic={selectedQuizOrTopic}
              checkCompleted={(quizOrTopic) =>
                isQuizOrTopicCompleted(
                  quizOrTopic,
                  completedQuizzes,
                  completedTopics
                )
              }
              updateSelectedQuizOrTopic={setSelectedQuizOrTopic}
              attempt={attempt}
            />
          </Layout>
        </Space>
      </div>
    </Spin>
  );
};

export default AssignedSubject;
