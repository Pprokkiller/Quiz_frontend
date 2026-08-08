import api from "./api";

export const registerUser = async (userData) => {
    const response = await api.post("/auth/register", userData);

    return response.data;
};

export const loginUser = async (loginData) => {
    const response = await api.post("/auth/login", loginData);

    // Your backend returns the JWT as "token"
    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
    }

    // Store user information too
    if (response.data.user) {
        localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
        );
    }

    return response.data;
};

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const getStoredUser = () => {
    const user = localStorage.getItem("user");

    if (!user) {
        return null;
    }

    return JSON.parse(user);
};

export const getToken = () => {
    return localStorage.getItem("token");
};