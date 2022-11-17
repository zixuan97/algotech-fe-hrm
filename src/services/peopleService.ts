import axios from 'axios';
import apiRoot from './apiRoot';
import { User, JobRole } from 'src/models/types';

export const getOrganisationHierarchy = async (): Promise<any> => {
  return axios.post(`${apiRoot}/user/org`).then((res) => res.data);
};

// employee

export const getAllEmployees = async (): Promise<User[]> => {
  return axios.get(`${apiRoot}/user/employee/all`).then((res) => res.data);
};

export const editEmployee = async (body: object): Promise<void> => {
  return axios.put(`${apiRoot}/user/employee`, body);
};

// job role

export const getAllJobRoles = async (): Promise<JobRole[]> => {
  return axios.get(`${apiRoot}/user/jobroles/all`).then((res) => res.data);
};

export const addJobRolesToUser = async (body: object): Promise<User> => {
  return axios.put(`${apiRoot}/user/jobroles`, body);
};
