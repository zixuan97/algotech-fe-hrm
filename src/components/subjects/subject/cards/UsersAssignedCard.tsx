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
import React from 'react';
import { User } from 'src/models/types';
import { getAllNonB2bUsers } from 'src/services/userService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  getFirstLastNameInitials,
  getUserFullName
} from 'src/utils/formatUtils';
import '../../../../styles/common/common.scss';
import '../../../../styles/subjects/editSubject.scss';
import ConfirmationModalButton from '../../../common/ConfirmationModalButton';

const { Title, Text } = Typography;
const { Option } = Select;

type UsersAssignedCardProps = {
  usersAssigned: User[];
  subjectTitle: string | undefined;
  assignUserToSubject: (user: User) => void;
  unassignUserFromSubject: (user: User) => void;
};

const UsersAssignedCard = ({
  usersAssigned,
  subjectTitle,
  assignUserToSubject,
  unassignUserFromSubject
}: UsersAssignedCardProps) => {
  const [allUsers, setAllUsers] = React.useState<User[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [userDetailsModalOpen, setUserDetailsModalOpen] =
    React.useState<boolean>(false);
  const [addUserModalOpen, setAddUserModalOpen] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    asyncFetchCallback(getAllNonB2bUsers(), setAllUsers);
  }, []);

  return (
    <Card className='subject-card'>
      <Title level={5} style={{ marginBottom: '24px' }}>
        Users Assigned
      </Title>
      <div className='users-assigned-container'>
        {!!usersAssigned.length &&
          usersAssigned.map((user) => (
            <Tooltip
              key={user.id}
              title={`${user.firstName} ${user.lastName}`}
              placement='bottom'
            >
              <Button
                size='large'
                shape='circle'
                type='primary'
                onClick={() => {
                  setSelectedUser(user);
                  setUserDetailsModalOpen(true);
                }}
              >
                {getFirstLastNameInitials(user.firstName, user.lastName)}
              </Button>
            </Tooltip>
          ))}
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
      </div>
      <Modal
        title='Manage User'
        open={userDetailsModalOpen}
        footer={null}
        onCancel={() => setUserDetailsModalOpen(false)}
      >
        <Space direction='vertical' style={{ width: '100%' }} size='large'>
          <Title level={4}>{getUserFullName(selectedUser)}</Title>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>{`${getUserFullName(selectedUser)}'s Completion Rate`}</Text>
            {/* TODO: add in actual completion rate statistics */}
            <Progress percent={0} />
          </Space>
          <Space style={{ float: 'right', marginTop: '8px' }}>
            {/* TODO: shouldn't have double modal for the sake of UX */}
            <ConfirmationModalButton
              modalProps={{
                title: 'Confirm Reset Progress',
                body: `Are you sure you want to reset ${selectedUser?.firstName}'s progress? This action will reset ${selectedUser?.firstName}'s progress back to 0.`,
                onConfirm: () => void 0
              }}
              style={{ minWidth: '12em' }}
            >
              Reset Progress
            </ConfirmationModalButton>
            <ConfirmationModalButton
              modalProps={{
                title: 'Confirm Unassign User',
                body: `Are you sure you want to unassign ${selectedUser?.firstName}?`,
                onConfirm: () => {
                  if (selectedUser) {
                    setUserDetailsModalOpen(false);
                    unassignUserFromSubject(selectedUser);
                  }
                }
              }}
              style={{ minWidth: '12em' }}
              type='primary'
              danger
            >{`Unassign ${selectedUser?.firstName}`}</ConfirmationModalButton>
          </Space>
        </Space>
      </Modal>
      <Modal
        title='Assign User'
        open={addUserModalOpen}
        onCancel={() => setAddUserModalOpen(false)}
        onOk={() => {
          if (selectedUser) {
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
