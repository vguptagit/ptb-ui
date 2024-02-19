import { createContext, useContext, useEffect, useState } from "react";
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
        window.piSession.logout();
        console.log("setIsAuthenticated", isAuthenticated);

      //  navigate('/logout');
    }
    useEffect(() => {        
        const familyName = sessionStorage.getItem('familyName') ;
        const emailAddress = sessionStorage.getItem('emailAddress') ;

        // If user details are available, log in the user directly and navigate to the welcome page
        if (familyName && emailAddress) {
            const newUser = new User(); 
            newUser.name = familyName; 
            newUser.email = emailAddress; 
            login(newUser);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}

