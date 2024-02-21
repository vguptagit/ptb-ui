import httpInterceptor from "../httpHelper/httpHelper";

const url = process.env.REACT_APP_API_URL

export const getAllDisciplines = async () => {
    try {
        const response = await httpInterceptor.get(`${url}/disciplines`);
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

export const getUserDisciplines = () => {
   
    return httpInterceptor
        .get(`${url}/settings/disciplines`)
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

export const saveUserDiscipline = (disciplines,userid) => {
   
    return httpInterceptor
        .post(`${url}/settings/disciplines?extUserId=`+ userid, disciplines)
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