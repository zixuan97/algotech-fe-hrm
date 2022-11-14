import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { Button, Dropdown, Menu, MenuProps, Modal } from 'antd';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { EDIT_QUIZ_URL, EDIT_TOPIC_URL } from 'src/components/routes/routes';
import { MenuInfo } from 'rc-menu/lib/interface';
import { Quiz, Topic } from 'src/models/types';

import React from 'react';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { instanceOfTopic } from '../../topic/topicHelper';
import { instanceOfQuiz } from '../quiz/quizHelper';
import {
  reorderTopicsAndQuizzesArr,
  swapQuizOrTopicInArr,
  updateTopicsAndQuizzesOrderApiCall
} from '../../subjectHelper';
import { deleteQuiz } from 'src/services/quizService';
import { deleteTopic } from 'src/services/topicService';

enum QuizTopicMoreKeys {
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  MOVE_UP = 'MOVE_UP',
  MOVE_DOWN = 'MOVE_DOWN'
}

type QuizTopicMoreButtonProps = {
  currQuizOrTopic: Quiz | Topic;
  quizzesAndTopics: (Quiz | Topic)[];
  refreshSubject: () => void;
};

const QuizTopicMoreButton = ({
  currQuizOrTopic,
  quizzesAndTopics,
  refreshSubject
}: QuizTopicMoreButtonProps) => {
  const navigate = useNavigate();
  const { subjectId } = useParams();

  const [deleteModalOpen, setDeleteModalOpen] = React.useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false);

  const currIdx = quizzesAndTopics.findIndex(
    (quizOrTopic) => quizOrTopic.id === currQuizOrTopic.id
  );

  const quiz = instanceOfQuiz(currQuizOrTopic)
    ? (currQuizOrTopic as Quiz)
    : null;
  const topic = instanceOfTopic(currQuizOrTopic)
    ? (currQuizOrTopic as Topic)
    : null;

  const dropdownMenuItems: MenuProps['items'] = [
    {
      label: 'Edit',
      key: QuizTopicMoreKeys.EDIT,
      icon: <EditOutlined />
    },
    {
      label: 'Delete',
      key: QuizTopicMoreKeys.DELETE,
      icon: <DeleteOutlined />
    },
    ...(currIdx !== 0
      ? [
          {
            label: 'Move Up',
            key: QuizTopicMoreKeys.MOVE_UP,
            icon: <ArrowUpOutlined />
          }
        ]
      : []),
    ...(currIdx !== quizzesAndTopics.length - 1
      ? [
          {
            label: 'Move Down',
            key: QuizTopicMoreKeys.MOVE_DOWN,
            icon: <ArrowDownOutlined />
          }
        ]
      : [])
  ];

  const deleteTopicOrQuizApiCall = (
    newQuizzesAndTopicsArr: (Topic | Quiz)[]
  ) => {
    setDeleteLoading(true);
    const reorderedQuizzesAndTopicsArr = reorderTopicsAndQuizzesArr(
      newQuizzesAndTopicsArr
    );
    if (quiz) {
      asyncFetchCallback(
        deleteQuiz(quiz.id),
        () => {
          updateTopicsAndQuizzesOrderApiCall(
            reorderedQuizzesAndTopicsArr,
            refreshSubject
          );
          setDeleteModalOpen(false);
        },
        () => void 0,
        { updateLoading: setDeleteLoading }
      );
    } else if (topic) {
      asyncFetchCallback(
        deleteTopic(topic.id),
        () => {
          refreshSubject();
          updateTopicsAndQuizzesOrderApiCall(
            reorderedQuizzesAndTopicsArr,
            refreshSubject
          );
          setDeleteModalOpen(false);
        },
        () => void 0,
        { updateLoading: setDeleteLoading }
      );
    }
  };

  const deleteQuizOrTopic = () => {
    const newQuizzesAndTopicsArr = [...quizzesAndTopics];
    const idxToDelete = newQuizzesAndTopicsArr.findIndex(
      (quizOrTopic) => quizOrTopic.id === currQuizOrTopic.id
    );
    newQuizzesAndTopicsArr.splice(idxToDelete, 1);
    console.log(newQuizzesAndTopicsArr);
    deleteTopicOrQuizApiCall(newQuizzesAndTopicsArr);
  };

  const moveQuizOrTopicUp = () => {
    if (currIdx === 0) return;
    updateTopicsAndQuizzesOrderApiCall(
      swapQuizOrTopicInArr(currIdx, currIdx - 1, quizzesAndTopics),
      refreshSubject
    );
  };

  const moveQuizOrTopicDown = () => {
    if (currIdx === quizzesAndTopics.length - 1) return;
    updateTopicsAndQuizzesOrderApiCall(
      swapQuizOrTopicInArr(currIdx, currIdx + 1, quizzesAndTopics),
      refreshSubject
    );
  };

  const handleMenuClick = ({ key, domEvent }: MenuInfo) => {
    domEvent.stopPropagation();
    switch (key) {
      case QuizTopicMoreKeys.EDIT:
        topic
          ? navigate(
              generatePath(EDIT_TOPIC_URL, {
                subjectId,
                topicId: currQuizOrTopic.id?.toString()
              })
            )
          : navigate(
              generatePath(EDIT_QUIZ_URL, {
                subjectId,
                quizId: currQuizOrTopic.id?.toString()
              })
            );
        break;
      case QuizTopicMoreKeys.DELETE:
        setDeleteModalOpen(true);
        break;
      case QuizTopicMoreKeys.MOVE_UP:
        moveQuizOrTopicUp();
        break;
      case QuizTopicMoreKeys.MOVE_DOWN:
        moveQuizOrTopicDown();
        break;
      default:
        return;
    }
  };
  return (
    <>
      <Modal
        title={`Confirm Delete ${quiz ? 'Quiz' : 'Topic'}`}
        open={deleteModalOpen}
        onCancel={(e) => {
          e.stopPropagation();
          setDeleteModalOpen(false);
        }}
        onOk={(e) => {
          e.stopPropagation();
          deleteQuizOrTopic();
        }}
        okButtonProps={{
          loading: deleteLoading
        }}
      >
        {`Are you sure you want to delete this ${quiz ? 'quiz' : 'topic'}?`}
      </Modal>
      <Dropdown
        overlayStyle={{ width: '10em' }}
        overlay={<Menu onClick={handleMenuClick} items={dropdownMenuItems} />}
        trigger={['click']}
        placement='bottomRight'
      >
        <Button
          size='small'
          type='text'
          icon={<MoreOutlined />}
          onClick={(e) => e.stopPropagation()}
        />
      </Dropdown>
    </>
  );
};

export default QuizTopicMoreButton;
