import {
  DeleteOutlined,
  LoadingOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { Button, Card, Divider, Input, Select, Space, Typography } from 'antd';
import React from 'react';
import { AnswerType, QuizQuestion } from 'src/models/types';
import { updateQuizQuestion } from 'src/services/quizService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  getDefaultOption,
  TRUE_FALSE_OPTIONS
} from '../subject/quiz/quizHelper';
import QuestionMoreButton from './QuestionMoreButton';

const { Title, Text } = Typography;
const { Option } = Select;

const getAnswerTypeString = (type: AnswerType) => {
  switch (type) {
    case AnswerType.MCQ:
      return 'Multiple Choice';
    case AnswerType.TRUEFALSE:
      return 'True or False';
    default:
      return '';
  }
};

type QuestionOptionProps = {
  option: string;
  options: string[];
  updateOption: (option: string) => void;
  isCorrect: boolean;
  updateIsCorrect: (idx: number) => void;
  index: number;
  type: AnswerType;
  onDelete?: () => void;
};

const QuestionOption = ({
  option,
  options,
  updateOption,
  type,
  index,
  isCorrect,
  updateIsCorrect,
  onDelete
}: QuestionOptionProps) => {
  const [editOption, setEditOption] = React.useState<string>(option);

  return (
    <div
      className='container-spaced-out'
      style={{ alignItems: 'center', gap: '8px' }}
    >
      <Text style={{ width: '1em' }}>{`${index + 1}.`}</Text>
      <Input
        value={editOption}
        disabled={type === AnswerType.TRUEFALSE}
        // size='large'
        onChange={(e) => {
          setEditOption(e.target.value);
          // if (
          //   e.target.value.length === 0 ||
          //   containsOption(e.target.value, options)
          // ) {
          //   setShouldWarn(true);
          // } else {
          //   setShouldWarn(false);
          // }
        }}
        onBlur={() => updateOption(editOption)}
      />
      <Button
        type={isCorrect ? 'primary' : 'default'}
        // size='large'
        onClick={() => {
          if (!isCorrect) {
            updateIsCorrect(index);
          }
        }}
      >
        Correct Answer
      </Button>
      {/* {shouldWarn && (
        <Tooltip title={getTooltipMsg()} placement='bottomRight'>
          <WarningOutlined style={{ color: '#faad14' }} />
        </Tooltip>
      )} */}
      {type === AnswerType.MCQ && (
        <Button
          // size='large'
          icon={<DeleteOutlined />}
          shape='circle'
          onClick={onDelete}
        />
      )}
    </div>
  );
};

type QuestionEditCardProps = {
  quizQuestion: QuizQuestion;
  questions: QuizQuestion[];
  refreshQuiz: () => void;
};

const QuestionEditCard = ({
  quizQuestion,
  questions,
  refreshQuiz
}: QuestionEditCardProps) => {
  const [editQuizQuestion, setEditQuizQuestion] =
    React.useState<QuizQuestion>(quizQuestion);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { question, quizOrder, type, options, correctAnswer } =
    editQuizQuestion;

  const updateQuizQuestionApiCall = React.useCallback(
    (quizQuestion: QuizQuestion) => {
      setLoading(true);
      asyncFetchCallback(
        updateQuizQuestion(quizQuestion),
        (res) => refreshQuiz(),
        () => void 0,
        { updateLoading: setLoading }
      );
    },
    []
  );

  React.useEffect(() => {
    setEditQuizQuestion(quizQuestion);
  }, [quizQuestion]);

  React.useEffect(() => {
    if (
      editQuizQuestion.correctAnswer > 0 &&
      editQuizQuestion.correctAnswer >= options.length
    ) {
      const updatedQuestion = {
        ...editQuizQuestion,
        correctAnswer: 0
      };
      setEditQuizQuestion(updatedQuestion);
      updateQuizQuestionApiCall(updatedQuestion);
    }
  }, [
    editQuizQuestion.correctAnswer,
    editQuizQuestion,
    type,
    options,
    updateQuizQuestionApiCall
  ]);

  return (
    <Card>
      <div className='container-spaced-out' style={{ alignItems: 'center' }}>
        <Title level={5}>{`Question ${quizOrder}`}</Title>
        <Space>
          {loading && (
            <Card bodyStyle={{ padding: '4px 16px' }}>
              <Space>
                <Text>Updating Question...</Text>
                <LoadingOutlined />
              </Space>
            </Card>
          )}
          <QuestionMoreButton
            currQuestion={quizQuestion}
            questions={questions}
            refreshQuiz={refreshQuiz}
          />
        </Space>
      </div>
      <Divider style={{ marginTop: '12px' }} />
      <Space direction='vertical' style={{ width: '100%' }} size='large'>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Text>Question</Text>
          <Input.TextArea
            placeholder='Question'
            name='description'
            rows={3}
            value={question}
            onChange={(e) =>
              setEditQuizQuestion((prev) => ({
                ...prev,
                question: e.target.value
              }))
            }
            onBlur={() => updateQuizQuestionApiCall(editQuizQuestion)}
          />
        </Space>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Text>Question Type</Text>
          <Select
            style={{ width: '100%' }}
            value={type}
            onChange={(value) => {
              const updatedQuestion = {
                ...editQuizQuestion,
                type: value,
                correctAnswer: 0
              };
              if (value === AnswerType.TRUEFALSE) {
                updatedQuestion['options'] = TRUE_FALSE_OPTIONS;
              }
              setEditQuizQuestion(updatedQuestion);
              updateQuizQuestionApiCall(updatedQuestion);
            }}
          >
            {Object.values(AnswerType).map((type) => (
              <Option key={type} value={type}>
                {getAnswerTypeString(type)}
              </Option>
            ))}
          </Select>
        </Space>
        <Space direction='vertical' style={{ width: '100%' }} size='middle'>
          <Text>Options</Text>
          <Space
            direction='vertical'
            style={{ width: '100%', marginBottom: options.length ? '8px' : 0 }}
            // size='middle'
          >
            {(type === AnswerType.MCQ ? options : TRUE_FALSE_OPTIONS).map(
              (option, index) => (
                <QuestionOption
                  key={index}
                  type={type}
                  option={option}
                  options={options}
                  updateOption={(updatedOption) => {
                    const updatedOptions = [...options];
                    updatedOptions[index] = updatedOption;
                    const updatedQuestion = {
                      ...editQuizQuestion,
                      options: updatedOptions
                    };
                    setEditQuizQuestion(updatedQuestion);
                    updateQuizQuestionApiCall(updatedQuestion);
                  }}
                  index={index}
                  isCorrect={index === correctAnswer}
                  updateIsCorrect={(index) => {
                    const updatedQuestion = {
                      ...editQuizQuestion,
                      correctAnswer: index
                    };
                    setEditQuizQuestion(updatedQuestion);
                    updateQuizQuestionApiCall(updatedQuestion);
                  }}
                  onDelete={() => {
                    const updatedOptions = [...options];
                    updatedOptions.splice(index, 1);
                    const updatedQuestion = {
                      ...editQuizQuestion,
                      options: updatedOptions
                    };
                    setEditQuizQuestion(updatedQuestion);
                    updateQuizQuestionApiCall(updatedQuestion);
                  }}
                />
              )
            )}
          </Space>
          {type === AnswerType.MCQ && (
            <Button
              icon={<PlusOutlined />}
              type='primary'
              onClick={() => {
                const updatedQuestion = {
                  ...editQuizQuestion,
                  options: [...options, getDefaultOption(options.length + 1)]
                };
                setEditQuizQuestion(updatedQuestion);
                updateQuizQuestionApiCall(updatedQuestion);
              }}
              disabled={options.length >= 5}
            >
              Add Option
            </Button>
          )}
        </Space>
      </Space>
    </Card>
  );
};

export default QuestionEditCard;
