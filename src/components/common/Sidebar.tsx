import React, { useContext } from 'react';
import {
  DesktopOutlined,
  FileTextOutlined,
  TeamOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { Grid, Layout, Menu, MenuProps } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DASHBOARD_URL,
  LEAVE_QUOTA_URL,
  MY_LEAVE_APPLICATIONS_URL,
  SUBJECTS_URL,
  COMPANY_LEAVE_SCHEDULE_URL,
  ALL_LEAVE_APPLICATIONS_URL,
  EMPLOYEE_LEAVE_QUOTA_URL,
  PEOPLE_MANAGE_URL,
  PEOPLE_ROLES_URL,
  MY_SUBJECTS_URL,
  PEOPLE_ORGCHART_URL
} from '../routes/routes';
import '../../styles/common/app.scss';
import authContext from 'src/context/auth/authContext';
import { UserRole } from 'src/models/types';

const { Sider } = Layout;
const { useBreakpoint } = Grid;

const Sidebar = () => {
  const { user } = useContext(authContext);

  const location = useLocation();
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = React.useState<boolean>(!screens.xxl);

  const menuItems: MenuProps['items'] = [
    {
      label: <Link to={DASHBOARD_URL}>Dashboard</Link>,
      key: DASHBOARD_URL,
      icon: <DesktopOutlined />
    },
    // {
    //   label: <Link to={COMPANY_URL}>Company</Link>,
    //   key: COMPANY_URL,
    //   icon: <ShopOutlined />
    // },
    {
      label: 'People',
      key: 'people',
      icon: <TeamOutlined />,
      children: [
        {
          label: <Link to={PEOPLE_ORGCHART_URL}>Org Chart</Link>,
          key: 'orgchart'
        },
        ...(user?.role === UserRole.ADMIN
          ? [
              {
                label: <Link to={PEOPLE_MANAGE_URL}>Manage People</Link>,
                key: 'manage-people'
              }
            ]
          : []),
        ...(user?.role === UserRole.ADMIN
          ? [
              {
                label: <Link to={PEOPLE_ROLES_URL}>Manage Roles</Link>,
                key: 'roles'
              }
            ]
          : [])
      ]
    },
    {
      label: 'Subjects',
      key: 'subjects',
      icon: <FileTextOutlined />,
      children: [
        ...(user?.role === UserRole.ADMIN
          ? [
              {
                label: <Link to={SUBJECTS_URL}>All Subjects</Link>,
                key: SUBJECTS_URL
              }
            ]
          : []),
        {
          label: <Link to={MY_SUBJECTS_URL}>My Assigned Subjects</Link>,
          key: MY_SUBJECTS_URL
        }
      ]
    },
    // {
    //   label: <Link to={PROCESSES_URL}>Processes</Link>,
    //   key: PROCESSES_URL,
    //   icon: <ToolOutlined />
    // },
    // {
    //   label: <Link to={REPORTS_URL}>Reports</Link>,
    //   key: REPORTS_URL,
    //   icon: <LineChartOutlined />
    // },
    {
      label: 'Leave',
      key: 'leave',
      icon: <CalendarOutlined />,
      children: [
        ...(user?.role === UserRole.ADMIN
          ? [
              {
                label: <Link to={LEAVE_QUOTA_URL}>Leave Quota</Link>,
                key: 'leave-quota'
              }
            ]
          : []),
        ...(user?.role === UserRole.ADMIN
          ? [
              {
                label: (
                  <Link to={EMPLOYEE_LEAVE_QUOTA_URL}>
                    Employee Leave Quota
                  </Link>
                ),
                key: 'employee-leave-quota'
              }
            ]
          : []),
        {
          label: (
            <Link to={COMPANY_LEAVE_SCHEDULE_URL}>Company Leave Schedule</Link>
          ),
          key: 'company-leave-schedule'
        },
        ...(user?.role === UserRole.ADMIN
          ? [
              {
                label: (
                  <Link to={ALL_LEAVE_APPLICATIONS_URL}>
                    All Leave Applications
                  </Link>
                ),
                key: 'all-leave-applications'
              }
            ]
          : []),
        {
          label: (
            <Link to={MY_LEAVE_APPLICATIONS_URL}>My Leave Applications</Link>
          ),
          key: 'my-leave-applications'
        }
      ]
    }
  ];

  React.useEffect(() => {
    setCollapsed(!screens.xxl);
  }, [screens.xxl]);

  return (
    <Sider
      width={screens.xxl ? '10vw' : screens.xl ? '12vw' : '14vw'}
      className='app-sidebar'
      collapsible={!screens.xxl}
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <Menu
        mode='inline'
        style={{ height: '100%' }}
        selectedKeys={[location.pathname]}
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;
