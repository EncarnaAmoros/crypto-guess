import { ReactElement } from "react";
import { Card, Typography } from "@mui/material";
import classNames from "classnames";

import styles from "./BetCard.module.scss";

interface BetCardProps {
  className?: string;
  icon?: ReactElement;
  text?: ReactElement | string;
}

const BetCard = ({ className, icon, text }: BetCardProps) => {
  return (
    <Card variant="outlined" className={classNames(styles.infoCard, className)}>
      {icon && <div className={styles.infoCard__icon}>{icon}</div>}
      <Typography variant="h4" className={styles.cryptoPrice__name}>
        {text}
      </Typography>
    </Card>
  );
};

export default BetCard;
