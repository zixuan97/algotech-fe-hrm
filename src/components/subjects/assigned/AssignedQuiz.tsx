import { FieldTimeOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Space, Typography } from 'antd';
import React from 'react';
import { EmployeeQuizQuestionRecord, Quiz } from 'src/models/types';
import { createQuizQuestionRecord } from 'src/services/quizService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import '../../../styles/common/common.scss';
import '../../../styles/subjects/quiz.scss';
import { convertMapToQuizQuestionAnswers } from '../subject/quiz/quizHelper';
import AssignedQuestionCard from './AssignedQuestionCard';

const { Title, Text, Paragraph } = Typography;

type AssignedQuizProps = {
  quiz: Quiz;
  isComplete: boolean;
  refreshRecord: () => void;
  moveToNext: () => void;
};

const AssignedQuiz = ({
  quiz,
  isComplete,
  refreshRecord,
  moveToNext
}: AssignedQuizProps) => {
  // map of questionId:answer
  const [quizQuestionAnswers, setQuizQuestionAnswers] = React.useState<
    Map<number, number>
  >(
    isComplete
      ? new Map(quiz.questions.map((qn) => [qn.id, qn.correctAnswer]))
      : new Map()
  );
  const [quizQuestionRecords, setQuizQuestionRecords] = React.useState<
    EmployeeQuizQuestionRecord[] | null
  >(null);
  const [submitLoading, setSubmitLoading] = React.useState<boolean>(false);

  const numCorrectAnswers =
    quizQuestionRecords?.reduce(
      (prev, curr) => (curr.isCorrect ? prev + 1 : prev),
      0
    ) ?? -1;

  const hasPassed =
    (quizQuestionRecords &&
      quizQuestionRecords?.reduce(
        (prev, curr) => (curr.isCorrect ? prev + 1 : prev),
        0
      ) >= quiz.passingScore) ||
    isComplete;

  const submitAnswers = () => {
    // window.scrollTo({
    //   top: 0,
    //   left: 0,
    //   behavior: 'smooth'
    // });
    // window.scrollTo(0, 0);
    // console.log(document.getElementById('quiz-container'));
    setSubmitLoading(true);
    asyncFetchCallback(
      createQuizQuestionRecord(
        convertMapToQuizQuestionAnswers(quizQuestionAnswers)
      ),
      (res) => {
        setQuizQuestionRecords(res);
        refreshRecord();
        // document.getElementById('subject-container')?.scrollIntoView({
        //   behavior: 'smooth',
        //   block: 'start',
        //   inline: 'nearest'
        // });
      },
      () => void 0,
      { updateLoading: setSubmitLoading }
    );
    // console.log(convertMapToQuizQuestionAnswers(quizQuestionAnswers));
  };

  return (
    <div
      className='container-left-full'
      style={{ paddingRight: '16px' }}
      id='quiz-container'
    >
      <Card style={{ marginBottom: '16px' }}>
        <div className='container-spaced-out' style={{ alignItems: 'center' }}>
          <Space direction='vertical'>
            <Space align='center' size='middle'>
              <FieldTimeOutlined />
              <Title level={4} style={{ margin: 0 }}>
                {`${quiz.subjectOrder}. ${quiz.title}`}
              </Title>
            </Space>
            <Paragraph style={{ margin: '0 30px' }}>
              {quiz.description}
            </Paragraph>
          </Space>
          <Space direction='vertical' align='end'>
            <Text>Quiz</Text>
            <Text>
              Passing Score: {`${quiz.passingScore} / ${quiz.questions.length}`}
            </Text>
          </Space>
        </div>
      </Card>
      {(quizQuestionRecords !== null || isComplete) && (
        <Alert
          type={hasPassed ? 'success' : 'error'}
          message={
            hasPassed
              ? "You've passed this quiz!"
              : `You've failed this quiz! You got ${numCorrectAnswers}/${quiz.questions.length}.`
          }
          style={{ margin: '4px 0 12px' }}
          showIcon
          action={
            isComplete && <Button onClick={() => moveToNext()}>Move On</Button>
          }
        />
      )}
      <Title level={4} style={{ marginBottom: '16px' }}>
        Questions
      </Title>
      <Space direction='vertical' size='middle'>
        {quiz.questions.map((question) => (
          <AssignedQuestionCard
            key={question.id}
            quizQuestion={question}
            isCorrect={
              quizQuestionRecords !== null
                ? !!quizQuestionRecords.find(
                    (record) => record.questionId === question.id
                  )?.isCorrect
                : null
            }
            answer={quizQuestionAnswers.get(question.id) ?? -1}
            updateAnswer={(answer) =>
              setQuizQuestionAnswers((prev) => {
                const updatedMap = new Map(prev);
                updatedMap.set(question.id, answer);
                return updatedMap;
              })
            }
          />
        ))}
        <Button
          style={{ float: 'right', marginTop: '12px' }}
          onClick={() => submitAnswers()}
          type='primary'
          loading={submitLoading}
          disabled={isComplete}
        >
          Submit Answers
        </Button>
      </Space>
    </div>
  );
};

export default AssignedQuiz;
