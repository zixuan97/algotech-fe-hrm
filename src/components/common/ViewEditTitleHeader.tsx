import { LoadingOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Menu, Modal, Space, Typography } from 'antd';
import moment from 'moment';
import React from 'react';
import { User } from 'src/models/types';
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
    onDelete: () => void;
    deleteModalProps: {
      title: string;
      body: string;
      deleteLoading?: boolean;
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
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] =
    React.useState<boolean>(false);
  return (
    <div className='container-spaced-out' style={{ alignItems: 'center' }}>
      <Modal
        title={editFunctions?.deleteModalProps.title}
        onOk={() => {
          editFunctions?.onDelete();
          setConfirmDeleteModalOpen(false);
        }}
        onCancel={() => setConfirmDeleteModalOpen(false)}
        open={confirmDeleteModalOpen}
        okButtonProps={{
          loading: editFunctions?.deleteModalProps.deleteLoading
        }}
      >
        {editFunctions?.deleteModalProps.body}
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
                        onClick: () => editFunctions?.onView()
                      },
                      {
                        label: 'Delete',
                        key: 'Delete',
                        onClick: () => setConfirmDeleteModalOpen(true)
                      }
                    ]
                  : [
                      {
                        label: 'Edit',
                        key: 'Edit',
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
          <Button
            id='header-menu-btn'
            size='large'
            icon={<MenuOutlined />}
            type='text'
          />
        </Dropdown>
      </Space>
    </div>
  );
};

export default ViewEditTitleHeader;
