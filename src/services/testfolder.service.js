import httpInterceptor from "../httpHelper/httpHelper";

const url = process.env.REACT_APP_API_URL;

export const saveTestFolder = (folder) => {
  return httpInterceptor
    .post(`${url}/my/testfolders`, folder)
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

export const updateTestFolder = (folder) => {
  return httpInterceptor
    .put(`${url}/my/testfolders`, folder)
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

export const getRootTestFolders = () => {
  return httpInterceptor
    .get(`${url}/my/testfolders`)
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

export const getUserTestFolders = (folderId) => {
  return httpInterceptor
    .get(`${url}/my/folders/${folderId}/folders`)
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
