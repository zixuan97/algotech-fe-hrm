import { Button, Input, Select, Space, Typography } from 'antd';
import React from 'react';
import TextEditor from '../TextEditor';
import '../../styles/common/common.scss';
import '../../styles/subjects/editTopic.scss';
import { PlusOutlined } from '@ant-design/icons';
import { ContentStatus, Step } from 'src/models/types';
import { startCase } from 'lodash';
import StepsList from 'src/components/subjects/topic/StepsList';
import { stripHtml } from 'src/utils/formatUtils';

const { Title, Text } = Typography;
const { Option } = Select;

const mockSteps: Step[] = [
  {
    id: 1,
    title: 'Step 1',
    content: 'Hello 1',
    topicId: 1
  },
  {
    id: 2,
    title: 'Step 2',
    content: 'Hello 2',
    topicId: 1
  },
  {
    id: 3,
    title: 'Step 3',
    content: 'Hello 3',
    topicId: 1
  },
  {
    id: 4,
    title: 'Step 4',
    content: 'Hello 4',
    topicId: 1
  }
];

const EditTopic = () => {
  const [steps, setSteps] = React.useState<Step[]>(mockSteps);
  const [selectedStep, setSelectedStep] = React.useState<Step | null>(steps[0]);

  return (
    <div className='container-left-full'>
      <div
        className='container-spaced-out'
        style={{ width: '100%', marginBottom: 24 }}
      >
        <Space direction='vertical' style={{ width: '100%', flex: '0 0 80%' }}>
          <Text>Topic Name</Text>
          <Input size='large' />
        </Space>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Text>Status</Text>
          <Select size='large' style={{ width: '100%' }}>
            {Object.values(ContentStatus).map((status) => (
              <Option key={status} value={status}>
                <Space align='center'>
                  <span className={`status-dot-${status.toLowerCase()}`} />
                  <Text>{startCase(status.toLowerCase())}</Text>
                </Space>
              </Option>
            ))}
          </Select>
        </Space>
      </div>
      <Title level={4}>Steps</Title>
      <div className='steps-container'>
        <div className='steps-sidebar'>
          <StepsList
            steps={steps}
            updateSteps={setSteps}
            selectedStep={selectedStep}
            updateSelectedStep={setSelectedStep}
          />
          <Button
            block
            type='dashed'
            icon={<PlusOutlined />}
            onClick={() =>
              setSteps((prev) => [
                ...prev,
                { title: `Step ${prev.length + 1}`, content: '', topicId: 1 }
              ])
            }
          >
            Add Step
          </Button>
        </div>
        <div className='steps-editor'>
          <Input
            size='large'
            placeholder='Step Title'
            value={selectedStep?.title}
          />
          <TextEditor
            content={selectedStep?.content}
            updateContent={(content: string) =>
              setSelectedStep((prev) =>
                prev ? { ...prev, content: content } : null
              )
            }
            style={{ flex: 0.8 }}
          />
          {/* strip html tags and count length of actual text including space */}
          <Text>{`Characters: ${
            stripHtml(selectedStep?.content).length
          }`}</Text>
          <Space style={{ alignSelf: 'flex-end' }}>
            <Button style={{ width: '10em' }}>Previous Step</Button>
            <Button style={{ width: '10em' }} type='primary'>
              Next Step
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default EditTopic;
