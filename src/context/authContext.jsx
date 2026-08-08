import {
    createContext,
    useContext,
    useState
} from "react";

import {
    loginUser,
    registerUser,
    logoutUser,
    getStoredUser
} from "../services/authService";


const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(getStoredUser());


    const login = async (email, password) => {

        const data = await loginUser({
            email,
            password
        });

        setUser(data.user);

        return data;
    };


    const register = async (userData) => {

        const data = await registerUser(userData);

        return data;
    };


    const logout = () => {

        logoutUser();

        setUser(null);
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};