import { EyeOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Button, Spin, Steps, Typography } from 'antd';
import React from 'react';
import { generatePath, useParams, useSearchParams } from 'react-router-dom';
import {
  ASSIGNED_SUBJECT_URL,
  MY_SUBJECTS_URL
} from 'src/components/routes/routes';
import { reorderTopicsAndQuizzes } from 'src/components/subjects/subjectHelper';
import { instanceOfTopic } from 'src/components/subjects/topic/topicHelper';
import authContext from 'src/context/auth/authContext';
import breadcrumbContext from 'src/context/breadcrumbs/breadcrumbContext';
import { EmployeeSubjectRecord } from 'src/models/types';
import { getSubjectRecordById } from 'src/services/subjectRecordService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  convertBooleanToString,
  convertStringToBoolean
} from 'src/utils/formatUtils';
import '../../styles/common/common.scss';

const { Title } = Typography;

const AssignedSubject = () => {
  const { subjectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const attempt = convertStringToBoolean(searchParams.get('attempt'));
  const { user } = React.useContext(authContext);
  const { updateBreadcrumbItems } = React.useContext(breadcrumbContext);

  const [record, setRecord] = React.useState<EmployeeSubjectRecord | null>(
    null
  );
  const [loading, setLoading] = React.useState<boolean>(false);

  console.log(searchParams, attempt);

  const { subject } = record || {};

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

  React.useEffect(() => {
    if (subjectId && user) {
      setLoading(true);
      asyncFetchCallback(
        getSubjectRecordById(subjectId, user.id),
        setRecord,
        () => void 0,
        { updateLoading: setLoading }
      );
    }
  }, [subjectId, user]);

  console.log(subject);

  return (
    <Spin size='large' spinning={loading}>
      <div className='container-left-full'>
        <div className='container-spaced-out'>
          <Title level={2}>Subject</Title>
          <Button
            size='large'
            onClick={() => {
              attempt
                ? searchParams.delete('attempt')
                : searchParams.set('attempt', convertBooleanToString(!attempt));
              setSearchParams(searchParams);
            }}
            icon={attempt ? <EyeOutlined /> : <PlayCircleOutlined />}
            type={attempt ? 'default' : 'primary'}
          >
            {attempt ? 'View' : 'Start'}
          </Button>
        </div>
        {subject && (
          <Steps>
            {reorderTopicsAndQuizzes(subject.topics, subject.quizzes).map(
              (quizOrTopic) => (
                <Steps.Step
                  title={quizOrTopic.title}
                  description={instanceOfTopic(quizOrTopic) ? 'Topic' : 'Quiz'}
                />
              )
            )}
          </Steps>
        )}
      </div>
    </Spin>
  );
};

export default AssignedSubject;
