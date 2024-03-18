import httpInterceptor from "../httpHelper/httpHelper";

const url = process.env.REACT_APP_API_URL


export const getUserProfilesettings = () => {
   
    return httpInterceptor
        .get(`${url}/settings/questionmetadata`)
        .then((response) => {
            return response?.data;
        })
        .catch((error) => {
            return Promise.reject({
                type: "error",
                message: error
            });
        });
};
