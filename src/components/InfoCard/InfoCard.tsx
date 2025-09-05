import { ReactElement } from "react";
import { Card, Typography } from "@mui/material";
import classNames from "classnames";

import styles from "./InfoCard.module.scss";

interface InfoCardProps {
  className?: string;
  icon?: ReactElement;
  title: ReactElement | string;
  text: ReactElement | string;
}

const InfoCard = ({ className, icon, title, text }: InfoCardProps) => {
  return (
    <Card variant="outlined" className={classNames(styles.infoCard, className)}>
      <div className={styles.infoCard__title}>
        {icon && <div className={styles.infoCard__titleIcon}>{icon}</div>}
        <Typography variant="h4" className={styles.infoCard__titleText}>
          {title}
        </Typography>
      </div>
      <Typography variant="h4" className={styles.infoCard__text}>
        {text}
      </Typography>
    </Card>
  );
};

export default InfoCard;
