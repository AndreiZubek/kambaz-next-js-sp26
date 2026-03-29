import axios from "axios";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const USERS_API = `${HTTP_SERVER}/api/users`;
const COURSES_API = `${HTTP_SERVER}/api/courses`;

export const fetchEnrollmentsForUser = async (userId: string) => {
  const { data } = await axios.get(`${USERS_API}/${userId}/enrollments`);
  return data;
};

export const fetchEnrollmentsForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/enrollments`);
  return data;
};

export const enrollUserInCourse = async (userId: string, courseId: string) => {
  const { data } = await axios.post(
    `${USERS_API}/${userId}/courses/${courseId}/enrollments`,
  );
  return data;
};

export const unenrollUserFromCourse = async (
  userId: string,
  courseId: string,
) => {
  const { data } = await axios.delete(
    `${USERS_API}/${userId}/courses/${courseId}/enrollments`,
  );
  return data;
};
