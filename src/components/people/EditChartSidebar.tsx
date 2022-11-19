import React, { useState } from 'react';
import '../../styles/people/editChartSidebar.scss';
import { Typography, Grid, Divider, Layout, Button, Select, Card } from 'antd';
import { User } from 'src/models/types';
import { CloseOutlined, LockOutlined, StarOutlined } from '@ant-design/icons';
import { getUserFullName } from 'src/utils/formatUtils';
import EmployeeSelector from './EmployeeSelector';
import ReplaceCeoModal from './ReplaceCeoModal';
const { useBreakpoint } = Grid;

interface Option {
  value: number;
  label: string;
}

interface EditChartSidebarProps {
  handleAssignManagerToEmployee: (body: {
    id: number;
    users: { id: number }[];
  }) => void;
  handleCloseSideBar: () => void;
  visible: boolean;
  ceo?: User | null;
  allEmployees?: User[];
  managerLessEmployees?: User[];
  availableManagers?: User[];
  handleSetNewCeo: (id: string | number) => void;
}

const EditChartSidebar = ({
  handleCloseSideBar,
  visible,
  ceo,
  allEmployees,
  managerLessEmployees,
  availableManagers,
  handleSetNewCeo,
  handleAssignManagerToEmployee
}: EditChartSidebarProps) => {
  const screens = useBreakpoint();

  const [replaceCeoModalOpen, setReplaceCeoModalOpen] =
    useState<boolean>(false);
  const [newCeo, setNewCeo] = useState<User>();
  const [newCeoId, setNewCeoId] = useState<string | number>('');

  let options: Option[] = availableManagers!.map(
    (o) => ({ label: getUserFullName(o), value: o.id } as Option)
  );

  return (
    <>
      <Layout.Sider
        width={screens.xxl ? '20vw' : screens.xl ? '24vw' : '26vw'}
        breakpoint={'lg'}
        collapsedWidth='0'
        collapsible
        collapsed={visible}
        className='sidebar-sider'
      >
        <div className='sidebar-container'>
          <Button
            type='text'
            icon={<CloseOutlined />}
            className='close-button'
            onClick={handleCloseSideBar}
          />
          <Typography.Title className='sider-heading' level={3}>
            Configure Org Chart
          </Typography.Title>
          <Typography>
            Use the fields below to structure the reporting hierarchy of your
            organization
          </Typography>
          <Divider />
          <div className='sider-horizontal-row'>
            <StarOutlined className='sider-star-icon' />
            <Typography.Title level={5}>
              Select the highest ranking executive
            </Typography.Title>
          </div>
          <Typography style={{ paddingBottom: '1.5rem' }}>
            This is often the CEO of the organisation.
          </Typography>
          {ceo ? (
            <>
              <Select
                disabled
                value={getUserFullName(ceo)}
                suffixIcon={<LockOutlined style={{ fontSize: '20px' }} />}
              />
              <div style={{ paddingTop: '1rem' }}>
                <Button
                  className='sider-replace-button'
                  type='text'
                  onClick={() => setReplaceCeoModalOpen(true)}
                >
                  <u>Replace</u>
                </Button>
              </div>
            </>
          ) : (
            <>
              <Select
                onSelect={(value: string | number) => {
                  setNewCeoId(value);
                }}
                value={newCeo?.id}
                showSearch
                placeholder='Select CEO'
                options={options}
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                style={{ width: '100%' }}
              />
              <div style={{ paddingTop: '1rem' }}>
                <Button
                  type='primary'
                  disabled={!newCeoId}
                  className='sider-save-button'
                  onClick={() => {
                    handleSetNewCeo(newCeoId);
                  }}
                >
                  Save
                </Button>
              </div>
            </>
          )}
          <ReplaceCeoModal
            open={replaceCeoModalOpen}
            currentCeoId={ceo?.id}
            availableCeos={availableManagers!}
            allEmployees={allEmployees!}
            onConfirm={() => {}}
            onClose={() => setReplaceCeoModalOpen(false)}
            onSelectCeo={(newCeo) => setNewCeo(newCeo)}
            handleSetNewCeo={handleSetNewCeo}
          />
          <Divider />
          {ceo && managerLessEmployees!.length > 0 && (
            <>
              <Typography.Title level={5}>
                Unassigned employees
              </Typography.Title>
              <Typography>
                These employees do not appear in the org chart as they have not
                been assigned a manager.
              </Typography>
              <div style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
                <Card>
                  {managerLessEmployees!.map((e) => (
                    <EmployeeSelector
                      handleAssignManagerToEmployee={
                        handleAssignManagerToEmployee
                      }
                      employee={e}
                      managerOptions={availableManagers!}
                    />
                  ))}
                </Card>
              </div>
            </>
          )}
        </div>
      </Layout.Sider>
    </>
  );
};

export default EditChartSidebar;
