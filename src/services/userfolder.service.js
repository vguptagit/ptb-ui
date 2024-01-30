import httpInterceptor from "../httpHelper/httpHelper";

const url = 'http://localhost:8080';

export const getUserQuestionFolders = () => {
  return httpInterceptor
    .get(`${url}/my/questionfolders`)
    .then((response) => {
      return response?.data;
    })
    .catch((error) => {
      return Promise.reject({
        type: "error",
        message: error,
      });
    });
};

export const saveUserQuestionFolder = (folder) => {
  return httpInterceptor
    .post(`${url}/my/questionfolders`, folder)
    .then((response) => {
      return response?.data;
    })
    .catch((error) => {
      return Promise.reject({
        type: "error",
        message: error,
      });
    });
};
