import React from 'react';
import { Button, Dropdown, Layout, Menu, Space, Typography } from 'antd';
import authContext from '../../context/auth/authContext';
import themeContext from 'src/context/theme/themeContext';
import '../../styles/common/app.scss';
import '../../styles/common/common.scss';
import { UserOutlined } from '@ant-design/icons';
import { ACCOUNT_SETTINGS_URL, LOGIN_URL, ROOT_URL } from '../routes/routes';
import { Link } from 'react-router-dom';
import { useThemedClassName } from 'src/hooks/useThemedClassName';

const { Header } = Layout;

const { Text } = Typography;

const AppHeader = () => {
  const { isDarkMode, updateDarkMode } = React.useContext(themeContext);
  const { isAuthenticated, logout } = React.useContext(authContext);

  return (
    <Header className={useThemedClassName('app-header')}>
      <div className='container-spaced-out'>
        <Link to={ROOT_URL}>The Kettle Gourmet</Link>
        <Space size='middle'>
          {isAuthenticated && (
            <Dropdown
              placement='bottomRight'
              overlay={
                <Menu
                  mode='horizontal'
                  items={[
                    {
                      label: (
                        <Link to={ACCOUNT_SETTINGS_URL}>Account Settings</Link>
                      ),
                      key: ACCOUNT_SETTINGS_URL
                    },
                    {
                      label: <Link to={LOGIN_URL}>Logout</Link>,
                      key: 'Logout',
                      onClick: logout
                    }
                  ]}
                />
              }
            >
              <Button icon={<UserOutlined />} shape='circle' type='primary' />
            </Dropdown>
          )}
        </Space>
      </div>
    </Header>
  );
};

export default AppHeader;
