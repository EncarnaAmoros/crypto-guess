import { useIntl } from "react-intl";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { SORT_ORDER, BASIC_SORT_FIELD } from "~/services/constants/dbService";
import { BET_SORT_FIELD } from "~/modules/Bets/constants/bets";
import { CURRENCY } from "~/modules/Bets/constants/currency";
import { UserBet } from "~/modules/Bets/types/userBets";
import useUserBetsList from "./useUserBetsList";
import UserBetsListEmptyState from "./components/UserBetsListEmptyState/UserBetsListEmptyState";
import BetResultTag from "./components/BetResultTag/BetResultTag";

import styles from "./UserBetsList.module.scss";

interface UserBetsListProps {
  currency?: CURRENCY;
}

const UserBetsList = ({ currency = CURRENCY.USD }: UserBetsListProps) => {
  const intl = useIntl();
  const {
    userBets,
    getBetTypeLabel,
    formatPrice,
    formatDate,
    sortField,
    sortOrder,
    handleSort,
  } = useUserBetsList({ currency });

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
                <TableSortLabel
                  active={sortField === BASIC_SORT_FIELD.UPDATED_AT}
                  direction={
                    sortField === BASIC_SORT_FIELD.UPDATED_AT
                      ? sortOrder
                      : SORT_ORDER.DESC
                  }
                  onClick={() => handleSort(BASIC_SORT_FIELD.UPDATED_AT)}
                >
                  {intl.formatMessage({ id: "bet.table.date" })}
                </TableSortLabel>
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
                <TableSortLabel
                  active={sortField === BET_SORT_FIELD.RESULT}
                  direction={
                    sortField === BET_SORT_FIELD.RESULT
                      ? sortOrder
                      : SORT_ORDER.DESC
                  }
                  onClick={() => handleSort(BET_SORT_FIELD.RESULT)}
                >
                  {intl.formatMessage({ id: "bet.table.status" })}
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {userBets.map((bet: UserBet) => (
              <TableRow key={bet.id} className={styles.userBetsList__row}>
                <TableCell>
                  {formatDate(bet.createdAt || bet.updatedAt)}
                </TableCell>
                <TableCell>
                  <span className={styles.userBetsList__betType}>
                    {getBetTypeLabel(bet.bet)}
                  </span>
                </TableCell>
                <TableCell align="right">
                  <span className={styles.userBetsList__startPrice}>
                    {formatPrice(bet.cryptoStartPrice)}
                  </span>
                </TableCell>
                <TableCell align="right">
                  <span className={styles.userBetsList__endPrice}>
                    {formatPrice(bet.cryptoEndPrice)}
                  </span>
                </TableCell>
                <TableCell align="center">
                  <BetResultTag result={bet.result} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {userBets.length === 0 && <UserBetsListEmptyState />}
      </TableContainer>
    </div>
  );
};

export default UserBetsList;
