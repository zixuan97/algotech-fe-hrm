import { Alert, Card, Divider, Radio, Space, Typography } from 'antd';
import { QuizQuestion } from 'src/models/types';
import '../../../styles/common/common.scss';

const { Title, Text, Paragraph } = Typography;

type AssignedQuestionCardProps = {
  quizQuestion: QuizQuestion;
  isCorrect: boolean | null;
  answer: number;
  updateAnswer: (answer: number) => void;
};

const AssignedQuestionCard = ({
  quizQuestion,
  isCorrect,
  answer,
  updateAnswer
}: AssignedQuestionCardProps) => {
  const { quizOrder, question, options } = quizQuestion;
  //   const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(
  //     null
  //   );
  return (
    <Card style={{ paddingBottom: '12px' }}>
      <div className='container-spaced-out'>
        <Title level={5}>{`Question ${quizOrder}`}</Title>
        {isCorrect !== null && (
          <Alert
            type={isCorrect ? 'success' : 'error'}
            message={isCorrect ? 'Correct' : 'Wrong'}
            showIcon
          />
        )}
      </div>
      <Divider />
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <Paragraph style={{ margin: 0 }}>{question}</Paragraph>
        <Radio.Group
          onChange={(e) => updateAnswer(e.target.value)}
          value={answer}
        >
          <Space direction='vertical' size='middle'>
            {options.map((opt, index) => (
              <Radio key={index} value={index} style={{ gap: '0.75em' }}>
                {opt}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Space>
    </Card>
  );
};

export default AssignedQuestionCard;
