import React from 'react';
import {
  DesktopOutlined,
  FileTextOutlined,
  LineChartOutlined,
  TeamOutlined,
  ToolOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { Grid, Layout, Menu, MenuProps } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DASHBOARD_URL,
  LEAVE_QUOTA_URL,
  MY_LEAVE_APPLICATIONS_URL,
  PEOPLE_URL,
  SUBJECTS_URL,
  PROCESSES_URL,
  REPORTS_URL,
  COMPANY_LEAVE_SCHEDULE_URL
} from '../routes/routes';
import '../../styles/common/app.scss';

const { Sider } = Layout;
const { useBreakpoint } = Grid;

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
    label: <Link to={PEOPLE_URL}>People</Link>,
    key: PEOPLE_URL,
    icon: <TeamOutlined />
  },
  {
    label: <Link to={SUBJECTS_URL}>Subjects</Link>,
    key: SUBJECTS_URL,
    icon: <FileTextOutlined />
  },
  {
    label: <Link to={PROCESSES_URL}>Processes</Link>,
    key: PROCESSES_URL,
    icon: <ToolOutlined />
  },
  {
    label: <Link to={REPORTS_URL}>Reports</Link>,
    key: REPORTS_URL,
    icon: <LineChartOutlined />
  },
  {
    label: 'Leave',
    key: 'leave',
    icon: <CalendarOutlined />,
    children: [
      {
        label: <Link to={LEAVE_QUOTA_URL}>Leave Quota</Link>,
        key: 'leave-quota'
      },
      {
        label: (
          <Link to={COMPANY_LEAVE_SCHEDULE_URL}>Company Leave Schedule</Link>
        ),
        key: 'company-leave-schedule'
      },
      {
        label: (
          <Link to={MY_LEAVE_APPLICATIONS_URL}>My Leave Applications</Link>
        ),
        key: 'my-leave-applications'
      }
    ]
  }
];

const Sidebar = () => {
  const location = useLocation();
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = React.useState<boolean>(!screens.xxl);

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
