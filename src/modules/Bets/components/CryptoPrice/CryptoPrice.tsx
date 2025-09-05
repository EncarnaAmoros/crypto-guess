import { useIntl } from "react-intl";
import { CircularProgress } from "@mui/material";
import { CurrencyBitcoin as CurrencyBitcoinIcon } from "@mui/icons-material";
import InfoCard from "~/components/InfoCard/InfoCard";
import { CURRENCY } from "~/modules/Bets/constants/currency";
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
  const intl = useIntl();
  const formatedPrice = parseFloat(price.toFixed(2)).toLocaleString(
    intl.locale,
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  );

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
            {`${formatedPrice} ${currency}`}
          </div>
        )
      }
    />
  );
};

export default CryptoPrice;
