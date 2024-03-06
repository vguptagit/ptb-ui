import axios from "axios";

const httpInterceptor = axios.create({
    headers:{
        "x-requested-with": "XMLHttpRequest",
    }
});

export default httpInterceptor;

httpInterceptor.interceptors.request.use(
    config =>{
        const tokenExpiry = sessionStorage.getItem("tokenExpiry");
        console.log(tokenExpiry);
        if (tokenExpiry) {
            const expiryDate = new Date(tokenExpiry);
          
                const now = new Date();
                if (now >= expiryDate) {
                    window.piSession.logout();
                }
            }

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
);
httpInterceptor.interceptors.response.use(
    async response => {
        const newTokenExpiry = window.piSession.currentTokenExpiry();
        sessionStorage.setItem("tokenExpiry", newTokenExpiry);
      
        return response;
    },
    async error => {
        console.error("Error in API response:", error);
        return Promise.reject(error);
    }
);