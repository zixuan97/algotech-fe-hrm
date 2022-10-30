import axios from 'axios';
import apiRoot from './apiRoot';

export const forgetPasswordSvc = async (
  recipientEmail: string
): Promise<any> => {
  return axios
    .post(`${apiRoot}/user/forgetpw`, { recipientEmail })
    .then((res) => res.data);
};
