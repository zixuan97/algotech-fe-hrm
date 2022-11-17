import { Result } from 'antd';
import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';

type RoleRouteProps = {
  allowedRoles: string[];
};

const RoleRoute = ({ allowedRoles }: RoleRouteProps): JSX.Element => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  return allowedRoles.includes(user?.role ?? '') ? (
    <Outlet />
  ) : (
    <Result
      status='403'
      title='403'
      subTitle='Sorry, you are not authorized to access this page.'
    />
  );
};

export default RoleRoute;
