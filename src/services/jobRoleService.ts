import axios from 'axios';
import { JobRole } from 'src/models/types';
import apiRoot from './apiRoot';

export const getAllJobRoles = async () => {
  return axios.get(`${apiRoot}/user/jobroles/all`).then((res) => res.data);
};

export const getJobRoleById = async (id: string | number): Promise<JobRole> => {
  return axios.get(`${apiRoot}/user/jobrole/${id}`).then((res) => res.data);
};

export const createJobRole = async (jobRole: Partial<JobRole>): Promise<JobRole> => {
  return axios.post(`${apiRoot}/user/jobrole/`, jobRole).then((res) => res.data);
};

export const updateJobRole = async (jobRole: JobRole): Promise<JobRole> => {
  return axios.put(`${apiRoot}/user/jobrole/`, jobRole).then((res) => res.data);
};

export const deleteJobRole = async (
  id: string | number
): Promise<void> => {
  return axios
    .delete(`${apiRoot}/user/jobrole/${id}`)
    .then((res) => res.data);
};