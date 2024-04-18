import axios from 'axios';

const httpInterceptor = axios.create({
  headers: {
    'x-requested-with': 'XMLHttpRequest',
  },
});

export default httpInterceptor;

httpInterceptor.interceptors.request.use(
  config => {
    const tokenExpiry = sessionStorage.getItem('tokenExpiry');
    if (tokenExpiry) {
      const expiryDate = new Date(tokenExpiry);

      const now = new Date();
      if (now >= expiryDate) {
        window.piSession.logout();
      }
    }

    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers['x-authorization'] = token;
    }
    return config;
  },
  error => {
    console.log('Failed to get active session');
    Promise.reject(error);
  }
);
