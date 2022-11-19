import axios from 'axios';
import {
  CalendarPHObject,
  EmployeeLeaveQuota,
  LeaveApplication,
  LeaveQuota
} from 'src/models/types';
import apiRoot from './apiRoot';

export const getAllLeaveQuota = async (): Promise<LeaveQuota[]> => {
  return axios.get(`${apiRoot}/leave/allquota`).then((res) => res.data);
};

export const getAllEmployeeLeaveQuota = async (): Promise<
  EmployeeLeaveQuota[]
> => {
  return axios.get(`${apiRoot}/leave/records/all`).then((res) => res.data);
};

export const getEmployeeLeaveQuota = async (
  id: string | number
): Promise<EmployeeLeaveQuota> => {
  return axios.get(`${apiRoot}/leave/employee/${id}`).then((res) => res.data);
};

export const getTierSize = async (tierName: string): Promise<number> => {
  return axios
    .get(`${apiRoot}/leave/size/tier/${tierName}`)
    .then((res) => res.data);
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

export const deleteAndReplaceLeaveQuota = async (
  body: object
): Promise<void> => {
  return axios.post(`${apiRoot}/leave/deletedtier/newtier`, body);
};

export const editEmployeeLeaveQuota = async (body: object): Promise<void> => {
  return axios.put(`${apiRoot}/leave/employee/quota`, body);
};

export const getAllLeaveApplications = async (): Promise<
  LeaveApplication[]
> => {
  return axios.get(`${apiRoot}/leave/all`).then((res) => res.data);
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

export const getAllPublicHolidays = async (
  year: string | number
): Promise<CalendarPHObject[]> => {
  return axios.get(`${apiRoot}/leave/ph/${year}`).then((res) => res.data);
};

export const getLeaveApplicationById = async (
  id: string | number
): Promise<LeaveApplication> => {
  return axios.get(`${apiRoot}/leave/${id}`).then((res) => res.data);
};

export const createLeaveApplication = async (
  body: object
): Promise<LeaveApplication> => {
  return axios.post(`${apiRoot}/leave`, body).then((res) => res.data);
};

export const editLeaveApplication = async (body: object): Promise<void> => {
  return axios.put(`${apiRoot}/leave`, body);
};

export const approveLeaveApplication = async (body: object): Promise<void> => {
  return axios.post(`${apiRoot}/leave/approve`, body, {
    headers: {
      'x-access-token': axios.defaults.headers.common['x-access-token']
    }
  });
};

export const rejectLeaveApplication = async (body: object): Promise<void> => {
  return axios.post(`${apiRoot}/leave/reject`, body, {
    headers: {
      'x-access-token': axios.defaults.headers.common['x-access-token']
    }
  });
};

export const cancelLeaveApplication = async (
  id: string | number
): Promise<void> => {
  return axios.post(`${apiRoot}/leave/cancel/${id}`).then((res) => res.data);
};
