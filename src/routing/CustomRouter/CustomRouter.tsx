import { Navigate, RouteObject, useRoutes } from "react-router-dom";
import { ROUTES } from "../routes";
import { GeneralLayout } from "~/modules/Layout/components";
import { LAYOUT_TYPE } from "~/modules/Layout/constants/layout";
import { Home, BTCGuessDemo } from "~/pages";

const Routes: RouteObject[] = [
  {
    element: <GeneralLayout layoutType={LAYOUT_TYPE.CENTERED} />,
    children: [{ path: ROUTES.HOME, element: <Home /> }],
  },
  {
    element: <GeneralLayout />,
    children: [{ path: ROUTES.BTC_GUESS, element: <BTCGuessDemo /> }],
  },
  { path: "*", element: <Navigate to={ROUTES.HOME} replace /> },
];

const CustomRouter = () => {
  return useRoutes(Routes);
};

export default CustomRouter;
