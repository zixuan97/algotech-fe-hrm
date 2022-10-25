import React from 'react';
import {
  Button,
  Dropdown,
  Layout,
  Menu,
  Space,
  Switch,
  Typography
} from 'antd';
import themeContext from 'src/context/theme/themeContext';
import '../../styles/common/app.scss';
import '../../styles/common/common.scss';
import { UserOutlined } from '@ant-design/icons';
import { ACCOUNT_SETTINGS_URL, LOGIN_URL } from '../routes/routes';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const { Text } = Typography;

const AppHeader = () => {
  const { isDarkMode, updateDarkMode } = React.useContext(themeContext);

  return (
    <Header className={`app-header-${isDarkMode ? 'dark' : 'light'}`}>
      <div className='container-spaced-out'>
        <div>The Kettle Gourmet</div>
        <Space size='middle'>
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
                    key: 'Logout'
                  }
                ]}
              />
            }
          >
            <Button icon={<UserOutlined />} shape='circle' type='primary' />
          </Dropdown>
          {/* TODO: shift this into account settings */}
          <Space>
            <Text>Dark Mode</Text>
            <Switch
              onChange={(checked) => updateDarkMode(checked)}
              checked={isDarkMode}
            />
          </Space>
        </Space>
      </div>
    </Header>
  );
};

export default AppHeader;
