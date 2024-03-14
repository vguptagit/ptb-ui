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

export const getPrintsettings = async () => {
    try {
        const response = await httpInterceptor.get(`${url}/settings/printsettings`);
        console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw {
            type: "error",
            message: error
        };
    }
};

export const savePrintsettings = (data) => {
  return httpInterceptor
    .post(`${url}/settings/printsettings`, data)
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

export const getRootTests = () => {
  return httpInterceptor
    .get(`${url}/my/testroot`)
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