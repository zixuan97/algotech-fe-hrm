import axios from 'axios';
import { LeaveApplication, LeaveQuota } from 'src/models/types';
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

export const getLeaveApplicationsByEmployeeId = async (
  id: string | number
): Promise<LeaveApplication[]> => {
  return axios.get(`${apiRoot}/leave/all/${id}`).then((res) => res.data);
};

export const getAllApprovedLeaveApplications = async (): Promise<
  LeaveApplication[]
> => {
  return axios.get(`${apiRoot}/leave/approved/all`).then((res) => res.data);
};

export const getLeaveApplicationById = async (
  id: string | number
): Promise<LeaveApplication> => {
  return axios.get(`${apiRoot}/leave/${id}`).then((res) => res.data);
};

export const editLeaveApplication = async (body: object): Promise<void> => {
  return axios.put(`${apiRoot}/leave`, body);
};

export const cancelLeaveApplication = async (
  id: string | number
): Promise<void> => {
  return axios.post(`${apiRoot}/leave/cancel/${id}`).then((res) => res.data);
};
