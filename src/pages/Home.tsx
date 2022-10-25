import React from 'react';

import { Breadcrumb, Layout } from 'antd';
import { Link, Location, Outlet, useLocation } from 'react-router-dom';
import { FRONT_SLASH } from '../utils/constants';
import { startCase } from 'lodash';
import authContext from 'src/context/auth/authContext';
import moment from 'moment';
import Sidebar from 'src/components/common/Sidebar';

const { Content, Footer } = Layout;

type HomeProps = {
  children?: React.ReactNode;
};

const getBreadcrumbItems = (location: Location, isAuthenticated: boolean) => {
  const locations = location.pathname.split(FRONT_SLASH);
  if (!isAuthenticated) {
    return (
      <Breadcrumb.Item key={location.pathname}>
        <Link to={location.pathname}>
          {startCase(locations[locations.length - 1])}
        </Link>
      </Breadcrumb.Item>
    );
  }
  const breadcrumbs = [];
  let currPath = '';
  for (let i = 0; i < locations.length; i++) {
    currPath = `${currPath}${locations[i]}/`;
    const actualPath = currPath.replace(/\/+$/, '');

    breadcrumbs.push(
      <Breadcrumb.Item key={actualPath}>
        <Link to={actualPath}>{startCase(locations[i])}</Link>
      </Breadcrumb.Item>
    );
  }
  return breadcrumbs.slice(1);
};

const Home = ({ children }: HomeProps) => {
  const location = useLocation();
  const { isAuthenticated } = React.useContext(authContext);

  return (
    <Layout>
      <Sidebar />
      <Layout>
        <Content style={{ padding: '10px 40px' }}>
          <Breadcrumb style={{ margin: '24px 0' }}>
            {getBreadcrumbItems(location, isAuthenticated)}
          </Breadcrumb>
          <Layout style={{ padding: '24px 0', height: '95%' }}>
            <Content style={{ minHeight: 280, overflow: 'auto' }}>
              <Outlet />
              {children && children}
            </Content>
          </Layout>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          The Kettle Gourmet ©{moment().year()} All Rights Reserved
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Home;
