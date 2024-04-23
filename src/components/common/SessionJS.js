import { useEffect } from 'react';
import callLoginEndpoint from '../../services/authentication';
import { useAuth } from '../../context/AuthContext';

function SessionJS() {
  const url = process.env.REACT_APP_AUTH_Success_URL;
  const loginurl = process.env.REACT_APP_AUTH_Login_URL;

  const { setUserDetails, logout } = useAuth();

  useEffect(() => {
    console.log('sessionjs onmount');
    createScriptElement();
  }, []);

  // Flag to track whether getToken has already been called
  let tokenRequested = false;

  const createScriptElement = () => {
    const script = document.createElement('script');
    script.src = loginurl;
    script.id = 'pi_session';

    if (!document.getElementById('pi_session')) {
      document.body.insertBefore(script, document.body.firstChild);
    }

    script.onload = () => {
      try {
        iesMxSessioninitialize();
        console.log('LOGIN Session');
      } catch (error) {
        console.error('Error initializing session:', error);
      }
    };
  };

  const iesMxSessioninitialize = () => {
    if (window.piSession) {
      window.piSession.initialize('37r9t4VtxolfmvZhi9g25tQ6PxxwNPLT', {
        sessionIdleTimeoutSeconds: 3600,
        requireLogin: true,
        loginSuccessUrl: url,
      });
      window.piSession.monitorUserActivity(true);
      // Call getToken once after initialization
      if (!tokenRequested) {
        tokenRequested = true;
        iesMxSessionGetToken();
      }
    }
  };

  const iesMxSessionGetToken = () => {
    if (window.piSession) {
      window.piSession.getToken((status, token) => {
        sessionStorage.setItem('SmsUserId', window.piSession.smsUserId());
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userId', window.piSession.userId());
        sessionStorage.setItem('tokenExpiry', window.piSession.currentTokenExpiry());
        console.log('getToken:', status, token);
        if (status === 'success' && token) {
          // Set interval to check token expiry every minute
          const interval = setInterval(() => {
            if (window.piSession) {
              sessionStorage.setItem('tokenExpiry', window.piSession.currentTokenExpiry());
            }
          }, 60000); // 1 minute in milliseconds

          // Call the login endpoint function from authService.js
          callLoginEndpoint(token)
            .then(response => {
              console.log('Login successful:', response);
              sessionStorage.setItem('familyName', response.familyName);
              sessionStorage.setItem('givenName', response.givenName);
              sessionStorage.setItem('emailAddress', response.emailAddress);

              setUserDetails({
                lastname: response.familyName,
                email: response.emailAddress,
                firstname: response.givenName,
              });
            })
            .catch(error => {
              console.error('Error logging in:', error);
              if (error.message.response.status === 403) {
                logout();
              }
            });
        } else {
          console.error('Error getting token:', status);
        }
      });
    }
  };

  return null;
}

export default SessionJS;
