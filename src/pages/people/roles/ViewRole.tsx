import React from 'react';
import { Input, Space, Spin, Typography } from 'antd';
import '../../../styles/common/common.scss';
import '../../styles/subjects/editSubject.scss';
import { generatePath, useParams } from 'react-router-dom';
import { JobRole } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import breadcrumbContext from 'src/context/breadcrumbs/breadcrumbContext';
import {
  PEOPLE_ROLES_ID_URL,
  PEOPLE_ROLES_URL
} from 'src/components/routes/routes';
import ViewEditTitleHeader from 'src/components/common/ViewEditTitleHeader';
import { LoadingOutlined } from '@ant-design/icons';
import {
  deleteJobRole,
  getJobRoleById,
  updateJobRole
} from 'src/services/jobRoleService';
import EditRoleButtonGroup from 'src/components/people/roles/EditRoleButtonGroup';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';

const { Text } = Typography;

const ViewRole = () => {
  const { roleId } = useParams();
  const { updateBreadcrumbItems } = React.useContext(breadcrumbContext);
  const [jobRole, setJobRole] = React.useState<JobRole | null>(null);
  const [editJobRole, setEditJobRole] = React.useState<JobRole | null>(null);
  const [edit, setEdit] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [getJobRoleLoading, setGetJobRoleLoading] =
    React.useState<boolean>(false);
  const [updateJobRoleLoading, setUpdateJobRoleLoading] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    updateBreadcrumbItems([
      { label: 'Job Role', to: PEOPLE_ROLES_URL },
      ...(jobRole
        ? [
            {
              label: jobRole ? jobRole.jobRole : 'View',
              to: generatePath(PEOPLE_ROLES_ID_URL, { roleId: roleId })
            }
          ]
        : [])
    ]);
  }, [updateBreadcrumbItems, roleId, jobRole]);

  const fetchRoleById = (roleId: string | number) => {
    if (roleId) {
      setGetJobRoleLoading(true);
      asyncFetchCallback(
        getJobRoleById(roleId),
        (res) => {
          setGetJobRoleLoading(false);
          setJobRole(res);
        },
        () => setGetJobRoleLoading(false)
      );
    }
  };

  React.useEffect(() => {
    if (roleId) {
      fetchRoleById(roleId);
    }
  }, [roleId]);

  React.useEffect(() => {
    if (jobRole) {
      setEditJobRole(jobRole);
    }
  }, [jobRole]);

  const editNamedField = (
    e: React.ChangeEvent<HTMLInputElement>
  ) =>
    setEditJobRole(
      (prev) => prev && { ...prev, [e.target.name]: e.target.value }
    );

  const handleSaveButtonClick = (e: any) => {
    e.preventDefault();
    if (jobRole?.jobRole === '') {
      setAlert({
        type: 'warning',
        message: 'First name field cannot be empty!'
      });
      return;
    }
    asyncFetchCallback(
      updateJobRole(editJobRole!),
      (res) => {
        setAlert({
            type: 'success',
            message: 'Changes saved.'
          });
        fetchRoleById(res.id);
        setEdit(false);
      },
      () => {
        setAlert({
          type: 'error',
          message: 'Failed to save changes. Please try again later.'
        });
      },
      { updateLoading: setUpdateJobRoleLoading }
    );
  };

  //   const assignUserToSubject = (user: User) => {
  //     if (editSubject) {
  //       setUpdateSubjectLoading(true);
  //       asyncFetchCallback(
  //         assignUsersToSubject(editSubject.id, [user]),
  //         (res) => {
  //           fetchSubjectById(editSubject.id);
  //         },
  //         () => void 0,
  //         { updateLoading: setUpdateSubjectLoading }
  //       );
  //     }
  //   };

  //   const unassignUserFromSubject = (user: User) => {
  //     if (editSubject) {
  //       setUpdateSubjectLoading(true);
  //       asyncFetchCallback(
  //         unassignUsersFromSubject(editSubject.id, [user]),
  //         (res) => {
  //           fetchSubjectById(editSubject.id);
  //         },
  //         () => void 0,
  //         { updateLoading: setUpdateSubjectLoading }
  //       );
  //     }
  //   };

  return (
    <Spin size='large' spinning={getJobRoleLoading}>
      <div className='container-left-full'>
        <ViewEditTitleHeader
          title='View Job Role'
          inEditMode={edit}
          updateLoading={updateJobRoleLoading}
          editFunctions={{
            deleteModalProps: {
              title: 'Confirm Delete Job Role',
              body: `Are you sure you want to delete ${editJobRole?.jobRole}?`,
              deleteSuccessContent: (
                <Space>
                  <Text>
                    Job Role successfully deleted! Redirecting you back to all
                    job roles page...
                  </Text>
                  <LoadingOutlined />
                </Space>
              ),
              deleteRedirectUrl: PEOPLE_ROLES_URL
            },
            onView: () => {
              setEditJobRole(jobRole);
              setEdit(false);
            },
            onDelete: async () => {
              editJobRole && deleteJobRole(editJobRole?.id);
            }
          }}
          viewFunctions={{
            onEdit: () => setEdit(true)
          }}
        />
        {edit && (
          <EditRoleButtonGroup
            setEdit={setEdit}
            edit={edit}
            jobRole={jobRole!}
            setEditJobRole={setEditJobRole}
            handleSaveButtonClick={handleSaveButtonClick}
          />
        )}
        {alert && (
          <div className='account-alert'>
            <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
          </div>
        )}
        <Space
          direction='vertical'
          size='middle'
          style={{ paddingBottom: '48px' }}
        >
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>Job Role Name</Text>
            <Input
              disabled={!edit}
              name='jobRole'
              size='large'
              value={editJobRole?.jobRole}
              onChange={editNamedField}
            />
          </Space>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>Job Role Description</Text>
            <Input
              disabled={!edit}
              name='jobRole'
              size='large'
              value={editJobRole?.jobRole}
              onChange={editNamedField}
            />
          </Space>
          <div className='subject-card-container'>
            Users Assigned
            {/* <UsersAssignedCard
              usersAssigned={editSubject?.usersAssigned ?? []}
              subjectTitle={editSubject?.title}
              assignUserToSubject={assignUserToSubject}
              unassignUserFromSubject={unassignUserFromSubject}
            /> */}
          </div>
        </Space>
      </div>
    </Spin>
  );
};

export default ViewRole;
