import React, { useState } from 'react';
import {
  Button,
  Divider,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  TableColumnsType,
  Typography
} from 'antd';
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  SearchOutlined
} from '@ant-design/icons';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import ConfirmationModalButton from 'src/components/common/ConfirmationModalButton';
import { getAllNonB2bUsers } from 'src/services/userService';
import { generatePath, Link, useNavigate } from 'react-router-dom';
import { User } from 'src/models/types';
import breadcrumbContext from 'src/context/breadcrumbs/breadcrumbContext';

const { Title, Text } = Typography;
const { Option } = Select;

interface SortOption {
  sortType: string;
  label: string;
  comparator: (a: User, b: User) => number;
}

const sortOptions: SortOption[] = [
  {
    sortType: 'FirstNameAsc',
    label: 'First Name A - Z',
    comparator: (a, b) => a.firstName.localeCompare(b.firstName)
  },
  {
    sortType: 'FirstNameDsc',
    label: 'First Name Z - A',
    comparator: (a, b) => b.firstName.localeCompare(a.firstName)
  },
  {
    sortType: 'Role',
    label: 'Role A - Z',
    comparator: (a, b) => a.role.localeCompare(b.role)
  }
];

const ManagePeople = () => {
  const navigate = useNavigate();
  const { updateBreadcrumbItems } = React.useContext(breadcrumbContext);

  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [searchField, setSearchField] = React.useState<string>('');
  const [sortOption, setSortOption] = React.useState<SortOption | null>(null);

  React.useEffect(() => {
    setLoading(true);
    asyncFetchCallback(getAllNonB2bUsers(), setUsers, () => void 0, {
      updateLoading: setLoading
    });
  }, []);

  const columns: TableColumnsType<User> = [
    {
      title: 'First Name',
      dataIndex: 'firstName'
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName'
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'Permissions',
      dataIndex: 'role'
    }
  ];

  return (
    <div className='container-left-full'>
      <Title level={2}>Manage People</Title>
      <Space direction='vertical' style={{ width: '100%' }} size={32}>
        <Space direction='vertical' style={{ width: '100%' }} size='middle'>
          <Space size='middle'>
            <Space direction='vertical' style={{ width: '100%' }}>
              <Text>Search</Text>
              <Input
                style={{ width: '22em' }}
                name='title'
                size='large'
                placeholder='Search Title, Created By'
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchField(e.target.value)}
              />
            </Space>
            <Space direction='vertical' style={{ width: '100%' }}>
              <Text>Sort By</Text>
              <Select
                placeholder='Sort By'
                size='large'
                style={{ width: '14em' }}
                onChange={(value) =>
                  setSortOption(
                    sortOptions.find((opt) => opt.sortType === value) ?? null
                  )
                }
              >
                {sortOptions.map((option) => (
                  <Option key={option.sortType}>{option.label}</Option>
                ))}
              </Select>
            </Space>
          </Space>
        </Space>
        <Table
          dataSource={users}
          columns={columns}
          pagination={{ pageSize: 10 }}
          loading={loading}
          rowKey={(record) => record.id}
        />
      </Space>
    </div>
  );
};

export default ManagePeople;
