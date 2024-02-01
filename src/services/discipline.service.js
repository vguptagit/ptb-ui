import httpInterceptor from "../httpHelper/httpHelper";

const url = 'http://localhost:8080' //need to make this configurable

const getAllDisciplines = async () => {
    try {
        const response = await httpInterceptor.get(`https://testbuilder.dev.pearsoncmg.com/ptb/disciplines`);
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
