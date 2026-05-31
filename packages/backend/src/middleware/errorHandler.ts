import { Request, Response, NextFunction } from 'express';

import { ErrorCode } from '../helpers/types.js';

/**
 * Centralizing error handling ensures a consistent API response structure regardless of the source.
 * It prevents sensitive internal state from leaking and guarantees that business violations
 * are formatted according to established system standards.
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (
    err &&
    typeof err === 'object' &&
    'isAppError' in err &&
    'status' in err &&
    'response' in err
  ) {
    return res.status(err.status as number).json(err.response);
  }

  console.error('Unhandled Server Error:', err);

  const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

  res.status(500).json({
    type: 'Error',
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    message: 'An unexpected error occurred on the server.',
    parameters: {
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    },
  });
}
