import React from 'react';
import '../../styles/people/orgChart.scss';
import {
  ApartmentOutlined,
  IdcardOutlined,
  MailOutlined
} from '@ant-design/icons';
import { Avatar, Divider, Modal, Tag, Typography } from 'antd';
import { User } from 'src/models/types';
import { getUserFullName } from 'src/utils/formatUtils';

type ViewUserModalProps = {
  open: boolean;
  onClose: () => void;
  user: User | undefined;
};

const ViewUserModal = ({ open, user, onClose }: ViewUserModalProps) => {
  return (
    <Modal title='View User' open={open} onCancel={onClose} footer={null}>
      <div className='user-modal-container'>
        <Avatar size={80} style={{ fontSize: '30px' }}>
          {`${user?.firstName.charAt(0)}${user?.lastName.charAt(0)}`}
        </Avatar>
        <Typography
          style={{ fontSize: '20px', fontWeight: 'bold', paddingTop: '0.5rem' }}
        >
          {getUserFullName(user)}
        </Typography>
        <Typography style={{ fontSize: '12px' }}>{user?.role}</Typography>
        <Divider />
        <div className='user-modal-horizontal-row'>
          <MailOutlined />
          <Typography className='user-modal-horizontal-row-label'>
            Email:
          </Typography>
          <Typography>{user?.email}</Typography>
        </div>
        <Divider />
        <div className='user-modal-horizontal-row'>
          <IdcardOutlined />
          <Typography className='user-modal-horizontal-row-label'>
            Roles:
          </Typography>
          {user?.jobRoles?.length === 0
            ? '-'
            : user?.jobRoles?.map((o) => <Tag>{o.jobRole}</Tag>)}
        </div>
        <Divider />
        <div className='user-modal-horizontal-row'>
          <ApartmentOutlined />
          <Typography className='user-modal-horizontal-row-label'>
            Reports to:
          </Typography>
          {user?.manager ? getUserFullName(user?.manager) : '-'}
        </div>
      </div>
    </Modal>
  );
};

export default ViewUserModal;
