import axios from 'axios';
import { Quiz, Subject, Topic, User } from 'src/models/types';
import apiRoot from './apiRoot';

export const getAllSubjects = async (): Promise<Subject[]> => {
  return axios.get(`${apiRoot}/subject/all`).then((res) => res.data);
};

export const getSubjectById = async (
  subjectId: number | string
): Promise<Subject> => {
  return axios.get(`${apiRoot}/subject/${subjectId}`).then((res) => res.data);
};

export const createSubject = async (
  subject: Partial<Subject>
): Promise<Subject> => {
  return axios.post(`${apiRoot}/subject`, subject).then((res) => res.data);
};

export const updateSubject = async (subject: Subject): Promise<Subject> => {
  return axios.put(`${apiRoot}/subject`, subject).then((res) => res.data);
};

export const assignUsersToSubject = async (
  subjectId: number,
  users: User[]
): Promise<Subject> => {
  return axios
    .post(`${apiRoot}/subject/users`, {
      id: subjectId,
      users
    })
    .then((res) => res.data);
};

export const unassignUsersFromSubject = async (
  subjectId: number,
  users: User[]
): Promise<Subject> => {
  return axios
    .post(`${apiRoot}/subject/unassign/users`, {
      id: subjectId,
      users
    })
    .then((res) => res.data);
};

export const createTopic = (topic: Topic): Promise<Topic> => {
  return axios.post(`${apiRoot}/topic`, topic).then((res) => res.data);
};

export const createQuiz = (quiz: Quiz): Promise<Quiz> => {
  return axios.post(`${apiRoot}/quiz`, quiz).then((res) => res.data);
};
