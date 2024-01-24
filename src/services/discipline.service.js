import httpInterceptor from "../httpHelper/httpHelper";

const url = 'http://localhost:8080' //need to make this configurable

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