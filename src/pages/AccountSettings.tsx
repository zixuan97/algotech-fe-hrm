import React from 'react';
import { Space, Switch, Typography } from 'antd';
import themeContext from 'src/context/theme/themeContext';

const { Text } = Typography;

const AccountSettings = () => {
  const { isDarkMode, updateDarkMode } = React.useContext(themeContext);
  return (
    <div>
      <Space>
        <Text>Dark Mode</Text>
        <Switch
          onChange={(checked) => updateDarkMode(checked)}
          checked={isDarkMode}
        />
      </Space>
    </div>
  );
};

export default AccountSettings;
