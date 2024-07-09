import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/customError';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({ error: err.message });
    }

    logging.error(err.message); // Log the unknown error for debugging purposes
    res.status(500).send({ error: 'Something went wrong' });
};