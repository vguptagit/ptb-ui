import httpInterceptor from "../httpHelper/httpHelper";

const url = process.env.REACT_APP_API_URL;

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
