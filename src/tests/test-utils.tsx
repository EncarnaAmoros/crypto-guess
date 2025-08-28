import { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { render } from "@testing-library/react";
import englishMessages from "~/locales/en.json";

export const renderWithRouterProvider = (
  ui: ReactElement,
  { route = "/" } = {}
) => {
  return render(
    <IntlProvider locale="en" messages={englishMessages}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </IntlProvider>
  );
};

export const renderWithIntl = (ui: ReactElement) => {
  return render(
    <IntlProvider locale="en" messages={englishMessages}>
      {ui}
    </IntlProvider>
  );
};
