import {
  BookOutlined,
  FieldTimeOutlined,
  FolderOpenOutlined,
  ReconciliationOutlined,
  RightOutlined
} from '@ant-design/icons';
import { Collapse, Space, Typography } from 'antd';
import { generatePath, Link, useParams } from 'react-router-dom';
import { EDIT_QUIZ_URL, EDIT_TOPIC_URL } from 'src/components/routes/routes';
import { Quiz, Topic } from 'src/models/types';
import '../../../../styles/subjects/subject.scss';

import { instanceOfTopic } from '../../topic/topicHelper';
import { instanceOfQuiz } from '../quiz/quizHelper';
import QuizTopicMoreButton from './QuizTopicMoreButton';

const { Title, Text } = Typography;
const { Panel } = Collapse;

type QuizTopicPanelProps = {
  quizOrTopic: Quiz | Topic;
  quizzesAndTopics: (Quiz | Topic)[];
  refreshSubject?: () => void;
};

const QuizTopicPanel = ({
  quizOrTopic,
  quizzesAndTopics,
  refreshSubject
}: QuizTopicPanelProps) => {
  const { subjectId } = useParams();
  const quiz = instanceOfQuiz(quizOrTopic) ? (quizOrTopic as Quiz) : null;
  const topic = instanceOfTopic(quizOrTopic) ? (quizOrTopic as Topic) : null;

  const getExpandIcon = (isActive?: boolean) => {
    if (quiz) {
      return isActive ? <ReconciliationOutlined /> : <FieldTimeOutlined />;
    } else {
      return isActive ? <FolderOpenOutlined /> : <BookOutlined />;
    }
  };

  return (
    <Collapse
      style={{ marginBottom: '4px' }}
      expandIcon={({ isActive }) => getExpandIcon(isActive)}
    >
      <Panel
        header={`${quizOrTopic.subjectOrder}. ${quizOrTopic.title}`}
        key={quizOrTopic.subjectOrder}
        extra={
          <Space align='center'>
            <span
              className={`status-dot-${quizOrTopic.status.toLowerCase()}`}
            />
            <QuizTopicMoreButton
              currQuizOrTopic={quizOrTopic}
              quizzesAndTopics={quizzesAndTopics}
              refreshSubject={refreshSubject}
            />
          </Space>
        }
      >
        <Space direction='vertical'>
          <Title level={4}>{`${quiz ? 'Quiz' : 'Topic'} title: ${
            quizOrTopic.title
          }`}</Title>
          <Title level={5}>{topic ? 'Steps' : 'Questions'}</Title>
          {quiz &&
            (quiz.questions.length ? (
              quiz.questions.map((question, index) => (
                <Text
                  key={index}
                >{`${question.quizOrder}. ${question.question}`}</Text>
              ))
            ) : (
              <Space>
                <Text>No questions have been added yet.</Text>
                <Link
                  to={generatePath(EDIT_QUIZ_URL, {
                    subjectId,
                    quizId: quizOrTopic.id?.toString()
                  })}
                >
                  <Space size={4}>
                    Add a question
                    <RightOutlined />
                  </Space>
                </Link>
              </Space>
            ))}
          {topic &&
            (topic.steps.length ? (
              topic.steps.map((step, index) => (
                <Text key={index}>{`${step.topicOrder}. ${step.title}`}</Text>
              ))
            ) : (
              <Space>
                <Text>No steps have been added yet.</Text>
                <Link
                  to={generatePath(EDIT_TOPIC_URL, {
                    subjectId,
                    topicId: quizOrTopic.id?.toString()
                  })}
                >
                  <Space size={4}>
                    Add a step
                    <RightOutlined />
                  </Space>
                </Link>
              </Space>
            ))}
        </Space>
      </Panel>
    </Collapse>
  );
};

export default QuizTopicPanel;
