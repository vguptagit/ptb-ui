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
