import { useLocation, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Home as HomeIcon,
  Analytics as AnalyticsIcon,
} from "@mui/icons-material";
import { ROUTES } from "~/routing/routes";
import styles from "./MainSideBar.module.scss";

const APP_NAME = "PlayCrypto";

const MainSideBar = () => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "dashboard",
      label: intl.formatMessage({ id: "navigation.dashboard" }),
      icon: <HomeIcon />,
      route: ROUTES.HOME,
    },
    {
      key: "statistics",
      label: intl.formatMessage({ id: "navigation.statistics" }),
      icon: <AnalyticsIcon />,
      route: ROUTES.STATISTICS,
    },
  ];

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  const isActive = (route: string) => {
    return location.pathname === `${route}`;
  };

  return (
    <div className={styles.mainSideBar}>
      <header className={styles.mainSideBar__header}>
        <img
          className={styles.mainSideBar__icon}
          src="/bitcoin-icon.svg"
          alt="Bitcoin Icon"
        />
        <div className={styles.mainSideBar__title}>
          {APP_NAME.toUpperCase()}
        </div>
      </header>

      <nav className={styles.mainSideBar__nav}>
        <List className={styles.mainSideBar__navList}>
          {menuItems.map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.route)}
                className={`${styles.mainSideBar__navListItem} ${
                  isActive(item.route)
                    ? styles["mainSideBar__navListItem--active"]
                    : ""
                }`}
              >
                <ListItemIcon className={styles.mainSideBar__navListItemIcon}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  className={styles.mainSideBar__navListItemText}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </nav>
    </div>
  );
};

export default MainSideBar;
