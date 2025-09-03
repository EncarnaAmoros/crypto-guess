import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { CURRENCY } from "~/modules/Bets/types/currency";
import useBetStore from "~/modules/Bets/store/useBetStore";
import useGeneralLayoutStore from "~/modules/Layout/hooks/useGeneralLayoutStore";
import { getBTCPrice as getBTCPriceService } from "~/modules/Bets/service/CryptoService";
import { CryptoPrice, UserBetScore } from "~/modules/Bets/components";
import { InfoDialog } from "~/components";

import styles from "./Home.module.scss";

const Home = () => {
  const [loadingBTCPrice, setLoadingBTCPrice] = useState<boolean>(true);

  const { generalError, setGeneralError } = useGeneralLayoutStore(
    useShallow((state) => ({
      generalError: state.generalError,
      setGeneralError: state.setGeneralError,
    }))
  );
  const { bitcoinPrice, setBitcoinPrice } = useBetStore(
    useShallow((state) => ({
      bitcoinPrice: state.bitcoinPrice,
      setBitcoinPrice: state.setBitcoinPrice,
    }))
  );

  const getBTCPrice = useCallback(async () => {
    setLoadingBTCPrice(true);
    const data = await getBTCPriceService();
    if (data) {
      setBitcoinPrice(data);
    }
    setLoadingBTCPrice(false);
  }, [setBitcoinPrice]);

  useEffect(() => {
    getBTCPrice();
  }, [getBTCPrice]);

  return (
    <div className={styles.home}>
      <div className={styles.home__infoContainer}>
        <UserBetScore />
        <CryptoPrice
          cryptoName="Bitcoin"
          price={bitcoinPrice}
          currency={CURRENCY.USD}
          loading={loadingBTCPrice}
        />
      </div>
      <InfoDialog
        open={!!generalError}
        onClose={() => setGeneralError("")}
        message={generalError}
      />
    </div>
  );
};

export default Home;
