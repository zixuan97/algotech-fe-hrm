import React from 'react';
import { Card, Space, Spin, Typography } from 'antd';
import { Subject } from 'src/models/types';
import '../../styles/common/common.scss';
import '../../styles/subjects/subject.scss';
import ViewEditTitleHeader from 'src/components/common/ViewEditTitleHeader';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getSubjectById } from 'src/services/subjectService';
import breadcrumbContext from 'src/context/breadcrumbs/breadcrumbContext';
import {
  EDIT_SUBJECT_URL,
  SUBJECTS_URL,
  VIEW_SUBJECT_URL
} from 'src/components/routes/routes';
import SubjectDetailsCard from 'src/components/subjects/subject/cards/SubjectDetailsCard';
import UsersAssignedCard from 'src/components/subjects/subject/cards/UsersAssignedCard';
import CompletionRateCard from 'src/components/subjects/subject/cards/CompletionRateCard';
import { sortTopicsAndQuizzesArr } from 'src/components/subjects/subjectHelper';
import QuizTopicPanel from 'src/components/subjects/subject/panels/QuizTopicPanel';
import { getSubjectTypeIcon } from './AllSubjects';
import { startCase } from 'lodash';

const { Title, Text, Paragraph } = Typography;

const ViewSubject = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { updateBreadcrumbItems } = React.useContext(breadcrumbContext);

  const [subject, setSubject] = React.useState<Subject | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const {
    title,
    description,
    isPublished,
    type,
    createdAt,
    createdBy,
    lastUpdatedAt,
    lastUpdatedBy,
    usersAssigned,
    completionRate,
    topics,
    quizzes
  } = subject || {};

  const orderedTopicsAndQuizzes = React.useMemo(
    () =>
      topics && quizzes ? sortTopicsAndQuizzesArr([...topics, ...quizzes]) : [],
    [topics, quizzes]
  );

  React.useEffect(() => {
    if (subjectId) {
      setLoading(true);
      asyncFetchCallback(
        getSubjectById(subjectId),
        (res) => setSubject(res),
        () => void 0,
        { updateLoading: setLoading }
      );
    }
  }, [subjectId]);

  React.useEffect(() => {
    updateBreadcrumbItems([
      { label: 'Subjects', to: SUBJECTS_URL },
      ...(subject
        ? [
            {
              label: subject ? subject.title : 'View',
              to: generatePath(VIEW_SUBJECT_URL, { subjectId: subjectId })
            }
          ]
        : [])
    ]);
  }, [updateBreadcrumbItems, subjectId, subject]);

  return (
    <Spin size='large' spinning={loading}>
      <div className='container-left-full'>
        <ViewEditTitleHeader
          title='View Subject'
          inEditMode={false}
          viewFunctions={{
            onEdit: () =>
              navigate(generatePath(EDIT_SUBJECT_URL, { subjectId }))
          }}
        />
        <Space
          direction='vertical'
          size='middle'
          style={{ paddingBottom: '48px' }}
        >
          <Card style={{ marginTop: '12px', paddingBottom: '12px' }}>
            <Space direction='vertical' style={{ width: '100%' }}>
              <Title level={4} style={{ marginBottom: '16px' }}>
                {title}
              </Title>
              {description && <Paragraph>{description}</Paragraph>}
              {type && (
                <Card
                  style={{ width: 'fit-content' }}
                  bodyStyle={{ padding: '12px 32px 12px 24px' }}
                >
                  <Space align='center' size='middle'>
                    {getSubjectTypeIcon(type)}
                    <Text>{`${startCase(type.toLowerCase())} Subject`}</Text>
                  </Space>
                </Card>
              )}
            </Space>
          </Card>
          <div className='subject-card-container'>
            <SubjectDetailsCard
              createdBy={createdBy}
              createdAt={createdAt}
              lastUpdatedBy={lastUpdatedBy}
              lastUpdatedAt={lastUpdatedAt}
              isPublished={isPublished}
            />
            <UsersAssignedCard
              usersAssigned={usersAssigned ?? []}
              subjectTitle={title}
            />
            <CompletionRateCard
              completionRate={completionRate}
              usersAssigned={usersAssigned ?? []}
            />
          </div>
          <Title level={4}>Topics & Quizzes</Title>
          {!!orderedTopicsAndQuizzes.length ? (
            orderedTopicsAndQuizzes.map((item, index) => (
              <QuizTopicPanel
                key={index}
                quizOrTopic={item}
                quizzesAndTopics={orderedTopicsAndQuizzes}
              />
            ))
          ) : (
            <Text>No topics or quizzes for this subject yet.</Text>
          )}
        </Space>
      </div>
    </Spin>
  );
};

export default ViewSubject;
