import axios from "axios";

const httpInterceptor = axios.create({
    headers:{
        
    }
});

export default httpInterceptor;

httpInterceptor.interceptors.request.use(
    config =>{
        const token = localStorage.getItem("authToken");
        if(token){
            httpInterceptor.headers['Authorization'] = 'Bearer ' + token; 
        } 
        return config;
    }, 
    error => {
        console.log("Failed to get active session");
        Promise.reject(error);
    }
)