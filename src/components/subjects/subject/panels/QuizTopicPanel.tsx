import {
  BookOutlined,
  FileDoneOutlined,
  FileSearchOutlined,
  FolderOpenOutlined,
  RightOutlined
} from '@ant-design/icons';
import { Collapse, Space, Typography } from 'antd';
import { generatePath, Link, useParams } from 'react-router-dom';
import { EDIT_TOPIC_URL } from 'src/components/routes/routes';
import { Quiz, Topic } from 'src/models/types';
import '../../../../styles/subjects/editSubject.scss';
import { instanceOfQuiz, instanceOfTopic } from '../../subjectHelper';
import QuizTopicMoreButton from './QuizTopicMoreButton';

const { Title, Text } = Typography;
const { Panel } = Collapse;

type QuizTopicPanelProps = {
  quizOrTopic: Quiz | Topic;
};

const QuizTopicPanel = ({ quizOrTopic }: QuizTopicPanelProps) => {
  const { subjectId } = useParams();
  const quiz = instanceOfQuiz(quizOrTopic) ? (quizOrTopic as Quiz) : null;
  const topic = instanceOfTopic(quizOrTopic) ? (quizOrTopic as Topic) : null;

  const getExpandIcon = (isActive?: boolean) => {
    if (quiz) {
      return isActive ? <FileSearchOutlined /> : <FileDoneOutlined />;
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
        header={`${quizOrTopic.subjectOrder + 1}. ${quizOrTopic.title}`}
        key={1}
        extra={
          <Space align='center'>
            <span
              className={`status-dot-${quizOrTopic.status.toLowerCase()}`}
            />
            <QuizTopicMoreButton quizOrTopic={quizOrTopic} />
          </Space>
        }
      >
        <Space direction='vertical'>
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
                <Link to='/'>
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
