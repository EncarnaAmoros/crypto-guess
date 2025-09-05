import { CURRENCY } from "~/modules/Bets/types/currency";
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
      icon={<CurrencyBitcoinIcon className={styles.cryptoPrice__icon} />}
      title={
        <div className={styles.cryptoPrice__priceLabel}>{cryptoName}:</div>
      }
      text={
        loading ? (
          <div>
            <CircularProgress size={24} /> {currency}
          </div>
        ) : (
          <div className={styles.cryptoPrice__price}>
            {`${price} ${currency}`}
          </div>
        )
      }
    />
  );
};

export default CryptoPrice;
