import {
  ApartmentOutlined,
  CalendarOutlined,
  EyeOutlined,
  FolderOutlined
} from '@ant-design/icons';
import {
  Button,
  Card,
  List,
  Progress,
  Space,
  Spin,
  Table,
  TableColumnsType,
  Typography
} from 'antd';
import moment from 'moment';
import React from 'react';
import {
  createSearchParams,
  generatePath,
  Link,
  useNavigate
} from 'react-router-dom';
import LeaveStatusCell from 'src/components/leave/LeaveStatusCell';
import {
  ASSIGNED_SUBJECT_URL,
  COMPANY_LEAVE_SCHEDULE_URL,
  LEAVE_APPLICATION_DETAILS_URL,
  MY_SUBJECTS_URL,
  PEOPLE_ORGCHART_URL
} from 'src/components/routes/routes';
import authContext from 'src/context/auth/authContext';
import themeContext from 'src/context/theme/themeContext';
import { EmployeeSubjectRecord, LeaveApplication } from 'src/models/types';
import { getLeaveApplicationsByEmployeeId } from 'src/services/leaveService';
import { getAllSubjectRecordsPerUser } from 'src/services/subjectRecordService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { BOOLEAN_TRUE } from 'src/utils/constants';
import { READABLE_DDMMYY_TIME_12H } from 'src/utils/dateUtils';
import '../styles/common/common.scss';
import '../styles/pages/dashboard.scss';

const { Title, Text } = Typography;

type WidgetCardProps = {
  title: string;
  body: React.ReactNode;
  block?: boolean;
};

const WidgetCard = ({ title, body, block = false }: WidgetCardProps) => {
  const { isDarkMode } = React.useContext(themeContext);

  return (
    <Card
      className={block ? 'widget-block' : 'widget'}
      headStyle={{
        borderTop: `5px solid ${isDarkMode ? '#f3cc62' : '#96694C'}`
      }}
      bodyStyle={{ overflow: 'auto', paddingBottom: '12px' }}
      title={title}
    >
      {body}
    </Card>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { isDarkMode } = React.useContext(themeContext);
  const { user } = React.useContext(authContext);

  const [incompleteRecords, setIncompleteRecords] = React.useState<
    EmployeeSubjectRecord[]
  >([]);
  const [leaveApplications, setLeaveApplications] = React.useState<
    LeaveApplication[]
  >([]);

  const [recordsLoading, setRecordsLoading] = React.useState<boolean>(false);
  const [leaveLoading, setLeaveLoading] = React.useState<boolean>(false);

  const fetchIncompleteRecords = () => {
    if (user) {
      setRecordsLoading(true);
      asyncFetchCallback(
        getAllSubjectRecordsPerUser(),
        (res) =>
          setIncompleteRecords(
            res.filter(
              (record) =>
                record.completionRate !== 100 && record.subject.isPublished
            )
          ),
        () => void 0,
        { updateLoading: setRecordsLoading }
      );
    }
  };

  const fetchLeaveApplications = () => {
    if (user) {
      setLeaveLoading(true);
      asyncFetchCallback(
        getLeaveApplicationsByEmployeeId(user.id),

        setLeaveApplications,
        () => void 0,
        { updateLoading: setLeaveLoading }
      );
    }
  };

  React.useEffect(() => {
    fetchIncompleteRecords();
    fetchLeaveApplications();
    //eslint-disable-next-line
  }, []);

  const columns: TableColumnsType<LeaveApplication> = [
    {
      title: 'Leave Duration',
      width: '60%',
      render: (record: LeaveApplication) => {
        const startDate = moment(record.startDate).format(
          READABLE_DDMMYY_TIME_12H
        );
        const endDate = moment(record.endDate).format(READABLE_DDMMYY_TIME_12H);
        return `${startDate} - ${endDate}`;
      }
    },
    {
      title: 'Type',
      render: (record: LeaveApplication) => {
        const type = record.leaveType;
        return (
          type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() + ' Leave'
        );
      }
    },
    {
      title: 'Status',
      render: LeaveStatusCell
    },
    {
      title: 'Action',
      render: (record: LeaveApplication) => {
        return (
          <Button
            icon={<EyeOutlined />}
            type='primary'
            onClick={() =>
              navigate(
                generatePath(LEAVE_APPLICATION_DETAILS_URL, {
                  leaveId: record.id.toString()
                })
              )
            }
          >
            View
          </Button>
        );
      }
    }
  ];

  return (
    <div className='container-left-full'>
      <Title level={2}>My Dashboard</Title>
      <div className='widgets-container'>
        <WidgetCard
          title='My Pending Subjects'
          body={
            <Spin spinning={recordsLoading}>
              <div className='pending-subject-widget'>
                <List style={{ overflow: 'auto', height: '100%' }}>
                  {incompleteRecords.length ? (
                    incompleteRecords.map((record) => (
                      <List.Item
                        actions={[
                          <Button
                            onClick={() =>
                              navigate({
                                pathname: generatePath(ASSIGNED_SUBJECT_URL, {
                                  subjectId: record.subjectId.toString()
                                }),
                                search: createSearchParams({
                                  attempt: BOOLEAN_TRUE
                                }).toString()
                              })
                            }
                          >
                            Attempt
                          </Button>
                        ]}
                        style={{ paddingRight: '8px' }}
                      >
                        <List.Item.Meta
                          title={
                            <Link
                              to={generatePath(ASSIGNED_SUBJECT_URL, {
                                subjectId: record.subjectId.toString()
                              })}
                              style={{
                                color: isDarkMode ? '#f3cc62' : '#96694C'
                              }}
                            >
                              {record.subject.title}
                            </Link>
                          }
                          description={
                            <div>
                              <Text>Completion Rate</Text>
                              <Progress
                                percent={record.completionRate}
                                format={(percent) => `${percent?.toFixed(0)}%`}
                              />
                            </div>
                          }
                        />
                      </List.Item>
                    ))
                  ) : (
                    <Text>No subjects assigned to you.</Text>
                  )}
                </List>
              </div>
            </Spin>
          }
        />
        <WidgetCard
          title='My Leave Applications'
          body={
            <Table
              columns={columns}
              dataSource={leaveApplications}
              loading={leaveLoading}
              pagination={{ pageSize: 5 }}
            />
          }
        />
        <WidgetCard
          block
          title='Shortcuts'
          body={
            <div className='shortcuts-widget'>
              <Space direction='vertical' align='center'>
                <FolderOutlined
                  style={{ fontSize: '64px' }}
                  onClick={() => navigate(MY_SUBJECTS_URL)}
                />
                <Text>My Subjects</Text>
              </Space>
              <Space direction='vertical' align='center'>
                <CalendarOutlined
                  style={{ fontSize: '64px' }}
                  onClick={() => navigate(COMPANY_LEAVE_SCHEDULE_URL)}
                />
                <Text>Company Leave Calendar</Text>
              </Space>
              <Space direction='vertical' align='center'>
                <ApartmentOutlined
                  style={{ fontSize: '64px' }}
                  onClick={() => navigate(PEOPLE_ORGCHART_URL)}
                />
                <Text>Org Chart</Text>
              </Space>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default Dashboard;
