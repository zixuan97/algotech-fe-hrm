import React, { useEffect } from 'react';
import {
  Button,
  Input,
  Select,
  Space,
  Table,
  TableColumnsType,
  Tag,
  Tooltip,
  Typography
} from 'antd';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import { getAllEmployees, getAllJobRoles } from 'src/services/peopleService';
import { User, JobRole } from 'src/models/types';
import breadcrumbContext from 'src/context/breadcrumbs/breadcrumbContext';
import EditPersonModal from 'src/components/people/EditPersonModal';
import { PEOPLE_MANAGE_URL, PEOPLE_URL } from 'src/components/routes/routes';
import authContext from 'src/context/auth/authContext';
import '../../styles/people/managePeople.scss';

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
  const { user } = React.useContext(authContext);
  const { updateBreadcrumbItems } = React.useContext(breadcrumbContext);

  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<AlertType | null>(null);

  const [searchField, setSearchField] = React.useState<string>('');
  const [sortOption, setSortOption] = React.useState<SortOption | null>(null);

  const [editPersonModalOpen, setEditPersonModalOpen] =
    React.useState<boolean>(false);
  const [userToEdit, setUserToEdit] = React.useState<User>();

  const [jobRoles, setJobRoles] = React.useState<JobRole[]>([]);

  useEffect(() => {
    updateBreadcrumbItems([
      {
        label: 'Manage People',
        to: PEOPLE_MANAGE_URL
      }
    ]);
  }, [updateBreadcrumbItems]);

  const handleEditPerson = async (userToUpdate: User) => {
    console.log('userToUpdate', userToUpdate);
    setEditPersonModalOpen(false);

    setAlert({
      type: 'success',
      message: 'Employee updated successfully!'
    });

    const newData = [...users];
    console.log('newdata BEFORE: ', newData);
    const index = newData.findIndex((item) => userToEdit?.id === item.id);
    console.log('index: ', index);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...userToUpdate
    });

    console.log('newdata: ', newData);

    setUsers(newData);
  };

  const handleEditPersonModal = (userId: number) => {
    const user = users.find((user) => user.id === userId);
    setUserToEdit(user);
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
    asyncFetchCallback(
      getAllEmployees(),
      (res) => {
        setSortOption(sortOptions[0]);
        setUsers(res);
        console.log(users);
      },
      () => void 0,
      {
        updateLoading: setLoading
      }
    );
    asyncFetchCallback(getAllJobRoles(), setJobRoles, () => void 0, {
      updateLoading: setLoading
    });
  }, []);

  const columns: TableColumnsType<User> = [
    {
      title: 'Full Name',
      dataIndex: 'firstName',
      render: (text, record) =>
        record.id !== user?.id ? (
          <span>{text + ' ' + record.lastName}</span>
        ) : (
          <span>
            {text + ' ' + record.lastName + ' '}
            <Tag color='gold'>Me</Tag>
          </span>
        )
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
      title: 'Roles',
      dataIndex: 'jobRole',
      render: (text, record) => (
        <span>
          {record.jobRoles?.length === 0
            ? '-'
            : record.jobRoles?.length === 1
            ? record.jobRoles?.at(0)?.jobRole
            : record.jobRoles?.length + ' roles'}
        </span>
      )
    },
    {
      title: 'Manager',
      dataIndex: 'manager',
      render: (text, record) => (
        <span>
          {record.manager
            ? record.manager?.firstName + ' ' + record.manager?.lastName
            : '-'}
        </span>
      )
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
      {alert && (
        <div className='leave-quota-alert'>
          <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
        </div>
      )}
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
                defaultValue={sortOptions[0].sortType}
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
          allJobRoles={jobRoles}
          user={userToEdit}
          onConfirm={(userToUpdate: User) => handleEditPerson(userToUpdate)}
          onClose={() => setEditPersonModalOpen(false)}
        />
      </Space>
    </div>
  );
};

export default ManagePeople;
