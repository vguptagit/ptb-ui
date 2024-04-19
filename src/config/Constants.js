const prod = {
  url: {
    API_URL: 'https://myapp.herokuapp.com',
    AUTH_Success_URL: 'http://testbuilder.dev.pearsoncmg.com/login',
  },
  DEFAULT_LOCALE: 'en',
};

const dev = {
  url: {
    API_URL: 'http://local.dev-prsn.com:3000',
    AUTH_Success_URL: 'http://testbuilder.dev.pearsoncmg.com:3000/login',
  },
  DEFAULT_LOCALE: 'en',
};
export const config = process.env.NODE_ENV === 'development' ? dev : prod;
