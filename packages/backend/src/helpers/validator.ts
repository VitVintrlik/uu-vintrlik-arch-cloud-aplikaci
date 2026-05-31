import { AnyZodObject } from 'zod';

import { ErrorCode, ValidationWarning, AppError } from './types.js';

/**
 * We leverage Zod to guarantee data integrity at the system boundary.
 * This utility provides granular feedback to improve the consumer experience
 * while keeping ABLs clean of repetitive defensive checks.
 */
export function validateDtoIn<T>(
  schema: AnyZodObject,
  dtoIn: unknown,
): { data: T; warnings: ValidationWarning[] } {
  const warnings: ValidationWarning[] = [];

  const isObject = typeof dtoIn === 'object' && dtoIn !== null && !Array.isArray(dtoIn);
  const input = isObject ? (dtoIn as Record<string, unknown>) : {};

  const schemaKeys = Object.keys(schema.shape);
  const dtoInKeys = Object.keys(input);
  const unsupportedKeys = dtoInKeys.filter((key) => !schemaKeys.includes(key));

  if (unsupportedKeys.length > 0) {
    warnings.push({
      type: 'Warning',
      code: ErrorCode.UNSUPPORTED_KEYS,
      message: 'DtoIn contains unsupported keys.',
      parameters: { unsupportedKeyList: unsupportedKeys },
    });
  }

  const result = schema.safeParse(dtoIn);

  if (!result.success) {
    const parameters = result.error.errors.reduce(
      (acc, issue) => {
        const path = issue.path.join('.');

        if (issue.code === 'invalid_type' && issue.received === 'undefined') {
          acc.missingKeyMap[path] = 'required';
        } else if (issue.code === 'invalid_type') {
          acc.invalidTypeKeyMap[path] = `expected ${issue.expected}, received ${issue.received}`;
        } else {
          acc.invalidValueKeyMap[path] = issue.message;
        }

        return acc;
      },
      {
        invalidTypeKeyMap: {} as Record<string, string>,
        invalidValueKeyMap: {} as Record<string, string>,
        missingKeyMap: {} as Record<string, string>,
      },
    );

    const appError: AppError = {
      isAppError: true,
      status: 400,
      response: {
        type: 'Error',
        code: ErrorCode.INVALID_DTO_IN,
        message: 'DtoIn is not valid.',
        parameters,
      },
    };

    throw appError;
  }

  return { data: result.data as T, warnings };
}

/**
 * Facilitates the consistent propagation of business policy violations
 * without cluttering logic layers with HTTP-specific details.
 */
export function throwBusinessError(
  message: string,
  parameters: Record<string, unknown> = {},
): never {
  const appError: AppError = {
    isAppError: true,
    status: 400,
    response: {
      type: 'Error',
      code: ErrorCode.BUSINESS_ERROR,
      message,
      parameters,
    },
  };
  throw appError;
}
