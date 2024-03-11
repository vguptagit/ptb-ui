import axios from 'axios';
import { useEffect } from 'react';
import callLoginEndpoint from '../../services/authentication';

function SessionJS() {
  const url = process.env.REACT_APP_AUTH_Success_URL;
  const apiurl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    console.log("sessionjs onmount");
    createScriptElement();
  }, []);

  // Flag to track whether getToken has already been called
  let tokenRequested = false;

  const createScriptElement = () => {
    const script = document.createElement('script');
    script.src = "https://login-stg.pearson.com/v1/piapi-int/login/js/v2/session.js";
    script.id = 'pi_session';

    if (!document.getElementById('pi_session')) {
      document.body.insertBefore(script, document.body.firstChild);
    }

    script.onload = () => {
      try {
        iesMxSessioninitialize();
        console.log('LOGIN Session');
      } catch(error) {
        console.error('Error initializing session:', error);
      }
    };
  };

  const iesMxSessioninitialize = () => {
    if (window.piSession) {
      window.piSession.initialize("37r9t4VtxolfmvZhi9g25tQ6PxxwNPLT", {
        "sessionIdleTimeoutSeconds": 3600,
        "requireLogin": true,
        "loginSuccessUrl": url
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
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userId', window.piSession.userId());
        sessionStorage.setItem("tokenExpiry", window.piSession.currentTokenExpiry());
        console.log('getToken:', status, token);
        if (status === 'success' && token) {
          // Set interval to check token expiry every minute
          const interval = setInterval(() => {
            if (window.piSession) {
              sessionStorage.setItem("tokenExpiry", window.piSession.currentTokenExpiry());
            }
          }, 60000); // 1 minute in milliseconds

          // Call the login endpoint function from authService.js
          callLoginEndpoint(token)
            .then(response => {
              console.log('Login successful:', response);
              sessionStorage.setItem('familyName', response.familyName);
              sessionStorage.setItem('emailAddress', response.emailAddress);
            })
            .catch(error => {
              console.error('Error logging in:', error);
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
