import httpInterceptor from "../httpHelper/httpHelper";

const url = process.env.REACT_APP_API_URL

const getAllDisciplines = async () => {
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

export default getAllDisciplines;
