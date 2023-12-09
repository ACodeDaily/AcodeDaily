import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { NODE_ENV } from '@config';
import { logger } from '@utils/logger';

export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';
    const stack: string | undefined = error.stack;

    const logMessage = `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}${stack ? `, Stack:: ${stack}` : ''}`;
    logger.error(logMessage);

    const response = {
      status: 'fail',
      message,
      ...(stack && NODE_ENV === 'development' && { stack }), // Add stack to the response only if it's present and environment is development
    };

    res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};
