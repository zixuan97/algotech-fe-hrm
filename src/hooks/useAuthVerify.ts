import axios, { AxiosError } from 'axios';
import React from 'react';
import { useLocation } from 'react-router-dom';
import authContext from 'src/context/auth/authContext';
import useHasChanged from './useHasChanged';

const useAuthVerify = () => {
  const location = useLocation();
  const { loadUser, logout } = React.useContext(authContext);

  const locationHasChanged = useHasChanged(location);

  axios.interceptors.response.use(
    (res) => res,
    (err: AxiosError) => {
      console.log(err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      }
      return err;
    }
  );

  React.useEffect(() => {
    if (locationHasChanged) {
      loadUser();
    }
  }, [locationHasChanged, loadUser]);
};

export default useAuthVerify;
