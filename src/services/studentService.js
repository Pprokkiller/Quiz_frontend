import api from "./api";

// Get logged-in student's dashboard data
export const getStudentDashboard = async () => {

    const response = await api.get("/students/dashboard");

    return response.data;
};