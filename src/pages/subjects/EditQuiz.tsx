import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Input,
  InputNumber,
  Select,
  Space,
  Spin,
  Typography
} from 'antd';
import { isEqual, startCase } from 'lodash';
import React from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import ViewEditTitleHeader from 'src/components/common/ViewEditTitleHeader';
import {
  EDIT_QUIZ_URL,
  EDIT_SUBJECT_URL,
  SUBJECTS_URL
} from 'src/components/routes/routes';
import QuestionEditCard from 'src/components/subjects/quiz/QuestionEditCard';
import { getNewQuizQuestion } from 'src/components/subjects/subject/quiz/quizHelper';
import breadcrumbContext from 'src/context/breadcrumbs/breadcrumbContext';
import { ContentStatus, Quiz } from 'src/models/types';
import {
  createQuizQuestion,
  getQuizById,
  updateQuiz
} from 'src/services/quizService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import '../../styles/common/common.scss';
import '../../styles/subjects/quiz.scss';

const { Title, Text } = Typography;
const { Option } = Select;

const EditQuiz = () => {
  const { subjectId, quizId } = useParams();
  const navigate = useNavigate();
  const { updateBreadcrumbItems } = React.useContext(breadcrumbContext);

  const [quiz, setQuiz] = React.useState<Quiz | null>(null);
  const [editQuiz, setEditQuiz] = React.useState<Quiz | null>(quiz);
  const [getQuizLoading, setGetQuizLoading] = React.useState<boolean>(false);
  const [updateQuizLoading, setUpdateQuizLoading] =
    React.useState<boolean>(false);
  const [addQuestionLoading, setAddQuestionLoading] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    updateBreadcrumbItems([
      {
        label: 'Subjects',
        to: SUBJECTS_URL
      },
      ...(quiz
        ? [
            {
              label: quiz.subject?.title ?? 'Subject',
              to: generatePath(EDIT_SUBJECT_URL, { subjectId })
            },
            {
              label: quiz.title,
              to: generatePath(EDIT_QUIZ_URL, { subjectId, quizId })
            }
          ]
        : [])
    ]);
  }, [updateBreadcrumbItems, quiz, subjectId, quizId]);

  const fetchQuizById = (
    quizId: string | number,
    showLoading: boolean = true
  ) => {
    if (showLoading) {
      setGetQuizLoading(true);
    }
    asyncFetchCallback(
      getQuizById(quizId),
      (res) => {
        setGetQuizLoading(false);
        setQuiz(res);
      },
      () => setGetQuizLoading(false)
    );
  };

  React.useEffect(() => {
    if (quizId) {
      fetchQuizById(quizId);
    }
  }, [quizId]);

  React.useEffect(() => {
    if (quiz) {
      setEditQuiz(quiz);
    }
  }, [quiz]);

  const editNamedField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) =>
    setEditQuiz((prev) => prev && { ...prev, [e.target.name]: e.target.value });

  const updateQuizApiCall = (editQuiz: Quiz | null) => {
    if (editQuiz && !isEqual(quiz, editQuiz)) {
      setUpdateQuizLoading(true);
      asyncFetchCallback(
        updateQuiz(editQuiz),
        () => {
          fetchQuizById(editQuiz.id);
        },
        () => void 0,
        { updateLoading: setUpdateQuizLoading }
      );
    }
  };

  const addQuestion = () => {
    if (editQuiz) {
      setAddQuestionLoading(true);
      asyncFetchCallback(
        createQuizQuestion(
          getNewQuizQuestion(editQuiz.id, editQuiz.questions.length + 1)
        ),
        () => fetchQuizById(editQuiz.id),
        () => void 0,
        { updateLoading: setAddQuestionLoading }
      );
    }
  };

  return (
    <Spin size='large' spinning={getQuizLoading}>
      <div className='container-left-full'>
        <ViewEditTitleHeader
          title='Edit Quiz'
          inEditMode
          updateLoading={updateQuizLoading}
          lastUpdatedInfo={
            quiz
              ? {
                  lastUpdatedAt: quiz.subject.lastUpdatedAt,
                  lastUpdatedBy: quiz.subject.lastUpdatedBy
                }
              : undefined
          }
        />
        <div
          className='container-spaced-out'
          style={{ width: '100%', margin: '12px 0px 24px' }}
        >
          <Space
            direction='vertical'
            style={{ width: '100%', flex: '0 0 80%' }}
          >
            <Text>Topic Name</Text>
            <Input
              name='title'
              size='large'
              placeholder='Topic Name'
              value={editQuiz?.title}
              onChange={editNamedField}
              onBlur={() => updateQuizApiCall(editQuiz)}
            />
          </Space>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>Status</Text>
            <Select
              size='large'
              style={{ width: '100%' }}
              value={editQuiz?.status}
              onChange={(value) =>
                editQuiz && updateQuizApiCall({ ...editQuiz, status: value })
              }
            >
              {Object.values(ContentStatus).map((status) => (
                <Option key={status} value={status}>
                  <Space align='center'>
                    <span className={`status-dot-${status.toLowerCase()}`} />
                    <Text>{startCase(status.toLowerCase())}</Text>
                  </Space>
                </Option>
              ))}
            </Select>
          </Space>
        </div>
        <div className='questions-container'>
          <div className='questions-settings'>
            <Title level={4}>Settings</Title>
            <Card>
              <Space
                direction='vertical'
                size='large'
                style={{ width: '100%', paddingBottom: '32px' }}
              >
                <Space direction='vertical'>
                  <Text>{`Passing score`}</Text>
                  <Space>
                    <InputNumber
                      defaultValue={editQuiz?.questions.length}
                      min={0}
                      max={editQuiz?.questions.length}
                      value={editQuiz?.passingScore}
                      onChange={(value) => {
                        if (value) {
                          setEditQuiz((prev) => {
                            const numQuestions = editQuiz?.questions.length;
                            if (prev && value <= (numQuestions ?? 0)) {
                              return {
                                ...prev,
                                passingScore: value
                              };
                            }
                            return prev;
                          });
                        }
                      }}
                      onBlur={() => updateQuizApiCall(editQuiz)}
                    />
                    <Text>/ {editQuiz?.questions.length}</Text>
                  </Space>
                </Space>
                <Space direction='vertical' style={{ width: '100%' }}>
                  <Text>Quiz Description</Text>
                  <Input.TextArea
                    name='description'
                    rows={12}
                    value={editQuiz?.description}
                    onChange={editNamedField}
                  />
                </Space>
              </Space>
            </Card>
          </div>
          <div className='questions-editor'>
            <Title level={4}>Questions</Title>
            {!!editQuiz?.questions.length ? (
              editQuiz.questions.map((question) => (
                <QuestionEditCard
                  key={question.id}
                  quizQuestion={question}
                  questions={editQuiz.questions}
                  refreshQuiz={() =>
                    editQuiz && fetchQuizById(editQuiz.id, false)
                  }
                />
              ))
            ) : (
              <Text>No questions added yet.</Text>
            )}
            <Button
              style={{ marginTop: '24px' }}
              size='large'
              type='dashed'
              icon={<PlusOutlined />}
              onClick={() => addQuestion()}
              loading={addQuestionLoading}
            >
              Add Question
            </Button>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default EditQuiz;
