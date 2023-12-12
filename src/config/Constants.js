const prod = {
    url: {
        API_URL: 'https://myapp.herokuapp.com',
    },
    DEFAULT_LOCALE:'en'
};

const dev = {
    url: {
        API_URL: 'http://localhost:3000'
    },
    DEFAULT_LOCALE:'en'
};
export const config = process.env.NODE_ENV === 'development' ? dev : prod;