import axios from 'axios';
import { Quiz } from 'src/models/types';
import apiRoot from './apiRoot';

export const createQuiz = async (quiz: Partial<Quiz>): Promise<Quiz> => {
  return axios.post(`${apiRoot}/quiz`, quiz).then((res) => res.data);
};

export const deleteQuiz = async (quizId: string | number): Promise<void> => {
  return axios.delete(`${apiRoot}/quiz/${quizId}`).then((res) => res.data);
};

export const updateQuizzesOrder = async (quizzes: Quiz[]): Promise<Quiz[]> => {
  return axios.post(`${apiRoot}/quiz/order`, quizzes).then((res) => res.data);
};
