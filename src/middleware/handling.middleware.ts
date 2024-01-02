import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../utils/http-status.utils';

export const GlobalErrorMiddleware = (error: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = error.statusCode ?? HttpStatus.BAD_REQUEST;
    const message = error.message || 'Unknown error';
    const errors = error.error || undefined;

    const responseObj = {
        statusCode: status,
        message: message,
    };

    if (Array.isArray(errors)) {
        responseObj['errors'] = errors;
    } else {
        responseObj['error'] = errors;
    }

    res.status(status).json(responseObj);
};

