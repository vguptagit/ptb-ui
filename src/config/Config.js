import UiConfigData from "./UiConfigData";


const setConfiguration = () => {
    const env = process.env.NODE_ENV || 'dev';
    const basePath = process.env.REACT_APP_BASEPATH || '';

    console.log(`ENVIRONMENT "${env}" ~~~ `, process.env);

    const configData = new UiConfigData();
    configData.minFrequency = 0.5;

    if (process.env.REACT_APP_APIPATH) {
        configData.apiUrl = process.env.REACT_APP_APIPATH;
    } else if (env === 'dev') {
        configData.apiUrl = 'http://localhost:8080/api';
    } else if (env === 'prod') {
        configData.apiUrl = 'https://myapp.herokuapp.com/api';
    }

    configData.basePath = basePath;

    return configData;
};

const config = setConfiguration();

export default config;




