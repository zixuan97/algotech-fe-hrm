import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, generatePath } from 'react-router-dom';
import { Button, Input, Select, Space, Table, Typography } from 'antd';
import authContext from 'src/context/auth/authContext';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getLeaveApplicationsByEmployeeId } from 'src/services/leaveService';
import { LeaveApplication } from 'src/models/types';
import moment from 'moment';
import LeaveStatusCell from 'src/components/leave/LeaveStatusCell';
import breadcrumbContext from 'src/context/breadcrumbs/breadcrumbContext';
import {
  MY_LEAVE_APPLICATIONS_URL,
  LEAVE_APPLICATION_DETAILS_URL
} from 'src/components/routes/routes';
import CreateLeaveApplicationModalButton from 'src/components/leave/CreateLeaveApplicationModalButton';
import { SearchOutlined } from '@ant-design/icons';

interface SortOption {
  sortType: string;
  label: string;
  comparator: (a: LeaveApplication, b: LeaveApplication) => number;
}

const sortOptions: SortOption[] = [
  {
    sortType: 'ApplicationDateAsc',
    label: 'Application Date - Earliest',
    comparator: (a, b) => moment(a.applicationDate).diff(b.applicationDate)
  },
  {
    sortType: 'ApplicationDateDesc',
    label: 'Application Date - Latest',
    comparator: (a, b) => moment(b.applicationDate).diff(a.applicationDate)
  },
  {
    sortType: 'StartDateAsc',
    label: 'Start Date - Earliest',
    comparator: (a, b) => moment(a.startDate).diff(b.startDate)
  },
  {
    sortType: 'StartDateDesc',
    label: 'Start Date - Latest',
    comparator: (a, b) => moment(b.startDate).diff(a.startDate)
  },
  {
    sortType: 'EndDateAsc',
    label: 'End Date - Earliest',
    comparator: (a, b) => moment(a.endDate).diff(b.endDate)
  },
  {
    sortType: 'EndDateDesc',
    label: 'End Date - Latest',
    comparator: (a, b) => moment(b.endDate).diff(a.endDate)
  }
];

const ViewMyLeaveApplications = () => {
  const navigate = useNavigate();

  const { user } = React.useContext(authContext);
  const { updateBreadcrumbItems } = useContext(breadcrumbContext);

  const [leaveApplications, setLeaveApplications] = useState<
    LeaveApplication[]
  >([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchField, setSearchField] = React.useState<string>('');
  const [sortOption, setSortOption] = React.useState<SortOption | null>();

  const sortedAndFilteredLeaveApplications = React.useMemo(() => {
    const filteredLeaveApplications = leaveApplications.filter(
      (leaveApplication) => {
        const { leaveType, status } = leaveApplication;
        const searchFieldLower = searchField.toLowerCase();
        return (
          leaveType.toLowerCase().includes(searchFieldLower) ||
          status.toLowerCase().includes(searchFieldLower)
        );
      }
    );
    return sortOption
      ? filteredLeaveApplications.sort(sortOption.comparator)
      : filteredLeaveApplications;
  }, [leaveApplications, searchField, sortOption]);

  useEffect(() => {
    updateBreadcrumbItems([
      {
        label: 'My Leave Applications',
        to: MY_LEAVE_APPLICATIONS_URL
      }
    ]);
  }, [updateBreadcrumbItems]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      asyncFetchCallback(
        getLeaveApplicationsByEmployeeId(user.id),
        (res) => {
          setSortOption(sortOptions[2]);
          setLeaveApplications(res);
        },
        () => void 0,
        { updateLoading: setLoading }
      );
    }
  }, [user]);

  const columns = [
    {
      title: 'Application Date',
      render: (record: LeaveApplication) => {
        return <>{moment(record.applicationDate).format('DD MMM YYYY')}</>;
      }
    },
    {
      title: 'Leave Duration',
      render: (record: LeaveApplication) => {
        let displayFormat = 'DD MMM YYYY hh:mm A';
        const startDate = moment(record.startDate).format(displayFormat);
        const endDate = moment(record.endDate).format(displayFormat);
        return (
          <>
            {startDate} - {endDate}
          </>
        );
      }
    },
    {
      title: 'Type of Leave',
      render: (record: LeaveApplication) => {
        const type = record.leaveType;
        return (
          <>
            {type.charAt(0).toUpperCase() +
              type.slice(1).toLowerCase() +
              ' Leave'}
          </>
        );
      }
    },
    {
      title: 'Status',
      render: LeaveStatusCell
    },
    {
      title: 'Last Updated',
      render: (record: LeaveApplication) => {
        return <>{moment(record.lastUpdated).format('DD MMM YYYY')}</>;
      }
    },
    {
      title: 'Action',
      render: (record: LeaveApplication) => {
        return (
          <Button
            type='primary'
            onClick={() =>
              navigate(
                generatePath(LEAVE_APPLICATION_DETAILS_URL, {
                  leaveId: record.id.toString()
                })
              )
            }
          >
            View Application
          </Button>
        );
      }
    }
  ];

  return (
    <span>
      <Typography.Title level={2}>My Leave Applications</Typography.Title>
      <Space direction='vertical' style={{ width: '100%' }} size='middle'>
        <Space size='middle'>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Typography.Text>Search</Typography.Text>
            <Input
              style={{ width: '22em' }}
              name='title'
              size='large'
              placeholder='Search Type of Leave, Status'
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchField(e.target.value)}
            />
          </Space>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Typography.Text>Sort By</Typography.Text>
            <Select
              placeholder='Sort By'
              size='large'
              style={{ width: '14em' }}
              defaultValue={sortOptions[2].sortType}
              onChange={(value) =>
                setSortOption(
                  sortOptions.find((opt) => opt.sortType === value) ?? null
                )
              }
            >
              {sortOptions.map((option) => (
                <Select.Option key={option.sortType}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Space>
        </Space>
        <Table
          bordered
          dataSource={sortedAndFilteredLeaveApplications}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 10 }}
          summary={() => (
            <Table.Summary>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={6}>
                  <CreateLeaveApplicationModalButton employeeId={user?.id} />
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Space>
    </span>
  );
};

export default ViewMyLeaveApplications;
