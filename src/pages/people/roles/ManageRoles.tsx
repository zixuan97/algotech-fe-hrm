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
import { DeleteOutlined, EditOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { JobRole } from 'src/models/types';
import { getAllJobRoles } from 'src/services/jobRoleService';
import CreateRoleModalButton from 'src/components/people/roles/CreateRoleModalButton';
import { Link, generatePath, useNavigate } from 'react-router-dom';
import { PEOPLE_ROLES_ID_URL } from 'src/components/routes/routes';

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
    comparator: (a, b) => a.jobRole.localeCompare(b.jobRole)
  },
  {
    sortType: 'JobRoleDsc',
    label: 'Job Role Z - A',
    comparator: (a, b) => b.jobRole.localeCompare(a.jobRole)
  }
];

const ManageRoles = () => {
  const navigate = useNavigate();
  const [jobRoles, setJobRoles] = React.useState<JobRole[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchField, setSearchField] = React.useState<string>('');
  const [sortOption, setSortOption] = React.useState<SortOption | null>(null);

  const sortedAndFilteredJobRoles = React.useMemo(() => {
    const filteredJobRoles = jobRoles.filter((role) => {
      const { jobRole } = role;
      const searchFieldLower = searchField.toLowerCase();
      return jobRole.toLowerCase().includes(searchFieldLower);
    });
    return sortOption
      ? filteredJobRoles.sort(sortOption.comparator)
      : filteredJobRoles;
  }, [jobRoles, searchField, sortOption]);

  const columns: TableColumnsType<JobRole> = [
    {
      title: 'Job Role',
      dataIndex: 'jobRole',
      width: '90%',
      render: (value, record) => (
        <Link
          to={generatePath(PEOPLE_ROLES_ID_URL, {
            roleId: record.id.toString()
          })}
        >
          {value}
        </Link>
      )
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      align: 'center',
      width: '10%',
      render: (value) => (
        <Space>
          <Tooltip title='View Role' placement='bottom' mouseEnterDelay={0.8}>
            <Button
              icon={<EyeOutlined />}
              shape='round'
              onClick={() =>
                navigate(generatePath(PEOPLE_ROLES_ID_URL, { roleId: value }))
              }
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  React.useEffect(() => {
    setLoading(true);
    asyncFetchCallback(
      getAllJobRoles(),
      (roles) => {
        setJobRoles(roles);
      },
      () => void 0,
      {
        updateLoading: setLoading
      }
    );
  }, []);

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
        </Space>
        <Table
          dataSource={sortedAndFilteredJobRoles}
          columns={columns}
          pagination={{ pageSize: 5 }}
          loading={loading}
          rowKey={(record) => record.id}
        />
        <Space
          direction='vertical'
          style={{ display: 'flex', alignSelf: 'flex-end' }}
        >
          <CreateRoleModalButton />
        </Space>
      </Space>
    </div>
  );
};

export default ManageRoles;
