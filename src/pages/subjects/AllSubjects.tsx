import { Space } from 'antd';
import { Link } from 'react-router-dom';
import { EDIT_SUBJECT_URL, EDIT_TOPIC_URL } from 'src/components/routes/routes';

const AllSubjects = () => {
  return (
    <Space direction='vertical'>
      <Link to={EDIT_SUBJECT_URL}>Edit Subject</Link>
      <Link to={EDIT_TOPIC_URL}>Edit Topic</Link>
    </Space>
  );
};

export default AllSubjects;
