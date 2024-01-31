import httpInterceptor from "../httpHelper/httpHelper";

const url = process.env.REACT_APP_API_URL

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
        .post(`${url}/ptb/books/import`, books)
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