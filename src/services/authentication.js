// authService.js

import httpInterceptor from '../httpHelper/httpHelper';

const apiUrl = `${process.env.REACT_APP_API_URL}/auth`; // Assuming you have your API URL defined in environment variables

const callLoginEndpoint = async token => {
  try {
    const config = {
      headers: {
        AccessToken: token,
        UserId: sessionStorage.getItem('userId'),
        Accept: 'application/json',
      },
    };

    const response = await httpInterceptor.get(apiUrl, config);
    console.log('Login Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login Error:', error);
    throw {
      type: 'error',
      message: error,
    };
  }
};

export default callLoginEndpoint;
