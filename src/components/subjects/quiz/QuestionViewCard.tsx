import { Alert, Card, Divider, Space, Typography } from 'antd';
import { QuizQuestion } from 'src/models/types';
import { getAnswerTypeString } from './QuestionEditCard';

const { Title, Text, Paragraph } = Typography;

type QuestionViewCardProps = {
  quizQuestion: QuizQuestion;
};

const QuestionViewCard = ({ quizQuestion }: QuestionViewCardProps) => {
  const { question, type, quizOrder, options, correctAnswer } = quizQuestion;
  return (
    <Card>
      <Title level={5}>{`Question ${quizOrder}`}</Title>
      <Divider />
      <Space direction='vertical' style={{ width: '100%' }} size='large'>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Title level={5}>Question</Title>
          <Paragraph style={{ margin: 0 }}>{question}</Paragraph>
        </Space>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Title level={5}>Question Type</Title>
          <Text>{getAnswerTypeString(type)}</Text>
        </Space>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Title level={5}>Options</Title>
          <Space direction='vertical' size='middle'>
            {options.map((opt, index) => (
              <Space key={index}>
                <div style={{ width: '1em' }}>
                  <Text>{`${index + 1}.`}</Text>
                </div>
                {/* <Text>{opt}</Text>
                {index === correctAnswer && (
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                )} */}
                {index === correctAnswer ? (
                  <Alert message={opt} type='success' showIcon />
                ) : (
                  <Text>{opt}</Text>
                )}
              </Space>
            ))}
          </Space>
        </Space>
      </Space>
    </Card>
  );
};

export default QuestionViewCard;
