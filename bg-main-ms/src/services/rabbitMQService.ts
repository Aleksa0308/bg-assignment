import amqp from 'amqplib';
import { RABBITMQ } from '../config/config';
import logging from '../config/logging';
import { Response } from 'express';

class RabbitMQService {
    private connection!: amqp.Connection;
    private channel!: amqp.Channel;
    private requestQueue: string = 'fileQueue';
    private replyQueue: string = '';
    private pendingReplies: Map<string, (message: any) => void> = new Map();

    async connect() {
        if (!this.connection) {
            this.connection = await amqp.connect(`amqp://${RABBITMQ.RABBITMQ_HOST}`);
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue(this.requestQueue, { durable: true });
            const q = await this.channel.assertQueue('', { exclusive: true });
            this.replyQueue = q.queue;

            await this.channel.consume(this.replyQueue, (msg) => {
                if (msg) {
                    const correlationId = msg.properties.correlationId;
                    const message = JSON.parse(msg.content.toString());

                    if (this.pendingReplies.has(correlationId)) {
                        const resolve = this.pendingReplies.get(correlationId);
                        if (resolve) {
                            resolve(message);
                        }
                        this.pendingReplies.delete(correlationId);
                        this.channel.ack(msg);
                    }
                }
            }, {noAck: false});
        }
    }

    async sendToQueue(correlationId: string, message: string) {
        await this.connect();

        this.channel.sendToQueue(this.requestQueue,
            Buffer.from(JSON.stringify({ message })), {
                persistent: true,
                correlationId: correlationId,
                replyTo: this.replyQueue
            });

        logging.info(`The message ${message} has been sent to the queue ${this.requestQueue}`);
    }

    handleReply(correlationId: string, res: Response) {
        return new Promise((resolve) => {
            this.pendingReplies.set(correlationId, (message) => {
                logging.info(`The message ${message} has been received from the queue ${this.replyQueue}`);
                res.status(200).json(message);
                resolve(message);
            });
        });
    }
}

export default new RabbitMQService();
