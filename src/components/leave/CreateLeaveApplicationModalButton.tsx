import React from 'react';
import {
  CalendarOutlined,
  LoadingOutlined,
  PlusOutlined
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Typography
} from 'antd';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { generatePath, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { createLeaveApplication } from 'src/services/leaveService';
import { LEAVE_APPLICATION_DETAILS_URL } from '../routes/routes';

const { Text } = Typography;
const { RangePicker } = DatePicker;

const leaveOptions = [
  {
    label: 'Annual',
    value: 'ANNUAL'
  },
  { label: 'Childcare', value: 'CHILDCARE' },
  {
    label: 'Compassionate',
    value: 'COMPASSIONATE'
  },
  {
    label: 'Parental',
    value: 'PARENTAL'
  },
  {
    label: 'Sick',
    value: 'SICK'
  },
  {
    label: 'Unpaid',
    value: 'UNPAID'
  }
];

type CreateLeaveApplicationModalButtonProps = {
  employeeId: number | undefined;
};

const CreateLeaveApplicationModalButton = ({
  employeeId
}: CreateLeaveApplicationModalButtonProps) => {
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
      >
        Create Leave Application
      </Button>
      <Modal
        title='Create Leave Application'
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText='Submit Application'
        okButtonProps={{ loading: createLoading, disabled: createSuccess }}
      >
        <Form
          form={form}
          initialValues={{
            range_picker: [moment(), moment()]
          }}
          onFinish={(values) => {
            const { dateRange, leaveType, description } = values;

            setCreateLoading(true);

            let reqBody = {
              startDate: dateRange![0].toISOString(),
              endDate: dateRange![1].toISOString(),
              leaveType: leaveType,
              description: description,
              employeeId: employeeId
            };

            asyncFetchCallback(
              createLeaveApplication(reqBody),
              (res) => {
                setCreateLoading(false);
                setCreateSuccess(true);
                setTimeout(() => {
                  navigate(
                    generatePath(LEAVE_APPLICATION_DETAILS_URL, {
                      leaveId: res.id.toString()
                    })
                  );
                }, 2000);
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
                  <Text>Leave Application submitted successfullly!</Text>
                  <LoadingOutlined />
                </Space>
              }
              style={{ marginBottom: '16px' }}
              showIcon
            />
          )}
          <Card style={{ marginBottom: '16px' }}>
            <Space>
              <CalendarOutlined />
              <Text>You're creating a new leave application.</Text>
            </Space>
          </Card>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>Leave Duration *</Text>
            <Form.Item
              name='dateRange'
              rules={[
                {
                  type: 'array' as const,
                  required: true,
                  message: 'Please select a leave duration!'
                }
              ]}
            >
              <RangePicker showTime format='YYYY-MM-DD HH:mm' />
            </Form.Item>
          </Space>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>Leave Type *</Text>
            <Form.Item
              name='leaveType'
              rules={[
                {
                  required: true,
                  message: 'Please select a leave type!',
                  validateTrigger: 'onSubmit'
                }
              ]}
            >
              <Select options={leaveOptions} />
            </Form.Item>
          </Space>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>Description (Optional)</Text>
            <Form.Item name='description'>
              <Input.TextArea name='name' size='large' rows={4} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default CreateLeaveApplicationModalButton;
