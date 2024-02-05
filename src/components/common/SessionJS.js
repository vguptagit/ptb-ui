import axios from 'axios';
import { useEffect } from 'react';

function SessionJS() {
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
        "loginSuccessUrl": "http://testbuilder.dev.pearsoncmg.com:3000/login"
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
        console.log('alll' , window.piSession);
        console.log('getToken:', status, token);
        if (status === 'success' && token) {
          callLoginEndpoint(token);
        } else {
          console.error('Error getting token:', status);
        }
      });
    }
  };

  const callLoginEndpoint = (token) => {
    const apiUrl = 'http://localhost:8080/auth';
    const config = {
      headers: {
        'AccessToken': token,
        'UserId': window.piSession.userId(),
        'Accept': 'application/json'
      }
    };

    axios.get(apiUrl, config)
    .then(response => {
      console.log('Login successful:', response.data);
  
      // Set familyName and emailAddress to sessionStorage
      sessionStorage.setItem('familyName', response.data.familyName);
      sessionStorage.setItem('emailAddress', response.data.emailAddress);
  
        // Redirect to the desired URL after successful login
        if (response.data && response.data.success) {
          window.location.href = 'http://testbuilder.dev.pearsoncmg.com:3000/login';
        }
      })
      .catch(error => {
        console.error('Error logging in:', error);
      });
  };

  return null;
}

export default SessionJS;
