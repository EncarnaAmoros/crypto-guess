import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";
import { messages as translationMessages } from "./locales/messages";
import { DEFAULT_LOCALE } from "~/locales/supportedLocales";
import { getBrowserLocale } from "~/locales/getLocale";
import CustomRouter from "~/routing/CustomRouter/CustomRouter";

import "./assets/css/global.scss";

const App = () => {
  const selectedLocale = getBrowserLocale();

  return (
    <IntlProvider
      defaultLocale={DEFAULT_LOCALE}
      locale={selectedLocale}
      messages={translationMessages[selectedLocale]}
    >
      <BrowserRouter>
        <CustomRouter />
      </BrowserRouter>
    </IntlProvider>
  );
};

export default App;
