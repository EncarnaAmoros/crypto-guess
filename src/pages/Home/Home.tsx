import { useEffect, useState } from "react";
import { CURRENCY } from "~/modules/BTC/types/cryptoData";
import { getBTCPrice } from "~/modules/BTC/service/CryptoService";
import { BetScore } from "~/modules/User/components";
import { CryptoPrice } from "~/modules/BTC/components";

import styles from "./Home.module.scss";

const Home = () => {
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getBTCPrice().then((price) => {
      setTimeout(() => {
        setPrice(price);
        setLoading(false);
      }, 4000);
    });
  }, []);

  return (
    <div className={styles.home}>
      <div className={styles.home__infoContainer}>
        <BetScore score={0} />
        <CryptoPrice
          cryptoName="Bitcoin"
          price={price}
          currency={CURRENCY.USD}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Home;
