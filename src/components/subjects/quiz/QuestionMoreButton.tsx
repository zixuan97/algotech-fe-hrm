import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { Button, Dropdown, Menu, MenuProps, Modal } from 'antd';
import React from 'react';
import { QuizQuestion } from 'src/models/types';
import {
  deleteQuizQuestion,
  updateQuizQuestionssOrder
} from 'src/services/quizService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  reorderQuestionsArr,
  swapQuestionsInQuestionsArr
} from '../subject/quiz/quizHelper';

enum QuestionMoreKeys {
  DELETE = 'DELETE',
  MOVE_UP = 'MOVE_UP',
  MOVE_DOWN = 'MOVE_DOWN'
}

type QuestionMoreButtonProps = {
  currQuestion: QuizQuestion;
  questions: QuizQuestion[];
  refreshQuiz: () => void;
};

const QuestionMoreButton = ({
  currQuestion,
  questions,
  refreshQuiz
}: QuestionMoreButtonProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = React.useState<boolean>(false);
  const [deleteQuestionLoading, setDeleteQuestionLoading] =
    React.useState<boolean>(false);

  const currIdx = questions.findIndex((qn) => qn.id === currQuestion.id);

  const deleteQuestionApiCall = (newQuestions: QuizQuestion[]) => {
    setDeleteQuestionLoading(true);
    asyncFetchCallback(
      deleteQuizQuestion(currQuestion.id),
      () => updateQuestionsOrderApiCall(newQuestions),
      () => void 0,
      { updateLoading: setDeleteQuestionLoading }
    );
  };

  const updateQuestionsOrderApiCall = (newQuestions: QuizQuestion[]) => {
    asyncFetchCallback(updateQuizQuestionssOrder(newQuestions), () =>
      refreshQuiz()
    );
  };

  const deleteCurrQuestion = () => {
    const newQuestions = [...questions];
    const idxToDelete = newQuestions.findIndex(
      (newQn) => newQn.id === currQuestion.id
    );
    newQuestions.splice(idxToDelete, 1);
    deleteQuestionApiCall(reorderQuestionsArr(newQuestions));
  };

  const moveCurrQnUp = () => {
    if (currIdx === 0) return;
    updateQuestionsOrderApiCall(
      swapQuestionsInQuestionsArr(currIdx, currIdx - 1, questions)
    );
  };

  const moveCurrQnDown = () => {
    if (currIdx === questions.length - 1) return;
    updateQuestionsOrderApiCall(
      swapQuestionsInQuestionsArr(currIdx, currIdx + 1, questions)
    );
  };

  const questionMoreMenuItems: MenuProps['items'] = [
    {
      label: 'Delete',
      key: QuestionMoreKeys.DELETE,
      icon: <DeleteOutlined />,
      onClick: () => setDeleteModalOpen(true)
    },
    ...(currIdx !== 0
      ? [
          {
            label: 'Move Up',
            key: QuestionMoreKeys.MOVE_UP,
            icon: <ArrowUpOutlined />,
            onClick: () => moveCurrQnUp()
          }
        ]
      : []),
    ...(currIdx !== questions.length - 1
      ? [
          {
            label: 'Move Down',
            key: QuestionMoreKeys.MOVE_DOWN,
            icon: <ArrowDownOutlined />,
            onClick: () => moveCurrQnDown()
          }
        ]
      : [])
  ];

  return (
    <>
      <Modal
        title={`Confirm Delete Question`}
        open={deleteModalOpen}
        onCancel={(e) => setDeleteModalOpen(false)}
        onOk={() => deleteCurrQuestion()}
        okButtonProps={{
          loading: deleteQuestionLoading
        }}
      >
        {`Are you sure you want to delete this question?`}
      </Modal>
      <Dropdown
        overlay={<Menu items={questionMoreMenuItems} />}
        trigger={['click']}
        placement='bottomRight'
      >
        <Button icon={<MoreOutlined />} type='text' />
      </Dropdown>
    </>
  );
};

export default QuestionMoreButton;
