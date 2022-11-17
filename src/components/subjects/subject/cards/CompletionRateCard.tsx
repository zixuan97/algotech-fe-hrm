import { Card, Progress, Select, Space, Typography } from 'antd';
import { startCase } from 'lodash';
import React from 'react';
import { EmployeeSubjectRecord } from 'src/models/types';
import '../../../../styles/common/common.scss';
import '../../../../styles/subjects/subject.scss';

const { Title, Text } = Typography;
const { Option } = Select;

enum CompletionRateView {
  AVERAGE = 'AVERAGE',
  PER_USER = 'PER_USER'
}

type CompletionRateCardProps = {
  completionRate: number | undefined;
  usersAssigned: EmployeeSubjectRecord[];
};

const CompletionRateCard = ({
  completionRate,
  usersAssigned
}: CompletionRateCardProps) => {
  const [completionRateView, setCompletionRateView] =
    React.useState<CompletionRateView>(CompletionRateView.AVERAGE);
  const [selectedRecord, setSelectedRecord] =
    React.useState<EmployeeSubjectRecord | null>(null);
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
                setSelectedRecord(null);
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
              onChange={(value) => {
                // TODO: check whether EmployeeSubjectRecord will have its own ID (it should have bah)
                setSelectedRecord(
                  usersAssigned.find((record) => record.id === value) ?? null
                );
              }}
            >
              {usersAssigned.map((record) => (
                <Option
                  key={record.id}
                  value={record.id}
                >{`${record.user.firstName} ${record.user.lastName}`}</Option>
              ))}
            </Select>
          )}
          <div style={{ marginTop: '16px' }}>
            {(completionRateView === CompletionRateView.AVERAGE ||
              selectedRecord) && (
              <Text>{`${
                completionRateView === CompletionRateView.AVERAGE
                  ? 'Average'
                  : `${selectedRecord?.user.firstName}'s`
              } Completion Rate`}</Text>
            )}
            <Progress
              percent={completionRate}
              format={(percent) => `${percent?.toFixed(0)}%`}
              style={{ width: '100%' }}
            />
          </div>
        </Space>
      ) : (
        <Text>No users have been assigned to this subject yet.</Text>
      )}
    </Card>
  );
};

export default CompletionRateCard;
