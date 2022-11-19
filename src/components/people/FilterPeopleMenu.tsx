import React, { useState } from 'react';
import {
  Button,
  Input,
  Menu,
  Modal,
  Popover,
  Select,
  SelectProps,
  Space,
  Typography
} from 'antd';
import { User, JobRole, UserRole } from 'src/models/types';
import TimeoutAlert, {
  AlertType,
  AxiosErrDataBody
} from '../common/TimeoutAlert';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import '../../styles/people/managePeople.scss';

const { Text } = Typography;

type FilterPeopleMenuProps = {
  allUsers?: User[];
  allJobRoles?: JobRole[];
  updateUsers: (users: User[]) => void;
};

const FilterPeopleMenu = (props: FilterPeopleMenuProps) => {
  const { allUsers, allJobRoles, updateUsers } = props;
  const { Option } = Select;
  const [open, setOpen] = React.useState(false);

  const [permissions, setPermissions] = React.useState<string[]>([]);
  const [jobRoles, setJobRoles] = React.useState<JobRole[] | null>();
  const [managerName, setManagerName] = React.useState<string>('');

  const userRoles = Object.keys(UserRole).filter((item) => {
    return isNaN(Number(item)) && item !== 'CUSTOMER' && item !== 'B2B';
  });

  const getUserFullName = (user: User) => {
    return user.firstName + ' ' + user.lastName;
  };

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const clearFilters = async () => {
    await setPermissions([]);
    await setJobRoles(null);
    await setManagerName('');
  };

  const handleFilterPeople = async () => {};

  const content = (
    <Space direction='vertical' style={{ width: '100%' }}>
      <Text>Permissions</Text>
      <Select
        mode='multiple'
        allowClear
        showArrow
        placeholder='Select Permissions'
        style={{ width: '100%' }}
      >
        {userRoles?.map((option) => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
      </Select>
      <Text>Roles</Text>
      <Select
        mode='multiple'
        allowClear
        showArrow
        placeholder='Select Role(s)'
        style={{ width: '100%' }}
      >
        {allJobRoles?.map((option) => (
          <Option key={option.id} value={option.jobRole}>
            {option.jobRole}
          </Option>
        ))}
      </Select>
      <Text>Manager</Text>
      <Select
        mode='multiple'
        allowClear
        // showSearch
        style={{ width: '100%' }}
        placeholder='Select Manager'
        optionFilterProp='children'
      >
        {allUsers?.map((option) => (
          <Option key={option.id} value={option.id}>
            {getUserFullName(option)}
          </Option>
        ))}
      </Select>
      <div></div>
      <Space direction='horizontal' style={{ width: '100%' }}>
        <Button onClick={clearFilters}>Clear</Button>
        <Button type='primary'>Filter</Button>
      </Space>
    </Space>
  );

  return (
    <Popover
      overlayStyle={{ width: '25vw' }}
      title='Filter People'
      placement='bottomRight'
      trigger='click'
      open={open}
      onOpenChange={handleOpenChange}
      content={
        <Space direction='vertical' style={{ width: '100%' }}>
          {content}
        </Space>
      }
    >
      <Button size='large' style={{ width: '8em' }}>
        Filter
      </Button>
    </Popover>
  );
};

export default FilterPeopleMenu;
