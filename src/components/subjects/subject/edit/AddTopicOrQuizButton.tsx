import { Button, Form, Input, Select, Typography } from 'antd';
import '../../../../styles/common/common.scss';
import { PlusOutlined } from '@ant-design/icons';
import { startCase } from 'lodash';
import { SubjectSectionType } from '../../subjectHelper';

const { Text } = Typography;
const { Option } = Select;

type addQuizOrTopicProps = {
  addQuizOrTopic: (addQuizOrTopicProps: {
    title: string;
    addSectionType: SubjectSectionType;
  }) => void;
  updateSubjectLoading: boolean;
};

const AddTopicOrQuizButton = ({
  addQuizOrTopic,
  updateSubjectLoading
}: addQuizOrTopicProps) => {
  const [form] = Form.useForm<{
    addSectionType: SubjectSectionType;
    title: string;
  }>();
  const sectionTypeValue = Form.useWatch('addSectionType', form)?.toLowerCase();

  return (
    <Form
      form={form}
      initialValues={{ addSectionType: SubjectSectionType.TOPIC }}
      onFinish={(values) => {
        console.log(values);
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
          loading={updateSubjectLoading}
        >
          Add {startCase(sectionTypeValue)}
        </Button>
      </div>
    </Form>
  );
};

export default AddTopicOrQuizButton;
