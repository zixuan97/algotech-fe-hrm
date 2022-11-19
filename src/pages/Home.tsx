import React from 'react';

import { Breadcrumb, Divider, Grid, Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from 'src/components/common/Sidebar';
import breadcrumbContext from 'src/context/breadcrumbs/breadcrumbContext';
import useAuthVerify from 'src/hooks/useAuthVerify';

const { Content } = Layout;
const { useBreakpoint } = Grid;

const Home = ({ children }: React.PropsWithChildren) => {
  const screens = useBreakpoint();
  const { getBreadcrumbItems } = React.useContext(breadcrumbContext);

  useAuthVerify();

  return (
    <Layout>
      <Sidebar />
      <Layout id='home-content'>
        <Content
          style={{
            padding: screens.xxl ? '20px 60px' : '20px 40px',
            overflow: 'auto'
          }}
        >
          <Breadcrumb style={{ margin: '12px 0' }}>
            {getBreadcrumbItems()}
          </Breadcrumb>
          <Divider />
          <Layout style={{ paddingBottom: '24px', height: '85%' }}>
            <Content style={{ minHeight: 280 }}>
              <Outlet />
              {children && children}
            </Content>
          </Layout>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
