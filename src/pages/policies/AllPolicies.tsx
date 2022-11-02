import { Link } from 'react-router-dom';
import { EDIT_TOPIC_URL } from 'src/components/routes/routes';

const AllPolicies = () => {
  return (
    <div>
      <Link to={EDIT_TOPIC_URL}>Edit Topic</Link>
    </div>
  );
};

export default AllPolicies;
