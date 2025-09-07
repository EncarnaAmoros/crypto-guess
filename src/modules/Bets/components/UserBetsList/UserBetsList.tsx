import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
} from "@mui/material";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "~/routing/routes";
import useBetStore from "~/modules/Bets/store/useBetStore";
import { CRYPTO_BET, BET_RESULT } from "~/modules/Bets/constants/bets";
import { UserBet } from "~/modules/Bets/types/userBets";
import styles from "./UserBetsList.module.scss";

const UserBetsList = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const userBets = useBetStore((state) => state.userBets);

  const getBetTypeLabel = (bet: CRYPTO_BET) => {
    return bet === CRYPTO_BET.UP ? "↗️ UP" : "↘️ DOWN";
  };

  const getSuccessChip = (result: BET_RESULT | null) => {
    if (!result) {
      return (
        <Chip
          label={intl.formatMessage({ id: "bet.status.pending" })}
          color="warning"
          variant="outlined"
          size="small"
        />
      );
    }

    switch (result) {
      case BET_RESULT.SUCCESS:
        return (
          <Chip
            label={intl.formatMessage({ id: "bet.status.success" })}
            color="success"
            variant="filled"
            size="small"
          />
        );
      case BET_RESULT.FAILURE:
        return (
          <Chip
            label={intl.formatMessage({ id: "bet.status.failed" })}
            color="error"
            variant="filled"
            size="small"
          />
        );
      case BET_RESULT.TIE:
        return (
          <Chip
            label={intl.formatMessage({ id: "bet.status.tie" })}
            color="info"
            variant="filled"
            size="small"
          />
        );
      default:
        return (
          <Chip
            label={intl.formatMessage({ id: "bet.status.pending" })}
            color="warning"
            variant="outlined"
            size="small"
          />
        );
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString(intl.locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.userBetsList}>
      <TableContainer
        component={Paper}
        className={styles.userBetsList__container}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {intl.formatMessage({ id: "bet.table.date" })}
              </TableCell>
              <TableCell>
                {intl.formatMessage({ id: "bet.table.bet" })}
              </TableCell>
              <TableCell align="right">
                {intl.formatMessage({ id: "bet.table.start.price" })}
              </TableCell>
              <TableCell align="right">
                {intl.formatMessage({ id: "bet.table.end.price" })}
              </TableCell>
              <TableCell align="center">
                {intl.formatMessage({ id: "bet.table.status" })}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userBets.map((bet: UserBet) => (
              <TableRow key={bet.id} className={styles.userBetsList__row}>
                <TableCell>{formatDate(bet.createdAt)}</TableCell>
                <TableCell>
                  <span className={styles.userBetsList__betType}>
                    {getBetTypeLabel(bet.bet)}
                  </span>
                </TableCell>
                <TableCell align="right">
                  <span className={styles.userBetsList__startPrice}>
                    $
                    {bet.cryptoStartPrice.toLocaleString(intl.locale, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </TableCell>
                <TableCell align="right">
                  <span className={styles.userBetsList__endPrice}>
                    {bet.cryptoEndPrice
                      ? `$${bet.cryptoEndPrice.toLocaleString(intl.locale, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : intl.formatMessage({ id: "bet.table.pending" })}
                  </span>
                </TableCell>
                <TableCell align="center">
                  {getSuccessChip(bet.result)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {userBets.length === 0 && (
          <div className={styles.userBetsList__empty}>
            <div className={styles.userBetsList__emptyMessage}>
              <div>
                {intl.formatMessage({ id: "bet.table.empty.message.line1" })}
              </div>
              <div>
                {intl.formatMessage({ id: "bet.table.empty.message.line2" })}
              </div>
            </div>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={() => navigate(ROUTES.HOME)}
              className={styles.userBetsList__emptyButton}
            >
              {intl.formatMessage({ id: "bet.table.empty.action" })}
            </Button>
          </div>
        )}
      </TableContainer>
    </div>
  );
};

export default UserBetsList;
