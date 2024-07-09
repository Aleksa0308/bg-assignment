import amqp from 'amqplib';
import { RABBITMQ } from '../config/config';
import logging from '../config/logging';

class RabbitMQService {
    private connection!: amqp.Connection;
    private channel!: amqp.Channel;
    private requestQueue: string = 'fileQueue';

    async initialize() {
        this.connection = await amqp.connect(`amqp://${RABBITMQ.RABBITMQ_HOST}`);
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue(this.requestQueue, { durable: true });
    }

    async consumeMessage() {
        await this.channel.prefetch(1);

        await this.channel.consume(this.requestQueue, (message) => {
            if (message) {
                const content = message.content.toString();
                const data = JSON.parse(content);
                logging.info(`Received message: ${JSON.stringify(data)}`);

                const replyQueue = message.properties.replyTo;
                this.channel.sendToQueue(replyQueue,
                    Buffer.from(JSON.stringify({ hello: "world" })), {
                        correlationId: message.properties.correlationId
                    });
                this.channel.ack(message);

                logging.info(`Sent message reply to ${replyQueue}`);
            }
        });
    }
}

export default new RabbitMQService();
