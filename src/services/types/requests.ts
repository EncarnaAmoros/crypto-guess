export interface ServiceResponseError {
  error: true;
  messageKey: string;
}

export interface ServiceResponseSuccess<T> {
  error: false;
  data: T;
}

export type ServiceResponse<T> =
  | ServiceResponseSuccess<T>
  | ServiceResponseError;
