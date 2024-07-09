import amqp from 'amqplib';
import { RABBITMQ } from '../config/config';
import logging from '../config/logging';
import { Response } from 'express';

class RabbitMQService {
    private connection!: amqp.Connection;
    private channel!: amqp.Channel;
    private requestQueue: string = 'fileQueue';
    private replyQueue: string = '';

    async connect() {
        this.connection = await amqp.connect(`amqp://${RABBITMQ.RABBITMQ_HOST}`);
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue(this.requestQueue, { durable: true });
        const q = await this.channel.assertQueue('', { exclusive: true });
        this.replyQueue = q.queue;
    }

    async sendToQueue(correlationId: string, message: string) {
        if (!this.channel) await this.connect();

        this.channel.sendToQueue(this.requestQueue,
            Buffer.from(JSON.stringify({ message })), {
                persistent: true,
                correlationId: correlationId,
                replyTo: this.replyQueue
            });

        logging.info(`The message ${message} has been sent to the queue ${this.requestQueue}`);
    }

    async handleReply(correlationId: string, res: Response) {
        if (!this.channel) await this.connect();

        await this.channel.consume(this.replyQueue, (message) => {
            if (message?.properties.correlationId === correlationId) {
                logging.info(`The message ${message} has been received from the queue ${this.replyQueue}`);
                res.status(200).json(JSON.parse(message.content.toString()));
            }
        }, { noAck: true });
    }
}

export default new RabbitMQService();
