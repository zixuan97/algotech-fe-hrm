import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LoadingOutlined,
  MenuOutlined
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Dropdown,
  Menu,
  Modal,
  Space,
  Typography
} from 'antd';
import moment from 'moment';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { READABLE_DDMMYY_TIME_12H } from 'src/utils/dateUtils';
import { getUserFullName } from 'src/utils/formatUtils';
import '../../styles/common/common.scss';

const { Title, Text } = Typography;

type ViewEditTitleHeaderProps = {
  title: string;
  inEditMode: boolean;
  viewFunctions?: {
    onEdit: () => void;
  };
  editFunctions?: {
    onView: () => void;
    onDelete: () => Promise<void>;
    deleteModalProps: {
      title: string;
      body: string;
      deleteSuccessContent?: React.ReactNode;
      deleteRedirectUrl?: string;
    };
  };
  updateLoading?: boolean;
  lastUpdatedInfo?: {
    lastUpdatedAt: Date;
    lastUpdatedBy: User;
  };
};

const ViewEditTitleHeader = ({
  title,
  inEditMode,
  viewFunctions,
  editFunctions,
  updateLoading,
  lastUpdatedInfo
}: ViewEditTitleHeaderProps) => {
  const navigate = useNavigate();

  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] =
    React.useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false);
  const [deleteSuccess, setDeleteSuccess] = React.useState<boolean>(false);

  const { deleteRedirectUrl } = editFunctions?.deleteModalProps || {};

  return (
    <div className='container-spaced-out' style={{ alignItems: 'center' }}>
      <Modal
        title={editFunctions?.deleteModalProps.title}
        onOk={() => {
          if (editFunctions?.onDelete) {
            setDeleteLoading(true);
            asyncFetchCallback(editFunctions?.onDelete(), () => {
              setDeleteSuccess(true);
              setDeleteLoading(false);
              if (deleteRedirectUrl) {
                setTimeout(() => navigate(deleteRedirectUrl), 1500);
              }
            });
          }
        }}
        onCancel={() => setConfirmDeleteModalOpen(false)}
        open={confirmDeleteModalOpen}
        okText='Delete'
        okButtonProps={{
          danger: true,
          loading: deleteLoading
        }}
      >
        <Space direction='vertical' size='middle'>
          {deleteSuccess && (
            <Alert
              type='info'
              showIcon
              message={editFunctions?.deleteModalProps.deleteSuccessContent}
            />
          )}
          {editFunctions?.deleteModalProps.body}
        </Space>
      </Modal>
      <Title level={2}>{title}</Title>
      <Space size='large'>
        {lastUpdatedInfo && (
          <Card size='small' bodyStyle={{ padding: '12px 24px' }}>
            {updateLoading ? (
              <>
                <LoadingOutlined style={{ marginRight: '16px' }} />
                <Text>Your changes are being saved...</Text>
              </>
            ) : (
              <Text>
                {`Last updated on ${moment(
                  lastUpdatedInfo.lastUpdatedAt
                ).format(READABLE_DDMMYY_TIME_12H)} by ${getUserFullName(
                  lastUpdatedInfo.lastUpdatedBy
                )}`}
              </Text>
            )}
          </Card>
        )}
        <Dropdown
          overlayStyle={{ width: '8em' }}
          overlay={
            <Menu
              items={
                inEditMode
                  ? [
                      {
                        label: 'View',
                        key: 'View',
                        icon: <EyeOutlined />,
                        onClick: () => editFunctions?.onView()
                      },
                      {
                        label: 'Delete',
                        key: 'Delete',
                        icon: <DeleteOutlined />,
                        onClick: () => setConfirmDeleteModalOpen(true)
                      }
                    ]
                  : [
                      {
                        label: 'Edit',
                        key: 'Edit',
                        icon: <EditOutlined />,
                        onClick: () => viewFunctions?.onEdit()
                      }
                    ]
              }
            />
          }
          trigger={['click']}
          placement='bottomRight'
          getPopupContainer={(trigger) => trigger.parentElement ?? trigger}
        >
          <Button size='large' icon={<MenuOutlined />} type='text' />
        </Dropdown>
      </Space>
    </div>
  );
};

export default ViewEditTitleHeader;
