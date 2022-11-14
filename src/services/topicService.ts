import axios from 'axios';
import { Step, Topic } from 'src/models/types';
import apiRoot from './apiRoot';

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

export const deleteTopic = async (topicId: string | number): Promise<void> => {
  return axios.delete(`${apiRoot}/topic/${topicId}`).then((res) => res.data);
};

export const updateTopicsOrder = async (topics: Topic[]): Promise<Topic[]> => {
  return axios.post(`${apiRoot}/topic/order`, topics).then((res) => res.data);
};

export const createStep = async (step: Partial<Step>): Promise<Step> => {
  return axios.post(`${apiRoot}/step`, step).then((res) => res.data);
};

export const updateStep = async (step: Step): Promise<Step> => {
  return axios.put(`${apiRoot}/step`, step).then((res) => res.data);
};

export const deleteStep = async (stepId: string | number): Promise<void> => {
  return axios.delete(`${apiRoot}/step/${stepId}`).then((res) => res.data);
};

export const updateStepsOrder = async (steps: Step[]): Promise<Step[]> => {
  return axios.post(`${apiRoot}/step/order`, steps).then((res) => res.data);
};
