import React from 'react';
import { Alert, Card, Input, Space, Spin, Typography } from 'antd';
import '../../styles/common/common.scss';
import '../../styles/subjects/editSubject.scss';
import { generatePath, useParams } from 'react-router-dom';
import { Quiz, Subject, Topic, User } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  assignUsersToSubject,
  createQuiz,
  createTopic,
  getSubjectById,
  unassignUsersFromSubject,
  updateSubject
} from 'src/services/subjectService';
import { isEqual, startCase } from 'lodash';
import {
  getNewQuiz,
  getNewTopic,
  instanceOfTopic,
  orderTopicsAndQuizzes,
  SubjectSectionType
} from 'src/components/subjects/subjectHelper';
import TopicPanel from 'src/components/subjects/subject/TopicPanel';
import QuizPanel from 'src/components/subjects/subject/QuizPanel';
import { LoadingOutlined } from '@ant-design/icons';
import UsersAssignedCard from 'src/components/subjects/subject/cards/UsersAssignedCard';
import SubjectDetailsCard from 'src/components/subjects/subject/cards/SubjectDetailsCard';
import CompletionRateCard from 'src/components/subjects/subject/cards/CompletionRateCard';
import useHasChanged from 'src/hooks/useHasChanged';
import AddTopicOrQuizButton from 'src/components/subjects/subject/edit/AddTopicOrQuizButton';
import breadcrumbContext from 'src/context/breadcrumbs/breadcrumbContext';
import { EDIT_SUBJECT_URL, SUBJECTS_URL } from 'src/components/routes/routes';
import { getSubjectTypeIcon } from './AllSubjects';

const { Text, Title } = Typography;

const EditSubject = () => {
  const { subjectId } = useParams();
  const { updateBreadcrumbItems } = React.useContext(breadcrumbContext);

  const [subject, setSubject] = React.useState<Subject | null>(null);
  const [editSubject, setEditSubject] = React.useState<Subject | null>(subject);
  const [getSubjectLoading, setGetSubjectLoading] =
    React.useState<boolean>(false);
  const [updateSubjectLoading, setUpdateSubjectLoading] =
    React.useState<boolean>(false);

  const orderedTopicsAndQuizzes = React.useMemo(
    () =>
      editSubject
        ? orderTopicsAndQuizzes(editSubject.topics, editSubject.quizzes)
        : [],
    [editSubject]
  );

  React.useEffect(() => {
    updateBreadcrumbItems([
      { label: 'Subjects', to: SUBJECTS_URL },
      ...(editSubject
        ? [
            {
              label: editSubject ? editSubject.title : 'Edit',
              to: generatePath(EDIT_SUBJECT_URL, { subjectId: subjectId })
            }
          ]
        : [])
    ]);
  }, [updateBreadcrumbItems, subjectId, editSubject]);

  React.useEffect(() => {
    if (subjectId) {
      setGetSubjectLoading(true);
      asyncFetchCallback(
        getSubjectById(subjectId),
        (res) => {
          setSubject(res);
          setEditSubject(res);
        },
        () => void 0,
        {
          updateLoading: setGetSubjectLoading
        }
      );
    }
  }, [subjectId]);

  const hasUpdated = useHasChanged(subject?.lastUpdatedAt);

  const editNamedField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) =>
    setEditSubject(
      (prev) => prev && { ...prev, [e.target.name]: e.target.value }
    );

  const updateSubjectApiCall = (subjectToUpdate: Subject | null) => {
    if (subjectToUpdate && !isEqual(subject, subjectToUpdate)) {
      // TODO: handle error case, especially when not found
      // can't use the built in function here because of useHasChanged
      setUpdateSubjectLoading(true);
      asyncFetchCallback(
        updateSubject(subjectToUpdate),
        (res) => {
          setTimeout(() => {
            setUpdateSubjectLoading(false);
            setSubject(res);
            setEditSubject(res);
          }, 500);
        },
        () => {
          setUpdateSubjectLoading(false);
        }
      );
    }
  };

  const assignUserToSubject = (user: User) => {
    if (editSubject) {
      setUpdateSubjectLoading(true);
      asyncFetchCallback(
        assignUsersToSubject(editSubject.id, [user]),
        (res) => {
          setTimeout(() => {
            setUpdateSubjectLoading(false);
            setSubject(res);
            setEditSubject(res);
          }, 500);
        },
        () => {
          setUpdateSubjectLoading(false);
        }
      );
    }
  };

  const unassignUserFromSubject = (user: User) => {
    if (editSubject) {
      setUpdateSubjectLoading(true);
      asyncFetchCallback(
        unassignUsersFromSubject(editSubject.id, [user]),
        (res) => {
          setTimeout(() => {
            setUpdateSubjectLoading(false);
            setSubject(res);
            setEditSubject(res);
          }, 500);
        },
        () => {
          setUpdateSubjectLoading(false);
        }
      );
    }
  };

  const addQuizOrTopic = (addQuizOrTopicProps: {
    title: string;
    addSectionType: SubjectSectionType;
  }) => {
    const { title, addSectionType } = addQuizOrTopicProps;
    if (editSubject) {
      setUpdateSubjectLoading(true);
      if (addSectionType === SubjectSectionType.TOPIC) {
        asyncFetchCallback(
          createTopic(
            getNewTopic(editSubject.id, orderedTopicsAndQuizzes.length, title)
          ),
          (res) => {
            setUpdateSubjectLoading(false);
            setSubject(
              (prev) => prev && { ...prev, topics: [...prev.topics, res] }
            );
            setEditSubject(
              (prev) => prev && { ...prev, topics: [...prev.topics, res] }
            );
          },
          () => setUpdateSubjectLoading(false)
        );
      } else {
        asyncFetchCallback(
          createQuiz(
            getNewQuiz(editSubject.id, orderedTopicsAndQuizzes.length, title)
          ),
          (res) => {
            setUpdateSubjectLoading(false);
            setSubject(
              (prev) => prev && { ...prev, quizzes: [...prev.quizzes, res] }
            );
            setEditSubject(
              (prev) => prev && { ...prev, quizzes: [...prev.quizzes, res] }
            );
          },
          () => setUpdateSubjectLoading(false)
        );
      }
    }
  };

  return (
    <Spin size='large' spinning={getSubjectLoading}>
      <div className='container-left-full'>
        <Space
          direction='vertical'
          size='middle'
          style={{ paddingBottom: '48px' }}
        >
          {((subject && hasUpdated) || updateSubjectLoading) && (
            <Alert
              message={
                <Space>
                  {updateSubjectLoading ? (
                    <>
                      <Text>Updating subject...</Text>
                      <LoadingOutlined />
                    </>
                  ) : (
                    <Text>{`Your changes have been saved!`}</Text>
                  )}
                </Space>
              }
              type='info'
              showIcon
              closable
            />
          )}
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>Subject Name</Text>
            <Input
              name='name'
              size='large'
              value={editSubject?.title}
              onChange={editNamedField}
              onBlur={() => updateSubjectApiCall(editSubject)}
            />
          </Space>
          <div className='top-fields-container'>
            <Space
              direction='vertical'
              size='middle'
              className='top-fields-inputs'
            >
              <Space direction='vertical' style={{ width: '100%' }}>
                <Text>Subject Description</Text>
                <Input.TextArea
                  name='description'
                  size='large'
                  rows={4}
                  value={editSubject?.description}
                  onChange={editNamedField}
                  onBlur={() => updateSubjectApiCall(editSubject)}
                />
              </Space>
            </Space>
            <Card className='top-fields-subject-type'>
              {editSubject && (
                <Space direction='vertical'>
                  <Title level={5}>Subject Type</Title>
                  <Space>
                    {getSubjectTypeIcon(editSubject.type)}
                    <Text>{startCase(editSubject.type.toLowerCase())}</Text>
                  </Space>
                </Space>
              )}
            </Card>
          </div>
          <div className='subject-card-container'>
            <SubjectDetailsCard
              createdBy={editSubject?.createdBy}
              createdAt={editSubject?.createdAt}
              lastUpdatedBy={editSubject?.lastUpdatedBy}
              lastUpdatedAt={editSubject?.lastUpdatedAt}
              isPublished={editSubject?.isPublished}
              updateIsPublished={(checked) =>
                setEditSubject((prev) => {
                  if (prev) {
                    const updatedSubject = {
                      ...prev,
                      isPublished: checked
                    };
                    updateSubjectApiCall(updatedSubject);
                    return updatedSubject;
                  }
                  return prev;
                })
              }
            />
            <UsersAssignedCard
              usersAssigned={editSubject?.usersAssigned ?? []}
              subjectTitle={editSubject?.title}
              assignUserToSubject={assignUserToSubject}
              unassignUserFromSubject={unassignUserFromSubject}
            />
            <CompletionRateCard
              completionRate={editSubject?.completionRate}
              usersAssigned={editSubject?.usersAssigned ?? []}
            />
          </div>
          <Title level={4}>Topics & Quizzes</Title>
          <Space direction='vertical' style={{ width: '100%' }}>
            {!!orderedTopicsAndQuizzes.length &&
              orderedTopicsAndQuizzes.map((item, index) => {
                if (instanceOfTopic(item)) {
                  return <TopicPanel key={index} topic={item as Topic} />;
                } else {
                  return <QuizPanel key={index} quiz={item as Quiz} />;
                }
              })}
            <AddTopicOrQuizButton
              addQuizOrTopic={addQuizOrTopic}
              updateSubjectLoading={updateSubjectLoading}
            />
          </Space>
        </Space>
      </div>
    </Spin>
  );
};

export default EditSubject;
