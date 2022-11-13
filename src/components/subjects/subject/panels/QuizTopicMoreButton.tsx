import { MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, MenuProps } from 'antd';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { EDIT_QUIZ_URL, EDIT_TOPIC_URL } from 'src/components/routes/routes';
import { MenuInfo } from 'rc-menu/lib/interface';
import { Quiz, Topic } from 'src/models/types';
import { instanceOfQuiz, instanceOfTopic } from '../../subjectHelper';

enum QuizTopicMoreKeys {
  EDIT = 'EDIT',
  DELETE = 'DELETE'
}

type QuizTopicMoreButtonProps = {
  quizOrTopic: Quiz | Topic;
};

const QuizTopicMoreButton = ({ quizOrTopic }: QuizTopicMoreButtonProps) => {
  const navigate = useNavigate();
  const { subjectId } = useParams();

  const quiz = instanceOfQuiz(quizOrTopic) ? (quizOrTopic as Quiz) : null;
  const topic = instanceOfTopic(quizOrTopic) ? (quizOrTopic as Topic) : null;

  const dropdownMenuItems: MenuProps['items'] = [
    {
      label: 'Edit',
      key: QuizTopicMoreKeys.EDIT
    },
    {
      label: 'Delete',
      key: QuizTopicMoreKeys.DELETE
    }
  ];
  const handleMenuClick = ({ key, domEvent }: MenuInfo) => {
    domEvent.stopPropagation();
    switch (key) {
      case QuizTopicMoreKeys.EDIT:
        topic
          ? navigate(
              generatePath(EDIT_TOPIC_URL, {
                subjectId,
                topicId: quizOrTopic.id?.toString()
              })
            )
          : navigate(
              generatePath(EDIT_QUIZ_URL, {
                subjectId,
                quizId: quizOrTopic.id?.toString()
              })
            );
        break;
      case QuizTopicMoreKeys.DELETE:
        break;
      default:
        return;
    }
  };
  return (
    <Dropdown
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
  );
};

export default QuizTopicMoreButton;
