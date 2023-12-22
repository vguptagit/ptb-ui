import './styles/App.scss';

import AppRoutes from './routes/Router';
import { IntlProvider } from "react-intl";
import { initLocale, localeMessages } from './utils/localization/Localization';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

function App() {
  return (
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
  );
}

export default App;