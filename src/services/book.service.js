import httpInterceptor from '../httpHelper/httpHelper';

const url = process.env.REACT_APP_API_URL;

export const getAllBookNodes = async (bookId, queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const requestUrl = `${url}/books/${bookId}/nodes${queryString ? `?${queryString}` : ''}`;

  return httpInterceptor
    .get(requestUrl)
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

export const getAllBookNodeSubNodes = async (bookId, nodeId) => {
  return httpInterceptor
    .get(`${url}/books/${bookId}/nodes/${nodeId}/nodes`)
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

export const getAllBooks = async (discipline, userBooks) => {
  const queryParams = new URLSearchParams({
    discipline: discipline,
    userBooks: userBooks,
  });

  return httpInterceptor
    .get(`${url}/books?${queryParams}`)
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

export const importAllBooks = books => {
  return httpInterceptor
    .post(`${url}/ptb/books/import`, books)
    .then(response => {
      return response?.data;
    })
    .catch(error => {
      Promise.reject({
        type: 'error',
        message: error,
      });
    });
};

export const getDisciplineBooks = async discipline => {
  const queryParams = new URLSearchParams({
    discipline: discipline,
  });

  try {
    const response = await httpInterceptor.get(`${url}/books?${queryParams}`);
    return response?.data;
  } catch (error) {
    console.log('Something went wrong', error);
    return Promise.reject({
      type: 'error',
      message: error,
    });
  }
};

export const saveUserBooks = (books, userid) => {
  return httpInterceptor
    .post(`${url}/settings/books?extUserId=` + userid, books)
    .then(response => {
      console.log('selected books', response);
      return response?.data;
    })
    .catch(error => {
      return Promise.reject({
        type: 'error',
        message: error,
      });
    });
};

export const getUserBooks = () => {
  return httpInterceptor
    .get(`${url}/settings/books`)
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

export const getUserBooksByID = bookId => {
  return httpInterceptor
    .get(`${url}/books/${bookId}`)
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
