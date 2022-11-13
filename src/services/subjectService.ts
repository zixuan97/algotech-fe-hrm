import axios from 'axios';
import { Quiz, Step, Subject, Topic, User } from 'src/models/types';
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

export const createTopic = async (topic: Partial<Topic>): Promise<Topic> => {
  return axios.post(`${apiRoot}/topic`, topic).then((res) => res.data);
};

export const getTopicById = async (
  topicId: number | string
): Promise<Topic> => {
  return axios.get(`${apiRoot}/topic/${topicId}`).then((res) => res.data);
};

export const updateTopic = async (topic: Topic): Promise<Topic> => {
  return axios.put(`${apiRoot}/topic`, topic).then((res) => res.data);
};

export const createQuiz = async (quiz: Partial<Quiz>): Promise<Quiz> => {
  return axios.post(`${apiRoot}/quiz`, quiz).then((res) => res.data);
};

export const createStep = async (step: Partial<Step>): Promise<Step> => {
  return axios.post(`${apiRoot}/step`, step).then((res) => res.data);
};

export const updateStep = async (step: Step): Promise<Step> => {
  return axios.put(`${apiRoot}/step`, step).then((res) => res.data);
};
