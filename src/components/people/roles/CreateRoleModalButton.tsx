import React from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Typography
} from 'antd';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { createJobRole } from 'src/services/jobRoleService';
import { JobRole, User } from 'src/models/types';
import { getUserFullName } from 'src/utils/formatUtils';

const { Text } = Typography;

type CreateRoleModalProps = {
  setShouldFetchData: (bool: boolean) => void;
  users: User[];
};

const CreateRoleModalButton = ({
  setShouldFetchData,
  users
}: CreateRoleModalProps) => {
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [createLoading, setCreateLoading] = React.useState<boolean>(false);
  const [createSuccess, setCreateSuccess] = React.useState<boolean>(false);
  const [createFailure, setCreateFailure] = React.useState<boolean>(false);
  const [newJobRole, setNewJobRole] = React.useState<Partial<JobRole>>({
    usersInJobRole: []
  });
  const [form] = Form.useForm();
  const { Option } = Select;

  const handleSelectChange = (value: number[]) => {
    setNewJobRole(
      (prev: any) =>
        prev && {
          ...prev,
          usersInJobRole: users.filter((user) => value.includes(user.id))
        }
    );
  };

  const editNamedField = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewJobRole(
      (prev: any) => prev && { ...prev, [e.target.name]: e.target.value }
    );

  return (
    <>
      <Button
        style={{ float: 'right' }}
        size='large'
        icon={<PlusOutlined />}
        type='primary'
        onClick={() => {
          form.resetFields();
          setModalOpen(true);
        }}
      >
        Create Role
      </Button>

      <Modal
        title='Create Role'
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText='Create Role'
        okButtonProps={{ loading: createLoading, disabled: createSuccess }}
      >
        <Form
          form={form}
          onFinish={() => {
            setCreateLoading(true);
            asyncFetchCallback(
              createJobRole(newJobRole),
              () => {
                setCreateLoading(false);
                setCreateSuccess(true);
                setTimeout(() => {
                  setCreateSuccess(false);
                  setModalOpen(false);
                  setShouldFetchData(true);
                }, 500);
              },
              () => {
                setCreateLoading(false);
                setCreateFailure(true);
                setTimeout(() => {
                  setCreateFailure(false);
                }, 5000);
              },
              { updateLoading: setCreateLoading }
            );
          }}
        >
          {createSuccess && (
            <Alert
              message={
                <Space>
                  <Text>Role created successfullly!</Text>
                  <LoadingOutlined />
                </Space>
              }
              style={{ marginBottom: '16px' }}
              showIcon
            />
          )}
          {createFailure && (
            <Alert
              message={
                <Space>
                  <Text>Failed to create role! Try again later.</Text>
                  <LoadingOutlined />
                </Space>
              }
              style={{ marginBottom: '16px' }}
              showIcon
            />
          )}
          <Card style={{ marginBottom: '16px' }}>
            <Space>
              <Text>You're creating a new role.</Text>
            </Space>
          </Card>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>Role Name *</Text>
            <Form.Item
              name='jobRole'
              rules={[
                {
                  required: true,
                  message: 'Please enter a role name!',
                  validateTrigger: 'onSubmit'
                }
              ]}
            >
              <Input name='jobRole' size='large' onChange={editNamedField} />
            </Form.Item>

            <Text>Description *</Text>
            <Form.Item
              name='description'
              rules={[
                {
                  required: true,
                  message: 'Please enter a description!',
                  validateTrigger: 'onSubmit'
                }
              ]}
            >
              <Input name='description' size='large' onChange={editNamedField} />
            </Form.Item>
            <Form.Item name='usersInJobRole'>
              <Space direction='vertical' style={{ width: '100%' }}>
                <Text>Add Users (Optional)</Text>
                <Select
                  mode='multiple'
                  allowClear
                  showArrow
                  showSearch
                  placeholder='Select Users'
                  optionFilterProp='children'
                  style={{ width: '100%' }}
                  defaultValue={
                    newJobRole?.usersInJobRole!.map((user) => user.id) ?? []
                  }
                  onChange={handleSelectChange}
                >
                  {users.map((option) => (
                    <Option key={option.id} value={option.id}>
                      {getUserFullName(option)}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default CreateRoleModalButton;
