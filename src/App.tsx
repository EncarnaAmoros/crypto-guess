import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { DEFAULT_LOCALE } from "~/locales/supportedLocales";
import { getBrowserLocale } from "~/locales/getLocale";
import CustomRouter from "~/routing/CustomRouter/CustomRouter";
import { messages as translationMessages } from "~/locales/messages";
import { darkTheme } from "~/modules/Layout/themes/darkTheme";

import "./assets/css/global.scss";

const App = () => {
  const selectedLocale = getBrowserLocale();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <IntlProvider
        defaultLocale={DEFAULT_LOCALE}
        locale={selectedLocale}
        messages={translationMessages[selectedLocale]}
      >
        <BrowserRouter>
          <CustomRouter />
        </BrowserRouter>
      </IntlProvider>
    </ThemeProvider>
  );
};

export default App;
