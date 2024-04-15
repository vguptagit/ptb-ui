import { createContext, useContext, useEffect, useState } from 'react';
import User from '../entities/User.Entity';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(new User());

  const login = user => {
    setIsAuthenticated(true);
    setUser(user);
    console.log('setIsAuthenticated', isAuthenticated);
  };

  const logout = () => {
    setIsAuthenticated(false);
    // sessionStorage.removeItem('isAuthenticated');
    sessionStorage.clear();
    sessionStorage.removeItem("selectedDiscipline");
    sessionStorage.removeItem("selectedbookIds");
    window.piSession.logout();
    // navigate('/welcomescreen');
    console.log('setIsAuthenticated', isAuthenticated);
  };

  const setUserDetails = (user) => {
    setUser(user);
  }

  useEffect(() => {
    const familyName = sessionStorage.getItem('familyName');
    const emailAddress = sessionStorage.getItem('emailAddress');

    // If user details are available, log in the user directly and navigate to the welcome page
    if (familyName && emailAddress) {
      const newUser = new User();
      newUser.name = familyName;
      newUser.email = emailAddress;
      login(newUser);
    }
  }, []);

  return <AuthContext.Provider value={{ isAuthenticated, login, logout, user, setUserDetails }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {

  return useContext(AuthContext);
};
