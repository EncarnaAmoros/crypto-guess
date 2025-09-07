import { useState, useEffect, useCallback } from "react";
import { useShallow } from "zustand/shallow";
import { useIntl } from "react-intl";
import { CRYPTO_BET, BET_SORT_FIELD } from "~/modules/Bets/constants/bets";
import { SORT_ORDER, BASIC_SORT_FIELD } from "~/services/constants/dbService";
import { CURRENCY } from "~/modules/Bets/constants/currency";
import useBetStore from "~/modules/Bets/store/useBetStore";
import { getUserBets } from "~/modules/Bets/service/betsService";
import useSessionStore from "~/modules/Auth/store/useSessionStore";
import { useErrorHandler } from "~/modules/Layout/hooks/useErrorHandler";

interface UseUserBetsListProps {
  currency: CURRENCY;
}

const useUserBetsList = ({ currency = CURRENCY.USD }: UseUserBetsListProps) => {
  const intl = useIntl();
  const { handleError } = useErrorHandler();

  const [sortOrder, setSortOrder] = useState<SORT_ORDER>(SORT_ORDER.DESC);
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState<
    BASIC_SORT_FIELD | BET_SORT_FIELD | undefined
  >(undefined);

  const session = useSessionStore((state) => state.session);
  const { userBets, setUserBets } = useBetStore(
    useShallow((state) => ({
      userBets: state.userBets,
      setUserBets: state.setUserBets,
    }))
  );

  const getBetTypeLabel = (bet: CRYPTO_BET) => {
    return bet === CRYPTO_BET.UP
      ? `↗️ ${intl.formatMessage({ id: "up" })}`
      : `↘️ ${intl.formatMessage({ id: "down" })}`;
  };

  const formatPrice = (price: number | null) => {
    if (!price) return intl.formatMessage({ id: "bet.table.pending" });

    return `${currency}${price.toLocaleString(intl.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const betDate = new Date(date);
    const diffInMs = now.getTime() - betDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInMinutes < 1) {
      return intl.formatMessage({ id: "time.just.now" });
    }

    if (diffInMinutes < 60) {
      return intl.formatMessage(
        { id: "time.minutes.ago" },
        { minutes: diffInMinutes }
      );
    }

    if (diffInHours < 24) {
      return intl.formatMessage(
        { id: "time.hours.ago" },
        { hours: diffInHours }
      );
    }

    return betDate.toLocaleDateString(intl.locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  };

  const fetchUserBets = useCallback(async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);

    const response = await getUserBets(session.user.id, sortField, sortOrder);

    if (response.error) {
      handleError(response.messageKey);
    } else {
      setUserBets(response.data);
    }

    setIsLoading(false);
  }, [session?.user?.id, sortField, sortOrder, handleError, setUserBets]);

  useEffect(() => {
    fetchUserBets();
  }, [fetchUserBets]);

  const handleSort = (field: BASIC_SORT_FIELD | BET_SORT_FIELD) => {
    if (sortField === field) {
      setSortOrder(
        sortOrder === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC
      );
    } else {
      setSortField(field);
      setSortOrder(SORT_ORDER.DESC);
    }
  };

  return {
    userBets,
    getBetTypeLabel,
    formatPrice,
    formatDate,
    sortField,
    sortOrder,
    handleSort,
    isLoading,
    intl,
  };
};

export default useUserBetsList;
