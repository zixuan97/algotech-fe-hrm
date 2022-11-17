import { FieldTimeOutlined } from '@ant-design/icons';
import { Card, Space, Spin, Typography } from 'antd';
import { startCase } from 'lodash';
import React from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import ViewEditTitleHeader from 'src/components/common/ViewEditTitleHeader';
import {
  EDIT_QUIZ_URL,
  SUBJECTS_URL,
  VIEW_QUIZ_URL,
  VIEW_SUBJECT_URL
} from 'src/components/routes/routes';
import breadcrumbContext from 'src/context/breadcrumbs/breadcrumbContext';
import { Quiz } from 'src/models/types';
import { getQuizById } from 'src/services/quizService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import '../../styles/common/common.scss';
import '../../styles/subjects/quiz.scss';

const { Title, Text } = Typography;

const ViewQuiz = () => {
  const { subjectId, quizId } = useParams();
  const navigate = useNavigate();
  const { updateBreadcrumbItems } = React.useContext(breadcrumbContext);

  const [quiz, setQuiz] = React.useState<Quiz | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const { title, status } = quiz || {};

  React.useEffect(() => {
    updateBreadcrumbItems([
      {
        label: 'Subjects',
        to: SUBJECTS_URL
      },
      ...(quiz
        ? [
            {
              label: quiz.subject?.title ?? 'Subject',
              to: generatePath(VIEW_SUBJECT_URL, { subjectId })
            },
            {
              label: quiz.title,
              to: generatePath(VIEW_QUIZ_URL, { subjectId, quizId })
            }
          ]
        : [])
    ]);
  }, [updateBreadcrumbItems, quiz, subjectId, quizId]);

  React.useEffect(() => {
    if (quizId) {
      setLoading(true);
      asyncFetchCallback(
        getQuizById(quizId),
        (res) => setQuiz(res),
        () => void 0,
        { updateLoading: setLoading }
      );
    }
  }, [quizId]);

  return (
    <Spin size='large' spinning={loading}>
      <div className='container-left-full'>
        <ViewEditTitleHeader
          title='View Quiz'
          inEditMode={false}
          viewFunctions={{
            onEdit: () =>
              navigate(generatePath(EDIT_QUIZ_URL, { subjectId, quizId }))
          }}
        />
        <Card style={{ margin: '12px 0 24px' }}>
          <div className='container-spaced-out'>
            <Space align='center' size='middle'>
              <FieldTimeOutlined />
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
      </div>
    </Spin>
  );
};

export default ViewQuiz;
