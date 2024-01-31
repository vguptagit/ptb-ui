import config from "../config/Config";
import httpInterceptor from "../httpHelper/httpHelper";

const url = process.env.REACT_APP_API_URL

export const getAllDisciplines = () => {
    return httpInterceptor
        .get(`${url}/disciplines`)
        .then((response) =>{
            return response?.data;
        })
        .catch((error)=>{
            Promise.reject({
                type: "error",
                message : error
            })
        })
}