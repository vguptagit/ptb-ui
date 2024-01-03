import './styles/App.css';

import AppRoutes from './routes/Router';
import { IntlProvider } from "react-intl";
import { initLocale, localeMessages } from './utils/localization/Localization';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <AuthProvider>
        <AppProvider>
          <IntlProvider locale={initLocale} messages={localeMessages}>
            <div className="App">
              <div>
                {AppRoutes}
              </div>
            </div>
          </IntlProvider>
        </AppProvider>
      </AuthProvider>
      <ToastContainer />
    </>
  );
}

export default App;