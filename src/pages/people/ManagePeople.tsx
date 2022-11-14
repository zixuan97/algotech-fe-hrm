import React, { useEffect, useState } from 'react';
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
  Tooltip,
  Typography
} from 'antd';
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
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
import EditPersonModal from 'src/components/people/EditPersonModal';
import { PEOPLE_MANAGE_URL, PEOPLE_URL } from 'src/components/routes/routes';

const { Title, Text } = Typography;
const { Option } = Select;

interface SortOption {
  sortType: string;
  label: string;
  comparator: (a: User, b: User) => number;
}

const sortNameAsc = (a: User, b: User) => {
  let aFullName = a.firstName + ' ' + a.lastName;
  let bFullName = b.firstName + ' ' + b.lastName;
  return aFullName.localeCompare(bFullName);
};

const sortNameDsc = (a: User, b: User) => {
  let aFullName = a.firstName + ' ' + a.lastName;
  let bFullName = b.firstName + ' ' + b.lastName;
  return bFullName.localeCompare(aFullName);
};

const sortOptions: SortOption[] = [
  {
    sortType: 'NameAsc',
    label: 'Name A - Z',
    comparator: sortNameAsc
  },
  {
    sortType: 'NameDsc',
    label: 'Name Z - A',
    comparator: sortNameDsc
  },
  {
    sortType: 'Permissions',
    label: 'Permissions A - Z',
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

  const [editPersonModalOpen, setEditPersonModalOpen] =
    useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<User>();

  useEffect(() => {
    updateBreadcrumbItems([
      {
        label: 'People',
        to: PEOPLE_URL
      },
      {
        label: 'Manage People',
        to: PEOPLE_MANAGE_URL
      }
    ]);
  }, [updateBreadcrumbItems]);

  const handleEditPerson = async () => {
    setEditPersonModalOpen(false);
    setLoading(true);
    setLoading(false);
  };

  const handleEditPersonModal = (userId: number) => {
    const user = users.find((user) => user.id === userId);
    console.log('user: ', user);
    setUserToEdit(user);
    console.log('user to edit: ', userToEdit);
    setEditPersonModalOpen(true);
  };

  const sortedAndFilteredUsers = React.useMemo(() => {
    const filteredUsers = users.filter((user) => {
      const searchFieldLower = searchField.toLowerCase();
      let fullName = user.firstName + ' ' + user.lastName;
      return (
        fullName.toLowerCase().includes(searchFieldLower) ||
        user.email.toLowerCase().includes(searchFieldLower)
      );
    });
    return sortOption
      ? filteredUsers.sort(sortOption.comparator)
      : filteredUsers;
  }, [users, searchField, sortOption]);

  React.useEffect(() => {
    setLoading(true);
    asyncFetchCallback(getAllNonB2bUsers(), setUsers, () => void 0, {
      updateLoading: setLoading
    });
  }, []);

  const columns: TableColumnsType<User> = [
    {
      title: 'Full Name',
      dataIndex: 'firstName',
      render: (text, record) => <span>{text + ' ' + record.lastName}</span>
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'Permissions',
      dataIndex: 'role'
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      width: '10%',
      render: (userId: number) => (
        <Space>
          <Tooltip title='Edit Person' placement='bottom' mouseEnterDelay={0.8}>
            <Button
              icon={<EditOutlined />}
              shape='round'
              onClick={() => handleEditPersonModal(userId)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className='container-left-full'>
      <Title level={2}>Manage People</Title>
      <Space direction='vertical' style={{ width: '100%' }} size='middle'>
        <Space direction='vertical' style={{ width: '100%' }} size='middle'>
          <Space size='middle'>
            <Space direction='vertical' style={{ width: '100%' }}>
              <Text>Search</Text>
              <Input
                style={{ width: '22em' }}
                name='title'
                size='large'
                placeholder='Search by Name or Email'
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
          dataSource={sortedAndFilteredUsers}
          columns={columns}
          pagination={{ pageSize: 10 }}
          loading={loading}
          rowKey={(record) => record.id}
        />
        <EditPersonModal
          open={editPersonModalOpen}
          allUsers={users}
          user={userToEdit}
          onConfirm={handleEditPerson}
          onClose={() => setEditPersonModalOpen(false)}
        />
      </Space>
    </div>
  );
};

export default ManagePeople;
