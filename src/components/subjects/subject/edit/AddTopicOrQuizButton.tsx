import { Button, Form, Input, Select, Typography } from 'antd';
import '../../../../styles/common/common.scss';
import { PlusOutlined } from '@ant-design/icons';
import { startCase } from 'lodash';
import { SubjectSectionType } from '../../subjectHelper';
import { Quiz, Subject, Topic } from 'src/models/types';
import React from 'react';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getNewTopic } from '../../topic/topicHelper';
import { getNewQuiz } from '../quiz/quizHelper';
import { createTopic } from 'src/services/topicService';
import { createQuiz } from 'src/services/quizService';

const { Text } = Typography;
const { Option } = Select;

type addQuizOrTopicProps = {
  orderedTopicsAndQuizzes: (Topic | Quiz)[];
  subject: Subject | null;
  refreshSubject: () => void;
};

const AddTopicOrQuizButton = ({
  orderedTopicsAndQuizzes,
  subject,
  refreshSubject
}: // addQuizOrTopic,
// updateSubjectLoading
addQuizOrTopicProps) => {
  const [form] = Form.useForm<{
    addSectionType: SubjectSectionType;
    title: string;
  }>();
  const [addLoading, setAddLoading] = React.useState<boolean>(false);
  const sectionTypeValue = Form.useWatch('addSectionType', form)?.toLowerCase();

  const addQuizOrTopic = (addQuizOrTopicProps: {
    title: string;
    addSectionType: SubjectSectionType;
  }) => {
    const { title, addSectionType } = addQuizOrTopicProps;
    if (subject) {
      setAddLoading(true);
      if (addSectionType === SubjectSectionType.TOPIC) {
        asyncFetchCallback(
          createTopic(
            getNewTopic(subject.id, orderedTopicsAndQuizzes.length + 1, title)
          ),
          () => refreshSubject(),
          () => void 0,
          { updateLoading: setAddLoading }
        );
      } else {
        asyncFetchCallback(
          createQuiz(
            getNewQuiz(subject.id, orderedTopicsAndQuizzes.length + 1, title)
          ),
          () => refreshSubject(),
          () => void 0,
          { updateLoading: setAddLoading }
        );
      }
    }
  };

  return (
    <Form
      form={form}
      initialValues={{ addSectionType: SubjectSectionType.TOPIC }}
      onFinish={(values) => {
        addQuizOrTopic(values);
      }}
      style={{ marginTop: '16px' }}
    >
      <Text>Add {sectionTypeValue}</Text>
      <div
        className='container-spaced-out'
        style={{ gap: '8px', marginTop: '8px' }}
      >
        <Form.Item style={{ flex: 0.4 }} name='addSectionType' preserve>
          <Select size='large'>
            {Object.values(SubjectSectionType).map((sectionType) => (
              <Option key={sectionType} value={sectionType}>
                {startCase(sectionType.toLowerCase())}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name='title'
          style={{ flex: 1 }}
          rules={[
            {
              required: true,
              message: `Please enter a title!`,
              validateTrigger: 'onSubmit'
            }
          ]}
        >
          <Input
            size='large'
            placeholder={`${startCase(sectionTypeValue)} Title`}
          />
        </Form.Item>
        <Button
          style={{ flex: 1 }}
          htmlType='submit'
          type='dashed'
          icon={<PlusOutlined />}
          size='large'
          loading={addLoading}
        >
          Add {startCase(sectionTypeValue)}
        </Button>
      </div>
    </Form>
  );
};

export default AddTopicOrQuizButton;
