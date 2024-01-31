import config from "../config/Config";
import httpInterceptor from "../httpHelper/httpHelper";

const getAllDisciplines = async () => {
    try {
        const response = await httpInterceptor.get(`http://localhost:8080/disciplines`);
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

export default getAllDisciplines;
