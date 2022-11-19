import {
  BookOutlined,
  CheckOutlined,
  FieldTimeOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import { Button, Card, Empty, Layout, Space, Steps, Typography } from 'antd';
import React from 'react';
import { Quiz, Topic } from 'src/models/types';
import { instanceOfQuiz } from '../subject/quiz/quizHelper';
import { instanceOfTopic } from '../topic/topicHelper';
import '../../../styles/subjects/quiz.scss';

const { Title, Text } = Typography;
const { Sider } = Layout;

type QuizTopicSidebarProps = {
  quizzesAndTopics: (Quiz | Topic)[];
  selectedQuizOrTopic: Quiz | Topic | null;
  checkCompleted: (quizOrTopic: Quiz | Topic) => boolean;
  updateSelectedQuizOrTopic: (quizOrTopic: Quiz | Topic) => void;
  attempt: boolean;
};

const QuizTopicSidebar = ({
  quizzesAndTopics,
  selectedQuizOrTopic,
  checkCompleted,
  updateSelectedQuizOrTopic,
  attempt
}: QuizTopicSidebarProps) => {
  const currentStep = selectedQuizOrTopic
    ? quizzesAndTopics.findIndex(
        (toFind) =>
          toFind.id === selectedQuizOrTopic.id &&
          ((instanceOfTopic(toFind) && instanceOfTopic(selectedQuizOrTopic)) ||
            (instanceOfQuiz(toFind) && instanceOfQuiz(selectedQuizOrTopic)))
      )
    : -1;

  const [collapsed, setCollapsed] = React.useState<boolean>(false);

  const getStepIcon = (quizOrTopic: Quiz | Topic) => {
    if (!attempt) return <BookOutlined />;
    return checkCompleted(quizOrTopic) ? (
      <CheckOutlined />
    ) : instanceOfQuiz(quizOrTopic) ? (
      <FieldTimeOutlined />
    ) : (
      <BookOutlined />
    );
  };

  return (
    <Sider
      // collapsible
      style={{ height: '100%', overflow: 'auto' }}
      collapsed={collapsed}
      collapsedWidth={100}
      // onCollapse={(value) => setCollapsed(value)}
    >
      <Card>
        <div
          className='quiz-sidebar'
          //   direction='vertical'
          //   size='large'
          //   align='center'
          //   style={{
          //     display: 'flex',
          //     width: '100%',
          //     padding: '10px'
          //   }}
        >
          {!collapsed && (
            <Space direction='vertical'>
              <Title level={4}>Topics{attempt && ' & Quizzes'}</Title>
              <Text>
                {attempt
                  ? 'All assigned topics & quizzes.'
                  : 'Navigate through topics here.'}
              </Text>
            </Space>
          )}
          {/* {collapsed ? (
            <Steps
              size='small'
              direction='vertical'
              onChange={(current) => console.log(current)}
            >
              {quizzesAndTopics.map((quizOrTopic) => (
                <Steps.Step key={quizOrTopic.id} />
              ))}
            </Steps>
          ) : (
            <>
              <Title level={4}>Topics & Quizzes</Title> */}
          {quizzesAndTopics.length ? (
            <Steps
              size='small'
              direction='vertical'
              onChange={(current) => {
                //   setCurrentStep(current);
                if (current >= 0 && current < quizzesAndTopics.length) {
                  updateSelectedQuizOrTopic(quizzesAndTopics[current]);
                }
              }}
              current={currentStep}
            >
              {quizzesAndTopics.map((quizOrTopic, index) => (
                <Steps.Step
                  key={quizOrTopic.id}
                  title={!collapsed && `${index + 1}. ${quizOrTopic.title}`}
                  description={
                    !collapsed &&
                    (instanceOfTopic(quizOrTopic) ? 'Topic' : 'Quiz')
                  }
                  icon={
                    <div style={{ fontSize: '0.75em' }}>
                      {getStepIcon(quizOrTopic)}
                    </div>
                  }
                />
              ))}
            </Steps>
          ) : (
            <Empty description={`No topics${attempt ? ' or quizzes' : ''}.`} />
          )}
          <Button
            icon={collapsed ? <LeftOutlined /> : <RightOutlined />}
            onClick={() => setCollapsed((prev) => !prev)}
            block
          />
        </div>
      </Card>
    </Sider>
  );
};

export default QuizTopicSidebar;
