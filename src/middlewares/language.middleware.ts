import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const language = req.headers['accept-language'];
    if (!language || !language.includes('en')) {
      return res
        .status(403)
        .json({ message: 'Access restricted to English speakers only.' });
    }
    next();
  }
}
