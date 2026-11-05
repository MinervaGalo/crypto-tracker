import { Request, Response, NextFunction } from 'express';

export function apiKeyAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  
  const apiKey = process.env.API_ACCESS_KEY;
  const authHeader = req.headers.authorization;

  if (!apiKey) {
    res.status(500).json({ error: 'API key is not configured' });
    return;
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization required' });
    return;
  }

  const providedKey = authHeader.slice(7).trim();

  if (providedKey !== apiKey) {
    res.status(401).json({ error: 'Invalid API key' });
    return;
  }

  next();
}