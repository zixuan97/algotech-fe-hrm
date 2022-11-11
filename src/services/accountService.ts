import axios from 'axios';
import { User } from 'src/models/types';
import apiRoot from './apiRoot';

export const forgetPasswordSvc = async (
  recipientEmail: string
): Promise<any> => {
  return axios
    .post(`${apiRoot}/user/forgetpw`, { recipientEmail })
    .then((res) => res.data);
};

export const editUserSvc = async (user: User): Promise<any> => {
  return axios.put(`${apiRoot}/user`, user).then((res) => res.data);
};

export const updatePasswordSvc = async (
  userEmail: string,
  currentPassword: string,
  newPassword: string
): Promise<any> => {
  return axios
    .post(`${apiRoot}/user/updatepw`, {
      userEmail,
      currentPassword,
      newPassword
    })
    .then((res) => res.data);
};
