import React, { useState, useEffect } from 'react';
import { Avatar, Card, List, Modal, Select, Space, Typography } from 'antd';
import { User } from 'src/models/types';
import { WarningOutlined } from '@ant-design/icons';
import { getUserFullName } from 'src/utils/formatUtils';

interface Option {
  value: number;
  label: string;
}

type ReplaceCeoModalProps = {
  open: boolean;
  currentCeoId: number | undefined;
  availableCeos: User[];
  allEmployees: User[];
  onConfirm: () => void;
  onClose: () => void;
  onSelectCeo: (ceo: User) => void;
  handleSetNewCeo?: (id: string | number) => void;
};

const ReplaceCeoModal = (props: ReplaceCeoModalProps) => {
  const {
    open,
    currentCeoId,
    availableCeos,
    allEmployees,
    onConfirm,
    onClose,
    handleSetNewCeo
  } = props;
  const [selectedCeo, setSelectedCeo] = useState<User>();
  const [reportingEmployees, setReportingEmployees] = useState<User[]>([]);

  useEffect(() => {
    if (availableCeos && currentCeoId) {
      let currentCeo = availableCeos.find((user) => user.id === currentCeoId);
      setSelectedCeo(currentCeo);
    }
  }, [currentCeoId, availableCeos]);

  let options: Option[] = availableCeos?.map(
    (o) => ({ label: getUserFullName(o), value: o.id } as Option)
  );

  const onChange = (value: number) => {
    let newCeo = availableCeos.find((user) => user.id === value);
    setSelectedCeo(newCeo!);
    let employeesThatReportToNewCeo = allEmployees.filter(
      (user) =>
        (user.managerId === currentCeoId || user.managerId === 0) &&
        user.id !== newCeo!.id
    );
    setReportingEmployees(employeesThatReportToNewCeo);

    props.onSelectCeo(newCeo!);
  };

  const onCancel = () => {
    let currentCeo = availableCeos.find((user) => user.id === currentCeoId);
    setSelectedCeo(currentCeo);
    onClose();
  };

  const onOk = () => {
    handleSetNewCeo!(selectedCeo?.id ?? 0);
    onClose();
  };

  return (
    <Modal
      title='Change the highest ranking executive'
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      okButtonProps={{ disabled: !selectedCeo }}
    >
      <Typography style={{ paddingBottom: '1.5rem' }}>
        This person will move to the top of your org chart. Everyone else will
        stay where they are.
      </Typography>
      <Select
        onChange={onChange}
        value={selectedCeo?.id}
        showSearch
        placeholder='Select new CEO'
        options={options}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        style={{ width: '100%' }}
      />
      {selectedCeo && selectedCeo?.id !== currentCeoId && (
        <div style={{ paddingTop: '1.5rem' }}>
          <Card className='reporting-employees-card'>
            <Space>
              <WarningOutlined style={{ color: '#EA6464' }} />
              <Typography style={{ color: 'black' }}>
                Heads up: The following people will now report directly to{' '}
                {getUserFullName(selectedCeo)}
              </Typography>
            </Space>
            <List
              style={{ paddingTop: '1rem' }}
              itemLayout='horizontal'
              dataSource={reportingEmployees}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar>
                        {`${item.firstName.charAt(0)}${item.lastName.charAt(
                          0
                        )}`}
                      </Avatar>
                    }
                    title={<Typography>{getUserFullName(item)}</Typography>}
                    description={
                      <Typography style={{ fontSize: '10px' }}>
                        {item.role}
                      </Typography>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
      )}
    </Modal>
  );
};

export default ReplaceCeoModal;
