import httpInterceptor from "../httpHelper/httpHelper";

const url = process.env.REACT_APP_API_URL;

export const saveMyQuestions = (questionEnvelops) => {
  return httpInterceptor
    .post(`${url}/my/questions`, questionEnvelops)
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

export const saveMyTest = (test, folderId) => {
  if (!folderId) folderId = "null";
  return httpInterceptor
    .post(`${url}/my/folders/${folderId}/tests`, test)
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

export const getFolderTests = (folderId) => {
  return httpInterceptor
    .get(`${url}/my/folders/${folderId}/tests`)
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
