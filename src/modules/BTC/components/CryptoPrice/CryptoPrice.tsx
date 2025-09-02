import { CURRENCY } from "~/modules/BTC/types/cryptoData";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import { CircularProgress } from "@mui/material";
import { InfoCard } from "~/components";

import styles from "./CryptoPrice.module.scss";

interface CryptoPriceProps {
  cryptoName: string;
  price: number;
  currency: CURRENCY;
  loading?: boolean;
}

const CryptoPrice = ({
  cryptoName,
  price,
  currency,
  loading,
}: CryptoPriceProps) => {
  return (
    <InfoCard
      className={styles.cryptoPrice}
      icon={<CurrencyBitcoinIcon />}
      text={
        loading ? (
          <div>
            {cryptoName}: <CircularProgress size={24} /> {currency}
          </div>
        ) : (
          `${cryptoName}: ${price} ${currency}`
        )
      }
    />
  );
};

export default CryptoPrice;
