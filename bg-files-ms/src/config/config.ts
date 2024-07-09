import dotenv from 'dotenv';

dotenv.config();

export const DEVELOPMENT = process.env.NODE_ENV === 'development';
export const TEST = process.env.NODE_ENV === 'test';

export const SERVER_HOST = process.env.SERVER_HOST || 'localhost'
export const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3001;

export const RABBITMQ = {
    RABBITMQ_HOST: process.env.RABBITMQ_HOST || 'localhost',
    RABBITMQ_PORT: process.env.RABBITMQ_PORT ? Number(process.env.RABBITMQ_PORT) : 5672,
    RABBITMQ_PORT_HTTP: process.env.RABBITMQ_PORT_HTTP ? Number(process.env.RABBITMQ_PORT_HTTP) : 15672,
    RABBITMQ_EXCHANGE: process.env.RABBITMQ_EXCHANGE || 'filesExchange',
}
export const SERVER = {
    SERVER_HOST,
    SERVER_PORT,
    RABBITMQ
}