export enum NOTIFICATION_SEVERITY {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
  WARNING = "warning",
}

export interface NotificationMessage {
  message: string | null;
  severity: NOTIFICATION_SEVERITY;
  autoHideDuration?: number;
}
