/**
 * Type-safe error and warning definitions.
 * Using Enums for ErrorCodes ensures strict consistency and discoverability across the stack.
 */
export enum ErrorCode {
  INVALID_DTO_IN = 'invalidDtoIn',
  UNSUPPORTED_KEYS = 'unsupportedKeys',
  BUSINESS_ERROR = 'businessError',
  INTERNAL_SERVER_ERROR = 'internalServerError',
}

export type ValidationWarning = {
  type: 'Warning';
  code: ErrorCode.UNSUPPORTED_KEYS;
  message: string;
  parameters: {
    unsupportedKeyList: string[];
  };
};

export type AppErrorResponse = {
  type: 'Error';
  code: ErrorCode;
  message: string;
  parameters: Record<string, unknown>;
};

export type ValidationErrorResponse = AppErrorResponse & {
  code: ErrorCode.INVALID_DTO_IN;
  parameters: {
    invalidTypeKeyMap: Record<string, string>;
    invalidValueKeyMap: Record<string, string>;
    missingKeyMap: Record<string, string>;
  };
};

export type AppError = {
  isAppError: true;
  status: number;
  response: AppErrorResponse;
};
