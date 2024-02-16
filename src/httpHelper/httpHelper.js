import axios from "axios";

const httpInterceptor = axios.create({
    headers:{
        "x-requested-with": "XMLHttpRequest",
    }
});

export default httpInterceptor;

httpInterceptor.interceptors.request.use(
    config =>{
        const token = sessionStorage.getItem("token");
        if(token){
            config.headers['x-authorization'] =  token; 
        } 
        return config;
    }, 
    error => {
        console.log("Failed to get active session");
        Promise.reject(error);
    }
)