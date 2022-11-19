import { EyeOutlined, PlayCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Space,
  Table,
  TableColumnsType,
  Tabs,
  Tooltip,
  Typography
} from 'antd';
import { differenceWith } from 'lodash';
import moment from 'moment';
import React from 'react';
import {
  createSearchParams,
  generatePath,
  Link,
  useNavigate
} from 'react-router-dom';
import { ASSIGNED_SUBJECT_URL } from 'src/components/routes/routes';
import authContext from 'src/context/auth/authContext';
import { EmployeeSubjectRecord, Subject } from 'src/models/types';
import { getAllSubjectRecordsPerUser } from 'src/services/subjectRecordService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { BOOLEAN_TRUE } from 'src/utils/constants';
import { READABLE_DDMMYY_TIME_12H } from 'src/utils/dateUtils';
import '../../styles/common/common.scss';

const { Title } = Typography;

const MySubjects = () => {
  const navigate = useNavigate();
  const { user } = React.useContext(authContext);
  const [mySubjects, setMySubjects] = React.useState<EmployeeSubjectRecord[]>(
    []
  );
  const [loading, setLoading] = React.useState<boolean>(false);

  const completedSubjects = React.useMemo(
    () => mySubjects.filter((subject) => subject.completionRate === 100) ?? [],
    [mySubjects]
  );

  const incompleteSubjects = React.useMemo(
    () =>
      differenceWith(mySubjects, completedSubjects, (a, b) => a.id === b.id),
    [mySubjects, completedSubjects]
  );

  React.useEffect(() => {
    if (user) {
      setLoading(true);
      asyncFetchCallback(
        getAllSubjectRecordsPerUser(),
        (res) => {
          setMySubjects(res.filter((res) => res.subject.isPublished));
        },
        () => void 0,
        { updateLoading: setLoading }
      );
    }
  }, [user]);

  const columns: TableColumnsType<EmployeeSubjectRecord> = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      width: '60%',
      render: (value: Subject) => (
        <Link
          to={generatePath(ASSIGNED_SUBJECT_URL, {
            subjectId: value.id.toString()
          })}
        >
          {value.title}
        </Link>
      )
    },
    {
      title: 'Completion Rate',
      dataIndex: 'completionRate',
      align: 'right',
      render: (value) => `${value}%`
    },
    {
      title: 'Last Attempted',
      dataIndex: 'lastAttemptedAt',
      render: (value) => moment(value).format(READABLE_DDMMYY_TIME_12H)
    },
    {
      title: 'Actions',
      dataIndex: 'subject',
      render: (value) => (
        <Space>
          <Tooltip>
            <Button
              style={{ width: '8em' }}
              icon={<PlayCircleOutlined />}
              type='primary'
              shape='round'
              onClick={() =>
                navigate({
                  pathname: generatePath(ASSIGNED_SUBJECT_URL, {
                    subjectId: value.id
                  }),
                  search: createSearchParams({
                    attempt: BOOLEAN_TRUE
                  }).toString()
                })
              }
            >
              Attempt
            </Button>
          </Tooltip>
          <Tooltip>
            <Button
              style={{ width: '8em' }}
              icon={<EyeOutlined />}
              shape='round'
              onClick={() =>
                navigate(
                  generatePath(ASSIGNED_SUBJECT_URL, { subjectId: value.id })
                )
              }
            >
              View
            </Button>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className='container-left-full'>
      <Title level={2}>My Assigned Subjects</Title>

      <Space direction='vertical' style={{ width: '100%' }} size='large'>
        <Tabs
          tabBarStyle={{ marginBottom: '32px' }}
          items={[
            {
              label: 'All Subjects',
              key: 'all',
              children: (
                <Space direction='vertical' style={{ width: '100%' }}>
                  <Title level={4}>All Assigned Subjects</Title>
                  <Table
                    columns={columns}
                    dataSource={mySubjects}
                    pagination={{ pageSize: 10 }}
                    rowKey={(record) => record.id}
                    loading={loading}
                  />
                </Space>
              )
            },
            {
              label: 'Completed',
              key: 'complete',
              children: (
                <Space direction='vertical' style={{ width: '100%' }}>
                  <Title level={4}>Completed Subjects</Title>
                  <Table
                    columns={columns}
                    dataSource={completedSubjects}
                    pagination={{ pageSize: 10 }}
                    rowKey={(record) => record.id}
                    loading={loading}
                  />
                </Space>
              )
            },
            {
              label: 'Incomplete',
              key: 'incomplete',
              children: (
                <Space direction='vertical' style={{ width: '100%' }}>
                  <Title level={4}>Incomplete Subjects</Title>
                  <Table
                    columns={columns}
                    dataSource={incompleteSubjects}
                    pagination={{ pageSize: 10 }}
                    rowKey={(record) => record.id}
                    loading={loading}
                  />
                </Space>
              )
            }
          ]}
        />
      </Space>
    </div>
  );
};

export default MySubjects;
