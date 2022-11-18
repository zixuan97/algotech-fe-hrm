import { Typography, Grid, Menu } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import React, { useState } from 'react';

const { useBreakpoint } = Grid;

const EditChartSidebar = () => {
  const screens = useBreakpoint();

  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <Sider
      width={'20vw'}
      //   breakpoint='lg'
      //   collapsedWidth='0'
      style={{
        padding: '0 10px',
        overflow: 'auto',
        position: 'fixed',
        height: '100vh',
        right: 0,
        backgroundColor: 'gray'
      }}
      collapsed={collapsed}
      //   collapsible={false}
    >
      <div>
        <Typography.Title style={{ whiteSpace: 'nowrap' }} level={3}>
          Configure Org Chart
        </Typography.Title>
      </div>
    </Sider>
  );
};

export default EditChartSidebar;
