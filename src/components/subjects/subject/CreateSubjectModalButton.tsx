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
import { startCase } from 'lodash';
import { SubjectType } from 'src/models/types';
import { getNewSubject } from '../subjectHelper';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { createSubject } from 'src/services/subjectService';
import { generatePath, useNavigate } from 'react-router-dom';
import { EDIT_SUBJECT_URL } from 'src/components/routes/routes';
import { getSubjectTypeIcon } from 'src/pages/subjects/AllSubjects';

const { Text } = Typography;

type CreateSubjectModalButtonProps = {
  subjectType: SubjectType;
};

const CreateSubjectModalButton = ({
  subjectType
}: CreateSubjectModalButtonProps) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [createLoading, setCreateLoading] = React.useState<boolean>(false);
  const [createSuccess, setCreateSuccess] = React.useState<boolean>(false);
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
      >{`Create ${startCase(subjectType.toLowerCase())} Subject`}</Button>
      <Modal
        title='Create Subject'
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText='Create Subject'
        okButtonProps={{ loading: createLoading, disabled: createSuccess }}
      >
        <Form
          form={form}
          onFinish={(values) => {
            const { title, description } = values;

            setCreateLoading(true);
            asyncFetchCallback(
              createSubject(getNewSubject(subjectType, title, description)),
              (res) => {
                setCreateLoading(false);
                setCreateSuccess(true);
                setTimeout(() => {
                  navigate(
                    generatePath(EDIT_SUBJECT_URL, {
                      subjectId: res.id.toString()
                    })
                  );
                }, 500);
              },
              () => void 0,
              { updateLoading: setCreateLoading }
            );
          }}
        >
          {createSuccess && (
            <Alert
              message={
                <Space>
                  <Text>Subject created successfullly!</Text>
                  <LoadingOutlined />
                </Space>
              }
              style={{ marginBottom: '16px' }}
              showIcon
            />
          )}
          <Card style={{ marginBottom: '16px' }}>
            <Space>
              {getSubjectTypeIcon(subjectType)}
              <Text>
                You're creating a {startCase(subjectType.toLowerCase())}{' '}
                subject.
              </Text>
            </Space>
          </Card>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>Subject Title *</Text>
            <Form.Item
              name='title'
              rules={[
                {
                  required: true,
                  message: 'Please enter a title!',
                  validateTrigger: 'onSubmit'
                }
              ]}
            >
              <Input name='name' size='large' />
            </Form.Item>
          </Space>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>Subject Description (Optional)</Text>
            <Form.Item name='description'>
              <Input.TextArea name='name' size='large' rows={4} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default CreateSubjectModalButton;
