import { CURRENCY } from "~/modules/Bets/types/currency";
import useBetStore from "~/modules/Bets/store/useBetStore";
import useBTCPrice from "~/modules/Bets/service/useCryptoStream";
import { CryptoPrice } from "~/modules/Bets/components";

const BitcoinPrice = () => {
  useBTCPrice();

  const bitcoinPrice = useBetStore((state) => state.bitcoinPrice);

  return (
    <CryptoPrice
      cryptoName="Bitcoin"
      price={bitcoinPrice}
      currency={CURRENCY.USD}
      loading={!bitcoinPrice}
    />
  );
};

export default BitcoinPrice;
