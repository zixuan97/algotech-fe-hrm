import React from 'react';
import { Card, Input, Space, Spin, Typography } from 'antd';
import '../../styles/common/common.scss';
import '../../styles/subjects/subject.scss';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { Subject, User } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  assignUsersToSubject,
  deleteSubject,
  getSubjectById,
  unassignUsersFromSubject,
  updateSubject
} from 'src/services/subjectService';
import { isEqual, startCase } from 'lodash';
import { sortTopicsAndQuizzesArr } from 'src/components/subjects/subjectHelper';
import UsersAssignedCard from 'src/components/subjects/subject/cards/UsersAssignedCard';
import SubjectDetailsCard from 'src/components/subjects/subject/cards/SubjectDetailsCard';
import CompletionRateCard from 'src/components/subjects/subject/cards/CompletionRateCard';
import AddTopicOrQuizButton from 'src/components/subjects/subject/edit/AddTopicOrQuizButton';
import breadcrumbContext from 'src/context/breadcrumbs/breadcrumbContext';
import {
  EDIT_SUBJECT_URL,
  SUBJECTS_URL,
  VIEW_SUBJECT_URL
} from 'src/components/routes/routes';
import { getSubjectTypeIcon } from './AllSubjects';
import QuizTopicPanel from 'src/components/subjects/subject/panels/QuizTopicPanel';
import ViewEditTitleHeader from 'src/components/common/ViewEditTitleHeader';
import { LoadingOutlined } from '@ant-design/icons';
import { useDebounceCallback } from 'src/hooks/useDebounce';

const { Text, Title } = Typography;

const EditSubject = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
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
        ? sortTopicsAndQuizzesArr([
            ...editSubject.topics,
            ...editSubject.quizzes
          ])
        : [],
    [editSubject]
  );

  React.useEffect(() => {
    updateBreadcrumbItems([
      { label: 'Subjects', to: SUBJECTS_URL },
      ...(subject
        ? [
            {
              label: subject ? subject.title : 'Edit',
              to: generatePath(EDIT_SUBJECT_URL, { subjectId: subjectId })
            }
          ]
        : [])
    ]);
  }, [updateBreadcrumbItems, subjectId, subject]);

  const fetchSubjectById = (subjectId: string | number) => {
    if (subjectId) {
      setGetSubjectLoading(true);
      asyncFetchCallback(
        getSubjectById(subjectId),
        (res) => {
          setGetSubjectLoading(false);
          setSubject(res);
        },
        () => setGetSubjectLoading(false)
      );
    }
  };

  React.useEffect(() => {
    if (subjectId) {
      fetchSubjectById(subjectId);
    }
  }, [subjectId]);

  React.useEffect(() => {
    if (subject) {
      setEditSubject(subject);
    }
  }, [subject]);

  const editNamedField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updatedSubject = editSubject && {
      ...editSubject,
      [e.target.name]: e.target.value
    };
    if (updatedSubject) {
      setEditSubject(updatedSubject);
      debouncedUpdateSubjectApiCall(updatedSubject);
    }
  };

  const updateSubjectApiCall = (editSubject: Subject | null) => {
    if (editSubject && !isEqual(editSubject, subject)) {
      // TODO: handle error case, especially when not found
      setUpdateSubjectLoading(true);
      asyncFetchCallback(
        updateSubject(editSubject),
        (res) => {
          fetchSubjectById(editSubject.id);
        },
        () => void 0,
        { updateLoading: setUpdateSubjectLoading }
      );
    }
  };

  const debouncedUpdateSubjectApiCall =
    useDebounceCallback(updateSubjectApiCall);

  const assignUserToSubject = (user: User) => {
    if (editSubject) {
      setUpdateSubjectLoading(true);
      asyncFetchCallback(
        assignUsersToSubject(editSubject.id, [user]),
        (res) => {
          fetchSubjectById(editSubject.id);
        },
        () => void 0,
        { updateLoading: setUpdateSubjectLoading }
      );
    }
  };

  const unassignUserFromSubject = (user: User) => {
    if (editSubject) {
      setUpdateSubjectLoading(true);
      asyncFetchCallback(
        unassignUsersFromSubject(editSubject.id, [user]),
        (res) => {
          fetchSubjectById(editSubject.id);
        },
        () => void 0,
        { updateLoading: setUpdateSubjectLoading }
      );
    }
  };

  return (
    <Spin size='large' spinning={getSubjectLoading}>
      <div className='container-left-full'>
        <ViewEditTitleHeader
          title='Edit Subject'
          inEditMode={true}
          updateLoading={updateSubjectLoading}
          editFunctions={{
            deleteModalProps: {
              title: 'Confirm Delete Subject',
              body: `Are you sure you want to delete ${editSubject?.title}?`,
              deleteSuccessContent: (
                <Space>
                  <Text>
                    Subject successfully deleted! Redirecting you back to all
                    subjects page...
                  </Text>
                  <LoadingOutlined />
                </Space>
              ),
              deleteRedirectUrl: SUBJECTS_URL
            },
            onView: () =>
              navigate(generatePath(VIEW_SUBJECT_URL, { subjectId })),
            onDelete: async () => {
              editSubject && deleteSubject(editSubject.id);
            }
          }}
          lastUpdatedInfo={
            editSubject
              ? {
                  lastUpdatedAt: editSubject.lastUpdatedAt,
                  lastUpdatedBy: editSubject.lastUpdatedBy
                }
              : undefined
          }
        />
        <Space
          direction='vertical'
          size='middle'
          style={{ paddingBottom: '48px' }}
        >
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>Subject Name</Text>
            <Input
              name='title'
              size='large'
              value={editSubject?.title}
              onChange={editNamedField}
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
              updateIsPublished={(checked) => {
                if (editSubject) {
                  const updatedSubject = {
                    ...editSubject,
                    isPublished: checked
                  };
                  setEditSubject(updatedSubject);
                  updateSubjectApiCall(updatedSubject);
                }
              }}
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
              orderedTopicsAndQuizzes.map((item, index) => (
                <QuizTopicPanel
                  key={index}
                  quizOrTopic={item}
                  quizzesAndTopics={orderedTopicsAndQuizzes}
                  refreshSubject={() =>
                    editSubject && fetchSubjectById(editSubject.id)
                  }
                />
              ))}
            <AddTopicOrQuizButton
              orderedTopicsAndQuizzes={orderedTopicsAndQuizzes}
              subject={editSubject}
              refreshSubject={() =>
                editSubject && fetchSubjectById(editSubject.id)
              }
            />
          </Space>
        </Space>
      </div>
    </Spin>
  );
};

export default EditSubject;
