import React, { useState } from 'react';
import { Table, Typography } from 'antd';
import authContext from 'src/context/auth/authContext';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getLeaveApplicationsByEmployeeId } from 'src/services/leaveService';
import { LeaveApplication } from 'src/models/types';
import moment from 'moment';
import LeaveStatusCell from 'src/components/leave/LeaveStatusCell';

const ViewMyLeaveApplications = () => {
  const { user } = React.useContext(authContext);

  const [leaveApplications, setLeaveApplications] = useState<
    LeaveApplication[]
  >([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (user) {
      setLoading(true);
      asyncFetchCallback(
        getLeaveApplicationsByEmployeeId(user.id),
        (res) => setLeaveApplications(res),
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
    }
  ];

  return (
    <span>
      <Typography.Title level={1}>My Leave Applications</Typography.Title>
      <Table
        bordered
        dataSource={leaveApplications}
        columns={columns}
        loading={loading}
      />
    </span>
  );
};

export default ViewMyLeaveApplications;
