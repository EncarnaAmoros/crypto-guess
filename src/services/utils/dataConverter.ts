import { objectToCamel, objectToSnake } from "ts-case-convert";

const isObject = <T>(value: T): value is T => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

export const deepConvertToCamelCase = <T>(payload: T): T => {
  if (Array.isArray(payload)) {
    return payload.map((item) => deepConvertToCamelCase(item)) as unknown as T;
  } else if (isObject(payload)) {
    return objectToCamel(payload as object) as unknown as T;
  }
  return payload;
};

export const convertToCamelCase = <T>(payload: T): T => {
  return deepConvertToCamelCase(payload);
};

export const deepConvertToSnakeCase = <T>(payload: T): T => {
  if (Array.isArray(payload)) {
    return payload.map((item) => deepConvertToSnakeCase(item)) as unknown as T;
  } else if (isObject(payload)) {
    return objectToSnake(payload as object) as unknown as T;
  }
  return payload;
};
