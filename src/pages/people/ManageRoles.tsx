import React from 'react';
import {
  Button,
  Input,
  Select,
  Space,
  Table,
  TableColumnsType,
  Tooltip,
  Typography
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined
} from '@ant-design/icons';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { JobRole, User } from 'src/models/types';
import { deleteJobRole, getAllJobRoles } from 'src/services/jobRoleService';
import CreateRoleModalButton from 'src/components/people/roles/CreateRoleModalButton';
import ConfirmationModal from 'src/components/common/ConfirmationModal';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import EditJobRoleModal from 'src/components/people/roles/EditJobRoleModal';
import {
  sortJobRoleAsc,
  sortJobRoleDesc,
  sortNameAsc
} from 'src/components/people/roles/comparators';
import authContext from 'src/context/auth/authContext';
import { getAllEmployees } from 'src/services/peopleService';

const { Title, Text } = Typography;
const { Option } = Select;
interface SortOption {
  sortType: string;
  label: string;
  comparator: (a: JobRole, b: JobRole) => number;
}

const sortOptions: SortOption[] = [
  {
    sortType: 'JobRoleAsc',
    label: 'Job Role A - Z',
    comparator: sortJobRoleAsc
  },
  {
    sortType: 'JobRoleDsc',
    label: 'Job Role Z - A',
    comparator: sortJobRoleDesc
  }
];

const ManageRoles = () => {
  const { user } = React.useContext(authContext);
  const [jobRoles, setJobRoles] = React.useState<JobRole[]>([]);
  const [focusedJobRole, setFocusedJobRole] = React.useState<JobRole>();
  const [editJobRoleModalOpen, setEditJobRoleModalOpen] =
    React.useState<boolean>(false);
  const [deleteJobRoleModalOpen, setDeleteJobRoleModalOpen] =
    React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchField, setSearchField] = React.useState<string>('');
  const [sortOption, setSortOption] = React.useState<SortOption | null>(null);
  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [users, setUsers] = React.useState<User[]>([]);

  const sortedAndFilteredJobRoles = React.useMemo(() => {
    const filteredJobRoles = jobRoles.filter((role) => {
      const searchFieldLower = searchField.toLowerCase();
      return role.jobRole.toLowerCase().includes(searchFieldLower);
    });
    return sortOption
      ? filteredJobRoles.sort(sortOption.comparator)
      : filteredJobRoles;
  }, [jobRoles, searchField, sortOption]);

  const handleEditJobRoleModal = (jobRoleId: number) => {
    const jobRole = jobRoles.find((role) => role.id === jobRoleId);
    setFocusedJobRole(jobRole);
    setEditJobRoleModalOpen(true);
  };

  const handleDeleteJobRoleModal = (jobRoleId: number) => {
    const jobRole = jobRoles.find((role) => role.id === jobRoleId);
    setFocusedJobRole(jobRole);
    setDeleteJobRoleModalOpen(true);
  };

  const columns: TableColumnsType<JobRole> = [
    {
      title: 'Job Role',
      dataIndex: 'jobRole',
      width: '30%'
    },
    { title: 'Description', dataIndex: 'description', width: '60%' },
    {
      title: 'Actions',
      dataIndex: 'id',
      align: 'center',
      width: '10%',
      render: (value) => (
        <Space>
          <Tooltip title='Edit Role' placement='bottom' mouseEnterDelay={0.8}>
            <Button
              icon={<EditOutlined />}
              shape='round'
              onClick={() => handleEditJobRoleModal(value)}
            />
          </Tooltip>
          <Tooltip title='Delete Role' placement='bottom' mouseEnterDelay={0.8}>
            <Button
              icon={<DeleteOutlined />}
              shape='round'
              onClick={() => handleDeleteJobRoleModal(value)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const fetchJobRoles = () => {
    setLoading(true);
    asyncFetchCallback(
      getAllJobRoles(),
      (roles) => {
        setJobRoles(roles.sort(sortOptions[0].comparator));
      },
      () => void 0,
      {
        updateLoading: setLoading
      }
    );
  };

  React.useEffect(() => {
    setLoading(true);
    asyncFetchCallback(
      getAllEmployees(),
      (res) => {
        setUsers(
          res.filter((currUser) => currUser.id !== user?.id).sort(sortNameAsc)
        );
      },
      () => void 0,
      {
        updateLoading: setLoading
      }
    );
    fetchJobRoles();
  }, [user?.id]);

  const deleteFocusedJobRole = (jobRoleId: string | number) => {
    setLoading(true);
    asyncFetchCallback(
      deleteJobRole(focusedJobRole?.id!),
      () => {
        setDeleteJobRoleModalOpen(false);
        fetchJobRoles();
        setAlert({
          type: 'success',
          message: 'Job Role deleted.'
        });
      },
      () => {
        setAlert({
          type: 'error',
          message: 'Failed to delete job role. Please try again later.'
        });
      },
      {
        updateLoading: setLoading
      }
    );
  };

  return (
    <div className='container-left-full'>
      <Title level={2}>Manage Roles</Title>
      <Space direction='vertical' style={{ width: '100%' }} size={32}>
        <Space direction='vertical' style={{ width: '100%' }} size='middle'>
          <Space size='middle'>
            <Space direction='vertical' style={{ width: '100%' }}>
              <Text>Search</Text>
              <Input
                style={{ width: '22em' }}
                name='title'
                size='large'
                placeholder='Search Role'
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
          {alert && (
            <div className='account-alert'>
              <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
            </div>
          )}
        </Space>
        <Table
          dataSource={sortedAndFilteredJobRoles}
          columns={columns}
          pagination={{ pageSize: 5 }}
          loading={loading}
          rowKey={(record) => record.id}
        />

        {focusedJobRole && users && (
          <EditJobRoleModal
            title={`Edit ${focusedJobRole.jobRole}`}
            open={editJobRoleModalOpen}
            jobRole={focusedJobRole}
            setFocusedJobRole={setFocusedJobRole}
            onClose={() => {
              setFocusedJobRole(undefined);
              setEditJobRoleModalOpen(false);
            }}
            users={users}
            fetchJobRoles={fetchJobRoles}
          />
        )}

        <ConfirmationModal
          open={deleteJobRoleModalOpen}
          title={'Delete Job Role'}
          body={`Are you sure you want to delete ${focusedJobRole?.jobRole}?`}
          onClose={() => setDeleteJobRoleModalOpen(false)}
          onConfirm={() => {
            deleteFocusedJobRole(focusedJobRole?.id!);
          }}
        />
        <Space
          direction='vertical'
          style={{ display: 'flex', alignSelf: 'flex-end' }}
        >
          <CreateRoleModalButton users={users} fetchJobRoles={fetchJobRoles} />
        </Space>
      </Space>
    </div>
  );
};

export default ManageRoles;
