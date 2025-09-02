import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { messages as translationMessages } from "./locales/messages";
import { DEFAULT_LOCALE } from "~/locales/supportedLocales";
import { getBrowserLocale } from "~/locales/getLocale";
import CustomRouter from "~/routing/CustomRouter/CustomRouter";

import "./assets/css/global.scss";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#f5f5f5",
    },
  },
});

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
