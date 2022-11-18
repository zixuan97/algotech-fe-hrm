import axios from 'axios';
import { EmployeeSubjectRecord } from 'src/models/types';
import apiRoot from './apiRoot';

export const getAllSubjectRecordsPerUser = async (): Promise<
  EmployeeSubjectRecord[]
> => {
  return axios.get(`${apiRoot}/subject/records/all`).then((res) => res.data);
};

export const getSubjectRecordById = async (
  subjectId: string | number,
  userId: string | number
): Promise<EmployeeSubjectRecord> => {
  return axios
    .get(`${apiRoot}/subject/completionrate/${subjectId}/${userId}`)
    .then((res) => res.data);
};
