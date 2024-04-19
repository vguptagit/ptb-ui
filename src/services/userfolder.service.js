import httpInterceptor from '../httpHelper/httpHelper';

const url = process.env.REACT_APP_API_URL;

export const getUserQuestionFolders = () => {
  return httpInterceptor
    .get(`${url}/my/questionfolders`)
    .then(response => {
      return response?.data;
    })
    .catch(error => {
      return Promise.reject({
        type: 'error',
        message: error,
      });
    });
};

export const getUserQuestionFoldersRoot = () => {
  return httpInterceptor
    .get(`${url}/my/questionfoldersroot`)
    .then(response => {
      return response?.data;
    })
    .catch(error => {
      return Promise.reject({
        type: 'error',
        message: error,
      });
    });
};

export const saveUserQuestionFolder = folder => {
  return httpInterceptor
    .post(`${url}/my/questionfolders`, folder)
    .then(response => {
      return response?.data;
    })
    .catch(error => {
      return Promise.reject({
        type: 'error',
        message: error,
      });
    });
};

export const updateUserQuestionFolders = folders => {
  return httpInterceptor
    .put(`${url}/my/questionfolders`, folders)
    .then(response => {
      return response?.data;
    })
    .catch(error => {
      return Promise.reject({
        type: 'error',
        message: error,
      });
    });
};

export const getChildQuestionFolders = folderId => {
  return httpInterceptor
    .get(`${url}/my/questionfolders/${folderId}/folders`)
    .then(response => {
      return response?.data;
    })
    .catch(error => {
      return Promise.reject({
        type: 'error',
        message: error,
      });
    });
};

export const getUserQuestions = folderId => {
  return httpInterceptor
    .get(`${url}/my/questions?folderId=${folderId}`)
    .then(response => {
      return response?.data;
    })
    .catch(error => {
      return Promise.reject({
        type: 'error',
        message: error,
      });
    });
};

export const getAllQuestions = (bookid, nodeId) => {
  return httpInterceptor
    .get(`${url}/books/${bookid}/nodes/${nodeId}/questions`)
    .then(response => {
      return response?.data;
    })
    .catch(error => {
      return Promise.reject({
        type: 'error',
        message: error,
      });
    });
};

export const swapQuestionBetweenFolders = (sourceFolderId, destinationFolderId, questionId) => {
  const endpoint = `${url}/my/folders/${sourceFolderId}/folders/${destinationFolderId}/questions/${questionId}`;

  return httpInterceptor
    .put(endpoint)
    .then(response => {
      return response?.data;
    })
    .catch(error => {
      return Promise.reject({
        type: 'error',
        message: error,
      });
    });
};
