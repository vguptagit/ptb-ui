import httpInterceptor from "../httpHelper/httpHelper";
import questions from "../mocks/questions.json";
import { getErrorMessage } from "../utils/common";

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
      message: error,
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

export const getTestQuestions = (testId) => {
  console.log(testId);
  console.log(window.mock);
  if (window.mock) {
    console.log(questions);
    return questions;
  }
  return httpInterceptor
    .get(`${url}/test/${testId}/questions`)
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

export const getPublisherTestsByBookId = (bookId) => {
  return httpInterceptor
    .get(`${url}/books/${bookId}/tests`)
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

export const exportTest = async (testId, format, options) => {
  let data = '';
  for (const key in options) {
    data += `${key}=${options[key]}$`;
  }
  data = data.slice(0, -1);

  const base64Data = btoa(data);
  const downloadURL = `${url}/tests/${testId}/download/${format}?data=${base64Data}`;
  try {
    const response = await httpInterceptor.get(downloadURL, { responseType: 'blob' });

    if (response.status !== 200) {
      throw new Error(getErrorMessage(response));
    }

    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

