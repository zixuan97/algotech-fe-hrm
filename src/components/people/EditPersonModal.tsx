import React, { useState } from 'react';
import { Input, Modal, Select, SelectProps, Space, Typography } from 'antd';
import { User, JobRole } from 'src/models/types';
import TimeoutAlert, { AlertType } from '../common/TimeoutAlert';
import { useNavigate } from 'react-router-dom';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import '../../styles/people/editPeople.scss';
import { map } from 'lodash';
import { editEmployee } from 'src/services/peopleService';

const { Text } = Typography;

type EditPersonModalProps = {
  open: boolean;
  allUsers?: User[];
  allJobRoles?: JobRole[];
  user?: User;
  onConfirm: () => void;
  onClose: () => void;
};

const EditPersonModal = (props: EditPersonModalProps) => {
  const { open, allUsers, allJobRoles, user, onConfirm, onClose } = props;
  const navigate = useNavigate();
  const [createLoading, setCreateLoading] = React.useState<boolean>(false);
  const [createSuccess, setCreateSuccess] = React.useState<boolean>(false);

  const { Option } = Select;

  const firstName = user?.firstName;
  const lastName = user?.lastName;
  let fullName = firstName + ' ' + lastName;
  let title = 'Edit ' + fullName;

  const getUserFullName = (user: User) => {
    return user.firstName + ' ' + user.lastName;
  };

  const managerDataSource = allUsers?.filter(
    (filteredUser) => filteredUser.id !== user?.id
  );

  const onOk = () => {
    onConfirm();
  };

  const options: SelectProps['options'] = [];
  for (let i = 10; i < 36; i++) {
    options.push({
      value: i.toString(36) + i,
      label: i.toString(36) + i
    });
  }

  return (
    <>
      <Modal
        title={title}
        open={open}
        onOk={onOk}
        onCancel={onClose}
        okText='Save Changes'
        okButtonProps={{ loading: createLoading, disabled: createSuccess }}
      >
        <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>Full Name</Text>
            <Input disabled={true} placeholder={fullName} />
          </Space>
          <div className='people-two-columns-container'>
            <div className='people-email-column'>
              <Space direction='vertical' style={{ width: '100%' }}>
                <Text>Email</Text>
                <Input disabled={true} placeholder={user?.email} />
              </Space>
            </div>
            <div className='people-permission-column'>
              <Space direction='vertical' style={{ width: '100%' }}>
                <Text>Permissions</Text>
                <Input disabled={true} placeholder={user?.role} />
              </Space>
            </div>
          </div>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>Role(s) (Optional)</Text>
            <Select
              mode='multiple'
              allowClear
              showArrow
              placeholder='Select Roles'
              style={{ width: '100%' }}
              value={user?.jobRoles?.map((role) => role.id)}
            >
              {allJobRoles?.map((option) => (
                <Option key={option.id} value={option.id}>
                  {option.jobRole}
                </Option>
              ))}
            </Select>
          </Space>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>Reports to (Optional)</Text>
            <Select
              showSearch
              allowClear
              style={{ width: '100%' }}
              placeholder='Select a person'
              optionFilterProp='children'
              value={user?.manager?.id}
            >
              {managerDataSource?.map((option) => (
                <Option key={option.id} value={option.id}>
                  {getUserFullName(option)}
                </Option>
              ))}
            </Select>
          </Space>
        </Space>
        {/* </div> */}
      </Modal>
    </>
  );
};

export default EditPersonModal;
