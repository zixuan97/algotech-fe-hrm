import React from 'react';
import { useLocation } from 'react-router-dom';
import authContext from 'src/context/auth/authContext';

const useAuthVerify = () => {
  const location = useLocation();
  const { loadUser } = React.useContext(authContext);

  React.useEffect(() => {
    loadUser();
  }, [location, loadUser]);
};

export default useAuthVerify;
