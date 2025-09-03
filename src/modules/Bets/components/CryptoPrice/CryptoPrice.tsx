import { CURRENCY } from "~/modules/Bets/types/currency";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import { CircularProgress } from "@mui/material";
import { InfoCard } from "~/components";

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
