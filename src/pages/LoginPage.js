import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import User from '../entities/User.Entity';
import { FormattedMessage } from 'react-intl';

// Login and session logic goes here.
const LoginPage = () => {
  const { isAuthenticated, user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [storedFamilyName, setStoredFamilyName] = useState('');
  const [storedEmailAddress, setStoredEmailAddress] = useState('');

  useEffect(() => {
    const familyName = sessionStorage.getItem('familyName');
    const emailAddress = sessionStorage.getItem('emailAddress');

    setStoredFamilyName(familyName || '');
    setStoredEmailAddress(emailAddress || '');
  }, []);

  useEffect(() => {
    document.title = 'Pearson Sign In';
  }, []);

  const handleLogin = () => {
    const newUser = new User();
    newUser.name = storedFamilyName;
    newUser.email = storedEmailAddress;
    login(newUser);
    navigate('/welcomescreen');
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <button onClick={logout}>
            <FormattedMessage id="logoutButtonText" />
          </button>
          <div>
            <FormattedMessage id="userNameLabel" />: {user.name}
          </div>
          <div>
            <FormattedMessage id="emailLabel" />: {user.email}
          </div>
        </>
      ) : (
        <button onClick={handleLogin}>
          <FormattedMessage id="loginButtonText" />
        </button>
      )}
    </>
  );
};

export default LoginPage;
