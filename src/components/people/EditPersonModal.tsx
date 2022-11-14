import React, { useState } from 'react';
import {
  AutoComplete,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  SelectProps,
  Space,
  Typography
} from 'antd';
import { User } from 'src/models/types';
import TimeoutAlert, { AlertType } from '../common/TimeoutAlert';
import { useNavigate } from 'react-router-dom';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import '../../styles/people/editPeople.scss';

const { Text } = Typography;

type EditPersonModalProps = {
  open: boolean;
  allUsers?: User[];
  user?: User;
  onConfirm: () => void;
  onClose: () => void;
};

const EditPersonModal = (props: EditPersonModalProps) => {
  const { open, allUsers, user, onConfirm, onClose } = props;
  const navigate = useNavigate();
  const [createLoading, setCreateLoading] = React.useState<boolean>(false);
  const [createSuccess, setCreateSuccess] = React.useState<boolean>(false);

  const [form] = Form.useForm();
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
      <Modal title={title} open={open} onOk={onOk} onCancel={onClose}>
        <Form
          form={form}
          onFinish={(values) => {
            console.log('form');
          }}
        >
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>Full Name</Text>
            <Form.Item name='fullName'>
              <Input disabled={true} placeholder={fullName} />
            </Form.Item>
          </Space>
          <div className='people-two-columns-container'>
            <div className='people-email-column'>
              <Space direction='vertical' style={{ width: '100%' }}>
                <Text>Email</Text>
                <Form.Item name='email'>
                  <Input disabled={true} placeholder={user?.email} />
                </Form.Item>
              </Space>
            </div>{' '}
            <div className='people-permission-column'>
              <Space direction='vertical' style={{ width: '100%' }}>
                <Text>Permissions</Text>
                <Form.Item name='role'>
                  <Input disabled={true} placeholder={user?.role} />
                </Form.Item>
              </Space>
            </div>
          </div>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>Role(s) (Optional)</Text>
            <Form.Item name='jobRoles'>
              <Select
                mode='tags'
                allowClear
                showArrow
                placeholder='Select Roles'
                defaultValue={['a10', 'c12']}
                style={{ width: '100%' }}
                options={options}
              />
            </Form.Item>
          </Space>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>Manager (Optional)</Text>
            <Form.Item name='manager'>
              <Select
                showSearch
                allowClear
                style={{ width: '100%' }}
                placeholder='Select a person'
                optionFilterProp='children'
              >
                {managerDataSource?.map((option) => (
                  <Option key={option.id} value={option.id}>
                    {getUserFullName(option)}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default EditPersonModal;
