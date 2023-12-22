import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import User from "../entities/User.Entity";

const AuthContext = createContext({
    isAuthenticated: false,
    user: null,
    login: () => { },
    logout: () => { },
});


export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(new User());
    const navigate = useNavigate();

    const login = (user) => {
        setIsAuthenticated(true);
        setUser(user);
        console.log("setIsAuthenticated", isAuthenticated);
    }
    const logout = () => {
        setIsAuthenticated(false);
        console.log("setIsAuthenticated", isAuthenticated);
        navigate('/login');
    }
    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}

