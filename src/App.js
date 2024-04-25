import './styles/App.css';

import AppRoutes from './routes/Router';
import { IntlProvider } from 'react-intl';
import { initLocale, localeMessages } from './utils/localization/Localization';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ToastContainer } from 'react-toastify';
import { DndProvider } from 'react-dnd';
import { MultiBackend, getBackendOptions } from '@minoru/react-dnd-treeview';
import SessionJS from './components/common/SessionJS';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <IntlProvider locale={initLocale} messages={localeMessages}>
        <AuthProvider>
          <SessionJS />
          <AppProvider>
            <DndProvider backend={MultiBackend} options={getBackendOptions()}>
              <div className="App">
                <div>{AppRoutes}</div>
              </div>
            </DndProvider>
          </AppProvider>
        </AuthProvider>
      </IntlProvider>
      <ToastContainer />
    </>
  );
}

export default App;
