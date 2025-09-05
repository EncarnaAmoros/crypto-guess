import { useEffect } from "react";
import { useIntl } from "react-intl";
import { GET_BTC_PRICE_URL } from "~/modules/Bets/constants/bets";
import useBetStore from "~/modules/Bets/store/useBetStore";
import useGeneralLayoutStore from "~/modules/Layout/hooks/useGeneralLayoutStore";

// To simplify the project, this is not a real web socket streaming the price
// It is a simple fetch that is called every 15 seconds
// In a real project, this would be a web socket streaming the price
// And it would be handle by a backend to not have an error from the API we would call
const useBTCPrice = (intervalMs = 15000) => {
  const intl = useIntl();

  const setBitcoinPrice = useBetStore((state) => state.setBitcoinPrice);
  const setGeneralError = useGeneralLayoutStore(
    (state) => state.setGeneralError
  );

  useEffect(() => {
    let isMounted = true;

    const fetchPrice = async () => {
      try {
        const response = await fetch(GET_BTC_PRICE_URL);
        const data = await response.json();

        if (isMounted) {
          setBitcoinPrice(data.bitcoin.usd.toFixed(2));
        }
      } catch {
        if (isMounted) {
          setGeneralError(intl.formatMessage({ id: "general.error" }));
        }
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, intervalMs);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [intl, setBitcoinPrice, setGeneralError, intervalMs]);
};

export default useBTCPrice;
