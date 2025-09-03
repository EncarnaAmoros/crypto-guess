import { useEffect } from "react";
import { useIntl } from "react-intl";
import useBetStore from "~/modules/Bets/store/useBetStore";
import useGeneralLayoutStore from "~/modules/Layout/hooks/useGeneralLayoutStore";

const GET_BTC_PRICE_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";

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
          setBitcoinPrice(data.bitcoin.usd);
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
