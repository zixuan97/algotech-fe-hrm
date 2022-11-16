import React, { useState } from 'react';
import { Card, Divider, Modal, Select, Space, Typography } from 'antd';
import { LeaveQuota } from 'src/models/types';
import TimeoutAlert, { AlertType } from '../common/TimeoutAlert';
import { WarningOutlined } from '@ant-design/icons';

type ReplaceTierModalProps = {
  open: boolean;
  tierToDelete: string | undefined;
  data: LeaveQuota[];
  onConfirm: () => void;
  onClose: () => void;
  onSelectTier: (tierName: string) => void;
};

const ReplaceTierModal = (props: ReplaceTierModalProps) => {
  const { open, tierToDelete, data, onConfirm, onClose } = props;
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [alert, setAlert] = React.useState<AlertType | null>(null);

  let filteredData = data.filter((item) => item.tier !== tierToDelete);
  let tierNames = filteredData.map((item) => {
    return {
      label: item.tier,
      value: item.tier
    };
  });

  const onTierChange = (value: string) => {
    setSelectedTier(value);
    props.onSelectTier(value);
  };

  const onOk = () => {
    if (selectedTier === '') {
      setAlert({ type: 'warning', message: 'Please select a tier!' });
      return;
    }
    onConfirm();
  };

  return (
    <>
      <Modal title='Delete Tier' open={open} onOk={onOk} onCancel={onClose}>
        {alert && (
          <div className='alert'>
            <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
          </div>
        )}
        <Card style={{ marginBottom: '16px', backgroundColor: '#FCE2CA' }}>
          <Space>
            <WarningOutlined style={{ color: 'black' }} />
            <Typography style={{ color: 'black' }}>
              {tierToDelete} cannot be deleted yet as there are still employees
              assigned to this tier.
            </Typography>
          </Space>
        </Card>
        <Divider />
        <Space direction='vertical'>
          <Typography>
            Please select a new tier to assign all employees in {tierToDelete}{' '}
            to.
          </Typography>
          <Select
            style={{ width: '200px' }}
            value={selectedTier}
            options={tierNames}
            onChange={onTierChange}
          />
        </Space>
      </Modal>
    </>
  );
};

export default ReplaceTierModal;
