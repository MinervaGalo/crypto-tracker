import { Request, Response, NextFunction } from 'express';

// Централизованная обработка ошибок Express
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Server error:', error.message);

  res.status(500).json({
    error: 'Internal server error'
  });
}