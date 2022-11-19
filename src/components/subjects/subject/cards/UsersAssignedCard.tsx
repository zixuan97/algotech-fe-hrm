import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Modal,
  Progress,
  Select,
  Space,
  Tooltip,
  Typography
} from 'antd';
import { differenceWith } from 'lodash';
import React from 'react';
import { EmployeeSubjectRecord, User } from 'src/models/types';
import { getAllEmployees } from 'src/services/userService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  getFirstLastNameInitials,
  getUserFullName
} from 'src/utils/formatUtils';
import '../../../../styles/common/common.scss';
import '../../../../styles/subjects/subject.scss';
import ConfirmationModalButton from '../../../common/ConfirmationModalButton';

const { Title, Text } = Typography;
const { Option } = Select;

type UsersAssignedCardProps = {
  usersAssigned: EmployeeSubjectRecord[];
  subjectTitle: string | undefined;
  assignUserToSubject?: (user: User) => void;
  unassignUserFromSubject?: (user: User) => void;
};

const UsersAssignedCard = ({
  usersAssigned,
  subjectTitle,
  assignUserToSubject,
  unassignUserFromSubject
}: UsersAssignedCardProps) => {
  const [allUsers, setAllUsers] = React.useState<User[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [selectedRecord, setSelectedRecord] =
    React.useState<EmployeeSubjectRecord | null>(null);
  const [userDetailsModalOpen, setUserDetailsModalOpen] =
    React.useState<boolean>(false);
  const [addUserModalOpen, setAddUserModalOpen] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    asyncFetchCallback(getAllEmployees(), (res) => {
      setAllUsers(
        differenceWith(
          res,
          usersAssigned,
          (user, record) => user.id === record.userId
        )
      );
    });
  }, [usersAssigned]);

  return (
    <Card className='subject-card'>
      <Title level={5} style={{ marginBottom: '24px' }}>
        Users Assigned
      </Title>
      <div className='users-assigned-container'>
        {!!usersAssigned.length || assignUserToSubject ? (
          usersAssigned.map((record) => (
            <Tooltip
              key={record.id}
              title={`${record.user.firstName} ${record.user.lastName}`}
              placement='bottom'
            >
              <Button
                size='large'
                shape='circle'
                type='primary'
                onClick={() => {
                  setSelectedRecord(record);
                  setUserDetailsModalOpen(true);
                }}
              >
                {getFirstLastNameInitials(
                  record.user.firstName,
                  record.user.lastName
                )}
              </Button>
            </Tooltip>
          ))
        ) : (
          <Text>No users have been assigned to this subject yet.</Text>
        )}
        {assignUserToSubject && (
          <Tooltip title='Assign User' placement='bottom' mouseEnterDelay={0.5}>
            <Button
              type='dashed'
              shape='circle'
              icon={<PlusOutlined />}
              size='large'
              onClick={() => {
                setAddUserModalOpen(true);
                setSelectedUser(null);
              }}
            />
          </Tooltip>
        )}
      </div>
      <Modal
        title='Manage User'
        open={userDetailsModalOpen}
        footer={null}
        onCancel={() => setUserDetailsModalOpen(false)}
      >
        <Space direction='vertical' style={{ width: '100%' }} size='large'>
          <Title level={4}>{getUserFullName(selectedRecord?.user)}</Title>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>{`${getUserFullName(
              selectedRecord?.user
            )}'s Completion Rate`}</Text>
            {/* TODO: add in actual completion rate statistics */}
            <Progress percent={selectedRecord?.completionRate} />
          </Space>
          <Space style={{ float: 'right', marginTop: '8px' }}>
            {/* TODO: shouldn't have double modal for good UX */}
            <ConfirmationModalButton
              modalProps={{
                title: 'Confirm Unassign User',
                body: `Are you sure you want to unassign ${selectedRecord?.user.firstName}?`,
                onConfirm: () => {
                  if (selectedRecord && unassignUserFromSubject) {
                    setUserDetailsModalOpen(false);
                    // TODO: update accordingly with EmployeeSubjectRecord
                    unassignUserFromSubject(selectedRecord?.user);
                  }
                }
              }}
              style={{ minWidth: '12em' }}
              type='primary'
              danger
            >{`Unassign ${selectedRecord?.user.firstName}`}</ConfirmationModalButton>
          </Space>
        </Space>
      </Modal>
      <Modal
        title='Assign User'
        open={addUserModalOpen}
        onCancel={() => setAddUserModalOpen(false)}
        onOk={() => {
          if (selectedUser && assignUserToSubject) {
            assignUserToSubject(selectedUser);
          }
          setAddUserModalOpen(false);
        }}
      >
        <Space direction='vertical' style={{ width: '100%' }} size={24}>
          <Select
            placeholder='Select User'
            style={{ width: '100%' }}
            allowClear
            value={selectedUser?.id}
            onChange={(value) =>
              setSelectedUser(
                allUsers.find((user) => user.id === value) ?? null
              )
            }
          >
            {allUsers.map((user) => (
              <Option key={user.id} value={user.id}>
                {getUserFullName(user)}
              </Option>
            ))}
          </Select>
          <div style={{ padding: '0px 8px' }}>
            {selectedUser && subjectTitle && (
              <Text>{`Assign ${getUserFullName(
                selectedUser
              )} to ${subjectTitle}? The user will be notified.`}</Text>
            )}
          </div>
        </Space>
      </Modal>
    </Card>
  );
};

export default UsersAssignedCard;
