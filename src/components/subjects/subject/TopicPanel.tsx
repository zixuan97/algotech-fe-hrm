import {
  BookOutlined,
  FolderOpenOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { Collapse, Space, Typography } from 'antd';
import { Topic } from 'src/models/types';

const { Text } = Typography;
const { Panel } = Collapse;

type TopicPanelProps = {
  topic: Topic;
};

const TopicPanel = ({ topic }: TopicPanelProps) => {
  return (
    <Collapse
      style={{ marginBottom: '4px' }}
      expandIcon={({ isActive }) =>
        isActive ? <FolderOpenOutlined /> : <BookOutlined />
      }
    >
      <Panel
        header={topic.title}
        key={1}
        extra={
          <Space align='center'>
            <span className={`status-dot-${topic.status.toLowerCase()}`} />
            <MoreOutlined onClick={(e) => e.stopPropagation()} />
          </Space>
        }
      >
        <Space direction='vertical'>
          {topic.steps.map((step, index) => (
            <Text key={index}>{step.title}</Text>
          ))}
        </Space>
      </Panel>
    </Collapse>
  );
};

export default TopicPanel;
