import { DEFAULT_LOCALE, SUPPORTED_LOCALES_LIST } from "~/locales/supportedLocales";

export const getBrowserLocale = () => {
  const languageMatch = navigator.languages.find((language) =>
    SUPPORTED_LOCALES_LIST.some((supportedLocale) =>
      language.toLowerCase().startsWith(supportedLocale)
    )
  );

  return languageMatch?.split("-")[0] ?? DEFAULT_LOCALE;
};
