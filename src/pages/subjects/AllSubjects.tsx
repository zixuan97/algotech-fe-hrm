import {
  BookOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
  ShopOutlined,
  ToolOutlined
} from '@ant-design/icons';
import {
  Button,
  Input,
  Menu,
  Select,
  Space,
  Table,
  TableColumnsType,
  Tooltip,
  Typography
} from 'antd';
import moment from 'moment';
import React from 'react';
import { generatePath, Link, useNavigate } from 'react-router-dom';
import { EDIT_SUBJECT_URL, SUBJECTS_URL } from 'src/components/routes/routes';
import CreateSubjectModalButton from 'src/components/subjects/subject/CreateSubjectModalButton';
import breadcrumbContext from 'src/context/breadcrumbs/breadcrumbContext';
import { Subject, SubjectType } from 'src/models/types';
import { getAllSubjects } from 'src/services/subjectService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { READABLE_DDMMYY_TIME_24H } from 'src/utils/dateUtils';
import { getUserFullName } from 'src/utils/formatUtils';
import '../../styles/common/common.scss';

const { Title, Text } = Typography;
const { Option } = Select;

export const getSubjectTypeIcon = (subjectType: SubjectType) => {
  switch (subjectType) {
    case SubjectType.COMPANY:
      return <ShopOutlined />;
    case SubjectType.POLICY:
      return <BookOutlined />;
    case SubjectType.PROCESS:
      return <ToolOutlined />;
    default:
      return null;
  }
};

interface SortOption {
  sortType: string;
  label: string;
  comparator: (a: Subject, b: Subject) => number;
}

const sortOptions: SortOption[] = [
  {
    sortType: 'TitleAsc',
    label: 'Title A - Z',
    comparator: (a, b) => a.title.localeCompare(b.title)
  },
  {
    sortType: 'TitleDsc',
    label: 'Title Z - A',
    comparator: (a, b) => b.title.localeCompare(a.title)
  },
  {
    sortType: 'CreatedByAsc',
    label: 'Created By A - Z',
    comparator: (a, b) =>
      getUserFullName(a.createdBy).localeCompare(getUserFullName(b.createdBy))
  },
  {
    sortType: 'CreatedByDsc',
    label: 'Created By Z - A',
    comparator: (a, b) =>
      getUserFullName(b.createdBy).localeCompare(getUserFullName(a.createdBy))
  },
  {
    sortType: 'CreatedOnAsc',
    label: 'Created Date - Earliest',
    comparator: (a, b) => moment(a.createdAt).diff(b.createdAt)
  },
  {
    sortType: 'CreatedOnDsc',
    label: 'Created Date - Latest',
    comparator: (a, b) => moment(b.createdAt).diff(a.createdAt)
  }
];

const AllSubjects = () => {
  const navigate = useNavigate();
  const { updateBreadcrumbItems } = React.useContext(breadcrumbContext);
  const [subjectType, setSubjectType] = React.useState<SubjectType>(
    SubjectType.COMPANY
  );
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [searchField, setSearchField] = React.useState<string>('');
  const [sortOption, setSortOption] = React.useState<SortOption | null>(null);

  const displayedSubjects = React.useMemo(
    () => subjects.filter((subject) => subject.type === subjectType),
    [subjectType, subjects]
  );

  const sortedAndFilteredSubjects = React.useMemo(() => {
    const filteredSubjects = displayedSubjects.filter((subject) => {
      const { title, createdBy } = subject;
      const searchFieldLower = searchField.toLowerCase();
      return (
        title.toLowerCase().includes(searchFieldLower) ||
        createdBy.firstName.toLowerCase().includes(searchFieldLower) ||
        createdBy.lastName.toLowerCase().includes(searchFieldLower)
      );
    });
    return sortOption
      ? filteredSubjects.sort(sortOption.comparator)
      : filteredSubjects;
  }, [displayedSubjects, searchField, sortOption]);

  React.useEffect(() => {
    setLoading(true);
    asyncFetchCallback(getAllSubjects(), setSubjects, () => void 0, {
      updateLoading: setLoading
    });
  }, []);

  React.useEffect(() => {
    updateBreadcrumbItems([{ label: 'Subjects', to: SUBJECTS_URL }]);
  }, [updateBreadcrumbItems]);

  const columns: TableColumnsType<Subject> = [
    {
      title: 'Title',
      dataIndex: 'title',
      width: '60%',
      // TODO: change to view page first
      render: (value, record) => (
        <Link
          to={generatePath(EDIT_SUBJECT_URL, {
            subjectId: record.id.toString()
          })}
        >
          {value}
        </Link>
      )
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      render: (value) => getUserFullName(value)
    },
    {
      title: 'Created On',
      dataIndex: 'createdAt',
      render: (value) => moment(value).format(READABLE_DDMMYY_TIME_24H)
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      width: '10%',
      render: (value) => (
        <Space>
          <Tooltip
            title='View Subject'
            placement='bottom'
            mouseEnterDelay={0.8}
          >
            <Button icon={<EyeOutlined />} shape='round' />
          </Tooltip>
          <Tooltip
            title='Edit Subject'
            placement='bottom'
            mouseEnterDelay={0.8}
          >
            <Button
              icon={<EditOutlined />}
              shape='round'
              onClick={() =>
                navigate(generatePath(EDIT_SUBJECT_URL, { subjectId: value }))
              }
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className='container-left-full'>
      <Title level={2}>TKG Subjects</Title>
      <Space direction='vertical' style={{ width: '100%' }} size={32}>
        <Menu
          mode='horizontal'
          selectedKeys={[subjectType]}
          onSelect={({ key }) => setSubjectType(key as SubjectType)}
          items={[
            {
              key: SubjectType.COMPANY,
              label: 'Company',
              icon: <ShopOutlined />
            },
            {
              key: SubjectType.POLICY,
              label: 'Policies',
              icon: <BookOutlined />
            },
            {
              key: SubjectType.PROCESS,
              label: 'Processes',
              icon: <ToolOutlined />
            }
          ]}
        />
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
          <Table
            dataSource={sortedAndFilteredSubjects}
            columns={columns}
            pagination={{ pageSize: 10 }}
            loading={loading}
            rowKey={(record) => record.id}
          />
        </Space>
        <CreateSubjectModalButton subjectType={subjectType} />
        {/* <Link to={EDIT_TOPIC_URL}>Edit Topic</Link> */}
      </Space>
    </div>
  );
};

export default AllSubjects;
