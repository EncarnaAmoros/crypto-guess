import { Chip } from "@mui/material";
import { useIntl } from "react-intl";
import { BET_RESULT } from "~/modules/Bets/constants/bets";

interface BetResultTagProps {
  result: BET_RESULT | null;
}

const BetResultTag = ({ result }: BetResultTagProps) => {
  const intl = useIntl();

  if (!result) {
    return (
      <Chip
        label={intl.formatMessage({ id: "bet.status.pending" })}
        color="warning"
        size="small"
      />
    );
  }

  switch (result) {
    case BET_RESULT.SUCCESS:
      return (
        <Chip
          label={intl.formatMessage({ id: "bet.status.success" })}
          color="success"
          size="small"
        />
      );
    case BET_RESULT.FAILURE:
      return (
        <Chip
          label={intl.formatMessage({ id: "bet.status.failed" })}
          color="error"
          size="small"
        />
      );
    case BET_RESULT.TIE:
      return (
        <Chip
          label={intl.formatMessage({ id: "bet.status.tie" })}
          color="info"
          size="small"
        />
      );
    default:
      return (
        <Chip
          label={intl.formatMessage({ id: "bet.status.pending" })}
          color="warning"
          variant="outlined"
          size="small"
        />
      );
  }
};

export default BetResultTag;
