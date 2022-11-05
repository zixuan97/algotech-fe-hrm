import axios from 'axios';
import { LeaveQuota } from 'src/models/types';
import apiRoot from './apiRoot';

export const getAllLeaveQuota = async (): Promise<LeaveQuota[]> => {
  return axios.get(`${apiRoot}/leave/allquota`).then((res) => res.data);
};

export const createLeaveQuota = async (body: object): Promise<void> => {
  return axios.post(`${apiRoot}/leave/quota`, body);
};

export const editLeaveQuota = async (body: object): Promise<void> => {
  return axios.put(`${apiRoot}/leave/quota`, body);
};

export const deleteLeaveQuota = async (id: string | number): Promise<void> => {
  return axios.delete(`${apiRoot}/leave/quota/${id}`);
};
