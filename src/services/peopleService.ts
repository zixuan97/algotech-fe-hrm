import axios from 'axios';
import apiRoot from './apiRoot';

export const getOrganisationHierarchy = async (): Promise<any> => {
  return axios.post(`${apiRoot}/user/org`).then((res) => res.data);
};
