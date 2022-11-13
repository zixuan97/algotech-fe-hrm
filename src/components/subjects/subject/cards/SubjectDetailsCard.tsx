import { Card, Descriptions, Space, Switch, Typography } from 'antd';
import moment from 'moment';
import { User } from 'src/models/types';
import { READABLE_DDMMYY_TIME_12H } from 'src/utils/dateUtils';
import '../../../../styles/common/common.scss';
import '../../../../styles/subjects/editSubject.scss';

const { Title } = Typography;

type SubjectDetailsCardProps = {
  createdBy: User | undefined;
  createdAt: Date | undefined;
  lastUpdatedBy: User | undefined;
  lastUpdatedAt: Date | undefined;
  isPublished: boolean | undefined;
  updateIsPublished: (checked: boolean) => void;
};

const SubjectDetailsCard = ({
  createdBy,
  createdAt,
  lastUpdatedBy,
  lastUpdatedAt,
  isPublished,
  updateIsPublished
}: SubjectDetailsCardProps) => {
  return (
    <Card className='subject-card'>
      <Title level={5} style={{ marginBottom: '24px' }}>
        Subject Details
      </Title>
      <Space direction='vertical' size='middle'>
        <Descriptions column={1} labelStyle={{ width: '40%' }}>
          <Descriptions.Item label='Created By'>
            {createdBy &&
              createdAt &&
              `${createdBy.firstName} ${createdBy.lastName} on ${moment(
                createdAt
              ).format(READABLE_DDMMYY_TIME_12H)}`}
          </Descriptions.Item>
          <Descriptions.Item label='Last Updated By'>
            {lastUpdatedBy &&
              lastUpdatedAt &&
              `${lastUpdatedBy.firstName} ${lastUpdatedBy.lastName} on ${moment(
                lastUpdatedAt
              ).format(READABLE_DDMMYY_TIME_12H)}`}
          </Descriptions.Item>
          <Descriptions.Item label='Published'>
            <Switch checked={isPublished} onChange={updateIsPublished} />
          </Descriptions.Item>
        </Descriptions>
      </Space>
    </Card>
  );
};

export default SubjectDetailsCard;
