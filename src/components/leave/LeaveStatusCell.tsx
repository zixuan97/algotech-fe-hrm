import { Tag } from 'antd';
import { LeaveApplication } from 'src/models/types';

const LeaveStatusCell = (record: LeaveApplication) => {
  const leaveStatus = record.status;

  return leaveStatus === 'PENDING' ? (
    <Tag color='#F6943D'>Pending</Tag>
  ) : leaveStatus === 'APPROVED' ? (
    <Tag color='#6EB978'>Approved</Tag>
  ) : leaveStatus === 'REJECTED' ? (
    <Tag color='#EA6464'>Rejected</Tag>
  ) : (
    <Tag color='#D9D9D9' style={{ color: 'black' }}>
      Cancelled
    </Tag>
  );
};

export default LeaveStatusCell;
