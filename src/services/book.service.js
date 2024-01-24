import httpInterceptor from "../ajaxHelper/ajaxHelper";

const url = 'http://localhost:8080' //need to make this configurable

export const getAllBooks = () => {
    return httpInterceptor
        .get(`${url}/books`)
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

export const importAllBooks = (books) => {
    return httpInterceptor
        .post(`${url}/ptb/books/import`)
        .then((response) =>{
            return response?.data;
        })
        .catch((error)=>{
            Promise.reject({
                type: "error",
                message: error
            })
        })
}