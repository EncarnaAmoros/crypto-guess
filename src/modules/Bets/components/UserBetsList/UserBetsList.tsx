import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { useIntl } from "react-intl";
import useBetStore from "~/modules/Bets/store/useBetStore";
import { CRYPTO_BET } from "~/modules/Bets/constants/bets";
import { UserBet } from "~/modules/Bets/types/userBets";
import styles from "./UserBetsList.module.scss";

const UserBetsList = () => {
  const intl = useIntl();
  const userBets = useBetStore((state) => state.userBets);


  const getBetTypeLabel = (bet: CRYPTO_BET) => {
    return bet === CRYPTO_BET.UP ? "↗️ UP" : "↘️ DOWN";
  };

  const getSuccessChip = (success: boolean | undefined) => {
    if (success === undefined) {
      return (
        <Chip
          label={intl.formatMessage({ id: "bet.status.pending" })}
          color="warning"
          variant="outlined"
          size="small"
        />
      );
    }
    return (
      <Chip
        label={
          success
            ? intl.formatMessage({ id: "bet.status.success" })
            : intl.formatMessage({ id: "bet.status.failed" })
        }
        color={success ? "success" : "error"}
        variant="filled"
        size="small"
      />
    );
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
      <TableContainer component={Paper} className={styles.userBetsList__container}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {intl.formatMessage({ id: "bet.table.date" })}
              </TableCell>
              <TableCell>
                {intl.formatMessage({ id: "bet.table.type" })}
              </TableCell>
              <TableCell align="right">
                {intl.formatMessage({ id: "bet.table.price" })}
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
                  <span className={styles.userBetsList__price}>
                    ${bet.cryptoPrice.toLocaleString(intl.locale, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </TableCell>
                <TableCell align="center">
                  {getSuccessChip(bet.success)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {userBets.length === 0 && (
          <div className={styles.userBetsList__empty}>
            {intl.formatMessage({ id: "bet.table.empty" })}
          </div>
        )}
      </TableContainer>
    </div>
  );
};

export default UserBetsList;
