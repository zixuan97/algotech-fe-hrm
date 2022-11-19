import axios from 'axios';
import apiRoot from './apiRoot';
import { User, JobRole, TreeNode } from 'src/models/types';

// Org Chart
export const getOrganisationHierarchy = async (): Promise<TreeNode[]> => {
  return axios.post(`${apiRoot}/user/org`).then((res) => res.data);
};

export const getCEO = async (): Promise<User> => {
  return axios.get(`${apiRoot}/user/ceo`).then((res) => res.data);
};

export const setCEO = async (id: string | number): Promise<User> => {
  return axios.post(`${apiRoot}/user/changeceo/${id}`);
};

export const assignSubordinatesToManager = async (
  body: {id: number, users: { id: number }[]}
): Promise<void> => {
  return axios.post(`${apiRoot}/user/assign/subordinates`, body);
};

export const unAssignSubordinatesToManager = async (
  body: object
): Promise<void> => {
  return axios.post(`${apiRoot}/user/unassign/subordinates`, body);
};

// Employee
export const getAllEmployees = async (): Promise<User[]> => {
  return axios.get(`${apiRoot}/user/employee/all`).then((res) => res.data);
};

export const editEmployee = async (body: object): Promise<void> => {
  return axios.put(`${apiRoot}/user/employee`, body);
};

// Job Role
export const getAllJobRoles = async (): Promise<JobRole[]> => {
  return axios.get(`${apiRoot}/user/jobroles/all`).then((res) => res.data);
};

export const addJobRolesToUser = async (body: object): Promise<User> => {
  return axios.put(`${apiRoot}/user/jobroles`, body);
};
