import axios, { AxiosError } from "axios";
import { Quiz, QuizAnswer, QuizAttempt, QuizQuestion } from "./types";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;
const axiosWithCredentials = axios.create({ withCredentials: true });

export const fetchQuizzesForCourse = async (
  courseId: string,
): Promise<Quiz[]> => {
  const { data } = await axiosWithCredentials.get(
    `${COURSES_API}/${courseId}/quizzes`,
  );
  return data;
};

export const fetchQuizById = async (quizId: string): Promise<Quiz> => {
  const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
  return data;
};

export const createQuizForCourse = async (
  courseId: string,
  quiz: Partial<Quiz>,
): Promise<Quiz> => {
  const { data } = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/quizzes`,
    quiz,
  );
  return data;
};

export const updateQuiz = async (quiz: Partial<Quiz> & { _id: string }) => {
  const { data } = await axiosWithCredentials.put(
    `${QUIZZES_API}/${quiz._id}`,
    quiz,
  );
  return data;
};

export const deleteQuiz = async (quizId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${QUIZZES_API}/${quizId}`,
  );
  return data;
};

export const setQuizPublished = async (quizId: string, published: boolean) => {
  const { data } = await axiosWithCredentials.patch(
    `${QUIZZES_API}/${quizId}/publish`,
    { published },
  );
  return data;
};

export const addQuestion = async (
  quizId: string,
  question: Partial<QuizQuestion>,
): Promise<QuizQuestion> => {
  const { data } = await axiosWithCredentials.post(
    `${QUIZZES_API}/${quizId}/questions`,
    question,
  );
  return data;
};

export const updateQuestion = async (
  quizId: string,
  questionId: string,
  question: Partial<QuizQuestion>,
) => {
  const { data } = await axiosWithCredentials.put(
    `${QUIZZES_API}/${quizId}/questions/${questionId}`,
    question,
  );
  return data;
};

export const deleteQuestion = async (quizId: string, questionId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${QUIZZES_API}/${quizId}/questions/${questionId}`,
  );
  return data;
};

export const submitQuizAttempt = async (
  quizId: string,
  answers: QuizAnswer[],
) => {
  const { data } = await axiosWithCredentials.post(
    `${QUIZZES_API}/${quizId}/attempts`,
    { answers },
  );
  return data;
};

export const previewQuizAttempt = async (
  quizId: string,
  answers: QuizAnswer[],
) => {
  const { data } = await axiosWithCredentials.post(
    `${QUIZZES_API}/${quizId}/attempts`,
    { answers, preview: true },
  );
  return data;
};

export const fetchLastAttempt = async (
  quizId: string,
): Promise<QuizAttempt | null> => {
  try {
    const { data } = await axiosWithCredentials.get(
      `${QUIZZES_API}/${quizId}/last-attempt`,
    );
    return data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    if (axiosError?.response?.status === 404) {
      return null;
    }
    throw error;
  }
};
