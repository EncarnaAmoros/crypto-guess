import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useIntl } from "react-intl";

import styles from "./InfoDialog.module.scss";

interface InfoDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

const InfoDialog = ({ open, onClose, title, message }: InfoDialogProps) => {
  const intl = useIntl();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="info-dialog-title"
      aria-describedby="info-dialog-description"
      className={styles.infoDialog}
      maxWidth="sm"
      fullWidth
    >
      {title && <DialogTitle id="info-dialog-title">{title}</DialogTitle>}

      <DialogContent>
        <Typography id="info-dialog-description" variant="body1">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" autoFocus>
          {intl.formatMessage({ id: "accept" })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoDialog;
