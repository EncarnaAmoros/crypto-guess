import { ReactElement } from "react";
import { Card, Typography } from "@mui/material";
import classNames from "classnames";

import styles from "./InfoCard.module.scss";

interface InfoCardProps {
  className?: string;
  icon?: ReactElement;
  text?: ReactElement | string;
}

const InfoCard = ({ className, icon, text }: InfoCardProps) => {
  return (
    <Card variant="outlined" className={classNames(styles.infoCard, className)}>
      {icon && <div className={styles.infoCard__icon}>{icon}</div>}
      <Typography variant="h4" className={styles.cryptoPrice__name}>
        {text}
      </Typography>
    </Card>
  );
};

export default InfoCard;
