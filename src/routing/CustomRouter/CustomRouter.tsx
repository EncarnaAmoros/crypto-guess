import { Navigate, RouteObject, useRoutes } from "react-router-dom";
import { ROUTES } from "../routes";
import { GeneralLayout } from "~/modules/Layout/components";
import useSessionStore from "~/modules/Auth/store/useSessionStore";
import { Home, UserAuthForm, Statistics } from "~/pages";

const PrivateRoutes: RouteObject[] = [
  {
    element: <GeneralLayout />,
    children: [
      { path: ROUTES.HOME, element: <Home /> },
      { path: ROUTES.STATISTICS, element: <Statistics /> },
    ],
  },
  { path: "*", element: <Navigate to={ROUTES.HOME} replace /> },
];

const PublicRoutes: RouteObject[] = [
  {
    children: [
      {
        path: ROUTES.AUTH_FORM,
        element: <UserAuthForm />,
      },
    ],
  },
  { path: "*", element: <Navigate to={ROUTES.AUTH_FORM} replace /> },
];

const CustomRouter = () => {
  const isAuth = useSessionStore((state) => state.session);
  const routes = isAuth ? PrivateRoutes : PublicRoutes;

  return useRoutes(routes);
};

export default CustomRouter;
