import React from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Space,
  Typography
} from 'antd';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { generatePath, useNavigate } from 'react-router-dom';
import {  PEOPLE_ROLES_ID_URL } from 'src/components/routes/routes';
import { createJobRole } from 'src/services/jobRoleService';

const { Text } = Typography;

const CreateRoleModalButton = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [createLoading, setCreateLoading] = React.useState<boolean>(false);
  const [createSuccess, setCreateSuccess] = React.useState<boolean>(false);
  const [createFailure, setCreateFailure] = React.useState<boolean>(false);
  const [form] = Form.useForm();

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
          onFinish={(values) => {
            const { jobRole } = values;
            setCreateLoading(true);
            asyncFetchCallback(
               createJobRole(jobRole),
              (res) => {
                setCreateLoading(false);
                setCreateSuccess(true);
                setTimeout(() => {
                  navigate(
                    generatePath(PEOPLE_ROLES_ID_URL, {
                      roleId: res.id.toString()
                    })
                  );
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
              <Text>
                You're creating a new role.
              </Text>
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
              <Input name='name' size='large' />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default CreateRoleModalButton;
