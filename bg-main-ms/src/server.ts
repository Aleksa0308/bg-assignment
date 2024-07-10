import http from 'http';
import express from 'express';
import './config/logging';
import { loggingHandler } from './middleware/loggingHandler';
import { corsHandler } from './middleware/corsHandler';
import { routeNotFound } from './middleware/routeNotFound';
import filesRouter from './routes/files';
import { SERVER } from './config/config';
import { errorHandler } from './middleware/errorHandler';
export const app = express();
export let httpServer: ReturnType<typeof http.createServer>;

export function StartServer() {
    logging.info('-------------------------------------');
    logging.info('Server - Starting');
    logging.info('-------------------------------------');
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    logging.info('-------------------------------------');
    logging.info('Logging & Configuration');
    logging.info('-------------------------------------');
    app.use(loggingHandler);
    app.use(corsHandler);

    logging.log('----------------------------------------');
    logging.log('Define Controller Routing');
    logging.log('----------------------------------------');
    app.get('/main/healthcheck', (req, res, next) => {
        return res.status(200).json({ hello: 'world!' });
    });

    logging.log('----------------------------------------');
    logging.log('Define Routing Error');
    logging.log('----------------------------------------');
    app.use('/api', filesRouter);
    app.use(routeNotFound);

    app.use(errorHandler);
    logging.log('----------------------------------------');
    logging.log('Starting Server');
    logging.log('----------------------------------------');
    httpServer = http.createServer(app);
    httpServer.listen(SERVER.SERVER_PORT, () => {
        logging.log('----------------------------------------');
        logging.log(`Server started on ${SERVER.SERVER_HOST}:${SERVER.SERVER_PORT}`);
        logging.log('----------------------------------------');
    });
}

export const Shutdown = (callback: any) => httpServer && httpServer.close(callback);

StartServer();
