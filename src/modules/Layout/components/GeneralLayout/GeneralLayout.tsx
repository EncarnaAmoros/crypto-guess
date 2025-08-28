import { Outlet } from "react-router-dom";
import { LAYOUT_TYPE } from "~/modules/Layout/constants/layout";
import classNames from "classnames";

import styles from "./GeneralLayout.module.scss";

interface GeneralLayoutProps {
  layoutType?: LAYOUT_TYPE;
}

const GeneralLayout = ({ layoutType }: GeneralLayoutProps) => {
  return (
    <div
      className={classNames(styles.generalLayout, {
        [styles["generalLayout--centered"]]:
          layoutType === LAYOUT_TYPE.CENTERED,
      })}
    >
      <div className={styles.generalLayout__content}>
        <Outlet />
      </div>
    </div>
  );
};

export default GeneralLayout;
