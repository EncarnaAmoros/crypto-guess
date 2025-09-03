import { useIntl } from "react-intl";
import {
  Card,
  IconButton,
  Typography,
  ButtonGroup,
  Tooltip,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import useBetSection from "./useBetSection";

import styles from "./BetSection.module.scss";

const BetSection = () => {
  const intl = useIntl();

  const { betTextDescription, currentBetOnGoing } = useBetSection();

  return (
    <Card variant="outlined" className={styles.betSection}>
      <div className={styles.betSection__description}>
        <Typography variant="h6" className={styles.betSection__description}>
          {betTextDescription}
        </Typography>
      </div>
      <div className={styles.betSection__actions}>
        <ButtonGroup
          disableElevation
          variant="contained"
          aria-label="Disabled button group"
        >
          <Tooltip title={intl.formatMessage({ id: "bet.up.info" })}>
            <IconButton
              size="large"
              className={styles.betSection__betUp}
              aria-label={intl.formatMessage({ id: "bet.up.info" })}
              color="success"
              disabled={!!currentBetOnGoing}
            >
              <ArrowUpward />
            </IconButton>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: "bet.down.info" })}>
            <IconButton
              size="large"
              className={styles.betSection__betDown}
              aria-label={intl.formatMessage({ id: "bet.down.info" })}
              color="error"
              disabled={!!currentBetOnGoing}
            >
              <ArrowDownward />
            </IconButton>
          </Tooltip>
        </ButtonGroup>
      </div>
    </Card>
  );
};

export default BetSection;
