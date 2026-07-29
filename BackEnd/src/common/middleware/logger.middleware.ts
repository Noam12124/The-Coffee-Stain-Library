import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body } = req;
    
    const id = body?.id;
    const username = body?.username;
    
    const startTime = Date.now();
    const timestamp = new Date().toISOString(); 

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;

      this.logger.log(
        `[${timestamp}] | User ID: ${id ?? 'Unknown'} | Username: ${username ?? 'Unknown'} | ${method} ${originalUrl} -> Status: ${statusCode} (${duration}ms)`
      );
    });

    next();
  }
}