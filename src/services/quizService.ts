import axios from 'axios';
import { Quiz, QuizQuestion } from 'src/models/types';
import apiRoot from './apiRoot';

export const createQuiz = async (quiz: Partial<Quiz>): Promise<Quiz> => {
  return axios.post(`${apiRoot}/quiz`, quiz).then((res) => res.data);
};

export const getQuizById = async (quizId: number | string): Promise<Quiz> => {
  return axios.get(`${apiRoot}/quiz/${quizId}`).then((res) => res.data);
};

export const updateQuiz = async (quiz: Quiz): Promise<Quiz> => {
  return axios.put(`${apiRoot}/quiz`, quiz).then((res) => res.data);
};

export const deleteQuiz = async (quizId: string | number): Promise<void> => {
  return axios.delete(`${apiRoot}/quiz/${quizId}`).then((res) => res.data);
};

export const updateQuizzesOrder = async (quizzes: Quiz[]): Promise<Quiz[]> => {
  return axios.post(`${apiRoot}/quiz/order`, quizzes).then((res) => res.data);
};

export const createQuizQuestion = async (
  question: Partial<QuizQuestion>
): Promise<QuizQuestion> => {
  return axios
    .post(`${apiRoot}/quizquestion`, question)
    .then((res) => res.data);
};

export const updateQuizQuestion = async (
  quizQuestion: QuizQuestion
): Promise<QuizQuestion> => {
  return axios
    .put(`${apiRoot}/quizquestion`, quizQuestion)
    .then((res) => res.data);
};

export const deleteQuizQuestion = async (
  questionId: string | number
): Promise<void> => {
  return axios
    .delete(`${apiRoot}/quizquestion/${questionId}`)
    .then((res) => res.data);
};

export const updateQuizQuestionssOrder = async (
  questions: QuizQuestion[]
): Promise<QuizQuestion[]> => {
  return axios
    .post(`${apiRoot}/quizquestion/order`, questions)
    .then((res) => res.data);
};
