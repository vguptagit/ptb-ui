import './App.css';
import AppRoutes from './routes/Router';
import { IntlProvider} from "react-intl";
import { initLocale, localeMessages } from './utils/localization/Localization';

function App() {
  return (
    <IntlProvider locale={initLocale} messages={localeMessages}>
      {/* <FormattedMessage id="message.simple" />
      <FormattedMessage id="message.argument" values={{name: userName}} /> */}
      <div className="App">
        <div>
          {AppRoutes}
        </div>
      </div>
    </IntlProvider>
  );
}

export default App;