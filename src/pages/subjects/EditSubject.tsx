import {
  BookOutlined,
  FileDoneOutlined,
  FileSearchOutlined,
  FolderOpenOutlined,
  MoreOutlined
} from '@ant-design/icons';
import {
  Avatar,
  Card,
  Collapse,
  Descriptions,
  Grid,
  Input,
  Progress,
  Select,
  Space,
  Switch,
  Tooltip,
  Typography
} from 'antd';
import '../../styles/common/common.scss';
import '../../styles/subjects/editSubject.scss';

const { Text, Title } = Typography;
const { Option } = Select;
const { Panel } = Collapse;
const { useBreakpoint } = Grid;

const completionRateOptions = ['Average', 'Per User'];

const EditSubject = () => {
  const screens = useBreakpoint();
  console.log(screens);
  return (
    <div className='container-left-full'>
      <Space direction='vertical' size='middle'>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Text>Subject Name</Text>
          <Input size='large' />
        </Space>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Text>Subject Description</Text>
          <Input.TextArea size='large' rows={4} />
        </Space>
        <div className='subject-card-container'>
          <Card className='subject-card'>
            <Title level={5} style={{ marginBottom: '24px' }}>
              Subject Details
            </Title>
            <Space direction='vertical' size='middle'>
              <Descriptions column={1} labelStyle={{ width: '40%' }}>
                <Descriptions.Item label='Created By'>
                  Daniel Ong Ee Shaeon, 20 Aug 22 16:00
                </Descriptions.Item>
                <Descriptions.Item label='Last Updated By'>
                  Daniel Ong Ee Shaeon, 20 Aug 22 16:00
                </Descriptions.Item>
                <Descriptions.Item label='Published'>
                  <Switch />
                </Descriptions.Item>
              </Descriptions>
            </Space>
          </Card>
          <Card className='subject-card'>
            <Title level={5} style={{ marginBottom: '24px' }}>
              Users Assigned
            </Title>
            <div className='users-assigned-container'>
              <Tooltip title='Daniel Ong' placement='bottom'>
                <Avatar size='large'>DO</Avatar>
              </Tooltip>
              <Tooltip title='Daniel Ong' placement='bottom'>
                <Avatar size='large'>DO</Avatar>
              </Tooltip>
              <Tooltip title='Daniel Ong' placement='bottom'>
                <Avatar size='large'>DO</Avatar>
              </Tooltip>
            </div>
          </Card>
          <Card className='subject-card'>
            {/* <div className='completion-rate-title'> */}
            <Title level={5} style={{ marginBottom: '24px' }}>
              Completion Rate
            </Title>
            <Space direction='vertical' size='middle' style={{ width: '100%' }}>
              {/* <Button icon={<MoreOutlined />} type='text'></Button> */}
              {/* </div> */}

              <Select style={{ width: '100%' }}>
                {completionRateOptions.map((opt) => (
                  <Option key={opt} value={opt}>
                    {opt}
                  </Option>
                ))}
              </Select>
              <Select style={{ width: '100%' }} placeholder='Select User'>
                {completionRateOptions.map((opt) => (
                  <Option key={opt} value={opt}>
                    {opt}
                  </Option>
                ))}
              </Select>
              <div style={{ marginTop: '16px' }}>
                <Text>Average Completion Rate</Text>
                <Progress percent={70} />
              </div>
            </Space>
          </Card>
        </div>
        <Title level={4}>Topics & Quizzes</Title>
        <Space direction='vertical' style={{ width: '100%' }}>
          {/* change to map */}
          <Collapse
            style={{ marginBottom: '4px' }}
            expandIcon={({ isActive }) =>
              isActive ? <FolderOpenOutlined /> : <BookOutlined />
            }
          >
            <Panel
              header='Topic 1'
              key={1}
              extra={
                <Space align='center'>
                  <span className='status-dot-draft' />
                  <MoreOutlined />
                </Space>
              }
            >
              Topic 1
            </Panel>
          </Collapse>
          <Collapse
            style={{ marginBottom: '4px' }}
            expandIcon={({ isActive }) =>
              isActive ? <FolderOpenOutlined /> : <BookOutlined />
            }
          >
            <Panel
              header='Topic 2'
              key={1}
              extra={
                <Space align='center'>
                  <span className='status-dot-pending' />
                  <MoreOutlined />
                </Space>
              }
            >
              Topic 1
            </Panel>
          </Collapse>
          <Collapse
            style={{ marginBottom: '4px' }}
            expandIcon={({ isActive }) =>
              isActive ? <FileSearchOutlined /> : <FileDoneOutlined />
            }
          >
            <Panel
              header='Quiz 1'
              key={1}
              extra={
                <Space align='center'>
                  <span className='status-dot-finished' />
                  <MoreOutlined />
                </Space>
              }
            >
              Topic 1
            </Panel>
          </Collapse>
        </Space>
      </Space>
    </div>
  );
};

export default EditSubject;
