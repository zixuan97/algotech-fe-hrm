import {
  FileDoneOutlined,
  FileSearchOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { Collapse, Space, Typography } from 'antd';
import { Quiz } from 'src/models/types';
import '../../../styles/subjects/editSubject.scss';

const { Text } = Typography;
const { Panel } = Collapse;

type QuizPanelProps = {
  quiz: Quiz;
};

const QuizPanel = ({ quiz }: QuizPanelProps) => {
  return (
    <Collapse
      style={{ marginBottom: '4px' }}
      expandIcon={({ isActive }) =>
        isActive ? <FileSearchOutlined /> : <FileDoneOutlined />
      }
    >
      <Panel
        header={quiz.title}
        key={1}
        extra={
          <Space align='center'>
            <span className={`status-dot-${quiz.status.toLowerCase()}`} />
            <MoreOutlined onClick={(e) => e.stopPropagation()} />
          </Space>
        }
      >
        <Space direction='vertical'>
          {quiz.questions.map((question, index) => (
            <Text key={index}>{question.question}</Text>
          ))}
        </Space>
      </Panel>
    </Collapse>
  );
};

export default QuizPanel;
