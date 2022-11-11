import { Card, Progress, Select, Space, Typography } from 'antd';
import { startCase } from 'lodash';
import React from 'react';
import { User } from 'src/models/types';
import '../../../../styles/common/common.scss';
import '../../../../styles/subjects/editSubject.scss';

const { Title, Text } = Typography;
const { Option } = Select;

enum CompletionRateView {
  AVERAGE = 'AVERAGE',
  PER_USER = 'PER_USER'
}

type CompletionRateCardProps = {
  completionRate: number | undefined;
  usersAssigned: User[];
};

const CompletionRateCard = ({
  completionRate,
  usersAssigned
}: CompletionRateCardProps) => {
  const [completionRateView, setCompletionRateView] =
    React.useState<CompletionRateView>(CompletionRateView.AVERAGE);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  return (
    <Card className='subject-card'>
      <Title level={5} style={{ marginBottom: '24px' }}>
        Completion Rate
      </Title>
      {usersAssigned.length > 0 ? (
        <Space direction='vertical' size='middle' style={{ width: '100%' }}>
          <Select
            style={{ width: '100%' }}
            value={completionRateView}
            onChange={(value) => {
              setCompletionRateView(value);
              if (value === CompletionRateView.AVERAGE) {
                setSelectedUser(null);
              }
            }}
          >
            {Object.values(CompletionRateView).map((opt) => (
              <Option key={opt} value={opt}>
                {startCase(opt.toLowerCase())}
              </Option>
            ))}
          </Select>
          {completionRateView === CompletionRateView.PER_USER && (
            <Select
              style={{ width: '100%' }}
              placeholder='Select User'
              onChange={(value) =>
                setSelectedUser(
                  usersAssigned.find((user) => user.id === value) ?? null
                )
              }
            >
              {usersAssigned.map((user) => (
                <Option
                  key={user.id}
                  value={user.id}
                >{`${user.firstName} ${user.lastName}`}</Option>
              ))}
            </Select>
          )}
          <div style={{ marginTop: '16px' }}>
            {(completionRateView === CompletionRateView.AVERAGE ||
              selectedUser) && (
              <Text>{`${
                completionRateView === CompletionRateView.AVERAGE
                  ? 'Average'
                  : `${selectedUser?.firstName}'s`
              } Completion Rate`}</Text>
            )}
            <Progress percent={completionRate} />
          </div>
        </Space>
      ) : (
        <Text>No users have been assigned to this subject yet.</Text>
      )}
    </Card>
  );
};

export default CompletionRateCard;
